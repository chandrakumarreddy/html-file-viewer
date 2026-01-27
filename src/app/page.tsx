"use client";

import { FileUpload } from "@/components/FileUpload";
import { FileListSidebar } from "@/components/FileListSidebar";
import { FilePreview } from "@/components/FilePreview";
import { useHtmlFilesStore, useHydrateStore } from "@/store/useHtmlFilesStore";
import { Loader2 } from "lucide-react";

function InitialLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-background via-background to-muted/30 text-foreground">
      <div className="relative">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <div className="absolute inset-0 w-12 h-12 rounded-full bg-primary/20 blur-xl animate-pulse" />
      </div>
      <p className="text-muted-foreground mt-4 font-medium">Loading...</p>
    </div>
  );
}

export default function Home() {
  const hasHydrated = useHydrateStore();
  const { files, selectedFileId, isSidebarOpen } = useHtmlFilesStore();

  if (!hasHydrated) {
    return <InitialLoader />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside
        className={
          isSidebarOpen
            ? "min-w-80 max-w-[25%] shrink-0 border-r bg-gradient-to-b from-card to-card/95"
            : "w-0"
        }
      >
        <FileListSidebar className="h-full" />
      </aside>

      <main className="flex-1 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="w-full h-full relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
          <div className="relative h-full">
            {selectedFileId ? (
              <FilePreview />
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                <div className="w-full max-w-4xl text-center space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6 shadow-xl shadow-primary/10 ring-1 ring-primary/20">
                      <svg
                        className="w-10 h-10 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2L2 7L12 12L22 7L12 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 17L12 22L22 17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 12L12 17L22 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                      {files.length === 0 ? "Welcome" : "Upload More Files"}
                    </h2>
                    <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
                      {files.length === 0
                        ? "Upload your HTML files to get started"
                        : `${files.length} file${files.length > 1 ? "s" : ""} uploaded`}
                    </p>
                  </div>
                  <FileUpload />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
