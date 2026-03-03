import { Helmet } from 'react-helmet-async';
import { MainLayout } from '@/components/layout/MainLayout';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSiteContent } from '@/hooks/useSiteContent';

interface ProgressItem {
  id: string;
  name: string;
  location: string | null;
  progress: number | null;
  current_phase: string | null;
  start_date: string | null;
  estimated_completion: string | null;
  updates: any;
  display_order: number | null;
}

export default function ProjectProgress() {
  const { data: progressData } = useSiteContent<any>('progress');
  const [selectedProject, setSelectedProject] = useState<string>('');

  const { data: dbItems = [] } = useQuery({
    queryKey: ['progress-items-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress_items')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return (data ?? []) as ProgressItem[];
    },
  });

  if (!progressData) return null;

  // Use DB items if available, else fallback to site_sections JSON
  const hasDbItems = dbItems.length > 0;
  const projects = hasDbItems
    ? dbItems.map((item) => ({
        id: item.id,
        name: item.name,
        location: item.location || '',
        startDate: item.start_date || '',
        estimatedCompletion: item.estimated_completion || '',
        progress: item.progress ?? 0,
        currentPhase: item.current_phase || '',
        photo: (item.updates as any)?.photo || null,
        updates: (item.updates as any)?.timeline || [],
      }))
    : ((progressData.projects || []) as any[]);

  const activeId = selectedProject || projects[0]?.id || '';
  const currentProject = projects.find((p: any) => p.id === activeId);

  if (!currentProject) return null;

  return (
    <>
      <Helmet>
        <title>工程進度 | 築安心輕鋼建築</title>
        <meta name="description" content="查看築安心進行中專案的每週施工進度更新，透明公開的工程管理讓您安心。" />
      </Helmet>

      <MainLayout>
        <div className="min-h-screen bg-background py-16 px-4 md:px-8">
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {progressData.hero?.title || '工程進度'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {progressData.hero?.description || '即時掌握施工動態'}
            </p>
          </div>

          {/* Project Selector */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex flex-wrap gap-3">
              {projects.map((project: any) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeId === project.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card text-card-foreground hover:bg-accent border border-border'
                    }`}
                >
                  {project.name}
                </button>
              ))}
            </div>
          </div>

          {/* Project Overview Card */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
                    {currentProject.name}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    {currentProject.location && (
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {currentProject.location}
                      </span>
                    )}
                    {currentProject.startDate && (
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        開工：{currentProject.startDate}
                      </span>
                    )}
                    {currentProject.estimatedCompletion && (
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        預計完工：{currentProject.estimatedCompletion}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-1">
                    {currentProject.progress}%
                  </div>
                  <div className="text-sm text-muted-foreground">整體進度</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                    style={{ width: `${currentProject.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">目前階段：</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                  {currentProject.currentPhase}
                </span>
              </div>

              {/* Photo */}
              {currentProject.photo && (
                <div className="mt-6">
                  <img src={currentProject.photo} alt={currentProject.name} className="w-full max-h-96 object-cover rounded-xl" />
                </div>
              )}
            </div>
          </div>

          {/* Timeline (only if updates exist) */}
          {currentProject.updates && currentProject.updates.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-primary" />
                週進度更新
              </h3>
              <div className="relative">
                <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {currentProject.updates.map((update: any, index: number) => (
                    <div key={index} className="relative pl-12 md:pl-16">
                      <div className={`absolute left-0 md:left-2 w-8 h-8 rounded-full flex items-center justify-center ${update.completed
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted border-2 border-primary text-primary'
                        }`}>
                        <span className="text-xs font-bold">{update.week || index + 1}</span>
                      </div>
                      <div className={`bg-card rounded-xl p-5 border border-border transition-all duration-300 hover:shadow-lg ${!update.completed ? 'ring-2 ring-primary/20' : ''}`}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                          <h4 className="text-lg font-semibold text-card-foreground">{update.title}</h4>
                          {update.date && <span className="text-sm text-muted-foreground">{update.date}</span>}
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{update.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="max-w-6xl mx-auto mt-16 text-center">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {progressData.cta?.title || '想了解更多？'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {progressData.cta?.description || '歡迎聯繫我們'}
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                預約參觀
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
