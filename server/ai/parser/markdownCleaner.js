
export const markdownCleaner = {
  clean: (text) => {
    if (!text || typeof text !== 'string') {
      return '';
    }
    return text

      .replace(/^(#{1,6})\s+/gm, '')

      .replace(/^(\-|\*|\_){3,}\s*$/gm, '')

      .replace(/^>\s+/gm, '')
      .trim();
  }
};
export default markdownCleaner;
