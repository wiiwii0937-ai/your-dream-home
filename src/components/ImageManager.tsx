import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSiteImages } from '@/hooks/useSiteImages';
import { SITE_IMAGE_SLOTS } from '@/lib/siteImageSlots';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  Loader2, Upload, Trash2, RefreshCw, Image as ImageIcon,
  Plus, X, Copy, Check, Download, ChevronDown, ChevronRight
} from 'lucide-react';

interface ManagedImage {
  id: string;
  file_name: string;
  file_path: string;
  public_url: string;
  alt_text: string | null;
  created_at: string;
  usage_key?: string | null;
  url?: string | null;
  label?: string | null;
  storage_path?: string | null;
}

export const ImageManager = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: siteImages = [], refetch: refetchSiteImages } = useSiteImages();

  const [images, setImages] = useState<ManagedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [siteSlotsOpen, setSiteSlotsOpen] = useState(true);
  const [replacing, setReplacing] = useState<string | null>(null);
  const [replacingSlotKey, setReplacingSlotKey] = useState<string | null>(null);
  const slotReplaceRef = useRef<HTMLInputElement>(null);
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
            url: publicUrl,
            storage_path: filePath,
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

  const handleImportSiteImages = async () => {
    if (!user || !isAdmin) return;
    setImporting(true);
    try {
      const existingKeys = new Set(siteImages.map((img) => img.usage_key).filter(Boolean));
      let imported = 0;

      for (const slot of SITE_IMAGE_SLOTS) {
        if (existingKeys.has(slot.usageKey)) continue;

        const isExternal = slot.defaultUrl.startsWith('http');
        let publicUrl = slot.defaultUrl;
        let filePath = slot.defaultUrl;
        let fileName = `${slot.usageKey}.jpg`;

        if (!isExternal && slot.isLocalAsset) {
          const fullUrl = slot.defaultUrl.startsWith('/') ? `${window.location.origin}${slot.defaultUrl}` : slot.defaultUrl;
          const res = await fetch(fullUrl);
          if (!res.ok) {
            toast({ title: `無法取得 ${slot.label}`, variant: 'destructive' });
            continue;
          }
          const blob = await res.blob();
          const ext = slot.defaultUrl.split('.').pop()?.split('?')[0] || 'jpg';
          filePath = `site-slots/${Date.now()}-${slot.usageKey}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from('website-images')
            .upload(filePath, blob, { cacheControl: '3600', upsert: false });

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage.from('website-images').getPublicUrl(filePath);
          publicUrl = urlData.publicUrl;
          fileName = `${slot.usageKey}.${ext}`;
        } else if (isExternal) {
          filePath = slot.defaultUrl;
          fileName = `${slot.usageKey}.jpg`;
        }

        const { error: dbError } = await supabase.from('images_management').insert({
          user_id: user.id,
          file_name: fileName,
          file_path: filePath,
          public_url: publicUrl,
          usage_key: slot.usageKey,
          url: publicUrl,
          label: slot.label,
          storage_path: filePath,
        } as any);

        if (dbError) throw dbError;
        imported++;
      }

      if (imported > 0) {
        toast({ title: '匯入成功', description: `已匯入 ${imported} 張網站圖片` });
        fetchImages();
        refetchSiteImages();
        queryClient.invalidateQueries({ queryKey: ['site-images'] });
      } else {
        toast({ title: '無需匯入', description: '所有網站圖片已存在於後端' });
      }
    } catch (err: any) {
      toast({ title: '匯入失敗', description: err.message, variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  const handleAssignSlot = async (imageId: string, usageKey: string) => {
    try {
      await supabase
        .from('images_management')
        .update({ usage_key: null } as any)
        .eq('usage_key', usageKey);

      const { error } = await supabase
        .from('images_management')
        .update({ usage_key: usageKey } as any)
        .eq('id', imageId);

      if (error) throw error;
      toast({ title: '已指派至網站 slot' });
      fetchImages();
      refetchSiteImages();
      queryClient.invalidateQueries({ queryKey: ['site-images'] });
    } catch (err: any) {
      toast({ title: '指派失敗', description: (err as Error).message, variant: 'destructive' });
    }
  };

  const handleDelete = async (image: ManagedImage) => {
    try {
      const isExternal = image.file_path.startsWith('http');
      if (!isExternal) {
        const { error: storageError } = await supabase.storage
          .from('website-images')
          .remove([image.file_path]);
        if (storageError) throw storageError;
      }

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
      // Upload new file to images/ folder
      const ext = file.name.split('.').pop();
      const newPath = `images/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(newPath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      // Delete old file (only if it was a storage path, not external URL)
      const isOldExternal = image.file_path.startsWith('http');
      if (!isOldExternal) {
        await supabase.storage.from('website-images').remove([image.file_path]);
      }

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
          url: publicUrl,
          storage_path: newPath,
        } as any)
        .eq('id', image.id);

      if (dbError) throw dbError;

      toast({ title: '圖片已替換' });
      fetchImages();
      refetchSiteImages();
      queryClient.invalidateQueries({ queryKey: ['site-images'] });
    } catch (err: any) {
      toast({ title: '替換失敗', description: err.message, variant: 'destructive' });
    } finally {
      setReplacing(null);
      if (replaceRef.current) replaceRef.current.value = '';
    }
  };

  /** 更換指定 slot (usage_key) 的圖片 */
  const handleSlotReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingSlotKey) return;

    try {
      // Upload to images/ folder
      const ext = file.name.split('.').pop();
      const storagePath = `images/${Date.now()}-${replacingSlotKey}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(storagePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('website-images')
        .getPublicUrl(storagePath);

      // Find existing record by usage_key
      const existing = images.find(i => i.usage_key === replacingSlotKey);

      if (existing) {
        // Delete old storage file if not external
        const isOldExternal = existing.file_path.startsWith('http');
        if (!isOldExternal) {
          await supabase.storage.from('website-images').remove([existing.file_path]);
        }

        // Update existing record
        const { error: dbError } = await supabase
          .from('images_management')
          .update({
            file_name: file.name,
            file_path: storagePath,
            public_url: publicUrl,
            url: publicUrl,
            storage_path: storagePath,
          } as any)
          .eq('usage_key', replacingSlotKey);

        if (dbError) throw dbError;
      } else {
        // No existing record — insert new
        const slot = SITE_IMAGE_SLOTS.find(s => s.usageKey === replacingSlotKey);
        const { error: dbError } = await supabase
          .from('images_management')
          .insert({
            user_id: user!.id,
            file_name: file.name,
            file_path: storagePath,
            public_url: publicUrl,
            usage_key: replacingSlotKey,
            url: publicUrl,
            label: slot?.label ?? replacingSlotKey,
            storage_path: storagePath,
          } as any);

        if (dbError) throw dbError;
      }

      const isCarousel = replacingSlotKey.startsWith('home-carousel-');
      toast({ title: isCarousel ? '首頁大圖更新成功！' : '圖片已更換' });
      fetchImages();
      refetchSiteImages();
      queryClient.invalidateQueries({ queryKey: ['site-images'] });
    } catch (err: any) {
      toast({ title: '更換失敗', description: err.message, variant: 'destructive' });
    } finally {
      setReplacingSlotKey(null);
      if (slotReplaceRef.current) slotReplaceRef.current.value = '';
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
            <input
              ref={slotReplaceRef}
              type="file"
              accept="image/*"
              onChange={handleSlotReplace}
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
      <CardContent className="p-6 space-y-6">
        {/* 網站圖片 Slot 管理 */}
        <Collapsible open={siteSlotsOpen} onOpenChange={setSiteSlotsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between hover:bg-secondary/50 -mx-2 px-2">
              <span className="flex items-center gap-2 font-medium">
                {siteSlotsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                網站圖片 Slot 管理（{siteImages.length} / {SITE_IMAGE_SLOTS.length} 已指派）
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 p-4 rounded-lg border border-border bg-secondary/20 space-y-4">
              <p className="text-sm text-muted-foreground">
                將首頁輪播、工程實例、服務項目等網站現有圖片匯入後端，之後可在下方進行修改或刪除。
              </p>
              <Button
                onClick={handleImportSiteImages}
                disabled={!isAdmin || importing}
                variant="outline"
                className="gap-2"
              >
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {importing ? '匯入中...' : '匯入網站圖片'}
              </Button>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                {SITE_IMAGE_SLOTS.map((slot) => {
                  const assigned = siteImages.find((img) => img.usage_key === slot.usageKey);
                  return (
                    <div
                      key={slot.usageKey}
                      className="flex flex-col gap-1 rounded-lg border border-border overflow-hidden bg-card"
                    >
                      <div className="aspect-video bg-secondary relative group">
                        <img
                          src={assigned?.url ?? assigned?.public_url ?? slot.defaultUrl}
                          alt={slot.label}
                          className="w-full h-full object-cover"
                        />
                        {/* 更換圖片 overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="gap-1 text-xs h-7"
                            disabled={!isAdmin}
                            onClick={() => {
                              setReplacingSlotKey(slot.usageKey);
                              slotReplaceRef.current?.click();
                            }}
                          >
                            <RefreshCw className="w-3 h-3" />
                            更換圖片
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs px-2 py-1 truncate" title={slot.label}>
                        {slot.label}
                      </p>
                      {assigned && (
                        <p className="text-xs text-muted-foreground px-2 pb-1">✓ 已管理</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

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
