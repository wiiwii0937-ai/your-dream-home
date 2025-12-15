import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { Shield, Sparkles, Zap, Leaf, Home, Wind, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const coreValues = [
  {
    icon: Shield,
    title: "安全",
    description: "耐震抗風的科學結構，守護每一個家庭的安心。",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Sparkles,
    title: "質感",
    description: "精準工藝與美學設計，打造獨一無二的理想居所。",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Zap,
    title: "快速",
    description: "工廠預製現場組裝，縮短工期讓您早日入住。",
    color: "from-amber-500 to-orange-500",
  },
];

const principles = [
  {
    icon: Leaf,
    title: "綠色環保",
    description: "低碳排、低汙染、輕量化、減少水泥砂石用量",
  },
  {
    icon: Shield,
    title: "耐震",
    description: "輕量化、高彈性、高延展性能吸震、結構設計符合耐震標準",
  },
  {
    icon: Wind,
    title: "防風",
    description: "精密計算、結構強化、重點連接、並嚴格施工",
  },
  {
    icon: Target,
    title: "精準工藝",
    description: "電腦設計工廠預製、案場快速組裝、乾式施工低粉塵",
  },
];

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
                關於<span className="text-primary">築安心</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                專門做輕鋼構住宅的公司，致力於打造安全、質感、快速的理想居所
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
                {coreValues.map((value, index) => (
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
                      <value.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Brand Story */}
          <section className="py-16 px-6 md:px-12 bg-card/50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
                品牌故事
              </h2>
              <div className="prose prose-lg max-w-none">
                <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg space-y-6">
                  <p className="text-lg text-foreground leading-relaxed">
                    在臺灣，關於「家」的建築，似乎長久以來只有兩種選擇：
                  </p>
                  <p className="text-muted-foreground leading-relaxed pl-4 border-l-4 border-primary">
                    一邊是厚重而昂貴的RC水泥盒子，它固然堅固，但漫長的工期、難以更動的格局，
                    以及千篇一律的方正線條，彷彿框限了生活的形狀。
                  </p>
                  <p className="text-muted-foreground leading-relaxed pl-4 border-l-4 border-primary">
                    另一邊，則是倉促拼湊的鐵皮浪板，它滿足了速成的需求，
                    但生硬、躁進且不耐久候的材質卻將我們的城市美學，墜落至地平面下。
                  </p>
                  <p className="text-xl font-medium text-primary text-center py-4">
                    我們不禁想問：家的模樣，能否有第三條路？
                  </p>
                  <p className="text-lg text-foreground leading-relaxed">
                    這就是<span className="font-bold text-primary">「築安心」</span>誕生的起點。
                  </p>
                  <p className="text-foreground leading-relaxed">
                    我們深信，建築不只是遮蔽風雨的構造物，更是承載生活的歸屬，是形塑城市美學的決定性筆觸。
                  </p>
                  <div className="bg-primary/10 rounded-xl p-6 text-center">
                    <Home className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground">
                      每個人選擇如何建造自己的家，
                      <br />
                      就是在決定我們社會的氣質。
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
                四大理念
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                我們堅持的建築哲學，為每一棟建築注入靈魂
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {principles.map((principle, index) => (
                  <div
                    key={principle.title}
                    className="flex items-start gap-4 bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <principle.icon className="w-6 h-6 text-primary" />
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
                ))}
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default About;
