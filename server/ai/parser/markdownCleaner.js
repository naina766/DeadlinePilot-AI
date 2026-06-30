/**
 * Markdown Cleaner
 * Removes layout-breaking headers, code fences, and divider lines while keeping
 * inline formatting elements (bold/italic) and list formats.
 */

export const markdownCleaner = {
  clean: (text) => {
    if (!text || typeof text !== 'string') {
      return '';
    }

    return text
      // Remove header symbols (e.g., #, ##, ###) at the start of a line
      .replace(/^(#{1,6})\s+/gm, '')
      // Remove horizontal separator lines (e.g., ---, ***)
      .replace(/^(\-|\*|\_){3,}\s*$/gm, '')
      // Remove blockquote marks
      .replace(/^>\s+/gm, '')
      .trim();
  }
};

export default markdownCleaner;
