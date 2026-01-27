"use client";

import { Button } from "@/components/ui/button";
import {
  Trash2,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
  Sun,
  Moon,
  Check,
} from "lucide-react";
import { useHtmlFilesStore } from "@/store/useHtmlFilesStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useVirtualizer } from "@tanstack/react-virtual";

interface FileListSidebarProps {
  className?: string;
}

function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        title="Toggle theme"
        className="h-8 w-8"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  );
}

export function FileListSidebar({ className }: FileListSidebarProps) {
  const {
    files,
    selectedFileId,
    selectFile,
    removeFile,
    isSidebarOpen,
    toggleSidebar,
    sortFilesByName,
    toggleFileCompleted,
    getCompletedCount,
  } = useHtmlFilesStore();
  const completedCount = getCompletedCount();
  const progressPercentage =
    files.length > 0 ? (completedCount / files.length) * 100 : 0;

  const handleSort = (order: "asc" | "desc") => {
    sortFilesByName(order === "asc");
  };

  const sidebarWidth = isSidebarOpen ? "w-full" : "w-0";

  // Virtualization setup
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: files.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Estimated height of each file item
    overscan: 5, // Render a few extra items outside the visible area
  });

  if (!isSidebarOpen) {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="lg"
          onClick={toggleSidebar}
          className={className}
          title="Open Sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <aside
      className={`flex flex-col border-r bg-gradient-to-b from-card to-card/95 backdrop-blur-sm ${sidebarWidth} ${className}`}
    >
      <div className="shrink-0 p-5 border-b bg-gradient-to-r from-primary/5 via-primary/5 to-transparent">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 ring-2 ring-primary/20">
                <svg
                  className="w-5 h-5 text-primary-foreground"
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
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent tracking-tight">
              Files
            </h2>
          </div>
          <ToggleTheme />
        </div>

        <div className="flex items-center justify-between gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs font-medium hover:bg-primary/5 hover:border-primary/30 transition-all"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuItem
                onClick={() => handleSort("asc")}
                className="text-xs"
              >
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSort("desc")}
                className="text-xs"
              >
                Name (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            title="Close Sidebar"
            className="h-9 w-9 hover:bg-primary/5 hover:border-primary/30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-w-0">
        {files.length === 0 ? (
          <div className="p-10 text-center h-full overflow-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary/60"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2V8H20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground mb-2">
              No files yet
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload HTML files to view them in the preview
            </p>
          </div>
        ) : (
          <div
            ref={parentRef}
            className="h-full overflow-auto"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const file = files[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div
                      className={`group relative p-3 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden min-w-0 w-full ${
                        file.id === selectedFileId
                          ? ""
                          : file.completed
                            ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:shadow-md hover:shadow-primary/10"
                            : "bg-muted/50 hover:bg-muted border border-transparent hover:border-border/50 hover:shadow-sm"
                      }`}
                      onClick={() => selectFile(file.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0 w-full">
                        <div className="shrink-0">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                              file.id === selectedFileId
                                ? "bg-primary text-primary-foreground"
                                : file.completed
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted hover:bg-muted-foreground/10"
                            }`}
                          >
                            <Checkbox
                              checked={file.completed}
                              onCheckedChange={() => {
                                toggleFileCompleted(file.id);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-5 h-5"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate transition-colors ${
                              file.id === selectedFileId
                                ? "text-primary font-semibold"
                                : file.completed
                                  ? "text-primary"
                                  : "text-foreground"
                            }`}
                          >
                            {file.name}
                          </p>
                          {file.completed && (
                            <div className="flex items-center gap-1 mt-1 min-w-0">
                              <Check className="w-3 h-3 shrink-0" />
                              <span className="text-xs text-primary font-medium truncate">
                                Completed
                              </span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                            file.id === selectedFileId
                              ? "hover:bg-primary/20"
                              : file.completed
                                ? "hover:bg-primary/20"
                                : "hover:bg-destructive/10 hover:text-destructive"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          title="Delete file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="p-4 border-t bg-primary">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm gap-2 min-w-0">
              <span className="text-white font-medium truncate">
                {files.length} {files.length === 1 ? "file" : "files"}
              </span>
              <span className="text-white font-semibold truncate">
                {completedCount}/{files.length} completed
              </span>
            </div>
            <div className="relative">
              <Progress
                value={progressPercentage}
                className="h-2 bg-white/50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
