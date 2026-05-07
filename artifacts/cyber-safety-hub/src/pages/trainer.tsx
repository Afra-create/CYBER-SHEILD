import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertCircle, CheckCircle2, Info, RefreshCcw, Send, User, ChevronRight, Gamepad2, Timer, Trophy } from "lucide-react";
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
  },
  {
    id: 2,
    type: "email",
    sender: "support@amazon-rewards.com",
    subject: "You've won a new iPhone 15 Pro!",
    content: [
      { text: "Congratulations! ", isSus: false },
      { text: "You have been randomly selected to win a free iPhone 15 Pro. ", isSus: true, explanation: "Too good to be true. Random giveaways are almost always scams." },
      { text: "To claim your prize, simply pay the shipping fee of ₹499 via UPI. ", isSus: true, explanation: "Advanced fee fraud. You should never have to pay to receive a prize." },
      { text: "Click here to claim: [LINK]", isSus: false }
    ],
    hint: "If it sounds too good to be true, it probably is."
  }
];

/* ─── WHACK-A-SCAM GAME COMPONENTS ─── */

type Target = {
  id: number;
  x: number;
  y: number;
  isScam: boolean;
  text: string;
};

const WHACK_TEXTS = {
  scam: ["WINNER!", "OTP needed", "Account BLOCKED", "Update KYC", "FREE iPhone", "Urgent!", "Pay ₹500"],
  safe: ["Hello", "Meeting at 5", "OTP: 1234", "Milk bought", "How are you?", "Bill paid", "See you"]
};

