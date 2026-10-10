import React, { useState } from 'react';
import { DiagnosticQuestion } from '../../types/agent';
import { HelpCircle, Send, X } from 'lucide-react';

interface ActiveInquiryFormProps {
  questions: DiagnosticQuestion[];
  onSubmit: (answers: Record<string, string>) => void;
  onDismiss: () => void;
  isLoading?: boolean;
}

export const ActiveInquiryForm: React.FC<ActiveInquiryFormProps> = ({
  questions,
  onSubmit,
  onDismiss,
  isLoading = false,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (!questions || questions.length === 0) return null;

  const handleInputChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasAnyAnswer = Object.values(answers).some((val) => val.trim().length > 0);
    if (!hasAnyAnswer || isLoading) return;
    onSubmit(answers);
  };

  return (
    <div className="mx-3 mb-2 rounded-lg bg-[#202020] border border-[#333333] p-3 text-xs shadow-md animate-in fade-in slide-in-from-bottom-2 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#2b2b2b]">
        <div className="flex items-center space-x-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#38bdf8] flex-shrink-0" />
          <span className="font-semibold text-white tracking-tight">
            Socratic Calibration Questions
          </span>
          <span className="text-[10px] text-[#888888] bg-[#282828] px-1.5 py-0.5 rounded border border-[#383838]">
            {questions.length} question{questions.length > 1 ? 's' : ''}
          </span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          title="Dismiss questionnaire"
          className="text-[#777777] hover:text-white p-0.5 rounded hover:bg-[#2c2c2c] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Questions list with dedicated input boxes */}
      <form onSubmit={handleFormSubmit} className="pt-2.5 space-y-2.5">
        {questions.map((q, idx) => (
          <div key={q.id} className="space-y-1">
            <label className="block text-[11px] font-medium text-[#cccccc] leading-snug">
              <span className="text-[#38bdf8] font-mono mr-1">{idx + 1}.</span>
              {q.question}
            </label>
            <input
              type="text"
              value={answers[q.id] || ''}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
              placeholder={q.placeholder || 'Your answer...'}
              disabled={isLoading}
              className="w-full bg-[#181818] border border-[#2e2e2e] rounded px-2.5 py-1 text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#007acc] transition-colors"
            />
          </div>
        ))}

        {/* Submit action */}
        <div className="pt-1.5 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onDismiss}
            disabled={isLoading}
            className="px-2.5 py-1 text-[11px] text-[#888888] hover:text-white transition-colors"
          >
            Skip for now
          </button>
          <button
            type="submit"
            disabled={isLoading || !Object.values(answers).some((val) => val.trim().length > 0)}
            className="px-3 py-1 bg-[#0e639c] hover:bg-[#1177bb] disabled:opacity-50 disabled:pointer-events-none text-white rounded text-[11px] font-medium flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>Submit Answers</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActiveInquiryForm;
