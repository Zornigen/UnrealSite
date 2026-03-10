"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";

const translations = { en, ru };
type Locale = keyof typeof translations;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const withBasePath = (path: string) => `${basePath}${path}`;

const RELEASE_DATE = new Date("2026-08-16T16:00:00+03:00");
const BADGE_STEPS = ["old", "strike", "morph", "new", "new"] as const;
const INITIAL_PARTICIPANTS = [
  "AsterVox",
  "IronShade",
  "NyxRaven",
  "Velhart",
  "KainZero",
  "LunaCore",
  "HexNova",
  "StormVeil",
];
const COMPARE_PAIRS = [
  {
    beforeImage: withBasePath("/media/old-world.jpg"),
    afterImage: withBasePath("/media/new-world.jpg"),
    beforePosition: "24% 58%",
    afterPosition: "58% 54%",
  },
  {
    beforeImage: withBasePath("/media/old-world.jpg"),
    afterImage: withBasePath("/media/new-world.jpg"),
    beforePosition: "48% 56%",
    afterPosition: "70% 44%",
  },
  {
    beforeImage: withBasePath("/media/old-world.jpg"),
    afterImage: withBasePath("/media/new-world.jpg"),
    beforePosition: "76% 50%",
    afterPosition: "32% 48%",
  },
  {
    beforeImage: withBasePath("/media/old-world.jpg"),
    afterImage: withBasePath("/media/new-world.jpg"),
    beforePosition: "62% 32%",
    afterPosition: "44% 66%",
  },
] as const;
type BadgeStep = (typeof BADGE_STEPS)[number];

