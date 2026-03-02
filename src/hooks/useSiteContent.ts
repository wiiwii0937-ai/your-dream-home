import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import contentData from '@/data/content.json';

const SECTION_KEYS = [
  'about', 'advantages', 'services', 'projects',
  'progress', 'estimate', 'faq', 'contact', 'knowledgeBase'
] as const;

type SectionKey = typeof SECTION_KEYS[number];

/**
 * 從 site_sections 取得指定區塊內容，若無資料則回傳 local JSON 備援
 */
export function useSiteContent<T = any>(sectionKey: SectionKey): {
  data: T;
  isLoading: boolean;
  error: Error | null;
} {
  const fallback = (contentData as any)[sectionKey];

  const { data, isLoading, error } = useQuery({
    queryKey: ['site-content', sectionKey],
    queryFn: async () => {
      const { data: row, error } = await supabase
        .from('site_sections')
        .select('content')
        .eq('section_key', sectionKey)
        .maybeSingle();

      if (error) throw error;
      return row?.content ?? null;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  return {
    data: (data ?? fallback) as T,
    isLoading,
    error: error as Error | null,
  };
}

/**
 * 取得所有區塊內容 (供後台管理用)
 */
export function useAllSiteContent() {
  return useQuery({
    queryKey: ['site-content-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_sections')
        .select('*')
        .order('section_key');
      if (error) throw error;
      return data ?? [];
    },
  });
}

/**
 * 更新區塊內容
 */
export function useUpdateSiteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sectionKey, content }: { sectionKey: string; content: any }) => {
      // Upsert: insert if not exists, update if exists
      const { error } = await supabase
        .from('site_sections')
        .upsert(
          { section_key: sectionKey, content, updated_at: new Date().toISOString() },
          { onConflict: 'section_key' }
        );
      if (error) throw error;
    },
    onSuccess: (_, { sectionKey }) => {
      queryClient.invalidateQueries({ queryKey: ['site-content', sectionKey] });
      queryClient.invalidateQueries({ queryKey: ['site-content-all'] });
    },
  });
}

/**
 * 初始化: 將 local JSON 資料同步到資料庫
 */
export function useInitializeSiteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const rows = SECTION_KEYS.map((key) => ({
        section_key: key,
        content: (contentData as any)[key],
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('site_sections')
        .upsert(rows, { onConflict: 'section_key' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      queryClient.invalidateQueries({ queryKey: ['site-content-all'] });
    },
  });
}

export { SECTION_KEYS };
export type { SectionKey };
