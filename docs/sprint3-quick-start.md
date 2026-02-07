# Sprint 3 - Quick Start Guide

**For Developers**: Integrating Document Preview & Web Viewer

---

## Quick Import

```typescript
// Document Preview
export { DocumentPreview, PdfPreview, DocxPreview, DocPreview } from '@/components/file-preview';
export type { FileType } from '@/components/file-preview';

// Web Viewer
export { WebViewer } from '@/components/web-viewer';
```

---

## Document Preview Usage

### Basic Example

```typescript
import { DocumentPreview } from '@/components/file-preview';

export default function MyFileViewer() {
  return (
    <DocumentPreview
      fileUrl="/documents/report.pdf"
      fileName="Q4 Report.pdf"
      onClose={() => console.log('Closed')}
      onDownload={() => console.log('Downloaded')}
      className="h-screen"
    />
  );
}
```

### Auto Type Detection

```typescript
// If you don't know the file type, just provide fileName
<DocumentPreview
  fileUrl="/docs/file.docx"
  fileName="My Document.docx"
/>
// Automatically detects .docx and renders DocxPreview
```

### Preview Specific Component

```typescript
import { PdfPreview } from '@/components/file-preview';

function PdfViewer() {
  return (
    <PdfPreview
      fileUrl="/path/to/file.pdf"
      fileName="Document.pdf"
      onClose={handleClose}
      onDownload={handleDownload}
    />
  );
}
```

---

## Web Viewer Usage

### Basic Example

```typescript
import { WebViewer } from '@/components/web-viewer';

export default function MyBrowser() {
  return (
    <WebViewer
      initialUrl="https://example.com"
      onClose={() => console.log('Closed')}
      className="h-screen"
    />
  );
}
```

### With Custom Controls

```typescript
// Web Viewer includes built-in navigation and scale controls
// Just initialize with a URL:
<WebViewer initialUrl="https://react.dev" />
```

---

## File Type Detection

```typescript
import { detectFileType, type FileType } from '@/components/file-preview';

// Returns: 'pdf' | 'docx' | 'doc' | 'unknown'
const fileType = detectFileType('my-document.pdf');
console.log(fileType); // 'pdf'
```

---

## Examples

### Example 1: File Upload + Preview

```typescript
'use client';

import { useState, useCallback } from 'react';
import { DocumentPreview, detectFileType } from '@/components/file-preview';

function FileUploadViewer() {
  const [file, setFile] = useState<{ url: string; name: string; type: string } | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setFile({
        url,
        name: selectedFile.name,
        type: detectFileType(selectedFile.name)
      });
    }
  }, []);

  return (
    <div>
      <input type="file" accept=".pdf,.docx,.doc" onChange={handleFileChange} />
      {file && (
        <DocumentPreview
          fileUrl={file.url}
          fileName={file.name}
          fileType={file.type}
          onClose={() => setFile(null)}
        />
      )}
    </div>
  );
}
```

### Example 2: Multiple Document Viewer

```typescript
'use client';

import { useState } from 'react';
import { DocumentPreview } from '@/components/file-preview';

const documents = [
  { id: 1, name: 'Manual.pdf', url: '/docs/manual.pdf' },
  { id: 2, name: 'Guide.docx', url: '/docs/guide.docx' },
  { id: 3, name: 'Terms.pdf', url: '/docs/terms.pdf' }
];

function DocumentGallery() {
  const [selectedDoc, setSelectedDoc] = useState<typeof documents[0] | null>(null);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {documents.map(doc => (
          <button
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="p-4 border rounded"
          >
            {doc.name}
          </button>
        ))}
      </div>

      {selectedDoc && (
        <DocumentPreview
          fileUrl={selectedDoc.url}
          fileName={selectedDoc.name}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
}
```

### Example 3: Secure Web Browser

```typescript
'use client';

import { useState } from 'react';
import { WebViewer } from '@/components/web-viewer';

const whitelist = [
  'https://react.dev',
  'https://nextjs.org',
  'https://developer.mozilla.org'
];

function SecureBrowser() {
  const showViewer = useState(true);

  return (
    <>
      {showViewer && (
        <WebViewer
          initialUrl="https://react.dev"
          onClose={() => showViewer(false)}
          // Note: Web Viewer automatically blocks non-HTTPS sites
        />
      )}
    </>
  );
}
```

