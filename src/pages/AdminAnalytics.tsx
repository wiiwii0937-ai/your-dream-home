import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subDays, startOfDay, endOfDay, isAfter, isBefore } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ArrowLeft, RefreshCw, Eye, MousePointerClick, Clock, TrendingUp, Calendar as CalendarIcon, Search, ArrowUpDown, MapPin } from 'lucide-react';

interface ActivityLog {
  id: string;
  session_id: string;
  action_type: string;
  page_path: string;
  duration_seconds: number | null;
  click_target: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  ip_address: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
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

interface LocationStat {
  label: string;
  city: string | null;
  region: string | null;
  country: string | null;
  views: number;
  uniqueSessions: number;
}

export default function AdminAnalytics() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  // Click search & sort
  const [clickSearch, setClickSearch] = useState('');
  const [clickSortField, setClickSortField] = useState<'count' | 'name'>('count');
  const [clickSortDir, setClickSortDir] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, authLoading, isAdmin]);

  useEffect(() => {
    if (isAdmin) fetchLogs();
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) fetchLogs();
  }, [startDate, endDate]);

  const fetchLogs = async () => {
    setLoading(true);
    let query = (supabase as any)
      .from('user_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (startDate) {
      query = query.gte('created_at', startOfDay(startDate).toISOString());
    }
    if (endDate) {
      query = query.lte('created_at', endOfDay(endDate).toISOString());
    }

    const { data } = await query;
    setLogs((data || []) as ActivityLog[]);
    setLoading(false);
  };

  const applyDateRange = (days: number) => {
    const end = new Date();
    const start = subDays(end, days);
    setEndDate(end);
    setStartDate(start);
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

  // Location stats (group by city, fallback region, fallback "未知")
  const locationMap = new Map<string, { city: string | null; region: string | null; country: string | null; views: number; sessions: Set<string> }>();
  logs.forEach((l) => {
    if (l.action_type !== 'page_view') return;
    const label = l.city || l.region || (l.country ? l.country : '未知地區');
    const s = locationMap.get(label) || { city: l.city, region: l.region, country: l.country, views: 0, sessions: new Set<string>() };
    s.views++;
    s.sessions.add(l.session_id);
    locationMap.set(label, s);
  });
  const locationStats: LocationStat[] = Array.from(locationMap.entries())
    .map(([label, s]) => ({ label, city: s.city, region: s.region, country: s.country, views: s.views, uniqueSessions: s.sessions.size }))
    .sort((a, b) => b.views - a.views);

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
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
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

          {/* Date Range Filter */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => applyDateRange(0)}>今天</Button>
                  <Button variant="outline" size="sm" onClick={() => applyDateRange(7)}>最近7天</Button>
                  <Button variant="outline" size="sm" onClick={() => applyDateRange(30)}>最近30天</Button>
                  <Button variant="outline" size="sm" onClick={() => applyDateRange(90)}>最近90天</Button>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">自訂範圍：</span>
                  <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          'justify-start text-left font-normal',
                          !startDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'yyyy/MM/dd') : <span>開始日期</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date: Date | undefined) => {
                          setStartDate(date);
                          setStartCalendarOpen(false);
                        }}
                        locale={zhTW}
                        className={cn('p-3 pointer-events-auto')}
                        disabled={(date) => endDate ? isAfter(date, endDate) : false}
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="text-muted-foreground">—</span>
                  <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          'justify-start text-left font-normal',
                          !endDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'yyyy/MM/dd') : <span>結束日期</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date: Date | undefined) => {
                          setEndDate(date);
                          setEndCalendarOpen(false);
                        }}
                        locale={zhTW}
                        className={cn('p-3 pointer-events-auto')}
                        disabled={(date) => startDate ? isBefore(date, startDate) : false}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {startDate && endDate && (
                <p className="text-xs text-muted-foreground mt-3">
                  目前顯示：{format(startDate, 'yyyy/MM/dd')} 至 {format(endDate, 'yyyy/MM/dd')} 的資料
                </p>
              )}
            </CardContent>
          </Card>

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
            <TabsList className="mb-6 flex-wrap h-auto">
              <TabsTrigger value="overview">熱門頁面</TabsTrigger>
              <TabsTrigger value="clicks">點擊排行</TabsTrigger>
              <TabsTrigger value="locations">訪客地區</TabsTrigger>
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
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">點擊目標排行</CardTitle>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="搜尋點擊目標或頁面..."
                          value={clickSearch}
                          onChange={(e) => setClickSearch(e.target.value)}
                          className="pl-9 w-full sm:w-64"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (clickSortField === 'count') {
                              setClickSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
                            } else {
                              setClickSortField('count');
                              setClickSortDir('desc');
                            }
                          }}
                          className={cn(
                            'gap-1',
                            clickSortField === 'count' && 'bg-primary/10 border-primary/30'
                          )}
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                          次數 {clickSortField === 'count' && (clickSortDir === 'desc' ? '↓' : '↑')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (clickSortField === 'name') {
                              setClickSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
                            } else {
                              setClickSortField('name');
                              setClickSortDir('asc');
                            }
                          }}
                          className={cn(
                            'gap-1',
                            clickSortField === 'name' && 'bg-primary/10 border-primary/30'
                          )}
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                          名稱 {clickSortField === 'name' && (clickSortDir === 'desc' ? '↓' : '↑')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const filtered = clickStats.filter((s) =>
                      s.click_target.toLowerCase().includes(clickSearch.toLowerCase()) ||
                      s.page_path.toLowerCase().includes(clickSearch.toLowerCase())
                    );
                    const sorted = [...filtered].sort((a, b) => {
                      if (clickSortField === 'count') {
                        return clickSortDir === 'desc' ? b.count - a.count : a.count - b.count;
                      }
                      return clickSortDir === 'desc'
                        ? b.click_target.localeCompare(a.click_target, 'zh-TW')
                        : a.click_target.localeCompare(b.click_target, 'zh-TW');
                    });
                    return (
                      <>
                        <p className="text-xs text-muted-foreground mb-3">
                          共 {sorted.length} 筆資料
                          {clickSearch && ` (搜尋「${clickSearch}」)`}
                        </p>
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
                            {sorted.map((s, i) => (
                              <TableRow key={s.click_target}>
                                <TableCell className="font-medium">{i + 1}</TableCell>
                                <TableCell className="text-sm max-w-[200px] truncate">{s.click_target}</TableCell>
                                <TableCell className="font-mono text-sm">{s.page_path}</TableCell>
                                <TableCell className="text-right">{s.count}</TableCell>
                              </TableRow>
                            ))}
                            {sorted.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                  尚無符合條件的資料
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </>
                    );
                  })()}
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
