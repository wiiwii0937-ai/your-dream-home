import { Helmet } from 'react-helmet-async';
import { MainLayout } from '@/components/layout/MainLayout';
import { Calendar, MapPin, Clock, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface ProgressUpdate {
  week: number;
  date: string;
  title: string;
  description: string;
  completed: boolean;
  images?: string[];
}

interface Project {
  id: string;
  name: string;
  location: string;
  startDate: string;
  estimatedCompletion: string;
  progress: number;
  currentPhase: string;
  updates: ProgressUpdate[];
}

const projects: Project[] = [
  {
    id: '1',
    name: '台中霧峰輕鋼別墅',
    location: '台中市霧峰區',
    startDate: '2024-11-01',
    estimatedCompletion: '2025-02-28',
    progress: 65,
    currentPhase: '內裝工程',
    updates: [
      {
        week: 8,
        date: '2024-12-16',
        title: '內裝隔間完成',
        description: '完成所有室內隔間牆面施工，包含主臥、次臥及書房隔間。同步進行水電管線預埋作業。',
        completed: true,
      },
      {
        week: 7,
        date: '2024-12-09',
        title: '屋頂防水層鋪設',
        description: '完成屋頂防水層施工，採用高品質防水材料，確保長期防漏效果。',
        completed: true,
      },
      {
        week: 6,
        date: '2024-12-02',
        title: '外牆板材安裝',
        description: '完成外牆輕鋼板材安裝，含隔熱層及防火層，提升建築整體隔熱性能。',
        completed: true,
      },
      {
        week: 5,
        date: '2024-11-25',
        title: '主結構焊接完成',
        description: '完成主體輕鋼結構焊接及防鏽處理，結構穩固性通過檢測。',
        completed: true,
      },
    ],
  },
  {
    id: '2',
    name: '苗栗大湖農舍',
    location: '苗栗縣大湖鄉',
    startDate: '2024-12-01',
    estimatedCompletion: '2025-03-15',
    progress: 25,
    currentPhase: '基礎工程',
    updates: [
      {
        week: 3,
        date: '2024-12-16',
        title: '基礎灌漿完成',
        description: '完成地基基礎灌漿作業，混凝土養護中，預計下週開始鋼構組裝。',
        completed: true,
      },
      {
        week: 2,
        date: '2024-12-09',
        title: '地基開挖及整地',
        description: '完成基地整地及地基開挖，並進行地質確認及排水系統規劃。',
        completed: true,
      },
      {
        week: 1,
        date: '2024-12-02',
        title: '開工準備',
        description: '完成施工圍籬搭設、工地辦公室設置，材料進場準備就緒。',
        completed: true,
      },
    ],
  },
  {
    id: '3',
    name: '南投埔里民宿改建',
    location: '南投縣埔里鎮',
    startDate: '2024-10-15',
    estimatedCompletion: '2025-01-31',
    progress: 85,
    currentPhase: '收尾工程',
    updates: [
      {
        week: 10,
        date: '2024-12-16',
        title: '內裝油漆及清潔',
        description: '進行室內油漆粉刷及全面清潔作業，準備進入驗收階段。',
        completed: false,
      },
      {
        week: 9,
        date: '2024-12-09',
        title: '衛浴設備安裝',
        description: '完成6間客房衛浴設備安裝，包含馬桶、洗手台及淋浴設備。',
        completed: true,
      },
      {
        week: 8,
        date: '2024-12-02',
        title: '地板鋪設完成',
        description: '完成全棟地板鋪設，採用耐磨木紋地板，兼具美觀與實用性。',
        completed: true,
      },
    ],
  },
];

export default function ProjectProgress() {
  const [selectedProject, setSelectedProject] = useState<string>(projects[0].id);
  const currentProject = projects.find(p => p.id === selectedProject)!;

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
              工程進度
            </h1>
            <p className="text-lg text-muted-foreground">
              透明公開的施工進度，讓您隨時掌握專案狀態
            </p>
          </div>

          {/* Project Selector */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex flex-wrap gap-3">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    selectedProject === project.id
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
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {currentProject.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      開工：{currentProject.startDate}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      預計完工：{currentProject.estimatedCompletion}
                    </span>
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
            </div>
          </div>

          {/* Timeline */}
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              週進度更新
            </h3>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-border" />

              {/* Timeline Items */}
              <div className="space-y-6">
                {currentProject.updates.map((update, index) => (
                  <div key={index} className="relative pl-12 md:pl-16">
                    {/* Timeline Dot */}
                    <div className={`absolute left-0 md:left-2 w-8 h-8 rounded-full flex items-center justify-center ${
                      update.completed 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted border-2 border-primary text-primary'
                    }`}>
                      {update.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>

                    {/* Content Card */}
                    <div className={`bg-card rounded-xl p-5 border border-border transition-all duration-300 hover:shadow-lg ${
                      !update.completed ? 'ring-2 ring-primary/20' : ''
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                            第 {update.week} 週
                          </span>
                          <h4 className="text-lg font-semibold text-card-foreground">
                            {update.title}
                          </h4>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {update.date}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {update.description}
                      </p>
                      {!update.completed && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                          <Clock className="w-4 h-4" />
                          進行中
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-6xl mx-auto mt-16 text-center">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                想了解更多工程細節？
              </h3>
              <p className="text-muted-foreground mb-6">
                我們提供定期工地參觀，讓您親眼見證築安心的施工品質
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
