import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

/** Append resize params for mobile-optimized images */
function optimizeImageUrl(url: string | null, width = 600, quality = 70): string {
  if (!url) return '/placeholder.svg';
  if (url.includes('supabase') && url.includes('/storage/')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width}&quality=${quality}`;
  }
  return url;
}

interface ProjectItem {
  id: string;
  title: string;
  category: string | null;
  main_image_url: string | null;
  slug: string | null;
}

export function ProjectsCarousel() {
  const { data: projects = [] } = useQuery({
    queryKey: ['project-items-carousel'],
    queryFn: async () => {
      const { data } = await supabase
        .from('project_items')
        .select('id, title, category, main_image_url, slug')
        .order('created_at', { ascending: false });
      return (data || []) as ProjectItem[];
    },
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Responsive: 1 on mobile, 2 md, 3 lg, but we'll use CSS grid and scroll pages
  const itemsPerPage = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 3 : 1;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const next = useCallback(() => {
    setCurrentPage((p) => (p + 1) % totalPages);
  }, [totalPages]);

  const prev = useCallback(() => {
    setCurrentPage((p) => (p - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Auto-play
  useEffect(() => {
    if (isHovered || totalPages <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, isHovered, totalPages]);

  if (projects.length === 0) return null;

  const visibleProjects = projects.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">作品搶先看</h2>
            <p className="text-muted-foreground mt-2">探索我們最新的輕鋼構建築作品</p>
          </div>
          <Link
            to="/projects"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            查看全部 →
          </Link>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 transition-all duration-500">
            {visibleProjects.map((project) => (
              <Link
                key={project.id}
                to={project.slug ? `/portfolio/${project.slug}` : `/portfolio/${project.id}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] md:aspect-[3/4] rounded-xl overflow-hidden">
                  <img
                    src={optimizeImageUrl(project.main_image_url)}
                    alt={project.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {project.category && (
                      <span className="inline-block px-2 py-0.5 bg-primary/90 text-primary-foreground text-xs rounded-full mb-2">
                        {project.category}
                      </span>
                    )}
                    <h3 className="text-white font-semibold text-sm md:text-base leading-tight">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 border border-border shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all z-10"
                aria-label="上一頁"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 border border-border shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all z-10"
                aria-label="下一頁"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  i === currentPage
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`第 ${i + 1} 頁`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
