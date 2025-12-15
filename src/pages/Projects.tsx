import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { cn } from "@/lib/utils";

// 案例分類
const categories = [
  { id: "all", label: "全部案例" },
  { id: "villa", label: "別墅系列" },
  { id: "mobile", label: "移動屋系列" },
  { id: "farm", label: "農舍/資材室系列" },
  { id: "commercial", label: "商業空間" },
  { id: "renovation", label: "增建案例" },
];

// 模擬案例資料
const projects = [
  {
    id: 1,
    title: "YO HOUSE 東港Mini初代宅",
    category: "mobile",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop",
    description: "展示屋案例",
    fbLink: "https://www.facebook.com/share/v/16whaFxHsM/",
  },
  {
    id: 2,
    title: "4公尺景觀窗微型屋",
    category: "mobile",
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&h=800&fit=crop",
    description: "4公尺景觀窗 + 3.3米挑高Loft",
    fbLink: "https://www.facebook.com/share/v/179QZsS3sV/",
  },
  {
    id: 3,
    title: "漁業大哥的鋼構夢想宅",
    category: "mobile",
    image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=600&h=500&fit=crop",
    description: "客製化鋼構住宅",
    fbLink: "https://www.facebook.com/share/r/1BHveBdekJ/",
  },
  {
    id: 4,
    title: "Yo遊 離島鋼構宅",
    category: "villa",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=700&fit=crop",
    description: "打造你的日式夢想家",
    fbLink: "https://www.facebook.com/share/v/1BeFd85PEK/",
  },
  {
    id: 5,
    title: "現代極簡別墅",
    category: "villa",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=450&fit=crop",
    description: "簡約設計，質感生活",
  },
  {
    id: 6,
    title: "鄉村風格農舍",
    category: "farm",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=600&fit=crop",
    description: "融入自然的田園生活",
  },
  {
    id: 7,
    title: "精品民宿空間",
    category: "commercial",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=500&fit=crop",
    description: "商業空間設計典範",
  },
  {
    id: 8,
    title: "老屋翻新改建",
    category: "renovation",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=650&fit=crop",
    description: "舊屋煥然一新",
  },
];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("all");

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
              工程實例
            </h1>
            <p className="text-muted-foreground">
              探索我們的輕鋼構建築作品，從別墅到商業空間，見證品質與美學的完美結合。
            </p>
          </div>

          {/* 分類篩選 */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
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
                      {categories.find((c) => c.id === project.category)?.label}
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
