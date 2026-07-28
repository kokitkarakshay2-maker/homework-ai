import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';
import type { HistoryResponseSchema, QuestionSchema } from '../services/homeworkService';
import { useHistoryDetailQuery } from '../hooks/useHomework';
import { AppShell, AppContent, AppFooter } from '../components/layout/AppShell';
import { detectQuestionType } from '../lib/questionDetector';

// New Components
import { ResultHeader } from '../components/result/ResultHeader';
import { QuestionAccordion } from '../components/result/QuestionAccordion';
import { QuestionCard } from '../components/result/QuestionCard';
import { AnswerCard } from '../components/result/AnswerCard';
import { WriteThisCard } from '../components/result/WriteThisCard';
import { ExplanationAccordion } from '../components/result/ExplanationAccordion';
import { WarningCard } from '../components/result/WarningCard';
import { ActivitySummaryCard } from '../components/result/ActivitySummaryCard';
import { ColourKeyCard } from '../components/result/ColourKeyCard';

export default function ResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearImages } = useImageUpload();
  
  const [expandedId, setExpandedId] = useState<number | null>(null); 
  
  useEffect(() => {
    console.log(`[${performance.now().toFixed(0)}ms] [Frontend] Result component mounted`);
  }, []);

  const { id } = useParams();
  const passedData = location.state?.resultData as HistoryResponseSchema | undefined;

  const { data: fetchedData, isLoading, isError } = useHistoryDetailQuery(
    id && !passedData ? id : null
  );

  const resultData = passedData || fetchedData;

  const { isActivity, colorMapping } = useMemo(() => {
    if (!resultData?.processed_response?.questions) {
      return { isActivity: false, colorMapping: {} };
    }
    
    const qs = resultData.processed_response.questions;
    if (qs.length < 5) return { isActivity: false, colorMapping: {} };

    // Grouping heuristic: check if all questions have the same layout type
    const firstDetection = detectQuestionType(qs[0].question, qs[0].answer);
    const allSameType = qs.every(q => detectQuestionType(q.question, q.answer).type === firstDetection.type);
    
    const isActivity = allSameType;
    
    // Build color mapping if activity
    const colorMapping: Record<string, string> = {};
    if (isActivity) {
      qs.forEach(q => {
        const detection = detectQuestionType(q.question, q.answer);
        if (detection.color) {
          // Capitalize color key
          const colorKey = detection.color.charAt(0).toUpperCase() + detection.color.slice(1);
          const reprAnswer = q.answers && q.answers.length > 0 ? q.answers[0] : q.answer;
          if (!colorMapping[colorKey]) {
            colorMapping[colorKey] = reprAnswer;
          }
        }
      });
    }

    return { isActivity, colorMapping };
  }, [resultData]);

  useEffect(() => {
    const qs = resultData?.processed_response?.questions;
    if (qs && qs.length > 0 && qs[0]?.id !== undefined) {
      setExpandedId(qs[0].id);
    }
  }, [resultData]);

  if (isLoading && !resultData) {
    return (
      <AppShell>
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (isError && !resultData) {
    return (
      <AppShell>
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
          Failed to load history item.
        </div>
      </AppShell>
    );
  }

  if (!resultData) {
    return null;
  }

  const handleSolveAnother = () => {
    clearImages();
    navigate('/home');
  };

  const { processed_response: aiResponse } = resultData;
  const questions = aiResponse.questions || [];
  const isMultiple = questions.length > 1;

  const renderQuestionContent = (question: QuestionSchema, index: number, showQuestionCard: boolean = true) => {
    const effectiveAnswer = question.answer || (question.answers && question.answers.length > 0 ? question.answers.join(', ') : '');

    return (
      <div className="flex flex-col gap-6">
        {showQuestionCard && (
          <QuestionCard questionNumber={index + 1} questionText={question.question} />
        )}
        
        <AnswerCard questionText={question.question} answerText={effectiveAnswer} answersArray={question.answers} />
        
        <WriteThisCard textToWrite={effectiveAnswer} />
        
        <ExplanationAccordion steps={question.steps} />
        
        <WarningCard warnings={question.warnings} />
      </div>
    );
  };

  return (
    <AppShell>
      <ResultHeader 
        subject={aiResponse.subject} 
        worksheetTitle={aiResponse.worksheet_title} 
        onBack={() => {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate('/home');
          }
        }} 
      />
      
      <AppContent className="px-5 pt-6 flex flex-col gap-6">
        {isActivity ? (
          <>
            <ColourKeyCard colorMapping={colorMapping} />
            <ActivitySummaryCard 
              questions={questions} 
              renderDetail={(question, index) => renderQuestionContent(question, index, false)} 
            />
          </>
        ) : (
          questions.map((question, index) => {
            const qId = question.id !== undefined && question.id !== null ? question.id : index + 1;
            if (isMultiple) {
              return (
                <QuestionAccordion 
                  key={qId}
                  id={qId}
                  questionNumber={index + 1}
                  questionText={question.question}
                  isExpanded={expandedId === qId}
                  onToggle={() => setExpandedId(expandedId === qId ? null : qId)}
                >
                  {renderQuestionContent(question, index, false)}
                </QuestionAccordion>
              );
            }

            return (
              <div key={qId} className="pt-2 shrink-0">
                {renderQuestionContent(question, index, true)}
              </div>
            );
          })
        )}
      </AppContent>

      <AppFooter>
        <div className="p-4 pt-4">
          <button
            onClick={handleSolveAnother}
            className="w-full h-14 bg-white text-black font-semibold rounded-[20px] text-[17px] tracking-wide active:scale-[0.98] transition-transform shadow-lg shadow-white/10"
          >
            Solve Another Homework
          </button>
        </div>
      </AppFooter>
    </AppShell>
  );
}
