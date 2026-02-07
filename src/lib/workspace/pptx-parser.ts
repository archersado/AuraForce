/**
 * PPTX Parser Utility
 *
 * Parses .pptx files (which are actually ZIP archives) to extract slide data
 * Implements STORY-14-5: PPT File Preview with Slide Mode
 */

import * as JSZip from 'jszip';

export interface PPTXSlide {
  id: number;
  number: number;
  title?: string;
  content?: string;
  images: string[];
  thumbnail?: string;
  hasImages: boolean;
}

export interface PPTXParseResult {
  slides: PPTXSlide[];
  totalSlides: number;
  title: string;
  hasError: boolean;
  error?: string;
}

/**
 * Parse a PPTX file from a URL or File object
 */
export async function parsePPTX(source: string | File | ArrayBuffer): Promise<PPTXParseResult> {
  try {
    let zip: JSZip;

    // Load the file based on source type
    if (typeof source === 'string') {
      // Source is a URL
      const response = await fetch(source);
      const arrayBuffer = await response.arrayBuffer();
      zip = await JSZip.loadAsync(arrayBuffer);
    } else if (source instanceof ArrayBuffer) {
      // Source is ArrayBuffer
      zip = await JSZip.loadAsync(source);
    } else if (source instanceof File) {
      // Source is File object
      zip = await JSZip.loadAsync(source);
    } else {
      throw new Error('Invalid source type');
    }

    // Extract slide data
    const slides = await extractSlides(zip);

    // Extract presentation title
    const title = await extractPresentationTitle(zip);

    return {
      slides,
      totalSlides: slides.length,
      title,
      hasError: false,
    };
  } catch (error) {
    console.error('Failed to parse PPTX:', error);
    return {
      slides: [],
      totalSlides: 0,
      title: 'Unknown Presentation',
      hasError: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Extract slides from PPTX ZIP
 */
async function extractSlides(zip: JSZip): Promise<PPTXSlide[]> {
  const slides: PPTXSlide[] = [];

  // PPTX stores slides in "ppt/slides/slide{number}.xml"
  for (let i = 1; i <= 1000; i++) {
    const slidePath = `ppt/slides/slide${i}.xml`;
    const slideFile = zip.file(slidePath);

    if (!slideFile) {
      break; // No more slides
    }

    try {
      const slideContent = await slideFile.async('string');
      const slideData = parseSlideContent(slideContent, i);

      // Extract images for this slide
      const images = await extractSlideImages(zip, i);

      slides.push({
        ...slideData,
        id: i,
        number: i,
        images,
        hasImages: images.length > 0,
      });
    } catch (error) {
      console.error(`Failed to parse slide ${i}:`, error);
      // Add a placeholder slide even if parsing fails
      slides.push({
        id: i,
        number: i,
        title: `Slide ${i}`,
        content: '',
        images: [],
        hasImages: false,
      });
    }
  }

  return slides;
}

/**
 * Parse slide XML content
 */
function parseSlideContent(xmlString: string, slideNumber: number): Omit<PPTXSlide, 'id' | 'number' | 'images' | 'hasImages'> {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  let title = `Slide ${slideNumber}`;
  let content = '';

  // Try to extract title (usually in the first text box)
  const titleElements = xmlDoc.querySelectorAll('a:p a:t');
  if (titleElements.length > 0) {
    title = titleElements[0].textContent || title;

    // Extract other text content
    const allText = Array.from(titleElements)
      .slice(1)
      .map((el) => el.textContent)
      .filter((text): text is string => text !== null && text.trim() !== '');

    content = allText.join('\n');
  }

  return {
    title,
    content,
    thumbnail: undefined,
  };
}

/**
 * Extract images associated with a specific slide
 */
async function extractSlideImages(zip: JSZip, slideNumber: number): Promise<string[]> {
  const images: string[][] = []; // 2D array for layout

  // Find relationships file for this slide
  const relsPath = `ppt/slides/_rels/slide${slideNumber}.xml.rels`;
  const relsFile = zip.file(relsPath);

  if (!relsFile) {
    return [];
  }

  try {
    const relsContent = await relsFile.async('string');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(relsContent, 'text/xml');

    // Extract image relationships
    const relationships = xmlDoc.querySelectorAll('Relationship');

    // Iterate over relationships to find images
    for (let i = 0; i < relationships.length; i++) {
      const rel = relationships[i];
      const type = rel.getAttribute('Type');

      // PowerPoint image relationship type
      if (type?.includes('image')) {
        const target = rel.getAttribute('Target');
        if (!target) continue;

        // Try to load the image file
        const imagePath = `ppt/slides/${target}`;
        const imageFile = zip.file(imagePath) || zip.file(`ppt/${target}`) || zip.file(target);

        if (imageFile) {
          try {
            const imageBlob = await imageFile.async('blob');
            const imageUrl = URL.createObjectURL(imageBlob);
            images.push([imageUrl]); // Wrap in array for layout consistency
          } catch (error) {
            console.error(`Failed to load image ${imagePath}:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Failed to parse slide ${slideNumber} relationships:`, error);
  }

  return images.flat();
}

/**
 * Extract presentation title from core properties
 */
async function extractPresentationTitle(zip: JSZip): Promise<string> {
  try {
    const docPropsPath = 'docProps/core.xml';
    const docPropsFile = zip.file(docPropsPath);

    if (docPropsFile) {
      const content = await docPropsFile.async('string');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');

      // Try to extract title
      const titleElement = xmlDoc.querySelector('dc\\:title, title');
      if (titleElement && titleElement.textContent) {
        return titleElement.textContent;
      }
    }
  } catch (error) {
    console.error('Failed to extract presentation title:', error);
  }

  return 'Presentation';
}

/**
 * Check if a file is a valid PPTX file
 */
export async function isValidPPTX(file: File): Promise<boolean> {
  try {
    const zip = await JSZip.loadAsync(file);

    // Check for required PPTX structure
    const hasContentTypes = zip.file('[Content_Types].xml') !== null;
    const hasPresentation = zip.file('ppt/presentation.xml') !== null;

    return hasContentTypes && hasPresentation;
  } catch {
    return false;
  }
}

/**
 * Generate a simple thumbnail for a slide (colored placeholder)
 */
export function generateSlideThumbnail(slideNumber: number, colors?: string[]): string {
  if (colors && colors[slideNumber % colors.length]) {
    return colors[slideNumber % colors.length];
  }

  // Generate a hue-based color
  return `hsl(${(slideNumber * 45) % 360}, 70%, 50%)`;
}

/**
 * Clean up object URLs to prevent memory leaks
 */
export function revokeObjectURLs(slides: PPTXSlide[]): void {
  slides.forEach((slide) => {
    slide.images.forEach((imageUrl) => {
      try {
        URL.revokeObjectURL(imageUrl);
      } catch (error) {
        // Ignore revoke errors
      }
    });

    if (slide.thumbnail) {
      try {
        URL.revokeObjectURL(slide.thumbnail);
      } catch (error) {
        // Ignore revoke errors
      }
    }
  });
}
