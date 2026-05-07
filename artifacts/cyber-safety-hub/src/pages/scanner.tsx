import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Shield, AlertTriangle, CheckCircle2, 
  Search, Info, ArrowRight, RefreshCcw, Camera
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { apiClient } from "@/lib/api";

interface ScanResult {
  isScam: boolean;
  confidence: number;
  threatLevel: string;
  category: string;
  summary: string;
  redFlags?: string[];
  recommendations: string[];
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function Scanner() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<{
    safe: boolean;
    score: number;
    reasons: string[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const startScan = async () => {
    if (!file) return;
    setScanning(true);
    setScanProgress(0);
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    try {
      // Use the preview (Base64 or URL) as the image source
      const data = await apiClient.scanScreenshot(preview);
      setScanProgress(100);
      
      setTimeout(() => {
        setScanning(false);
        setResult({
          safe: !data.isScam,
          score: Math.round(data.confidence * 100),
          reasons: data.redFlags || [data.summary]
        });
      }, 500);
    } catch (error: any) {
      console.error("Scan failed:", error);
      setScanning(false);
      clearInterval(interval);
      alert(`Failed to scan image: ${error?.message || "Please try again."}`);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5 px-3 py-1 uppercase tracking-widest text-[10px] font-bold">
            Powered by CyberShield AI
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {t('scanner.title')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {t('scanner.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Upload Area */}
          <Card className="lg:col-span-3 overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm relative group">
            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div 
                  key="upload"
                  className="p-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-border/60 rounded-xl m-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t('scanner.upload_title')}</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {t('scanner.upload_desc')}
                  </p>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*"
                  />
                  <Button variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/10">
                    <Camera className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  key="preview"
                  className="relative p-4 h-full flex flex-col"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-2xl bg-black">
                    <img 
                      src={preview} 
                      alt="Scan Preview" 
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Scan Line Animation */}
                    {scanning && (
                      <motion.div 
                        className="absolute inset-x-0 h-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] z-10"
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                      />
                    )}
                    
                    {/* Overlay while scanning */}
                    {scanning && (
                      <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="bg-background/80 px-6 py-3 rounded-full border border-primary/30 flex items-center gap-3 shadow-2xl">
                          <RefreshCcw className="w-4 h-4 text-primary animate-spin" />
                          <span className="text-sm font-bold tracking-tight">{t('scanner.scanning')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {!scanning && !result && (
                    <div className="mt-6 flex gap-3">
                      <Button 
                        className="flex-1 h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
                        onClick={startScan}
                      >
                        <Search className="w-5 h-5 mr-2" />
                        {t('scanner.analyze_btn')}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-12 w-12 p-0 rounded-xl"
                        onClick={reset}
                      >
                        <RefreshCcw className="w-5 h-5" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Results Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Safety Card */}
                  <Card className={`p-6 border-2 ${result.safe ? 'border-green-500/30 bg-green-500/5' : 'border-destructive/30 bg-destructive/5'}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${result.safe ? 'bg-green-500/20' : 'bg-destructive/20'}`}>
                        {result.safe ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <AlertTriangle className="w-6 h-6 text-destructive" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">AI Verdict</p>
                        <h3 className={`text-xl font-bold ${result.safe ? 'text-green-500' : 'text-destructive'}`}>
                          {result.safe ? t('scanner.result_safe') : t('scanner.result_unsafe')}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Confidence Score</span>
                        <span>{result.score}%</span>
                      </div>
                      <Progress value={result.score} className={`h-2 ${result.safe ? 'bg-green-500/20' : 'bg-destructive/20'}`} />
                    </div>

                    <div className="pt-6 border-t border-border/50">
                      <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        {t('scanner.why_title')}
                      </h4>
                      <ul className="space-y-3">
                        {result.reasons.map((r, i) => (
                          <motion.li 
                            key={i} 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="text-sm text-muted-foreground flex gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                            {r}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </Card>

                  <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-xl font-bold border-primary/20 hover:bg-primary/5"
                    onClick={reset}
                  >
                    {t('scanner.reset')}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center bg-secondary/20 border border-border/50 rounded-2xl border-dashed"
                >
                  <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Upload an image to see the AI analysis breakdown here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Tips Card */}
            <Card className="p-6 bg-primary/5 border-primary/10">
              <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Common Scammer Tactics
              </h4>
              <div className="space-y-3">
                <div className="text-xs p-3 rounded-lg bg-background/50 border border-border/50">
                  <p className="font-bold text-primary mb-1">Look-alike URLs</p>
                  <p className="text-muted-foreground leading-relaxed">Scammers use 'arnazon.com' instead of 'amazon.com'. Always double check every letter.</p>
                </div>
                <div className="text-xs p-3 rounded-lg bg-background/50 border border-border/50">
                  <p className="font-bold text-primary mb-1">Pressure & Fear</p>
                  <p className="text-muted-foreground leading-relaxed">If it says your bank account is "Blocked" and you must act in 5 mins, it's likely a scam.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
