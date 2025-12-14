import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar 
        isMenuOpen={isMenuOpen} 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
      />
      <main 
        className={`transition-all duration-500 ease-out ${
          isMenuOpen ? 'ml-[30%]' : 'ml-[7%]'
        }`}
        style={{ minWidth: isMenuOpen ? '70%' : '93%' }}
      >
        {children}
      </main>
    </div>
  );
}
