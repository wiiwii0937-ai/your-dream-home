import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, Home, Building2, Warehouse, Wrench, Info, Check, Plus } from "lucide-react";

const buildingTypes = [
  { id: "mobile", name: "移動式住宅", price: 100000, icon: Home, description: "快速建造、可移動" },
  { id: "villa", name: "輕鋼別墅", price: 108000, icon: Building2, description: "永久住宅首選" },
  { id: "guesthouse", name: "民宿/商業空間", price: 130000, icon: Warehouse, description: "商業營運最佳" },
  { id: "renovation", name: "老屋翻新加建", price: 150000, icon: Wrench, description: "舊屋新生命" },
];

const baseFeatures = [
  { category: "屋頂瓦", value: "斜屋頂" },
  { category: "外牆結構牆板", value: "標準配置" },
  { category: "牆板加強固定", value: "標準配置" },
  { category: "內部隔間牆板", value: "標準配置" },
  { category: "室外裝飾牆板", value: "金屬斷熱板" },
  { category: "室內裝飾牆板", value: "室內全牆面覆蓋" },
  { category: "室內天花板", value: "標準配置" },
  { category: "室內地板", value: "石塑地板" },
  { category: "衛浴設備", value: "洗手台＋鏡、淋浴龍頭、馬桶" },
  { category: "廚具", value: "標準櫥櫃250CM內附流理台" },
  { category: "室外門", value: "鋼質門" },
  { category: "室內門", value: "房間木門、衛浴鋁合金玻璃門" },
  { category: "推拉窗", value: "鋁合金窗配夾膠玻璃" },
  { category: "室內配電", value: "基礎插座開關+專迴(以坪數增刪)" },
];

const additionalOptions = [
  { id: "septic", name: "化糞池 6人份(含施作)", price: 25000, perPing: false },
  { id: "roofDeck", name: "露臺屋頂", price: 20000, perPing: true, unit: "坪" },
  { id: "plasticWoodDeck", name: "塑木室外平台地板(含鋼製平台、欄杆、平台樓梯)", price: 20000, perPing: true, unit: "坪" },
  { id: "southernPineDeck", name: "南方松室外平台地板(含鋼製平台、欄杆、平台樓梯)", price: 23000, perPing: true, unit: "坪" },
];

const OnlineEstimate = () => {
  const [selectedType, setSelectedType] = useState<string>("villa");
  const [area, setArea] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  const [optionAreas, setOptionAreas] = useState<Record<string, string>>({});

  const selectedBuilding = buildingTypes.find(t => t.id === selectedType);
  
  const estimate = useMemo(() => {
    const areaNum = parseFloat(area);
    if (!areaNum || areaNum <= 0 || !selectedBuilding) return null;
    
    const basePrice = areaNum * selectedBuilding.price;
    
    // Calculate additional options price
    let additionalPrice = 0;
    additionalOptions.forEach(option => {
      if (selectedOptions[option.id]) {
        if (option.perPing) {
          const optionArea = parseFloat(optionAreas[option.id] || "0");
          additionalPrice += option.price * optionArea;
        } else {
          additionalPrice += option.price;
        }
      }
    });
    
    const totalBase = basePrice + additionalPrice;
    const lowEstimate = Math.round(totalBase * 0.9);
    const highEstimate = Math.round(totalBase * 1.1);
    
    return { lowEstimate, highEstimate, basePrice: totalBase, additionalPrice };
  }, [area, selectedBuilding, selectedOptions, optionAreas]);

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(1)} 萬`;
    }
    return price.toLocaleString();
  };

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: !prev[optionId]
    }));
  };

  const handleOptionAreaChange = (optionId: string, value: string) => {
    setOptionAreas(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">線上估價</h1>
            <p className="text-lg text-muted-foreground">
              快速了解您的建築預算，選擇配置即可獲得初步報價
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Building Type & Area */}
            <div className="space-y-6">
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
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedType === type.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedType === type.id ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-foreground text-sm">{type.name}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary text-sm">¥{(type.price / 10000).toFixed(1)}萬</div>
                            <div className="text-xs text-muted-foreground">/坪</div>
                          </div>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Area Input */}
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
            </div>

            {/* Middle Column - Base Features & Additional Options */}
            <div className="space-y-6">
              {/* Base Features */}
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    基本配置（每坪10.8萬）
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {baseFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 py-1.5 border-b border-border/30 last:border-0">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-foreground">{feature.category}：</span>
                          <span className="text-sm text-muted-foreground">{feature.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Options */}
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    加價選項
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Site preparation notice */}
                    <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">整地及地基</p>
                      <p>• 整地：依現場現地報價</p>
                      <p>• 地基（連續基礎、筏式基礎）：依現場報價</p>
                    </div>

                    {/* Selectable options */}
                    <div className="space-y-3">
                      {additionalOptions.map((option) => (
                        <div key={option.id} className={`p-3 rounded-lg border-2 transition-all ${
                          selectedOptions[option.id] ? "border-primary bg-primary/5" : "border-border"
                        }`}>
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id={option.id}
                              checked={selectedOptions[option.id] || false}
                              onCheckedChange={() => handleOptionToggle(option.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <Label htmlFor={option.id} className="text-sm font-medium text-foreground cursor-pointer">
                                {option.name}
                              </Label>
                              <div className="text-sm text-primary font-semibold mt-1">
                                ¥{option.price.toLocaleString()}{option.perPing ? "/坪" : ""}
                              </div>
                              {option.perPing && selectedOptions[option.id] && (
                                <div className="mt-2">
                                  <Label className="text-xs text-muted-foreground">面積（坪）</Label>
                                  <Input
                                    type="number"
                                    placeholder="輸入坪數"
                                    value={optionAreas[option.id] || ""}
                                    onChange={(e) => handleOptionAreaChange(option.id, e.target.value)}
                                    className="mt-1 h-8 text-sm"
                                    min="1"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Result */}
            <div className="space-y-6">
              <Card className={`border-2 transition-all sticky top-4 ${estimate ? "border-primary bg-primary/5" : "border-border/50 bg-card/50"}`}>
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
                        {estimate.additionalPrice > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            (含加價選項 ¥{formatPrice(estimate.additionalPrice)})
                          </div>
                        )}
                      </div>

                      {/* Summary */}
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">建築類型</span>
                          <span className="font-medium text-foreground">{selectedBuilding?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">建築面積</span>
                          <span className="font-medium text-foreground">{area} 坪</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">基本價格</span>
                          <span className="font-medium text-foreground">¥{formatPrice(parseFloat(area) * (selectedBuilding?.price || 0))}</span>
                        </div>
                        {Object.entries(selectedOptions).filter(([_, selected]) => selected).map(([optionId]) => {
                          const option = additionalOptions.find(o => o.id === optionId);
                          if (!option) return null;
                          const optionPrice = option.perPing 
                            ? option.price * parseFloat(optionAreas[optionId] || "0")
                            : option.price;
                          return (
                            <div key={optionId} className="flex justify-between text-sm">
                              <span className="text-muted-foreground truncate pr-2">{option.name}</span>
                              <span className="font-medium text-foreground shrink-0">¥{formatPrice(optionPrice)}</span>
                            </div>
                          );
                        })}
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

              {/* CTA */}
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-6 text-center">
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
      </div>
    </MainLayout>
  );
};

export default OnlineEstimate;
