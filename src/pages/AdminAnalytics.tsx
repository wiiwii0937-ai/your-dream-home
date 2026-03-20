import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, RefreshCw, Eye, MousePointerClick, Clock, TrendingUp } from 'lucide-react';

interface ActivityLog {
  id: string;
  session_id: string;
  action_type: string;
  page_path: string;
  duration_seconds: number | null;
  click_target: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface PageStat {
  page_path: string;
  views: number;
  avg_duration: number;
}

interface ClickStat {
  click_target: string;
  count: number;
  page_path: string;
}

export default function AdminAnalytics() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, authLoading, isAdmin]);

  useEffect(() => {
    if (isAdmin) fetchLogs();
  }, [isAdmin]);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('user_activity_logs' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);
    setLogs((data as ActivityLog[]) || []);
    setLoading(false);
  };

  // Compute stats
  const pageViews = logs.filter((l) => l.action_type === 'page_view');
  const pageLeaves = logs.filter((l) => l.action_type === 'page_leave');
  const clicks = logs.filter((l) => l.action_type === 'click');

  // Page stats
  const pageStatsMap = new Map<string, { views: number; totalDuration: number; count: number }>();
  pageViews.forEach((l) => {
    const s = pageStatsMap.get(l.page_path) || { views: 0, totalDuration: 0, count: 0 };
    s.views++;
    pageStatsMap.set(l.page_path, s);
  });
  pageLeaves.forEach((l) => {
    const s = pageStatsMap.get(l.page_path) || { views: 0, totalDuration: 0, count: 0 };
    s.totalDuration += l.duration_seconds || 0;
    s.count++;
    pageStatsMap.set(l.page_path, s);
  });
  const pageStats: PageStat[] = Array.from(pageStatsMap.entries())
    .map(([page_path, s]) => ({
      page_path,
      views: s.views,
      avg_duration: s.count > 0 ? Math.round(s.totalDuration / s.count) : 0,
    }))
    .sort((a, b) => b.views - a.views);

  // Click stats
  const clickMap = new Map<string, { count: number; page_path: string }>();
  clicks.forEach((l) => {
    const key = l.click_target || 'unknown';
    const s = clickMap.get(key) || { count: 0, page_path: l.page_path };
    s.count++;
    clickMap.set(key, s);
  });
  const clickStats: ClickStat[] = Array.from(clickMap.entries())
    .map(([click_target, s]) => ({ click_target, ...s }))
    .sort((a, b) => b.count - a.count);

  // Unique sessions
  const uniqueSessions = new Set(logs.map((l) => l.session_id)).size;

  const formatDuration = (s: number) => {
    if (s < 60) return `${s}秒`;
    return `${Math.floor(s / 60)}分${s % 60}秒`;
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/content')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">流量統計</h1>
              <p className="text-sm text-muted-foreground">訪客行為分析與熱門頁面排行</p>
            </div>
            <Button onClick={fetchLogs} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" /> 重新整理
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <Eye className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{pageViews.length}</p>
                <p className="text-xs text-muted-foreground">總瀏覽次數</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{uniqueSessions}</p>
                <p className="text-xs text-muted-foreground">獨立訪客</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MousePointerClick className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{clicks.length}</p>
                <p className="text-xs text-muted-foreground">總點擊次數</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">
                  {pageLeaves.length > 0
                    ? formatDuration(Math.round(pageLeaves.reduce((s, l) => s + (l.duration_seconds || 0), 0) / pageLeaves.length))
                    : '—'}
                </p>
                <p className="text-xs text-muted-foreground">平均停留時間</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">熱門頁面</TabsTrigger>
              <TabsTrigger value="clicks">點擊排行</TabsTrigger>
              <TabsTrigger value="recent">最近紀錄</TabsTrigger>
            </TabsList>

            {/* Popular Pages */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">頁面瀏覽排行</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>排名</TableHead>
                        <TableHead>頁面路徑</TableHead>
                        <TableHead className="text-right">瀏覽次數</TableHead>
                        <TableHead className="text-right">平均停留</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageStats.slice(0, 20).map((s, i) => (
                        <TableRow key={s.page_path}>
                          <TableCell className="font-medium">{i + 1}</TableCell>
                          <TableCell className="font-mono text-sm">{s.page_path}</TableCell>
                          <TableCell className="text-right">{s.views}</TableCell>
                          <TableCell className="text-right">{s.avg_duration > 0 ? formatDuration(s.avg_duration) : '—'}</TableCell>
                        </TableRow>
                      ))}
                      {pageStats.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            尚無瀏覽資料
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Click Rankings */}
            <TabsContent value="clicks">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">點擊目標排行</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>排名</TableHead>
                        <TableHead>點擊目標</TableHead>
                        <TableHead>所在頁面</TableHead>
                        <TableHead className="text-right">點擊次數</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clickStats.slice(0, 20).map((s, i) => (
                        <TableRow key={s.click_target}>
                          <TableCell className="font-medium">{i + 1}</TableCell>
                          <TableCell className="text-sm max-w-[200px] truncate">{s.click_target}</TableCell>
                          <TableCell className="font-mono text-sm">{s.page_path}</TableCell>
                          <TableCell className="text-right">{s.count}</TableCell>
                        </TableRow>
                      ))}
                      {clickStats.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            尚無點擊資料
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recent Logs */}
            <TabsContent value="recent">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">最近 50 筆行為紀錄</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>時間</TableHead>
                        <TableHead>動作</TableHead>
                        <TableHead>頁面</TableHead>
                        <TableHead>點擊目標</TableHead>
                        <TableHead className="text-right">停留</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.slice(0, 50).map((l) => (
                        <TableRow key={l.id}>
                          <TableCell className="text-xs whitespace-nowrap">
                            {new Date(l.created_at).toLocaleString('zh-TW')}
                          </TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              l.action_type === 'click' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                              l.action_type === 'page_view' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                              'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                            }`}>
                              {l.action_type === 'click' ? '點擊' : l.action_type === 'page_view' ? '瀏覽' : '離開'}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{l.page_path}</TableCell>
                          <TableCell className="text-xs max-w-[150px] truncate">{l.click_target || '—'}</TableCell>
                          <TableCell className="text-right text-xs">
                            {l.duration_seconds ? formatDuration(l.duration_seconds) : '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
