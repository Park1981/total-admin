Param(
  [switch]$CreateDiff = $true
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$PSDefaultParameterValues["Out-File:Encoding"] = "utf8"

Write-Host "=== Pipeline start ==="

# 0) Load .env (only what we need)
#    - Reads SUPABASE_DB_PW to build DB_URL (direct 5432)
#    - Reads API_BASE_URL for optional healthcheck
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envFile = Join-Path $projectRoot ".env"
$pw = $null
$apiBase = $null
if (Test-Path $envFile) {
  foreach ($line in Get-Content $envFile) {
    if ($line -match "^\s*#" -or -not ($line -match "=")) { continue }
    $kv = $line -split "=", 2
    if ($kv.Count -lt 2) { continue }
    $key = $kv[0].Trim()
    $val = $kv[1].Trim()
    if ($key -eq "SUPABASE_DB_PW") { $pw = $val }
    if ($key -eq "API_BASE_URL")    { $apiBase = $val }
  }
}
if ($pw) {
  # build direct DB url (bypass pooler 6543 -> use 5432)
  $env:DB_URL = "postgresql://postgres:$pw@db.tgxmccwadzxjnxxusupw.supabase.co:5432/postgres?sslmode=require"
  Write-Host "INFO: DB_URL set from .env (direct 5432)"
} else {
  Write-Host "INFO: SUPABASE_DB_PW not found in .env (typegen will use --linked)"
}
if ($apiBase) {
  $env:API_BASE_URL = $apiBase
  Write-Host "INFO: API_BASE_URL found in .env"
} else {
  Write-Host "INFO: API_BASE_URL not set (healthcheck will be skipped)"
}

# 1) Optional: generate diff (needs Docker)
if ($CreateDiff) {
  $stamp = Get-Date -Format yyyyMMddHHmmss
  $migFile = "supabase/migrations/${stamp}_auto.sql"
  Write-Host "Step 1: Generating diff -> $migFile"
  npx supabase db diff --linked --schema public --file "$migFile" | Out-Null
} else {
  Write-Host "Step 1: Diff skipped"
}

# 2) Push migrations
Write-Host "Step 2: DB push"
npx supabase db push --linked

# 3) Generate types (prefer direct DB_URL if available)
if (-not [string]::IsNullOrWhiteSpace($env:DB_URL)) {
  Write-Host "Step 3: Type generation (direct)"
  npx supabase gen types typescript --db-url "$env:DB_URL" > src/types/db.ts
} else {
  Write-Host "Step 3: Type generation (linked)"
  npx supabase gen types typescript --linked > src/types/db.ts
}

# 4) Seed
Write-Host "Step 4: Seeding data"
node ./scripts/seed.js

# 5) Healthcheck
if (-not [string]::IsNullOrWhiteSpace($env:API_BASE_URL)) {
  try {
    Write-Host "Step 5: Healthcheck -> $($env:API_BASE_URL)/healthz"
    $response = Invoke-WebRequest -Uri "$($env:API_BASE_URL)/healthz" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
      Write-Host "✅ Healthcheck OK"
    } else {
      Write-Host "⚠️ Healthcheck failed with status: $($response.StatusCode)"
    }
  } catch {
    Write-Host "⚠️ Healthcheck failed: $($_.Exception.Message)"
  }
} else {
  Write-Host "Step 5: Healthcheck skipped (API_BASE_URL not set)"
}

Write-Host "=== Pipeline finished ==="