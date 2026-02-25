import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteImagesMap } from "@/hooks/useSiteImages";
import { cn } from "@/lib/utils";
import contentData from "@/data/content.json";

const { services: servicesData } = contentData;


const Services = () => {
  const imageMap = useSiteImagesMap(servicesData.items.map(s => s.usageKey));
  const services = servicesData.items.map((s) => ({ ...s, image: imageMap[s.usageKey] || '' }));

  return (
    <>
      <Helmet>
        <title>服務項目 | 築安心 - 輕鋼構建築專家</title>
        <meta name="description" content="築安心提供輕鋼構別墅、農舍、商業空間、舊屋翻新等四大服務項目，滿足您各種建築需求。" />
      </Helmet>
      <MainLayout>
        <div className="min-h-screen bg-background">
          {/* 頁面標題 */}
          <div className="py-12 px-6 md:px-12 text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {servicesData.hero.title}
            </h1>
            <p className="text-lg text-primary font-medium mb-3">
              {servicesData.hero.subtitle}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {servicesData.hero.description}
            </p>
          </div>

          {/* 服務卡片 */}
          <div className="px-6 md:px-12 pb-16">
            <div className="max-w-7xl mx-auto space-y-8">
              {services.map((service, index) => {
                const Icon = Icons[service.icon as keyof typeof Icons] as any;
                return (
                  <Link
                    key={service.id}
                    to={service.route}
                    className={cn(
                      "group block relative bg-card rounded-2xl overflow-hidden shadow-lg",
                      "transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                    )}
                  >
                    <div className={cn(
                      "flex flex-col lg:flex-row",
                      index % 2 === 1 && "lg:flex-row-reverse"
                    )}>
                      {/* 圖片區域 */}
                      <div className="relative lg:w-1/2 h-64 lg:h-auto min-h-[300px] overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r opacity-60",
                          service.color
                        )} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          {Icon && <Icon className="w-20 h-20 text-white/80 drop-shadow-lg" />}
                        </div>
                      </div>

                      {/* 內容區域 */}
                      <div className="lg:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                        <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white mb-4 w-fit bg-gradient-to-r", service.color)}>
                          {Icon && <Icon className="w-4 h-4" />}
                          服務項目
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {service.title}
                        </h2>
                        <p className="text-primary font-medium mb-4">
                          {service.subtitle}
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {service.description}
                        </p>

                        {/* 特色標籤 */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {service.features.map((feature) => (
                            <span
                              key={feature}
                              className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all">
                          了解更多
                          {Icons.ArrowRight && <Icons.ArrowRight className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* 立即估價 CTA */}
            <div className="max-w-4xl mx-auto mt-16 text-center">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-primary/20">
                {Icons.Calculator && <Icons.Calculator className="w-12 h-12 text-primary mx-auto mb-4" />}
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {servicesData.cta.title}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  {servicesData.cta.description}
                </p>
                <Button asChild size="lg" className="gap-2">
                  <Link to={servicesData.cta.route}>
                    {Icons.Calculator && <Icons.Calculator className="w-5 h-5" />}
                    {servicesData.cta.button}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Services;
