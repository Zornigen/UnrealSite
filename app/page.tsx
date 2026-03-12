"use client";

import Image from "next/image";
import { type CSSProperties, type TouchEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import de from "@/locales/de.json";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import ja from "@/locales/ja.json";
import ru from "@/locales/ru.json";
import th from "@/locales/th.json";

const translations = { en, ru, ja, th, de, fr };
type Locale = keyof typeof translations;
const localeOptions: Locale[] = ["ru", "en", "de", "fr", "ja", "th"];
const localeLabels: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  de: "DE",
  fr: "FR",
  ja: "JA",
  th: "TH",
};
type FormErrors = {
  email?: string;
  amount?: string;
  code?: string;
  nickname?: string;
};
type PopupSuccessState = {
  email: string;
  nickname: string;
} | null;
type MediaKind = "image" | "video" | "external";
type MediaAsset = {
  title: string;
  meta: string;
  image: string;
  kind: MediaKind;
  src?: string;
  href?: string;
  download?: string;
  eyebrow?: string;
  copy?: string;
  action?: string;
};
type MediaGalleryEntry = MediaAsset & {
  key: string;
};

function toMediaKind(value: string | undefined): MediaKind {
  if (value === "video" || value === "external") return value;
  return "image";
}

function normalizeMediaAsset(asset: {
  title: string;
  meta: string;
  image: string;
  kind?: string;
  src?: string;
  href?: string;
  download?: string;
  eyebrow?: string;
  copy?: string;
  action?: string;
}): MediaAsset {
  return {
    ...asset,
    kind: toMediaKind(asset.kind),
  };
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const withBasePath = (path: string) => `${basePath}${path}`;

const RELEASE_DATE = new Date("2026-08-16T16:00:00+03:00");
const CONTENT_AUTOPLAY_MS = 6800;
const USD_EXCHANGE_RATE = 80;
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
const CLASS_THEMES = [
  {
    accent: "#A94720",
    glow: "rgba(169, 71, 32, 0.38)",
    shadow: "rgba(88, 34, 12, 0.42)",
    portrait:
      `radial-gradient(circle at 52% 22%, rgba(230, 170, 145, 0.22), transparent 24%), linear-gradient(180deg, rgba(169, 71, 32, 0.12), rgba(20, 12, 6, 0.04) 34%, rgba(0, 0, 0, 0.52) 100%), url("${withBasePath("/cards/titan.png")}") center top / cover no-repeat`,
  },
  {
    accent: "#207FAA",
    glow: "rgba(32, 127, 170, 0.38)",
    shadow: "rgba(10, 48, 79, 0.4)",
    portrait:
      `radial-gradient(circle at 50% 24%, rgba(174, 222, 245, 0.22), transparent 24%), linear-gradient(180deg, rgba(32, 127, 170, 0.12), rgba(10, 24, 36, 0.05) 34%, rgba(0, 0, 0, 0.52) 100%), url("${withBasePath("/cards/knight.png")}") center top / cover no-repeat`,
  },
  {
    accent: "#388E50",
    glow: "rgba(56, 142, 80, 0.36)",
    shadow: "rgba(18, 70, 40, 0.42)",
    portrait:
      `radial-gradient(circle at 52% 20%, rgba(194, 236, 181, 0.2), transparent 24%), linear-gradient(180deg, rgba(56, 142, 80, 0.1), rgba(16, 34, 18, 0.04) 34%, rgba(0, 0, 0, 0.52) 100%), url("${withBasePath("/cards/healer.png")}") center top / cover no-repeat`,
  },
  {
    accent: "#524C7B",
    glow: "rgba(82, 76, 123, 0.36)",
    shadow: "rgba(39, 28, 73, 0.42)",
    portrait:
      `radial-gradient(circle at 49% 21%, rgba(214, 205, 249, 0.22), transparent 24%), linear-gradient(180deg, rgba(82, 76, 123, 0.1), rgba(22, 18, 34, 0.04) 34%, rgba(0, 0, 0, 0.52) 100%), url("${withBasePath("/cards/mage.png")}") center top / cover no-repeat`,
  },
  {
    accent: "#DB9C00",
    glow: "rgba(219, 156, 0, 0.34)",
    shadow: "rgba(90, 58, 10, 0.42)",
    portrait:
      `radial-gradient(circle at 53% 18%, rgba(255, 228, 170, 0.2), transparent 24%), linear-gradient(180deg, rgba(219, 156, 0, 0.1), rgba(38, 24, 8, 0.04) 34%, rgba(0, 0, 0, 0.52) 100%), url("${withBasePath("/cards/rogue.png")}") center top / cover no-repeat`,
  },
  {
    accent: "#8237A2",
    glow: "rgba(130, 55, 162, 0.34)",
    shadow: "rgba(55, 19, 76, 0.42)",
    portrait:
      `radial-gradient(circle at 50% 18%, rgba(225, 191, 246, 0.22), transparent 24%), linear-gradient(180deg, rgba(130, 55, 162, 0.1), rgba(28, 14, 34, 0.04) 34%, rgba(0, 0, 0, 0.52) 100%), url("${withBasePath("/cards/sorcerer.png")}") center top / cover no-repeat`,
  },
] as const;
const createContentTheme = (accent: string, glow: string) => ({
  accent,
  glow,
  haze:
    `radial-gradient(circle at 18% 22%, color-mix(in srgb, ${accent} 24%, transparent), transparent 26%), ` +
    `radial-gradient(circle at 84% 72%, color-mix(in srgb, ${accent} 10%, rgba(255,255,255,0.08)), transparent 24%)`,
  surface:
    `linear-gradient(145deg, color-mix(in srgb, ${accent} 18%, transparent), rgba(10, 14, 22, 0.18) 42%, rgba(4, 7, 12, 0.92) 100%)`,
});

const CONTENT_THEMES = [
  createContentTheme("#207FAA", "rgba(32, 127, 170, 0.38)"),
  createContentTheme("#A94720", "rgba(169, 71, 32, 0.38)"),
  createContentTheme("#DB9C00", "rgba(219, 156, 0, 0.34)"),
  createContentTheme("#8237A2", "rgba(130, 55, 162, 0.34)"),
  createContentTheme("#524C7B", "rgba(82, 76, 123, 0.36)"),
  createContentTheme("#388E50", "rgba(56, 142, 80, 0.36)"),
] as const;
const MEDIA_THEMES = [
  { accent: "#83C8FF", glow: "rgba(83, 182, 255, 0.34)" },
  { accent: "#A94720", glow: "rgba(169, 71, 32, 0.34)" },
  { accent: "#8237A2", glow: "rgba(130, 55, 162, 0.32)" },
  { accent: "#388E50", glow: "rgba(56, 142, 80, 0.32)" },
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidAmount(value: string, locale: Locale) {
  if (!/^\d+$/.test(value)) return false;
  const numericValue = Number(value);
  return locale === "ru" ? numericValue >= 500 : numericValue >= 10;
}

function isValidConfirmCode(value: string) {
  return /^\d{4,8}$/.test(value);
}

function isValidNickname(value: string) {
  return /^[A-Za-zА-Яа-яЁё0-9_]{3,16}$/.test(value);
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "ru";

    const storedLocale = window.localStorage.getItem("locale");
    if (
      storedLocale === "ru" ||
      storedLocale === "en" ||
      storedLocale === "de" ||
      storedLocale === "fr" ||
      storedLocale === "ja" ||
      storedLocale === "th"
    ) {
      return storedLocale;
    }

    return window.navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";
  });
  const t = translations[locale];

  const [now, setNow] = useState(() => Date.now());
  const [activeSection, setActiveSection] = useState(t.sections[0]?.id ?? "hero");
  const [hideHeroTagOnMobile, setHideHeroTagOnMobile] = useState(false);
  const [comparePosition, setComparePosition] = useState(56);
  const [activeComparePairIndex, setActiveComparePairIndex] = useState(0);
  const [activeClassIndex, setActiveClassIndex] = useState(0);
  const [activeProfessionIndex, setActiveProfessionIndex] = useState(0);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [contentProgress, setContentProgress] = useState(0);
  const [activeRoadmapStepIndex, setActiveRoadmapStepIndex] = useState(0);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeMediaLightboxIndex, setActiveMediaLightboxIndex] = useState<number | null>(null);
  const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [preregPending, setPreregPending] = useState(false);
  const [supportPending, setSupportPending] = useState(false);
  const [popupPending, setPopupPending] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState<PopupSuccessState>(null);
  const [supportNotice, setSupportNotice] = useState("");
  const [badgeStepIndex, setBadgeStepIndex] = useState(0);
  const [badgePairIndex, setBadgePairIndex] = useState(0);
  const scrollLockRef = useRef(false);
  const classTouchStartRef = useRef<{ x: number; y: number } | null>(null);

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
  const activeClass = t.classes.items[activeClassIndex] ?? t.classes.items[0];
  const activeClassTheme = CLASS_THEMES[activeClassIndex % CLASS_THEMES.length];
  const activeProfession = activeClass.professions[activeProfessionIndex] ?? activeClass.professions[0];
  const activeProfessionStats =
    "stats" in activeProfession && Array.isArray(activeProfession.stats)
      ? activeProfession.stats
      : activeClass.stats.slice(0, 2);
  const activeContent = t.content.items[activeContentIndex] ?? t.content.items[0];
  const activeContentTheme = CONTENT_THEMES[activeContentIndex % CONTENT_THEMES.length];
  const activeRoadmapStep = t.roadmap.steps[activeRoadmapStepIndex] ?? t.roadmap.steps[0];
  const activeMediaMode = t.media.modes[activeMediaIndex] ?? t.media.modes[0];
  const activeMediaTheme = MEDIA_THEMES[activeMediaIndex % MEDIA_THEMES.length];
  const displaySupportCount = locale === "ru" ? supportCount : Math.floor(supportCount / USD_EXCHANGE_RATE);
  const mediaFeatureCount = activeMediaIndex === 1 ? 3 : 2;
  const mediaSideItems = activeMediaMode.items.slice(0, mediaFeatureCount);
  const mediaGalleryItems = activeMediaMode.items.slice(mediaFeatureCount);
  const mediaEntries = useMemo<MediaGalleryEntry[]>(
    () => [
      { ...normalizeMediaAsset(activeMediaMode.hero), key: `${activeMediaMode.name}-hero` },
      ...activeMediaMode.items.map((item, index) => ({
        ...normalizeMediaAsset(item),
        key: `${activeMediaMode.name}-${index}`,
      })),
    ],
    [activeMediaMode]
  );
  const lightboxEntries = useMemo(
    () => mediaEntries.filter((entry) => entry.kind !== "external"),
    [mediaEntries]
  );
  const activeLightboxEntry =
    activeMediaLightboxIndex !== null ? lightboxEntries[activeMediaLightboxIndex] ?? null : null;

  const scrollToSection = (id: string) => {
    const node = document.getElementById(id);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showNextClass = () => {
    setActiveClassIndex((prev) => (prev + 1) % t.classes.items.length);
    setActiveProfessionIndex(0);
  };

  const showPrevClass = () => {
    setActiveClassIndex((prev) => (prev - 1 + t.classes.items.length) % t.classes.items.length);
    setActiveProfessionIndex(0);
  };

  const selectContent = (index: number) => {
    setActiveContentIndex(index);
    setContentProgress(0);
  };

  const closeConfirmPopup = () => {
    setShowConfirmPopup(false);
    setPopupPending(false);
    setPopupSuccess(null);
    setConfirmCode("");
    setNickname("");
    setFormErrors((prev) => ({ ...prev, code: undefined, nickname: undefined }));
  };

  const closeMediaLightbox = () => {
    setActiveMediaLightboxIndex(null);
  };

  const getMediaActionLabel = (asset: { action?: string; kind?: string }) => {
    const kind = toMediaKind(asset.kind);

    if (asset.action) return asset.action;
    if (kind === "external") return t.media.labels.visit;
    if (kind === "video") return t.media.labels.watch;
    return t.media.labels.open;
  };

  const openMediaAsset = (asset: MediaGalleryEntry) => {
    if (asset.kind === "external") {
      if (asset.href) {
        window.open(asset.href, "_blank", "noopener,noreferrer");
      }
      return;
    }

    const nextIndex = lightboxEntries.findIndex((entry) => entry.key === asset.key);
    if (nextIndex >= 0) {
      setActiveMediaLightboxIndex(nextIndex);
    }
  };

  const showPrevMediaAsset = () => {
    setActiveMediaLightboxIndex((prev) => {
      if (prev === null || lightboxEntries.length === 0) return prev;
      return (prev - 1 + lightboxEntries.length) % lightboxEntries.length;
    });
  };

  const showNextMediaAsset = () => {
    setActiveMediaLightboxIndex((prev) => {
      if (prev === null || lightboxEntries.length === 0) return prev;
      return (prev + 1) % lightboxEntries.length;
    });
  };

  const onClassesTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    classTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onClassesTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = classTouchStartRef.current;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    classTouchStartRef.current = null;

    if (Math.abs(deltaX) < 36 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      showNextClass();
      return;
    }

    showPrevClass();
  };

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("locale", locale);
  }, [locale]);

  useEffect(() => {
    if (!isLocaleMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLocaleMenuOpen(false);
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(".lang-switcher")) return;
      setIsLocaleMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [isLocaleMenuOpen]);

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
    let frameId = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / CONTENT_AUTOPLAY_MS, 1);
      setContentProgress(progress);

      if (progress >= 1) {
        setActiveContentIndex((current) => (current + 1) % t.content.items.length);
        return;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [activeContentIndex, t.content.items.length]);

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

  useEffect(() => {
    if (!showConfirmPopup) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeConfirmPopup();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showConfirmPopup]);

  useEffect(() => {
    if (activeMediaLightboxIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMediaLightboxIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveMediaLightboxIndex((prev) => {
          if (prev === null || lightboxEntries.length === 0) return prev;
          return (prev - 1 + lightboxEntries.length) % lightboxEntries.length;
        });
      }

      if (event.key === "ArrowRight") {
        setActiveMediaLightboxIndex((prev) => {
          if (prev === null || lightboxEntries.length === 0) return prev;
          return (prev + 1) % lightboxEntries.length;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMediaLightboxIndex, lightboxEntries]);

  const onPreregSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const safeEmail = email.trim();
    if (!safeEmail) {
      setFormErrors((prev) => ({ ...prev, email: t.prereg.errors.required }));
      return;
    }

    if (!isValidEmail(safeEmail)) {
      setFormErrors((prev) => ({ ...prev, email: t.prereg.errors.invalid }));
      return;
    }

    setPreregPending(true);
    setPopupSuccess(null);
    setFormErrors((prev) => ({ ...prev, email: undefined }));
    await new Promise((resolve) => window.setTimeout(resolve, 520));
    setPreregPending(false);
    setShowConfirmPopup(true);
  };

  const onSupportSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!donationAmount.trim()) {
      setFormErrors((prev) => ({ ...prev, amount: t.support.errors.required }));
      setSupportNotice("");
      return;
    }

    if (!isValidAmount(donationAmount, locale)) {
      setFormErrors((prev) => ({ ...prev, amount: t.support.errors.invalid }));
      setSupportNotice("");
      return;
    }

    setSupportPending(true);
    setFormErrors((prev) => ({ ...prev, amount: undefined }));
    await new Promise((resolve) => window.setTimeout(resolve, 520));
    setSupportPending(false);
    setSupportNotice(
      t.support.success.replace(
        "{amount}",
        Number(donationAmount).toLocaleString(locale === "ru" ? "ru-RU" : "en-US")
      )
    );
    setDonationAmount("");
  };

  const onConfirmPrereg = async (event: FormEvent) => {
    event.preventDefault();
    const safeCode = confirmCode.trim();
    const safeNickname = nickname.trim();
    const nextErrors: FormErrors = {};

    if (!safeCode) {
      nextErrors.code = t.popup.errors.codeRequired;
    } else if (!isValidConfirmCode(safeCode)) {
      nextErrors.code = t.popup.errors.codeInvalid;
    }

    if (!safeNickname) {
      nextErrors.nickname = t.popup.errors.nicknameRequired;
    } else if (!isValidNickname(safeNickname)) {
      nextErrors.nickname = t.popup.errors.nicknameInvalid;
    }

    if (nextErrors.code || nextErrors.nickname) {
      setFormErrors((prev) => ({ ...prev, ...nextErrors }));
      return;
    }

    setPopupPending(true);
    setFormErrors((prev) => ({ ...prev, code: undefined, nickname: undefined }));
    await new Promise((resolve) => window.setTimeout(resolve, 560));

    setParticipants((prev) => [safeNickname, ...prev.filter((item) => item.toLowerCase() !== safeNickname.toLowerCase())]);
    setPopupPending(false);
    setPopupSuccess({ email: email.trim(), nickname: safeNickname });
    setConfirmCode("");
    setNickname("");
    setFormErrors((prev) => ({ ...prev, code: undefined, nickname: undefined }));
  };

  const participantTape = [...participants, ...participants];

  return (
    <div className="page-root">
      <div className={`lang-switcher ${isLocaleMenuOpen ? "is-open" : ""}`} aria-label="Language switcher">
        <button
          type="button"
          className="social-dot lang-switcher-trigger"
          aria-haspopup="menu"
          aria-expanded={isLocaleMenuOpen}
          aria-label={`Current language ${localeLabels[locale]}`}
          onClick={() => setIsLocaleMenuOpen((prev) => !prev)}
        >
          <span className="lang-switcher-caret" aria-hidden="true">
            {isLocaleMenuOpen ? ">" : "<"}
          </span>
          <span>{localeLabels[locale]}</span>
        </button>

        <div className="lang-switcher-menu" role="menu" aria-hidden={!isLocaleMenuOpen}>
          {localeOptions
            .filter((option) => option !== locale)
            .map((option) => (
              <button
                key={option}
                type="button"
                className="social-dot lang-switcher-button"
                role="menuitem"
                title={localeLabels[option]}
                onClick={() => {
                  setLocale(option);
                  setIsLocaleMenuOpen(false);
                }}
              >
                {localeLabels[option]}
              </button>
            ))}
        </div>
      </div>

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
            hideHeroTagOnMobile || isLocaleMenuOpen ? "is-hidden-mobile" : ""
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

      <section id="classes" className="landing-section section-enter">
        <div className="landing-shell section-panel split-panel classes-panel">
          <h2 className="panel-ridge-title">{t.classes.title}</h2>

          <div className="classes-layout">
            <div
              className="classes-stage"
              role="tablist"
              aria-label={t.classes.title}
              style={
                {
                  "--class-accent": activeClassTheme.accent,
                  "--class-glow": activeClassTheme.glow,
                } as CSSProperties
              }
            >
              <div className="classes-stack">
              <div className="classes-stack-touch" onTouchStart={onClassesTouchStart} onTouchEnd={onClassesTouchEnd}>
                {t.classes.items.map((item, index) => {
                  const theme = CLASS_THEMES[index % CLASS_THEMES.length];
                  const offset = index - activeClassIndex;
                  const distance = Math.abs(offset);
                  const isActive = index === activeClassIndex;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      className={`class-card ${isActive ? "is-active" : ""}`}
                      onClick={() => {
                        setActiveClassIndex(index);
                        setActiveProfessionIndex(0);
                      }}
                      role="tab"
                      aria-selected={isActive}
                      style={
                        {
                          "--class-offset": offset,
                          "--class-depth": distance,
                          "--class-accent": theme.accent,
                          "--class-glow": theme.glow,
                          "--class-shadow": theme.shadow,
                          "--class-portrait": theme.portrait,
                          zIndex: t.classes.items.length - distance,
                        } as CSSProperties
                      }
                    >
                      <span className="class-card-frame">
                        <span className="class-card-badge">{String(index + 1).padStart(2, "0")}</span>
                        <span className="class-card-copy">
                          <span className="class-card-name">{item.name}</span>
                          <span className="class-card-role">{item.role}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              </div>
              <div className="classes-controls" aria-label="Class navigation">
                <button type="button" className="class-nav" onClick={showPrevClass} aria-label="Previous class">
                  <span>‹</span>
                </button>
                <div className="class-pairs">
                  {t.classes.items.map((item, index) => (
                    <button
                      key={item.name}
                      type="button"
                      className={`class-pair-dot ${index === activeClassIndex ? "is-active" : ""}`}
                      onClick={() => {
                        setActiveClassIndex(index);
                        setActiveProfessionIndex(0);
                      }}
                      aria-label={item.name}
                      title={item.name}
                    />
                  ))}
                </div>
                <button type="button" className="class-nav" onClick={showNextClass} aria-label="Next class">
                  <span>›</span>
                </button>
              </div>
            </div>

            <article
              className="class-detail"
              role="tabpanel"
              style={
                {
                  "--class-accent": activeClassTheme.accent,
                  "--class-glow": activeClassTheme.glow,
                  "--class-shadow": activeClassTheme.shadow,
                } as CSSProperties
              }
            >
              <h3 className="class-detail-title">{activeClass.name}</h3>
              <div className="class-profession-switch" role="tablist" aria-label={`${activeClass.name} professions`}>
                {activeClass.professions.map((profession, index) => (
                  <button
                    key={profession.name}
                    type="button"
                    className={`class-profession-tab ${index === activeProfessionIndex ? "is-active" : ""}`}
                    onClick={() => setActiveProfessionIndex(index)}
                    role="tab"
                    aria-selected={index === activeProfessionIndex}
                  >
                    {profession.name}
                  </button>
                ))}
              </div>
              <p className="class-detail-subtitle">{activeClass.tagline}</p>
              <p className="class-detail-copy">{activeClass.description}</p>

              <div className="class-profession-panel">
                <h4 className="class-profession-title">{activeProfession.name}</h4>
                <p className="class-profession-copy">{activeProfession.description}</p>
                <div className="class-profession-focus">
                  {activeProfession.focus.map((item) => (
                    <span key={item} className="class-profession-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="class-stat-grid">
                {activeProfessionStats.map((stat) => (
                  <div key={stat.label} className="class-stat-card">
                    <span className="class-stat-label">{stat.label}</span>
                    <span className="class-stat-value">{stat.value}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="content" className="landing-section section-enter">
        <div className="landing-shell section-panel split-panel content-panel">
          <h2 className="panel-ridge-title">{t.content.title}</h2>

          <div
            className="content-layout"
            style={
              {
                "--content-accent": activeContentTheme.accent,
                "--content-glow": activeContentTheme.glow,
              } as CSSProperties
            }
          >
            <div className="content-switch" role="tablist" aria-label={t.content.title}>
              {t.content.items.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  className={`content-tab ${index === activeContentIndex ? "is-active" : ""}`}
                  onClick={() => selectContent(index)}
                  role="tab"
                  aria-selected={index === activeContentIndex}
                  style={
                    index === activeContentIndex
                      ? ({
                          "--content-accent": activeContentTheme.accent,
                          "--content-glow": activeContentTheme.glow,
                        } as CSSProperties)
                      : undefined
                  }
                >
                  {item.name}
                </button>
              ))}
            </div>

            <article
              className="content-scene"
              role="tabpanel"
              style={
                {
                  "--content-accent": activeContentTheme.accent,
                  "--content-glow": activeContentTheme.glow,
                  "--content-haze": activeContentTheme.haze,
                  "--content-surface": activeContentTheme.surface,
                  "--content-progress": contentProgress,
                } as CSSProperties
              }
            >
              <div className="content-scene-layers" aria-hidden="true">
                <span className="content-layer content-layer-a" />
                <span className="content-layer content-layer-b" />
                <span className="content-layer content-layer-c" />
                <span className="content-layer content-layer-d" />
              </div>

              <div className="content-scene-grid">
                <div className="content-copy">
                  <p className="content-eyebrow">{activeContent.eyebrow}</p>
                  <h3 className="content-title">{activeContent.name}</h3>
                  <p className="content-subtitle">{activeContent.subtitle}</p>
                  <div className="content-bullets">
                    {activeContent.bullets.map((bullet) => (
                      <p key={bullet} className="content-bullet">
                        {bullet}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="content-side">
                  <div className="content-fact-card">
                    <span className="content-fact-label">{activeContent.factLabel}</span>
                    <span className="content-fact-value">{activeContent.factValue}</span>
                  </div>
                  <div className="content-highlight-row">
                    {activeContent.highlights.map((item) => (
                      <span key={item} className="content-highlight-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
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
              <p className="big-number">{preregCount.toLocaleString(locale === "ru" ? "ru-RU" : "en-US")}</p>
              <p className="kicker">{t.prereg.kicker}</p>

              <form onSubmit={onPreregSubmit} className="email-form">
                <div className="field-stack">
                  <input
                    type="email"
                    className={`email-input ${formErrors.email ? "is-invalid" : email.trim() && isValidEmail(email.trim()) ? "is-valid" : ""}`}
                    placeholder={t.prereg.emailPlaceholder}
                    value={email}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setEmail(nextValue);
                      setFormErrors((prev) => ({
                        ...prev,
                        email: !nextValue.trim() || isValidEmail(nextValue.trim()) ? undefined : t.prereg.errors.invalid,
                      }));
                    }}
                    aria-invalid={Boolean(formErrors.email)}
                    aria-describedby={formErrors.email ? "prereg-email-error" : undefined}
                  />
                  <span id="prereg-email-error" className={`field-message ${formErrors.email ? "is-visible is-error" : ""}`}>
                    {formErrors.email}
                  </span>
                </div>
                <button type="submit" className="cta-primary cta-inline" disabled={preregPending}>
                  {preregPending ? t.prereg.pending : t.prereg.submit}
                </button>
              </form>

              <p className="muted-copy prereg-reward-copy">{t.prereg.rewards}</p>
            </div>
          </div>

          <div id="support" className="section-panel split-panel support-panel">
            <h2 className="panel-ridge-title">{t.support.cta}</h2>
            <div className="support-block">
              <p className="big-number money">{displaySupportCount.toLocaleString(locale === "ru" ? "ru-RU" : "en-US")}</p>
              <p className="kicker">{t.support.kicker}</p>
              <form className="email-form support-form" onSubmit={onSupportSubmit}>
                <div className="field-stack">
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`email-input ${formErrors.amount ? "is-invalid" : donationAmount && isValidAmount(donationAmount, locale) ? "is-valid" : ""}`}
                    placeholder={t.support.amountPlaceholder}
                    value={donationAmount}
                    onChange={(event) => {
                      const nextValue = event.target.value.replace(/[^\d]/g, "");
                      setDonationAmount(nextValue);
                      setSupportNotice("");
                      setFormErrors((prev) => ({
                        ...prev,
                        amount: !nextValue || isValidAmount(nextValue, locale) ? undefined : t.support.errors.invalid,
                      }));
                    }}
                    aria-invalid={Boolean(formErrors.amount)}
                    aria-describedby={formErrors.amount ? "support-amount-error" : supportNotice ? "support-amount-note" : undefined}
                  />
                  <span id="support-amount-error" className={`field-message ${formErrors.amount ? "is-visible is-error" : ""}`}>
                    {formErrors.amount}
                  </span>
                  <span id="support-amount-note" className={`field-message ${supportNotice ? "is-visible is-success" : ""}`}>
                    {supportNotice}
                  </span>
                </div>
                <button type="submit" className="cta-primary cta-inline wide" disabled={supportPending}>
                  {supportPending ? t.support.pending : t.support.cta}
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
        <div
          className="landing-shell section-panel split-panel media-panel media-stage"
          style={
            {
              "--media-accent": activeMediaTheme.accent,
              "--media-glow": activeMediaTheme.glow,
            } as CSSProperties
          }
        >
          <div className="media-ridge-nav" aria-label={t.media.title}>
            {t.media.modes.map((mode, index) => (
              <button
                key={mode.name}
                type="button"
                className={`media-ridge-word ${index === activeMediaIndex ? "is-active" : ""}`}
                onClick={() => {
                  setActiveMediaIndex(index);
                  setActiveMediaLightboxIndex(null);
                }}
                aria-pressed={index === activeMediaIndex}
              >
                {mode.name}
              </button>
            ))}
          </div>

          <div className={`media-stage-panel media-layout-${activeMediaIndex + 1}`}>
            <article
              className="media-hero-card"
              style={
                {
                  "--media-hero-image": `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.38)), url("${withBasePath(activeMediaMode.hero.image)}")`,
                } as CSSProperties
              }
            >
              <div className="media-hero-copy">
                <p className="media-hero-kicker">{activeMediaMode.hero.eyebrow}</p>
                <h3 className="media-hero-title">{activeMediaMode.hero.title}</h3>
                <p className="media-hero-text">{activeMediaMode.hero.copy}</p>
              </div>
              <div className="media-hero-meta">
                <span className="media-hero-chip">{activeMediaMode.hero.meta}</span>
                <button
                  type="button"
                  className="media-hero-action"
                  onClick={() => openMediaAsset(mediaEntries[0])}
                >
                  {getMediaActionLabel(activeMediaMode.hero)}
                </button>
              </div>
            </article>

            <div className="media-feature-list">
              {mediaSideItems.map((item, index) => (
                <button
                  key={`${activeMediaMode.name}-feature-${item.title}`}
                  type="button"
                  className={`media-card-button media-feature-card media-feature-${activeMediaIndex + 1}-${index + 1}`}
                  onClick={() => openMediaAsset(mediaEntries[index + 1])}
                  aria-label={`${item.title}. ${getMediaActionLabel(item)}`}
                  style={
                    {
                      "--media-card-image": `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.44)), url("${withBasePath(item.image)}")`,
                    } as CSSProperties
                  }
                >
                  <div className="media-side-overlay" />
                  <div className="media-side-copy">
                    <p className="media-side-title">{item.title}</p>
                    <p className="media-side-meta">{item.meta}</p>
                  </div>
                  <span className="media-card-action">{getMediaActionLabel(item)}</span>
                </button>
              ))}
            </div>

            {mediaGalleryItems.length > 0 ? (
              <div className={`media-side-list media-gallery-${activeMediaIndex + 1}`}>
                {mediaGalleryItems.map((item, index) => (
                  <button
                    key={`${activeMediaMode.name}-${item.title}`}
                    type="button"
                    className={`media-card-button media-side-card media-side-${activeMediaIndex + 1}-${index + 1}`}
                    onClick={() => openMediaAsset(mediaEntries[index + mediaFeatureCount + 1])}
                    aria-label={`${item.title}. ${getMediaActionLabel(item)}`}
                    style={
                      {
                        "--media-card-image": `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.44)), url("${withBasePath(item.image)}")`,
                      } as CSSProperties
                    }
                  >
                    <div className="media-side-overlay" />
                    <div className="media-side-copy">
                      <p className="media-side-title">{item.title}</p>
                      <p className="media-side-meta">{item.meta}</p>
                    </div>
                    <span className="media-card-action">{getMediaActionLabel(item)}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="media-status-line" aria-hidden="true">
            <span className="media-status-index">
              {String(activeMediaIndex + 1).padStart(2, "0")} / {String(t.media.modes.length).padStart(2, "0")}
            </span>
            <span className="media-status-label">{t.media.counterLabel}</span>
            <span className="media-status-name">{activeMediaMode.name}</span>
            <span className="media-status-descriptor">{activeMediaMode.descriptor}</span>
          </div>
        </div>
      </section>

      {activeLightboxEntry && (
        <div className="media-lightbox-backdrop" onClick={closeMediaLightbox}>
          <div
            className="media-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={activeLightboxEntry.title}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="media-lightbox-stage">
              <div className="media-lightbox-overlay">
                <div className="media-lightbox-topbar">
                  <div className="media-lightbox-heading">
                    <h3 className="media-lightbox-ridge-title">{activeLightboxEntry.title}</h3>
                  </div>
                  <div className="media-lightbox-meta">
                    <p className="media-lightbox-subtitle">{activeLightboxEntry.meta}</p>
                  </div>
                  <div className="media-lightbox-actions">
                    <a
                      className="cta-secondary media-lightbox-action media-lightbox-action-desktop"
                      href={withBasePath(
                        activeLightboxEntry.download ?? activeLightboxEntry.src ?? activeLightboxEntry.image
                      )}
                      download={activeLightboxEntry.kind !== "external"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t.media.labels.download}
                    </a>
                    <button
                      type="button"
                      className="cta-secondary media-lightbox-action media-lightbox-action-desktop"
                      onClick={closeMediaLightbox}
                    >
                      {t.media.labels.close}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="media-lightbox-nav media-lightbox-nav-prev"
                onClick={showPrevMediaAsset}
                aria-label={t.media.labels.previous}
              >
                <span aria-hidden="true">←</span>
              </button>

              <div className="media-lightbox-frame">
                {activeLightboxEntry.kind === "video" ? (
                  <video
                    className="media-lightbox-video"
                    controls
                    autoPlay
                    playsInline
                    poster={withBasePath(activeLightboxEntry.image)}
                  >
                    <source src={withBasePath(activeLightboxEntry.src ?? "")} type="video/mp4" />
                    {t.media.labels.videoFallback}
                  </video>
                ) : (
                  <Image
                    className="media-lightbox-image"
                    src={withBasePath(activeLightboxEntry.src ?? activeLightboxEntry.image)}
                    alt={activeLightboxEntry.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 80vw"
                    unoptimized
                  />
                )}
              </div>

              <div className="media-lightbox-actions media-lightbox-actions-mobile">
                <a
                  className="cta-secondary media-lightbox-action"
                  href={withBasePath(activeLightboxEntry.download ?? activeLightboxEntry.src ?? activeLightboxEntry.image)}
                  download={activeLightboxEntry.kind !== "external"}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.media.labels.download}
                </a>
                <button type="button" className="cta-secondary media-lightbox-action" onClick={closeMediaLightbox}>
                  {t.media.labels.close}
                </button>
              </div>

              <button
                type="button"
                className="media-lightbox-nav media-lightbox-nav-next"
                onClick={showNextMediaAsset}
                aria-label={t.media.labels.next}
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmPopup && (
        <div className="popup-backdrop" onClick={closeConfirmPopup}>
          <div className="popup-card section-panel split-panel" onClick={(event) => event.stopPropagation()}>
            <h3 className="panel-ridge-title popup-ridge-title">
              {popupSuccess ? t.popup.successTitle : t.popup.title}
            </h3>
            <div className="popup-body">
              {popupSuccess ? (
                <div className="popup-success">
                  <p className="popup-success-copy">
                    {t.popup.successPrefix} <strong>{popupSuccess.nickname}</strong> {t.popup.successMiddle}{" "}
                    <strong>{popupSuccess.email}</strong>.
                  </p>
                  <p className="popup-note">{t.popup.bindingNote}</p>
                  <div className="popup-success-card">
                    <span className="popup-success-label">{t.popup.successNicknameLabel}</span>
                    <span className="popup-success-value">{popupSuccess.nickname}</span>
                    <span className="popup-success-label">{t.popup.successEmailLabel}</span>
                    <span className="popup-success-value popup-success-value-small">{popupSuccess.email}</span>
                  </div>
                  <div className="popup-actions">
                    <button type="button" className="cta-primary cta-inline wide" onClick={closeConfirmPopup}>
                      {t.popup.successClose}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="muted-copy center popup-copy">
                    {t.popup.sentPrefix} {email}
                  </p>
                  <p className="popup-note">{t.popup.bindingNote}</p>
                  <form className="popup-form" onSubmit={onConfirmPrereg}>
                    <div className="field-stack">
                      <input
                        type="text"
                        inputMode="numeric"
                        className={`email-input ${formErrors.code ? "is-invalid" : confirmCode && isValidConfirmCode(confirmCode.trim()) ? "is-valid" : ""}`}
                        placeholder={t.popup.codePlaceholder}
                        value={confirmCode}
                        onChange={(event) => {
                          const nextValue = event.target.value.replace(/[^\d]/g, "");
                          setConfirmCode(nextValue);
                          setFormErrors((prev) => ({
                            ...prev,
                            code: !nextValue || isValidConfirmCode(nextValue) ? undefined : t.popup.errors.codeInvalid,
                          }));
                        }}
                        aria-invalid={Boolean(formErrors.code)}
                        aria-describedby={formErrors.code ? "confirm-code-error" : "confirm-code-hint"}
                      />
                      <span id="confirm-code-hint" className="field-message is-visible">
                        {t.popup.codeHint}
                      </span>
                      <span id="confirm-code-error" className={`field-message ${formErrors.code ? "is-visible is-error" : ""}`}>
                        {formErrors.code}
                      </span>
                    </div>
                    <div className="field-stack">
                      <input
                        type="text"
                        className={`email-input ${formErrors.nickname ? "is-invalid" : nickname && isValidNickname(nickname.trim()) ? "is-valid" : ""}`}
                        placeholder={t.popup.nicknamePlaceholder}
                        value={nickname}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setNickname(nextValue);
                          setFormErrors((prev) => ({
                            ...prev,
                            nickname: !nextValue.trim() || isValidNickname(nextValue.trim()) ? undefined : t.popup.errors.nicknameInvalid,
                          }));
                        }}
                        aria-invalid={Boolean(formErrors.nickname)}
                        aria-describedby={formErrors.nickname ? "nickname-error" : "nickname-hint"}
                      />
                      <span id="nickname-hint" className="field-message is-visible">
                        {t.popup.nicknameHint}
                      </span>
                      <span id="nickname-error" className={`field-message ${formErrors.nickname ? "is-visible is-error" : ""}`}>
                        {formErrors.nickname}
                      </span>
                    </div>
                    <div className="popup-actions">
                      <button type="submit" className="cta-primary cta-inline wide" disabled={popupPending}>
                        {popupPending ? t.popup.pending : t.popup.confirm}
                      </button>
                      <button type="button" className="popup-close" onClick={closeConfirmPopup}>
                        {t.popup.close}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
