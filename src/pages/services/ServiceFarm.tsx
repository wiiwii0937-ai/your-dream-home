import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { 
  Warehouse, Shield, Zap, Droplets, Wind, Clock, 
  CheckCircle2, ArrowRight, Calculator, Sparkles,
  DollarSign, Target, Leaf, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatedSection, AnimatedItem } from "@/hooks/useScrollAnimation";
import { useSiteImage } from "@/hooks/useSiteImages";

// 目標客群分析
const targetCustomers = [
  {
    icon: TrendingUp,
    title: "農舍/民宿經營者",
    age: "35-55歲",
    pain: "傳統建築成本高、回收期長。需要快速開業搶占市場",
    desire: "投資效益與吸睛設計",
    solution: "快速興建早一天營業早一天賺錢、低維護成本、客製化特色外觀",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Leaf,
    title: "退休田園夢想家",
    age: "55-70歲",
    pain: "想要親近自然，但擔心鄉間建築品質與維護問題",
    desire: "田園生活的安心居所",
    solution: "符合農舍法規、防潮防蟲設計、低維護成本、舒適節能",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: DollarSign,
    title: "農業經營者",
    age: "40-60歲",
    pain: "需要實用的資材室或工作空間，但預算有限",
    desire: "高CP值的實用空間",
    solution: "大跨度無柱空間、堅固耐用、快速施工、彈性擴充",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Sparkles,
    title: "急迫性需求用戶",
    age: "不限",
    pain: "時間是最緊迫的壓力，需要快速完成建設",
    desire: "極致速度",
    solution: "快速組裝、乾式施作工期快、工廠預製現場組裝",
    color: "from-red-500 to-rose-600",
  },
];

// 輕鋼優勢
const advantages = [
  {
    icon: Shield,
    title: "符合農舍法規",
    description: "專業團隊熟悉各地農舍法規要求，從設計階段就確保符合相關規範，讓您的農舍合法合規。",
  },
  {
    icon: Warehouse,
    title: "大跨度空間設計",
    description: "輕鋼構造的高強度特性，可實現無柱大空間，無論是農舍起居空間或資材室儲存區域，都能靈活規劃。",
  },
  {
    icon: Droplets,
    title: "防潮防蟲設計",
    description: "鋼材本身不受白蟻等蟲害侵蝕，搭配專業防潮處理，特別適合潮濕多雨的農村環境。",
  },
  {
    icon: Wind,
    title: "抗風耐候結構",
    description: "高強度抗拔螺栓與X型斜撐設計，能抵禦颱風侵襲。外牆採用高密度機械式固定，堅固可靠。",
  },
  {
    icon: Clock,
    title: "45天快速完工",
    description: "工廠預製、現場組裝，大幅縮短工期。農舍類型專案最快45天即可完工，讓您早日享受田園生活。",
  },
  {
    icon: Target,
    title: "低維護成本",
    description: "冷鍍鋅鋼材防鏽耐候，外牆板材耐久性高。長期維護成本遠低於傳統建築，省心省錢。",
  },
];

const ServiceFarm = () => {
  const farmImage = useSiteImage('service-farm');

  return (
    <>
      <Helmet>
        <title>輕鋼構農舍/資材室 | 築安心 - 輕鋼構建築專家</title>
        <meta name="description" content="築安心輕鋼構農舍：符合法規、大跨度空間、防潮防蟲、45天快速完工。田園生活的理想選擇。" />
      </Helmet>
      <MainLayout>
        <div className="min-h-screen bg-background">
          {/* Hero Section */}
          <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
            <img
              src={farmImage}
              alt="輕鋼構農舍"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 flex items-end">
              <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12 w-full">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium mb-4 backdrop-blur-sm animate-fade-in-up">
                  <Warehouse className="w-4 h-4" />
                  服務項目
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                  輕鋼構農舍/資材室
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                  田園生活的理想選擇。結合實用功能與美學設計，為您的農地打造符合法規、堅固耐用的空間。
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
                    為什麼選擇輕鋼構農舍？
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    農舍不只是建築，更是您田園夢想的起點。無論是作為週末休閒的第二個家，還是開啟農村民宿事業，
                    輕鋼構農舍都能以最短時間、最高品質，為您實現理想。
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    我們的專業團隊熟悉各地農舍法規，從設計階段就確保符合相關規範。大跨度無柱空間設計讓室內格局靈活運用，
                    防潮防蟲的特性更特別適合台灣潮濕多雨的農村環境。
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-green-500/10 px-4 py-2 rounded-full">
                      <span className="text-green-600 dark:text-green-400 font-medium">✓ 符合農舍法規</span>
                    </div>
                    <div className="bg-green-500/10 px-4 py-2 rounded-full">
                      <span className="text-green-600 dark:text-green-400 font-medium">✓ 45天快速完工</span>
                    </div>
                    <div className="bg-green-500/10 px-4 py-2 rounded-full">
                      <span className="text-green-600 dark:text-green-400 font-medium">✓ 防潮防蟲設計</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl p-8">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: "45", label: "天快速完工" },
                        { value: "100%", label: "合法合規" },
                        { value: "70%", label: "減少廢棄物" },
                        { value: "0", label: "蟲害煩惱" },
                      ].map((stat, index) => (
                        <AnimatedItem key={stat.label} index={index} baseDelay={100}>
                          <div className="bg-card rounded-xl p-6 text-center shadow-lg">
                            <div className="text-4xl font-bold text-green-600 dark:text-green-400">{stat.value}</div>
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
                  不同需求，同樣專業的解決方案
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
                  輕鋼構農舍六大優勢
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  專為農村環境設計的建築解決方案
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advantages.map((item, index) => (
                  <AnimatedItem key={item.title} index={index} baseDelay={100}>
                    <div className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                      <div className="bg-green-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
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
              <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl p-8 md:p-12 border border-green-500/10">
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                  適用類型
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { title: "休閒農舍", desc: "週末度假的世外桃源", icon: "🏡" },
                    { title: "農業資材室", desc: "農具設備的安全存放", icon: "🚜" },
                    { title: "農村民宿", desc: "開創第二收入來源", icon: "🌾" },
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
                  <Calculator className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    開始規劃您的田園夢想
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                    使用我們的線上估價工具，快速了解農舍專案預算範圍。專業團隊將協助您處理法規申請與規劃建議。
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="gap-2 bg-green-600 hover:bg-green-700">
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

export default ServiceFarm;
