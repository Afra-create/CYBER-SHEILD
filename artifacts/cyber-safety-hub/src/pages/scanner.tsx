import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Upload, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Camera, 
  Image as ImageIcon,
  Loader2,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ScanResult {
  isScam: boolean;
  confidence: number;
  threatLevel: string;
  category: string;
  summary: string;
  recommendations: string[];
}

export default function Scanner() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      const response = await fetch("/api/scan-screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selectedImage })
      });

      const data = await response.json();
      setScanProgress(100);
      
      setTimeout(() => {
        setIsScanning(false);
        setResult(data);
      }, 500);

    } catch (error) {
      console.error("Scan failed:", error);
      setIsScanning(false);
    } finally {
      clearInterval(interval);
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setResult(null);
    setScanProgress(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl relative">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none blur-3xl" />
      
      <div className="relative z-10">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 tracking-tight flex items-center gap-3">
            <Search className="w-8 h-8 text-primary" />
            AI Scam Scanner
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Upload a screenshot of any suspicious message, email, or social media post. Our AI will analyze it for phishing patterns and threats.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/40 backdrop-blur-xl rounded-3xl overflow-hidden border-dashed border-2">
              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  {!selectedImage ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-12 text-center"
                    >
                      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
                        <Camera className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Drop your screenshot here</h3>
                      <p className="text-muted-foreground mb-6">Or click to browse from your device</p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button onClick={() => fileInputRef.current?.click()} className="rounded-xl px-8">
                        Select Screenshot
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative p-4"
                    >
                      <img 
                        src={selectedImage} 
                        alt="Preview" 
                        className="w-full h-auto max-h-[500px] object-contain rounded-2xl shadow-2xl" 
                      />
                      <button 
                        onClick={resetScanner}
                        className="absolute top-6 right-6 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {selectedImage && !result && !isScanning && (
              <Button 
                onClick={startScan} 
                className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 gap-3"
              >
                <Search className="w-6 h-6" />
                Analyze with AI
              </Button>
            )}

            {isScanning && (
              <Card className="border-primary/30 bg-primary/5 backdrop-blur-md rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    <span className="font-bold">AI Analyzing Screenshot...</span>
                  </div>
                  <span className="text-primary font-mono">{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2 bg-primary/10" />
                <p className="mt-4 text-xs text-muted-foreground text-center">
                  Extracting text and identifying threat patterns...
                </p>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <Card className={`overflow-hidden rounded-3xl border-2 ${result.isScam ? 'border-destructive/50 bg-destructive/5' : 'border-green-500/50 bg-green-500/5'}`}>
                    <CardHeader className={`pb-4 ${result.isScam ? 'bg-destructive/10' : 'bg-green-500/10'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-2xl ${result.isScam ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-500'}`}>
                            {result.isScam ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-black tracking-tight">
                              {result.isScam ? 'Scam Detected!' : 'Likely Safe'}
                            </CardTitle>
                            <Badge variant="outline" className="mt-1 font-mono uppercase text-[10px] tracking-widest">
                              {result.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Confidence</div>
                          <div className={`text-xl font-black ${result.isScam ? 'text-destructive' : 'text-green-500'}`}>
                            {(result.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">AI Analysis Summary</h4>
                        <p className="text-lg leading-relaxed font-medium">{result.summary}</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Recommended Actions</h4>
                        <div className="space-y-2">
                          {result.recommendations.map((rec, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                              <div className={`mt-1 p-1 rounded-full ${result.isScam ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-500'}`}>
                                <CheckCircle2 className="w-3 h-3" />
                              </div>
                              <span className="text-sm font-semibold">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-white/5 p-6 border-t border-white/5">
                      <Button variant="outline" onClick={resetScanner} className="w-full rounded-xl border-white/10">
                        Scan Another Screenshot
                      </Button>
                    </CardFooter>
                  </Card>

                  {result.isScam && (
                    <Card className="bg-destructive/10 border-destructive/20 rounded-2xl p-6">
                      <div className="flex items-center gap-3 text-destructive mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <h4 className="font-bold">Important Security Warning</h4>
                      </div>
                      <p className="text-sm opacity-90 leading-relaxed">
                        This message shows strong indicators of phishing. Scammers often use urgency and fear to make you click links. Your bank will never ask for your details through an SMS or email link.
                      </p>
                    </Card>
                  )}
                </motion.div>
              )}

              {!result && !isScanning && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 grayscale py-20">
                  <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                  <div className="max-w-xs">
                    <h3 className="text-lg font-bold">Analysis Ready</h3>
                    <p className="text-sm">Upload an image to see the AI analysis results here.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
