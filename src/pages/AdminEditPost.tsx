import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EditArticle } from '@/components/EditArticle';
import { Loader2, ArrowLeft } from 'lucide-react';

const AdminEditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [postData, setPostData] = useState<{
    title: string;
    content: string;
    layout: string;
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && id) {
      fetchPost();
    }
  }, [user, id]);

  const fetchPost = async () => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setPostData({
      title: data.title ?? '',
      content: data.content ?? '',
      layout: data.layout ?? 'default',
    });
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  if (notFound || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-muted-foreground">找不到該文章</p>
            <Button asChild>
              <Link to="/admin">返回文章列表</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">編輯文章</h1>
            <p className="text-sm text-muted-foreground">修改內容與排版樣式</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {postData && id && (
              <EditArticle
                postId={id}
                initialTitle={postData.title}
                initialContent={postData.content}
                initialLayout={postData.layout}
                onSuccess={() => navigate('/admin')}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminEditPost;
