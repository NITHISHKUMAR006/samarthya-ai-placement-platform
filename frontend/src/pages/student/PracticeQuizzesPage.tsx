import React, { useState } from 'react';
import { api } from '../../services/api';
import { Sparkles, CheckCircle2, XCircle, Play, RefreshCw, BookOpen } from 'lucide-react';

export const PracticeQuizzesPage: React.FC = () => {
  const [topic, setTopic] = useState<string>('Operating Systems Paging and Virtual Memory');
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [generating, setGenerating] = useState<boolean>(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<number, boolean>>({});

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setUserAnswers({});
    setCheckedAnswers({});
    try {
      const data = await api.generateQuiz({
        topic,
        difficulty,
        question_count: questionCount,
      });
      setQuestions(data.questions || []);
    } catch (err: any) {
      alert(`AI Quiz Generation Error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSelect = (qIdx: number, opt: string) => {
    setUserAnswers((prev) => ({ ...prev, [qIdx]: opt }));
  };

  const handleCheck = (qIdx: number) => {
    setCheckedAnswers((prev) => ({ ...prev, [qIdx]: true }));
  };

  const popularTopics = [
    'Dynamic Programming on Graphs',
    'Virtual Memory & Inverted Page Tables',
    'Quantitative Probability & Combinatorics',
    'Database Indexing & B-Trees',
    'TCP Three-Way Handshake & Sockets',
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Generative AI Practice Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          AI Practice Quizzes
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Generate targeted, high-yield practice quizzes on any placement topic or study chunk with instant diagnostic explanations.
        </p>
      </div>

      {/* Generator Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Target Topic or Key Concept
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Asymptotic Complexity, Red-Black Trees, Deadlocks..."
            />
          </div>

          {/* Quick topic tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-semibold self-center mr-1">Suggested:</span>
            {popularTopics.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTopic(t)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition-colors"
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Target Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="easy">Easy (Foundational Concepts)</option>
                <option value="medium">Medium (Standard Tier-1 Exam)</option>
                <option value="hard">Hard (Advanced Google / Dream Level)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Question Count
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value={3}>3 Questions (Quick Sprint)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={10}>10 Questions (In-Depth Diagnostic)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={generating}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-teal-500/20 disabled:opacity-50 transition-all"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Questions with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Practice Quiz</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Questions List */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Generated Practice Questions ({questions.length})
            </h2>
            <span className="text-xs text-slate-400 capitalize">{difficulty} Difficulty</span>
          </div>

          {questions.map((q, idx) => {
            const selectedOpt = userAnswers[idx];
            const isChecked = checkedAnswers[idx];
            const isCorrect = selectedOpt === q.correct_answer;

            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    Question {idx + 1}
                  </span>
                  <span className="text-slate-400 font-medium">{q.skill}</span>
                </div>

                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {q.question_text}
                </div>

                {/* Choices */}
                <div className="space-y-2 pt-1">
                  {q.options?.map((opt: string, oIdx: number) => {
                    const isSelected = selectedOpt === opt;
                    let optionStyle = 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60';

                    if (isChecked) {
                      if (opt === q.correct_answer) {
                        optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200 font-semibold';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => !isChecked && handleSelect(idx, opt)}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-5 h-5 rounded text-xs font-bold flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isChecked && opt === q.correct_answer && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        )}
                        {isChecked && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Check Button & Explanation */}
                <div className="pt-2 flex items-center justify-between">
                  {!isChecked ? (
                    <button
                      onClick={() => handleCheck(idx)}
                      disabled={!selectedOpt}
                      className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-blue-600 text-white text-xs font-bold transition-all disabled:opacity-40"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="text-xs font-bold">
                      {isCorrect ? (
                        <span className="text-emerald-600 flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Correct Answer!
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center">
                          <XCircle className="w-4 h-4 mr-1" /> Incorrect. Correct is: {q.correct_answer}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Explanation Box */}
                {isChecked && q.explanation && (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">
                      Explanation:
                    </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
