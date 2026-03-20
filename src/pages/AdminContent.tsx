import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useAllSiteContent, useUpdateSiteContent, useInitializeSiteContent, SECTION_KEYS, SectionKey } from '@/hooks/useSiteContent';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Save, RefreshCw, Database, Edit, Trash2, Plus, Upload, Image, X, ChevronLeft, ChevronRight, ClipboardList, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import contentData from '@/data/content.json';

const SECTION_LABELS: Record<string, string> = {
  about: '關於築安心',
  advantages: '優勢工法',
  services: '服務項目',
  projects: '工程實例',
  progress: '工程進度',
  estimate: '線上估價',
  faq: '常見問答 / 知識庫',
  contact: '聯繫我們',
  knowledgeBase: '專業知識庫',
};

// ─── Project Items CRUD ───
interface ProjectItem {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  location: string | null;
  area: string | null;
  main_image_url: string | null;
  fb_link: string | null;
  project_date: string | null;
  link: string | null;
  slug: string | null;
  display_order: number | null;
}

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  display_order: number | null;
}

// ─── Progress Items ───
interface ProgressItem {
  id: string;
  name: string;
  location: string | null;
  progress: number | null;
  current_phase: string | null;
  start_date: string | null;
  estimated_completion: string | null;
  updates: any;
  display_order: number | null;
}

// ─── Consultation Requests ───
interface ConsultationRequest {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  line_id: string | null;
  location: string | null;
  estimated_pings: string | null;
  budget_range: string | null;
  estimated_construction_time: string | null;
  special_requirements: string | null;
  status: string;
}

