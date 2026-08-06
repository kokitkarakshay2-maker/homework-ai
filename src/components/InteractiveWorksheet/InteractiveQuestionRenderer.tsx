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
import { SubtractByCounting } from './SubtractByCounting';
import { NumberLine } from './NumberLine';
import React from 'react';

interface Props {
  question: QuestionSchema;
  fallback: React.ReactNode;
}

import { WorksheetLegend } from './WorksheetLegend';

export function InteractiveQuestionRenderer({ question, fallback }: Props) {
  const { question_type, interactive_data } = question;

  // If no interactive data, or math type, or unknown type, fallback to the original UI
  if (!interactive_data || question_type === 'math') {
    return <>{fallback}</>;
  }

  const hasLegend = Array.isArray(interactive_data.legend) && interactive_data.legend.length > 0;

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
      case 'subtract_by_counting':
        return <SubtractByCounting data={interactive_data} />;
      case 'number_line':
        return <NumberLine data={interactive_data} questionStr={question.question} />;
      default:
        return null;
    }
  };

  const content = renderContent();
  const requiresOptions = ['multiple_choice', 'circle_words', 'tick_correct', 'color_objects', 'matching'].includes(question_type);
  const hasOptions = Array.isArray(interactive_data.options) && interactive_data.options.length > 0;
  const hasMatches = Array.isArray(interactive_data.matches) && interactive_data.matches.length > 0;

  const isEmpty = (requiresOptions && question_type !== 'matching' && !hasOptions) || 
                  (question_type === 'matching' && !hasMatches) ||
                  (question_type === 'subtract_by_counting' && (interactive_data.total === undefined || interactive_data.subtract === undefined));

  if (isEmpty) {
    return (
      <div className="w-full flex flex-col gap-4">
        {hasLegend && interactive_data.legend && (
          <WorksheetLegend legend={interactive_data.legend} />
        )}
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-center font-medium">
          ⚠️ Developer Warning: Interactive worksheet contains zero items.
        </div>
      </div>
    );
  }

  if (!content) {
    return <>{fallback}</>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {hasLegend && interactive_data.legend && (
        <WorksheetLegend legend={interactive_data.legend} />
      )}
      {content}
    </div>
  );
}
