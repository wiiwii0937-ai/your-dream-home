import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { Palette, Shield, Wind, Target, Zap, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const advantages = [
  {
    icon: Palette,
    title: "設計自由",
    subtitle: "實現優雅美學的結構基石",
    description: "輕鋼結構即是美學的畫布。",
    details: [
      "實現優雅斜線：各式斜屋頂，打破天際線的沉悶。",
      "支撐大面開窗：打破空間界限，將風景變成家中最美的流動畫作。",
      "造型多樣性：從現代極簡到鄉村風格，忠實還原各種設計曲線與立面層次。",
    ],
    benefit: "美學的徹底解放。您的家不必再妥協於結構限制，可以是任何夢想中的模樣。",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Shield,
    title: "極致耐震",
    subtitle: "主動抵禦災害的科學結構",
    description: "高強度冷鍍鋅鋼骨構成的「韌性框架」。",
    details: [
      "輕質高強：鋼材的強度重量比遠優於混凝土，建築自重輕，地震時承受的慣性力大幅降低。",
      "專業鉸接設計：關鍵連接點採用特殊設計，能在地震來襲時如同「安全閥」，通過可控的彎曲變形吸收並消散巨大能量。",
      "精確結構計算：每棟建築均進行電腦模擬分析，確保從基礎到屋頂的每一根構件都精確參與抗震。",
    ],
    benefit: "一份超越法規標準的安心保障，讓家成為真正的安全避風港。",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Wind,
    title: "抗風防線",
    subtitle: "颱風頻仍的臺灣必備防護",
    description: "抗拔、抗剪系統與氣密、錨固設計。",
    details: [
      "抗拔設計：高強度抗拔螺栓、預埋式抗拔件，將輕鋼構主骨架像「釘書針」一樣深層錨固。",
      "抗剪設計：在牆體與樓板層內系統性設置鋼製X型或K型斜撐，形成剛性三角結構。",
      "牆體與屋面板堅實錨固：外牆結構板材皆以高密度機械式固定鎖於輕鋼骨架上。",
      "門窗抗風壓：全數採用抗風壓等級與水密性等級符合標準的門窗。",
    ],
    benefit: "建築的抗風能力不是選配，而是生存與安全的根本。",
    color: "from-teal-500 to-emerald-600",
  },
  {
    icon: Target,
    title: "超凡精準",
    subtitle: "工業化生產的毫米級標準",
    description: "「工廠預製，現場組裝」的現代化營造模式。",
    details: [
      "數位化設計與生產：建築藍圖直接轉化為工廠的生產指令，所有鋼骨構件由電腦控制產線精準切割、打孔，誤差控制在毫米級。",
      "模塊組裝：從螺栓鎖固與組裝都採乾式施工，大幅減少人為技術誤差與環境變數。",
      "穩定品質：構件在出廠前即完成防鏽處理、品檢，杜絕傳統工地材料品質不均的問題。",
    ],
    benefit: "「所見即所得」的確定性。設計圖與完工實物高度一致，告別傳統施工中常見的尺寸誤差與糾紛。",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Zap,
    title: "迅捷高效",
    subtitle: "縮短一半的建築時程",
    description: "不受天候影響的快速施工流程。",
    details: [
      "並行工程：基礎施工的同時，工廠同步生產鋼構與外牆板，時間被完美疊加利用。",
      "無養護期：免除混凝土28天的養護等待，主體結構組裝完成後，內外裝修可立即跟進。",
      "全氣候施工：除極端天氣外，雨天仍可進行室內結構組裝與裝修，工期預測性極高。",
    ],
    benefit: "時間的自主權。快速入住，大幅減少租屋過渡成本與心力耗損，讓美好生活提早開始。",
    color: "from-yellow-500 to-orange-600",
  },
  {
    icon: Leaf,
    title: "靈活永續",
    subtitle: "順應未來的綠色哲學",
    description: "可變、可逆、環境友善的建築系統。",
    details: [
      "框組壁結構：大跨度無柱空間，輕鬆實現開放式格局。內部隔間可隨家庭生命週期自由調整。",
      "低碳建造：施工現場廢棄物減少達70%，對基地周邊環境衝擊最小。",
      "綠色建材：主要材料（鋼材）可近乎100%回收再利用。",
      "完美整合節能：結構層與高性能保溫隔熱材無縫結合，從物理上杜絕冷熱橋效應。",
    ],
    benefit: "一個能與家人共同成長、變化，並對地球環境友善的永續之家。",
    color: "from-green-500 to-emerald-600",
  },
];

const Advantages = () => {
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
              優勢工法
            </h1>
            <p className="text-lg text-primary font-medium mb-2">
              築安心的精準革新
            </p>
            <p className="text-muted-foreground leading-relaxed">
              在築安心，我們選擇輕鋼構，不僅是一種選擇，更是一種對於現代建築的深刻回應。
              它代表著一條更精準、更靈活、更負責任的「第三條道路」。
            </p>
          </div>

          {/* 優勢卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {advantages.map((item, index) => (
              <div
                key={item.title}
                className={cn(
                  "group relative bg-card rounded-2xl overflow-hidden shadow-lg",
                  "transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
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
                      <item.icon className="w-6 h-6 text-white" />
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
            ))}
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Advantages;
