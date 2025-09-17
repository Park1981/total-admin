import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_ANON_KEY
if (!url || !key) {
  console.log("⚠️ SUPABASE_URL / SUPABASE_ANON_KEY 환경변수가 필요해요.")
  process.exit(0)
}

const supabase = createClient(url, key)

async function main() {
  console.log("✅ 시드 완료 - 직원 데이터는 마이그레이션에서 이미 추가됨")

  // 추가 시드 데이터가 필요하면 여기서 처리
  // 현재는 마이그레이션에서 모든 샘플 데이터를 추가했으므로 별도 작업 없음
}

main()