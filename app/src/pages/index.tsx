import Head from "next/head";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Palette = {
  id: string;
  name: string;
  gradient: string;
  accent: string;
  subtleAccent: string;
  text: string;
  secondaryText: string;
  sparkle: string;
};

const palettes: Palette[] = [
  {
    id: "aurora",
    name: "Aurora Bloom",
    gradient:
      "linear-gradient(135deg, rgba(255, 175, 189, 0.85) 0%, rgba(100, 216, 255, 0.95) 45%, rgba(132, 225, 188, 0.88) 100%)",
    accent: "#0f172a",
    subtleAccent: "rgba(15, 23, 42, 0.75)",
    text: "#06101d",
    secondaryText: "rgba(6, 16, 29, 0.78)",
    sparkle:
      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.55) 0, rgba(255,255,255,0) 50%)",
  },
  {
    id: "nebula",
    name: "Future Nebula",
    gradient:
      "linear-gradient(135deg, rgba(255, 120, 200, 0.85) 10%, rgba(96, 97, 255, 0.92) 55%, rgba(56, 189, 248, 0.85) 95%)",
    accent: "#0b1120",
    subtleAccent: "rgba(11, 17, 32, 0.78)",
    text: "#f8fafc",
    secondaryText: "rgba(241, 245, 249, 0.78)",
    sparkle:
      "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.6) 0, rgba(255,255,255,0) 45%)",
  },
  {
    id: "sunset",
    name: "Sunset Aura",
    gradient:
      "linear-gradient(130deg, rgba(255, 170, 51, 0.94) 5%, rgba(255, 88, 93, 0.9) 50%, rgba(98, 48, 255, 0.88) 95%)",
    accent: "#23142a",
    subtleAccent: "rgba(35, 20, 42, 0.8)",
    text: "#1b1025",
    secondaryText: "rgba(27, 16, 37, 0.72)",
    sparkle:
      "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.5) 0, rgba(255,255,255,0) 55%)",
  },
  {
    id: "zen",
    name: "Tranquil Wave",
    gradient:
      "linear-gradient(140deg, rgba(56, 189, 248, 0.9) 5%, rgba(56, 249, 206, 0.9) 50%, rgba(99, 102, 241, 0.88) 95%)",
    accent: "#042f2e",
    subtleAccent: "rgba(4, 47, 46, 0.75)",
    text: "#031312",
    secondaryText: "rgba(3, 19, 18, 0.75)",
    sparkle:
      "radial-gradient(circle at 70% 75%, rgba(255,255,255,0.55) 0, rgba(255,255,255,0) 55%)",
  },
];

const layoutOrder = ["spotlight", "angled", "compact"] as const;

type LayoutId = (typeof layoutOrder)[number];

type CardRefs = Record<LayoutId, HTMLDivElement | null>;

const defaultFeatures = [
  "Premium ingredients for everyday luxury",
  "Sleek design that deserves the spotlight",
  "Sustainably crafted with conscious care",
];

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

