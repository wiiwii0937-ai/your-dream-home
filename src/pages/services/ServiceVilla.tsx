import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { 
  Home, Shield, Zap, Thermometer, Users, Clock, 
  CheckCircle2, ArrowRight, Calculator, Sparkles,
  Heart, Target, Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatedSection, AnimatedItem } from "@/hooks/useScrollAnimation";

import villaImage from "@/assets/projects/villa-house.jpg";
import villaExterior from "@/assets/projects/villa-exterior-1.jpg";

// 目標客群分析
const targetCustomers = [
  {
    icon: Users,
    title: "預算明確的成家/換屋族",
    age: "45-60歲",
    pain: "擔心施工品質不穩、工期無限延長、過程勞心勞力",
    desire: "確定性",
    solution: "明確的工期、透明的預算、耐震安全的承諾、一站到位的設計+建造服務",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Heart,
    title: "退休樂活族",
    age: "55-70歲",
    pain: "體力無法負荷監工奔波，擔心老後住宅的無障礙與安全性",
    desire: "安心與舒適",
    solution: "全齡通用設計（未來可無障礙）、高氣密高隔熱，夏涼冬暖省電費、耐震結構讓兒女放心",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Leaf,
    title: "環保意識強烈的專業人士",
    age: "30-45歲",
    pain: "不喜歡傳統建築的浪費與高碳足跡",
    desire: "理念契合與科技感",
    solution: "綠色建築工法、可回收建材、高性能節能系統、智慧家居整合",
    color: "from-teal-500 to-emerald-600",
  },
  {
    icon: Sparkles,
    title: "重視設計感的年輕首購族",
    age: "30-40歲",
    pain: "傳統建築難以實現複雜造型且成本高昂",
    desire: "設計自由度與性價比",
    solution: "無柱大空間、靈活室內格局、現代化立面設計、工業風裸露鋼構美感",
    color: "from-violet-500 to-purple-600",
  },
];

// 輕鋼優勢
const advantages = [
  {
    icon: Shield,
    title: "極致耐震結構",
    description: "高強度冷鍍鋅鋼骨構成的韌性框架，建築自重輕，地震時承受的慣性力大幅降低。專業鉸接設計能在地震來襲時吸收並消散巨大能量。",
  },
  {
    icon: Thermometer,
    title: "高效節能隔熱",
    description: "結構層與高性能保溫隔熱材無縫結合，從物理上杜絕冷熱橋效應。高氣密設計讓夏涼冬暖，大幅降低空調電費。",
  },
  {
    icon: Clock,
    title: "60天快速完工",
    description: "工廠預製、現場組裝的模式，基礎施工同時工廠同步生產。免除混凝土養護期，主體結構完成後內外裝修可立即跟進。",
  },
  {
    icon: Target,
    title: "毫米級精準施工",
    description: "數位化設計與生產，所有構件由電腦控制產線精準切割，誤差控制在毫米級。設計圖與完工實物高度一致。",
  },
  {
    icon: Sparkles,
    title: "設計自由度",
    description: "實現各式斜屋頂、大面開窗、無柱大空間。從現代極簡到鄉村風格，忠實還原各種設計曲線與立面層次。",
  },
  {
    icon: Leaf,
    title: "綠色永續建築",
    description: "施工現場廢棄物減少達70%，主要材料可近乎100%回收再利用。對基地周邊環境衝擊最小。",
  },
];

const ServiceVilla = () => {
  return (
    <>
      <Helmet>
        <title>輕鋼構別墅/住宅 | 築安心 - 輕鋼構建築專家</title>
        <meta name="description" content="築安心輕鋼構別墅：耐震安全、節能隔熱、60天快速完工。打造您夢想中的永久家園。" />
      </Helmet>
      <MainLayout>
        <div className="min-h-screen bg-background">
          {/* Hero Section */}
          <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
            <img
              src={villaImage}
              alt="輕鋼構別墅"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 flex items-end">
              <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12 w-full">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4 backdrop-blur-sm animate-fade-in-up">
                  <Home className="w-4 h-4" />
                  服務項目
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                  輕鋼構別墅/住宅
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                  打造您夢想中的永久家園。耐震、節能、快速完工，讓美好生活提早開始。
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
                    為什麼選擇輕鋼構別墅？
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    在傳統昂貴的RC混凝土與廉價臨時結構之間，輕鋼構代表著一條更精準、更靈活、更負責任的「第三條道路」。
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    從現代極簡到溫馨鄉村風格，輕鋼構別墅以精準工藝實現您對家的所有想像。高強度冷鍍鋅鋼骨結構提供超越法規標準的耐震安全，
                    高性能保溫隔熱系統讓您夏涼冬暖、大幅節省電費。
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    最重要的是，工廠預製、現場組裝的建造模式，讓您的新家能在 <span className="text-primary font-bold">60天內完工入住</span>，
                    預算透明鎖死不怕追加，真正實現「所見即所得」的確定性。
                  </p>
                </div>
                <div className="relative">
                  <img
                    src={villaExterior}
                    alt="別墅外觀"
                    className="rounded-2xl shadow-2xl"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg animate-float">
                    <div className="text-4xl font-bold">60</div>
                    <div className="text-sm">天快速完工</div>
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
                  無論您的需求是什麼，築安心都能為您量身打造最適合的解決方案
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
                  輕鋼構別墅六大優勢
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  每一項優勢都是對您生活品質的承諾
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advantages.map((item, index) => (
                  <AnimatedItem key={item.title} index={index} baseDelay={100}>
                    <div className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                      <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </AnimatedItem>
                ))}
              </div>
            </AnimatedSection>

            {/* 施工流程 */}
            <AnimatedSection className="mb-20" animation="scale">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 md:p-12 border border-primary/10">
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                  從夢想到入住的旅程
                </h2>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { step: "01", title: "諮詢規劃", desc: "免費現場勘查，了解您的需求與預算" },
                    { step: "02", title: "設計確認", desc: "3D設計呈現，確認每個細節符合期待" },
                    { step: "03", title: "工廠生產", desc: "精密構件工廠預製，品質穩定可靠" },
                    { step: "04", title: "組裝完工", desc: "現場快速組裝，60天入住新家" },
                  ].map((item, index) => (
                    <AnimatedItem key={item.step} index={index} baseDelay={200}>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                          {item.step}
                        </div>
                        <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                        {index < 3 && (
                          <ArrowRight className="w-6 h-6 text-primary mx-auto mt-4 hidden md:block" />
                        )}
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
                  <Calculator className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    開始規劃您的夢想家園
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                    使用我們的線上估價工具，快速了解您的別墅專案預算範圍。專業團隊將為您提供最詳細的規劃建議。
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="gap-2">
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

export default ServiceVilla;
