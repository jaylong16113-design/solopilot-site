import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";

const channels = [
  { key: "tool", icon: "✦", title: "AI 工具站", copy: "跨境电商 AI 工具评测、对比与实操清单", tone: "from-primary/20" },
  { key: "wear", icon: "◌", title: "穿搭站", copy: "男士西装配搭指南，建立可复制的形象系统", tone: "from-accent/20" },
  { key: "ops", icon: "⌁", title: "运营站", copy: "一人公司运营 SOP、增长实验与零成本路径", tone: "from-warning/20" },
  { key: "mood", icon: "◍", title: "情绪短视频", copy: "情绪钩子、AI 工具链与爆款短视频拆解", tone: "from-info/20" },
];

function getStats() {
  try {
    const index = JSON.parse(
      readFileSync(join(process.cwd(), "src/lib/content/zh/index.json"), "utf8")
    );
    const total = (index.tool?.length||0) + (index.wear?.length||0) + (index.ops?.length||0) + (index.mood?.length||0);
    const pages = total * 2 + 10 + 2;
    return { articles: total, pages, tool: index.tool?.length||0, wear: index.wear?.length||0, ops: index.ops?.length||0, mood: index.mood?.length||0 };
  } catch {
    return { articles: 464, pages: 940, tool: 80, wear: 54, ops: 57, mood: 43 };
  }
}

export default function HomePage() {
  const stats = getStats();

  return (
    <main className="min-h-screen overflow-hidden bg-hero-field text-foreground">
      {/* Photon Lattice — 2 glow orbs (not 4) + dot grid */}
      <div className="pointer-events-none fixed inset-0 opacity-25"
           style={{backgroundImage: "radial-gradient(circle, hsl(var(--primary)/0.12) 1px, transparent 1px)", backgroundSize: "34px 34px"}} />
      <div className="pointer-events-none fixed left-[12%] top-[20%] size-72 rounded-full bg-primary/8 blur-3xl animate-breathe" />
      <div className="pointer-events-none fixed right-[8%] top-[18%] size-80 rounded-full bg-accent/8 blur-3xl animate-breathe" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-6 md:px-10">
        {/* Header */}
        <nav className="flex items-center justify-between border-b border-border/70 pb-5">
          <Link href="/" className="group flex items-center gap-3 font-display text-lg font-bold no-underline">
            <span className="grid size-10 place-items-center rounded-full bg-claw text-primary-foreground shadow-glow transition-transform group-hover:rotate-12 group-hover:scale-110">✦</span>
            AgentClaw
          </Link>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {channels.map(item => (
              <Link key={item.key} href={`/${item.key}`} className="transition-colors no-underline hover:text-primary">{item.title}</Link>
            ))}
          </div>
          <Link href="#matrix"
                className="rounded-full border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary backdrop-blur transition-colors no-underline hover:bg-primary hover:text-primary-foreground">
            探索矩阵
          </Link>
        </nav>

        {/* Hero */}
        <div className="grid items-center gap-12 pb-16 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary backdrop-blur">
              <span className="size-2 animate-pulse rounded-full bg-primary" /> 在线运行中 · {stats.pages} pages indexed
            </div>
            <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] md:text-7xl lg:text-8xl">
              AI 内容星云，自动生长。
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              从工具、穿搭、运营到情绪短视频，四个独立内容站组成一套低成本、一人可控、持续扩张的 AI 增长系统。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#matrix"
                    className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-transform no-underline hover:-translate-y-1">
                进入内容矩阵
              </Link>
              <Link href="/tool"
                    className="rounded-full border border-border bg-secondary/70 px-6 py-3 font-semibold backdrop-blur transition-colors no-underline hover:border-primary hover:text-primary">
                查看 AI 工具站
              </Link>
            </div>
          </div>

          {/* Control Node */}
          <div className="relative animate-float lg:justify-self-end">
            <div className="absolute -inset-6 bg-primary/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-border/80 bg-panel p-5 shadow-panel backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between border-b border-border pb-4 text-xs text-muted-foreground">
                <span>AGENTCLAW / CONTROL NODE</span>
                <span className="text-primary">ACTIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  [String(stats.articles), "文章"],
                  [String(stats.pages), "静态页面"],
                  ["4", "独立站点"],
                  [String(stats.mood), "情绪专题"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-3xl border border-border/80 bg-surface/70 p-5 backdrop-blur">
                    <div className="font-mono text-4xl font-bold text-primary">{value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3 rounded-3xl border border-border/80 bg-background/60 p-5 backdrop-blur">
                {channels.map((item, index) => {
                  const counts: Record<string, number> = { tool: stats.tool, wear: stats.wear, ops: stats.ops, mood: stats.mood };
                  return (
                  <div key={item.key} className="flex items-center gap-3">
                    <span className="text-primary">0{index + 1}</span>
                    <div className="h-px flex-1 bg-border"><div className="h-px w-2/3 animate-pulse-line bg-primary" /></div>
                    <span className="text-sm text-muted-foreground">{counts[item.key]} posts</span>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Matrix */}
      <section id="matrix" className="border-t border-border bg-background px-5 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-primary">Content Matrix</p>
              <h2 className="font-display text-4xl font-bold md:text-6xl">四个站点，一套增长引擎</h2>
            </div>
            <p className="max-w-xl text-muted-foreground">
              每个内容站都是独立入口，也共同服务于一人公司的获客、信任、转化与复利沉淀。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {channels.map((item) => {
              const counts: Record<string, number> = { tool: stats.tool, wear: stats.wear, ops: stats.ops, mood: stats.mood };
              return (
              <Link key={item.key} href={`/${item.key}`}
                    className="group relative min-h-72 overflow-hidden rounded-[2rem] border border-border bg-panel p-6 shadow-panel backdrop-blur-xl transition-transform no-underline hover:-translate-y-1 hover:shadow-panel-hover">
                <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${item.tone} to-transparent`} />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-10 grid size-16 place-items-center rounded-full bg-secondary text-2xl text-primary shadow-glow transition-transform group-hover:scale-110">{item.icon}</div>
                  <h3 className="font-display text-2xl font-bold">{item.title}</h3>
                  <p className="mt-4 flex-1 leading-7 text-muted-foreground">{item.copy}</p>
                  <div className="mt-8 flex items-center justify-between border-t border-border pt-4 text-sm">
                    <span className="text-primary">浏览 {counts[item.key]} 篇文章</span>
                    <span className="text-primary transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background px-5 py-12 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>© 2026 AgentClaw</span>
            <div className="flex flex-wrap gap-6">
              {channels.map(item => (
                <Link key={item.key} href={`/${item.key}`} className="transition-colors no-underline hover:text-primary">{item.title}</Link>
              ))}
              <a href="https://github.com/jaylong16113-design/axiom-sim300w" target="_blank" rel="noopener noreferrer" className="transition-colors no-underline hover:text-primary">AXIOM</a>
              <a href="http://172.20.154.252:8001" target="_blank" rel="noopener noreferrer" className="transition-colors no-underline hover:text-primary">FORGE</a>
              <a href="http://172.20.154.252:8002" target="_blank" rel="noopener noreferrer" className="transition-colors no-underline hover:text-primary">BLAZE</a>
              <a href="http://172.20.154.252:8003" target="_blank" rel="noopener noreferrer" className="transition-colors no-underline hover:text-primary">HUNTER</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
