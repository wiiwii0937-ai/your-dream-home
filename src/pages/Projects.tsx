import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { cn } from "@/lib/utils";
import contentData from "@/data/content.json";
import { useSectionContent, useProjectItems } from "@/hooks/useSiteContent";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const Projects = () => {
  const projectsData = useSectionContent('projects', contentData.projects);
  const { data: dbProjects = [] } = useProjectItems();
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const projects = (dbProjects as any[]).length > 0
    ? (dbProjects as any[]).map((p: any) => ({
        id: p.id,
        title: p.title,
        category: p.category || '',
        image: p.main_image_url || '',
        description: p.description || '',
        date: p.project_date || '',
        link: p.link || '#',
        fbLink: p.fb_link || '',
        images: (p.project_images || [])
          .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
          .map((img: any) => img.image_url),
      }))
    : (projectsData as any).items.map((p: any) => ({ ...p, images: [] }));

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p: any) => p.category === activeCategory);

  const openLightbox = (allImages: string[], mainImage: string) => {
    const imgs = allImages.length > 0 ? allImages : [mainImage].filter(Boolean);
    if (imgs.length === 0) return;
    setLightboxImages(imgs);
    setLightboxIndex(0);
  };

  return (
    <>
      <Helmet>
        <title>工程實例 | 築安心 - 輕鋼構建築專家</title>
        <meta name="description" content="築安心工程實例，展示別墅、移動屋、農舍、商業空間等輕鋼構建築案例。" />
      </Helmet>
      <MainLayout>
        <div className="min-h-screen bg-background py-8 px-6 md:px-12">
          {/* 頁面標題 */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {(projectsData as any).hero.title}
            </h1>
            <p className="text-muted-foreground">
              {(projectsData as any).hero.description}
            </p>
          </div>

          {/* 分類篩選 */}
          <div className="flex flex-wrap gap-3 mb-10">
            {(projectsData as any).categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/20"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 卡片式展示 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project: any, index: number) => (
              <div
                key={project.id}
                className={cn(
                  "group flex flex-col overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer",
                  ["[animation-delay:0ms]", "[animation-delay:100ms]", "[animation-delay:200ms]", "[animation-delay:300ms]", "[animation-delay:400ms]", "[animation-delay:500ms]", "[animation-delay:600ms]", "[animation-delay:700ms]"][index] || "[animation-delay:800ms]"
                )}
                onClick={() => openLightbox(project.images, project.image)}
              >
                {/* 封面圖 */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-background/80 text-foreground text-xs font-bold rounded-full backdrop-blur-md shadow-sm border border-border/30">
                      {(projectsData as any).categories.find((c: any) => c.id === project.category)?.label}
                    </span>
                  </div>
                  {project.images.length > 1 && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-primary/80 text-primary-foreground text-xs font-bold rounded-full backdrop-blur-md">
                        {project.images.length} 張
                      </span>
                    </div>
                  )}
                </div>

                {/* 內容區 */}
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{project.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3 flex-1 text-sm md:text-base">
                    {project.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-border/50 flex justify-end">
                    <span className="inline-flex items-center gap-2 text-primary font-bold text-sm">
                      查看更多
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">此分類暫無案例，敬請期待更多精彩作品。</p>
            </div>
          )}
        </div>
      </MainLayout>

      {/* Lightbox / 燈箱 */}
      <Dialog open={lightboxImages.length > 0} onOpenChange={(o) => !o && setLightboxImages([])}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
          <button
            onClick={() => setLightboxImages([])}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {lightboxImages.length > 0 && (
            <div className="relative flex items-center justify-center min-h-[60vh]">
              <img
                src={lightboxImages[lightboxIndex]}
                alt=""
                className="max-w-full max-h-[75vh] object-contain"
              />

              {lightboxImages.length > 1 && (
                <>
                  <button
                    onClick={() => setLightboxIndex((i) => (i - 1 + lightboxImages.length) % lightboxImages.length)}
                    className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setLightboxIndex((i) => (i + 1) % lightboxImages.length)}
                    className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {lightboxImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setLightboxIndex(i)}
                        className={cn(
                          "w-2.5 h-2.5 rounded-full transition-all",
                          i === lightboxIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/70"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Projects;
