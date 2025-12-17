import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Plus, Pencil, Trash2, LogOut, FileText, Image as ImageIcon } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

interface Post {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
}

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', image_url: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: '載入失敗', description: error.message, variant: 'destructive' });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({ title: '請輸入標題', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (editingPost) {
        const { error } = await supabase
          .from('posts')
          .update({
            title: formData.title,
            content: formData.content || null,
            image_url: formData.image_url || null,
          })
          .eq('id', editingPost.id);
        
        if (error) throw error;
        toast({ title: '更新成功' });
      } else {
        const { error } = await supabase
          .from('posts')
          .insert({
            title: formData.title,
            content: formData.content || null,
            image_url: formData.image_url || null,
            author_id: user?.id,
          });
        
        if (error) throw error;
        toast({ title: '新增成功' });
      }
      
      setDialogOpen(false);
      setEditingPost(null);
      setFormData({ title: '', content: '', image_url: '' });
      fetchPosts();
    } catch (error: any) {
      toast({ 
        title: '操作失敗', 
        description: error.message.includes('row-level security') 
          ? '您沒有權限執行此操作，請聯繫管理員' 
          : error.message, 
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content || '',
      image_url: post.image_url || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      toast({ title: '刪除成功' });
      fetchPosts();
    } catch (error: any) {
      toast({ 
        title: '刪除失敗', 
        description: error.message.includes('row-level security') 
          ? '您沒有權限執行此操作' 
          : error.message, 
        variant: 'destructive' 
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const openNewDialog = () => {
    setEditingPost(null);
    setFormData({ title: '', content: '', image_url: '' });
    setDialogOpen(true);
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">後台管理</h1>
              <p className="text-muted-foreground mt-1">
                {user?.email} {isAdmin && <span className="text-primary">(管理員)</span>}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              登出
            </Button>
          </div>

          {/* Posts Management */}
          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                文章管理
              </CardTitle>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openNewDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    新增文章
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingPost ? '編輯文章' : '新增文章'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">標題 *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="請輸入標題"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">內容</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="請輸入內容"
                        rows={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image_url">圖片網址</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <Button onClick={handleSave} className="w-full" disabled={saving}>
                      {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingPost ? '更新' : '新增'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  尚無文章，點擊上方按鈕新增第一篇文章
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>標題</TableHead>
                        <TableHead className="hidden md:table-cell">圖片</TableHead>
                        <TableHead className="hidden sm:table-cell">建立日期</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {post.title}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {post.image_url ? (
                              <img 
                                src={post.image_url} 
                                alt={post.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString('zh-TW')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(post)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      此操作無法復原，文章將被永久刪除。
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(post.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      刪除
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {!isAdmin && (
            <Card className="mt-4 border-yellow-500/50 bg-yellow-500/10">
              <CardContent className="pt-6">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ 您目前沒有管理員權限，無法新增、編輯或刪除文章。請聯繫系統管理員授予權限。
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
