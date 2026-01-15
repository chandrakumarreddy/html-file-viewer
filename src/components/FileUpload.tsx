'use client';

import { useCallback, useState, useRef } from 'react';
import { Upload, FilePlus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useHtmlFilesStore } from '@/store/useHtmlFilesStore';
import { toast } from '@/hooks/use-toast';

export function FileUpload() {
  const { addFiles } = useHtmlFilesStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (files: FileList) => {
      // Convert to array immediately
      const fileArray = Array.from(files);
      const totalFiles = fileArray.length;

      const filesToAdd: Array<{
        id: string;
        name: string;
        content: string;
        size: number;
        uploadedAt: Date;
      }> = [];
      const errors: Array<{ fileName: string; reason: string }> = [];

      // Process all files sequentially
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];

        // Validate file type
        const isHtml = file.name.toLowerCase().endsWith('.html') || file.name.toLowerCase().endsWith('.htm');

        if (!isHtml) {
          errors.push({
            fileName: file.name,
            reason: 'Invalid file type. Only .html and .htm files are allowed.',
          });
          continue;
        }

        try {
          const content = await file.text();
          const fileData = {
            id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 11)}`,
            name: file.name,
            content,
            size: file.size,
            uploadedAt: new Date(),
          };
          filesToAdd.push(fileData);
        } catch (error) {
          errors.push({
            fileName: file.name,
            reason: 'Failed to read file content.',
          });
        }
      }

      // Show error toasts for invalid/failed files
      errors.forEach(({ fileName, reason }) => {
        toast({
          title: 'Upload Error',
          description: `${fileName}: ${reason}`,
          variant: 'destructive',
        });
      });

      // Batch update: Add all valid files in a single state update
      if (filesToAdd.length > 0) {
        addFiles(filesToAdd);
        toast({
          title: 'Files Uploaded',
          description: `${filesToAdd.length} file${filesToAdd.length > 1 ? 's' : ''} uploaded successfully.`,
        });
      } else {
        if (errors.length === 0 && totalFiles > 0) {
          toast({
            title: 'Upload Info',
            description: 'No valid HTML files found.',
            variant: 'default',
          });
        }
      }
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      if (!files || files.length === 0) {
        return;
      }

      processFiles(files);

      // Reset input to allow selecting the same files again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [processFiles]
  );

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Card
      className={`p-12 border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg'
          : 'border-border hover:border-primary/70 hover:shadow-md'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center transition-all duration-300 ${isDragging ? 'scale-110' : ''}`}>
            <Upload className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <Plus className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>

        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold text-center">Drop HTML Files Here</h3>
          <p className="text-muted-foreground max-w-sm text-center">
            Drag and drop your HTML files, or click to browse from your computer
          </p>
          <p className="text-tiny text-primary font-medium text-center">
            Supports multiple files
          </p>
        </div>

        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.htm"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <Button size="lg" onClick={handleButtonClick} className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
            <FilePlus className="w-5 h-5" />
            Browse Files
          </Button>
        </div>

        <div className="text-tiny text-muted-foreground text-center pt-2">
          Accepts .html and .htm files
        </div>
      </div>
    </Card>
  );
}
