import { MessageCircle } from 'lucide-react';
import { pushGtmEvent } from './GoogleTagManager';
import { useIsMobile } from '@/hooks/use-mobile';

const LINE_URL = 'https://line.me/ti/p/JzVO_19Tfk';

export function FloatingLineButton() {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const handleClick = () => {
    pushGtmEvent('contact_line_click', { source: 'floating_button' });
  };

  return (
    <a
      href={LINE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-white font-semibold shadow-lg hover:opacity-90 transition-opacity"
      style={{ backgroundColor: '#06C755' }}
      aria-label="加賴討論"
    >
      <MessageCircle className="w-5 h-5" />
      加賴討論
    </a>
  );
}
