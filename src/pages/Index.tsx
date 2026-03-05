import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { HeroCarousel } from '@/components/layout/HeroCarousel';
import { ProjectsCarousel } from '@/components/ProjectsCarousel';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>築安心 | 輕鋼構建築專家 - 安全、質感、快速</title>
        <meta name="description" content="築安心專營輕鋼構別墅、移動宅、農舍建造。以綠色環保、耐震防風、精準工藝為核心，打造您的夢想家園。" />
        <meta name="keywords" content="輕鋼構,別墅,移動屋,農舍,建築,耐震,綠色建築" />
      </Helmet>
      
      <div className="min-h-screen overflow-hidden">
        <Sidebar 
          isMenuOpen={isMenuOpen} 
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
        />
        <HeroCarousel sidebarExpanded={isMenuOpen} />
        {/* Projects Carousel section below hero */}
        <div className="relative" style={{ marginTop: '100vh' }}>
          <ProjectsCarousel />
        </div>
      </div>
    </>
  );
};

export default Index;