export default function Trainer() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"menu" | "trainer" | "whacker">("menu");
  
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 border border-primary/20 shadow-2xl shadow-primary/10">
              <Gamepad2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-black mb-4 tracking-tight">Learning Game</h1>
            <p className="text-muted-foreground text-lg max-w-md mb-10 leading-relaxed">
              Sharpen your digital defense skills through interactive challenges and games.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              <Card className="group hover:border-primary/50 transition-all cursor-pointer bg-card/50 backdrop-blur-sm overflow-hidden" onClick={() => setMode("trainer")}>
                <CardContent className="p-8 text-left relative">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                  <Shield className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Scam Awareness Trainer</h3>
                  <p className="text-sm text-muted-foreground mb-6">Identify red flags in messages and emails from a citizen's perspective.</p>
                  <Button className="w-full gap-2 rounded-xl group-hover:scale-[1.02] transition-transform">
                    Start Training <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:border-destructive/50 transition-all cursor-pointer bg-card/50 backdrop-blur-sm overflow-hidden" onClick={() => { setMode("whacker"); setWhackScore(0); setTimeLeft(30); setGameActive(false); }}>
                <CardContent className="p-8 text-left relative">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-destructive/5 rounded-full blur-2xl group-hover:bg-destructive/10 transition-colors" />
                  <AlertCircle className="w-10 h-10 text-destructive mb-4" />
                  <h3 className="text-xl font-bold mb-2">Whack-a-Scam</h3>
                  <p className="text-sm text-muted-foreground mb-6">Quick reflexes! Tap the scams, avoid the safe messages. How many can you catch?</p>
                  <Button variant="destructive" className="w-full gap-2 rounded-xl group-hover:scale-[1.02] transition-transform">
                    Play Now <Gamepad2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {mode === "trainer" && (
          <motion.div 
            key="trainer"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1"
          >
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
                      <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                        {scenario.type === 'email' ? scenario.subject : "Incoming Text"}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-secondary/10 min-h-[350px] flex items-center justify-center">
                    <div className="bg-background border border-border p-6 rounded-[2rem] rounded-tl-none shadow-xl max-w-[90%] text-[16px] leading-relaxed relative">
                      {scenario.content.map((segment, idx) => {
                        const isRevealed = revealedSus.includes(idx);
                        const isMistake = isRevealed && !segment.isSus;
                        const isCorrect = isRevealed && segment.isSus;

                        return (
                          <span 
                            key={idx}
                            onClick={() => handleSegmentClick(idx, segment.isSus)}
                            className={`
                              cursor-pointer transition-all duration-200 py-1 px-0.5 rounded
                              ${!isRevealed ? 'hover:bg-primary/20' : ''}
                              ${isCorrect ? 'bg-destructive/20 text-destructive font-black border-b-2 border-destructive' : ''}
                              ${isMistake ? 'bg-green-500/20 text-green-500 line-through opacity-70' : ''}
                            `}
                          >
                            {segment.text}
                          </span>
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
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                        <Info className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 tracking-tight">Mission</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Find all {totalSusInScenario} suspicious red flags in this message.</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between font-bold mt-8 p-4 bg-background/50 rounded-2xl border border-border">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">Found</span>
                      <span className="text-primary text-xl">{revealedSus.filter(i => scenario.content[i].isSus).length} / {totalSusInScenario}</span>
                    </div>
                  </CardContent>
                </Card>

                <AnimatePresence>
                  {revealedSus.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      {revealedSus.map(idx => {
                        const segment = scenario.content[idx];
                        if (!segment.isSus) return null;
                        return (
                          <Card key={idx} className="border-destructive/30 bg-destructive/5 rounded-2xl">
                            <CardContent className="p-4 flex gap-3">
                              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                              <p className="text-xs font-medium leading-relaxed">{segment.explanation}</p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {allFound && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="border-green-500/30 bg-green-500/10 rounded-[2rem] shadow-2xl shadow-green-500/10">
                      <CardContent className="p-8 text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="font-black text-2xl mb-2">Scenario Clear!</h3>
                        <p className="text-sm text-muted-foreground mb-6">Perfect identification of all digital threats.</p>
                        <Button className="w-full gap-2 h-12 rounded-xl text-lg font-bold" onClick={handleNext}>
                          {currentScenarioIndex < SCENARIOS.length - 1 ? "Next Scenario" : "Return to Menu"}
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {mode === "whacker" && (
          <motion.div 
            key="whacker"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Time Left</span>
                  <div className="flex items-center gap-2 text-2xl font-black tabular-nums">
                    <Timer className={`w-6 h-6 ${timeLeft < 10 ? 'text-destructive animate-pulse' : 'text-primary'}`} />
                    {timeLeft}s
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Score</span>
                  <div className="text-2xl font-black text-primary tabular-nums">
                    {whackScore}
                  </div>
                </div>
              </div>
              <Button variant="outline" className="rounded-xl font-bold" onClick={() => setMode("menu")}>Exit Game</Button>
            </div>

            <div className="flex-1 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-border/50 relative overflow-hidden cursor-crosshair">
              {!gameActive && timeLeft > 0 && (
                <div className="absolute inset-0 z-10 backdrop-blur-md flex flex-col items-center justify-center bg-background/40">
                  <h2 className="text-4xl font-black mb-6">Whack-a-Scam</h2>
                  <p className="text-muted-foreground mb-8 text-center max-w-xs">Tap the red scam bubbles! <br/> Don't tap the green safe messages.</p>
                  <Button size="lg" className="h-16 px-12 rounded-2xl text-xl font-black shadow-2xl shadow-primary/30" onClick={() => setGameActive(true)}>
                    START GAME
                  </Button>
                </div>
              )}

              {!gameActive && timeLeft === 0 && (
                <div className="absolute inset-0 z-10 backdrop-blur-xl flex flex-col items-center justify-center bg-background/60">
                  <Trophy className="w-20 h-20 text-yellow-500 mb-4 animate-bounce" />
                  <h2 className="text-5xl font-black mb-2">Game Over!</h2>
                  <p className="text-2xl font-bold text-primary mb-8">Final Score: {whackScore}</p>
                  <div className="flex gap-4">
                    <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl font-bold" onClick={() => setMode("menu")}>Main Menu</Button>
                    <Button size="lg" className="h-14 px-8 rounded-2xl font-bold" onClick={() => { setWhackScore(0); setTimeLeft(30); setGameActive(true); }}>Try Again</Button>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {targets.map(target => (
                  <motion.div
                    key={target.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => handleWhack(target)}
                    className={`
                      absolute w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-center p-4 cursor-pointer select-none border-2 shadow-2xl
                      ${target.isScam ? 'bg-destructive/20 border-destructive text-destructive font-black' : 'bg-green-500/20 border-green-500 text-green-500 font-bold'}
                      backdrop-blur-md hover:scale-110 active:scale-95 transition-transform
                    `}
                    style={{ left: `${target.x}%`, top: `${target.y}%` }}
                  >
                    <div className="text-xs md:text-sm uppercase tracking-tighter leading-tight">
                      {target.text}
                    </div>
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
