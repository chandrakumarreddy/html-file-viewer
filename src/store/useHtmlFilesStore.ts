import { create } from "zustand";
import { useEffect, useState } from "react";

const DB_NAME = "html-files-db";
const DB_VERSION = 1;
const STORE_NAME = "files";

export interface HtmlFile {
  id: string;
  name: string;
  content: string;
  size: number;
  uploadedAt: Date;
  completed: boolean;
}

interface HtmlFilesState {
  files: HtmlFile[];
  selectedFileId: string | null;
  isSidebarOpen: boolean;
  hideAside: boolean;
  completedCount: number;
  addFile: (file: HtmlFile) => void;
  addFiles: (files: HtmlFile[]) => void;
  removeFile: (id: string) => void;
  selectFile: (id: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  sortFilesByName: (ascending?: boolean) => void;
  clearAllFiles: () => void;
  toggleFileCompleted: (id: string) => void;
  toggleHideAside: () => void;
  setHideAside: (hide: boolean) => void;
}

interface StoredData {
  files: HtmlFile[];
  selectedFileId: string | null;
  hideAside?: boolean;
}

// IndexedDB helpers
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

const saveToIndexedDB = async (data: StoredData): Promise<void> => {
  if (typeof window === "undefined") return;

  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.put(data, "state");
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  } catch (error) {
    console.error("Failed to save to IndexedDB:", error);
  }
};

const loadFromIndexedDB = async (): Promise<StoredData> => {
  if (typeof window === "undefined") {
    return { files: [], selectedFileId: null, hideAside: false };
  }

  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get("state") as IDBRequest<StoredData>;

    const data = await new Promise<StoredData>((resolve, reject) => {
      request.onsuccess = () =>
        resolve(request.result || { files: [], selectedFileId: null });
      request.onerror = () => reject(request.error);
    });

    db.close();

    // Convert date strings back to Date objects
    return {
      files: (data.files || []).map((file) => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt),
      })),
      selectedFileId: data.selectedFileId || null,
      hideAside: data.hideAside || false,
    };
  } catch (error) {
    console.error("Failed to load from IndexedDB:", error);
    return { files: [], selectedFileId: null, hideAside: false };
  }
};

export const useHtmlFilesStore = create<HtmlFilesState>((set, get) => {
  return {
    files: [],
    selectedFileId: null,
    isSidebarOpen: true,
    hideAside: true,
    completedCount: 0,

    addFile: (file) =>
      set((state) => {
        const newFiles = [...state.files, file];
        saveToIndexedDB({
          files: newFiles,
          selectedFileId: state.selectedFileId,
          hideAside: state.hideAside,
        });
        return {
          files: newFiles,
          completedCount: state.completedCount + (file.completed ? 1 : 0),
        };
      }),

    addFiles: (files) =>
      set((state) => {
        const newFiles = [...state.files, ...files];
        const newCompletedCount =
          state.completedCount + files.filter((f) => f.completed).length;
        saveToIndexedDB({
          files: newFiles,
          selectedFileId: state.selectedFileId,
          hideAside: state.hideAside,
        });
        return {
          files: newFiles,
          completedCount: newCompletedCount,
        };
      }),

    removeFile: (id) =>
      set((state) => {
        const removedFile = state.files.find((f) => f.id === id);
        const newFiles = state.files.filter((f) => f.id !== id);
        const newSelectedId =
          state.selectedFileId === id ? null : state.selectedFileId;
        saveToIndexedDB({
          files: newFiles,
          selectedFileId: newSelectedId,
          hideAside: state.hideAside,
        });
        return {
          files: newFiles,
          selectedFileId: newSelectedId,
          completedCount: removedFile?.completed
            ? state.completedCount - 1
            : state.completedCount,
        };
      }),

    selectFile: (id) =>
      set((state) => {
        saveToIndexedDB({
          files: state.files,
          selectedFileId: id,
          hideAside: state.hideAside,
        });
        return { selectedFileId: id };
      }),

    toggleSidebar: () =>
      set((state) => ({
        isSidebarOpen: !state.isSidebarOpen,
      })),

    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

    sortFilesByName: (ascending = true) =>
      set((state) => {
        const newFiles = [...state.files].sort((a, b) =>
          ascending
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name),
        );
        saveToIndexedDB({
          files: newFiles,
          selectedFileId: state.selectedFileId,
          hideAside: state.hideAside,
        });
        return { files: newFiles };
      }), // completedCount unchanged

    clearAllFiles: () =>
      set(() => {
        saveToIndexedDB({
          files: [],
          selectedFileId: null,
          hideAside: get().hideAside,
        });
        return { files: [], selectedFileId: null, completedCount: 0 };
      }),

    toggleFileCompleted: (id) =>
      set((state) => {
        const file = state.files.find((f) => f.id === id);
        if (!file) return state;

        const newCompleted = !file.completed;
        const newFiles = state.files.map((f) =>
          f.id === id ? { ...f, completed: newCompleted } : f,
        );

        // Non-blocking IndexedDB save
        saveToIndexedDB({
          files: newFiles,
          selectedFileId: state.selectedFileId,
          hideAside: state.hideAside,
        }).catch(() => {});

        return {
          files: newFiles,
          completedCount: newCompleted
            ? state.completedCount + 1
            : state.completedCount - 1,
        };
      }),

    getCompletedCount: () => {
      return get().files.filter((file) => file.completed).length;
    },

    toggleHideAside: () =>
      set((state) => {
        const newHideAside = !state.hideAside;
        saveToIndexedDB({
          files: state.files,
          selectedFileId: state.selectedFileId,
          hideAside: newHideAside,
        });
        return { hideAside: newHideAside };
      }),

    setHideAside: (hide) =>
      set((state) => {
        saveToIndexedDB({
          files: state.files,
          selectedFileId: state.selectedFileId,
          hideAside: hide,
        });
        return { hideAside: hide };
      }),
  };
});

// Hook to load IndexedDB data after client mount
export const useHydrateStore = (): boolean => {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (!hasHydrated && typeof window !== "undefined") {
      loadFromIndexedDB().then((stored) => {
        useHtmlFilesStore.setState({
          files: stored.files,
          selectedFileId: stored.selectedFileId,
          hideAside: stored.hideAside ?? false,
          completedCount: stored.files.filter((f) => f.completed).length,
        });
        setHasHydrated(true);
      });
    }
  }, [hasHydrated]);

  return hasHydrated;
};
