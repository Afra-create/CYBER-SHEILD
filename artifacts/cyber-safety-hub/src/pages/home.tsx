import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Shield, AlertTriangle, BookOpen, ChevronRight,
  CheckCircle2, Lock, Users, Zap, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ease = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { icon: Users,         value: "142K+", label: "Citizens Trained",  color: "text-primary" },
  { icon: AlertTriangle, value: "8.5K",  label: "Scams Reported",    color: "text-destructive" },
  { icon: Lock,          value: "₹12M+", label: "Losses Prevented",  color: "text-green-400" },
];

const FEATURES = [
  {
    icon: BookOpen, title: "Interactive Modules",
    desc: "Bite-sized lessons on phishing, OTP frauds & social engineering — tailored to the Indian context.",
    points: ["Recognize red flags instantly", "Understand scammer psychology", "Secure your digital identity"],
    href: "/learn", cta: "Explore Modules",
  },
  {
    icon: Shield, title: "Live Scam Trainer",
    desc: "Test your instincts against simulated scam messages, emails & calls in a safe environment.",
    points: ["Simulated WhatsApp/SMS scams", "Instant feedback & explanations", "Progress tracking & badges"],
    href: "/trainer", cta: "Try the Trainer",
  },
  {
    icon: Zap, title: "Threat Dashboard",
    desc: "Track emerging scam trends in your region and stay one step ahead with live community data.",
    points: ["Real-time scam trend charts", "XP & achievement system", "Personalised safety tips"],
    href: "/dashboard", cta: "Open Dashboard",
  },
];

export default function Home() {
  return (
    <div className="w-full flex-1 bg-background">

      {/* ════════════════════════════════════
          SECTION 1 — VIDEO (pops in first)
          No text overlaid — video owns this space
      ════════════════════════════════════ */}
      <motion.section
        className="relative w-full overflow-hidden"
        style={{ height: "62vh", minHeight: 360, maxHeight: 680 }}
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
      >
        {/* Animation iframe — fills the section */}
        <iframe
          src="/cyber-surakshit-video/"
          title="Cyber Shield Animation"
          className="absolute inset-0 w-full h-full border-0"
          style={{ display: "block" }}
          tabIndex={-1}
          aria-hidden="true"
        />

        {/* Top fade — blends with navbar */}
        <div className="absolute inset-x-0 top-0 h-20 pointer-events-none z-10 bg-gradient-to-b from-background to-transparent" />

        {/* Bottom fade — blends into content section below */}
        <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-10 bg-gradient-to-t from-background to-transparent" />

        {/* Subtle side vignettes */}
        <div className="absolute inset-y-0 left-0 w-16 pointer-events-none z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-16 pointer-events-none z-10 bg-gradient-to-l from-background to-transparent" />
      </motion.section>

      {/* ════════════════════════════════════
          SECTION 2 — TEXT CONTENT (0.5s later)
          Appears below the video — zero overlap
      ════════════════════════════════════ */}
      <section className="relative px-6 pt-2 pb-8">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
          }}
        >
          {/* Pill badge */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-primary border border-primary/25 bg-primary/8"
          >
            <Shield className="w-3.5 h-3.5" />
            National Cyber Awareness Initiative
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.95] mb-6"
          >
            Think Before{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(48,100%,65%), hsl(var(--primary)))" }}
            >
              You Click
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8"
          >
            Empowering Indian families to recognize, resist, and report digital threats. Join thousands of citizens making the internet safer.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            <Link href="/learn">
              <Button size="lg" className="h-12 px-8 text-sm font-bold rounded-xl shadow-lg shadow-primary/20 group">
                Start Learning
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/report">
              <Button size="lg" variant="outline" className="h-12 px-8 text-sm font-bold rounded-xl">
                Report a Scam
                <AlertTriangle className="ml-2 w-4 h-4 text-destructive" />
              </Button>
            </Link>
          </motion.div>

          {/* Stat chips */}
          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6, ease } } }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            {STATS.map(({ icon: Icon, value, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs bg-secondary border border-border"
              >
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span className="font-bold text-foreground">{value}</span>
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════
          SECTION 3 — FEATURES
      ════════════════════════════════════ */}
      <section className="px-6 pb-32 pt-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-[0.15em] mb-5 border border-primary/20">
              What you get
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Your Defense Arsenal</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg leading-relaxed">
              Master the tools and knowledge needed to protect yourself and your family.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, points, href, cta }, i) => (
              <motion.div
                key={title}
                className="group relative rounded-[28px] p-7 flex flex-col overflow-hidden bg-card border border-border hover:border-primary/35 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/8 hover:-translate-y-1.5"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.09, ease }}
              >
                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/8 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-primary/15 transition-all duration-300 shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 tracking-tight">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-2 mb-7 flex-1">
                  {points.map(pt => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-foreground/75">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <Link href={href}>
                  <Button variant="outline" className="w-full rounded-xl font-semibold group/btn text-sm">
                    {cta}
                    <ChevronRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
