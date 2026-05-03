/**
 * AXIOM 社会仿真引擎 — TypeScript 端口
 * 移植自 sim300w.py / engine.py
 * 纯计算，无外部依赖
 */

// ═══ 类型定义 ═══

export interface Person {
  id: number
  age: number
  city: string
  gender: '男' | '女'
  income_band: string
  occupation: string
  interests: string[]
  purchase_power: number
  conformity: number
  sentiment: number
  friends: number[]
  // 运行时状态
  aware?: boolean
  interested?: boolean
  purchased?: boolean
  influence_count?: number
  product_fit?: number
}

export interface Product {
  name: string
  category: string
  price: number
  target_age_min: number
  target_age_max: number
  target_gender: string
  target_income_min: number
  interests_related: string[]
  buzz: number
}

export interface SimParams {
  name: string
  category: string
  price: number
  target_gender: string
  target_income_min: number
  target_age_min: number
  target_age_max: number
  interests: string[]
  buzz: number
  population: number
  seed_users: number
  max_rounds: number
  mode: string
}

export interface SimResult {
  product: string
  population: number
  aware_count: number
  interested_count: number
  purchased_count: number
  revenue: number
  rounds: number
  elapsed_seconds: number
  mode_used: string
  conversion_rate: number
  buyer_profile: {
    avg_age: number
    gender: Record<string, number>
    top_cities: [string, number][]
    income_bands: Record<string, number>
  }
  projections: Record<string, { purchased: number; revenue: number; estimated_seconds: number }>
}

// ═══ 常量 ═══

const CITIES: [string, number][] = [
  ['北京', 2154], ['上海', 2475], ['广州', 1868], ['深圳', 1756],
  ['成都', 2094], ['杭州', 1220], ['武汉', 1374], ['南京', 950],
  ['重庆', 3205], ['苏州', 1275], ['西安', 1295], ['长沙', 1005],
  ['郑州', 1260], ['东莞', 1047], ['青岛', 1007], ['沈阳', 907],
]

const AGE_GROUPS: [string, number, number, number][] = [
  ['18-24', 0.15, 18, 24],
  ['25-30', 0.22, 25, 30],
  ['31-35', 0.20, 31, 35],
  ['36-40', 0.17, 36, 40],
  ['41-45', 0.13, 41, 45],
  ['46-55', 0.10, 46, 55],
  ['55+', 0.03, 56, 70],
]

const INCOME_BANDS: [string, number][] = [
  ['<5K', 0.10], ['5-8K', 0.20], ['8-12K', 0.25], ['12-20K', 0.20],
  ['20-35K', 0.13], ['35-50K', 0.07], ['>50K', 0.05],
]

const INCOME_ORDER = ['<5K', '5-8K', '8-12K', '12-20K', '20-35K', '35-50K', '>50K']

const OCCUPATIONS: [string, number][] = [
  ['白领/职员', 0.25], ['中层管理', 0.15], ['高管/企业家', 0.05],
  ['自由职业', 0.12], ['学生', 0.10], ['蓝领/工人', 0.13],
  ['公务员/事业编', 0.07], ['退休/其他', 0.08], ['专业人士', 0.05],
]

const INTEREST_CATEGORIES = [
  '数码3C', '美妆护肤', '运动健身', '母婴育儿', '家居生活',
  '汽车出行', '美食餐饮', '时尚穿搭', '教育培训', '旅游度假',
  '健康养生', '宠物', '游戏电竞', '财经理财', '影视娱乐',
]

const INCOME_POWER_MAP: Record<string, number> = {
  '<5K': 15, '5-8K': 30, '8-12K': 50, '12-20K': 65,
  '20-35K': 80, '35-50K': 90, '>50K': 98,
}

// ═══ 简易随机数生成器 (替代 Python random.Random) ═══

class SimpleRNG {
  private seed: number

  constructor(seed: number = 42) {
    this.seed = seed % 2147483647
    if (this.seed <= 0) this.seed += 2147483646
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647
    return (this.seed - 1) / 2147483646
  }

  random(): number {
    return this.next()
  }

