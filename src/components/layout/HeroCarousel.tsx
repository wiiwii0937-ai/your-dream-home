import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSiteImagesMap } from '@/hooks/useSiteImages';

interface CarouselSlide {
  id: string;
  usageKey: string;
  title: string;
  subtitle?: string;
  link?: string;
  image: string;
}

const CAROUSEL_KEYS = ['home-carousel-1', 'home-carousel-2', 'home-carousel-3', 'home-carousel-4'];

const SLIDE_CONFIG: CarouselSlide[] = [
  { id: '1', usageKey: 'home-carousel-1', title: 'YO HOUSE', subtitle: '東港Mini初代宅 展示屋', link: '/portfolio/yo-house', image: '/images/hero/carousel-1.jpg' },
  { id: '2', usageKey: 'home-carousel-2', title: '4公尺景觀窗微型屋', subtitle: '3.3米挑高Loft 完美微型屋', link: '/portfolio/loft-micro', image: '/images/hero/carousel-2.jpg' },
  { id: '3', usageKey: 'home-carousel-3', title: '漁業大哥的鋼構夢想宅', subtitle: '專業輕鋼構打造理想家園', link: '/portfolio/fisherman-house', image: '/images/hero/carousel-3.jpg' },
  { id: '4', usageKey: 'home-carousel-4', title: 'Yo遊 離島鋼構宅', subtitle: '打造你的日式夢想家', link: '/portfolio/island-house', image: '/images/hero/carousel-4.jpg' },
];

interface HeroCarouselProps {
  sidebarExpanded: boolean;
}

export function HeroCarousel({ sidebarExpanded }: HeroCarouselProps) {
  const siteImagesMap = useSiteImagesMap(CAROUSEL_KEYS);

  const slides: CarouselSlide[] = SLIDE_CONFIG.map(slide => ({
    ...slide,
    image: siteImagesMap[slide.usageKey] || slide.image
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredSlide, setHoveredSlide] = useState(false);

  // Clamp currentIndex when slides length changes (e.g. all filtered out or images load)
  useEffect(() => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => Math.min(prev, slides.length - 1));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    if (slides.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, slides.length]);

  const goToSlide = (index: number) => {
    if (slides.length === 0 || isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  // Auto-advance slides
  useEffect(() => {
    if (slides.length === 0 || hoveredSlide) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, hoveredSlide, slides.length]);

  const currentSlide = slides[currentIndex];

  // Loading state — show animated placeholder if no slides
  if (slides.length === 0) {
    return (
      <div
        className={cn(
          "fixed top-0 right-0 h-screen transition-all duration-500 ease-out overflow-hidden flex items-center justify-center bg-muted",
          sidebarExpanded ? "w-[70%]" : "w-[93%]"
        )}
      >
        {/* Animated skeleton background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted-foreground/5 to-muted animate-pulse" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-lg font-medium">輪播圖片載入中...</p>
        </div>
        {/* Skeleton slide indicators */}
        <div className="absolute bottom-12 right-12 flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-muted-foreground/20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-screen transition-all duration-500 ease-out overflow-hidden",
        sidebarExpanded ? "w-[70%]" : "w-[93%]"
      )}
      onMouseEnter={() => setHoveredSlide(true)}
      onMouseLeave={() => setHoveredSlide(false)}
    >
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-12 pb-24">
        <div className={cn(
          "transition-all duration-500 transform",
          isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        )}>
          <a
            href={currentSlide.link}
            className="group"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 transition-colors duration-300 group-hover:text-primary">
              {currentSlide.title}
            </h2>
            {currentSlide.subtitle && (
              <p className="text-xl md:text-2xl text-white/90 transition-colors duration-300 group-hover:text-primary">
                {currentSlide.subtitle}
              </p>
            )}
          </a>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-12 right-12 flex items-center gap-6">
          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/40 hover:bg-white/70"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrow Controls */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Slide Counter */}
        <div className="absolute top-12 right-12 text-white/70 text-sm font-medium">
          <span className="text-white text-2xl">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="mx-2">/</span>
          <span>{String(slides.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}
