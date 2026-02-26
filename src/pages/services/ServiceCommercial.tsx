import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import {
  Building2, Shield, Zap, LayoutGrid, Clock,
  ArrowRight, Calculator, Sparkles,
  TrendingUp, Target, Users, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatedSection, AnimatedItem } from "@/hooks/useScrollAnimation";


// 目標客群分析
const targetCustomers = [
  {
    icon: TrendingUp,
    title: "民宿/旅館經營者",
    age: "35-55歲",
    pain: "傳統建築成本高、回收期長。需要快速開業搶占市場，建築需有特色吸引客人",
    desire: "投資效益與吸睛設計",
    solution: "快速興建早一天營業早一天賺錢、客製化特色外觀（工業風、現代極簡）、低維護成本",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Star,
    title: "創業家/商業空間需求者",
    age: "30-50歲",
    pain: "需要獨特的空間來建立品牌形象，但租金高昂或找不到理想物件",
    desire: "品牌識別度與成本控制",
    solution: "獨特建築外觀成為最佳行銷、靈活空間規劃、快速開業降低營運成本",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Users,
    title: "觀光區土地擁有者",
    age: "45-65歲",
    pain: "有土地但不知如何發展，擔心投資風險與回收期",
    desire: "穩定的被動收入",
    solution: "專業規劃協助、快速建造縮短空窗期、特色設計提高入住率",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: Sparkles,
    title: "急迫性需求用戶",
    age: "不限",
    pain: "企業需快速擴建辦公室或廠辦，時間是最緊迫的壓力",
    desire: "極致速度",
    solution: "快速組裝、乾式施作工期快、60天內完成商業空間",
    color: "from-red-500 to-rose-600",
  },
];

// 輕鋼優勢
const advantages = [
  {
    icon: Sparkles,
    title: "吸睛外觀設計",
    description: "獨特的建築外觀是最好的品牌行銷。從工業風裸露鋼構到現代極簡，打造讓人過目不忘的商業地標。",
  },
  {
    icon: LayoutGrid,
    title: "靈活空間規劃",
    description: "大跨度無柱空間設計，讓商業空間規劃更加自由。可隨業務需求調整隔間，適應不同營運模式。",
  },
  {
    icon: Clock,
    title: "快速開業營運",
    description: "工廠預製、現場組裝，60天內完成商業空間。早一天開業就早一天開始回收投資。",
  },
  {
    icon: TrendingUp,
    title: "高投資回報",
    description: "相較傳統建築，建造成本更低、工期更短。快速開業讓投資回收期大幅縮短。",
  },
  {
    icon: Shield,
    title: "堅固耐用結構",
    description: "高強度冷鍍鋅鋼骨結構，耐震、抗風、防火。商業營運的安全保障。",
  },
  {
    icon: Target,
    title: "精準預算控制",
    description: "工廠預製模式讓成本透明可控，預算鎖死不怕追加。商業投資的確定性保障。",
  },
];

const ServiceCommercial = () => {
  const commercialImage = '/images/services/commercial.jpg';

  return (
    <>
      <Helmet>
        <title>商業空間/民宿 | 築安心 - 輕鋼構建築專家</title>
        <meta name="description" content="築安心輕鋼構商業空間：特色外觀設計、靈活空間規劃、60天快速開業。創造吸睛的商業價值。" />
      </Helmet>
      <MainLayout>
        <div className="min-h-screen bg-background">
          {/* Hero Section */}
          <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
            <img
              src={commercialImage}
              alt="商業空間"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 flex items-end">
              <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12 w-full">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-400 text-sm font-medium mb-4 backdrop-blur-sm animate-fade-in-up">
                  <Building2 className="w-4 h-4" />
                  服務項目
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up [animation-delay:100ms]">
                  商業空間/民宿
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl animate-fade-in-up [animation-delay:200ms]">
                  創造吸睛的商業價值。獨特的建築外觀是最好的品牌行銷，以快速工期搶占市場先機。
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
                    讓建築成為您最強的行銷工具
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    在競爭激烈的商業環境中，獨特的建築外觀能讓您在眾多競爭者中脫穎而出。
                    輕鋼構的設計自由度，讓您實現從工業風裸露鋼構到現代極簡的各種風格。
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    無論是經營民宿、咖啡廳、餐廳還是辦公空間，輕鋼構商業建築都能在 <span className="text-primary font-bold">60天內完工</span>，
                    讓您早日開業、早日開始回收投資。靈活的空間規劃更能隨業務發展調整，適應不同營運模式。
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-violet-500/10 px-4 py-2 rounded-full">
                      <span className="text-violet-600 dark:text-violet-400 font-medium">✓ 特色外觀設計</span>
                    </div>
                    <div className="bg-violet-500/10 px-4 py-2 rounded-full">
                      <span className="text-violet-600 dark:text-violet-400 font-medium">✓ 60天快速開業</span>
                    </div>
                    <div className="bg-violet-500/10 px-4 py-2 rounded-full">
                      <span className="text-violet-600 dark:text-violet-400 font-medium">✓ 高投資回報</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-3xl p-8">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: "60", label: "天快速開業" },
                        { value: "2X", label: "投資回報速度" },
                        { value: "∞", label: "設計可能性" },
                        { value: "0", label: "預算追加" },
                      ].map((stat, index) => (
                        <AnimatedItem key={stat.label} index={index} baseDelay={100}>
                          <div className="bg-card rounded-xl p-6 text-center shadow-lg">
                            <div className="text-4xl font-bold text-violet-600 dark:text-violet-400">{stat.value}</div>
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
                  為不同商業需求提供最適切的解決方案
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
                  輕鋼構商業空間六大優勢
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  為您的商業成功奠定堅實基礎
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advantages.map((item, index) => (
                  <AnimatedItem key={item.title} index={index} baseDelay={100}>
                    <div className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                      <div className="bg-violet-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
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
              <div className="bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-3xl p-8 md:p-12 border border-violet-500/10">
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                  適用類型
                </h2>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { title: "特色民宿", desc: "打造獨特住宿體驗", icon: "🏨" },
                    { title: "咖啡廳/餐廳", desc: "吸睛外觀帶來人潮", icon: "☕" },
                    { title: "辦公空間", desc: "現代化企業形象", icon: "🏢" },
                    { title: "展示中心", desc: "品牌形象完美呈現", icon: "🎪" },
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
                  <Calculator className="w-16 h-16 text-violet-600 dark:text-violet-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    開始規劃您的商業版圖
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                    使用我們的線上估價工具，快速了解商業空間專案預算範圍。專業團隊將為您規劃最具競爭力的商業建築方案。
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="gap-2 bg-violet-600 hover:bg-violet-700">
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

export default ServiceCommercial;
