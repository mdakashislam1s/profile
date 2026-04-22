"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Brain, Activity, 
  Layers, Zap, Eye, HeartPulse, Network, Award,
  Maximize, Minimize, Play, Pause
} from "lucide-react";

const slides = [
  {
    title: "কেন্দ্রীয় স্নায়ুতন্ত্রের গঠন ও কার্যাবলি",
    subtitle: "উপস্থাপনায়: আপনার নাম | বিভাগ: মনোবিজ্ঞান",
    content: ["জাতীয় বিশ্ববিদ্যালয় (অনার্স ১ম বর্ষ)", "কোর্স: মনোবিজ্ঞানের পরিচিতি"],
    icon: <Brain className="w-20 h-20 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />,
    gradient: "from-slate-900 via-indigo-950 to-slate-900"
  },
  {
    title: "কেন্দ্রীয় স্নায়ুতন্ত্র (CNS) কী?",
    content: [
      "দেহের কেন্দ্রীয় নিয়ন্ত্রণ কেন্দ্র যা চারপাশ থেকে তথ্য গ্রহণ ও বিশ্লেষণ করে।",
      "মস্তিষ্ক (Brain): শরীরের প্রধান প্রসেসর।",
      "সুষুম্নাকাণ্ড (Spinal Cord): মস্তিষ্ক ও দেহের সংযোগকারী মহাসড়ক।"
    ],
    icon: <Activity className="w-16 h-16 text-emerald-400" />,
    gradient: "from-gray-900 via-emerald-950 to-gray-900"
  },
  {
    title: "মস্তিষ্কের প্রধান তিন ভাগ",
    content: [
      "১. অগ্রমস্তিষ্ক (Forebrain): উচ্চতর চিন্তন, স্মৃতি ও বুদ্ধি।",
      "২. মধ্যমস্তিষ্ক (Midbrain): সংবেদী উদ্দীপনার সমন্বয়।",
      "৩. পশ্চাৎমস্তিষ্ক (Hindbrain): বেঁচে থাকার মৌলিক কাজ।"
    ],
    icon: <Layers className="w-16 h-16 text-purple-400" />,
    gradient: "from-indigo-950 via-purple-950 to-slate-950"
  },
  {
    title: "অগ্রমস্তিষ্ক ও মনোবিজ্ঞান",
    content: [
      "সেরিব্রাম: স্মৃতি, বুদ্ধি, চিন্তা ও ঐচ্ছিক কাজ নিয়ন্ত্রণ করে।",
      "থ্যালামাস: সংবেদী সংকেতের 'প্রবেশদ্বার' বা রিলে স্টেশন।",
      "হাইপোথ্যালামাস: আবেগ, প্রেষণা (Motivation), ক্ষুধা ও তৃষ্ণা নিয়ন্ত্রণ।"
    ],
    icon: <Zap className="w-16 h-16 text-yellow-400" />,
    gradient: "from-slate-900 via-orange-950 to-slate-900"
  },
  {
    title: "সেরিব্রাল কর্টেক্সের ৪টি লোব",
    content: [
      "১. ফ্রন্টাল লোব: সিদ্ধান্ত গ্রহণ, ব্যক্তিত্ব ও পরিকল্পনা।",
      "২. প্যারাইটাল লোব: স্পর্শ, চাপ ও সংবেদন।",
      "৩. টেম্পোরাল লোব: শ্রবণ, ভাষা ও মেমরি প্রসেসিং।",
      "৪. অক্সিপিটাল লোব: ভিজ্যুয়াল প্রসেসিং বা দৃষ্টিশক্তি।"
    ],
    icon: <Eye className="w-16 h-16 text-cyan-400" />,
    gradient: "from-blue-950 via-cyan-950 to-gray-900"
  },
  {
    title: "লিম্বিক সিস্টেম: আবেগের কেন্দ্র",
    content: [
      "অ্যামিগডালা: ভয়, রাগ এবং আগ্রাসনের অনুভূতি নিয়ন্ত্রণ করে।",
      "হিপ্পোক্যাম্পাস: নতুন তথ্যকে দীর্ঘমেয়াদী স্মৃতিতে রূপান্তর করে।",
      "মনস্তাত্ত্বিক দিক: ট্রমা বা ফোবিয়া সৃষ্টিতে এর ভূমিকা সরাসরি।"
    ],
    icon: <HeartPulse className="w-16 h-16 text-rose-400" />,
    gradient: "from-gray-900 via-rose-950 to-black"
  },
  {
    title: "সুষুম্নাকাণ্ড (Spinal Cord)",
    content: [
      "মস্তিষ্কের নির্দেশ ছাড়াই তাৎক্ষণিক 'প্রতিবর্ত ক্রিয়া' (Reflex Action) ঘটায়।",
      "মস্তিষ্ক ও শরীরের অন্যান্য অংশের মধ্যে সেন্সরি ও মোটর সিগন্যাল আদান-প্রদান করে।"
    ],
    icon: <Network className="w-16 h-16 text-teal-400" />,
    gradient: "from-slate-900 via-teal-950 to-slate-900"
  },
  {
    title: "মনোবিজ্ঞানে CNS-এর গুরুত্ব",
    content: [
      "আচরণের জীববিজ্ঞান: মানুষের প্রতিটি আচরণের মূলে স্নায়বিক পরিবর্তন থাকে।",
      "মানসিক ব্যাধি: নিউরোট্রান্সমিটারের তারতম্যে ডিপ্রেশন বা সিজোফ্রেনিয়া হয়।",
      "ব্যক্তিত্ব গঠন: মস্তিষ্কের গঠনমূলক অখণ্ডতা আমাদের পরিচয় নির্ধারণ করে।"
    ],
    icon: <Brain className="w-16 h-16 text-pink-400" />,
    gradient: "from-fuchsia-950 via-pink-950 to-gray-900"
  },
  {
    title: "ধন্যবাদ",
    subtitle: "আপনাদের মূল্যবান সময়ের জন্য অসংখ্য ধন্যবাদ!",
    content: ["কারো কোনো প্রশ্ন থাকলে করতে পারেন।"],
    icon: <Award className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />,
    gradient: "from-slate-900 via-blue-950 to-slate-900"
  }
];

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Mouse Parallax Effect (3D Tilt)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const nextSlide = useCallback(() => {
    if (current < slides.length - 1) {
      setDirection(1);
      setCurrent(prev => prev + 1);
    } else if (isAutoPlay) {
      setIsAutoPlay(false);
    }
  }, [current, isAutoPlay]);

  const prevSlide = useCallback(() => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(prev => prev - 1);
    }
  }, [current]);

  // Fullscreen Toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // AutoPlay Logic
  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000); // 5 seconds per slide
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, nextSlide]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "f") toggleFullScreen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, toggleFullScreen]);

  const currentSlide = slides[current];

  return (
    <div 
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${currentSlide.gradient} transition-colors duration-1000 ease-in-out font-sans`}
    >
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -60, 0],
          y: [0, 60, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${((current + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.6, ease: "circOut" }}
        />
      </div>

      <div className="absolute top-6 right-8 flex gap-4 z-50">
        <button 
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={`p-3 rounded-full backdrop-blur-md border transition-all ${isAutoPlay ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
          title="Auto Play (5s)"
        >
          {isAutoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button 
          onClick={toggleFullScreen}
          className="p-3 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md hover:bg-white/20 transition-all"
          title="Toggle Fullscreen (F)"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>

      <div 
        className="container max-w-5xl px-4 relative h-[600px] perspective-[1500px] z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, x: direction > 0 ? 500 : -500, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction < 0 ? 500 : -500, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute inset-0 w-full h-full flex flex-col justify-center p-12 md:p-20 rounded-[2.5rem] text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 bg-white/10 backdrop-blur-2xl"
          >
            <motion.div 
              style={{ translateZ: 50 }}
              className="mb-8 flex justify-center md:justify-start"
            >
              {currentSlide.icon}
            </motion.div>
            
            <motion.h1 
              style={{ translateZ: 60 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-md"
            >
              {currentSlide.title}
            </motion.h1>
            
            {currentSlide.subtitle && (
              <motion.p 
                style={{ translateZ: 40 }}
                className="text-xl md:text-2xl mb-8 text-blue-200 font-medium"
              >
                {currentSlide.subtitle}
              </motion.p>
            )}

            <ul className="space-y-6" style={{ translateZ: 30 }}>
              {currentSlide.content.map((item, index) => (
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                  key={index} 
                  className="text-lg md:text-xl lg:text-2xl text-gray-100 flex items-start group"
                >
                  <span className="mr-5 mt-2.5 h-3 w-3 rounded-full bg-blue-400 flex-shrink-0 shadow-[0_0_12px_rgba(96,165,250,0.8)] group-hover:scale-150 transition-transform" />
                  <span className="leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 flex gap-8 items-center z-50">
        <button 
          onClick={prevSlide}
          disabled={current === 0}
          className="p-5 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-2xl hover:bg-white/20 hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        
        <div className="flex gap-3 px-6 py-4 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                idx === current ? "w-10 bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" : "w-2.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          disabled={current === slides.length - 1}
          className="p-5 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-2xl hover:bg-white/20 hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
