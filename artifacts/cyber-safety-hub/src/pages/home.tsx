import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, BookOpen, ChevronRight, CheckCircle2, Lock, Users, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { icon: Users,         value: "142K+", label: "Citizens Trained",           color: "text-primary" },
  { icon: AlertTriangle, value: "8.5K",  label: "Scams Reported",             color: "text-destructive" },
  { icon: Lock,          value: "₹12M+", label: "Potential Losses Prevented", color: "text-green-500" },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Interactive Modules",
    desc: "Bite-sized lessons on phishing, OTP frauds, and social engineering — tailored to the Indian context.",
    points: ["Recognize red flags instantly", "Understand scammer psychology", "Secure your digital identity"],
    href: "/learn",
    cta: "Explore Modules",
  },
  {
    icon: Shield,
    title: "Live Scam Trainer",
    desc: "Test your instincts against simulated scam messages, emails, and calls in a safe environment.",
    points: ["Simulated WhatsApp/SMS scams", "Instant feedback & explanations", "Progress tracking & badges"],
    href: "/trainer",
    cta: "Try the Trainer",
  },
  {
    icon: Zap,
    title: "Threat Dashboard",
    desc: "Track emerging scam trends in your region and stay one step ahead with live community data.",
    points: ["Real-time scam trend charts", "XP & achievement system", "Personalized safety tips"],
    href: "/dashboard",
    cta: "Open Dashboard",
  },
];

export default function Home() {
  return (
    <div className="w-full flex-1 bg-background">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        {/* Animated background iframe */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <iframe
            src="/cyber-surakshit-video/"
            title="Cyber Shield Animation"
            className="w-full h-full border-0"
            style={{ display: "block" }}
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

        {/* Gradient vignette — clear center, dark edges */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.82) 100%)"
          }}
        />

        {/* ── TOP — title ── */}
        <motion.div
          className="relative z-20 w-full pt-24 md:pt-28 text-center px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Glass pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 text-primary border border-primary/30"
            style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
          >
            <Shield className="w-3.5 h-3.5" />
            National Cyber Awareness Initiative
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-none drop-shadow-2xl">
            <span className="text-white">Think Before</span>
            <br />
            <span className="text-white">You </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-300 to-primary dark:from-primary dark:to-amber-300">
              Click
            </span>
          </h1>
        </motion.div>

        {/* ── MIDDLE — free space, animation shows through ── */}
        <div className="flex-1 min-h-[200px]" />

        {/* ── BOTTOM — description + glass CTA bar ── */}
        <motion.div
          className="relative z-20 w-full pb-10 px-6 flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-lg md:text-xl text-white/75 max-w-xl text-center leading-relaxed">
            Empowering Indian families to recognize, resist, and report digital threats.
          </p>

          {/* Glass CTA strip */}
          <div
            className="flex flex-col sm:flex-row items-center gap-3 px-6 py-4 rounded-2xl"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Link href="/learn">
              <Button size="lg" className="h-12 px-7 text-base font-semibold rounded-xl shadow-lg group">
                Start Learning
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/report">
              <Button size="lg" variant="ghost" className="h-12 px-7 text-base font-semibold rounded-xl text-white/85 hover:text-white hover:bg-white/10">
                Report a Scam
                <AlertTriangle className="ml-2 w-4 h-4 text-destructive" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Bottom page blend */}
        <div className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── STATS — floating glass strip ── */}
      <div className="relative z-10 -mt-6 px-6 pb-8">
        <motion.div
          className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-2xl overflow-hidden"
          style={{ background: "rgba(10,10,10,0.6)", backdropFilter: "blur(32px)", border: "1px solid rgba(255,255,255,0.08)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {STATS.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="flex items-center gap-4 px-8 py-5">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-white/50 font-medium">{label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── FEATURES ── */}
      <div className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14 mt-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4 border border-primary/20">
              What you get
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Your Defense Arsenal</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Master the tools and knowledge needed to protect yourself and your family.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, points, href, cta }, i) => (
              <motion.div
                key={title}
                className="group relative rounded-3xl p-7 flex flex-col overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Glow accent */}
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{desc}</p>

                <ul className="space-y-2 mb-7 flex-1">
                  {points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>

                <Link href={href}>
                  <Button variant="outline" className="w-full rounded-xl font-semibold group/btn">
                    {cta}
                    <ChevronRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