  randint(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1))
  }

  choice<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)]
  }

  choices<T>(arr: [T, number][]): T {
    const totalWeight = arr.reduce((sum, [, w]) => sum + w, 0)
    let r = this.next() * totalWeight
    for (const [item, weight] of arr) {
      r -= weight
      if (r <= 0) return item
    }
    return arr[arr.length - 1][0]
  }

  sample<T>(arr: T[], k: number): T[] {
    const copy = [...arr]
    const result: T[] = []
    for (let i = 0; i < k && copy.length > 0; i++) {
      const idx = Math.floor(this.next() * copy.length)
      result.push(copy[idx])
      copy.splice(idx, 1)
    }
    return result
  }

  uniform(min: number, max: number): number {
    return min + this.next() * (max - min)
  }
}

// ═══ 第1层: 人群生成 ═══

function generatePerson(personId: number, rng: SimpleRNG): Person {
  const city = rng.choices(CITIES)
  
  const ageGroupIdx = rng.choices(AGE_GROUPS.map(([label,, min, max]) => [label, 0] as [string, number]))
  const ageGroup = AGE_GROUPS.find(([l]) => l === ageGroupIdx) || AGE_GROUPS[0]
  const age = rng.randint(ageGroup[2], ageGroup[3])
  
  const incomeBand = rng.choices(INCOME_BANDS)
  const occupation = rng.choices(OCCUPATIONS)
  
  const numInterests = rng.randint(3, 5)
  const interests = rng.sample(INTEREST_CATEGORIES, numInterests)
  
  const purchasePower = Math.max(0, Math.min(100, 
    (INCOME_POWER_MAP[incomeBand] || 50) + rng.randint(-10, 10)
  ))
  
  const conformity = rng.uniform(0.3, 0.9)
  
  return {
    id: personId,
    age,
    city,
    gender: rng.choice(['男', '女']),
    income_band: incomeBand,
    occupation,
    interests,
    purchase_power: purchasePower,
    conformity: Math.round(conformity * 1000) / 1000,
    sentiment: Math.round(rng.uniform(-0.3, 0.3) * 1000) / 1000,
    friends: [],
  }
}

// ═══ 第2层: 社交网络 ═══

function buildSocialNetwork(people: Person[], avgFriends: number = 50, rng: SimpleRNG): Person[] {
  const n = people.length
  const k = avgFriends % 2 === 0 ? avgFriends : avgFriends + 1
  const half = Math.floor(k / 2)

  for (let i = 0; i < n; i++) {
    const friends = new Set<number>()
    for (let j = 1; j <= half; j++) {
      friends.add((i + j) % n)
      friends.add((i - j + n) % n)
    }

    const friendsList = [...friends]
    for (let fi = 0; fi < friendsList.length; fi++) {
      if (rng.next() < 0.1) {
        let newFriend = rng.randint(0, n - 1)
        while (newFriend === i || friends.has(newFriend)) {
          newFriend = rng.randint(0, n - 1)
        }
        friendsList[fi] = newFriend
      }
    }

    people[i].friends = [...friendsList].sort((a, b) => a - b)
  }

  return people
}

// ═══ 第3层: 匹配度计算 ═══

function calcProductFit(person: Person, product: Product): number {
  let score = 50

  // 年龄匹配
  if (product.target_age_min <= person.age && person.age <= product.target_age_max) {
    score += 15
  } else {
    score -= 15
  }

  // 性别匹配
  if (product.target_gender !== '通用') {
    if (person.gender === product.target_gender) {
      score += 10
    } else {
      score -= 5
    }
  }

  // 收入匹配
  const incIdx = INCOME_ORDER.indexOf(person.income_band)
  if (incIdx >= product.target_income_min) {
    score += 10
  } else {
    score -= 5
  }

  // 兴趣匹配
  const overlap = person.interests.filter(i => product.interests_related.includes(i)).length
  score += overlap * 8

  // 购买力修正
  score += (person.purchase_power - 50) * 0.3

  return Math.max(0, Math.min(100, Math.round(score)))
}

