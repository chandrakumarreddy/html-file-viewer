import { create } from 'zustand';

export interface HtmlFile {
  id: string;
  name: string;
  content: string;
  size: number;
  uploadedAt: Date;
}

interface HtmlFilesState {
  files: HtmlFile[];
  selectedFileId: string | null;
  isSidebarOpen: boolean;
  addFile: (file: HtmlFile) => void;
  addFiles: (files: HtmlFile[]) => void;
  removeFile: (id: string) => void;
  selectFile: (id: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  sortFilesByName: (ascending?: boolean) => void;
  clearAllFiles: () => void;
}

export const useHtmlFilesStore = create<HtmlFilesState>((set) => ({
  files: [],
  selectedFileId: null,
  isSidebarOpen: true,

  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
    })),

  // Add multiple files in a single state update
  addFiles: (files) =>
    set((state) => ({
      files: [...state.files, ...files],
    })),

  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
      selectedFileId: state.selectedFileId === id ? null : state.selectedFileId,
    })),

  selectFile: (id) => set({ selectedFileId: id }),

  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  sortFilesByName: (ascending = true) =>
    set((state) => ({
      files: [...state.files].sort((a, b) =>
        ascending
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      ),
    })),

  clearAllFiles: () => set({ files: [], selectedFileId: null }),
}));
