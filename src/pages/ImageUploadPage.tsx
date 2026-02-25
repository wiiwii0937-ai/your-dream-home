import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Upload, CheckCircle2, X, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface UploadedFile {
  id: string;
  file_name: string;
  public_url: string;
  size: string;
}

export default function ImageUploadPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('請選擇圖片格式的檔案（JPG、PNG、GIF、WebP 等）');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('圖片大小不能超過 10MB');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    setUploading(true);
    setError(null);

    try {
      const ext = selectedFile.name.split('.').pop();
      const filePath = `uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, selectedFile, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      const { data, error: dbError } = await supabase
        .from('images_management')
        .insert({
          user_id: user.id,
          file_name: selectedFile.name,
          file_path: filePath,
          public_url: publicUrl,
          url: publicUrl,
        } as any)
        .select()
        .single();

      if (dbError) throw dbError;

      setUploadedFiles(prev => [{
        id: (data as any).id,
        file_name: selectedFile.name,
        public_url: publicUrl,
        size: formatBytes(selectedFile.size),
      }, ...prev]);

      // Reset for next upload
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('ImageUploadPage 上傳失敗詳細錯誤:', err);
      setError(err.message || '上傳失敗，請稍後再試');
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-12 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">圖片上傳</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                上傳圖片至網站圖庫，格式僅限圖片，大小上限 10MB
              </p>
            </div>
          </div>

          {/* Upload Card */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ImageIcon className="w-5 h-5 text-primary" />
                選擇圖片
              </CardTitle>
              <CardDescription>
                點擊或拖曳圖片到下方區域以開始上傳
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Drop Zone */}
              {!preview ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'cursor-pointer',
                    'border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200',
                    dragOver
                      ? 'border-primary bg-primary/5 scale-[1.01]'
                      : 'border-border hover:border-primary hover:bg-primary/5'
                  )}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors',
                      dragOver ? 'bg-primary/10' : 'bg-secondary'
                    )}>
                      <Upload className={cn('w-8 h-8 transition-colors', dragOver ? 'text-primary' : 'text-muted-foreground')} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {dragOver ? '放開以選擇圖片' : '拖曳圖片至此，或'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        支援 JPG、PNG、GIF、WebP（最大 10MB）
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <ImageIcon className="w-5 h-5" />
                      選擇檔案
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                    aria-label="選擇圖片"
                    title="選擇圖片"
                  />
                </div>
              ) : (
                /* Preview Area */
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-border bg-secondary/20">
                    <img
                      src={preview}
                      alt="上傳預覽"
                      className="w-full max-h-72 object-contain"
                    />
                    <button
                      onClick={clearPreview}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-sm border border-border"
                      aria-label="清除預覽"
                      title="清除預覽"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                    <span className="truncate font-medium text-foreground">{selectedFile?.name}</span>
                    <span className="flex-shrink-0 ml-2">{selectedFile && formatBytes(selectedFile.size)}</span>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !isAdmin}
                    className="w-full h-11 gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        上傳中...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        {isAdmin ? '開始上傳' : '需要管理員權限'}
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
                  <X className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Success Results */}
          {uploadedFiles.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                  上傳成功（{uploadedFiles.length} 張）
                </CardTitle>
                <CardDescription>以下圖片已成功上傳並儲存至資料庫</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/40 border border-border group"
                  >
                    <img
                      src={file.public_url}
                      alt={file.file_name}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{file.file_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{file.size}</p>
                      <a
                        href={file.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-0.5 block truncate"
                      >
                        {file.public_url}
                      </a>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
