import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getFilePath = () => {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'missing-reports.json');
};

const readData = () => {
  const filePath = getFilePath();
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    return [];
  }
};

const writeData = (data: any) => {
  const filePath = getFilePath();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, ageGroup, sector, phone, type } = body;
    if (!name || !phone) {
      return NextResponse.json({ error: 'Missing name or phone number' }, { status: 400 });
    }
    const reports = readData();
    const newReport = {
      id: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
      name,
      ageGroup,
      sector,
      phone,
      type, // 'missing' or 'found'
      createdAt: new Date().toISOString()
    };
    reports.unshift(newReport);
    writeData(reports);
    return NextResponse.json(newReport);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
  }
}