// ═══ 第4层: 影响力传播 ═══

function _runSimulation(
  people: Person[],
  product: Product,
  nInitial: number = 50,
  maxRounds: number = 10,
  rng: SimpleRNG
): SimResult {
  const n = people.length
  const startTime = Date.now()

  // 预热匹配度
  for (const p of people) {
    p.product_fit = calcProductFit(p, product)
    p.aware = false
    p.interested = false
    p.purchased = false
    p.influence_count = 0
  }

  // 选择种子用户
  const sortedIndices = people
    .map((p, i) => ({ i, fit: p.product_fit! }))
    .sort((a, b) => b.fit - a.fit)
    .map(x => x.i)

  const seeds = new Set(sortedIndices.slice(0, nInitial))
  
  // 加入随机种子
  const extraSeeds = rng.sample(
    Array.from({ length: n }, (_, i) => i).filter(i => !seeds.has(i)),
    Math.min(Math.floor(nInitial / 2), n)
  )
  for (const s of extraSeeds) seeds.add(s)

  for (const idx of seeds) {
    people[idx].aware = true
    people[idx].interested = true
  }

  let newlyActivated = [...seeds]
  let roundNum = 0

  while (newlyActivated.length > 0 && roundNum < maxRounds) {
    roundNum++
    const nextWave = new Set<number>()

    for (const activatorIdx of newlyActivated) {
      const activator = people[activatorIdx]

      for (const friendIdx of activator.friends) {
        const friend = people[friendIdx]
        if (friend.aware) continue

        const influenceProb = Math.max(0.01, Math.min(0.8,
          product.buzz *
          (1 - friend.conformity * 0.3) *
          (activator.product_fit! / 100) * 0.5 +
          activator.sentiment * 0.1
        ))

        if (rng.next() < influenceProb) {
          friend.aware = true
          const interestProb = (friend.product_fit! / 100) * 0.6 + 0.2
          if (rng.next() < interestProb) {
            friend.interested = true
          }
          nextWave.add(friendIdx)
          activator.influence_count!++
        }
      }
    }

    newlyActivated = [...nextWave]
  }

  // 购买决策
  for (const p of people) {
    if (p.interested) {
      const buyProb = (p.product_fit! / 100) * (p.purchase_power / 100) * 0.8
      if (rng.next() < buyProb) {
        p.purchased = true
      }
    }
  }

  const elapsed = (Date.now() - startTime) / 1000

  // 统计
  const totalAware = people.filter(p => p.aware).length
  const totalInterested = people.filter(p => p.interested).length
  const totalPurchased = people.filter(p => p.purchased).length

  // 人群画像
  const buyers = people.filter(p => p.purchased)
  const buyerProfile: SimResult['buyer_profile'] = {
    avg_age: 0,
    gender: {},
    top_cities: [],
    income_bands: {},
  }

  if (buyers.length > 0) {
    buyerProfile.avg_age = Math.round(buyers.reduce((sum, p) => sum + p.age, 0) / buyers.length)
    buyerProfile.gender = { 男: 0, 女: 0 }
    for (const b of buyers) {
      buyerProfile.gender[b.gender] = (buyerProfile.gender[b.gender] || 0) + 1
    }
    const cityCount: Record<string, number> = {}
    for (const b of buyers) {
      cityCount[b.city] = (cityCount[b.city] || 0) + 1
    }
    buyerProfile.top_cities = Object.entries(cityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const incomeCount: Record<string, number> = {}
    for (const b of buyers) {
      incomeCount[b.income_band] = (incomeCount[b.income_band] || 0) + 1
    }
    buyerProfile.income_bands = incomeCount
  }

  const revenue = totalPurchased * product.price

  // 规模推演
  const projections: Record<string, { purchased: number; revenue: number; estimated_seconds: number }> = {}
  const baseRate = totalPurchased / Math.max(n, 1)
  const baseTime = elapsed / Math.max(n, 1)

  for (const scale of ['10万', '50万', '100万', '300万', '1000万']) {
    const popSizes: Record<string, number> = { '10万': 100000, '50万': 500000, '100万': 1000000, '300万': 3000000, '1000万': 10000000 }
    const size = popSizes[scale]
    const estPurchased = Math.round(baseRate * size)
    const estTime = baseTime * size * (1 + Math.log2(size / n) * 0.5)
    projections[scale] = {
      purchased: estPurchased,
      revenue: Math.round(estPurchased * product.price),
      estimated_seconds: Math.round(estTime * 10) / 10,
    }
  }

  return {
    product: product.name,
    population: n,
    aware_count: totalAware,
    interested_count: totalInterested,
    purchased_count: totalPurchased,
    revenue,
    rounds: roundNum,
    elapsed_seconds: Math.round(elapsed * 100) / 100,
    mode_used: n <= 50000 ? '全量' : n <= 500000 ? '采样' : '外推',
    conversion_rate: n > 0 ? Math.round((totalPurchased / n) * 10000) / 10000 : 0,
    buyer_profile: buyerProfile,
    projections,
  }
}

// ═══ 主入口 ═══

export function runSimulation(params: SimParams): SimResult {
  const rng = new SimpleRNG(42)
  const popSize = params.population || 10000

  const product: Product = {
    name: params.name || '未命名',
    category: params.category || '时尚穿搭',
    price: params.price || 999,
    target_age_min: params.target_age_min || 18,
    target_age_max: params.target_age_max || 55,
    target_gender: params.target_gender || '通用',
    target_income_min: params.target_income_min || 0,
    interests_related: params.interests || ['时尚穿搭'],
    buzz: params.buzz || 0.7,
  }

  // 生成人群
  const people: Person[] = []
  for (let i = 0; i < popSize; i++) {
    people.push(generatePerson(i, rng))
  }

  // 建社交网络
  const avgFriends = Math.max(10, Math.min(50, Math.round(50 * (1 - Math.log10(popSize / 10000) * 0.3))))
  buildSocialNetwork(people, Math.max(10, avgFriends), rng)

  // 运行模拟
  const nInitial = Math.max(5, Math.floor(popSize / 200))
  const result = _runSimulation(people, product, nInitial, params.max_rounds || 10, rng)

  return result
}

// ═══ 预设场景 ═══

export const PRESETS = [
  { name: '可运动西服', category: '时尚穿搭', price: 999, target_gender: '男', target_income_min: 2, target_age_min: 25, target_age_max: 45, buzz: 0.7, interests: ['时尚穿搭', '运动健身', '数码3C'] },
  { name: '小米SU7', category: '汽车出行', price: 215900, target_gender: '男', target_income_min: 4, target_age_min: 25, target_age_max: 45, buzz: 0.8, interests: ['汽车出行', '数码3C', '财经理财'] },
  { name: '戴森吹风机', category: '美妆护肤', price: 3299, target_gender: '女', target_income_min: 2, target_age_min: 20, target_age_max: 40, buzz: 0.6, interests: ['美妆护肤', '时尚穿搭', '家居生活'] },
  { name: 'iPhone 16 Pro', category: '数码3C', price: 8999, target_gender: '通用', target_income_min: 3, target_age_min: 18, target_age_max: 50, buzz: 0.9, interests: ['数码3C', '游戏电竞', '影视娱乐'] },
  { name: 'Lululemon瑜伽裤', category: '运动健身', price: 950, target_gender: '女', target_income_min: 2, target_age_min: 22, target_age_max: 45, buzz: 0.5, interests: ['运动健身', '时尚穿搭', '旅游度假'] },
  { name: 'Burberry风衣', category: '时尚穿搭', price: 18900, target_gender: '通用', target_income_min: 4, target_age_min: 28, target_age_max: 55, buzz: 0.65, interests: ['时尚穿搭', '旅游度假', '数码3C'] },
  { name: '圣安杰罗双肩包', category: '时尚穿搭', price: 2999, target_gender: '女', target_income_min: 2, target_age_min: 22, target_age_max: 40, buzz: 0.55, interests: ['时尚穿搭', '美妆护肤', '旅游度假'] },
]
