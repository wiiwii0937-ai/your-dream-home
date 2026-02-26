import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import * as Icons from "lucide-react";
import contentData from "@/data/content.json";
import { cn } from "@/lib/utils";

const { faq: faqData, knowledgeBase: kbData } = contentData;

export default function FAQ() {
    return (
        <>
            <Helmet>
                <title>{kbData.hero.title} 與 {faqData.hero.title} | 築安心 - 輕鋼構建築專家</title>
                <meta name="description" content={`${kbData.hero.description} ${faqData.hero.description}`} />
            </Helmet>
            <MainLayout>
                <div className="min-h-screen bg-background py-16 px-6 md:px-12">
                    {/* Knowledge Base Hero */}
                    <div className="text-center mb-12 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            {kbData.hero.title}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {kbData.hero.description}
                        </p>
                    </div>

                    {/* Knowledge Base Cards */}
                    <div className="max-w-6xl mx-auto mb-20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {kbData.items.map((article, index) => (
                                <div
                                    key={article.id}
                                    className={cn(
                                        "group flex flex-col overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
                                        ["[animation-delay:0ms]", "[animation-delay:100ms]", "[animation-delay:200ms]"][index % 3] || ""
                                    )}
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 p-6">
                                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                                            <span className="font-medium text-emerald-600 dark:text-emerald-400">{article.date}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-muted-foreground mb-6 line-clamp-3 flex-1 text-sm md:text-base">
                                            {article.description}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-border/50 flex justify-end">
                                            <a
                                                href={article.link || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors text-sm group/btn"
                                                onClick={(e) => {
                                                    if (!article.link || article.link === "#") e.preventDefault();
                                                }}
                                            >
                                                查看更多
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/btn:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Hero */}
                    <div className="text-center mb-12 max-w-4xl mx-auto pt-10 border-t border-border/50">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            {faqData.hero.title}
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            {faqData.hero.description}
                        </p>
                    </div>

                    {/* Categories & QAs */}
                    <div className="max-w-4xl mx-auto space-y-12">
                        {faqData.categories.map((category, idx) => {
                            const Icon = Icons[category.icon as keyof typeof Icons] as any;
                            return (
                                <div key={idx} className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border/50">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            {Icon && <Icon className="w-5 h-5 text-primary" />}
                                        </div>
                                        <h2 className="text-2xl font-bold text-foreground">
                                            {category.title}
                                        </h2>
                                    </div>
                                    <div className="grid gap-4">
                                        {category.questions.map((q, qIdx) => (
                                            <div key={qIdx} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
                                                <h3 className="font-semibold text-lg text-foreground mb-3 flex gap-2">
                                                    <span className="text-primary font-bold">Q:</span>
                                                    {q.q}
                                                </h3>
                                                <p className="text-muted-foreground leading-relaxed flex gap-2">
                                                    <span className="text-muted-foreground font-bold">A:</span>
                                                    {q.a}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div className="max-w-4xl mx-auto mt-20 text-center">
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                                {faqData.cta.title}
                            </h2>
                            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                                {faqData.cta.description}
                            </p>
                            <a
                                href={faqData.cta.route}
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-1"
                            >
                                {faqData.cta.button}
                            </a>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
