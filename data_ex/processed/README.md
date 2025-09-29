# Chamber Delivery Seed Data

이 폴더는 `scripts/convert-chamber-deliveries.js` 스크립트가 생성한 정규화 CSV들을 보관합니다. 원본은 `data_ex/목록_납품실적_대형챔버시스템(유니태크 주식회사)_241023.xlsx` 엑셀 파일이며, 다음 명령으로 언제든 다시 재생성할 수 있습니다.

```bash
node scripts/convert-chamber-deliveries.js
```

## 생성되는 파일 요약

| 파일 | 설명 | 주요 컬럼 |
| --- | --- | --- |
| `accounts_seed.csv` | 거래처 초기 데이터 | `account_code`, `account_name`, `account_alias`, `region` |
| `sites_seed.csv` | 납품지 정보 (거래처별 다중 가능) | `site_code`, `account_code`, `site_name`, `address` |
| `product_templates_seed.csv` | 모델 번호 기준 제품 템플릿 | `template_code`(=Model No.), `template_name`, `category`, `base_specifications` |
| `deliveries_seed.csv` | 납품 이력(장비 시리얼 포함) | `delivery_code`, `account_code`, `site_code`, `template_code`, `serial_no`, `delivered_on` |

> `account_code` / `site_code` / `template_code` 값은 이후 UUID 키를 생성할 때 일관된 키-값 매핑을 만들기 위한 레퍼런스 코드입니다.

## 데이터 개수 (2024-10-23 엑셀 기준)

- 거래처(`accounts_seed.csv`): **33개**
- 납품지(`sites_seed.csv`): **47개**
- 제품 템플릿(`product_templates_seed.csv`): **10종**
- 납품 이력(`deliveries_seed.csv`): **52건**

## Supabase / PostgreSQL에 넣는 방법 예시

1. CSV 그대로 `
\copy` (또는 Supabase `COPY`)로 임시 테이블에 적재합니다.
2. 코드 컬럼을 기준으로 UUID를 생성하거나, `accounts`, `sites`, `product_templates`, `deliveries` 순서로 INSERT 하면서 매핑 테이블을 만들어 FK를 연결합니다.
3. 이미 존재하는 데이터와 중복되지 않도록 `ON CONFLICT DO NOTHING` 패턴을 활용하거나, 코드 기준으로 `UPDATE`/`INSERT` 분기 로직을 작성합니다.

```sql
-- 예시: account 코드 기준으로 accounts 테이블 채우기
INSERT INTO accounts (account_id, name, type, region)
SELECT gen_random_uuid(), account_name, 'customer', region
FROM staging_accounts
ON CONFLICT (name) DO NOTHING;
```

> 실제 INSERT 스크립트를 작성할 때는 `account_code`, `site_code`, `template_code`를 키로 사용해서 FK 매핑 테이블을 만든 뒤 `deliveries` 테이블에 넣어야 합니다.

## 검증 체크리스트

- Excel 1행 제목/2행 헤더를 건너뛰고 데이터만 추출했습니다.
- 날짜(납품일)는 Excel serial 값을 ISO `YYYY-MM-DD` 형식으로 변환했습니다.
- 모델 번호(`Model No.`) 기준으로 제품 템플릿을 dedupe 했고, 규격/챔버수를 JSON 사양에 포함했습니다.
- `notes` 컬럼에 엑셀 비고를 그대로 보존하여 향후 장비 상태 분류에 활용할 수 있습니다.

필요에 따라 스크립트를 수정해서 추가 컬럼을 파생시키거나, SQL seed 파일을 자동 생성하도록 확장할 수 있습니다.
