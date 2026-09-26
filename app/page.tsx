import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  MessageSquareText,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";

const productFeatures = [
  {
    number: "01",
    icon: BriefcaseBusiness,
    title: "從職缺開始，而不是從題庫猜",
    description: "貼上職務描述，面試官會抓出工作重點，讓每一道問題都跟目標職位有關。",
  },
  {
    number: "02",
    icon: MessageSquareText,
    title: "根據你的回答繼續追問",
    description: "不是固定腳本。AI 會沿著你的經驗深入提問，練習更接近真實對話。",
  },
  {
    number: "03",
    icon: BadgeCheck,
    title: "每一題都有下一步",
    description: "看見自己的原回答、示範回答與評分理由，把回饋轉成可練習的方向。",
  },
];

const practiceSteps = [
  { number: "01", title: "貼上職缺", description: "提供工作內容與必要條件，建立專屬面試脈絡。" },
  { number: "02", title: "選擇題數", description: "從 1 到 10 題，自訂這次想練習的深度。" },
  { number: "03", title: "開始對談", description: "一題一題作答，讓後續問題接住你的回答。" },
  { number: "04", title: "帶走回饋", description: "取得整體評分與每題的回答示範，知道如何再進步。" },
];

export default function Home() {
  return (
    <div className="landing-page">
      <header className="site-header">
        <nav className="site-nav" aria-label="主要導覽">
          <Link className="site-brand" href="/" aria-label="Mockmate 首頁">
            <span className="site-brand-mark">m</span>
            <span>mockmate</span>
          </Link>
          <div className="site-nav-links">
            <a href="#features">產品特色</a>
            <a href="#how-it-works">練習流程</a>
            <a href="#about">關於 Mockmate</a>
          </div>
          <Link className="site-header-cta" href="/interview">
            開始練習 <ArrowUpRight size={16} />
          </Link>
        </nav>
      </header>

      <main>
        <section className="landing-hero" aria-labelledby="hero-title">
          <div className="hero-intro">
            <div className="hero-kicker"><span /> AI INTERVIEW STUDIO <span className="kicker-year">PRACTICE 01—10</span></div>
            <h1 id="hero-title">讓好表現，<br /><em>先練習一次。</em></h1>
            <p className="hero-copy">
              Mockmate 依照目標職缺與你的回答，陪你完成一場真正有方向的模擬面試。練習完，還有每一題的回答參考帶走。
            </p>
            <div className="hero-actions">
              <Link className="hero-primary-cta" href="/interview">開始模擬面試 <ArrowRight size={17} /></Link>
              <a className="hero-secondary-cta" href="#how-it-works">看看如何運作 <ArrowDown size={15} /></a>
            </div>
            <div className="hero-reassurance"><Check size={14} /> 自選題數 <span /> 每題個人化回饋 <span /> 不需要先準備題庫</div>
          </div>

          <div className="demo-stage" aria-label="Mockmate 面試工作台介面預覽">
            <div className="demo-window">
              <div className="demo-window-top">
                <div className="demo-window-brand"><span className="demo-mark">m</span><span>mockmate <i>/</i> practice room</span></div>
                <div className="demo-live"><span /> LIVE SESSION</div>
              </div>
              <div className="demo-session-bar">
                <span>PRODUCT DESIGNER <b>職缺模擬</b></span>
                <span className="demo-question-count">QUESTION <strong>02</strong> / 04</span>
              </div>
              <div className="demo-conversation">
                <div className="demo-interviewer">
                  <div className="demo-avatar"><Sparkles size={16} /></div>
                  <div>
                    <div className="demo-label">AI 面試官 <span>問題 02</span></div>
                    <p>請分享一次你運用使用者研究，改變產品設計方向的經驗。你如何判斷研究結果值得採納？</p>
                  </div>
                </div>
                <div className="demo-candidate">
                  <div className="demo-answer-heading"><span className="demo-candidate-dot">A</span> 候選人回答 <span className="answer-duration">01:24</span></div>
                  <p>我會先確認研究樣本是否符合目標使用者，再把觀察到的行為模式和產品數據交叉比對，避免只根據單一回饋就改變方向……</p>
                </div>
              </div>
              <div className="demo-feedback-line">
                <span className="demo-feedback-icon"><Target size={16} /></span>
                <span><strong>回答結構清楚</strong><small>加入實際影響或衡量指標，會讓經驗更有說服力。</small></span>
                <span className="demo-score">+ 1 INSIGHT</span>
              </div>
              <div className="demo-window-bottom"><span>依職缺脈絡即時追問</span><span>回答後即可繼續 <ArrowRight size={13} /></span></div>
            </div>
            <div className="demo-caption"><span>01 / LIVE PREVIEW</span><span>一場為你展開的面試</span></div>
          </div>
          <a className="hero-scroll-cue" href="#features" aria-label="往下瀏覽產品特色"><span />往下探索</a>
        </section>

        <section className="feature-section" id="features" aria-labelledby="features-title">
          <div className="feature-section-inner">
            <div className="feature-lead">
              <div className="section-kicker">WHY MOCKMATE <span>—</span> 練習要有回應</div>
              <h2 id="features-title">不只是多答幾題，<br /><em>而是更懂怎麼回答。</em></h2>
              <p>從職缺脈絡、對話延伸到逐題回饋，每一個環節都為了讓你帶著更清楚的答案走進面試。</p>
              <Link className="text-link" href="/interview">探索面試工作台 <ArrowRight size={15} /></Link>
            </div>
            <div className="feature-list">
              {productFeatures.map(({ number, icon: Icon, title, description }) => (
                <article className="feature-row" key={number}>
                  <span className="feature-number">{number}</span>
                  <span className="feature-icon"><Icon size={18} strokeWidth={1.7} /></span>
                  <div className="feature-copy"><h3>{title}</h3><p>{description}</p></div>
                  <ArrowUpRight className="feature-arrow" size={17} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="process-section" id="how-it-works" aria-labelledby="process-title">
          <div className="process-inner">
            <div className="process-heading">
              <div>
                <div className="section-kicker section-kicker-light">A BETTER PRACTICE LOOP</div>
                <h2 id="process-title">把練習，變成一個好循環。</h2>
              </div>
              <p>每次面試都從你在意的職缺開始，結束時也帶著能立刻使用的回饋離開。</p>
            </div>
            <div className="process-grid">
              {practiceSteps.map((step) => (
                <article className="process-step" key={step.number}>
                  <div className="process-step-number">{step.number}<span /></div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
            <div className="process-bottom-note"><span>YOUR NEXT ANSWER STARTS HERE</span><Link href="/interview">開始你的第一場練習 <ArrowRight size={15} /></Link></div>
          </div>
        </section>

        <section className="closing-section" id="about" aria-labelledby="closing-title">
          <div className="closing-stamp" aria-hidden="true"><span>01—10</span><small>QUESTIONS<br />MADE FOR YOU</small></div>
          <div className="closing-content">
            <div className="section-kicker">YOUR NEXT INTERVIEW, REHEARSED</div>
            <h2 id="closing-title">下一場，準備好了。</h2>
            <p>把目標職缺帶進來，從第一題開始練習。</p>
            <Link className="closing-cta" href="/interview">進入 Mockmate <ArrowUpRight size={17} /></Link>
          </div>
          <span className="closing-index">MOCKMATE / 2026</span>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <Link className="site-brand footer-brand" href="/" aria-label="Mockmate 首頁">
            <span className="site-brand-mark">m</span><span>mockmate</span>
          </Link>
          <p>讓每一次練習，都更接近理想的下一步。</p>
          <div className="footer-links"><a href="#features">產品特色</a><a href="#how-it-works">練習流程</a><Link href="/interview">開始練習</Link></div>
        </div>
        <div className="footer-bottom"><span>© 2026 MOCKMATE</span><span>AI 面試練習室 <i>•</i> 為下一個機會做好準備</span></div>
      </footer>
    </div>
  );
}