import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, AlertCircle, CheckCircle2, Info, RefreshCcw, Send, User, 
  ChevronRight, Gamepad2, Timer, Trophy, XCircle, ArrowLeft, ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

type Scenario = {
  id: number;
  type: "sms" | "email";
  sender: string;
  subject?: string;
  content: { text: string; isSus: boolean; explanation?: string }[];
  hint: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    type: "sms",
    sender: "BZ-HDFCBK",
    content: [
      { text: "Dear Customer, ", isSus: false },
      { text: "Your bank account has been blocked due to suspicious activity. ", isSus: true, explanation: "Banks don't usually send urgent blocking messages via SMS without prior notice." },
      { text: "Please verify your KYC immediately by clicking here: ", isSus: false },
      { text: "http://kyc-update-hdfc.info/login ", isSus: true, explanation: "Fake URL. Official bank URLs do not use generic domains like .info or complex hyphenated names." },
      { text: "Regards, HDFC Bank.", isSus: false }
    ],
    hint: "Look for urgency and suspicious links."
  }
];

/* ─── WHACK-A-SCAM GAME DATA ─── */
type Target = { id: number; x: number; y: number; isScam: boolean; text: string; };
const WHACK_TEXTS = {
  scam: ["WINNER!", "OTP needed", "Account BLOCKED", "Update KYC", "FREE iPhone", "Urgent!", "Pay ₹500"],
  safe: ["Hello", "Meeting at 5", "OTP: 1234", "Milk bought", "How are you?", "Bill paid", "See you"]
};

/* ─── SWIPE GAME DATA ─── */
type SwipeCard = { id: number; text: string; isScam: boolean; reason: string; };
const SWIPE_CARDS: SwipeCard[] = [
  { id: 1, text: "Your Netflix subscription has expired. Click here to update: netflx-renew.com", isScam: true, reason: "Spelling error in URL ('netflx')" },
  { id: 2, text: "OTP for your ₹2000 transaction at Amazon is 556677. Do not share.", isScam: false, reason: "Legitimate transactional SMS" },
  { id: 3, text: "URGENT: Your Electricity will be cut tonight at 9PM. Call 9876543210 immediately.", isScam: true, reason: "Urgency and unofficial phone number contact" },
  { id: 4, text: "Hi Mom, I lost my phone. This is my new number. Can you send ₹5000 for a repair?", isScam: true, reason: "Common 'Impersonation' scam" },
  { id: 5, text: "Meeting moved to 4 PM in the Conference Room B.", isScam: false, reason: "Normal work communication" },
  { id: 6, text: "Congrats! You won a ₹50,000 lottery. Click to claim: win-big-today.tk", isScam: true, reason: "Too good to be true and suspicious TLD" }
];

