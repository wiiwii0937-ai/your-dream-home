import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { 
  Wrench, Shield, Zap, HardHat, Clock, 
  ArrowRight, Calculator, Sparkles,
  AlertTriangle, Target, Home, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatedSection, AnimatedItem } from "@/hooks/useScrollAnimation";
import { useSiteImage } from "@/hooks/useSiteImages";

// 目標客群分析
const targetCustomers = [
  {
    icon: AlertTriangle,
    title: "急迫性需求用戶",
    age: "不限",
    pain: "老家急需重建（海砂屋、老舊危險），時間是最緊迫的壓力",
    desire: "極致速度",
    solution: "快速組裝、乾式施作工期快、最短時間內完成安全住所",
    color: "from-red-500 to-rose-600",
  },
  {
    icon: Home,
    title: "老屋屋主",
    age: "50-70歲",
    pain: "房屋老舊但有感情，不想完全拆除重建。擔心翻新過程太久影響生活",
    desire: "保留記憶的現代化升級",
    solution: "結構補強而非全拆、快速乾式施工降低干擾、現代化設備升級",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: RefreshCw,
    title: "投資客/二手屋買家",
    age: "35-55歲",
    pain: "購入老屋但需要大幅改造，擔心翻新成本失控",
    desire: "可控的翻新投資",
    solution: "精準預算控制、快速完工縮短空置期、現代化增值空間大",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Sparkles,
    title: "空間不足的現有住戶",
    age: "40-60歲",
    pain: "家庭成員增加需要更多空間，但不想搬家",
    desire: "在地增建擴充",
    solution: "輕鋼構增建不影響原結構、快速完工、無縫銜接既有空間",
    color: "from-teal-500 to-emerald-600",
  },
];

// 輕鋼優勢
const advantages = [
  {
    icon: Shield,
    title: "專業結構安全評估",
    description: "由專業團隊進行完整的結構安全評估，針對海砂屋、老舊建築提供最適切的補強或重建方案。",
  },
  {
    icon: HardHat,
    title: "乾式施工低干擾",
    description: "採用乾式施工法，大幅減少粉塵、噪音與廢棄物。若為部分翻新，可在居住狀態下施工，降低生活干擾。",
  },
  {
    icon: Clock,
    title: "快速完工時程",
    description: "工廠預製構件，現場快速組裝。增建專案最快30天完工，全棟翻新60天內完成。",
  },
  {
    icon: Target,
    title: "精準預算控制",
    description: "工業化生產模式讓成本透明可控，報價即是最終價格。告別傳統翻新工程中常見的追加費用。",
  },
  {
    icon: RefreshCw,
    title: "現代化設備升級",
    description: "同步升級水電管線、節能設備、智慧家居系統。讓老屋煥然一新，符合現代生活需求。",
  },
  {
    icon: Sparkles,
    title: "設計美學提升",
    description: "突破既有格局限制，創造更開闊的空間感。從外觀到內裝，為老屋注入全新生命力。",
  },
];