export default function AdminContent() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { data: sections, isLoading } = useAllSiteContent();
  const updateMutation = useUpdateSiteContent();
  const initMutation = useInitializeSiteContent();

  const [activeTab, setActiveTab] = useState<string>('sections');
  // Section editing
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  // Project items
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [lightboxProject, setLightboxProject] = useState<string | null>(null);
  const [lightboxImages, setLightboxImages] = useState<ProjectImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  // Progress items
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  // Consultation requests
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (activeTab === 'projects') fetchProjects();
    if (activeTab === 'progress') fetchProgress();
    if (activeTab === 'consultations') fetchConsultations();
  }, [activeTab]);

  // ─── Fetch functions ───
  const fetchProjects = async () => {
    const { data } = await supabase.from('project_items').select('*').order('display_order');
    if (data) setProjectItems(data);
  };

  const fetchProjectImages = async (projectId: string) => {
    const { data } = await supabase.from('project_images').select('*').eq('project_id', projectId).order('display_order');
    if (data) setProjectImages(data);
  };

  const fetchProgress = async () => {
    const { data } = await supabase.from('progress_items').select('*').order('display_order');
    if (data) setProgressItems(data);
  };

  const fetchConsultations = async () => {
    const { data } = await supabase.from('consultation_requests' as any).select('*').order('created_at', { ascending: false });
    if (data) setConsultations(data as any);
  };

  const handleToggleConsultationStatus = async (item: ConsultationRequest) => {
    const newStatus = item.status === 'pending' ? 'contacted' : 'pending';
    await supabase.from('consultation_requests' as any).update({ status: newStatus }).eq('id', item.id);
    setConsultations(prev => prev.map(c => c.id === item.id ? { ...c, status: newStatus } : c));
    toast({ title: '狀態已更新', description: `${item.full_name}: ${newStatus === 'contacted' ? '已聯繫' : '待處理'}` });
  };

  const handleDeleteConsultation = async (id: string) => {
    await supabase.from('consultation_requests' as any).delete().eq('id', id);
    setConsultations(prev => prev.filter(c => c.id !== id));
    toast({ title: '已刪除' });
  };

  // ─── Section handlers ───
  const handleEditSection = (sectionKey: string) => {
    const section = sections?.find((s: any) => s.section_key === sectionKey);
    const content = section?.content ?? (contentData as any)[sectionKey];
    setEditContent(JSON.stringify(content, null, 2));
    setEditingSection(sectionKey);
  };

  const handleSaveSection = async () => {
    if (!editingSection) return;
    try {
      const parsed = JSON.parse(editContent);
      await updateMutation.mutateAsync({ sectionKey: editingSection, content: parsed });
      toast({ title: '已儲存', description: `${SECTION_LABELS[editingSection]} 內容已更新` });
      setEditingSection(null);
    } catch (e: any) {
      toast({ title: '錯誤', description: e.message || 'JSON 格式錯誤', variant: 'destructive' });
    }
  };

  const handleInitialize = async () => {
    await initMutation.mutateAsync();
    toast({ title: '初始化完成', description: '已將本地內容同步到資料庫' });
  };

  // ─── Project CRUD ───
  const handleSaveProject = async () => {
    if (!editingProject) return;
    // Slug uniqueness check
    if (editingProject.slug) {
      const { data: existing } = await supabase
        .from('project_items')
        .select('id')
        .eq('slug', editingProject.slug)
        .neq('id', editingProject.id.startsWith('new-') ? '00000000-0000-0000-0000-000000000000' : editingProject.id)
        .maybeSingle();
      if (existing) {
        toast({ title: '錯誤', description: `URL 別名 "${editingProject.slug}" 已被其他專案使用，請更換`, variant: 'destructive' });
        return;
      }
    }
    const { id, ...rest } = editingProject;
    if (id.startsWith('new-')) {
      const { error } = await supabase.from('project_items').insert({ ...rest });
      if (error) { toast({ title: '錯誤', description: error.message, variant: 'destructive' }); return; }
    } else {
      const { error } = await supabase.from('project_items').update(rest).eq('id', id);
      if (error) { toast({ title: '錯誤', description: error.message, variant: 'destructive' }); return; }
    }
    toast({ title: '已儲存' });
    setEditingProject(null);
    fetchProjects();
  };

  const handleDeleteProject = async (id: string) => {
    await supabase.from('project_images').delete().eq('project_id', id);
    await supabase.from('project_items').delete().eq('id', id);
    toast({ title: '已刪除' });
    fetchProjects();
  };

  const handleUploadProjectImage = async (projectId: string, file: File) => {
    const path = `projects/${projectId}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from('site-images').upload(path, file);
    if (upErr) { toast({ title: '上傳失敗', description: upErr.message, variant: 'destructive' }); return; }
    const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
    await supabase.from('project_images').insert({
      project_id: projectId,
      image_url: urlData.publicUrl,
      display_order: projectImages.length,
    });
    fetchProjectImages(projectId);
    toast({ title: '圖片已上傳' });
  };

  const handleDeleteProjectImage = async (imgId: string) => {
    await supabase.from('project_images').delete().eq('id', imgId);
    if (editingProject) fetchProjectImages(editingProject.id);
    toast({ title: '圖片已刪除' });
  };

  // ─── Progress handlers ───
  const [editingProgress, setEditingProgress] = useState<ProgressItem | null>(null);
  const [progressUploading, setProgressUploading] = useState(false);

  const handleUpdateProgress = async (item: ProgressItem, newProgress: number) => {
    await supabase.from('progress_items').update({ progress: newProgress }).eq('id', item.id);
    setProgressItems(prev => prev.map(p => p.id === item.id ? { ...p, progress: newProgress } : p));
    toast({ title: '進度已更新', description: `${item.name}: ${newProgress}%` });
  };

  const handleSaveProgress = async () => {
    if (!editingProgress) return;
    const { id, ...rest } = editingProgress;
    if (id.startsWith('new-')) {
      const { error } = await supabase.from('progress_items').insert({ ...rest });
      if (error) { toast({ title: '錯誤', description: error.message, variant: 'destructive' }); return; }
    } else {
      const { error } = await supabase.from('progress_items').update(rest).eq('id', id);
      if (error) { toast({ title: '錯誤', description: error.message, variant: 'destructive' }); return; }
    }
    toast({ title: '已儲存' });
    setEditingProgress(null);
    fetchProgress();
  };

  const handleDeleteProgress = async (id: string) => {
    await supabase.from('progress_items').delete().eq('id', id);
    toast({ title: '已刪除' });
    fetchProgress();
  };

  const handleUploadProgressImage = async (file: File) => {
    if (!editingProgress) return;
    setProgressUploading(true);
    const path = `progress/${editingProgress.id}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from('site-images').upload(path, file);
    if (upErr) { toast({ title: '上傳失敗', description: upErr.message, variant: 'destructive' }); setProgressUploading(false); return; }
    const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
    // Store the image URL in the updates JSON as a photo field
    const updatedItem = { ...editingProgress, updates: { ...(editingProgress.updates as any || {}), photo: urlData.publicUrl } };
    setEditingProgress(updatedItem);
    setProgressUploading(false);
    toast({ title: '圖片已上傳' });
  };

  // ─── Lightbox ───
  const openLightbox = async (projectId: string) => {
    const { data } = await supabase.from('project_images').select('*').eq('project_id', projectId).order('display_order');
    if (data && data.length > 0) {
      setLightboxImages(data);
      setLightboxIndex(0);
      setLightboxProject(projectId);
    } else {
      toast({ title: '無圖片', description: '此專案尚無額外圖片' });
    }
  };

  if (authLoading || isLoading) {
    return <MainLayout><div className="flex items-center justify-center min-h-screen"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">內容管理</h1>
                <p className="text-sm text-muted-foreground">管理網站 8 大核心區塊的動態內容</p>
              </div>
            </div>
            <Button onClick={handleInitialize} disabled={initMutation.isPending} variant="outline" className="gap-2">
              <Database className="w-4 h-4" />
              {initMutation.isPending ? '同步中...' : '資料初始化'}
            </Button>
          </div>

          {!isAdmin && (
            <Card className="mb-6 border-destructive">
              <CardContent className="py-4 text-destructive text-sm">
                ⚠️ 您不是管理員，無法編輯內容。請聯繫管理員取得權限。
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-2 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList>
                <TabsTrigger value="sections">區塊內容</TabsTrigger>
                <TabsTrigger value="projects">工程實例</TabsTrigger>
                <TabsTrigger value="progress">工程進度</TabsTrigger>
                <TabsTrigger value="consultations" className="gap-1">
                  <ClipboardList className="w-4 h-4" /> 預約管理
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/admin/analytics')}>
              <BarChart3 className="w-4 h-4" /> 流量統計
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>

            {/* ── Tab: Sections ── */}
            <TabsContent value="sections">
              <div className="grid gap-4">
                {SECTION_KEYS.map((key) => {
                  const section = sections?.find((s: any) => s.section_key === key);
                  return (
                    <Card key={key}>
                      <CardContent className="flex items-center justify-between py-4">
                        <div>
                          <h3 className="font-semibold text-foreground">{SECTION_LABELS[key] || key}</h3>
                          <p className="text-sm text-muted-foreground">
                            {section ? `最後更新: ${new Date(section.updated_at).toLocaleString('zh-TW')}` : '尚未同步至資料庫'}
                          </p>
                        </div>
                        <Button onClick={() => handleEditSection(key)} disabled={!isAdmin} size="sm" className="gap-2">
                          <Edit className="w-4 h-4" /> 編輯
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* ── Tab: Projects ── */}
            <TabsContent value="projects">
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => setEditingProject({
                    id: `new-${Date.now()}`, title: '', category: null, description: null,
                    location: null, area: null, main_image_url: null, fb_link: null,
                    project_date: null, link: null, slug: null, display_order: projectItems.length,
                  })}
                  disabled={!isAdmin} className="gap-2"
                >
                  <Plus className="w-4 h-4" /> 新增專案
                </Button>
              </div>
              <div className="grid gap-4">
                {projectItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="flex items-center gap-4 py-4">
                      {item.main_image_url && (
                        <img src={item.main_image_url} alt={item.title} className="w-20 h-14 object-cover rounded" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.category} · {item.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openLightbox(item.id)} className="gap-1">
                          <Image className="w-4 h-4" /> 圖片
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditingProject({ ...item }); fetchProjectImages(item.id); }} disabled={!isAdmin}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(item.id)} disabled={!isAdmin}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {projectItems.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">尚無工程專案，請點擊「新增專案」</p>
                )}
              </div>
            </TabsContent>

            {/* ── Tab: Progress ── */}
            <TabsContent value="progress">
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => setEditingProgress({
                    id: `new-${Date.now()}`, name: '', location: null, progress: 0,
                    current_phase: null, start_date: null, estimated_completion: null,
                    updates: null, display_order: progressItems.length,
                  })}
                  disabled={!isAdmin} className="gap-2"
                >
                  <Plus className="w-4 h-4" /> 新增工程進度
                </Button>
              </div>
              <div className="grid gap-4">
                {progressItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="py-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.location} · {item.current_phase}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-primary">{item.progress ?? 0}%</span>
                          <Button size="sm" variant="outline" onClick={() => setEditingProgress({ ...item })} disabled={!isAdmin}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteProgress(item.id)} disabled={!isAdmin}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[item.progress ?? 0]}
                          min={0}
                          max={100}
                          step={1}
                          onValueCommit={(v) => handleUpdateProgress(item, v[0])}
                          disabled={!isAdmin}
                          className="flex-1"
                        />
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
                          style={{ width: `${item.progress ?? 0}%` }}
                        />
                      </div>
                      {/* Show photo if exists */}
                      {(item.updates as any)?.photo && (
                        <img src={(item.updates as any).photo} alt={item.name} className="w-32 h-20 object-cover rounded-lg" />
                      )}
                    </CardContent>
                  </Card>
                ))}
                {progressItems.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">尚無工程進度資料，請點擊「新增工程進度」</p>
                )}
              </div>
            </TabsContent>

            {/* ── Tab: Consultations ── */}
            <TabsContent value="consultations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" /> 預約諮詢申請
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {consultations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">尚無預約諮詢申請</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>時間</TableHead>
                            <TableHead>姓名</TableHead>
                            <TableHead>電話</TableHead>
                            <TableHead>LINE ID</TableHead>
                            <TableHead>建築所在地</TableHead>
                            <TableHead>坪數</TableHead>
                            <TableHead>預算</TableHead>
                            <TableHead>施工時間</TableHead>
                            <TableHead>需求</TableHead>
                            <TableHead>狀態</TableHead>
                            <TableHead>操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {consultations.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="whitespace-nowrap text-xs">{new Date(item.created_at).toLocaleString('zh-TW')}</TableCell>
                              <TableCell className="font-medium">{item.full_name}</TableCell>
                              <TableCell>{item.phone}</TableCell>
                              <TableCell>{item.line_id || '-'}</TableCell>
                              <TableCell>{item.location || '-'}</TableCell>
                              <TableCell>{item.estimated_pings || '-'}</TableCell>
                              <TableCell>{item.budget_range || '-'}</TableCell>
                              <TableCell>{item.estimated_construction_time || '-'}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{item.special_requirements || '-'}</TableCell>
                              <TableCell>
                                <Badge variant={item.status === 'contacted' ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => handleToggleConsultationStatus(item)}>
                                  {item.status === 'contacted' ? (
                                    <><CheckCircle className="w-3 h-3 mr-1" /> 已聯繫</>
                                  ) : (
                                    <><Clock className="w-3 h-3 mr-1" /> 待處理</>
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteConsultation(item.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ── Section Edit Dialog ── */}
      <Dialog open={!!editingSection} onOpenChange={(o) => !o && setEditingSection(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>編輯 {editingSection ? SECTION_LABELS[editingSection] : ''}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>內容 (JSON 格式)</Label>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={20}
              className="font-mono text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSection(null)}>取消</Button>
            <Button onClick={handleSaveSection} disabled={updateMutation.isPending} className="gap-2">
              <Save className="w-4 h-4" /> {updateMutation.isPending ? '儲存中...' : '儲存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Project Edit Dialog ── */}
      <Dialog open={!!editingProject} onOpenChange={(o) => !o && setEditingProject(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject?.id.startsWith('new-') ? '新增' : '編輯'}工程專案</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>標題 *</Label>
                  <Input value={editingProject.title} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>分類</Label>
                  <Input value={editingProject.category || ''} onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })} placeholder="villa / mobile / farm..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>描述</Label>
                <Textarea value={editingProject.description || ''} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>地點</Label>
                  <Input value={editingProject.location || ''} onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>面積</Label>
                  <Input value={editingProject.area || ''} onChange={(e) => setEditingProject({ ...editingProject, area: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>主圖 URL</Label>
                <Input value={editingProject.main_image_url || ''} onChange={(e) => setEditingProject({ ...editingProject, main_image_url: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>URL 別名 (Slug)</Label>
                <Input
                  value={editingProject.slug || ''}
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                    setEditingProject({ ...editingProject, slug: val || null });
                  }}
                  placeholder="例如：yo-house（僅限英文小寫、數字與短橫線）"
                />
                <p className="text-xs text-muted-foreground">
                  用於網址：/portfolio/{editingProject.slug || '...'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>FB 連結</Label>
                  <Input value={editingProject.fb_link || ''} onChange={(e) => setEditingProject({ ...editingProject, fb_link: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>專案日期</Label>
                  <Input type="date" value={editingProject.project_date || ''} onChange={(e) => setEditingProject({ ...editingProject, project_date: e.target.value })} />
                </div>
              </div>

              {/* Multi-image upload for existing projects */}
              {!editingProject.id.startsWith('new-') && (
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">專案圖片</Label>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadProjectImage(editingProject.id, file);
                          e.target.value = '';
                        }}
                      />
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 cursor-pointer">
                        <Upload className="w-4 h-4" /> 上傳圖片
                      </span>
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {projectImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img src={img.image_url} alt={img.caption || ''} className="w-full aspect-square object-cover rounded-lg" />
                        <button
                          onClick={() => handleDeleteProjectImage(img.id)}
                          className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProject(null)}>取消</Button>
            <Button onClick={handleSaveProject} className="gap-2">
              <Save className="w-4 h-4" /> 儲存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Lightbox Dialog ── */}
      <Dialog open={!!lightboxProject} onOpenChange={(o) => !o && setLightboxProject(null)}>
        <DialogContent className="max-w-4xl p-2">
          {lightboxImages.length > 0 && (
            <div className="relative">
              <img
                src={lightboxImages[lightboxIndex]?.image_url}
                alt=""
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
              {lightboxImages.length > 1 && (
                <>
                  <button
                    onClick={() => setLightboxIndex((i) => (i - 1 + lightboxImages.length) % lightboxImages.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setLightboxIndex((i) => (i + 1) % lightboxImages.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              <div className="text-center text-sm text-muted-foreground mt-2">
                {lightboxIndex + 1} / {lightboxImages.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* ── Progress Edit Dialog ── */}
      <Dialog open={!!editingProgress} onOpenChange={(o) => !o && setEditingProgress(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProgress?.id.startsWith('new-') ? '新增' : '編輯'}工程進度</DialogTitle>
          </DialogHeader>
          {editingProgress && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>建案名稱 *</Label>
                <Input value={editingProgress.name} onChange={(e) => setEditingProgress({ ...editingProgress, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>所在地 / 案址</Label>
                  <Input value={editingProgress.location || ''} onChange={(e) => setEditingProgress({ ...editingProgress, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>目前階段描述</Label>
                  <Input value={editingProgress.current_phase || ''} onChange={(e) => setEditingProgress({ ...editingProgress, current_phase: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>開工日期</Label>
                  <Input type="date" value={editingProgress.start_date || ''} onChange={(e) => setEditingProgress({ ...editingProgress, start_date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>預計完工</Label>
                  <Input type="date" value={editingProgress.estimated_completion || ''} onChange={(e) => setEditingProgress({ ...editingProgress, estimated_completion: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>進度百分比: {editingProgress.progress ?? 0}%</Label>
                <Slider
                  value={[editingProgress.progress ?? 0]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(v) => setEditingProgress({ ...editingProgress, progress: v[0] })}
                />
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
                    style={{ width: `${editingProgress.progress ?? 0}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>現場照片</Label>
                {(editingProgress.updates as any)?.photo && (
                  <div className="relative inline-block">
                    <img src={(editingProgress.updates as any).photo} alt="" className="w-40 h-28 object-cover rounded-lg" />
                    <button
                      onClick={() => setEditingProgress({ ...editingProgress, updates: { ...(editingProgress.updates as any || {}), photo: null } })}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadProgressImage(file);
                      e.target.value = '';
                    }}
                  />
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 cursor-pointer">
                    <Upload className="w-4 h-4" /> {progressUploading ? '上傳中...' : '上傳照片'}
                  </span>
                </label>
              </div>
              <div className="space-y-2">
                <Label>排序</Label>
                <Input type="number" value={editingProgress.display_order ?? 0} onChange={(e) => setEditingProgress({ ...editingProgress, display_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProgress(null)}>取消</Button>
            <Button onClick={handleSaveProgress} className="gap-2">
              <Save className="w-4 h-4" /> 儲存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </MainLayout>
  );
}
