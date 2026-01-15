# HTML Files - File Manager

A modern web application for uploading, viewing, and managing HTML files with a beautiful UI and seamless user experience.

## Features

- **Multiple File Upload**: Upload multiple HTML files at once with drag and drop support
- **File Sorting**: Sort files alphabetically by filename (A-Z or Z-A)
- **File Preview**: Preview HTML files in an iframe with full security sandboxing
- **Toggle Sidebar**: Collapsible sidebar for better screen real estate management
- **Dark Mode**: Built-in theme support with light/dark mode toggle
- **Always Available Upload**: Upload option remains visible even after files are uploaded
- **Default Center Pane**: Upload area is the default center pane until a file is selected
- **Responsive Design**: Fully responsive layout that works on all devices
- **File Management**: Delete files, download files, open in new tab
- **Full-Screen Preview**: Option to view files in full-screen mode

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **State Management**: Zustand
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Theme**: next-themes

## Getting Started

The application is already set up and running. The development server is available at `http://localhost:3000`.

### Development Commands

```bash
# Run development server
bun run dev

# Run linter
bun run lint

# Build for production
bun run build
```

## Component Structure

### Core Components

1. **FileUpload** (`src/components/FileUpload.tsx`)
   - Handles drag and drop file uploads
   - Supports multiple files
   - Validates HTML file types
   - Always visible for easy access
   - Enhanced visual design with animations

2. **FileListSidebar** (`src/components/FileListSidebar.tsx`)
   - Displays uploaded files in a scrollable list
   - Provides sorting options (A-Z, Z-A)
   - Toggle functionality for collapsing sidebar
   - Shows file metadata (name, upload time)

3. **FilePreview** (`src/components/FilePreview.tsx`)
   - Renders HTML content in a sandboxed iframe
   - Full-screen preview mode
   - Download and open in new tab options
   - File metadata display

### State Management

- **Zustand Store** (`src/store/useHtmlFilesStore.ts`)
  - Manages file list state
  - Handles file selection
  - Controls sidebar visibility
  - Provides file sorting functionality

## Usage

1. **Upload Files**: Drag and drop HTML files or click "Browse Files" to upload multiple files
2. **View Files**: Click on any file in the sidebar to preview its content
3. **Continue Uploading**: Upload option remains visible in the center pane
4. **Return to Upload**: Close the preview to return to the upload area
5. **Sort Files**: Use the "Sort" button in the sidebar to organize files by name
6. **Toggle Sidebar**: Click the sidebar toggle button to show/hide the file list
7. **Full-Screen Preview**: Use the maximize button to view files in full-screen mode
8. **Download/Open**: Use the download or external link buttons to work with files
9. **Delete Files**: Click the trash icon to remove files from the list

## Design Features

### Beautiful Logo
- Custom gradient logo with layered design
- Professional geometric patterns
- Consistent branding throughout the app

### Header
- Clean, minimal header with logo and website name only
- No description text
- Dark mode toggle button

### No Footer
- Removed all footer content
- Full height application with no trademark info

### Upload Experience
- Always available upload option
- Enhanced visual design with animations
- Clear feedback during drag and drop
- Supports multiple file selection
- Default center pane for optimal workflow

## Theme Support

The application supports:
- System theme (default)
- Light mode
- Dark mode

Toggle between themes using the sun/moon icon in the header.

## File Handling

All file operations are handled client-side using the browser's File API:
- Files are stored in memory (Zustand store)
- No server-side file storage required
- Supports drag and drop with visual feedback
- Multiple file support
- Secure iframe rendering with sandbox attributes

## Security Features

- File type validation (.html, .htm only)
- Sandboxed iframe rendering
- Content isolation between previews
- No execution of external scripts without user consent

## Responsive Design

- Mobile-first approach
- Adaptive layout for different screen sizes
- Touch-friendly interface elements
- Optimized for both desktop and mobile devices

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- File API
- iframe sandboxing

## Changes Made

1. ✅ Upload option remains visible after files are uploaded
2. ✅ Upload area is the default center pane
3. ✅ Multiple file support with enhanced UI
4. ✅ Beautiful logo added to header
5. ✅ Header shows only website name (no description)
6. ✅ Footer completely removed
7. ✅ All trademark information removed
8. ✅ Enhanced upload component with better visual feedback
9. ✅ Improved overall user experience

## License

MIT License - Feel free to use this project for your own needs.
