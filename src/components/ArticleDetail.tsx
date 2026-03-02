import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  layout: string | null;
  published_at: string | null;
  created_at: string | null;
}

/** 安全地渲染 HTML 內容 */
function SafeHtmlContent({ html, className }: { html: string; className?: string }) {
  const sanitized = DOMPurify.sanitize(html || '', {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'blockquote', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
  return (
    <div
      className={cn('prose prose-neutral dark:prose-invert max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);

    try {
      // Check if the provided id is a valid UUID
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

      let result;
      if (isUuid) {
        // Direct lookup by ID
        result = await supabase
          .from('posts')
          .select('id, title, content, image_url, layout, published_at, created_at')
          .eq('id', id)
          .single();
      } else {
        // Smart lookup by title if it's a slug-like string (e.g., "yo-house")
        // We try to match the title containing components of the slug
        const searchTerms = id.split('-').filter(t => t.length > 0);
        let query = supabase
          .from('posts')
          .select('id, title, content, image_url, layout, published_at, created_at');

        // Build a query where title contains all terms (roughly)
        // For "yo-house", we look for title containing "Yo" and "House"
        // or just starting with "YoHouse"
        result = await query
          .ilike('title', `%${id.replace(/-/g, '')}%`)
          .limit(1)
          .maybeSingle();

        // If still not found, try searching with spaces or as is
        if (!result.data) {
          result = await supabase
            .from('posts')
            .select('id, title, content, image_url, layout, published_at, created_at')
            .ilike('title', `%${id.replace(/-/g, ' ')}%`)
            .limit(1)
            .maybeSingle();
        }
      }

      // If not found in posts, try searching project_items
      if (result.error || !result.data) {
        let pResult;
        if (isUuid) {
          pResult = await supabase
            .from('project_items')
            .select('id, title, description, main_image_url')
            .eq('id', id)
            .maybeSingle();
        } else {
          pResult = await supabase
            .from('project_items')
            .select('id, title, description, main_image_url')
            .ilike('title', `%${id.replace(/-/g, '')}%`)
            .limit(1)
            .maybeSingle();

          if (!pResult.data) {
            pResult = await supabase
              .from('project_items')
              .select('id, title, description, main_image_url')
              .ilike('title', `%${id.replace(/-/g, ' ')}%`)
              .limit(1)
              .maybeSingle();
          }
        }

        if (pResult?.data) {
          // Map project_items fields to Post interface
          const project = pResult.data;
          setPost({
            id: project.id,
            title: project.title,
            content: project.description,
            image_url: project.main_image_url,
            layout: 'default',
            published_at: null,
            created_at: null
          } as Post);
          setLoading(false);
          return;
        }

        setNotFound(true);
      } else {
        setPost(result.data as Post);
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <p>載入中...</p>
        </div>
      </MainLayout>
    );
  }

  if (notFound || !post) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground mb-4">找不到該文章</p>
          <Button asChild variant="outline">
            <Link to="/">返回首頁</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  // layout 欄位即為排版樣式 (layout_type)，對應：default / hero / twocolumn
  const layoutType = (post.layout || 'default') as string;
  const hasImage = !!post.image_url?.trim();

  return (
    <MainLayout>
      <article className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Layout A - 預設：左圖右文 */}
        {layoutType === 'default' && (
          <div className="grid grid-cols-1 md:grid-cols-[minmax(280px,1fr)_1.5fr] gap-8 md:gap-12 items-start">
            {hasImage && (
              <aside className="order-2 md:order-1">
                <img
                  src={post.image_url!}
                  alt={post.title}
                  className="w-full aspect-[4/3] object-cover rounded-lg shadow-md"
                />
              </aside>
            )}
            <div className={cn('order-1 md:order-2', !hasImage && 'md:col-span-2')}>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{post.title}</h1>
              <SafeHtmlContent html={post.content || ''} />
            </div>
          </div>
        )}

        {/* Layout B - 滿版圖片：標題置中，圖片全寬 */}
        {layoutType === 'hero' && (
          <div className="space-y-6">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground text-center">{post.title}</h1>
            {hasImage && (
              <div className="w-full -mx-4 md:-mx-8 lg:-mx-16 xl:-mx-24">
                <img
                  src={post.image_url!}
                  alt={post.title}
                  className="w-full aspect-[21/9] object-cover"
                />
              </div>
            )}
            <div className="max-w-3xl mx-auto">
              <SafeHtmlContent html={post.content || ''} />
            </div>
          </div>
        )}

        {/* Layout C - 兩欄式：內容分兩欄排版 */}
        {layoutType === 'twocolumn' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{post.title}</h1>
              {hasImage && (
                <img
                  src={post.image_url!}
                  alt={post.title}
                  className="w-full max-w-2xl aspect-video object-cover rounded-lg shadow-md mb-6"
                />
              )}
            </div>
            <div className="columns-1 md:columns-2 gap-8">
              <SafeHtmlContent
                html={post.content || ''}
                className="[&>p]:mb-4 [&>p]:break-inside-avoid"
              />
            </div>
          </div>
        )}

        {/* Fallback：未預期的 layout 值，使用預設排版 */}
        {!['default', 'hero', 'twocolumn'].includes(layoutType) && (
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{post.title}</h1>
            {hasImage && (
              <img
                src={post.image_url!}
                alt={post.title}
                className="w-full max-w-2xl aspect-video object-cover rounded-lg"
              />
            )}
            <SafeHtmlContent html={post.content || ''} />
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-border">
          <Button variant="ghost" asChild>
            <Link to="/" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回首頁
            </Link>
          </Button>
        </div>
      </article>
    </MainLayout>
  );
}

export default ArticleDetail;
