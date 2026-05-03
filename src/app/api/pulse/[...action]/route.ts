import { NextRequest, NextResponse } from 'next/server'
import { deepseekJSON } from '@/lib/api-clients'

export async function POST(request: NextRequest, { params }: { params: { action?: string[] } }) {
  const action = params.action || []

  try {
    if (action.length === 1 && action[0] === 'health') {
      return NextResponse.json({ status: 'ok', service: 'PULSE v1' })
    }

    // ── dashboard — summary metrics ──
    if (action.length === 1 && action[0] === 'dashboard') {
      const body = await request.json()
      const platforms: string[] = body.platforms || ['抖音', '小红书', '天猫', '京东']

      const result = await deepseekJSON<{
        date: string
        total_gmv: number
        total_orders: number
        total_visitors: number
        avg_conversion: string
        platforms: { platform: string; gmv: number; orders: number; visitors: number; conversion: string; avg_order_value: number; growth: string }[]
        alerts: string[]
      }>(
        '你是电商运营数据分析专家。请返回纯JSON。',
        `生成本日电商平台运营仪表盘数据。平台: ${platforms.join(', ')}
每个平台需要: GMV(元)、订单数(orders)、访客数(visitors)、转化率(conversion如"3.5%")、客单价(avg_order_value)、增长率(growth如"+12%")
同时计算总和: total_gmv、total_orders、total_visitors
avg_conversion为各平台平均转化率
alerts为增长率小于0的平台预警

返回JSON结构必须严格如下:
{
  "date": "YYYY-MM-DD",
  "total_gmv": 数字,
  "total_orders": 数字,
  "total_visitors": 数字,
  "avg_conversion": "string",
  "platforms": [{ "platform": "string", "gmv": 数字, "orders": 数字, "visitors": 数字, "conversion": "string", "avg_order_value": 数字, "growth": "string" }],
  "alerts": ["string"]
}`
      )

      result.date = new Date().toISOString().split('T')[0]
      return NextResponse.json(result)
    }

    // ── weekly — weekly trend ──
    if (action.length === 1 && action[0] === 'weekly') {
      const result = await deepseekJSON<{
        days: { day: string; gmv: number; orders: number }[]
        total_gmv: number
      }>(
        '你是电商数据分析专家。请返回纯JSON。',
        `生成本周每日电商趋势数据。
days数组包含周一至周日，每天有gmv(元)和orders(订单数)。
total_gmv为所有天数的gmv之和。

返回JSON结构必须严格如下:
{
  "days": [{ "day": "周一", "gmv": 数字, "orders": 数字 }],
  "total_gmv": 数字
}`
      )

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: `Unknown action: /${action.join('/')}` }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Request failed' }, { status: 500 })
  }
}
