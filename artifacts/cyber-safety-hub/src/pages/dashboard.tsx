import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { Shield, TrendingUp, AlertTriangle, BookOpen, Star, Award, Zap, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { BackButton } from "@/components/ui/back-button";

const SCAM_TRENDS_DATA = [
  { name: 'Mon', Phishing: 4000, OTP: 2400, Job: 2400 },
  { name: 'Tue', Phishing: 3000, OTP: 1398, Job: 2210 },
  { name: 'Wed', Phishing: 2000, OTP: 9800, Job: 2290 },
  { name: 'Thu', Phishing: 2780, OTP: 3908, Job: 2000 },
  { name: 'Fri', Phishing: 1890, OTP: 4800, Job: 2181 },
  { name: 'Sat', Phishing: 2390, OTP: 3800, Job: 2500 },
  { name: 'Sun', Phishing: 3490, OTP: 4300, Job: 2100 },
];

const REPORTS_DATA = [
  { month: 'Jan', reports: 120 },
  { month: 'Feb', reports: 150 },
  { month: 'Mar', reports: 220 },
  { month: 'Apr', reports: 180 },
  { month: 'May', reports: 290 },
  { month: 'Jun', reports: 350 },
];

const NATIONAL_STATS = [
  { category: 'UPI Fraud', percentage: 55, color: 'bg-primary' },
  { category: 'Phishing', percentage: 22, color: 'bg-orange-500' },
  { category: 'Investment', percentage: 15, color: 'bg-blue-500' },
  { category: 'Other', percentage: 8, color: 'bg-muted' },
];

export default function Dashboard() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.getDashboardData(),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center text-destructive">Failed to load dashboard data</div>
      </div>
    );
  }

  const userStats = dashboardData?.userStats;
  const scamTrends = dashboardData?.scamTrends || SCAM_TRENDS_DATA;
  const reportsData = dashboardData?.reportsData || REPORTS_DATA;
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none blur-3xl" />
      
      <div className="relative z-10">
        <BackButton />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome Back, Citizen</h1>
            <p className="text-muted-foreground">Here's your cyber safety overview and community trends.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 px-3 py-1.5 text-sm gap-2 backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              7 Day Streak!
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-lg border-l-4 border-l-primary">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{t('dash.national_loss_t') || "National Financial Loss"}</p>
              <h3 className="text-3xl font-black text-primary">₹1,750 Cr+</h3>
              <p className="text-[10px] text-muted-foreground mt-2">{t('dash.national_loss_d') || "Reported in 2023 across India"}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-lg border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{t('dash.upi_scams_t') || "UPI Fraud Volume"}</p>
              <h3 className="text-3xl font-black text-orange-500">55%</h3>
              <p className="text-[10px] text-muted-foreground mt-2">{t('dash.upi_scams_d') || "Of all financial crimes are UPI-based"}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-lg border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{t('dash.complaints_t') || "Complaints Registered"}</p>
              <h3 className="text-3xl font-black text-blue-500">1.3M+</h3>
              <p className="text-[10px] text-muted-foreground mt-2">{t('dash.complaints_d') || "Through 1930 Helpline in 2023"}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-lg border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{t('dash.recovered_t') || "Funds Recovered"}</p>
              <h3 className="text-3xl font-black text-green-500">₹250 Cr</h3>
              <p className="text-[10px] text-muted-foreground mt-2">{t('dash.recovered_d') || "Saved by quick reporting within 1hr"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Live Scam Trends in Your Region
                </CardTitle>
                <CardDescription>Daily volume of reported scam categories (Last 7 days)</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] w-full pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scamTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.8)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ color: 'white' }}
                    />
                    <Bar dataKey="OTP" stackId="a" fill="hsl(var(--destructive))" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="Phishing" stackId="a" fill="hsl(var(--primary))" />
                    <Bar dataKey="Job" stackId="a" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  National Crime Breakdown
                </CardTitle>
                <CardDescription>Estimated distribution of cybercrime types in India (MHA Data)</CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                {NATIONAL_STATS.map((stat) => (
                  <div key={stat.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{stat.category}</span>
                      <span className="font-black text-primary">{stat.percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${stat.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 mt-4">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    * Data based on National Cyber Crime Reporting Portal (NCRP) annual summaries. Financial frauds remain the dominant threat.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Tip of the Day */}
            <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-xl overflow-hidden border-l-4 border-l-primary">
              <CardHeader className="bg-primary/10 pb-4 border-b border-white/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  Tip of the Day
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Never share your screen during banking.</strong> Scammers often ask you to install apps like AnyDesk or TeamViewer to "help" you, but they actually use it to see your OTPs and steal money.
                </p>
              </CardContent>
            </Card>

            {/* National Helpline */}
            <Card className="bg-primary/90 text-primary-foreground shadow-2xl border-none overflow-hidden relative group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 fill-white/20" />
                  National Helpline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center py-2">
                  <h2 className="text-5xl font-black tracking-tighter mb-1 group-hover:scale-110 transition-transform cursor-default">1930</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Cybercrime Incident Support</p>
                  <Button variant="secondary" className="mt-4 w-full rounded-xl font-bold bg-white text-primary hover:bg-white/90" onClick={() => window.open('tel:1930')}>
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Items */}
            <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-xl overflow-hidden border-t-4 border-t-destructive">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Live Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="text-xs font-bold text-destructive mb-1">HIGH ALERT: Aadhaar/Biometric Scams</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">Scammers using cloned fingerprints to bypass AePS (Aadhaar Enabled Payment System).</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-xs font-bold text-primary mb-1">NEW TREND: FedEx/Courier Scams</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">Fake 'narcotics' parcels used to blackmail citizens. Do not pay any "legal fees" via UPI.</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <p className="text-xs font-bold text-orange-500 mb-1">UPI Safety Tip</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">Receiving money NEVER requires you to enter your UPI PIN. Scan only to PAY, never to receive.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
