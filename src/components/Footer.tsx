"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="site-footer">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">{t("footer_nav")}</h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">{t("nav_home")}</Link></li>
              <li><Link href="/tool" className="hover:text-white transition-colors">{t("nav_tool")}</Link></li>
              <li><Link href="/wear" className="hover:text-white transition-colors">{t("nav_wear")}</Link></li>
              <li><Link href="/ops" className="hover:text-white transition-colors">{t("nav_ops")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">{t("footer_popular")}</h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li><Link href="/tool/free-ai-product-image-tools" className="hover:text-white transition-colors">AI商品図生成</Link></li>
              <li><Link href="/wear/first-suit-guide" className="hover:text-white transition-colors">{t("suit_style")}ガイド</Link></li>
              <li><Link href="/ops/what-is-solo-company" className="hover:text-white transition-colors">一人起業</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">{t("footer_about_title")}</h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li><span className="cursor-default">{t("footer_about")}</span></li>
              <li><span className="cursor-default">{t("footer_desc")}</span></li>
              <li><span className="cursor-default">{t("footer_powered")}</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">{t("footer_stats")}</h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>{t("articles")}: 57</li>
              <li>{t("pages")}: 63</li>
              <li>{t("sites")}: 3</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-xs text-center">
          <p>{t("footer_copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
