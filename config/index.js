// 회사 설정 정보 로더
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 회사 정보 로드
 * @returns {Object} 회사 정보 객체
 */
export function loadCompanyInfo() {
  try {
    const companyPath = path.join(__dirname, 'company.json');
    const companyData = fs.readFileSync(companyPath, 'utf8');
    return JSON.parse(companyData);
  } catch (error) {
    console.error('회사 정보 로드 실패:', error);
    return {
      company: {
        name: { ko: '유니태크(주)', en: 'UNITECH Co., Ltd.' },
        portal: { name: 'UNITECH PORTAL', version: '1.0.0' }
      }
    };
  }
}

/**
 * 환경별 API URL 가져오기
 * @returns {string} API 베이스 URL
 */
export function getApiBaseUrl() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://total-admin.onrender.com';
  }
  return process.env.API_BASE_URL || 'http://localhost:3001';
}

/**
 * 회사 정보 기본 내보내기
 */
export const company = loadCompanyInfo().company;

export default {
  company,
  loadCompanyInfo,
  getApiBaseUrl
};