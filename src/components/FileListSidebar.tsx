'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronRight, ChevronLeft, ArrowUpDown, Sun, Moon } from 'lucide-react';
import { useHtmlFilesStore } from '@/store/useHtmlFilesStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

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
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
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
  const { files, selectedFileId, selectFile, removeFile, isSidebarOpen, toggleSidebar, sortFilesByName } =
    useHtmlFilesStore();

  const handleSort = (order: 'asc' | 'desc') => {
    sortFilesByName(order === 'asc');
  };

  const sidebarWidth = isSidebarOpen ? 'w-80' : 'w-0';

  if (!isSidebarOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={className}
        title="Open Sidebar"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <aside className={`flex flex-col border-r bg-card ${sidebarWidth} ${className}`}>
      <div className="flex-shrink-0 p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              HTML Files
            </h2>
          </div>
          <ToggleTheme />
        </div>

        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 mt-2">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort('asc')}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('desc')}>
                Name (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} title="Close Sidebar">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {files.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-lg font-semibold mb-2">No files uploaded yet</p>
              <p className="text-tiny text-muted-foreground mt-4">
                Drag and drop your HTML files or click to browse
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group relative p-3 rounded-lg transition-colors cursor-pointer hover:shadow-sm"
                  onClick={() => selectFile(file.id)}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-tiny font-medium truncate flex-1">{file.name}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 flex-shrink-0 hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {files.length > 0 && (
        <div className="p-3 border-t text-center text-tiny text-muted-foreground">
          {files.length} {files.length === 1 ? 'file' : 'files'}
        </div>
      )}
    </aside>
  );
}
