import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ImagePlus, X, Loader2, Upload, Camera, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  userId: string;
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  disabled?: boolean;
}

export function ImageUpload({ userId, imageUrl, onImageChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await uploadFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPG, PNG, GIF, etc.)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('help-request-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('help-request-images')
        .getPublicUrl(fileName);

      onImageChange(publicUrl);
      
      toast({
        title: '✨ Image uploaded!',
        description: 'Your image has been added successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onImageChange(null);
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {imageUrl ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg animate-fade-in">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Success indicator */}
          <div className="absolute top-3 left-3 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/90 text-success-foreground text-xs font-medium shadow-lg backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              Image Added
            </span>
          </div>
          
          {/* Remove button */}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg gap-1.5"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
            Remove
          </Button>
          
          {/* Bottom action hint */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white/90 text-sm text-center font-medium">
              Click remove to change image
            </p>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative w-full min-h-[200px] rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden",
            "flex flex-col items-center justify-center gap-4 p-8",
            dragActive 
              ? "border-primary bg-primary/10 scale-[1.02]" 
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            uploading && "cursor-wait pointer-events-none",
            disabled && "opacity-50 cursor-not-allowed",
            "group"
          )}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5 pattern-dots" />
          
          {/* Decorative gradient corners */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-secondary/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Uploading your image...</p>
                <p className="text-xs text-muted-foreground mt-1">This will only take a moment</p>
              </div>
            </div>
          ) : (
            <>
              {/* Icon container with animation */}
              <div className={cn(
                "relative transition-transform duration-300",
                dragActive ? "scale-110" : "group-hover:scale-105"
              )}>
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
                  dragActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                    : "bg-muted group-hover:bg-primary/10"
                )}>
                  {dragActive ? (
                    <Upload className="h-10 w-10 animate-bounce" />
                  ) : (
                    <Camera className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                
                {/* Floating sparkle */}
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ImagePlus className="h-5 w-5 text-primary float" />
                </div>
              </div>
              
              {/* Text content */}
              <div className="text-center space-y-2 relative z-10">
                <p className={cn(
                  "text-base font-semibold transition-colors duration-300",
                  dragActive ? "text-primary" : "text-foreground"
                )}>
                  {dragActive ? "Drop your image here" : "Add a photo to your request"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag & drop or <span className="text-primary font-medium underline underline-offset-2">browse files</span>
                </p>
              </div>
              
              {/* File requirements badge */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-muted/80 border border-border/50">
                <span className="text-xs text-muted-foreground">JPG, PNG, GIF</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span className="text-xs text-muted-foreground">Max 5MB</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
