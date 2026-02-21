import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { Home, Warehouse, Building2, Wrench, ArrowRight, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteImagesMap } from "@/hooks/useSiteImages";
import { cn } from "@/lib/utils";

const SERVICE_KEYS = ["service-villa", "service-farm", "service-commercial", "service-renovation"] as const;

const serviceConfig = [
  {
    id: "villa",
    usageKey: "service-villa" as const,
    icon: Home,
    title: "輕鋼構別墅/住宅",
    subtitle: "打造您夢想中的永久家園",
    description: "從現代極簡到溫馨鄉村風格，輕鋼構別墅以精準工藝實現您對家的所有想像。耐震、節能、快速完工，讓美好生活提早開始。",
    color: "from-blue-500 to-cyan-600",
    features: ["耐震安全結構", "節能隔熱系統", "60天快速完工", "客製化設計"],
    route: "/services/villa",
  },
  {
    id: "farm",
    usageKey: "service-farm" as const,
    icon: Warehouse,
    title: "輕鋼構農舍/資材室",
    subtitle: "田園生活的理想選擇",
    description: "結合實用功能與美學設計，為您的農地打造符合法規、堅固耐用的農舍或資材室。快速興建，早日享受田園樂趣。",
    color: "from-green-500 to-emerald-600",
    features: ["符合農舍法規", "大跨度空間", "防潮防蟲設計", "低維護成本"],
    route: "/services/farm",
  },
  {
    id: "commercial",
    usageKey: "service-commercial" as const,
    icon: Building2,
    title: "商業空間/民宿",
    subtitle: "創造吸睛的商業價值",
    description: "獨特的建築外觀是最好的品牌行銷。輕鋼構商業空間與民宿，以快速工期搶占市場先機，創造持續的投資回報。",
    color: "from-violet-500 to-purple-600",
    features: ["特色外觀設計", "快速開業營運", "靈活空間規劃", "高投資回報"],
    route: "/services/commercial",
  },
  {
    id: "renovation",
    usageKey: "service-renovation" as const,
    icon: Wrench,
    title: "舊屋增建/翻新",
    subtitle: "讓老房子重獲新生",
    description: "海砂屋、老舊危樓不必擔心。輕鋼構增建技術讓舊屋華麗轉身，以最短時間、最低干擾完成居住空間的升級改造。",
    color: "from-orange-500 to-amber-600",
    features: ["結構安全評估", "快速乾式施工", "降低生活干擾", "現代化升級"],
    route: "/services/renovation",
  },
];


const Services = () => {
  const imageMap = useSiteImagesMap([...SERVICE_KEYS]);
  const services = serviceConfig.map((s) => ({ ...s, image: imageMap[s.usageKey] || '' }));

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
              服務項目
            </h1>
            <p className="text-lg text-primary font-medium mb-3">
              四大專業領域，全方位滿足您的建築需求
            </p>
            <p className="text-muted-foreground leading-relaxed">
              無論您是想打造夢想住宅、經營民宿事業，還是需要農舍資材室或舊屋翻新，
              築安心的輕鋼構專業團隊都能為您提供最適切的解決方案。
            </p>
          </div>

          {/* 服務卡片 */}
          <div className="px-6 md:px-12 pb-16">
            <div className="max-w-7xl mx-auto space-y-8">
              {services.map((service, index) => (
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
                        <service.icon className="w-20 h-20 text-white/80 drop-shadow-lg" />
                      </div>
                    </div>

                    {/* 內容區域 */}
                    <div className="lg:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                      <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white mb-4 w-fit bg-gradient-to-r", service.color)}>
                        <service.icon className="w-4 h-4" />
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
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 立即估價 CTA */}
            <div className="max-w-4xl mx-auto mt-16 text-center">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-primary/20">
                <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  想知道您的專案預算？
                </h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  使用我們的線上估價工具，快速獲得專案預算範圍。簡單幾步，即可掌握投資概況。
                </p>
                <Button asChild size="lg" className="gap-2">
                  <Link to="/estimate">
                    <Calculator className="w-5 h-5" />
                    立即估價
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
