import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Mail } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: '登入失敗',
            description: error.message === 'Invalid login credentials' 
              ? '帳號或密碼錯誤' 
              : error.message,
            variant: 'destructive',
          });
        } else {
          toast({ title: '登入成功', description: '歡迎回來！' });
          navigate('/admin');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          toast({
            title: '註冊失敗',
            description: error.message.includes('already registered')
              ? '此信箱已被註冊'
              : error.message,
            variant: 'destructive',
          });
        } else {
          toast({ title: '註冊成功', description: '帳號已建立，您現在可以登入' });
          setIsLogin(true);
        }
      }
    } catch (err) {
      toast({
        title: '錯誤',
        description: '發生未知錯誤，請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? '管理員登入' : '註冊帳號'}
            </CardTitle>
            <CardDescription>
              {isLogin ? '請輸入您的帳號密碼' : '建立新的管理員帳號'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">電子信箱</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密碼</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    minLength={6}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? '登入' : '註冊'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? '還沒有帳號？點此註冊' : '已有帳號？點此登入'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Auth;
