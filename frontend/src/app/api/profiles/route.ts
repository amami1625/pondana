import { authenticatedRequest } from '@/supabase/dal';
import { userSchema } from '@/schemas/user';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await authenticatedRequest('/profile');
    const profile = userSchema.parse(data);
    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
