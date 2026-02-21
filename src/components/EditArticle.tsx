import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

/** 排版選項：Layout A - 預設、Layout B - 滿版圖片、Layout C - 兩欄式 */
export const ARTICLE_LAYOUTS = [
  { value: 'default', label: 'Layout A - 預設' },
  { value: 'hero', label: 'Layout B - 滿版圖片' },
  { value: 'twocolumn', label: 'Layout C - 兩欄式' },
] as const;

export type ArticleLayout = (typeof ARTICLE_LAYOUTS)[number]['value'];

export interface EditArticleProps {
  postId: string;
  initialTitle: string;
  initialContent: string;
  initialLayout: string;
  onSuccess?: () => void;
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link', 'blockquote'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'link', 'blockquote',
];

export const EditArticle = ({
  postId,
  initialTitle,
  initialContent,
  initialLayout,
  onSuccess,
}: EditArticleProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [layout, setLayout] = useState<string>(initialLayout || 'default');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: '請輸入標題', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: title.trim(),
          content: content || null,
          layout: layout || 'default',
        })
        .eq('id', postId);

      if (error) throw error;
      toast({ title: '修改成功' });
      if (onSuccess) onSuccess();
      else navigate('/admin');
    } catch (error: any) {
      toast({
        title: '儲存失敗',
        description: error.message?.includes('row-level security')
          ? '您沒有權限執行此操作'
          : error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="edit-article-title">
          文章標題 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="edit-article-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="請輸入文章標題"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label>內容</Label>
        <div className="rounded-md border border-input [&_.ql-toolbar]:rounded-t-md [&_.ql-container]:rounded-b-md [&_.ql-container]:min-h-[240px] [&_.ql-editor]:min-h-[200px]">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            placeholder="請輸入文章內容..."
            className="[&_.ql-snow]:border-0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>排版模式</Label>
        <Select value={layout} onValueChange={setLayout}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="選擇排版樣式" />
          </SelectTrigger>
          <SelectContent>
            {ARTICLE_LAYOUTS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          儲存
        </Button>
        <Button variant="outline" onClick={() => navigate('/admin')}>
          取消
        </Button>
      </div>
    </div>
  );
};

export default EditArticle;
