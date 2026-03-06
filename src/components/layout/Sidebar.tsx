import { useState } from 'react';
import { Menu, ArrowLeft, Sun, Moon, X } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ProjectsDrawer } from '@/components/ProjectsDrawer';

interface SidebarProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

const menuItems = [
  { label: '關於築安心', href: '/about' },
  { label: '優勢工法', href: '/advantages' },
  { label: '服務項目', href: '/services' },
  { label: '工程實例', href: '/projects' },
  { label: '工程進度', href: '/progress' },
  { label: '線上估價', href: '/estimate' },
  { label: '專業知識庫/常見問答', href: '/faq' },
  { label: '聯繫我們', href: '/contact' },
];

export function Sidebar({ isMenuOpen, onMenuToggle }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  const toggleProjects = () => setIsProjectsOpen((prev) => !prev);

  return (
    <>
      {/* Main Sidebar - Always visible */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen z-50 flex flex-col justify-between py-8 px-4 transition-all duration-500 ease-out",
          "bg-background border-r border-border",
          isMenuOpen ? "w-[30%] min-w-[280px]" : "w-[7%] min-w-[60px]"
        )}
      >
        {/* Logo */}
        <div className="flex flex-col items-center">
          <h1
            className={cn(
              "font-bold text-primary transition-all duration-300",
              isMenuOpen ? "text-3xl" : "vertical-text text-xl"
            )}
          >
            築安心
          </h1>
        </div>

        {/* Sidebar Action Buttons — vertical, below logo, above bottom controls */}
        {!isMenuOpen && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            {/* 工程實例 vertical button */}
            <button
              onClick={toggleProjects}
              className={cn(
                "vertical-text text-xs tracking-[0.25em] font-medium py-3 px-1 rounded-md transition-all duration-300",
                "bg-black/30 backdrop-blur-md text-white/90 hover:bg-black/50 hover:text-white",
                "border border-white/10",
                isProjectsOpen && "bg-primary/80 text-primary-foreground border-primary/40"
              )}
            >
              作品搶先看
            </button>

            {/* MENU button — moved here (upper area, below 工程實例) */}
            <button
              onClick={onMenuToggle}
              className={cn(
                "flex flex-col items-center gap-1 py-3 px-1 rounded-md transition-all duration-300",
                "bg-black/30 backdrop-blur-md text-white/90 hover:bg-black/50 hover:text-white",
                "border border-white/10"
              )}
              aria-label="開啟選單"
            >
              <Menu className="w-5 h-5" />
              <span className="vertical-text text-xs tracking-widest">MENU</span>
            </button>
          </div>
        )}

        {/* Menu Items - Only visible when expanded */}
        {isMenuOpen && (
          <nav className="flex-1 flex flex-col justify-center gap-4 px-4 slide-in-right">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "text-lg font-medium py-2 transition-all duration-300",
                  hoveredItem === item.href
                    ? "text-primary-foreground bg-primary px-4 -mx-4 rounded-lg"
                    : "text-primary hover:translate-x-2"
                )}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Bottom Controls */}
        <div className="flex flex-col items-center gap-6">
          {/* Back button when expanded */}
          {isMenuOpen && (
            <button
              onClick={onMenuToggle}
              className={cn(
                "flex items-center gap-2 text-primary transition-colors duration-300",
                "hover:text-primary/70"
              )}
              aria-label="關閉選單"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">返回</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-primary hover:text-primary/70 transition-colors duration-300"
            aria-label={theme === 'light' ? '切換夜間模式' : '切換日間模式'}
          >
            {theme === 'light' ? (
              <div className="flex flex-col items-center">
                <Sun className="w-5 h-5" />
                {!isMenuOpen && <span className="text-[10px] mt-1">日間</span>}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Moon className="w-5 h-5" />
                {!isMenuOpen && <span className="text-[10px] mt-1">夜間</span>}
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Projects Drawer */}
      <ProjectsDrawer
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        isMobile={isMobile}
      />

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
          onClick={onMenuToggle}
        />
      )}
    </>
  );
}