const alphaColor = (hex: string, alpha: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function Home() {
  const [productName, setProductName] = useState("Luminex Glow Serum");
  const [tagline, setTagline] = useState("Radiant skin in 24 hours.");
  const [description, setDescription] = useState(
    "Powered by bio-active botanicals and adaptive hydration to give you your best glow yet."
  );
  const [cta, setCta] = useState("Shop the collection");
  const [featureInputs, setFeatureInputs] = useState(defaultFeatures);
  const [paletteId, setPaletteId] = useState<Palette["id"]>("aurora");

  const palette = useMemo(
    () => palettes.find((p) => p.id === paletteId) ?? palettes[0],
    [paletteId]
  );

  const cardRefs = useRef<CardRefs>({
    spotlight: null,
    angled: null,
    compact: null,
  });

  const handleFeatureChange = (index: number, value: string) => {
    setFeatureInputs((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleDownload = async (layout: LayoutId) => {
    const node = cardRefs.current[layout];
    if (!node) return;

    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    const fileSafeName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    link.download = `${fileSafeName || "product"}-${layout}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handlePaletteChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPaletteId(event.target.value as Palette["id"]);
  };

  const featureList = useMemo(
    () => featureInputs.filter((item) => item.trim().length > 0).slice(0, 3),
    [featureInputs]
  );

  const renderCard = (layout: LayoutId) => {
    if (layout === "spotlight") {
      return (
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.32)] backdrop-blur-xl">
          <span
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{ background: palette.gradient }}
          />
          <span
            className="pointer-events-none absolute inset-0 mix-blend-screen"
            style={{ background: palette.sparkle }}
          />
          <div className="relative flex flex-col gap-8 text-slate-900">
            <div className="flex flex-col gap-4">
              <span className="max-w-fit rounded-full border border-white/50 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm backdrop-blur">
                NEW DROP
              </span>
              <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 drop-shadow-xl">
                {productName}
              </h2>
              <p className="text-lg font-medium text-slate-800 drop-shadow">
                {tagline}
              </p>
            </div>
            <div className="relative flex items-center gap-6">
              <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-[0_15px_45px_rgba(15,23,42,0.23)]">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${alphaColor(
                      palette.accent,
                      0.28
                    )}, transparent 60%)`,
                  }}
                />
                <div className="absolute inset-6 rounded-2xl border border-white/50 bg-white/90 shadow-inner" />
                <div className="absolute inset-10 rounded-[22px] border border-white/40 bg-gradient-to-br from-white via-white to-white/50 backdrop-blur-md" />
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700">
                  Signature
                </span>
              </div>
              <div className="flex flex-col gap-4 text-slate-800">
                <p className="text-base font-medium leading-relaxed">
                  {description}
                </p>
                <div className="flex flex-col gap-2 text-sm">
                  {featureList.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-slate-700"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/70 text-xs font-semibold text-slate-600 shadow backdrop-blur">
                        {index + 1}
                      </span>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              className="relative mt-auto w-fit rounded-full bg-white/85 px-6 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-800 shadow-[0_12px_35px_rgba(15,23,42,0.22)] transition hover:bg-white"
              style={{ color: palette.accent }}
            >
              {cta}
            </button>
          </div>
        </div>
      );
    }

    if (layout === "angled") {
      return (
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.25rem] border border-white/30 bg-white/65 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <span
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{ background: palette.gradient }}
          />
          <span
            className="pointer-events-none absolute inset-0 mix-blend-screen opacity-90"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.75) 0, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 70%)",
            }}
          />
          <div className="relative flex h-full flex-col gap-6 text-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-700">
                  Limited Edition
                </span>
                <h2 className="text-3xl font-semibold leading-tight text-slate-900">
                  {productName}
                </h2>
              </div>
              <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-white/40 bg-white/70 shadow-[0_12px_30px_rgba(15,23,42,0.22)]">
                <span
                  className="absolute inset-0"
                  style={{
                    background: `conic-gradient(from 90deg at 50% 50%, ${alphaColor(
                      palette.accent,
                      0.25
                    )}, transparent 60%)`,
                  }}
                />
                <span className="absolute inset-5 rounded-xl border border-white/60 bg-white/95 shadow-inner" />
              </div>
            </div>
            <p className="max-w-md text-base font-medium leading-relaxed text-slate-800">
              {description}
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {featureList.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/40 bg-white/75 p-4 shadow-[0_10px_25px_rgba(15,23,42,0.18)]"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    Highlight {index + 1}
                  </span>
                  <p className="mt-2 text-sm font-medium text-slate-800">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between rounded-[1.75rem] border border-white/40 bg-white/70 p-4 shadow-[0_12px_26px_rgba(15,23,42,0.2)]">
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
                  Exclusive Offer
                </span>
                <span className="text-base font-semibold text-slate-900">
                  {tagline}
                </span>
              </div>
              <button
                className="rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] shadow-[0_10px_25px_rgba(15,23,42,0.22)] transition hover:shadow-[0_12px_28px_rgba(15,23,42,0.28)]"
                style={{
                  background: palette.text,
                  color: paletteId === "nebula" ? "#0f172a" : "#ffffff",
                }}
              >
                {cta}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[2.75rem] border border-white/35 bg-white/70 p-5 text-slate-900 shadow-[0_16px_38px_rgba(15,23,42,0.28)] backdrop-blur-2xl">
        <span
          className="pointer-events-none absolute inset-0 opacity-95"
          style={{ background: palette.gradient }}
        />
        <div className="relative flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                {tagline}
              </span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900">
                {productName}
              </h2>
            </div>
            <div className="relative h-16 w-16 overflow-hidden rounded-[1.5rem] border border-white/40 bg-white/80 shadow-[0_12px_28px_rgba(15,23,42,0.22)]">
              <span
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${alphaColor(
                    palette.accent,
                    0.2
                  )}, transparent 70%)`,
                }}
              />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-800">{description}</p>
          <div className="flex flex-col gap-2">
            {featureList.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_25px_rgba(15,23,42,0.18)]"
              >
                <span
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  style={{
                    background: alphaColor(palette.accent, 0.9),
                    color: palette.text,
                  }}
                >
                  0{index + 1}
                </span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative mt-6 flex items-center justify-between rounded-[2rem] border border-white/35 bg-white/80 px-6 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.22)]">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
              Featured Formula
            </span>
            <span className="text-sm font-semibold text-slate-900">
              {featureList[0] ?? "Uncompromised quality in every drop."}
            </span>
          </div>
          <button
            className="rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition hover:-translate-y-0.5"
            style={{ background: palette.accent, color: palette.text }}
          >
            {cta}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Product Image Studio</title>
        <meta
          name="description"
          content="Generate stunning, ready-to-share product spotlight images in seconds."
        />
      </Head>
      <div
        className={`${geistSans.className} ${geistMono.className} flex min-h-screen w-full justify-center bg-slate-950/95 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.22),transparent_70%)] py-16 text-slate-900`}
      >
        <div className="flex w-full max-w-6xl flex-col gap-10 rounded-[3rem] border border-white/10 bg-white/80 p-10 shadow-[0_25px_60px_rgba(15,23,42,0.45)] backdrop-blur-3xl lg:flex-row lg:gap-12">
          <section className="w-full max-w-sm flex-1 space-y-8">
            <header className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight text-slate-900">
                Product Image Studio
              </h1>
              <p className="text-sm font-medium text-slate-600">
                Craft bold, editorial-ready visuals. Tweak copy, mood, and
                palette to match your launch moment, then export as crisp PNGs.
              </p>
            </header>

            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="product-name"
                  className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
                >
                  Product Name
                </label>
                <input
                  id="product-name"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="tagline"
                  className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
                >
                  Tagline
                </label>
                <input
                  id="tagline"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  value={tagline}
                  onChange={(event) => setTagline(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
                >
                  Product Story
                </label>
                <textarea
                  id="description"
                  className="h-28 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="cta"
                  className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
                >
                  Call to Action
                </label>
                <input
                  id="cta"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-800 shadow-inner shadow-white/40 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  value={cta}
                  onChange={(event) => setCta(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                Signature Highlights
              </span>
              <div className="space-y-3">
                {featureInputs.map((feature, index) => (
                  <input
                    key={index}
                    value={feature}
                    onChange={(event) =>
                      handleFeatureChange(index, event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/40 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder={`Feature ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                Palette Mood
              </span>
              <div className="grid grid-cols-2 gap-3">
                {palettes.map((option) => (
                  <label
                    key={option.id}
                    className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
                  >
                    <input
                      type="radio"
                      value={option.id}
                      checked={paletteId === option.id}
                      onChange={handlePaletteChange}
                      className="sr-only"
                    />
                    <span
                      className="absolute inset-0 opacity-90 transition group-hover:opacity-100"
                      style={{ background: option.gradient }}
                    />
                    <span className="relative flex h-20 items-center justify-center rounded-2xl border border-white/40 bg-white/40 text-sm font-semibold text-slate-900 shadow-inner backdrop-blur">
                      {option.name}
                    </span>
                    {paletteId === option.id && (
                      <span className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold uppercase tracking-[0.2em] text-slate-800 shadow">
                        ✓
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Preview Gallery
              </h2>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-600">
                Tap export for instant PNGs
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {layoutOrder.map((layout) => (
                <article
                  key={layout}
                  className="group relative flex min-h-[420px] flex-col gap-4 rounded-[2.75rem] border border-slate-200/60 bg-white/70 p-4 shadow-[0_16px_38px_rgba(15,23,42,0.18)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.24)]"
                >
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                      {layout === "spotlight"
                        ? "Editorial Spotlight"
                        : layout === "angled"
                          ? "Launch Story"
                          : "Compact Banner"}
                    </span>
                    <button
                      onClick={() => handleDownload(layout)}
                      className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-700 shadow transition hover:bg-white"
                    >
                      Export PNG
                    </button>
                  </div>
                  <div
                    ref={(node) => {
                      cardRefs.current[layout] = node;
                    }}
                    className="flex h-[360px] w-full flex-1 overflow-hidden rounded-[2.25rem] bg-white/60 p-4 shadow-inner"
                  >
                    {renderCard(layout)}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