const ServiceRenovation = () => {
  const renovationImage = useSiteImage('service-renovation');

  return (
    <>
      <Helmet>
        <title>舊屋增建/翻新 | 築安心 - 輕鋼構建築專家</title>
        <meta name="description" content="築安心舊屋翻新：專業結構評估、乾式施工低干擾、30-60天快速完工。讓老房子重獲新生。" />
      </Helmet>
      <MainLayout>
        <div className="min-h-screen bg-background">
          {/* Hero Section */}
          <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
            <img
              src={renovationImage}
              alt="舊屋翻新"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 flex items-end">
              <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12 w-full">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4 backdrop-blur-sm animate-fade-in-up">
                  <Wrench className="w-4 h-4" />
                  服務項目
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                  舊屋增建/翻新
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                  讓老房子重獲新生。以最短時間、最低干擾完成居住空間的升級改造。
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
            {/* 服務介紹 */}
            <AnimatedSection className="mb-20" animation="fade-up">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">
                    老屋翻新的最佳選擇
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    海砂屋、老舊危樓、空間不足？這些問題都有解決方案。輕鋼構增建與翻新技術，
                    讓您不必忍受傳統工程的漫長等待與生活干擾，以最有效率的方式完成居住空間的升級。
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    我們的專業團隊會先進行完整的結構安全評估，針對您的房屋狀況提供最適切的補強或重建方案。
                    採用乾式施工法大幅減少粉塵與噪音，增建專案最快 <span className="text-primary font-bold">30天完工</span>，
                    全棟翻新也能在 <span className="text-primary font-bold">60天內</span> 完成。
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-orange-500/10 px-4 py-2 rounded-full">
                      <span className="text-orange-600 dark:text-orange-400 font-medium">✓ 專業結構評估</span>
                    </div>
                    <div className="bg-orange-500/10 px-4 py-2 rounded-full">
                      <span className="text-orange-600 dark:text-orange-400 font-medium">✓ 乾式施工低干擾</span>
                    </div>
                    <div className="bg-orange-500/10 px-4 py-2 rounded-full">
                      <span className="text-orange-600 dark:text-orange-400 font-medium">✓ 30-60天完工</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-3xl p-8">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: "30", label: "天增建完工" },
                        { value: "60", label: "天全棟翻新" },
                        { value: "-70%", label: "施工廢棄物" },
                        { value: "0", label: "追加費用" },
                      ].map((stat, index) => (
                        <AnimatedItem key={stat.label} index={index} baseDelay={100}>
                          <div className="bg-card rounded-xl p-6 text-center shadow-lg">
                            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                          </div>
                        </AnimatedItem>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* 目標客群 */}
            <AnimatedSection className="mb-20" animation="fade-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  這項服務適合您嗎？
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  無論是緊急需求還是規劃升級，我們都能提供專業解決方案
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {targetCustomers.map((customer, index) => (
                  <AnimatedItem key={customer.title} index={index} baseDelay={150}>
                    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={cn("p-3 rounded-xl bg-gradient-to-br text-white", customer.color)}>
                          <customer.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{customer.title}</h3>
                          <span className="text-sm text-muted-foreground">{customer.age}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-destructive/10 rounded-lg p-3">
                          <span className="text-sm font-medium text-destructive">痛點：</span>
                          <p className="text-sm text-muted-foreground mt-1">{customer.pain}</p>
                        </div>
                        <div className="bg-primary/10 rounded-lg p-3">
                          <span className="text-sm font-medium text-primary">他們要的是：</span>
                          <span className="text-sm font-bold text-primary ml-1">{customer.desire}</span>
                          <p className="text-sm text-muted-foreground mt-1">{customer.solution}</p>
                        </div>
                      </div>
                    </div>
                  </AnimatedItem>
                ))}
              </div>
            </AnimatedSection>

            {/* 輕鋼優勢 */}
            <AnimatedSection className="mb-20" animation="fade-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  輕鋼構翻新六大優勢
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  專為老屋改造設計的高效解決方案
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advantages.map((item, index) => (
                  <AnimatedItem key={item.title} index={index} baseDelay={100}>
                    <div className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                      <div className="bg-orange-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </AnimatedItem>
                ))}
              </div>
            </AnimatedSection>

            {/* 適用類型 */}
            <AnimatedSection className="mb-20" animation="scale">
              <div className="bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-3xl p-8 md:p-12 border border-orange-500/10">
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                  服務類型
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { title: "頂樓加蓋", desc: "合法增建擴大居住空間", icon: "🏗️" },
                    { title: "全棟翻新", desc: "海砂屋、老屋徹底改造", icon: "🔧" },
                    { title: "局部增建", desc: "車庫、儲藏室、工作室", icon: "🏠" },
                  ].map((item, index) => (
                    <AnimatedItem key={item.title} index={index} baseDelay={150}>
                      <div className="bg-card rounded-xl p-6 text-center shadow-lg">
                        <div className="text-5xl mb-4">{item.icon}</div>
                        <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </AnimatedItem>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* CTA */}
            <AnimatedSection animation="slide-up">
              <div className="text-center">
                <div className="bg-card rounded-3xl p-8 md:p-12 shadow-xl border border-border">
                  <Calculator className="w-16 h-16 text-orange-600 dark:text-orange-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    讓老屋重獲新生
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                    使用我們的線上估價工具，快速了解翻新專案預算範圍。專業團隊將免費到府評估，提供最適切的改造建議。
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="gap-2 bg-orange-600 hover:bg-orange-700">
                      <Link to="/estimate">
                        <Calculator className="w-5 h-5" />
                        立即估價
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-2">
                      <Link to="/contact">
                        預約免費諮詢
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default ServiceRenovation;
