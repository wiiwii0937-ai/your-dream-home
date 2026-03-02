import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteContent {
    id: string;
    section_key: string;
    title: string;
    content: any;
    image_url: string | null;
    images: string[];
    metadata: any;
    updated_at: string;
}

/**
 * Hook to fetch site content by section_key
 */
export function useSiteContent(sectionKey?: string) {
    return useQuery({
        queryKey: ['site-content', sectionKey],
        queryFn: async () => {
            if (sectionKey) {
                const { data, error } = await supabase
                    .from('site_content')
                    .select('*')
                    .eq('section_key', sectionKey)
                    .single();
                if (error) throw error;
                return data as SiteContent;
            } else {
                const { data, error } = await supabase
                    .from('site_content')
                    .select('*')
                    .order('section_key');
                if (error) throw error;
                return data as SiteContent[];
            }
        },
    });
}

/**
 * Hook to update site content
 */
export function useUpdateSiteContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: Partial<SiteContent> & { section_key: string }) => {
            const { data, error } = await supabase
                .from('site_content')
                .upsert(payload as any, { onConflict: 'section_key' })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['site-content'] });
            queryClient.invalidateQueries({ queryKey: ['site-content', data.section_key] });
        },
    });
}
