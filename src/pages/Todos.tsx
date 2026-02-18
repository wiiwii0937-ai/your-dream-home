import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

const Todos = () => {
  const { user, loading: authLoading } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchTodos();
  }, [user]);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError('無法載入待辦事項');
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !user) return;
    setAdding(true);
    const { error } = await supabase
      .from('todos')
      .insert({ title: newTitle.trim(), user_id: user.id });

    if (error) {
      toast({ title: '新增失敗', description: error.message, variant: 'destructive' });
    } else {
      setNewTitle('');
      fetchTodos();
    }
    setAdding(false);
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', id);

    if (!error) {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t));
    }
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (!error) {
      setTodos(prev => prev.filter(t => t.id !== id));
    }
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">待辦事項</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={addTodo} className="flex gap-2">
                <Input
                  placeholder="新增待辦事項..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={adding || !newTitle.trim()}>
                  {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </form>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-destructive py-4">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                  <Button variant="outline" size="sm" onClick={fetchTodos}>重試</Button>
                </div>
              ) : todos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">尚無待辦事項</p>
              ) : (
                <ul className="space-y-2">
                  {todos.map(todo => (
                    <li key={todo.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-background/50">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                      />
                      <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {todo.title}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Todos;
