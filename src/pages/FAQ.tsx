import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import * as Icons from "lucide-react";
import contentData from "@/data/content.json";

const { faq: faqData } = contentData;

export default function FAQ() {
    return (
        <>
            <Helmet>
                <title>{faqData.hero.title} | 築安心 - 輕鋼構建築專家</title>
                <meta name="description" content={faqData.hero.description} />
            </Helmet>
            <MainLayout>
                <div className="min-h-screen bg-background py-16 px-6 md:px-12">
                    {/* Hero */}
                    <div className="text-center mb-16 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            {faqData.hero.title}
                        </h1>
                        <p className="text-xl text-muted-foreground">
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
