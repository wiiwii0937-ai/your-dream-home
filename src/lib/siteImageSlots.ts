/**
 * 網站圖片 slot 定義
 * 用於將現有網站圖片對應到後端 images_management，供 Admin 修改或刪除
 */
import villaHouseImg from '@/assets/projects/villa-house.jpg';
import guesthouseImg from '@/assets/projects/guesthouse.jpg';
import mobileHouseImg from '@/assets/projects/mobile-house.jpg';
import renovationImg from '@/assets/projects/renovation.jpg';
import villaExteriorImg from '@/assets/projects/villa-exterior-1.jpg';

export interface SiteImageSlot {
  usageKey: string;
  label: string;
  /** 預設圖片 URL（外部連結或 Vite 解析後的本地資源路徑） */
  defaultUrl: string;
  /** 是否為本地資源（需要上傳至 Supabase） */
  isLocalAsset?: boolean;
}

export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  // Hero Carousel
  {
    usageKey: 'hero-1',
    label: '首頁輪播 1 - YO HOUSE',
    defaultUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop',
  },
  {
    usageKey: 'hero-2',
    label: '首頁輪播 2 - 4公尺景觀窗',
    defaultUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop',
  },
  {
    usageKey: 'hero-3',
    label: '首頁輪播 3 - 漁業大哥鋼構宅',
    defaultUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop',
  },
  {
    usageKey: 'hero-4',
    label: '首頁輪播 4 - Yo遊離島鋼構宅',
    defaultUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&h=1080&fit=crop',
  },
  // Projects
  { usageKey: 'project-1', label: '工程實例 1 - YO HOUSE', defaultUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop' },
  { usageKey: 'project-2', label: '工程實例 2 - 4公尺景觀窗', defaultUrl: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&h=800&fit=crop' },
  { usageKey: 'project-3', label: '工程實例 3 - 漁業大哥', defaultUrl: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=600&h=500&fit=crop' },
  { usageKey: 'project-4', label: '工程實例 4 - Yo遊離島', defaultUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=700&fit=crop' },
  { usageKey: 'project-5', label: '工程實例 5 - 現代極簡別墅', defaultUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=450&fit=crop' },
  { usageKey: 'project-6', label: '工程實例 6 - 鄉村農舍', defaultUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=600&fit=crop' },
  { usageKey: 'project-7', label: '工程實例 7 - 精品民宿', defaultUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=500&fit=crop' },
  { usageKey: 'project-8', label: '工程實例 8 - 老屋翻新', defaultUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=650&fit=crop' },
  // Services
  { usageKey: 'service-villa', label: '服務項目 - 別墅/住宅', defaultUrl: villaHouseImg, isLocalAsset: true },
  { usageKey: 'service-farm', label: '服務項目 - 農舍/資材室', defaultUrl: guesthouseImg, isLocalAsset: true },
  { usageKey: 'service-commercial', label: '服務項目 - 商業空間/民宿', defaultUrl: mobileHouseImg, isLocalAsset: true },
  { usageKey: 'service-renovation', label: '服務項目 - 舊屋增建/翻新', defaultUrl: renovationImg, isLocalAsset: true },
  { usageKey: 'service-villa-exterior', label: '別墅頁 - 外觀圖', defaultUrl: villaExteriorImg, isLocalAsset: true },
  // Online Estimate
  { usageKey: 'estimate-mobile', label: '線上估價 - 移動式住宅', defaultUrl: mobileHouseImg, isLocalAsset: true },
  { usageKey: 'estimate-villa', label: '線上估價 - 輕鋼別墅', defaultUrl: villaHouseImg, isLocalAsset: true },
  { usageKey: 'estimate-guesthouse', label: '線上估價 - 民宿/商業', defaultUrl: guesthouseImg, isLocalAsset: true },
  { usageKey: 'estimate-renovation', label: '線上估價 - 老屋翻新', defaultUrl: renovationImg, isLocalAsset: true },
];
