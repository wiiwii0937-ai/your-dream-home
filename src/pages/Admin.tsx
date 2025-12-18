import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, Plus, Pencil, Trash2, LogOut, FileText, 
  Image as ImageIcon, LayoutDashboard, Settings, Users, 
  Calendar, TrendingUp, Home, Shield, Eye
} from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: '文章總數', value: posts.length, icon: FileText, color: 'text-primary' },
    { label: '本月新增', value: posts.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length, icon: TrendingUp, color: 'text-emerald-500' },
    { label: '已發佈', value: posts.filter(p => p.published_at).length, icon: Eye, color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">築</span>
            </div>
            <div>
              <h1 className="font-bold text-foreground group-hover:text-primary transition-colors">築安心</h1>
              <p className="text-xs text-muted-foreground">管理後台</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            主選單
          </div>
          <Button variant="secondary" className="w-full justify-start gap-3 h-11">
            <LayoutDashboard className="w-4 h-4" />
            儀表板
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground">
            <FileText className="w-4 h-4" />
            文章管理
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground" disabled>
            <Users className="w-4 h-4" />
            用戶管理
            <Badge variant="outline" className="ml-auto text-xs">即將推出</Badge>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground" disabled>
            <Settings className="w-4 h-4" />
            系統設定
            <Badge variant="outline" className="ml-auto text-xs">即將推出</Badge>
          </Button>

          <Separator className="my-4" />

          <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            快速連結
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground" asChild>
            <Link to="/">
              <Home className="w-4 h-4" />
              返回首頁
            </Link>
          </Button>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? '管理員' : '一般用戶'}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full mt-3 justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            登出帳號
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="lg:hidden p-4 border-b border-border bg-card flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">築</span>
            </div>
            <span className="font-bold">管理後台</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </header>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">儀表板</h1>
              <p className="text-muted-foreground mt-1">
                歡迎回來，{user?.email?.split('@')[0]}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Permission Warning */}
          {!isAdmin && (
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-amber-600 dark:text-amber-400">權限受限</p>
                  <p className="text-sm text-muted-foreground">
                    您目前沒有管理員權限，無法新增、編輯或刪除文章。請聯繫系統管理員授予權限。
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Posts Management Card */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-border bg-secondary/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="w-5 h-5 text-primary" />
                    文章管理
                  </CardTitle>
                  <CardDescription className="mt-1">
                    管理網站的所有文章內容
                  </CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openNewDialog} className="gap-2" disabled={!isAdmin}>
                      <Plus className="w-4 h-4" />
                      新增文章
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-xl">
                        {editingPost ? '編輯文章' : '新增文章'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          文章標題 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="請輸入文章標題"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content" className="text-sm font-medium">內容</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="請輸入文章內容..."
                          rows={6}
                          className="resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image_url" className="text-sm font-medium">
                          封面圖片網址
                        </Label>
                        <Input
                          id="image_url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="h-11"
                        />
                        {formData.image_url && (
                          <div className="mt-2 rounded-lg overflow-hidden border border-border">
                            <img 
                              src={formData.image_url} 
                              alt="Preview" 
                              className="w-full h-32 object-cover"
                              onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                          </div>
                        )}
                      </div>
                      <Separator />
                      <Button onClick={handleSave} className="w-full h-11" disabled={saving}>
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {editingPost ? '儲存變更' : '建立文章'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p>載入文章中...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">尚無文章</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    點擊上方按鈕新增第一篇文章
                  </p>
                  {isAdmin && (
                    <Button onClick={openNewDialog} variant="outline" className="gap-2">
                      <Plus className="w-4 h-4" />
                      新增文章
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                        <TableHead className="w-12 text-center">#</TableHead>
                        <TableHead>標題</TableHead>
                        <TableHead className="hidden md:table-cell w-20">封面</TableHead>
                        <TableHead className="hidden sm:table-cell w-32">建立日期</TableHead>
                        <TableHead className="hidden sm:table-cell w-24">狀態</TableHead>
                        <TableHead className="text-right w-28">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post, index) => (
                        <TableRow key={post.id} className="group">
                          <TableCell className="text-center text-muted-foreground font-mono text-sm">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[300px]">
                              <p className="font-medium truncate">{post.title}</p>
                              {post.content && (
                                <p className="text-sm text-muted-foreground truncate mt-0.5">
                                  {post.content.slice(0, 50)}...
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {post.image_url ? (
                              <img 
                                src={post.image_url} 
                                alt={post.title}
                                className="w-14 h-10 object-cover rounded-md border border-border"
                              />
                            ) : (
                              <div className="w-14 h-10 bg-secondary rounded-md flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                            {new Date(post.created_at).toLocaleDateString('zh-TW')}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant={post.published_at ? "default" : "secondary"} className="text-xs">
                              {post.published_at ? '已發佈' : '草稿'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(post)}
                                disabled={!isAdmin}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    disabled={!isAdmin}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>確定要刪除這篇文章嗎？</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      此操作無法復原，文章「{post.title}」將被永久刪除。
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(post.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      確定刪除
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
        </div>
      </main>
    </div>
  );
};

export default Admin;
