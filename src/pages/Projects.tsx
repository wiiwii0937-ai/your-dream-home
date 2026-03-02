import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { cn } from "@/lib/utils";
import contentData from "@/data/content.json";
import { useSiteContent } from "@/hooks/useSiteContent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const Projects = () => {
  const { data: dynamicContent } = useSiteContent('projects');
  const projectsData = (dynamicContent as any)?.content || contentData.projects;
  const galleryImages = (dynamicContent as any)?.images || [];

  const [activeCategory, setActiveCategory] = useState("all");
  const projects = projectsData.items;

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

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
              {projectsData.hero.title}
            </h1>
            <p className="text-muted-foreground">
              {projectsData.hero.description}
            </p>
          </div>

          {/* 工程實例多圖輪播 (Gallery) */}
          {galleryImages.length > 0 && (
            <div className="mb-12">
              <Carousel className="w-full max-w-5xl mx-auto">
                <CarouselContent>
                  {galleryImages.map((src, idx) => (
                    <CarouselItem key={idx}>
                      <div className="aspect-[21/9] overflow-hidden rounded-3xl">
                        <img src={src} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 md:-left-12" />
                <CarouselNext className="-right-4 md:-right-12" />
              </Carousel>
            </div>
          )}

          {/* 分類篩選 */}
          <div className="flex flex-wrap gap-3 mb-10">
            {projectsData.categories.map((cat) => (
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

          {/* 卡片式展示 (Card Layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={cn(
                  "group flex flex-col overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
                  ["[animation-delay:0ms]", "[animation-delay:100ms]", "[animation-delay:200ms]", "[animation-delay:300ms]", "[animation-delay:400ms]", "[animation-delay:500ms]", "[animation-delay:600ms]", "[animation-delay:700ms]"][index] || "[animation-delay:800ms]"
                )}
              >
                {/* 封面圖 */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* 分類標籤 */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-background/80 text-foreground text-xs font-bold rounded-full backdrop-blur-md shadow-sm border border-border/30">
                      {projectsData.categories.find((c) => c.id === project.category)?.label}
                    </span>
                  </div>
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

                  {/* 查看更多按鈕 */}
                  <div className="mt-auto pt-4 border-t border-border/50 flex justify-end">
                    <a
                      href={project.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors text-sm group/btn"
                      onClick={(e) => {
                        if (!project.link || project.link === "#") e.preventDefault();
                      }}
                    >
                      查看更多
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/btn:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 空狀態 */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                此分類暫無案例，敬請期待更多精彩作品。
              </p>
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default Projects;
