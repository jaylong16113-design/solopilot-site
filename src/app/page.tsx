"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/i18n";

const sites = [
  { key: "tool", emoji: "⚡", color: "from-blue-500 to-cyan-400", bg: "bg-blue-50" },
  { key: "wear", emoji: "👔", color: "from-violet-500 to-purple-400", bg: "bg-violet-50" },
  { key: "ops", emoji: "🚀", color: "from-amber-500 to-orange-400", bg: "bg-amber-50" },
];

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient px-4 py-20 md:py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white/70 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
            {t("hero_badge")}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            {t("hero_title")}
          </h1>
          <p className="text-lg text-white/70 max-w-lg mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: t("hero_desc") }} />
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {sites.map(s => (
              <Link key={s.key} href={`/${s.key}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
                <span>{s.emoji}</span> {t(`site_${s.key}`)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-3 gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          {[
            { n: "57", label: t("articles") },
            { n: "63", label: t("pages") },
            { n: "3", label: t("sites") },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="stat-number">{s.n}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Site Cards */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-4">
          {sites.map((s, i) => (
            <Link key={s.key} href={`/${s.key}`} className="feature-card animate-fade-in-up block no-underline" style={{animationDelay: `${i*0.1}s`} as any}>
              <div className={`card-icon bg-gradient-to-br ${s.color} text-white mb-4`}>
                {s.emoji}
              </div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">{t(`site_${s.key}`)}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{t(`site_${s.key}_desc`)}</p>
              <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                <span>{t("browse_articles", { count: s.key === "tool" ? 19 : (s.key === "wear" ? 18 : 18) })}</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold mb-3">{t("about_title")}</h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-6">{t("about_desc")}</p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
            <span className="tag bg-gray-200 text-gray-600">Next.js</span>
            <span className="tag bg-gray-200 text-gray-600">Vercel</span>
            <span className="tag bg-gray-200 text-gray-600">AI 驱动</span>
            <span className="tag bg-gray-200 text-gray-600">SEO</span>
          </div>
        </div>
      </section>
    </div>
  );
}
