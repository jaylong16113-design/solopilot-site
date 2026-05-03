import { NextResponse } from 'next/server'
import { PRESETS } from '@/lib/axiom-engine'

export async function GET() {
  return NextResponse.json(PRESETS)
}
