import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { useSiteImagesMap } from "@/hooks/useSiteImages";
import { cn } from "@/lib/utils";
import contentData from "@/data/content.json";

const { projects: projectsData } = contentData;

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const imageMap = useSiteImagesMap(projectsData.items.map((p) => p.usageKey));
  const projects = projectsData.items.map((p) => ({ ...p, image: imageMap[p.usageKey] || '' }));

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

          {/* 瀑布流展示 */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="break-inside-avoid group cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                  {/* 圖片 */}
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* 遮罩層 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* 內容 */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {project.description}
                    </p>
                    {project.fbLink && (
                      <a
                        href={project.fbLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        查看詳情 →
                      </a>
                    )}
                  </div>

                  {/* 分類標籤 */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm">
                      {projectsData.categories.find((c) => c.id === project.category)?.label}
                    </span>
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
