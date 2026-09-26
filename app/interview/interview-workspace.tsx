"use client";

import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  CircleHelp,
  RotateCcw,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

type Turn = { question: string; answer: string };
type Dimension = { name: string; score: number };
type AnswerGuide = { suggestedAnswer: string; whyItWorks: string };
type InterviewResult = {
  overallScore: number;
  summary: string;
  dimensions: Dimension[];
  strengths: string[];
  improvements: string[];
  answerGuides: AnswerGuide[];
};
type Stage = "setup" | "interview" | "complete";

const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 10;

export default function InterviewWorkspace() {
  const [stage, setStage] = useState<Stage>("setup");
  const [jobDescription, setJobDescription] = useState("");
  const [questionCount, setQuestionCount] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const requestInterview = async (body: Record<string, unknown>) => {
    const response = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await response.json()) as {
      question?: string;
      result?: InterviewResult;
      error?: string;
    };

    if (!response.ok) {
      throw new Error(payload.error ?? "目前無法連線，請稍後再試。");
    }

    return payload;
  };

  const startInterview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const payload = await requestInterview({ action: "start", jobDescription, questionCount, turns: [] });
      if (!payload.question) throw new Error("面試題目產生失敗，請再試一次。");
      setCurrentQuestion(payload.question);
      setStage("interview");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "發生非預期錯誤，請再試一次。");
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!answer.trim()) return;

    setIsLoading(true);
    setError("");
    const submittedAnswer = answer.trim();

    try {
      const payload = await requestInterview({
        action: "answer",
        jobDescription,
        questionCount,
        turns,
        currentQuestion,
        answer: submittedAnswer,
      });
      const updatedTurns = [...turns, { question: currentQuestion, answer: submittedAnswer }];
      setTurns(updatedTurns);
      setAnswer("");

      if (payload.result) {
        setResult(payload.result);
        setStage("complete");
      } else if (payload.question) {
        setCurrentQuestion(payload.question);
      } else {
        throw new Error("面試官沒有回傳下一步，請再試一次。");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "發生非預期錯誤，請再試一次。");
    } finally {
      setIsLoading(false);
    }
  };

  const resetInterview = () => {
    setStage("setup");
    setCurrentQuestion("");
    setAnswer("");
    setTurns([]);
    setResult(null);
    setError("");
  };

  const questionNumber = turns.length + 1;

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Mockmate 首頁">
          <span className="brand-mark">m</span><span>mockmate</span>
        </Link>
        <div className="topbar-context"><span className="live-dot" />AI 面試練習室</div>
        <button className="reset-button" onClick={resetInterview} type="button">
          <RotateCcw size={15} strokeWidth={1.8} /><span>重新開始</span>
        </button>
      </header>

      <main className={`workspace ${stage !== "setup" ? "workspace-active" : ""}`}>
        <aside className="session-rail" aria-label="面試工作階段">
          <div className="rail-kicker">WORKSPACE</div>
          <div className="session-number">01<span> / SESSION</span></div>
          <div className="rail-rule" />
          <div className="rail-label">本次練習</div>
          <div className="rail-session-name">職缺模擬面試</div>
          <div className="rail-status">
            <span className={`status-mark ${stage === "complete" ? "status-done" : ""}`} />
            {stage === "setup" ? "等待開始" : stage === "complete" ? "已完成" : "進行中"}
          </div>
          <div className="rail-bottom"><div className="rail-kicker">DESIGNED FOR</div><p>更有自信地<br />回答每一題。</p></div>
        </aside>

        <section className="main-pane">
          {stage === "setup" ? (
            <>
              <div className="pane-eyebrow"><span>01</span> 準備你的面試</div>
              <h1>把下一場面試，<br /><em>練習得更好。</em></h1>
              <p className="intro-copy">貼上職缺描述並設定題數，AI 面試官會依職務需求與你的回答逐題追問，最後提供評分與回答示範。</p>
              <form className="setup-form" onSubmit={startInterview}>
                <label className="field-label" htmlFor="job-description">
                  <BriefcaseBusiness size={15} /> 職缺描述<span>JOB DESCRIPTION</span>
                </label>
                <textarea
                  id="job-description"
                  className="job-input"
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  maxLength={12000}
                  minLength={20}
                  placeholder="貼上職缺內容，包含工作職責、必要技能或團隊介紹……"
                  required
                />
                <div className="field-footnote"><span>至少 20 個字，資訊越完整，問題越貼近職務。</span><span>{jobDescription.length.toLocaleString()} / 12,000</span></div>
                <div className="question-count-control">
                  <label htmlFor="question-count">面試題數</label>
                  <input
                    id="question-count"
                    type="number"
                    min={MIN_QUESTIONS}
                    max={MAX_QUESTIONS}
                    step={1}
                    value={questionCount}
                    onChange={(event) => {
                      const nextCount = Number(event.target.value);
                      setQuestionCount(Number.isFinite(nextCount)
                        ? Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, Math.trunc(nextCount)))
                        : MIN_QUESTIONS);
                    }}
                    aria-describedby="question-count-hint"
                  />
                  <span id="question-count-hint">1–10 題</span>
                </div>
                {error && <p className="error-message" role="alert">{error}</p>}
                <button className="primary-button" type="submit" disabled={isLoading || jobDescription.trim().length < 20}>
                  {isLoading ? "正在準備面試題目…" : "開始模擬面試"}
                  {!isLoading && <ArrowRight size={17} />}
                </button>
              </form>
            </>
          ) : stage === "interview" ? (
            <>
              <div className="pane-eyebrow"><span>02</span> 模擬進行中</div>
              <div className="interview-heading">
                <div><h1>面試對話</h1><p className="intro-copy">以你平常面試的方式回答即可。</p></div>
                <div className="question-counter">{String(questionNumber).padStart(2, "0")}<span> / {String(questionCount).padStart(2, "0")}</span></div>
              </div>
              <div className="conversation" aria-live="polite">
                {turns.map((turn, index) => (
                  <div className="conversation-turn" key={`${index}-${turn.question}`}>
                    <div className="message-row interviewer-row">
                      <div className="avatar interviewer-avatar"><Sparkles size={16} /></div>
                      <div className="message-content"><div className="message-meta">AI 面試官 <span>問題 {index + 1}</span></div><p>{turn.question}</p></div>
                    </div>
                    <div className="message-row candidate-row">
                      <div className="avatar candidate-avatar"><UserRound size={16} /></div>
                      <div className="message-content"><div className="message-meta">你的回答</div><p>{turn.answer}</p></div>
                    </div>
                  </div>
                ))}
                <div className="message-row interviewer-row current-message">
                  <div className="avatar interviewer-avatar"><Sparkles size={16} /></div>
                  <div className="message-content"><div className="message-meta">AI 面試官 <span>問題 {questionNumber}</span></div><p>{currentQuestion}</p></div>
                </div>
                {isLoading && <div className="thinking-indicator"><span /><span /><span />面試官正在整理下一題</div>}
              </div>
              <form className="answer-form" onSubmit={submitAnswer}>
                <label className="field-label" htmlFor="answer-input">你的回答</label>
                <textarea
                  id="answer-input"
                  className="answer-input"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  maxLength={6000}
                  placeholder="試著用具體的經驗、行動與成果來回答……"
                  disabled={isLoading}
                  required
                />
                <div className="answer-form-footer">
                  {error ? <p className="error-message" role="alert">{error}</p> : <span>回答會依職缺與面試脈絡進行評估。</span>}
                  <button className="send-button" type="submit" disabled={isLoading || !answer.trim()}>
                    <span>{isLoading ? "處理中" : "送出回答"}</span><Send size={15} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="pane-eyebrow"><span>03</span> 面試完成</div>
              <div className="results-heading">
                <div><h1>你的面試回饋</h1><p className="intro-copy">{questionCount} 題練習已完成，以下是面試官的觀察。</p></div>
                <div className="score-stamp"><strong>{result?.overallScore ?? "--"}</strong><span> / 100</span></div>
              </div>
              <section className="result-summary">
                <div className="result-summary-label"><BadgeCheck size={16} /> 整體表現</div><p>{result?.summary}</p>
              </section>
              <section className="dimension-section">
                <div className="section-label">能力觀察 <span>ASSESSMENT</span></div>
                <div className="dimension-list">
                  {result?.dimensions.map((dimension) => (
                    <div className="dimension-row" key={dimension.name}>
                      <span>{dimension.name}</span>
                      <div className="dimension-track"><span style={{ width: `${Math.min(100, Math.max(0, dimension.score))}%` }} /></div>
                      <strong>{dimension.score}</strong>
                    </div>
                  ))}
                </div>
              </section>
              <div className="feedback-columns">
                <section className="feedback-section">
                  <div className="section-label">做得好的地方 <span>STRENGTHS</span></div>
                  <ul>{result?.strengths.map((item, index) => <li key={`${index}-${item}`}><Check size={15} />{item}</li>)}</ul>
                </section>
                <section className="feedback-section improvement-section">
                  <div className="section-label">可以再加強 <span>GROWTH</span></div>
                  <ul>{result?.improvements.map((item, index) => <li key={`${index}-${item}`}><ArrowRight size={15} />{item}</li>)}</ul>
                </section>
              </div>
              <section className="answer-guides-section">
                <div className="section-label">逐題回答參考 <span>ANSWER GUIDE</span></div>
                <div className="answer-guide-list">
                  {result?.answerGuides.map((guide, index) => (
                    <article className="answer-guide" key={`${index}-${turns[index]?.question}`}>
                      <div className="answer-guide-question">
                        <span>Q{String(index + 1).padStart(2, "0")}</span>
                        <p>{turns[index]?.question}</p>
                      </div>
                      <div className="answer-guide-content">
                        <div className="answer-guide-block candidate-answer-block">
                          <div className="guide-label">你的回答</div>
                          <p>{turns[index]?.answer}</p>
                        </div>
                        <div className="answer-guide-block suggested-answer-block">
                          <div className="guide-label">回答示範</div>
                          <p>{guide.suggestedAnswer}</p>
                          <div className="guide-reason-label">為什麼這樣回答</div>
                          <p className="guide-reason">{guide.whyItWorks}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
              <button className="primary-button restart-primary" onClick={resetInterview} type="button">再練習一次 <RotateCcw size={16} /></button>
            </>
          )}
        </section>

        <aside className="insight-panel">
          {stage === "setup" ? (
            <>
              <div className="side-heading"><span className="side-icon"><CircleHelp size={17} /></span> 面試流程</div>
              <div className="steps-list">
                <div className="step-item"><span className="step-index">01</span><div><strong>貼上職缺描述</strong><p>提供目標職務的背景</p></div></div>
                <div className="step-item"><span className="step-index">02</span><div><strong>回答自訂題數</strong><p>依你的回答延伸提問</p></div></div>
                <div className="step-item"><span className="step-index">03</span><div><strong>取得個人回饋</strong><p>查看評分與改善建議</p></div></div>
              </div>
              <div className="side-note"><Sparkles size={15} /><p>每一題都會參考職缺需求，讓練習更接近真實面試。</p></div>
            </>
          ) : (
            <>
              <div className="side-heading"><span className="side-icon"><Sparkles size={17} /></span> 本次進度</div>
              <div className="progress-meter" role="progressbar" aria-valuenow={stage === "complete" ? questionCount : turns.length} aria-valuemin={0} aria-valuemax={questionCount}>
                <div className="progress-meter-fill" style={{ width: `${(stage === "complete" ? questionCount : turns.length) / questionCount * 100}%` }} />
              </div>
              <div className="progress-caption"><strong>{stage === "complete" ? questionCount : turns.length}</strong> / {questionCount} 題已回答</div>
              <div className="steps-list progress-list">
                {Array.from({ length: questionCount }, (_, index) => {
                  const isDone = index < turns.length || stage === "complete";
                  const isCurrent = stage === "interview" && index === turns.length;
                  return (
                    <div className={`step-item ${isCurrent ? "step-current" : ""}`} key={index}>
                      <span className={`step-index ${isDone ? "step-complete" : ""}`}>{isDone ? <Check size={13} /> : `0${index + 1}`}</span>
                      <div><strong>{isDone ? "已完成" : isCurrent ? "回答中" : "待進行"}</strong><p>面試問題 {index + 1}</p></div>
                    </div>
                  );
                })}
              </div>
              <div className="side-note"><CircleHelp size={15} /><p>用具體情境說明你的行動與結果，能讓回答更有說服力。</p></div>
            </>
          )}
        </aside>
      </main>

      <footer className="page-footer"><span>MOCKMATE <i>•</i> PRACTICE WITH PURPOSE</span><span>你的回答只用於本次面試練習</span></footer>
    </div>
  );
}
