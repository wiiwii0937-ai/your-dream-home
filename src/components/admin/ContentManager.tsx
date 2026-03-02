import { useState } from 'react';
import { useSiteContent, useUpdateSiteContent, SiteContent } from '@/hooks/useSiteContent';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Settings, Image as ImageIcon, CheckCircle2, AlertCircle, ChevronRight, Edit3 } from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';
import { Slider } from '@/components/ui/slider';

const SECTION_LABELS: Record<string, string> = {
    about: '關於築安心',
    advantages: '優勢工法',
    services: '服務項目',
    projects: '工程實例',
    progress: '工程進度',
    estimate: '線上估價',
    faq: '專業知識庫',
    contact: '聯繫我們',
};

export const ContentManager = () => {
    const { data: contentList = [], isLoading } = useSiteContent();
    const updateMutation = useUpdateSiteContent();
    const { toast } = useToast();

    const [editingSection, setEditingSection] = useState<SiteContent | null>(null);
    const [formData, setFormData] = useState<Partial<SiteContent>>({});

    const handleEdit = (section: SiteContent) => {
        setEditingSection(section);
        setFormData(section);
    };

    const handleSave = async () => {
        if (!editingSection) return;
        try {
            await updateMutation.mutateAsync({
                ...formData,
                section_key: editingSection.section_key,
            } as any);
            toast({ title: '內容更新成功' });
            setEditingSection(null);
        } catch (err: any) {
            toast({ title: '更新失敗', description: err.message, variant: 'destructive' });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    網頁內容管理
                </CardTitle>
                <CardDescription>
                    管理首頁 8 個核心區塊的文字與圖片內容
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(SECTION_LABELS).map(([key, label]) => {
                    const section = (contentList as SiteContent[]).find(s => s.section_key === key);
                    return (
                        <Card key={key} className="overflow-hidden border border-border/60 hover:border-primary/40 transition-colors group">
                            <div className="aspect-video bg-muted relative">
                                {section?.image_url ? (
                                    <img src={section.image_url} alt={label} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        <ImageIcon className="w-8 h-8 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleEdit(section || { section_key: key, title: label } as any)}
                                        title={`編輯 ${label} 的內容`}
                                    >
                                        編輯內容
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-sm">{label}</h4>
                                    {section ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 text-amber-500" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                    {section?.title || '尚未初始化內容'}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </CardContent>

            {/* Edit Dialog */}
            <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit3 className="w-5 h-5" />
                            編輯 - {SECTION_LABELS[editingSection?.section_key || '']}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label>標題</Label>
                            <Input
                                value={formData.title || ''}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="輸入區塊標題"
                            />
                        </div>

                        {/* Basic Content */}
                        {editingSection?.section_key !== 'progress' && (
                            <div className="space-y-2">
                                <Label>描述內容 / 引言</Label>
                                <Textarea
                                    value={formData.content?.description || formData.content || ''}
                                    onChange={(e) => setFormData({ ...formData, content: { ...formData.content, description: e.target.value } })}
                                    placeholder="輸入描述文字"
                                    rows={4}
                                />
                            </div>
                        )}

                        {/* Special Editor: Project Progress */}
                        {editingSection?.section_key === 'progress' && (
                            <div className="space-y-4 p-4 rounded-lg bg-secondary/30 border border-border">
                                <Label className="flex justify-between">
                                    <span>完工進度百分比</span>
                                    <span className="text-primary font-bold">{formData.metadata?.progress || 0}%</span>
                                </Label>
                                <Slider
                                    value={[formData.metadata?.progress || 0]}
                                    onValueChange={([val]) => setFormData({
                                        ...formData,
                                        metadata: { ...formData.metadata, progress: val }
                                    })}
                                    max={100}
                                    step={1}
                                />
                                <div className="space-y-2">
                                    <Label>目前階段名稱</Label>
                                    <Input
                                        value={formData.metadata?.currentPhase || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            metadata: { ...formData.metadata, currentPhase: e.target.value }
                                        })}
                                        placeholder="例如：基礎工程、結構焊接..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>主圖 / 封面</Label>
                            <ImageUpload
                                value={formData.image_url || ''}
                                onChange={(url) => setFormData({ ...formData, image_url: url })}
                                folder={`content/${editingSection?.section_key}`}
                            />
                        </div>

                        {/* Special Editor: Multi-image for Engineering Examples */}
                        {editingSection?.section_key === 'projects' && (
                            <div className="space-y-4 border-t pt-4">
                                <Label>案例多圖 (輪播/燈箱)</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {(formData.images || []).map((img, i) => (
                                        <div key={i} className="relative group aspect-square">
                                            <img src={img} alt={`案例圖片 ${i + 1}`} className="w-full h-full object-cover rounded-md" />
                                            <button
                                                onClick={() => {
                                                    const newImgs = [...(formData.images || [])];
                                                    newImgs.splice(i, 1);
                                                    setFormData({ ...formData, images: newImgs });
                                                }}
                                                className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                                                title="刪除圖片"
                                                aria-label="刪除這張圖片"
                                            >
                                                <AlertCircle className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="aspect-square">
                                        <ImageUpload
                                            value=""
                                            onChange={(url) => setFormData({ ...formData, images: [...(formData.images || []), url] })}
                                            className="h-full [&_img]:h-10 [&_.p-8]:p-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingSection(null)}>取消</Button>
                        <Button onClick={handleSave} disabled={updateMutation.isPending}>
                            {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            儲存更新
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};
