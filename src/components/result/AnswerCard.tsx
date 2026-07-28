import { AudioButton } from './AudioButton';
import { detectQuestionType } from '../../lib/questionDetector';

// Import all specific layout components
import { ColorBoxCard } from './types/ColorBoxCard';
import { ColorOvalCard } from './types/ColorOvalCard';
import { ColorCircleCard } from './types/ColorCircleCard';
import { FillBlankCard } from './types/FillBlankCard';
import { RearrangeWordsCard } from './types/RearrangeWordsCard';
import { MatchingCard } from './types/MatchingCard';
import { CrosswordCard } from './types/CrosswordCard';
import { MCQCard } from './types/MCQCard';
import { TickAnswerCard } from './types/TickAnswerCard';
import { CircleAnswerCard } from './types/CircleAnswerCard';
import { NotebookCard } from './types/NotebookCard';
import { ParagraphCard } from './types/ParagraphCard';
import { InstructionCard } from './types/InstructionCard';
import { GeneralAnswerCard } from './types/GeneralAnswerCard';

interface AnswerCardProps {
  questionText: string;
  answerText: string;
  answersArray?: string[];
}

export function AnswerCard({ questionText, answerText, answersArray }: AnswerCardProps) {
  const effectiveAnswer = answerText || (answersArray && answersArray.length > 0 ? answersArray.join(', ') : '');
  if (!effectiveAnswer) return null;

  // 1. Detect the question type using our heuristic utility
  const detection = detectQuestionType(questionText, effectiveAnswer);

  // 2. Map the detected type to the specific UI component
  const renderContent = () => {
    switch (detection.type) {
      case 'ColorBoxes':
        return <ColorBoxCard answer={effectiveAnswer} color={detection.color} answersArray={answersArray} />;
      case 'ColorOvals':
        return <ColorOvalCard answer={effectiveAnswer} color={detection.color} answersArray={answersArray} />;
      case 'ColorCircles':
        return <ColorCircleCard answer={effectiveAnswer} color={detection.color} answersArray={answersArray} />;
      case 'FillBlanks':
        return <FillBlankCard answer={effectiveAnswer} answersArray={answersArray} />;
      case 'RearrangeWords':
        return <RearrangeWordsCard answer={effectiveAnswer} answersArray={answersArray} />;
      case 'Matching':
        return <MatchingCard answer={effectiveAnswer} />;
      case 'Crossword':
        return <CrosswordCard answer={effectiveAnswer} />;
      case 'MCQ':
        return <MCQCard answer={effectiveAnswer} answersArray={answersArray} />;
      case 'TickAnswer':
        return <TickAnswerCard answer={effectiveAnswer} answersArray={answersArray} />;
      case 'CircleAnswer':
        return <CircleAnswerCard answer={effectiveAnswer} answersArray={answersArray} />;
      case 'Notebook':
        return <NotebookCard answer={effectiveAnswer} />;
      case 'Paragraph':
        return <ParagraphCard answer={effectiveAnswer} />;
      case 'Instruction':
        return <InstructionCard answer={effectiveAnswer} />;
      case 'General':
      default:
        // Also handling the True/False check inline for General fallback if needed,
        // or just let GeneralAnswerCard handle it.
        const isTrueFalse = /^(true|false|yes|no)$/i.test(effectiveAnswer.trim());
        if (isTrueFalse) {
          const text = effectiveAnswer.trim().toUpperCase();
          const isPositive = text === 'TRUE' || text === 'YES';
          return (
            <div className={`inline-flex items-center justify-center px-8 py-4 rounded-3xl border-2 ${isPositive ? 'bg-success/20 text-success border-success/30' : 'bg-destructive/20 text-destructive border-destructive/30'}`}>
              <span className="text-3xl font-black tracking-widest">{text}</span>
            </div>
          );
        }
        return <GeneralAnswerCard answer={effectiveAnswer} />;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[12px] uppercase tracking-widest text-[#94A3B8] font-semibold flex items-center gap-2">
          CORRECT ANSWER
        </h2>
        <AudioButton text={answerText} />
      </div>
      
      {renderContent()}
    </div>
  );
}
