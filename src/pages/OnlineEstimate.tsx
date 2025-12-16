import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calculator, Home, Building2, Warehouse, Wrench, Info } from "lucide-react";

const buildingTypes = [
  { id: "mobile", name: "移動式住宅", price: 100000, icon: Home, description: "快速建造、可移動" },
  { id: "villa", name: "輕鋼別墅", price: 108000, icon: Building2, description: "永久住宅首選" },
  { id: "guesthouse", name: "民宿/商業空間", price: 130000, icon: Warehouse, description: "商業營運最佳" },
  { id: "renovation", name: "老屋翻新加建", price: 150000, icon: Wrench, description: "舊屋新生命" },
];

const OnlineEstimate = () => {
  const [selectedType, setSelectedType] = useState<string>("villa");
  const [area, setArea] = useState<string>("");

  const selectedBuilding = buildingTypes.find(t => t.id === selectedType);
  
  const estimate = useMemo(() => {
    const areaNum = parseFloat(area);
    if (!areaNum || areaNum <= 0 || !selectedBuilding) return null;
    
    const basePrice = areaNum * selectedBuilding.price;
    const lowEstimate = Math.round(basePrice * 0.9);
    const highEstimate = Math.round(basePrice * 1.1);
    
    return { lowEstimate, highEstimate, basePrice };
  }, [area, selectedBuilding]);

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(1)} 萬`;
    }
    return price.toLocaleString();
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">線上估價</h1>
            <p className="text-lg text-muted-foreground">
              快速了解您的建築預算，三步驟即可獲得初步報價
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Building Type Selection */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                  選擇建築類型
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedType} onValueChange={setSelectedType} className="space-y-3">
                  {buildingTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Label
                        key={type.id}
                        htmlFor={type.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedType === type.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          selectedType === type.id ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">{type.name}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">¥{(type.price / 10000).toFixed(1)}萬</div>
                          <div className="text-xs text-muted-foreground">/坪</div>
                        </div>
                      </Label>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Area Input & Result */}
            <div className="space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                    輸入建坪數
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="area" className="text-muted-foreground">預估建築面積（坪）</Label>
                      <Input
                        id="area"
                        type="number"
                        placeholder="例如：30"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="mt-2 text-lg h-12"
                        min="1"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      1坪 ≈ 3.3平方公尺 ≈ 35.58平方英尺
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Result */}
              <Card className={`border-2 transition-all ${estimate ? "border-primary bg-primary/5" : "border-border/50 bg-card/50"}`}>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
                    估算結果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {estimate ? (
                    <div className="space-y-4">
                      <div className="text-center py-4">
                        <div className="text-sm text-muted-foreground mb-2">預估價格區間</div>
                        <div className="text-3xl font-bold text-primary">
                          ¥{formatPrice(estimate.lowEstimate)} ~ ¥{formatPrice(estimate.highEstimate)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                          基準價：¥{formatPrice(estimate.basePrice)}
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground">
                            以上為概算價格，實際報價需依現場勘查、地形條件、設計需求等因素調整。歡迎聯繫我們進行免費現場評估。
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>請選擇建築類型並輸入坪數</p>
                      <p className="text-sm">即可獲得估算價格</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Card className="border-border/50 bg-card/50 backdrop-blur inline-block">
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  想要更精準的報價？立即預約免費現場勘查
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  立即預約諮詢
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OnlineEstimate;