---

## Props Reference

### DocumentPreview

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| fileUrl | string | ✅ | - | URL of the file to preview |
| fileName | string | ❌ | - | Name of the file (used for auto-detection) |
| fileType | FileType | ❌ | auto-detected | Explicit file type ('pdf' \| 'docx' \| 'doc' \| 'unknown') |
| onClose | () => void | ❌ | - | Callback when close button clicked |
| onDownload | () => void | ❌ | - | Callback when download button clicked |
| className | string | ❌ | '' | Additional CSS classes |

### PdfPreview

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| fileUrl | string | ✅ | - | URL of the PDF file |
| fileName | string | ❌ | 'Document.pdf' | File name display |
| onClose | () => void | ❌ | - | Close callback |
| onDownload | () => void | ❌ | - | Download callback |
| className | string | ❌ | '' | Additional classes |

### DocxPreview

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| fileUrl | string | ✅ | - | URL of the DOCX file |
| fileName | string | ❌ | 'Document.docx' | File name display |
| onClose | () => void | ❌ | - | Close callback |
| onDownload | () => void | ❌ | - | Download callback |
| className | string | ❌ | '' | Additional classes |

### WebViewer

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| initialUrl | string | ❌ | '' | Initial URL to load |
| onClose | () => void | ❌ | - | Close callback |
| className | string | ❌ | '' | Additional classes |

---

## Styling

### TailwindCSS Classes

All components accept a `className` prop for custom styling:

```typescript
<DocumentPreview
  fileUrl="/doc.pdf"
  className="h-screen w-full rounded-lg shadow-xl"
/>
```

### Dark Mode

Components automatically support dark mode when wrapped in a dark mode context:

```typescript
// Works with TailwindCSS dark mode
<div className="dark">
  <DocumentPreview fileUrl="/doc.pdf" />
</div>
```

---

## Security Notes

### Document Preview
- Always validate file types on the server before rendering
- Sanitize file names to prevent XSS
- Use object URLs carefully (revoke after use)

### Web Viewer
- Only HTTPS URLs are allowed
- Private IPs (192.168.x.x, 10.x.x.x, 127.x.x.x) are blocked
- javascript: and data: protocols are blocked
- iframe sandbox is enabled

---

## Common Gotchas

### 1. Object URL Cleanup
```typescript
// Remember to revoke object URLs to free memory
const url = URL.createObjectURL(file);
// ... use the URL ...
URL.revokeObjectURL(url);
```

### 2. Large Files
```typescript
// PDF Preview handles large files, but consider:
// - Page-by-page loading (built-in)
// - Timeout settings
// - User feedback during loading
```

### 3. Cross-Origin Files
```typescript
// Cross-origin files may fail
// Server should send proper CORS headers:
// Access-Control-Allow-Origin: *
```

### 4. iframe Restrictions
```typescript
// Some sites block iframe embedding
// Provide "Open in new tab" option (built-in)
```

---

## Testing

### Manual Testing
```bash
npm run dev
# Navigate to:
# - http://localhost:3000/test-document-preview
# - http://localhost:3000/test-web-viewer
```

### E2E Testing
```bash
npx playwright test e2e/sprint3-preview.spec.ts
npx playwright test e2e/sprint3-preview.spec.ts --ui
```

### Unit Testing
```bash
npm run test
npm run test:watch
```

---

## Troubleshooting

### PDF Not Loading
- Check that URL is accessible
- Verify file is not corrupted
- Check browser console for errors

### DOCX Not Converting
- Ensure file is a valid DOCX
- Check for mammoth conversion messages in console
- Try with a simpler DOCX file

### Web Viewer Blank
- Site may block iframe embedding
- Try "Open in new tab" button
- Check network tab for blocked requests

---

## Need Help?

- Documentation: docs/sprint3-final-report.md
- Test Cases: docs/sprint3-test-cases.md
- Component Code: src/components/file-preview/ & src/components/web-viewer/

---

*Last Updated: 2025-02-07*
