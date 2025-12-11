import { authenticatedRequest } from '@/supabase/dal';
import { statusSchema } from '@/app/(protected)/statuses/_types';
import { NextRequest, NextResponse } from 'next/server';

// GET - 一覧取得
export async function GET() {
  try {
    const data = await authenticatedRequest('/statuses');
    const statuses = statusSchema.array().parse(data);
    return NextResponse.json(statuses);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}

// POST - 作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await authenticatedRequest('/statuses', {
      method: 'POST',
      body: JSON.stringify({ status: body }),
    });
    const status = statusSchema.parse(data);
    return NextResponse.json(status);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