export default function Trainer() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"menu" | "trainer" | "whacker" | "swiper">("menu");
  
  /* Trainer State */
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [revealedSus, setRevealedSus] = useState<number[]>([]);
  const [trainerScore, setTrainerScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  /* Whacker State */
  const [whackScore, setWhackScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [gameActive, setGameActive] = useState(false);

  /* Swiper State */
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [swipeScore, setSwipeScore] = useState(0);
  const [lastResult, setLastResult] = useState<{ correct: boolean, reason: string } | null>(null);

  /* Whacker Logic */
  const spawnTarget = useCallback(() => {
    const isScam = Math.random() > 0.4;
    const pool = isScam ? WHACK_TEXTS.scam : WHACK_TEXTS.safe;
    const newTarget: Target = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      isScam,
      text: pool[Math.floor(Math.random() * pool.length)]
    };
    setTargets(prev => [...prev, newTarget]);
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id));
    }, 2000);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let spawn: NodeJS.Timeout;
    if (mode === "whacker" && gameActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      spawn = setInterval(spawnTarget, 800);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
    return () => {
      clearInterval(timer);
      clearInterval(spawn);
    };
  }, [mode, gameActive, timeLeft, spawnTarget]);

  const handleWhack = (target: Target) => {
    if (target.isScam) {
      setWhackScore(prev => prev + 10);
    } else {
      setWhackScore(prev => Math.max(0, prev - 20));
    }
    setTargets(prev => prev.filter(t => t.id !== target.id));
  };

  /* Swiper Logic */
  const handleSwipe = (choice: boolean) => {
    const current = SWIPE_CARDS[swipeIndex];
    const isCorrect = choice === current.isScam;
    if (isCorrect) setSwipeScore(s => s + 20);
    setLastResult({ correct: isCorrect, reason: current.reason });
    
    setTimeout(() => {
      setLastResult(null);
      if (swipeIndex < SWIPE_CARDS.length - 1) {
        setSwipeIndex(i => i + 1);
      } else {
        setSwipeIndex(0); // Loop or end
      }
    }, 2000);
  };

  /* Trainer Logic */
  const scenario = SCENARIOS[currentScenarioIndex];
  const totalSusInScenario = scenario.content.filter(c => c.isSus).length;

  const handleSegmentClick = (index: number, isSus: boolean) => {
    if (revealedSus.includes(index) || showResult) return;
    setRevealedSus([...revealedSus, index]);
    if (isSus) {
      setTrainerScore(s => s + 10);
    } else {
      setTrainerScore(s => Math.max(0, s - 5));
    }
  };

  const handleNext = () => {
    if (currentScenarioIndex < SCENARIOS.length - 1) {
      setCurrentScenarioIndex(i => i + 1);
      setRevealedSus([]);
      setShowResult(false);
    } else {
      setMode("menu");
    }
  };

  const allFound = scenario.content.map((c, i) => c.isSus ? i : -1).filter(i => i !== -1).every(i => revealedSus.includes(i));

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl min-h-[80vh] flex flex-col">
      <div className="mb-4">
        <BackButton />
      </div>

      <AnimatePresence mode="wait">
        {mode === "menu" && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-10"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-[2.5rem] flex items-center justify-center border border-white/20 shadow-2xl">
                <Gamepad2 className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-black mb-4 tracking-tighter">Learning Games</h1>
            <p className="text-muted-foreground text-lg max-w-md mb-12">
              Fun, bite-sized games to help you spot digital dangers instantly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {/* Game 1: Trainer */}
              <Card className="group hover:border-primary/50 transition-all cursor-pointer bg-card/50 backdrop-blur-md border-border/50" onClick={() => setMode("trainer")}>
                <CardContent className="p-8 text-center flex flex-col items-center">
                  <Shield className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-black mb-2 uppercase tracking-wide">Awareness</h3>
                  <p className="text-xs text-muted-foreground mb-6">Analyze deep threats in messages.</p>
                  <Button variant="outline" className="w-full rounded-xl font-bold">Launch</Button>
                </CardContent>
              </Card>

              {/* Game 2: Swiper */}
              <Card className="group hover:border-blue-500/50 transition-all cursor-pointer bg-card/50 backdrop-blur-md border-border/50" onClick={() => { setMode("swiper"); setSwipeIndex(0); setSwipeScore(0); }}>
                <CardContent className="p-8 text-center flex flex-col items-center">
                  <RefreshCcw className="w-10 h-10 text-blue-500 mb-4 group-hover:rotate-180 transition-transform duration-500" />
                  <h3 className="text-lg font-black mb-2 uppercase tracking-wide">Scam or Not</h3>
                  <p className="text-xs text-muted-foreground mb-6">Quick decision swiping game.</p>
                  <Button variant="outline" className="w-full rounded-xl font-bold">Play</Button>
                </CardContent>
              </Card>

              {/* Game 3: Whacker */}
              <Card className="group hover:border-destructive/50 transition-all cursor-pointer bg-card/50 backdrop-blur-md border-border/50" onClick={() => { setMode("whacker"); setWhackScore(0); setTimeLeft(30); setGameActive(false); }}>
                <CardContent className="p-8 text-center flex flex-col items-center">
                  <AlertCircle className="w-10 h-10 text-destructive mb-4 group-hover:animate-bounce" />
                  <h3 className="text-lg font-black mb-2 uppercase tracking-wide">Whack-a-Scam</h3>
                  <p className="text-xs text-muted-foreground mb-6">Action-packed reflex test.</p>
                  <Button variant="outline" className="w-full rounded-xl font-bold">Start</Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {mode === "swiper" && (
          <motion.div 
            key="swiper"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full"
          >
            <div className="w-full flex justify-between items-center mb-10">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Score</p>
                <p className="text-2xl font-black text-primary">{swipeScore}</p>
              </div>
              <Button variant="ghost" onClick={() => setMode("menu")} className="rounded-full">Exit</Button>
            </div>

            <div className="relative w-full aspect-[3/4] mb-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={swipeIndex}
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 1.1, opacity: 0, x: lastResult ? (lastResult.correct ? 200 : -200) : 0 }}
                  className="absolute inset-0 bg-card border-2 border-border rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-2xl shadow-primary/10"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                    <Send className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-xl font-bold leading-relaxed tracking-tight">
                    "{SWIPE_CARDS[swipeIndex].text}"
                  </p>
                  
                  {lastResult && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`mt-10 p-4 rounded-2xl border ${lastResult.correct ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-destructive/10 border-destructive/30 text-destructive'}`}
                    >
                      <div className="flex items-center gap-2 font-black uppercase text-xs mb-1">
                        {lastResult.correct ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
                        {lastResult.correct ? "Correct!" : "Wrong!"}
                      </div>
                      <p className="text-[10px] font-medium leading-tight">{lastResult.reason}</p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex gap-6 w-full">
              <Button 
                variant="destructive" 
                size="lg" 
                className="flex-1 h-20 rounded-[2rem] font-black text-xl shadow-xl shadow-destructive/20 border-b-4 border-destructive/50 active:border-b-0 active:translate-y-1 transition-all"
                onClick={() => handleSwipe(true)}
                disabled={!!lastResult}
              >
                SCAM
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 h-20 rounded-[2rem] font-black text-xl shadow-xl border-b-4 border-primary/20 active:border-b-0 active:translate-y-1 transition-all border-2"
                onClick={() => handleSwipe(false)}
                disabled={!!lastResult}
              >
                SAFE
              </Button>
            </div>
            
            <p className="mt-10 text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <ArrowLeft className="w-3 h-3" /> Swipe Decision <ArrowRight className="w-3 h-3" />
            </p>
          </motion.div>
        )}

        {/* --- TRAINER & WHACKER COPIED FROM PREVIOUS VERSION --- */}
        {mode === "trainer" && (
          <motion.div key="trainer" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Awareness Trainer</h1>
                <p className="text-muted-foreground">Click on the suspicious parts of the message.</p>
              </div>
              <div className="bg-secondary/80 px-4 py-2 rounded-xl flex items-center gap-4 border border-border backdrop-blur-md">
                <div className="text-sm font-bold">
                  <span className="text-muted-foreground uppercase text-[10px] tracking-widest mr-2">Scenario</span>
                  {currentScenarioIndex + 1}/{SCENARIOS.length}
                </div>
                <div className="h-6 w-px bg-border"></div>
                <div className="text-sm font-bold">
                  <span className="text-muted-foreground uppercase text-[10px] tracking-widest mr-2">Score</span>
                  <span className="text-primary">{trainerScore} XP</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="bg-secondary/50 px-6 py-4 border-b border-border flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm tracking-tight">{scenario.sender}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Incoming Text</div>
                    </div>
                  </div>
                  <div className="p-8 bg-secondary/10 min-h-[350px] flex items-center justify-center">
                    <div className="bg-background border border-border p-6 rounded-[2rem] rounded-tl-none shadow-xl max-w-[90%] text-[16px] leading-relaxed relative">
                      {scenario.content.map((segment, idx) => {
                        const isRevealed = revealedSus.includes(idx);
                        const isMistake = isRevealed && !segment.isSus;
                        const isCorrect = isRevealed && segment.isSus;
                        return (
                          <span key={idx} onClick={() => handleSegmentClick(idx, segment.isSus)} className={`cursor-pointer transition-all duration-200 py-1 px-0.5 rounded ${!isRevealed ? 'hover:bg-primary/20' : ''} ${isCorrect ? 'bg-destructive/20 text-destructive font-black border-b-2 border-destructive' : ''} ${isMistake ? 'bg-green-500/20 text-green-500 line-through opacity-70' : ''}`}>{segment.text}</span>
                        );
                      })}
                      <div className="mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Just now</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <Card className="rounded-[2rem] border-primary/20 bg-primary/5">
                  <CardContent className="pt-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0"><Info className="w-5 h-5 text-primary" /></div>
                      <div><h3 className="font-bold text-lg mb-1 tracking-tight">Mission</h3><p className="text-sm text-muted-foreground leading-relaxed">Find all {totalSusInScenario} suspicious red flags.</p></div>
                    </div>
                  </CardContent>
                </Card>
                {allFound && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="border-green-500/30 bg-green-500/10 rounded-[2rem] shadow-2xl shadow-green-500/10"><CardContent className="p-8 text-center"><CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" /><h3 className="font-black text-2xl mb-2">Clear!</h3><Button className="w-full h-12 rounded-xl text-lg font-bold" onClick={handleNext}>Next <ChevronRight className="w-5 h-5" /></Button></CardContent></Card>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {mode === "whacker" && (
          <motion.div key="whacker" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-6">
                <div className="flex flex-col"><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Time Left</span><div className="flex items-center gap-2 text-2xl font-black tabular-nums"><Timer className={`w-6 h-6 ${timeLeft < 10 ? 'text-destructive animate-pulse' : 'text-primary'}`} />{timeLeft}s</div></div>
                <div className="flex flex-col"><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Score</span><div className="text-2xl font-black text-primary tabular-nums">{whackScore}</div></div>
              </div>
              <Button variant="outline" className="rounded-xl font-bold" onClick={() => setMode("menu")}>Exit Game</Button>
            </div>
            <div className="flex-1 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-border/50 relative overflow-hidden cursor-crosshair min-h-[500px]">
              {!gameActive && timeLeft > 0 && (
                <div className="absolute inset-0 z-10 backdrop-blur-md flex flex-col items-center justify-center bg-background/40">
                  <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter">Whack-a-Scam</h2>
                  <Button size="lg" className="h-16 px-12 rounded-2xl text-xl font-black shadow-2xl" onClick={() => setGameActive(true)}>START</Button>
                </div>
              )}
              {!gameActive && timeLeft === 0 && (
                <div className="absolute inset-0 z-10 backdrop-blur-xl flex flex-col items-center justify-center bg-background/60">
                  <Trophy className="w-20 h-20 text-yellow-500 mb-4 animate-bounce" />
                  <h2 className="text-5xl font-black mb-2">Score: {whackScore}</h2>
                  <Button size="lg" className="h-14 px-8 rounded-2xl font-bold" onClick={() => { setWhackScore(0); setTimeLeft(30); setGameActive(true); }}>Restart</Button>
                </div>
              )}
              <AnimatePresence>
                {targets.map(target => (
                  <motion.div key={target.id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => handleWhack(target)} className={`absolute w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-center p-4 cursor-pointer select-none border-2 shadow-2xl backdrop-blur-md transition-transform ${target.isScam ? 'bg-destructive/20 border-destructive text-destructive font-black' : 'bg-green-500/20 border-green-500 text-green-500 font-bold'}`} style={{ left: `${target.x}%`, top: `${target.y}%` }}>
                    <div className="text-xs md:text-sm uppercase tracking-tighter leading-tight">{target.text}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
