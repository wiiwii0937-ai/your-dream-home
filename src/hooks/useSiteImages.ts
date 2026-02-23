import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SITE_IMAGE_SLOTS } from '@/lib/siteImageSlots';

interface ManagedImage {
  id: string;
  file_name: string;
  file_path: string;
  public_url: string;
  usage_key: string | null;
  url: string | null;
  label: string | null;
  storage_path: string | null;
}

/**
 * 取得指定 usage_key 的圖片 URL
 * 若後端有管理則回傳後端 URL，否則回傳預設 URL
 */
export function useSiteImage(usageKey: string): string {
  const { data: images = [] } = useSiteImages();
  const slot = SITE_IMAGE_SLOTS.find((s) => s.usageKey === usageKey);
  const managed = images.find((img) => img.usage_key === usageKey);
  return managed?.url ?? managed?.public_url ?? slot?.defaultUrl ?? '';
}

/**
 * 取得所有有 usage_key 的網站圖片（供後台管理用）
 */
export function useSiteImages() {
  return useQuery({
    queryKey: ['site-images'],
    queryFn: async () => {
      const usageKeys = SITE_IMAGE_SLOTS.map((s) => s.usageKey);
      const { data, error } = await supabase
        .from('images_management')
        .select('id, file_name, file_path, public_url, usage_key, url, label, storage_path')
        .in('usage_key', usageKeys);

      if (error) throw error;
      return (data as ManagedImage[]) ?? [];
    },
  });
}

/**
 * 取得多個 usage_key 對應的 URL 映射
 */
export function useSiteImagesMap(usageKeys: string[]) {
  const { data: images = [] } = useSiteImages();
  const map: Record<string, string> = {};
  for (const key of usageKeys) {
    const slot = SITE_IMAGE_SLOTS.find((s) => s.usageKey === key);
    const managed = images.find((img) => img.usage_key === key);
    map[key] = managed?.url ?? managed?.public_url ?? slot?.defaultUrl ?? '';
  }
  return map;
}
