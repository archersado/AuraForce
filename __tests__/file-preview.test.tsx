import { describe, it, expect } from '@jest/globals';
import { detectFileType } from '@/components/file-preview/DocumentPreview';

describe('DocumentPreview - File Type Detection', () => {
  describe('detectFileType', () => {
    it('should detect PDF files', () => {
      expect(detectFileType('document.pdf')).toBe('pdf');
      expect(detectFileType('DOCUMENT.PDF')).toBe('pdf');
      expect(detectFileType('my-report.pdf')).toBe('pdf');
    });

    it('should detect DOCX files', () => {
      expect(detectFileType('document.docx')).toBe('docx');
      expect(detectFileType('DOCUMENT.DOCX')).toBe('docx');
      expect(detectFileType('resume.docx')).toBe('docx');
    });

    it('should detect DOC files', () => {
      expect(detectFileType('document.doc')).toBe('doc');
      expect(detectFileType('DOCUMENT.DOC')).toBe('doc');
      expect(detectFileType('legacy-file.doc')).toBe('doc');
    });

    it('should return unknown for unsupported formats', () => {
      expect(detectFileType('image.png')).toBe('unknown');
      expect(detectFileType('video.mp4')).toBe('unknown');
      expect(detectFileType('archive.zip')).toBe('unknown');
      expect(detectFileType('file')).toBe('unknown');
    });

    it('should handle empty strings', () => {
      expect(detectFileType('')).toBe('unknown');
    });

    it('should handle file paths with dots in name', () => {
      expect(detectFileType('my.report.pdf')).toBe('pdf');
      expect(detectFileType('document.v2.docx')).toBe('docx');
    });
  });
});
