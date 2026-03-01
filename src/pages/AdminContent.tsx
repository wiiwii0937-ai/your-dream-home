import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useAllSections, useProjectItems, useProgressItems } from '@/hooks/useSiteContent';
import contentData from '@/data/content.json';
import { Pencil, Trash2, Plus, Database, Loader2, ArrowLeft } from 'lucide-react';

const db = supabase as any;

const SECTION_LABELS: Record<string, string> = {
  about: '關於築安心',
  advantages: '優勢工法',
  services: '服務項目',
  projects: '工程實例',
  progress: '工程進度',
  estimate: '線上估價',
  faq: '常見問答',
  knowledgeBase: '專業知識庫',
  contact: '聯繫我們',
};

export default function AdminContent() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sections = [] } = useAllSections();
  const { data: projects = [] } = useProjectItems();
  const { data: progressItems = [] } = useProgressItems();

  const [seeding, setSeeding] = useState(false);
  const [editSection, setEditSection] = useState<any>(null);
  const [editContent, setEditContent] = useState('');
  const [editProject, setEditProject] = useState<any>(null);
  const [editProgress, setEditProgress] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!user) { navigate('/auth'); return null; }
  if (!isAdmin) return <MainLayout><div className="p-12 text-center"><h1 className="text-2xl font-bold text-foreground">需要管理員權限</h1></div></MainLayout>;

  const handleSeedAll = async () => {
    setSeeding(true);
    try {
      const sectionKeys = ['about', 'advantages', 'services', 'projects', 'progress', 'estimate', 'faq', 'knowledgeBase', 'contact'];
      for (const key of sectionKeys) {
        const content = (contentData as any)[key];
        if (!content) continue;
        await db.from('site_sections').upsert({ section_key: key, content }, { onConflict: 'section_key' });
      }

      const { data: existP } = await db.from('project_items').select('id').limit(1);
      if (!existP?.length) {
        for (const [idx, item] of (contentData.projects.items as any[]).entries()) {
          await db.from('project_items').insert({
            title: item.title, category: item.category, description: item.description,
            main_image_url: item.image, fb_link: item.fbLink || '', project_date: item.date,
            link: item.link, display_order: idx,
          });
        }
      }

      const { data: existPr } = await db.from('progress_items').select('id').limit(1);
      if (!existPr?.length) {
        for (const [idx, item] of (contentData.progress.projects as any[]).entries()) {
          await db.from('progress_items').insert({
            name: item.name, location: item.location, start_date: item.startDate,
            estimated_completion: item.estimatedCompletion, progress: item.progress,
            current_phase: item.currentPhase, updates: item.updates, display_order: idx,
          });
        }
      }

      queryClient.invalidateQueries({ queryKey: ['site-section'] });
      queryClient.invalidateQueries({ queryKey: ['site-sections-all'] });
      queryClient.invalidateQueries({ queryKey: ['project-items'] });
      queryClient.invalidateQueries({ queryKey: ['progress-items'] });
      toast({ title: '初始化成功', description: '所有內容已同步至資料庫' });
    } catch (err: any) {
      toast({ title: '初始化失敗', description: err.message, variant: 'destructive' });
    } finally {
      setSeeding(false);
    }
  };

  const handleEditSection = (section: any) => {
    setEditSection(section);
    setEditContent(JSON.stringify(section.content, null, 2));
  };

  const handleSaveSection = async () => {
    try {
      const parsed = JSON.parse(editContent);
      await db.from('site_sections').update({ content: parsed }).eq('id', editSection.id);
      queryClient.invalidateQueries({ queryKey: ['site-section'] });
      queryClient.invalidateQueries({ queryKey: ['site-sections-all'] });
      setEditSection(null);
      toast({ title: '儲存成功' });
    } catch (err: any) {
      toast({ title: '儲存失敗', description: err.message, variant: 'destructive' });
    }
  };

  const handleSaveProject = async () => {
    try {
      const payload = {
        title: editProject.title, category: editProject.category,
        description: editProject.description, main_image_url: editProject.main_image_url,
        fb_link: editProject.fb_link, project_date: editProject.project_date,
        link: editProject.link, display_order: editProject.display_order || 0,
      };
      if (editProject.id) {
        await db.from('project_items').update(payload).eq('id', editProject.id);
      } else {
        const { data } = await db.from('project_items').insert({ ...payload, title: payload.title || '新專案' }).select().single();
        if (data) editProject.id = data.id;
      }
      queryClient.invalidateQueries({ queryKey: ['project-items'] });
      setEditProject(null);
      toast({ title: '專案已儲存' });
    } catch (err: any) {
      toast({ title: '儲存失敗', description: err.message, variant: 'destructive' });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('確定要刪除此專案？')) return;
    await db.from('project_items').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['project-items'] });
    toast({ title: '已刪除' });
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop();
        const path = `projects/${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('site-images').upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
        await db.from('project_images').insert({ project_id: projectId, image_url: urlData.publicUrl, display_order: 0 });
      }
      queryClient.invalidateQueries({ queryKey: ['project-items'] });
      toast({ title: '圖片上傳成功' });
    } catch (err: any) {
      toast({ title: '上傳失敗', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProjectImage = async (imageId: string) => {
    await db.from('project_images').delete().eq('id', imageId);
    queryClient.invalidateQueries({ queryKey: ['project-items'] });
  };

  const handleSaveProgress = async () => {
    try {
      const payload = {
        name: editProgress.name, location: editProgress.location,
        start_date: editProgress.start_date, estimated_completion: editProgress.estimated_completion,
        progress: editProgress.progress, current_phase: editProgress.current_phase,
        updates: editProgress.updates, display_order: editProgress.display_order || 0,
      };
      if (editProgress.id) {
        await db.from('progress_items').update(payload).eq('id', editProgress.id);
      } else {
        await db.from('progress_items').insert({ ...payload, name: payload.name || '新工程' });
      }
      queryClient.invalidateQueries({ queryKey: ['progress-items'] });
      setEditProgress(null);
      toast({ title: '進度已儲存' });
    } catch (err: any) {
      toast({ title: '儲存失敗', description: err.message, variant: 'destructive' });
    }
  };

  const handleDeleteProgress = async (id: string) => {
    if (!confirm('確定要刪除？')) return;
    await db.from('progress_items').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['progress-items'] });
    toast({ title: '已刪除' });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Button variant="ghost" size="icon" asChild><Link to="/admin"><ArrowLeft className="w-5 h-5" /></Link></Button>
                <h1 className="text-3xl font-bold text-foreground">網站內容管理</h1>
              </div>
              <p className="text-muted-foreground ml-11">管理首頁 8 大區塊的動態內容</p>
            </div>
            <Button onClick={handleSeedAll} disabled={seeding} variant="outline" className="gap-2">
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              初始化所有資料
            </Button>
          </div>

          <Tabs defaultValue="sections">
            <TabsList className="mb-6">
              <TabsTrigger value="sections">區塊內容</TabsTrigger>
              <TabsTrigger value="projects">工程實例</TabsTrigger>
              <TabsTrigger value="progress">工程進度</TabsTrigger>
            </TabsList>

            <TabsContent value="sections">
              <div className="grid gap-4">
                {sections.length === 0 && (
                  <Card><CardContent className="py-12 text-center text-muted-foreground">尚無資料，請先點擊「初始化所有資料」</CardContent></Card>
                )}
                {(sections as any[]).map((section: any) => (
                  <Card key={section.id}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div>
                        <h3 className="font-bold text-foreground">{SECTION_LABELS[section.section_key] || section.section_key}</h3>
                        <p className="text-sm text-muted-foreground">section_key: {section.section_key} · 更新於 {new Date(section.updated_at).toLocaleDateString('zh-TW')}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleEditSection(section)} className="gap-2">
                        <Pencil className="w-4 h-4" /> 編輯
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects">
              <div className="mb-4">
                <Button onClick={() => setEditProject({ title: '', category: 'villa', description: '' })} className="gap-2">
                  <Plus className="w-4 h-4" /> 新增工程實例
                </Button>
              </div>
              <div className="grid gap-4">
                {(projects as any[]).length === 0 && (
                  <Card><CardContent className="py-12 text-center text-muted-foreground">尚無專案，請先初始化或手動新增</CardContent></Card>
                )}
                {(projects as any[]).map((project: any) => (
                  <Card key={project.id}>
                    <CardContent className="flex items-center gap-4 py-4">
                      {project.main_image_url && <img src={project.main_image_url} alt="" className="w-20 h-14 object-cover rounded" />}
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.category} · {project.project_date}{project.project_images?.length > 0 && ` · ${project.project_images.length} 張圖片`}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditProject({ ...project })}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(project.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="progress">
              <div className="mb-4">
                <Button onClick={() => setEditProgress({ name: '', progress: 0, updates: [] })} className="gap-2">
                  <Plus className="w-4 h-4" /> 新增工程進度
                </Button>
              </div>
              <div className="grid gap-4">
                {(progressItems as any[]).length === 0 && (
                  <Card><CardContent className="py-12 text-center text-muted-foreground">尚無進度資料，請先初始化或手動新增</CardContent></Card>
                )}
                {(progressItems as any[]).map((item: any) => (
                  <Card key={item.id}>
                    <CardContent className="flex items-center gap-4 py-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.location} · {item.current_phase}</p>
                      </div>
                      <div className="text-center min-w-[60px]">
                        <div className="text-2xl font-bold text-primary">{item.progress}%</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditProgress({ ...item })}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProgress(item.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Section Edit Dialog */}
      <Dialog open={!!editSection} onOpenChange={(o) => !o && setEditSection(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>編輯區塊：{SECTION_LABELS[editSection?.section_key] || ''}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>內容 (JSON)</Label>
              <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={20} className="font-mono text-sm" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditSection(null)}>取消</Button>
              <Button onClick={handleSaveSection}>儲存</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Edit Dialog */}
      <Dialog open={!!editProject} onOpenChange={(o) => !o && setEditProject(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editProject?.id ? '編輯專案' : '新增專案'}</DialogTitle></DialogHeader>
          {editProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>標題</Label><Input value={editProject.title || ''} onChange={(e) => setEditProject({ ...editProject, title: e.target.value })} /></div>
                <div><Label>分類</Label><Input value={editProject.category || ''} onChange={(e) => setEditProject({ ...editProject, category: e.target.value })} placeholder="villa, mobile, farm..." /></div>
              </div>
              <div><Label>描述</Label><Textarea value={editProject.description || ''} onChange={(e) => setEditProject({ ...editProject, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>日期</Label><Input value={editProject.project_date || ''} onChange={(e) => setEditProject({ ...editProject, project_date: e.target.value })} placeholder="2024-03-25" /></div>
                <div><Label>連結</Label><Input value={editProject.link || ''} onChange={(e) => setEditProject({ ...editProject, link: e.target.value })} /></div>
              </div>
              <div><Label>主圖 URL</Label><Input value={editProject.main_image_url || ''} onChange={(e) => setEditProject({ ...editProject, main_image_url: e.target.value })} /></div>
              <div><Label>FB 連結</Label><Input value={editProject.fb_link || ''} onChange={(e) => setEditProject({ ...editProject, fb_link: e.target.value })} /></div>

              {editProject.id && (
                <div>
                  <Label className="mb-2 block">專案圖片（多圖上傳）</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(editProject.project_images || []).map((img: any) => (
                      <div key={img.id} className="relative group">
                        <img src={img.image_url} alt="" className="w-24 h-16 object-cover rounded border border-border" />
                        <button onClick={() => handleDeleteProjectImage(img.id)} className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
                      </div>
                    ))}
                  </div>
                  <Input type="file" accept="image/*" multiple onChange={(e) => handleProjectImageUpload(e, editProject.id)} disabled={uploading} />
                  {uploading && <p className="text-sm text-muted-foreground mt-1">上傳中...</p>}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditProject(null)}>取消</Button>
                <Button onClick={handleSaveProject}>儲存</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Progress Edit Dialog */}
      <Dialog open={!!editProgress} onOpenChange={(o) => !o && setEditProgress(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editProgress?.id ? '編輯進度' : '新增進度'}</DialogTitle></DialogHeader>
          {editProgress && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>工程名稱</Label><Input value={editProgress.name || ''} onChange={(e) => setEditProgress({ ...editProgress, name: e.target.value })} /></div>
                <div><Label>位置</Label><Input value={editProgress.location || ''} onChange={(e) => setEditProgress({ ...editProgress, location: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>開工日期</Label><Input value={editProgress.start_date || ''} onChange={(e) => setEditProgress({ ...editProgress, start_date: e.target.value })} placeholder="2024-11-01" /></div>
                <div><Label>預計完工</Label><Input value={editProgress.estimated_completion || ''} onChange={(e) => setEditProgress({ ...editProgress, estimated_completion: e.target.value })} placeholder="2025-02-28" /></div>
              </div>
              <div><Label>目前階段</Label><Input value={editProgress.current_phase || ''} onChange={(e) => setEditProgress({ ...editProgress, current_phase: e.target.value })} /></div>
              <div>
                <Label>工程進度：{editProgress.progress || 0}%</Label>
                <Slider value={[editProgress.progress || 0]} onValueChange={(v) => setEditProgress({ ...editProgress, progress: v[0] })} max={100} step={1} className="mt-2" />
              </div>
              <div>
                <Label>週進度更新 (JSON)</Label>
                <Textarea
                  value={JSON.stringify(editProgress.updates || [], null, 2)}
                  onChange={(e) => { try { setEditProgress({ ...editProgress, updates: JSON.parse(e.target.value) }); } catch {} }}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditProgress(null)}>取消</Button>
                <Button onClick={handleSaveProgress}>儲存</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
