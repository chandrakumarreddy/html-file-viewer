'use client';

import { useEffect, useRef, useState } from 'react';
import { FileCode, X, Maximize2, Minimize2, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useHtmlFilesStore } from '@/store/useHtmlFilesStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function FilePreview() {
  const { files, selectedFileId, selectFile } = useHtmlFilesStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const selectedFile = files.find((f) => f.id === selectedFileId);

  const handleDownload = () => {
    if (!selectedFile) return;
    const blob = new Blob([selectedFile.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenInNewTab = () => {
    if (!selectedFile) return;
    const blob = new Blob([selectedFile.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleClose = () => {
    selectFile(null);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setDialogOpen(!isFullscreen);
  };

  // Inject CSS to prevent styles from bleeding out
  const getSafeHtmlContent = (html: string) => {
    return html;
  };

  useEffect(() => {
    // Update iframe content when file changes
    if (iframeRef.current && selectedFile) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(selectedFile.content);
        doc.close();

        // Add base styles to make preview nicer
        const style = doc.createElement('style');
        style.textContent = `
          * { box-sizing: border-box; }
          body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; }
        `;
        doc.head?.appendChild(style);
      }
    }
  }, [selectedFile]);

  if (!selectedFile) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="p-12 max-w-md text-center">
          <FileCode className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No File Selected</h3>
          <p className="text-sm text-muted-foreground">
            Select a file from the sidebar to preview its content
          </p>
        </Card>
      </div>
    );
  }

  const previewContent = (
    <div className="flex flex-col h-full">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FileCode className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-tiny font-semibold truncate">{selectedFile.name}</h3>
            <p className="text-tiny text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenInNewTab}
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            title="Fullscreen preview"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            title="Close preview"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-muted/30 overflow-hidden relative">
        <div ref={previewRef} className="w-full h-full">
          <iframe
            ref={iframeRef}
            title={selectedFile.name}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 flex flex-col">
          <div className="flex-1 flex flex-col h-[calc(95vh-8rem)]">
            {previewContent}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return <div className="flex-1 flex flex-col h-full">{previewContent}</div>;
}
