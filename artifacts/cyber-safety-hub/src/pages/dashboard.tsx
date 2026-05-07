import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from "recharts";
import { 
  Shield, TrendingUp, AlertTriangle, BookOpen, Star, Award, 
  Zap, Activity, Target, Trophy, Clock, Fingerprint
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { BackButton } from "@/components/ui/back-button";
import { useTranslation } from "react-i18next";

const SCAM_TRENDS_DATA = [
  { name: 'Mon', Phishing: 4000, OTP: 2400, Job: 2400 },
  { name: 'Tue', Phishing: 3000, OTP: 1398, Job: 2210 },
  { name: 'Wed', Phishing: 2000, OTP: 9800, Job: 2290 },
  { name: 'Thu', Phishing: 2780, OTP: 3908, Job: 2000 },
  { name: 'Fri', Phishing: 1890, OTP: 4800, Job: 2181 },
  { name: 'Sat', Phishing: 2390, OTP: 3800, Job: 2500 },
  { name: 'Sun', Phishing: 3490, OTP: 4300, Job: 2100 },
];

const NATIONAL_DISTRIBUTION = [
  { name: 'UPI Fraud', value: 55, color: '#0ea5e9' },
  { name: 'Social Media', value: 20, color: '#f97316' },
  { name: 'Job Scams', value: 15, color: '#8b5cf6' },
  { name: 'Phishing', value: 10, color: '#ef4444' },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.getDashboardData(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">{t('dashboard.loading') || 'Loading dashboard...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <Card className="max-w-md p-8 border-destructive/20 bg-destructive/5">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Connection Interrupted</h3>
          <p className="text-muted-foreground mb-6">We couldn't synchronize with the National Threat Intel server. Please try again later.</p>
          <Button onClick={() => window.location.reload()} className="rounded-xl">Retry Sync</Button>
        </Card>
      </div>
    );
  }

  const scamTrends = SCAM_TRENDS_DATA;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <BackButton />
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {t('dashboard.intel_badge')}
              </Badge>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              {t('dashboard.intel_title_1')} <span className="text-primary">{t('dashboard.intel_title_2')}</span>
            </h1>
            <h2 className="text-muted-foreground text-lg max-w-xl">
              {t('dashboard.intel_subtitle')}
            </h2>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-4 bg-card/50 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xl shadow-black/5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary fill-primary/20" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{t('dashboard.streak_label')}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black">7 Days</span>
                <Badge className="bg-orange-500/20 text-orange-500 border-none px-1.5 h-5 text-[10px] font-bold">+25% XP</Badge>
              </div>
            </div>
          </motion.div>
        </div>

        {/* National Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: t('dash.national_loss_t'), value: "₹1,750 Cr+", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", sub: t('dash.national_loss_d') },
            { label: t('dash.upi_scams_t'), value: "55%", icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", sub: t('dash.upi_scams_d') },
            { label: t('dash.complaints_t'), value: "1.3M+", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", sub: t('dash.complaints_d') },
            { label: t('dash.recovered_t'), value: "₹250 Cr", icon: Shield, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", sub: t('dash.recovered_d') },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1, ease }}
            >
              <Card className={`relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${stat.border} bg-card/40 backdrop-blur-sm`}>
                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-[100px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                <CardContent className="p-6">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className={`text-3xl font-black tracking-tight ${stat.color}`}>{stat.value}</h3>
                  <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed opacity-70 italic">{stat.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Charts Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Regional Trends Chart */}
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-border/50 pb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      {t('dashboard.intensity_title')}
                    </CardTitle>
                    <CardDescription>{t('dashboard.intensity_desc')}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="font-bold text-[10px]">REAL-TIME</Badge>
                </div>
              </CardHeader>
              <CardContent className="h-[340px] w-full pt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scamTrends}>
                    <defs>
                      <linearGradient id="colorPhish" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOTP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 15, 15, 0.95)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="Phishing" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPhish)" strokeWidth={3} />
                    <Area type="monotone" dataKey="OTP" stroke="#ef4444" fillOpacity={1} fill="url(#colorOTP)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* National Crime Pie Chart */}
              <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    {t('dashboard.composition_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={NATIONAL_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {NATIONAL_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {NATIONAL_DISTRIBUTION.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Recovery Trend */}
              <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-500" />
                    {t('dashboard.recovery_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 text-center">
                      <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-1">Average Recovery Rate</p>
                      <h4 className="text-4xl font-black text-foreground">₹8.2 <span className="text-sm font-normal opacity-60">Lakh/Hr</span></h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reports within 20m</p>
                          <p className="text-lg font-bold">88% Success</p>
                        </div>
                        <div className="w-16 h-12 bg-primary/10 rounded-lg overflow-hidden flex items-end">
                          <div className="w-full h-[88%] bg-primary" />
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reports within 2h</p>
                          <p className="text-lg font-bold">42% Success</p>
                        </div>
                        <div className="w-16 h-12 bg-primary/10 rounded-lg overflow-hidden flex items-end">
                          <div className="w-full h-[42%] bg-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* User Achievement & Progress */}
            <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              
              <CardHeader className="relative pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  {t('dashboard.progress_title')}
                </CardTitle>
                <CardDescription className="text-primary-foreground/70">Level 4: Advanced Defender</CardDescription>
              </CardHeader>
              <CardContent className="relative pt-4 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{t('dashboard.xp_label')}</span>
                    <span>1,240 / 2,000</span>
                  </div>
                  <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '62%' }}
                      transition={{ duration: 1, ease }}
                      className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${i <= 3 ? 'bg-white/20 border-white/40' : 'bg-black/10 border-white/10'}`}>
                      <Award className={`w-5 h-5 ${i <= 3 ? 'text-white' : 'text-white/20'}`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* National Helpline - Redesigned */}
            <Card className="bg-destructive text-destructive-foreground border-none overflow-hidden relative group cursor-pointer" onClick={() => window.location.href = 'tel:1930'}>
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{t('dashboard.hotline_label')}</p>
                <h2 className="text-6xl font-black tracking-tighter mb-2 group-hover:scale-105 transition-transform duration-300">1930</h2>
                <p className="text-xs opacity-70">{t('dashboard.hotline_desc')}</p>
              </CardContent>
            </Card>

            {/* Live Security Alerts */}
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-xl overflow-hidden border-t-4 border-t-destructive">
              <CardHeader className="border-b border-border/50 bg-secondary/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  {t('dashboard.live_threats_title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="relative pl-6 border-l-2 border-destructive/30 py-1">
                  <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  <p className="text-xs font-bold text-destructive mb-1 uppercase tracking-wider">High Alert: AePS Scams</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Cloned fingerprints detected in local AePS points. Disable Aadhaar Lock via mParivahan.</p>
                </div>
                <div className="relative pl-6 border-l-2 border-primary/30 py-1">
                  <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-primary" />
                  <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Trend: Gift Card Scams</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Scammers impersonating electricity board officials demanding bill payment via gift cards.</p>
                </div>
                <div className="relative pl-6 border-l-2 border-orange-500/30 py-1">
                  <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-orange-500" />
                  <p className="text-xs font-bold text-orange-500 mb-1 uppercase tracking-wider">New: WhatsApp Meta Scam</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Fake 'Official Meta Support' accounts asking for verification codes. Block immediately.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
