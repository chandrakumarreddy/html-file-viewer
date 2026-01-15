'use client';

import { FileUpload } from '@/components/FileUpload';
import { FileListSidebar } from '@/components/FileListSidebar';
import { FilePreview } from '@/components/FilePreview';
import { useHtmlFilesStore } from '@/store/useHtmlFilesStore';

export default function Home() {
  const { files, selectedFileId, isSidebarOpen } = useHtmlFilesStore();

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className={isSidebarOpen ? 'w-80 flex-shrink-0 border-r bg-card' : 'w-0'}>
        <FileListSidebar className="h-full" />
      </aside>

      <main className="flex-1 bg-background">
        <div className="w-full h-full">
          {selectedFileId ? (
            <FilePreview />
          ) : (
            <div className="flex items-center justify-center h-full p-6">
              <div className="w-full max-w-3xl text-center">
                {files.length === 0 ? (
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2">Welcome</h2>
                    <p className="text-muted-foreground text-base">
                      Upload your HTML files to get started
                    </p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2">Upload More Files</h2>
                    <p className="text-muted-foreground text-base">
                      {files.length} file{files.length > 1 ? 's' : ''} uploaded
                    </p>
                  </div>
                )}
                <FileUpload />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
