import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import contentData from "@/data/content.json";

const { about } = contentData;

const About = () => {
  return (
    <>
      <Helmet>
        <title>關於築安心 | 輕鋼構建築專家</title>
        <meta name="description" content="築安心專門做輕鋼構住宅，核心價值是安全、質感、快速。我們相信建築不只是遮蔽風雨的構造物，更是承載生活的歸屬。" />
      </Helmet>
      <MainLayout>
        <div className="min-h-screen bg-background">
          {/* Hero Section */}
          <section className="relative py-20 px-6 md:px-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
            <div className="relative max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                {about.hero.titlePrefix}<span className="text-primary">{about.hero.titleHighlight}</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {about.hero.subtitle}
              </p>
            </div>
          </section>

          {/* Core Values */}
          <section className="py-16 px-6 md:px-12">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
                核心價值
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {about.coreValues.map((value, index) => {
                  const Icon = Icons[value.icon as keyof typeof Icons] as any;
                  return (
                    <div
                      key={value.title}
                      className="group relative bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div
                        className={cn(
                          "w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
                          value.color
                        )}
                      >
                        {Icon && <Icon className="w-10 h-10 text-white" />}
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Brand Story */}
          <section className="py-16 px-6 md:px-12 bg-card/50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
                {about.brandStory.title}
              </h2>
              <div className="prose prose-lg max-w-none">
                <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg space-y-6">
                  {about.brandStory.paragraphs.map((para, index) => {
                    if (index === 0) return <p key={index} className="text-lg text-foreground leading-relaxed">{para}</p>;
                    return <p key={index} className="text-muted-foreground leading-relaxed pl-4 border-l-4 border-primary">{para}</p>;
                  })}
                  <p className="text-xl font-medium text-primary text-center py-4">
                    {about.brandStory.highlight}
                  </p>
                  {about.brandStory.outro.map((para, index) => {
                    if (index === 0) return <p key={index} className="text-lg text-foreground leading-relaxed">{para.replace("「築安心」", "")}<span className="font-bold text-primary">「築安心」</span>{para.substring(para.indexOf("「築安心」") + 5)}</p>;
                    return <p key={index} className="text-foreground leading-relaxed">{para}</p>;
                  })}
                  <div className="bg-primary/10 rounded-xl p-6 text-center">
                    {Icons.Home && <Icons.Home className="w-12 h-12 text-primary mx-auto mb-4" />}
                    <p className="text-lg font-medium text-foreground whitespace-pre-line">
                      {about.brandStory.quote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Principles */}
          <section className="py-16 px-6 md:px-12">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
                {about.principles.title}
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                {about.principles.subtitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {about.principles.items.map((principle, index) => {
                  const Icon = Icons[principle.icon as keyof typeof Icons] as any;
                  return (
                    <div
                      key={principle.title}
                      className="flex items-start gap-4 bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                        {Icon && <Icon className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">
                          {principle.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {principle.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default About;
