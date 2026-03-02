import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import contentData from "@/data/content.json";
import { useSiteContent } from "@/hooks/useSiteContent";

const Advantages = () => {
  const { data: dynamicContent, isLoading } = useSiteContent('advantages');
  const advantages = (dynamicContent as any)?.content || contentData.advantages;

  return (
    <>
      <Helmet>
        <title>優勢工法 | 築安心 - 輕鋼構建築專家</title>
        <meta name="description" content="築安心五大工法優勢：設計自由、極致耐震、抗風防線、超凡精準、迅捷高效、靈活永續。" />
      </Helmet>
      <MainLayout>
        <div className="min-h-screen bg-background py-8 px-6 md:px-12">
          {/* 頁面標題 */}
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {advantages.hero.title}
            </h1>
            <p className="text-lg text-primary font-medium mb-2">
              {advantages.hero.subtitle}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {advantages.hero.description}
            </p>
          </div>

          {/* 優勢卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {advantages.items.map((item, index) => {
              const Icon = Icons[item.icon as keyof typeof Icons] as any;
              return (
                <div
                  key={item.title}
                  className={cn(
                    "group relative bg-card rounded-2xl overflow-hidden shadow-lg",
                    "transition-all duration-500 hover:shadow-2xl hover:-translate-y-2",
                    ["[animation-delay:0ms]", "[animation-delay:100ms]", "[animation-delay:200ms]", "[animation-delay:300ms]", "[animation-delay:400ms]", "[animation-delay:500ms]"][index] || "[animation-delay:600ms]"
                  )}
                >
                  {/* 頂部漸層條 */}
                  <div className={cn("h-2 bg-gradient-to-r", item.color)} />

                  <div className="p-6 md:p-8">
                    {/* 圖標與標題 */}
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className={cn(
                          "p-3 rounded-xl bg-gradient-to-br shadow-lg",
                          item.color
                        )}
                      >
                        {Icon && <Icon className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">
                          {item.title}
                        </h2>
                        <p className="text-primary font-medium">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* 描述 */}
                    <p className="text-foreground font-medium mb-4">
                      {item.description}
                    </p>

                    {/* 詳細內容 */}
                    <ul className="space-y-3 mb-6">
                      {item.details.map((detail, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed"
                        >
                          <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r flex-shrink-0", item.color)} />
                          {detail}
                        </li>
                      ))}
                    </ul>

                    {/* 效益 */}
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm">
                        <span className="font-bold text-primary">為您帶來：</span>
                        <span className="text-foreground ml-2">{item.benefit}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Advantages;
