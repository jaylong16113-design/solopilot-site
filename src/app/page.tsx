import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";

const channels = [
  { key: "tool", icon: "✦", title: "AI 工具站", copy: "跨境电商 AI 工具评测、对比与实操清单", count: "37", tone: "from-primary/25" },
  { key: "wear", icon: "◌", title: "穿搭站", copy: "男士西装配搭指南，建立可复制的形象系统", count: "36", tone: "from-violet/25" },
  { key: "ops", icon: "⌁", title: "运营站", copy: "一人公司运营 SOP、增长实验与零成本路径", count: "36", tone: "from-accent/25" },
  { key: "mood", icon: "◍", title: "情绪短视频", copy: "情绪钩子、AI 工具链与爆款短视频拆解", count: "10", tone: "from-warning/25" },
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
    return { articles: 114, pages: 240, tool: 37, wear: 36, ops: 36, mood: 5 };
  }
}

const metrics = [
  ["119", "文章"],
  ["250", "静态页面"],
  ["4", "独立站点"],
  ["10", "情绪专题"],
];

export default function HomePage() {
  const stats = getStats();

  return (
    <main className="min-h-screen overflow-hidden" style={{background: "var(--gradient-hero)"}}>
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 opacity-30"
           style={{backgroundImage: "radial-gradient(circle, hsl(var(--line)/0.32) 1px, transparent 1px)", backgroundSize: "34px 34px"}} />
      <div className="pointer-events-none fixed left-[12%] top-[20%] size-64 rounded-full blur-3xl animate-breathe"
           style={{background: "hsl(var(--primary)/0.1)"}} />
      <div className="pointer-events-none fixed right-[8%] top-[18%] size-72 rounded-full blur-3xl animate-breathe"
           style={{background: "hsl(var(--accent)/0.1)"}} />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-32"
           style={{background: "linear-gradient(to bottom, hsl(var(--primary)/0.1), transparent)"}} />
      <div className="pointer-events-none fixed left-0 top-0 h-full w-full overflow-hidden">
        <div className="absolute left-0 right-0 top-0 h-1/3 animate-scan"
             style={{background: "linear-gradient(to bottom, transparent, hsl(var(--primary)/0.1), transparent)"}} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-6 md:px-10">
        {/* Header */}
        <nav className="flex items-center justify-between border-b pb-5" style={{borderColor: "hsl(var(--border)/0.7)"}}>
          <Link href="/" className="group flex items-center gap-3 font-display text-lg font-bold no-underline">
            <span className="grid size-10 place-items-center rounded-full text-primary-foreground shadow-glow transition-transform group-hover:rotate-12 group-hover:scale-110"
                  style={{background: "var(--gradient-claw)"}}>✦</span>
            AgentClaw
          </Link>
          <div className="hidden items-center gap-7 text-sm md:flex" style={{color: "hsl(var(--muted-foreground))"}}>
            {channels.map(item => (
              <Link key={item.key} href={`/${item.key}`} className="transition-colors no-underline hover:text-primary">{item.title}</Link>
            ))}
          </div>
          <Link href="#matrix"
                className="rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur transition-colors no-underline"
                style={{borderColor: "hsl(var(--primary)/0.5)", background: "hsl(var(--primary)/0.1)", color: "hsl(var(--primary))"}}>
            探索矩阵
          </Link>
        </nav>

        {/* Hero */}
        <div className="grid items-center gap-12 pb-16 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur"
                 style={{borderColor: "hsl(var(--primary)/0.3)", background: "hsl(var(--primary)/0.1)", color: "hsl(var(--primary))"}}>
              <span className="size-2 animate-pulse rounded-full" style={{background: "hsl(var(--primary))"}} /> 在线运行中 · {stats.pages} pages indexed
            </div>
            <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] md:text-7xl lg:text-8xl">
              AI 内容星云，自动生长。
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 md:text-xl" style={{color: "hsl(var(--muted-foreground))"}}>
              从工具、穿搭、运营到情绪短视频，四个独立内容站组成一套低成本、一人可控、持续扩张的 AI 增长系统。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#matrix"
                    className="rounded-full px-6 py-3 font-semibold shadow-glow transition-transform hover:-translate-y-1 no-underline"
                    style={{background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))"}}>
                进入内容矩阵
              </Link>
              <Link href="/tool"
                    className="rounded-full border px-6 py-3 font-semibold backdrop-blur transition-colors no-underline"
                    style={{borderColor: "hsl(var(--border))", background: "hsl(var(--secondary)/0.7)", color: "hsl(var(--foreground))"}}>
                查看 AI 工具站
              </Link>
            </div>
          </div>

          {/* Control Panel */}
          <div className="relative animate-float lg:justify-self-end">
            <div className="absolute -inset-6 blur-3xl" style={{background: "hsl(var(--primary)/0.1)"}} />
            <div className="relative rounded-[2rem] border p-5 shadow-panel backdrop-blur-xl"
                 style={{borderColor: "hsl(var(--border)/0.8)", background: "var(--gradient-panel)"}}>
              <div className="mb-5 flex items-center justify-between border-b pb-4 text-xs"
                   style={{borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))"}}>
                <span>AGENTCLAW / CONTROL NODE</span>
                <span style={{color: "hsl(var(--primary))"}}>ACTIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  [String(stats.articles), "文章"],
                  [String(stats.pages), "静态页面"],
                  ["4", "独立站点"],
                  [String(stats.mood), "情绪专题"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-3xl border p-5 backdrop-blur"
                       style={{borderColor: "hsl(var(--border)/0.8)", background: "hsl(var(--surface)/0.7)"}}>
                    <div className="font-display text-4xl font-bold" style={{color: "hsl(var(--primary))"}}>{value}</div>
                    <div className="mt-1 text-sm" style={{color: "hsl(var(--muted-foreground))"}}>{label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3 rounded-3xl border p-5 backdrop-blur"
                   style={{borderColor: "hsl(var(--border)/0.8)", background: "hsl(var(--background)/0.6)"}}>
                {channels.map((item, index) => (
                  <div key={item.key} className="flex items-center gap-3">
                    <span style={{color: "hsl(var(--primary))"}}>0{index + 1}</span>
                    <div className="h-px flex-1" style={{background: "hsl(var(--border))"}}>
                      <div className="h-px w-2/3 animate-pulse-line" style={{background: "hsl(var(--primary))"}} />
                    </div>
                    <span className="text-sm" style={{color: "hsl(var(--muted-foreground))"}}>{item.count} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matrix Section */}
      <section id="matrix" className="border-t px-5 py-20 md:px-10"
               style={{borderColor: "hsl(var(--border))", background: "hsl(var(--background))"}}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em]" style={{color: "hsl(var(--primary))"}}>
                Content Matrix
              </p>
              <h2 className="font-display text-4xl font-bold md:text-6xl">四个站点，一套增长引擎</h2>
            </div>
            <p className="max-w-xl" style={{color: "hsl(var(--muted-foreground))"}}>
              每个内容站都是独立入口，也共同服务于一人公司的获客、信任、转化与复利沉淀。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {channels.map((item) => (
              <Link key={item.key} href={`/${item.key}`}
                    className="group relative min-h-72 overflow-hidden rounded-[2rem] border p-6 shadow-panel backdrop-blur-xl transition-transform hover:-translate-y-2 no-underline"
                    style={{borderColor: "hsl(var(--border))", background: "var(--gradient-panel)"}}>
                <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${item.tone} to-transparent`} />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-10 grid size-16 place-items-center rounded-full text-2xl shadow-glow transition-transform group-hover:scale-110"
                       style={{background: "hsl(var(--secondary))", color: "hsl(var(--primary))"}}>
                    {item.icon}
                  </div>
                  <h3 className="font-display text-2xl font-bold">{item.title}</h3>
                  <p className="mt-4 flex-1 leading-7" style={{color: "hsl(var(--muted-foreground))"}}>{item.copy}</p>
                  <div className="mt-8 flex items-center justify-between border-t pt-4 text-sm"
                       style={{borderColor: "hsl(var(--border))"}}>
                    <span style={{color: "hsl(var(--primary))"}}>浏览 {item.count} 篇文章</span>
                    <span className="transition-transform group-hover:translate-x-1" style={{color: "hsl(var(--primary))"}}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-5 py-12 md:px-10"
              style={{borderColor: "hsl(var(--border)/0.5)", background: "hsl(var(--background))"}}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm" style={{color: "hsl(var(--muted-foreground))"}}>
            <span>© 2026 AgentClaw</span>
            <div className="flex flex-wrap gap-6">
              {channels.map(item => (
                <Link key={item.key} href={`/${item.key}`} className="transition-colors no-underline hover:text-primary">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
