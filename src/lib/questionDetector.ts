export type QuestionLayoutType = 
  | 'ColorBoxes'
  | 'ColorOvals'
  | 'ColorCircles'
  | 'FillBlanks'
  | 'RearrangeWords'
  | 'Matching'
  | 'Crossword'
  | 'MCQ'
  | 'TickAnswer'
  | 'CircleAnswer'
  | 'Notebook'
  | 'Paragraph'
  | 'Instruction'
  | 'General';

export interface QuestionDetectionResult {
  type: QuestionLayoutType;
  color?: string; // extracted color if applicable
}

export function detectQuestionType(questionText?: string, answerText?: string): QuestionDetectionResult {
  const safeQ = (questionText || '').toString();
  const safeA = (answerText || '').toString();
  const lowerQ = safeQ.toLowerCase();
  
  // Extract color if present in the question
  const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'black', 'white', 'pink', 'brown', 'grey', 'gray'];
  let detectedColor: string | undefined = undefined;
  for (const color of colors) {
    if (lowerQ.includes(color)) {
      detectedColor = color;
      break;
    }
  }

  // 1. Color the boxes
  if (lowerQ.includes('colour the box') || lowerQ.includes('color the box')) {
    return { type: 'ColorBoxes', color: detectedColor };
  }

  // 2. Color the ovals
  if (lowerQ.includes('colour the oval') || lowerQ.includes('color the oval')) {
    return { type: 'ColorOvals', color: detectedColor };
  }

  // 3. Color circles
  if (lowerQ.includes('colour the circle') || lowerQ.includes('color the circle') || lowerQ.includes('colour circles') || lowerQ.includes('color circles')) {
    return { type: 'ColorCircles', color: detectedColor };
  }

  // 4. Fill in the blanks
  if (lowerQ.includes('fill in the blank') || lowerQ.includes('fill the blank')) {
    return { type: 'FillBlanks' };
  }

  // 5. Rearrange words
  if (lowerQ.includes('rearrange') || lowerQ.includes('unscramble')) {
    return { type: 'RearrangeWords' };
  }

  // 6. Match the following
  if (lowerQ.includes('match')) {
    return { type: 'Matching' };
  }

  // 7. Crossword
  if (lowerQ.includes('crossword')) {
    return { type: 'Crossword' };
  }

  // 8. MCQ
  if (lowerQ.includes('multiple choice') || lowerQ.includes('choose the correct option')) {
    return { type: 'MCQ' };
  }

  // 9. Tick the correct answer
  if (lowerQ.includes('tick')) {
    return { type: 'TickAnswer' };
  }

  // 10. Circle the correct answer
  if (lowerQ.includes('circle the correct') || lowerQ.includes('circle the word') || lowerQ.includes('circle the answer')) {
    return { type: 'CircleAnswer' };
  }

  // 13. Drawing instructions
  if (lowerQ.includes('draw')) {
    return { type: 'Instruction' };
  }

  // Heuristics based on answer length
  const answerWords = safeA.trim().split(/\s+/).filter(Boolean).length;
  
  if (answerWords <= 10 && !safeA.includes('\n') && !safeA.includes(',')) {
    return { type: 'Notebook' };
  }
  
  if (answerWords > 10) {
    return { type: 'Paragraph' };
  }

  return { type: 'General' };
}
