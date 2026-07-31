import type { QuestionSchema } from '../../services/homeworkService';
import { FillBlank } from './FillBlank';
import { MultipleChoice } from './MultipleChoice';
import { CircleWords } from './CircleWords';
import { TickCorrect } from './TickCorrect';
import { ColorObjects } from './ColorObjects';
import { Matching } from './Matching';
import { ShortAnswer } from './ShortAnswer';
import { SentenceAnswer } from './SentenceAnswer';
import { TrueFalse } from './TrueFalse';
import React from 'react';

interface Props {
  question: QuestionSchema;
  fallback: React.ReactNode;
}

export function InteractiveQuestionRenderer({ question, fallback }: Props) {
  const { question_type, interactive_data } = question;

  // If no interactive data, or math type, or unknown type, fallback to the original UI
  if (!interactive_data || question_type === 'math') {
    return <>{fallback}</>;
  }

  const renderContent = () => {
    switch (question_type) {
      case 'fill_blank':
        return <FillBlank data={interactive_data} />;
      case 'multiple_choice':
        return <MultipleChoice data={interactive_data} />;
      case 'circle_words':
        return <CircleWords data={interactive_data} />;
      case 'tick_correct':
        return <TickCorrect data={interactive_data} />;
      case 'color_objects':
        return <ColorObjects data={interactive_data} />;
      case 'matching':
        return <Matching data={interactive_data} />;
      case 'short_answer':
        return <ShortAnswer data={interactive_data} />;
      case 'sentence_answer':
        return <SentenceAnswer data={interactive_data} />;
      case 'true_false':
        return <TrueFalse data={interactive_data} />;
      default:
        return null;
    }
  };

  const content = renderContent();

  if (!content) {
    return <>{fallback}</>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {content}
    </div>
  );
}
