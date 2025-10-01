import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const CSV_DIR = path.join(process.cwd(), 'data_ex', 'processed');

// CSV 파일 목록 조회
export async function httpGetCsvList(req, res) {
  try {
    const files = fs.readdirSync(CSV_DIR)
      .filter(file => file.endsWith('.csv'))
      .map(file => ({
        filename: file,
        name: file.replace('_seed.csv', '').replace(/_/g, ' '),
        path: `/api/csv/data/${file}`
      }));

    res.status(200).json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('CSV list error:', error);
    res.status(500).json({ error: 'Failed to list CSV files' });
  }
}

// CSV 파일 데이터 조회
export async function httpGetCsvData(req, res) {
  try {
    const { filename } = req.params;

    // 경로 traversal 방지
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(CSV_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'CSV file not found' });
    }

    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    // 컬럼 정보 추출
    const columns = records.length > 0 ? Object.keys(records[0]) : [];

    res.status(200).json({
      success: true,
      data: {
        filename,
        columns,
        records,
        count: records.length
      }
    });
  } catch (error) {
    console.error('CSV data error:', error);
    res.status(500).json({ error: 'Failed to read CSV file' });
  }
}
