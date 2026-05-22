"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "DJI Drones",
    subtitle: "Professional Grade Aerial Photography",
    description: "Explore the latest DJI drones with cutting-edge technology",
    cta: "Shop DJI",
    link: "/products?category=dji",
    gradient: "from-blue-900 via-blue-700 to-cyan-500",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=80",
  },
  {
    title: "Beginner Drones",
    subtitle: "Start Your Flying Journey",
    description: "Affordable and easy-to-fly drones for beginners",
    cta: "Shop Now",
    link: "/products?category=beginner-drone",
    gradient: "from-emerald-900 via-emerald-600 to-teal-500",
    image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=1200&q=80",
  },
  {
    title: "Professional Drones",
    subtitle: "Cinematic Quality from Above",
    description: "High-end drones for professional filmmakers and surveyors",
    cta: "Explore",
    link: "/products?category=professional-drone",
    gradient: "from-purple-900 via-purple-700 to-pink-500",
    image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=1200&q=80",
  },
];

export function HomeHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden">
      <div className={`relative flex h-[500px] md:h-[600px] items-center bg-gradient-to-r ${slide.gradient}`}>
        <div className="absolute inset-0 bg-black/30" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-lg">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-blue-200">
              {slide.subtitle}
            </p>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
              {slide.title}
            </h1>
            <p className="mb-8 text-lg text-gray-200">
              {slide.description}
            </p>
            <div className="flex gap-3">
              <Link href={slide.link}>
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  {slide.cta}
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                  View All
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur hover:bg-white/30"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur hover:bg-white/30"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
