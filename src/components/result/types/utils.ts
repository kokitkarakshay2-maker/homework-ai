export function getColorClass(colorStr?: string) {
  if (!colorStr) return 'bg-primary/20 text-primary border-primary/20';
  
  const colors: Record<string, string> = {
    red: 'bg-red-500/20 text-red-500 border-red-500/20',
    blue: 'bg-blue-500/20 text-blue-500 border-blue-500/20',
    green: 'bg-green-500/20 text-green-500 border-green-500/20',
    yellow: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20',
    orange: 'bg-orange-500/20 text-orange-500 border-orange-500/20',
    purple: 'bg-purple-500/20 text-purple-500 border-purple-500/20',
    pink: 'bg-pink-500/20 text-pink-500 border-pink-500/20',
    brown: 'bg-[#8B4513]/20 text-[#8B4513] border-[#8B4513]/20',
    black: 'bg-gray-800/80 text-white border-gray-900',
    white: 'bg-white text-black border-gray-200',
    grey: 'bg-gray-500/20 text-gray-500 border-gray-500/20',
    gray: 'bg-gray-500/20 text-gray-500 border-gray-500/20',
  };

  return colors[colorStr.toLowerCase()] || 'bg-primary/20 text-primary border-primary/20';
}

export function parseList(answerText?: string, providedAnswers?: string[]): string[] {
  if (providedAnswers && providedAnswers.length > 0) {
    return providedAnswers;
  }

  const safeText = (answerText || '').toString().trim();
  if (!safeText) return [];

  let text = safeText;
  
  // 1. Remove introductory phrases (up to and including the colon if present)
  // E.g. "The words with the short 'e' sound are: "
  text = text.replace(/^(.*?:\s*)/, '');
  
  // Also explicitly remove common intro phrases if they lack a colon
  const introRegex = /^(the\s+words?\s+with.*?are|the\s+correct\s+answers?\s+(is|are)|answers?|fill\s+with|colou?r\s+these|circle\s+these)\s+/i;
  text = text.replace(introRegex, '');

  // 2. Remove trailing explanation sentences.
  // Split by '. ' (period followed by space) and only keep the first chunk which contains the list
  const sentenceChunks = text.split(/\.\s+/);
  text = sentenceChunks[0] || text;

  let items: string[] = [];

  if (text.includes(',') && !text.includes('\n')) {
    items = text.split(',');
  } else {
    items = text.split('\n').map(s => s.replace(/^\d+\.\s*/, ''));
  }

  const parsed = items
    .map(s => s.trim())
    // 5. Remove periods at the end
    .map(s => s.replace(/\.$/, ''))
    // 6. Ignore empty values
    .filter(Boolean);

  return parsed.length > 0 ? parsed : [safeText];
}
