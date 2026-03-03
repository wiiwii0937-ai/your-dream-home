import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, MapPin, Ruler, Calendar, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

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
  slug: string | null;
}

interface ProjectImage {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number | null;
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (slug) fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    setLoading(true);

    // Try slug first, then fallback to id
    let { data, error } = await supabase
      .from('project_items')
      .select('*')
      .eq('slug', slug!)
      .maybeSingle();

    if (!data) {
      // fallback: try by id
      const res = await supabase
        .from('project_items')
        .select('*')
        .eq('id', slug!)
        .maybeSingle();
      data = res.data;
    }

    if (!data) {
      // Not found → redirect to projects list
      navigate('/projects', { replace: true });
      return;
    }

    setProject(data as ProjectItem);

    // Fetch images
    const { data: imgs } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', data.id)
      .order('display_order');
    setImages(imgs || []);
    setLoading(false);
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

  if (!project) return null;

  const allImages = [
    ...(project.main_image_url ? [{ id: 'main', image_url: project.main_image_url, caption: project.title, display_order: -1 }] : []),
    ...images,
  ];

  return (
    <>
      <Helmet>
        <title>{project.title} | 工程實例 - 築安心</title>
        <meta name="description" content={project.description || `${project.title} - 築安心輕鋼構建築案例`} />
      </Helmet>
      <MainLayout>
        <article className="min-h-screen bg-background">
          {/* Hero Image */}
          {project.main_image_url && (
            <div className="relative w-full aspect-[21/9] overflow-hidden">
              <img
                src={project.main_image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 md:left-12">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{project.title}</h1>
                {project.category && (
                  <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-sm rounded-full">
                    {project.category}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
            {/* Back button + title (if no hero) */}
            {!project.main_image_url && (
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{project.title}</h1>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap gap-6 text-muted-foreground">
              {project.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{project.location}</span>
                </div>
              )}
              {project.area && (
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-primary" />
                  <span>{project.area}</span>
                </div>
              )}
              {project.project_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{project.project_date}</span>
                </div>
              )}
              {project.fb_link && (
                <a
                  href={project.fb_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">{project.description}</p>
              </div>
            )}

            {/* Gallery */}
            {allImages.length > 1 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">專案圖片</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allImages.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl group cursor-pointer"
                    >
                      <img
                        src={img.image_url}
                        alt={img.caption || ''}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Back */}
            <div className="pt-8 border-t border-border">
              <Button variant="ghost" asChild>
                <Link to="/projects" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  返回工程實例
                </Link>
              </Button>
            </div>
          </div>
        </article>

        {/* Lightbox */}
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-4xl p-2">
            {allImages.length > 0 && (
              <div className="relative">
                <img
                  src={allImages[lightboxIndex]?.image_url}
                  alt={allImages[lightboxIndex]?.caption || ''}
                  className="w-full max-h-[75vh] object-contain rounded-lg"
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setLightboxIndex((i) => (i - 1 + allImages.length) % allImages.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setLightboxIndex((i) => (i + 1) % allImages.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                <div className="text-center text-sm text-muted-foreground mt-2">
                  {lightboxIndex + 1} / {allImages.length}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </MainLayout>
    </>
  );
}