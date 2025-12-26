"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaStar, FaUserFriends, FaMapMarkerAlt } from "react-icons/fa";

const iconByKey = {
  reviews: FaStar,
  travelers: FaUserFriends,
  destinations: FaMapMarkerAlt,
};

const defaultStats = [
  { key: "reviews", label: "Reviews", value: "1600+" },
  { key: "travelers", label: "Satisfied Travelers", value: "10000+" },
  { key: "destinations", label: "Destinations", value: "50+" },
];

const fallbackSlides = [
  {
    key: "discover-india",
    title: "THAILAND",
    description: "",
    background: "/assets/hero/fallback/bg1.jpg",
    cards: [
      "/assets/hero/fallback/c1.jpg",
      "/assets/hero/fallback/c2.jpg",
      "/assets/hero/fallback/c3.png",
    ],
    stats: { reviews: "1600+", travelers: "10000+", destinations: "50+" },
  },
];

const convertStatsToArray = (statsObj) => {
  if (!statsObj || typeof statsObj !== "object") return defaultStats;
  return [
    { key: "reviews", label: "Reviews", value: statsObj.reviews || "1600+" },
    {
      key: "travelers",
      label: "Satisfied Travelers",
      value: statsObj.travelers || "5000+",
    },
    {
      key: "destinations",
      label: "Destinations",
      value: statsObj.destinations || "50+",
    },
  ];
};

export default function NewHeroSectionDemo() {
  const hero_slides = useSelector((state) => state.global.hero_slides) || [];

  // 2) Use backend slides if present; otherwise use fallbacks
  const slides = useMemo(() => {
    const source =
      Array.isArray(hero_slides) && hero_slides.length > 0
        ? hero_slides
        : fallbackSlides;
    return source.map((slide) => ({
      key: slide.key || slide.title?.toLowerCase().replace(/\s+/g, "-") || "",
      title: slide.title || "",
      description: slide.description || "",
      background: slide.background,
      cards: Array.isArray(slide.cards) ? slide.cards.slice(0, 3) : [],
      stats: convertStatsToArray(slide.stats),
    }));
  }, [hero_slides]);

  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const active = slides[index] || slides[0];

  useEffect(() => {
    if (!slides.length) return;
    timerRef.current = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5000
    );
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  if (!active) return null;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {active.background ? (
          <Image
            src={active.background}
            alt={`${active.title || "Hero"} background`}
            fill
            priority
            className="object-cover scale-105 blur-[3px]"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/25" />
      </div>

      {/* Main content */}
      <div className="mx-auto flex w/full max-w-7xl items-center justify-between gap-6 px-4 pt-12 pb-2 md:gap-8 md:pt-24 md:pb-6">
        {/* Left */}
        <div className="relative w-9/12 text-white md:w-auto md:flex-1">
          {/* Desktop vertical timeline */}
          <div className="absolute -left-6 top-0 hidden md:flex md:flex-col md:items-center">
            <div className="relative h-[30vh] w-[2px] bg-white/20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
                    i === index
                      ? "h-4 w-4 bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.25)]"
                      : "h-2 w-2 bg-white/60"
                  }`}
                  style={{
                    top: `${(i / Math.max(1, slides.length - 1)) * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Titles */}
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-white md:hidden">
            {active.title}
          </h1>
          <h1 className="mb-4 hidden text-5xl font-semibold tracking-tight md:block md:text-6xl text-white">
            {active.title}
          </h1>

          {/* Description */}
          <p className="max-w-xl text-[14px] leading-5 text-white md:text-[15px]">
            {active.description}
          </p>

          {/* Mobile dots */}
          <div className="mt-3 flex items-center gap-2 md:hidden">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition ${
                  i === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: desktop cards */}
        <div className="relative ml-auto mr-[-16px] hidden w-full md:block md:w-auto">
          <div className="ml-auto flex w-[748px] max-w-full overflow-visible md:w-[764px]">
            <div className="flex items-end gap-6 md:gap-8">
              {(active.cards || []).map((src, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-[28px] shadow-2xl transition-all ${
                    i === 0
                      ? "h-[420px] w-[260px]"
                      : "h-[360px] w-[220px] opacity-90"
                  }`}
                >
                  {src ? (
                    <Image
                      src={src}
                      alt={`${active.title || "Slide"} card ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="260px"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: single card */}
        <div className="relative w-full flex justify-end md:hidden mt-4">
          {active.cards?.[0] ? (
            <div className=" relative h-[260px] w-[100%] overflow-hidden rounded-[22px] shadow-2xl ">
              <Image
                src={active.cards[0]}
                alt={`${active.title || "Slide"} card`}
                fill
                className="object-cover"
                sizes="300vw"
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Stats */}
      <div className="w-full px-4 pb-6 mt-6 md:mt-10 md:pb-8">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-3 gap-3 text-white md:gap-8">
          {(active.stats || defaultStats).map((s, index) => {
            const Icon = iconByKey[s.key] ?? FaStar;

            let positionClass = "";
            if (index === 0) positionClass = "justify-start";
            else if (index === 1) positionClass = "justify-center";
            else positionClass = "justify-end";

            return (
              <div
                key={s.key}
                className={`flex items-center gap-2 whitespace-nowrap ${positionClass} md:gap-10`}
              >
                <Icon className="hidden h-5 w-5 opacity-90 md:block md:h-7 md:w-7" />
                <div className="leading-tight">
                  <div className="text-xl font-bold md:text-5xl">{s.value}</div>
                  <div className="text-[10px] text-white/90 md:text-base">
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
