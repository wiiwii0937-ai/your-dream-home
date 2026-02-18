import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="relative mb-8">
            <span className="text-[10rem] font-black leading-none text-primary/10 select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-20 w-20 text-primary/40" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-3 text-foreground">
            找不到頁面
          </h1>
          <p className="text-muted-foreground mb-2">
            您訪問的頁面 <code className="bg-muted px-2 py-0.5 rounded text-sm">{location.pathname}</code> 不存在。
          </p>
          <p className="text-muted-foreground mb-8">
            頁面可能已被移除、名稱已更改，或暫時無法使用。
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                回到首頁
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回上一頁
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
