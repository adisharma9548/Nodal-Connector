import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { AssessmentQuestion, RoadmapGuidance } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useExamProctoring, ProctoringViolation } from '../../hooks/useExamProctoring';
import { ProctoringHUD } from '../../components/proctoring/ProctoringHUD';
import { ProctoringAgreementModal } from '../../components/proctoring/ProctoringAgreementModal';
import { ViolationWarningModal } from '../../components/proctoring/ViolationWarningModal';
import { DegreeSpecializationPromptModal } from '../../components/student/DegreeSpecializationPromptModal';
import {
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  GraduationCap,
  ShieldCheck,
  Code2,
  Terminal,
  Play,
  Check,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const SkillAssessmentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Degree & Specialization Calibration
  const [degree, setDegree] = useState<string>(user?.degree || '');
  const [specialization, setSpecialization] = useState<string>(user?.specialization || user?.currentDomain || '');
  const [showDegreePrompt, setShowDegreePrompt] = useState<boolean>(false);

  // Proctoring and Lockdown States
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [showAgreementModal, setShowAgreementModal] = useState<boolean>(false);
  const [isTerminated, setIsTerminated] = useState<boolean>(false);

  // Assessment & Questions States
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [codeSubmissions, setCodeSubmissions] = useState<Record<number, string>>({});
  const [codeEvaluations, setCodeEvaluations] = useState<
    Record<
      number,
      {
        marks: number;
        passed: boolean;
        feedback: string;
        logicMarks: number;
        correctnessMarks: number;
        efficiencyMarks: number;
        qualityMarks: number;
        testResults?: Array<{ id: number; input: string; expected: string; actual?: string; passed: boolean }>;
      }
    >
  >({});
  const [evaluatingCode, setEvaluatingCode] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);

  const [isCompleted, setIsCompleted] = useState(false);
  const [resultScore, setResultScore] = useState<number | null>(null);
  const [roadmaps, setRoadmaps] = useState<RoadmapGuidance[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auto submit on breach handler
  const handleAutoSubmitOnBreach = useCallback(
    async (logs: ProctoringViolation[]) => {
      setSubmitting(true);
      try {
        const res = await api.skills.submitAssessment(
          selectedAnswers,
          {
            terminatedEarly: true,
            totalViolations: logs.length,
            violations: logs,
          },
          questions
        );

        setIsCompleted(true);
        setResultScore(res.data?.score ?? 0);
      } catch (err: any) {
        setSubmitError(err.message || 'Auto-submit failed after proctoring termination.');
      } finally {
        setSubmitting(false);
      }
    },
    [questions, selectedAnswers, degree, specialization]
  );

  // Proctoring Hook
  const {
    strikes,
    maxStrikes,
    violationsLog,
    activeWarning,
    requestFullscreen,
    recordViolation,
    clearActiveWarning,
    resetProctoring,
  } = useExamProctoring({
    active: examStarted && !isCompleted && !isTerminated,
    maxStrikes: 3,
    onMaxStrikesReached: (logs) => {
      setIsTerminated(true);
      handleAutoSubmitOnBreach(logs);
    },
  });

  // Fetch AI-Generated Questions strictly tailored to Degree and Specialization
  const fetchQuestionsForDiscipline = useCallback(async (targetDeg: string, targetSpec: string) => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await api.skills.getQuestions(targetDeg, targetSpec);
      if (res.data && res.data.length > 0) {
        setQuestions(res.data);
      } else {
        setFetchError('No examination questions returned for this specific discipline. Please retry.');
      }
    } catch (err: any) {
      setFetchError(err.message || 'Failed to retrieve discipline questions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!degree && !specialization) {
      setShowDegreePrompt(true);
    } else {
      fetchQuestionsForDiscipline(degree, specialization);
    }
  }, [degree, specialization, fetchQuestionsForDiscipline]);

  const handleConfirmDiscipline = (newDegree: string, newSpecialization: string) => {
    setDegree(newDegree);
    setSpecialization(newSpecialization);
    setShowDegreePrompt(false);
    setSelectedAnswers({});
    setCodeSubmissions({});
    setCodeEvaluations({});
    setCurrentIndex(0);
    setIsCompleted(false);
    setResultScore(null);
    resetProctoring();
    fetchQuestionsForDiscipline(newDegree, newSpecialization);
  };

  const handleInitiateExam = () => {
    setShowAgreementModal(true);
  };

  const handleStartProctoredExam = async () => {
    setShowAgreementModal(false);
    setExamStarted(true);
    await requestFullscreen();
  };

  const handleSelectOption = (optionIndex: number) => {
    if (examStarted && !isCompleted) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questions[currentIndex].id]: optionIndex,
      }));
    }
  };

  const handleCodeChange = (code: string) => {
    if (!currentQ) return;
    setCodeSubmissions((prev) => ({
      ...prev,
      [currentQ.id]: code,
    }));
  };

  const handleEvaluateCode = async () => {
    if (!currentQ || currentQ.type !== 'code') return;
    const code = codeSubmissions[currentQ.id] || currentQ.codeStarter || '';
    setEvaluatingCode(true);
    setEvalError(null);
    try {
      const res = await api.skills.evaluateCode({
        problemStatement: currentQ.question,
        code,
        language: currentQ.language || 'javascript',
        testCases: currentQ.testCases || [],
      });
      if (res.data) {
        setCodeEvaluations((prev) => ({ ...prev, [currentQ.id]: res.data }));
        setSelectedAnswers((prev) => ({
          ...prev,
          [currentQ.id]: res.data.marks >= 50 ? 0 : 1,
        }));
      }
    } catch (err: any) {
      setEvalError(err.message || 'Failed to evaluate code submission.');
    } finally {
      setEvaluatingCode(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const proctoringMetadata = {
        terminatedEarly: isTerminated,
        totalViolations: violationsLog.length,
        violations: violationsLog,
      };

      const res = await api.skills.submitAssessment(selectedAnswers, proctoringMetadata, questions);
      setIsCompleted(true);
      setResultScore(res.data?.score ?? 0);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit examination.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[var(--orange)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[var(--text-secondary)] font-semibold">
            Calibrating discipline questions for <strong>{specialization || degree || 'your program'}</strong>...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Modals */}
      <DegreeSpecializationPromptModal
        isOpen={showDegreePrompt}
        currentDegree={degree}
        currentSpecialization={specialization}
        onConfirm={handleConfirmDiscipline}
        onClose={questions.length > 0 ? () => setShowDegreePrompt(false) : undefined}
      />

      <ProctoringAgreementModal
        isOpen={showAgreementModal}
        degreeName={degree}
        specializationName={specialization}
        onAccept={handleStartProctoredExam}
        onCancel={() => setShowAgreementModal(false)}
      />

      <ViolationWarningModal
        warning={activeWarning}
        strikes={strikes}
        maxStrikes={maxStrikes}
        onResume={async () => {
          clearActiveWarning();
          await requestFullscreen();
        }}
        isTerminated={isTerminated}
      />

      {/* Floating Camera & Proctoring HUD during active exam */}
      {examStarted && !isCompleted && (
        <ProctoringHUD
          isActive={examStarted && !isCompleted}
          strikes={strikes}
          maxStrikes={maxStrikes}
          onViolation={recordViolation}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[var(--tint-80-orange)] text-[var(--orange-text)] border border-[var(--orange-tint-60)]">
              AI ADAPTIVE ASSESSMENT
            </span>
            {examStarted && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[var(--alert-error-bg)] text-[var(--alert-error-text)] border border-[var(--alert-error-border)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-error)] animate-pulse"></span>
                PROCTORING LOCKDOWN
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
            {specialization || degree ? `${specialization || degree} Examination` : 'Skill Competency Assessment'}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-secondary)]">
            <span>
              Target Discipline: <strong className="text-[var(--text-primary)]">{degree || 'Not Set'}</strong>
              {specialization && <> — Track: <strong className="text-[var(--orange-text)]">{specialization}</strong></>}
            </span>
            {!examStarted && !isCompleted && (
              <button
                type="button"
                onClick={() => setShowDegreePrompt(true)}
                className="text-[var(--link-color)] hover:underline font-bold ml-2 cursor-pointer"
              >
                Change Discipline
              </button>
            )}
          </div>
        </div>

        {examStarted && !isCompleted && questions.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-bold shrink-0 border border-[var(--border-default)]">
            <span>Question {currentIndex + 1} of {questions.length}</span>
          </div>
        )}
      </div>

      {/* Error state */}
      {fetchError ? (
        <div className="bg-[var(--card-bg)] rounded-3xl border border-[var(--alert-error-border)] p-8 shadow-xs text-center py-12 space-y-4">
          <div className="w-14 h-14 rounded-full bg-[var(--alert-error-bg)] text-[var(--alert-error-text)] flex items-center justify-center mx-auto border border-[var(--alert-error-border)]">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">AI Formulation Failed</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">{fetchError}</p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => fetchQuestionsForDiscipline(degree, specialization)}
            >
              Retry AI Generation
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDegreePrompt(true)}
            >
              Select Different Degree
            </Button>
          </div>
        </div>
      ) : !examStarted && !isCompleted ? (
        /* Pre-Exam Ready Card */
        <div className="bg-[var(--card-bg)] rounded-3xl border border-[var(--border-default)] p-8 text-center py-12 space-y-5 shadow-xs transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-[var(--tint-80-orange)] border border-[var(--orange-tint-60)] text-[var(--orange-text)] flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--orange-text)] bg-[var(--tint-80-orange)] px-3 py-1 rounded-full border border-[var(--orange-tint-60)]">
              {questions.length} Questions (Conceptual & Coding)
            </span>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mt-3">
              Ready for Proctored Evaluation in {specialization || degree}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto mt-1 leading-relaxed">
              This exam evaluates your domain competencies with conceptual questions and practical code evaluation.
              Webcam gaze detection and tab restrictions are strictly enforced throughout.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleInitiateExam}
              leftIcon={<ShieldCheck className="w-5 h-5" />}
            >
              Proceed to Proctoring & Start Exam
            </Button>
          </div>
        </div>
      ) : !isCompleted ? (
        /* Active Exam Card */
        <div className="bg-[var(--card-bg)] rounded-3xl border border-[var(--border-default)] p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
          {/* Progress bar */}
          <div className="w-full bg-[var(--progress-track)] h-2 rounded-full overflow-hidden border border-[var(--border-default)]">
            <div
              className="bg-[var(--progress-fill)] h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Details */}
          {currentQ && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="clay" size="sm">
                    {currentQ.category}
                  </Badge>
                  {currentQ.type === 'code' ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border border-[var(--badge-success-border)] flex items-center gap-1">
                      <Code2 className="w-3 h-3" />
                      Practical Code Evaluation
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--text-secondary)]">
                      Weightage: {currentQ.weight || 15}%
                    </span>
                  )}
                </div>

                {currentQ.difficulty && (
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                    Tier: {currentQ.difficulty}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-relaxed">
                {currentQ.question}
              </h3>

              {/* RENDER CODING CHALLENGE */}
              {currentQ.type === 'code' ? (
                <div className="space-y-4 pt-2">
                  {/* Test Cases Preview */}
                  {currentQ.testCases && currentQ.testCases.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)] space-y-2">
                      <span className="text-[11px] font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-[var(--orange)]" />
                        Test Case Specifications:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        {currentQ.testCases.map((tc, tcIdx) => (
                          <div
                            key={tcIdx}
                            className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-default)] space-y-1"
                          >
                            <p className="text-[var(--text-secondary)] text-[10px]">Case #{tcIdx + 1}</p>
                            <p className="text-[var(--text-primary)]">
                              Input: <span className="text-[var(--orange)]">{tc.input}</span>
                            </p>
                            <p className="text-[var(--text-primary)]">
                              Expected: <span className="text-[var(--badge-success-text)]">{tc.expectedOutput}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Code Editor Area */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)]">
                      <span>Code Solution ({currentQ.language || 'JavaScript'})</span>
                      <button
                        type="button"
                        onClick={() => handleCodeChange(currentQ.codeStarter || '')}
                        className="text-[var(--link-color)] hover:underline cursor-pointer"
                      >
                        Reset Starter Code
                      </button>
                    </div>

                    <textarea
                      value={codeSubmissions[currentQ.id] ?? currentQ.codeStarter ?? ''}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      rows={10}
                      placeholder="// Write your implementation here..."
                      className="w-full p-4 rounded-2xl font-mono text-xs bg-[var(--code-bg)] text-[var(--code-text)] border border-[var(--border-default)] focus:border-[var(--input-focus-border)] focus:outline-none resize-y selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]"
                      spellCheck={false}
                    />
                  </div>

                  {/* Evaluation Button */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleEvaluateCode}
                      isLoading={evaluatingCode}
                      leftIcon={<Play className="w-3.5 h-3.5" />}
                    >
                      {evaluatingCode ? 'Evaluating Implementation...' : 'Run Code & Evaluate Marks'}
                    </Button>

                    {codeEvaluations[currentQ.id] && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--badge-success-bg)] border border-[var(--badge-success-border)] text-xs font-bold text-[var(--badge-success-text)]">
                        <Check className="w-4 h-4" />
                        <span>Awarded Marks: {codeEvaluations[currentQ.id].marks} / 100</span>
                      </div>
                    )}
                  </div>

                  {/* Code Evaluation Result Report */}
                  {codeEvaluations[currentQ.id] && (
                    <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)] space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-2">
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                          AI Code Evaluation Report
                        </span>
                        <span
                          className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                            codeEvaluations[currentQ.id].passed
                              ? 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border border-[var(--badge-success-border)]'
                              : 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border border-[var(--badge-warning-border)]'
                          }`}
                        >
                          {codeEvaluations[currentQ.id].passed ? 'PASSED' : 'NEEDS REFINEMENT'}
                        </span>
                      </div>

                      {/* Marks Breakdown Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-default)]">
                          <p className="text-[10px] text-[var(--text-secondary)]">Logic</p>
                          <p className="font-extrabold text-[var(--orange)]">
                            {codeEvaluations[currentQ.id].logicMarks} / 40
                          </p>
                        </div>
                        <div className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-default)]">
                          <p className="text-[10px] text-[var(--text-secondary)]">Correctness</p>
                          <p className="font-extrabold text-[var(--orange)]">
                            {codeEvaluations[currentQ.id].correctnessMarks} / 30
                          </p>
                        </div>
                        <div className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-default)]">
                          <p className="text-[10px] text-[var(--text-secondary)]">Efficiency</p>
                          <p className="font-extrabold text-[var(--orange)]">
                            {codeEvaluations[currentQ.id].efficiencyMarks} / 15
                          </p>
                        </div>
                        <div className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-default)]">
                          <p className="text-[10px] text-[var(--text-secondary)]">Quality</p>
                          <p className="font-extrabold text-[var(--orange)]">
                            {codeEvaluations[currentQ.id].qualityMarks} / 15
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] bg-[var(--card-bg)] p-3 rounded-xl border border-[var(--border-default)]">
                        {codeEvaluations[currentQ.id].feedback}
                      </p>
                    </div>
                  )}

                  {evalError && (
                    <div className="p-3 bg-[var(--alert-error-bg)] border border-[var(--alert-error-border)] rounded-xl text-xs text-[var(--alert-error-text)]">
                      {evalError}
                    </div>
                  )}
                </div>
              ) : (
                /* RENDER MULTIPLE CHOICE OPTIONS */
                <div className="space-y-3 pt-2">
                  {currentQ.options &&
                    currentQ.options.map((option, idx) => {
                      const isSelected = selectedAnswers[currentQ.id] === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                            isSelected
                              ? 'border-[var(--card-selected-border)] bg-[var(--card-selected-bg)] shadow-xs ring-2 ring-[var(--orange)]/20'
                              : 'border-[var(--border-default)] hover:border-[var(--mid)] hover:bg-[var(--bg-subtle)] bg-[var(--card-bg)]'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? 'border-[var(--orange)] bg-[var(--orange)]'
                                : 'border-[var(--border-strong)] bg-[var(--card-bg)]'
                            }`}
                          >
                            {isSelected && <span className="w-2 h-2 rounded-full bg-[var(--dark)]"></span>}
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)] leading-normal">
                            {option}
                          </span>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Error Banner if submit fails */}
          {submitError && (
            <div className="p-3.5 bg-[var(--alert-error-bg)] border border-[var(--alert-error-border)] rounded-2xl flex items-center justify-between gap-3 text-xs text-[var(--alert-error-text)] animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{submitError}</span>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="font-bold underline shrink-0 cursor-pointer"
              >
                Retry Submit
              </button>
            </div>
          )}

          {/* Controls Footer */}
          <div className="pt-4 border-t border-[var(--border-default)] flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>

            {currentIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                isLoading={submitting}
                leftIcon={!submitting ? <Sparkles className="w-4 h-4" /> : undefined}
              >
                {submitting ? 'Evaluating Score...' : 'Submit Exam'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="bg-[var(--card-bg)] rounded-3xl border border-[var(--border-default)] p-8 text-center shadow-xl space-y-6 animate-in fade-in zoom-in-95 transition-colors">
          <div className="w-20 h-20 rounded-3xl bg-[var(--tint-80-orange)] border-2 border-[var(--orange-tint-60)] text-[var(--orange-text)] flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-bold text-[var(--orange-text)] bg-[var(--tint-80-orange)] px-3 py-1 rounded-full border border-[var(--orange-tint-60)]">
              Assessment Verified
            </span>
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mt-3">
              Your New Score: {resultScore} / 100
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-md mx-auto">
              Evaluated strictly on <strong>{specialization || degree}</strong>. Your competency profile, coding marks, and integrity audit have been preserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/student/dashboard')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Verified Dashboard
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setIsCompleted(false);
                setExamStarted(false);
                setIsTerminated(false);
                setSubmitError(null);
                setSelectedAnswers({});
                setCodeSubmissions({});
                setCodeEvaluations({});
                setCurrentIndex(0);
                setResultScore(null);
                resetProctoring();
                fetchQuestionsForDiscipline(degree, specialization);
              }}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Retake Evaluation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
