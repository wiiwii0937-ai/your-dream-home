import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, Send, Loader2, MessageCircle } from "lucide-react";
import * as Icons from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { pushGtmEvent } from "@/components/GoogleTagManager";

const LINE_URL = "https://line.me/ti/p/JzVO_19Tfk";

const LineButton = ({ source }: { source: string }) => (
  <a
    href={LINE_URL}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => pushGtmEvent("contact_line_click", { source })}
    className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
    style={{ backgroundColor: "#06C755" }}
  >
    <MessageCircle className="w-5 h-5" />
    加賴討論
  </a>
);

const Contact = () => {
  const { data: contactData } = useSiteContent<any>("contact");
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    lineId: "",
    location: "",
    floorArea: "",
    budget: "",
    timeline: "",
    requirements: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({ title: "請填寫必填欄位", description: "姓名與聯絡電話為必填", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    pushGtmEvent("lead_form_click", { form: "consultation" });
    try {
      const { error } = await supabase.from("consultation_requests" as any).insert({
        full_name: formData.name.trim(),
        phone: formData.phone.trim(),
        line_id: formData.lineId.trim() || null,
        location: formData.location.trim() || null,
        estimated_pings: formData.floorArea.trim() || null,
        budget_range: formData.budget || null,
        estimated_construction_time: formData.timeline || null,
        special_requirements: formData.requirements.trim() || null,
      });
      if (error) throw error;
      toast({ title: "預約已送出", description: "我們將盡快與您聯繫" });
      setFormData({ name: "", phone: "", lineId: "", location: "", floorArea: "", budget: "", timeline: "", requirements: "" });
    } catch (err: any) {
      toast({ title: "送出失敗", description: err.message || "請稍後再試", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneClick = () => {
    pushGtmEvent("phone_call_click", { source: "contact_page" });
  };

  if (!contactData) return null;
  const companyInfo = contactData.companyInfo;

  return (
    <MainLayout>
      <Helmet>
        <title>聯繫我們 - 築安心輕鋼構建築</title>
        <meta name="description" content="聯繫築安心，預約諮詢輕鋼構建築服務。提供免費估價、現場勘查、專業建議。" />
      </Helmet>

      <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {contactData.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {contactData.hero.description}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Company Info & Map */}
            <div className="space-y-8">
              {/* Company Info Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {companyInfo.map((info: any, index: number) => {
                  const Icon = Icons[info.icon as keyof typeof Icons] as any;
                  const isPhone = info.icon === "Phone";
                  return (
                    <div
                      key={index}
                      className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {Icon && <Icon className="w-6 h-6 text-primary" />}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                          {isPhone ? (
                            <a
                              href={`tel:${info.value}`}
                              onClick={handlePhoneClick}
                              className="font-semibold text-foreground hover:text-primary transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="font-semibold text-foreground">{info.value}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">{info.subValue}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* LINE Button in info area */}
              <div className="flex items-center gap-3">
                <LineButton source="contact_info" />
                <span className="text-sm text-muted-foreground">透過 LINE 即時諮詢</span>
              </div>

              {/* Google Map */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    公司位置
                  </h3>
                </div>
                <div className="aspect-video">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3640.2747853095647!2d120.6405!3d24.1625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDA5JzQ1LjAiTiAxMjDCsDM4JzI2LjAiRQ!5e0!3m2!1szh-TW!2stw!4v1234567890"
                    width="100%"
                    height="100%"
                    className="border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="築安心公司位置"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">預約諮詢</h2>
                <p className="text-muted-foreground">填寫以下表單，我們將在24小時內與您聯繫</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名 *</Label>
                    <Input id="name" placeholder="請輸入您的姓名" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">聯絡電話 *</Label>
                    <Input id="phone" placeholder="0912-345-678" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
                  </div>
                </div>

                {/* LINE ID & Location */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lineId">LINE ID</Label>
                    <Input id="lineId" placeholder="選填" value={formData.lineId} onChange={(e) => handleChange("lineId", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">建築所在地 *</Label>
                    <Input id="location" placeholder="例：台中市西屯區" value={formData.location} onChange={(e) => handleChange("location", e.target.value)} required />
                  </div>
                </div>

                {/* Floor Area & Budget */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="floorArea">預估坪數</Label>
                    <Input id="floorArea" placeholder="例：30坪" value={formData.floorArea} onChange={(e) => handleChange("floorArea", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">預算範圍</Label>
                    <Select value={formData.budget} onValueChange={(value) => handleChange("budget", value)}>
                      <SelectTrigger><SelectValue placeholder="請選擇預算範圍" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-300">300萬以下</SelectItem>
                        <SelectItem value="300-500">300-500萬</SelectItem>
                        <SelectItem value="500-800">500-800萬</SelectItem>
                        <SelectItem value="800-1000">800-1000萬</SelectItem>
                        <SelectItem value="over-1000">1000萬以上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <Label htmlFor="timeline">預計施工時間</Label>
                  <Select value={formData.timeline} onValueChange={(value) => handleChange("timeline", value)}>
                    <SelectTrigger><SelectValue placeholder="請選擇預計施工時間" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="within-3">3個月內</SelectItem>
                      <SelectItem value="3-6">3-6個月</SelectItem>
                      <SelectItem value="6-12">6-12個月</SelectItem>
                      <SelectItem value="over-12">1年以上</SelectItem>
                      <SelectItem value="undecided">尚未決定</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="requirements">特殊需求</Label>
                  <Textarea id="requirements" placeholder="例：無障礙設計、民宿用途、農舍需求等..." value={formData.requirements} onChange={(e) => handleChange("requirements", e.target.value)} rows={4} />
                </div>

                {/* Submit + LINE buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" size="lg" className="flex-1" disabled={submitting}>
                    {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                    {submitting ? "送出中..." : "送出預約"}
                  </Button>
                  <LineButton source="contact_form" />
                </div>

                {/* Show house booking button */}
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    pushGtmEvent("lead_form_click", { form: "showhouse" });
                    window.open(LINE_URL, "_blank");
                  }}
                >
                  🏠 預約展示屋
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  送出後，我們將在24小時內與您聯繫確認預約
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
