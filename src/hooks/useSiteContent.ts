import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Helper for tables not yet in auto-generated types
const db = supabase as any;

/**
 * 讀取單一區塊內容，若資料庫無資料則回傳 fallback
 */
export function useSectionContent<T>(sectionKey: string, fallback: T): T {
  const { data } = useQuery({
    queryKey: ['site-section', sectionKey],
    queryFn: async () => {
      const { data, error } = await db
        .from('site_sections')
        .select('content')
        .eq('section_key', sectionKey)
        .maybeSingle();
      if (error) throw error;
      return data?.content as T | null;
    },
    staleTime: 5 * 60 * 1000,
  });
  return data ?? fallback;
}

/**
 * 讀取所有區塊（後台管理用）
 */
export function useAllSections() {
  return useQuery({
    queryKey: ['site-sections-all'],
    queryFn: async () => {
      const { data, error } = await db
        .from('site_sections')
        .select('*')
        .order('section_key');
      if (error) throw error;
      return data ?? [];
    },
  });
}

/**
 * 讀取工程實例（含多圖）
 */
export function useProjectItems() {
  return useQuery({
    queryKey: ['project-items'],
    queryFn: async () => {
      const { data, error } = await db
        .from('project_items')
        .select('*, project_images(id, image_url, caption, display_order)')
        .order('display_order');
      if (error) throw error;
      return data ?? [];
    },
  });
}

/**
 * 讀取工程進度
 */
export function useProgressItems() {
  return useQuery({
    queryKey: ['progress-items'],
    queryFn: async () => {
      const { data, error } = await db
        .from('progress_items')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data ?? [];
    },
  });
}