function getTimeParts(diffMs: number, labels: string[]) {
  const safe = Math.max(0, diffMs);
  const sec = Math.floor(safe / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  return [days, hours, minutes, seconds].map((value, index) => ({
    label: labels[index],
    value: String(value).padStart(2, "0"),
  }));
}

export default function Home() {
  const locale: Locale = "ru";
  const t = translations[locale];

  const [now, setNow] = useState(() => Date.now());
  const [activeSection, setActiveSection] = useState(t.sections[0]?.id ?? "hero");
  const [hideHeroTagOnMobile, setHideHeroTagOnMobile] = useState(false);
  const [comparePosition, setComparePosition] = useState(56);
  const [activeComparePairIndex, setActiveComparePairIndex] = useState(0);
  const [activeRoadmapStepIndex, setActiveRoadmapStepIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [badgeStepIndex, setBadgeStepIndex] = useState(0);
  const [badgePairIndex, setBadgePairIndex] = useState(0);
  const scrollLockRef = useRef(false);

  const [preregTarget] = useState(182746);
  const [supportTarget] = useState(999999);
  const [preregCount, setPreregCount] = useState(1);
  const [supportCount, setSupportCount] = useState(1);
  const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS);

  const timeParts = useMemo(
    () => getTimeParts(RELEASE_DATE.getTime() - now, t.hero.timerLabels),
    [now, t.hero.timerLabels]
  );
  const badgeStep: BadgeStep = BADGE_STEPS[badgeStepIndex];
  const badgePairs = t.hero.badge.pairs;
  const badgePair = badgePairs[badgePairIndex] ?? badgePairs[0];
  const activeComparePair = COMPARE_PAIRS[activeComparePairIndex] ?? COMPARE_PAIRS[0];
  const activeRoadmapStep = t.roadmap.steps[activeRoadmapStepIndex] ?? t.roadmap.steps[0];

  const scrollToSection = (id: string) => {
    const node = document.getElementById(id);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBadgeStepIndex((prev) => {
        const next = (prev + 1) % BADGE_STEPS.length;
        if (next === 0) {
          setBadgePairIndex((pairPrev) => (pairPrev + 1) % badgePairs.length);
        }
        return next;
      });
    }, 860);
    return () => window.clearInterval(timer);
  }, [badgePairs.length]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPreregCount((prev) => {
        if (prev >= preregTarget) return preregTarget;
        return Math.min(preregTarget, prev + Math.ceil((preregTarget - prev) / 24));
      });
    }, 90);

    return () => window.clearInterval(interval);
  }, [preregTarget]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSupportCount((prev) => {
        if (prev >= supportTarget) return supportTarget;
        return Math.min(supportTarget, prev + Math.ceil((supportTarget - prev) / 22));
      });
    }, 90);

    return () => window.clearInterval(interval);
  }, [supportTarget]);

  useEffect(() => {
    const onScroll = () => {
      setHideHeroTagOnMobile(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: isDesktop ? 0.5 : 0.16 }
    );

    t.sections.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [t.sections]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    const onWheel = (event: WheelEvent) => {
      if (!media.matches) return;

      const direction = Math.sign(event.deltaY);
      if (direction === 0) return;

      event.preventDefault();
      if (scrollLockRef.current) return;

      const currentIndex = t.sections.findIndex((section) => section.id === activeSection);
      const safeIndex = currentIndex >= 0 ? currentIndex : 0;
      const nextIndex =
        direction > 0
          ? Math.min(t.sections.length - 1, safeIndex + 1)
          : Math.max(0, safeIndex - 1);

      if (nextIndex === safeIndex) return;

      scrollLockRef.current = true;
      scrollToSection(t.sections[nextIndex].id);
      window.setTimeout(() => {
        scrollLockRef.current = false;
      }, 620);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [activeSection, t.sections]);

  const onPreregSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setShowConfirmPopup(true);
  };

  const onConfirmPrereg = (event: FormEvent) => {
    event.preventDefault();
    const safeNickname = nickname.trim();
    if (!safeNickname) return;

    setParticipants((prev) => [safeNickname, ...prev.filter((item) => item.toLowerCase() !== safeNickname.toLowerCase())]);
    setShowConfirmPopup(false);
    setEmail("");
    setConfirmCode("");
    setNickname("");
  };

  const participantTape = [...participants, ...participants];

  return (
    <div className="page-root">
      <aside className="social-rail" aria-label={t.aria.socialLinks}>
        {t.social.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="social-dot"
            aria-label={item.label}
            data-platform={item.label.toLowerCase()}
          >
            {item.label}
          </a>
        ))}
      </aside>

      <aside className="section-rail" aria-label={t.aria.sectionNavigation}>
        {t.sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`rail-item ${activeSection === section.id ? "is-active" : ""}`}
            onClick={() => scrollToSection(section.id)}
          >
            <span className="rail-item-label">{section.label}</span>
          </button>
        ))}
      </aside>

      <section id="hero" className="landing-section hero section-enter">
        <video className="hero-video" autoPlay muted loop playsInline poster={withBasePath("/media/hero-start-poster.webp")}>
          <source src={withBasePath("/media/hero-start.mp4")} type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <p
          className={`hero-tag hero-tag-fixed hero-tag-anim step-${badgeStep} ${
            hideHeroTagOnMobile ? "is-hidden-mobile" : ""
          }`}
        >
          <span className="tag-line tag-line-morph">
            <span className="badge-slot badge-full">
              <span className="badge-reel">
                <span>{badgePair.old}</span>
                <span>{badgePair.new}</span>
              </span>
            </span>
          </span>
        </p>

        <div className="landing-shell hero-content section-content">
          <h1 className="hero-title embossed-title" aria-label={t.hero.ariaTitle}>
            <span className="title-desktop" aria-hidden="true">
              <span className="title-line title-top">
                <span className="title-back">{t.hero.title.desktopTop}</span>
                <span className="title-front">{t.hero.title.desktopTop}</span>
              </span>
              <span className="title-line title-bottom desktop-bottom-block">
                <span className="title-back">{t.hero.title.desktopBottom}</span>
                <span className="title-front">{t.hero.title.desktopBottom}</span>
              </span>
            </span>
            <span className="title-mobile" aria-hidden="true">
              <span className="title-line title-top">
                <span className="title-back">{t.hero.title.mobileTop}</span>
                <span className="title-front">{t.hero.title.mobileTop}</span>
              </span>
              <span className="title-line title-bottom">
                <span className="title-back">{t.hero.title.mobileBottom}</span>
                <span className="title-front">{t.hero.title.mobileBottom}</span>
              </span>
            </span>
          </h1>
          <p className="hero-subtitle">{t.hero.subtitle}</p>

          <div className="timer-grid">
            {timeParts.map((part) => (
              <div key={part.label} className="timer-card">
                <p className="timer-value">{part.value}</p>
                <p className="timer-label">{part.label}</p>
              </div>
            ))}
          </div>

          <div className="hero-cta">
            <button
              type="button"
              className="cta-secondary hero-cta-side hero-cta-support"
              onClick={() => scrollToSection("prereg")}
            >
              {t.hero.cta.support}
            </button>
            <button
              type="button"
              className="cta-primary hero-cta-main"
              onClick={() => scrollToSection("prereg")}
            >
              {t.hero.cta.prereg}
            </button>
            <button
              type="button"
              className="cta-secondary hero-cta-side hero-cta-about"
              onClick={() => scrollToSection("new-world")}
            >
              {t.hero.cta.about}
            </button>
          </div>
        </div>
      </section>

      <section id="new-world" className="landing-section section-enter">
        <div className="landing-shell section-panel split-panel new-world-panel">
          <h2 className="panel-ridge-title">{t.newWorld.title}</h2>

          <div className="compare-wrap">
            <span className="compare-label left">{t.newWorld.before}</span>
            <span className="compare-label right">{t.newWorld.after}</span>

            <div className="compare-frame">
              <div
                className="compare-before"
                style={{
                  backgroundImage: `linear-gradient(145deg, rgba(255, 255, 255, 0.07), rgba(0, 0, 0, 0.35)), url("${activeComparePair.beforeImage}")`,
                  backgroundPosition: activeComparePair.beforePosition,
                }}
              />
              <div
                className="compare-after"
                style={{
                  width: `${100 - comparePosition}%`,
                  backgroundImage: `linear-gradient(145deg, rgba(47, 168, 255, 0.22), rgba(0, 0, 0, 0.4)), url("${activeComparePair.afterImage}")`,
                  backgroundPosition: activeComparePair.afterPosition,
                }}
              />
              <div className="compare-divider" style={{ left: `${comparePosition}%` }}>
                <div className="compare-handle" aria-hidden="true">
                  <span>‹</span>
                  <span>›</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={comparePosition}
                onChange={(event) => setComparePosition(Number(event.target.value))}
                className="compare-range"
                aria-label={t.aria.compareSlider}
              />
            </div>
          </div>

          <div className="compare-controls">
            <button
              type="button"
              className="compare-nav"
              onClick={() =>
                setActiveComparePairIndex((prev) => (prev - 1 + COMPARE_PAIRS.length) % COMPARE_PAIRS.length)
              }
              aria-label="Previous compare pair"
            >
              <span>‹</span>
            </button>
            <div className="compare-pairs">
              {t.newWorld.pairs.map((pairLabel, index) => (
                <button
                  key={pairLabel}
                  type="button"
                  className={`compare-pair-dot ${index === activeComparePairIndex ? "is-active" : ""}`}
                  onClick={() => setActiveComparePairIndex(index)}
                  aria-label={pairLabel}
                  title={pairLabel}
                />
              ))}
            </div>
            <button
              type="button"
              className="compare-nav"
              onClick={() => setActiveComparePairIndex((prev) => (prev + 1) % COMPARE_PAIRS.length)}
              aria-label="Next compare pair"
            >
              <span>›</span>
            </button>
          </div>
        </div>
      </section>

      <section id="roadmap" className="landing-section section-enter">
        <div className="landing-shell section-panel split-panel roadmap-panel">
          <h2 className="panel-ridge-title">{t.roadmap.title}</h2>
          <div className="roadmap-layout">
            <div className="roadmap-steps" role="tablist" aria-label={t.roadmap.title}>
              {t.roadmap.steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  className={`roadmap-step-card ${index === activeRoadmapStepIndex ? "is-active" : ""}`}
                  onClick={() => setActiveRoadmapStepIndex(index)}
                  role="tab"
                  aria-selected={index === activeRoadmapStepIndex}
                >
                  <span className={`road-step-index ${step.done ? "is-done" : ""}`}>{index + 1}</span>
                  <span className="road-step-copy">
                    <span className="road-title">{step.title}</span>
                    <span className="road-desc">{step.desc}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="roadmap-detail" role="tabpanel">
              <p
                className={`roadmap-detail-kicker ${
                  activeRoadmapStep.inProgress ? "is-progress" : activeRoadmapStep.done ? "is-done" : "is-next"
                }`}
              >
                {activeRoadmapStep.inProgress
                  ? t.roadmap.inProgressLabel
                  : activeRoadmapStep.done
                    ? t.roadmap.completedLabel
                    : t.roadmap.currentLabel}
              </p>
              <h3 className="roadmap-detail-title">{activeRoadmapStep.title}</h3>
              <p className="roadmap-detail-copy">{activeRoadmapStep.detail ?? activeRoadmapStep.desc}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="prereg" className="landing-section section-enter">
        <div className="landing-shell support-merge">
          <div className="section-panel split-panel prereg-panel">
            <h2 className="panel-ridge-title">{t.prereg.title}</h2>
            <div className="prereg-block">
              <p className="big-number">{preregCount.toLocaleString("ru-RU")}</p>
              <p className="kicker">{t.prereg.kicker}</p>

              <form onSubmit={onPreregSubmit} className="email-form">
                <input
                  type="email"
                  className="email-input"
                  placeholder={t.prereg.emailPlaceholder}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button type="submit" className="cta-primary cta-inline">
                  {t.prereg.submit}
                </button>
              </form>

              <p className="muted-copy prereg-reward-copy">{t.prereg.rewards}</p>
            </div>
          </div>

          <div id="support" className="section-panel split-panel support-panel">
            <h2 className="panel-ridge-title">{t.support.cta}</h2>
            <div className="support-block">
              <p className="big-number money">{supportCount.toLocaleString("ru-RU")}</p>
              <p className="kicker">{t.support.kicker}</p>
              <form className="email-form support-form">
                <input
                  type="text"
                  inputMode="numeric"
                  className="email-input"
                  placeholder={t.support.amountPlaceholder}
                  value={donationAmount}
                  onChange={(event) => setDonationAmount(event.target.value.replace(/[^\d]/g, ""))}
                />
                <button type="submit" className="cta-primary cta-inline wide">
                  {t.support.cta}
                </button>
              </form>
              <p className="muted-copy">{t.support.description}</p>
            </div>
          </div>

          <div className="section-panel split-panel participants-panel">
            <div className="participants-marquee" aria-label={t.participants.title}>
              <div className="participants-track">
                {participantTape.map((item, index) => (
                  <span key={`${item}-${index}`} className="participant-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <h2 className="panel-ridge-title panel-ridge-title-bottom">{t.participants.title}</h2>
          </div>
        </div>
      </section>

      <section id="media" className="landing-section section-enter">
        <div className="landing-shell section-panel split-panel media-panel">
          <h2 className="panel-ridge-title">{t.media.title}</h2>
          <div className="media-grid">
            {t.media.items.map((item) => (
              <article key={item} className="media-card">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {showConfirmPopup && (
        <div className="popup-backdrop">
          <div className="popup-card section-panel">
            <h3 className="section-title small">{t.popup.title}</h3>
            <p className="muted-copy center">
              {t.popup.sentPrefix} {email}
            </p>
            <form className="popup-form" onSubmit={onConfirmPrereg}>
              <input
                type="text"
                className="email-input"
                placeholder={t.popup.codePlaceholder}
                value={confirmCode}
                onChange={(event) => setConfirmCode(event.target.value)}
              />
              <input
                type="text"
                className="email-input"
                placeholder={t.popup.nicknamePlaceholder}
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
              <button type="submit" className="cta-primary cta-inline">
                {t.popup.confirm}
              </button>
            </form>
            <button type="button" className="popup-close" onClick={() => setShowConfirmPopup(false)}>
              {t.popup.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
