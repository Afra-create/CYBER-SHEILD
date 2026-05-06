import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, BookOpen, ChevronRight, CheckCircle2, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full flex-1 bg-background relative overflow-hidden">
      {/* Background Cyber Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 cyber-grid cyber-flow-anim opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20 pb-24 md:pt-32 md:pb-40">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
              <Shield className="w-4 h-4" />
              <span>National Cyber Awareness Initiative</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              <span className="text-foreground">Think Before You </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Click</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Empowering Indian families to recognize, resist, and report digital threats. Join thousands of citizens making the internet a safer place for everyone.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/learn">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 shadow-lg shadow-primary/25 group">
                  Start Learning
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/report">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-border bg-background/50 backdrop-blur">
                  Report a Scam
                  <AlertTriangle className="ml-2 w-5 h-5 text-destructive" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">142K+</div>
            <div className="text-sm text-muted-foreground">Citizens Trained</div>
          </div>
          
          <div className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">8.5K</div>
            <div className="text-sm text-muted-foreground">Scams Reported</div>
          </div>

          <div className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">₹12M+</div>
            <div className="text-sm text-muted-foreground">Potential Losses Prevented</div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Your Defense Arsenal</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Master the tools and knowledge needed to protect yourself and your family from evolving cyber threats.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors group">
              <div>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Interactive Modules</h3>
                <p className="text-muted-foreground mb-6">
                  Bite-sized, easy-to-understand lessons on phishing, OTP frauds, and social engineering. Real-world examples tailored to the Indian context.
                </p>
                <ul className="space-y-3 mb-8">
                  {["Recognize red flags instantly", "Understand scammer psychology", "Secure your digital identity"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/learn">
                <Button variant="outline" className="w-full">Explore Modules</Button>
              </Link>
            </div>

            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors group">
              <div>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Live Scam Trainer</h3>
                <p className="text-muted-foreground mb-6">
                  Practice makes perfect. Test your instincts against simulated scam messages, emails, and calls in a safe, controlled environment.
                </p>
                <ul className="space-y-3 mb-8">
                  {["Simulated WhatsApp/SMS scams", "Instant feedback & explanations", "Progress tracking & badges"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/trainer">
                <Button variant="outline" className="w-full">Try the Trainer</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
