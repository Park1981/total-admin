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
  const rows = [
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob",   email: "bob@example.com"  },
  ]

  // insert 대신 upsert 사용
  const { error } = await supabase
    .from("customers")
    .upsert(rows, { onConflict: "email", ignoreDuplicates: true })

  if (error) console.log("시드 에러:", error.message)
  else console.log("✅ 시드 완료")
}

main()
