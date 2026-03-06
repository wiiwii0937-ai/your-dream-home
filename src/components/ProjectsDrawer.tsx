import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

function optimizeImageUrl(url: string | null, width = 400, quality = 70): string {
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

interface ProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export function ProjectsDrawer({ isOpen, onClose, isMobile }: ProjectsDrawerProps) {
  const { data: projects = [] } = useQuery({
    queryKey: ['project-items-drawer'],
    queryFn: async () => {
      const { data } = await supabase
        .from('project_items')
        .select('id, title, category, main_image_url, slug')
        .order('created_at', { ascending: false });
      return (data || []) as ProjectItem[];
    },
  });

  return (
    <>
      {/* Backdrop — click to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed top-0 z-[60] h-full overflow-y-auto transition-transform duration-500 ease-out",
          "bg-background/95 backdrop-blur-lg border-r border-border shadow-2xl",
          // Mobile: fullscreen, Desktop: 380px from left edge of sidebar
          isMobile
            ? "left-0 w-full"
            : "left-[60px] w-[380px]",
          isOpen
            ? "translate-x-0"
            : isMobile
              ? "-translate-x-full"
              : "-translate-x-[440px]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">工程實例</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project list */}
        <div className="p-4 flex flex-col gap-3">
          {projects.map((project, i) => (
            <Link
              key={project.id}
              to={project.slug ? `/portfolio/${project.slug}` : `/portfolio/${project.id}`}
              onClick={onClose}
              className="group flex gap-3 p-2 rounded-lg hover:bg-muted/60 transition-colors"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-20 h-16 flex-shrink-0 rounded-md overflow-hidden">
                <img
                  src={optimizeImageUrl(project.main_image_url)}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {project.title}
                </span>
                {project.category && (
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {project.category}
                  </span>
                )}
              </div>
            </Link>
          ))}

          {projects.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">暫無工程案例</p>
          )}
        </div>

        {/* View all link */}
        <div className="p-4 border-t border-border">
          <Link
            to="/projects"
            onClick={onClose}
            className="block text-center text-primary font-medium hover:text-primary/80 transition-colors"
          >
            查看全部工程實例 →
          </Link>
        </div>
      </div>
    </>
  );
}
