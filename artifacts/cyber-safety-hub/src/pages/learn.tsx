import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ShieldAlert, CreditCard, Briefcase, ChevronRight, Play, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const MODULES = [
  {
    id: "phishing",
    title: "Phishing & Fake Links",
    description: "Learn how scammers trick you into revealing sensitive information through deceptive messages.",
    icon: ShieldAlert,
    difficulty: "Beginner",
    progress: 100,
    color: "bg-blue-500",
    completed: true,
  },
  {
    id: "otp",
    title: "OTP & Bank Frauds",
    description: "Understand how bank impersonators steal your money using One Time Passwords.",
    icon: CreditCard,
    difficulty: "Intermediate",
    progress: 40,
    color: "bg-orange-500",
    completed: false,
  },
  {
    id: "job",
    title: "Fake Job Scams",
    description: "Identify fraudulent work-from-home offers and foreign job placements.",
    icon: Briefcase,
    difficulty: "Intermediate",
    progress: 0,
    color: "bg-purple-500",
    completed: false,
  },
  {
    id: "social",
    title: "Social Media Impersonation",
    description: "Protect yourself from cloned accounts asking for money in emergencies.",
    icon: BookOpen,
    difficulty: "Advanced",
    progress: 0,
    color: "bg-rose-500",
    completed: false,
  }
];

export default function Learn() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const activeModule = MODULES.find(m => m.id === selectedModule);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <AnimatePresence mode="wait">
        {!selectedModule ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Learning Modules</h1>
              <p className="text-muted-foreground">Master cyber defense strategies through interactive lessons.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MODULES.map((mod) => {
                const Icon = mod.icon;
                return (
                  <Card 
                    key={mod.id} 
                    className="group cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 overflow-hidden relative"
                    onClick={() => setSelectedModule(mod.id)}
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full ${mod.color}`} />
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-secondary ${mod.completed ? 'bg-primary/10 text-primary' : ''}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <Badge variant={mod.difficulty === "Beginner" ? "default" : "secondary"}>
                          {mod.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{mod.title}</CardTitle>
                      <CardDescription className="text-base">{mod.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span>Progress</span>
                        <span>{mod.progress}%</span>
                      </div>
                      <Progress value={mod.progress} className="h-2" />
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="ghost" className="w-full justify-between">
                        {mod.completed ? "Review Module" : (mod.progress > 0 ? "Continue Learning" : "Start Module")}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => setSelectedModule(null)}
              className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Modules
            </Button>

            <div className="bg-card border border-border rounded-3xl overflow-hidden">
              <div className="bg-secondary/50 p-8 border-b border-border">
                <Badge className="mb-4">{activeModule?.difficulty}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{activeModule?.title}</h1>
                <p className="text-lg text-muted-foreground max-w-3xl">{activeModule?.description}</p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <section>
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary" />
                        The Anatomy of the Scam
                      </h3>
                      <div className="prose prose-invert max-w-none text-muted-foreground">
                        <p>Scammers create a sense of urgency or fear to make you act quickly without thinking. They might pretend to be from your bank, the police, or a trusted company.</p>
                        <p>In a typical scenario, you receive an SMS or email stating your account is blocked, or a package is delayed, and you need to click a link to resolve it immediately.</p>
                      </div>
                    </section>

                    <section className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-destructive flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Red Flags to Watch For
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm">
                          <div className="mt-0.5 bg-destructive/20 p-1 rounded text-destructive">
                            <AlertTriangle className="w-3 h-3" />
                          </div>
                          <span><strong>Urgent language:</strong> "Your account will be suspended in 24 hours"</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                          <div className="mt-0.5 bg-destructive/20 p-1 rounded text-destructive">
                            <AlertTriangle className="w-3 h-3" />
                          </div>
                          <span><strong>Suspicious URLs:</strong> e.g., <i>www.hdfc-bank-update.info</i> instead of <i>www.hdfcbank.com</i></span>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                          <div className="mt-0.5 bg-destructive/20 p-1 rounded text-destructive">
                            <AlertTriangle className="w-3 h-3" />
                          </div>
                          <span><strong>Requests for sensitive info:</strong> PINs, OTPs, or passwords</span>
                        </li>
                      </ul>
                    </section>
                  </div>

                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Module Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button className="w-full gap-2 h-12 text-lg">
                          <Play className="w-5 h-5 fill-current" />
                          Start Interactive Lesson
                        </Button>
                        <Button variant="outline" className="w-full gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Take the Quiz
                        </Button>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-2 bg-secondary/30 pt-4 mt-2">
                        <div className="flex justify-between w-full text-sm font-medium">
                          <span>Completion Reward</span>
                          <span className="text-primary">+50 XP</span>
                        </div>
                        <Progress value={activeModule?.progress} className="h-1.5" />
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
