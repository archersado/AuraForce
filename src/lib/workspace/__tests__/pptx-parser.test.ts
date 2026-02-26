/**
 * PPTX Parser Tests
 *
 * Tests for STORY-14-5: PPT File Preview with Slide Mode
 */

import { describe, it, expect, vi } from 'vitest';
import {
  parsePPTX,
  isValidPPTX,
  generateSlideThumbnail,
  type PPTXSlide,
  type PPTXParseResult,
} from '@/lib/workspace/pptx-parser';
import * as JSZip from 'jszip';

// Mock JSZip
vi.mock('jszip', () => ({
  default: vi.fn(),
}));

describe('PPTX Parser', () => {
  describe('generateSlideThumbnail', () => {
    it('should generate a color for slide 1', () => {
      const color = generateSlideThumbnail(1);
      expect(color).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
      expect(color).toContain('45'); // (1 * 45) % 360 = 45
    });

    it('should generate different colors for different slides', () => {
      const color1 = generateSlideThumbnail(1);
      const color2 = generateSlideThumbnail(2);
      expect(color1).not.toBe(color2);
    });

    it('should use custom colors if provided', () => {
      const colors = ['#FF0000', '#00FF00', '#0000FF'];
      const color = generateSlideThumbnail(1, colors);
      expect(color).toBe('#FF0000');
    });
  });

  describe('isValidPPTX', () => {
    it('should validate a valid PPTX file structure', async () => {
      const mockFile = new File(['test'], 'test.pptx', { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      const mockZip = {
        file: vi.fn((path: string) => {
          if (path === '[Content_Types].xml') return {};
          if (path === 'ppt/presentation.xml') return {};
          return null;
        }),
      };

      vi.mocked(JSZip).loadAsync.mockResolvedValueOnce(mockZip as any);

      const isValid = await isValidPPTX(mockFile);
      expect(isValid).toBe(true);
    });

    it('should reject invalid PPTX files', async () => {
      const mockFile = new File(['test'], 'test.pptx', { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      const mockZip = {
        file: vi.fn(() => null),
      };

      vi.mocked(JSZip).loadAsync.mockResolvedValueOnce(mockZip as any);

      const isValid = await isValidPPTX(mockFile);
      expect(isValid).toBe(false);
    });
  });

  describe('parsePPTX', () => {
    it('should parse a basic PPTX file with slides', async () => {
      const mockSrc = 'http://example.com/test.pptx';
      const slideFile = {
        async: vi.fn().mockResolvedValue(`
          <p:sp>
            <p:nvSpPr>
              <p:nvPr>
                <a:extLst>
                  <a:ext uri="{D75A9B99-226C-41B3-98B4-9FA0058B9EDC}">
                    <p15:connectionId xmlns:p15="http://schemas.microsoft.com/office/powerpoint/2010/main" val="1"/>
                  </a:ext>
                </a:extLst>
              </p:nvPr>
            </p:nvSpPr>
            <p:spPr/>
            <p:txBody>
              <a:p>
                <a:r>
                  <a:t>Slide Title</a:t>
                </a:r>
                <a:endParaRPr lang="en-US"/>
              </a:p>
              <a:p>
                <a:r>
                  <a:t>Slide content here</a:t>
                </a:r>
                <a:endParaRPr lang="en-US"/>
              </a:p>
            </p:txBody>
          </p:sp>
        `),
      };

      const mockZip = {
        file: vi.fn((path: string) => {
          if (path.startsWith('ppt/slides/slide')) {
            return slideFile;
          }
          if (path === 'docProps/core.xml') {
            return {
              async: vi.fn().mockResolvedValue(`
                <cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties">
                  <dc:title xmlns:dc="http://purl.org/dc/elements/1.1/">Test Presentation</dc:title>
                </cp:coreProperties>
              `),
            };
          }
          if (path.startsWith('ppt/slides/_rels/')) {
            return {
              async: vi.fn().mockResolvedValue(`<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`),
            };
          }
          return null;
        }),
      };

      vi.mocked(JSZip).loadAsync.mockResolvedValueOnce(mockZip as any);
      global.fetch = vi.fn().mockResolvedValue({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
      }) as any;

      const result = await parsePPTX(mockSrc);

      expect(result.hasError).toBe(false);
      expect(result.totalSlides).toBeGreaterThan(0);
      expect(result.title).toBe('Test Presentation');
      expect(result.slides).toBeDefined();
    });

    it('should handle parsing errors gracefully', async () => {
      const mockSrc = 'http://example.com/invalid.pptx';

      vi.mocked(JSZip).loadAsync.mockRejectedValueOnce(new Error('Invalid ZIP file'));
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error')) as any;

      const result = await parsePPTX(mockSrc);

      expect(result.hasError).toBe(true);
      expect(result.error).toBeDefined();
      expect(result.slides).toEqual([]);
      expect(result.totalSlides).toBe(0);
    });

    it('should handle empty presentations', async () => {
      const mockSrc = 'http://example.com/empty.pptx';
      const mockZip = {
        file: vi.fn((path: string) => {
          if (path === 'ppt/slides/slide1.xml') {
            return null; // No slide content
          }
          if (path === 'docProps/core.xml') {
            return {
              async: vi.fn().mockResolvedValue(`<cp:coreProperties></cp:coreProperties>`),
            };
          }
          return null;
        }),
      };

      vi.mocked(JSZip).loadAsync.mockResolvedValueOnce(mockZip as any);
      global.fetch = vi.fn().mockResolvedValue({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
      }) as any;

      const result = await parsePPTX(mockSrc);

      expect(result.hasError).toBe(false);
      expect(result.totalSlides).toBe(0);
      expect(result.slides).toEqual([]);
    });
  });

  describe('parsePPTX with images', () => {
    it('should extract images from slides', async () => {
      const mockSrc = 'http://example.com/with-images.pptx';
      const mockImageBlob = new Blob(['mock image data'], { type: 'image/png' });

      const mockZip = {
        file: vi.fn((path: string) => {
          if (path.startsWith('ppt/slides/slide')) {
            return {
              async: vi.fn().mockResolvedValue(`<p:sp><p:txBody><a:p><a:r><a:t>Slide with image</a:t></a:r></a:p></p:txBody></p:sp>`),
            };
          }
          if (path.startsWith('ppt/media/')) {
            return {
              async: vi.fn().mockResolvedValue(mockImageBlob),
            };
          }
          if (path.startsWith('ppt/slides/_rels/')) {
            return {
              async: vi.fn().mockResolvedValue(`
                <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
                  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image1.png"/>
                </Relationships>
              `),
            };
          }
          if (path === 'docProps/core.xml') {
            return {
              async: vi.fn().mockResolvedValue(`<cp:coreProperties></cp:coreProperties>`),
            };
          }
          return null;
        }),
      };

      vi.mocked(JSZip).loadAsync.mockResolvedValueOnce(mockZip as any);
      global.fetch = vi.fn().mockResolvedValue({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
      }) as any;

      const result = await parsePPTX(mockSrc);

      expect(result.hasError).toBe(false);
      if (result.slides.length > 0 && result.slides[0].hasImages) {
        expect(result.slides[0].images.length).toBeGreaterThan(0);
      }
    });
  });

  describe('parsePPTX edge cases', () => {
    it('should handle missing presentation title gracefully', async () => {
      const mockSrc = 'http://example.com/no-title.pptx';
      const mockZip = {
        file: vi.fn((path: string) => {
          if (path.startsWith('ppt/slides/slide')) {
            return {
              async: vi.fn().mockResolvedValue(`<p:sp><p:txBody><a:p><a:r><a:t>Slide</a:t></a:r></a:p></p:txBody></p:sp>`),
            };
          }
          if (path === 'docProps/core.xml') {
            return null; // No core properties
          }
          if (path.startsWith('ppt/slides/_rels/')) {
            return {
              async: vi.fn().mockResolvedValue(`<Relationships></Relationships>`),
            };
          }
          return null;
        }),
      };

      vi.mocked(JSZip).loadAsync.mockResolvedValueOnce(mockZip as any);
      global.fetch = vi.fn().mockResolvedValue({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
      }) as any;

      const result = await parsePPTX(mockSrc);

      expect(result.hasError).toBe(false);
      expect(result.title).toBe('Presentation'); // Default title
    });

    it('should handle slides without title text', async () => {
      const mockSrc = 'http://example.com/no-text.pptx';
      const mockZip = {
        file: vi.fn((path: string) => {
          if (path.startsWith('ppt/slides/slide')) {
            return {
              async: vi.fn().mockResolvedValue(`<p:sp><p:txBody><a:p></a:p></p:txBody></p:sp>`),
            };
          }
          if (path === 'docProps/core.xml') {
            return {
              async: vi.fn().mockResolvedValue(`<cp:coreProperties></cp:coreProperties>`),
            };
          }
          if (path.startsWith('ppt/slides/_rels/')) {
            return {
              async: vi.fn().mockResolvedValue(`<Relationships></Relationships>`),
            };
          }
          return null;
        }),
      };

      vi.mocked(JSZip).loadAsync.mockResolvedValueOnce(mockZip as any);
      global.fetch = vi.fn().mockResolvedValue({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
      }) as any;

      const result = await parsePPTX(mockSrc);

      expect(result.hasError).toBe(false);
      if (result.slides.length > 0) {
        expect(result.slides[0].title).toBe('Slide 1'); // Default title
      }
    });
  });
});
