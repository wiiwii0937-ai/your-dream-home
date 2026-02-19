import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import {
  Loader2, Upload, Trash2, RefreshCw, Image as ImageIcon,
  Plus, X, Copy, Check
} from 'lucide-react';

interface ManagedImage {
  id: string;
  file_name: string;
  file_path: string;
  public_url: string;
  alt_text: string | null;
  created_at: string;
}

export const ImageManager = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const [images, setImages] = useState<ManagedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [replacing, setReplacing] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('images_management')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: '載入圖片失敗', description: error.message, variant: 'destructive' });
    } else {
      setImages((data as ManagedImage[]) || []);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !user) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 10 * 1024 * 1024) {
          toast({ title: `${file.name} 超過 10MB 限制`, variant: 'destructive' });
          continue;
        }

        const ext = file.name.split('.').pop();
        const filePath = `uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('website-images')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('website-images')
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('images_management')
          .insert({
            user_id: user.id,
            file_name: file.name,
            file_path: filePath,
            public_url: publicUrl,
          } as any);

        if (dbError) throw dbError;
      }

      toast({ title: '上傳成功' });
      fetchImages();
    } catch (err: any) {
      toast({ title: '上傳失敗', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (uploadRef.current) uploadRef.current.value = '';
    }
  };

  const handleDelete = async (image: ManagedImage) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('website-images')
        .remove([image.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('images_management')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      toast({ title: '已刪除圖片' });
      setImages(prev => prev.filter(i => i.id !== image.id));
    } catch (err: any) {
      toast({ title: '刪除失敗', description: err.message, variant: 'destructive' });
    }
  };

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacing) return;

    const image = images.find(i => i.id === replacing);
    if (!image) return;

    try {
      // Upload new file
      const ext = file.name.split('.').pop();
      const newPath = `uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(newPath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      // Delete old file
      await supabase.storage.from('website-images').remove([image.file_path]);

      // Get new public URL
      const { data: { publicUrl } } = supabase.storage
        .from('website-images')
        .getPublicUrl(newPath);

      // Update database
      const { error: dbError } = await supabase
        .from('images_management')
        .update({
          file_name: file.name,
          file_path: newPath,
          public_url: publicUrl,
        } as any)
        .eq('id', image.id);

      if (dbError) throw dbError;

      toast({ title: '圖片已替換' });
      fetchImages();
    } catch (err: any) {
      toast({ title: '替換失敗', description: err.message, variant: 'destructive' });
    } finally {
      setReplacing(null);
      if (replaceRef.current) replaceRef.current.value = '';
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast({ title: '已複製圖片網址' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-border bg-secondary/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ImageIcon className="w-5 h-5 text-primary" />
              圖片管理
            </CardTitle>
            <CardDescription className="mt-1">
              管理網站的所有圖片資源（共 {images.length} 張）
            </CardDescription>
          </div>
          <div>
            <input
              ref={uploadRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
            <input
              ref={replaceRef}
              type="file"
              accept="image/*"
              onChange={handleReplace}
              className="hidden"
            />
            <Button
              onClick={() => uploadRef.current?.click()}
              className="gap-2"
              disabled={!isAdmin || uploading}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {uploading ? '上傳中...' : '上傳圖片'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>載入圖片中...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-1">尚無圖片</h3>
            <p className="text-muted-foreground text-sm mb-4">
              點擊上方按鈕上傳第一張圖片
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative rounded-lg overflow-hidden border border-border bg-secondary/20 aspect-square"
              >
                <img
                  src={image.public_url}
                  alt={image.alt_text || image.file_name}
                  className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                  onClick={() => setPreviewUrl(image.public_url)}
                />
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <p className="text-white text-xs text-center truncate w-full px-1">
                    {image.file_name}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => copyUrl(image.public_url, image.id)}
                      title="複製網址"
                    >
                      {copiedId === image.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => {
                        setReplacing(image.id);
                        replaceRef.current?.click();
                      }}
                      disabled={!isAdmin}
                      title="替換圖片"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          disabled={!isAdmin}
                          title="刪除圖片"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>確定要刪除這張圖片嗎？</AlertDialogTitle>
                          <AlertDialogDescription>
                            此操作將同時刪除儲存空間中的檔案「{image.file_name}」，無法復原。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(image)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            確定刪除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="sm:max-w-3xl p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>圖片預覽</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
