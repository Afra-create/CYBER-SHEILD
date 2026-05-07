import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Upload, ShieldCheck, FileText, CheckCircle2, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const reportSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  platform: z.string().min(1, "Please specify where this happened"),
  suspiciousLink: z.string().optional(),
  description: z.string().min(20, "Please provide more details (at least 20 characters)"),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function Report() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      category: "",
      platform: "",
      suspiciousLink: "",
      description: "",
    }
  });

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    try {
      await apiClient.submitReport({
        type: data.category,
        content: data.description, // Always use description as content
        description: data.suspiciousLink || data.description, // Use link if available, otherwise description
        userEmail: undefined // Anonymous reporting
      });
      
      setIsSuccess(true);
      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep the community safe!",
      });
    } catch (error) {
      console.error('Report submission failed:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setUploadedFile(null);
    setIsSuccess(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-destructive flex items-center gap-3">
          <AlertTriangle className="w-8 h-8" />
          {t('report.title')}
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          {t('report.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{t('report.form_title')}</CardTitle>
                    <CardDescription>{t('report.form_desc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('report.category_label')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t('report.category_placeholder')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="phishing">{t('learn.mod_phish_t')}</SelectItem>
                                    <SelectItem value="bank">{t('learn.mod_otp_t')}</SelectItem>
                                    <SelectItem value="job">{t('learn.mod_job_t')}</SelectItem>
                                    <SelectItem value="social">{t('learn.mod_soc_t')}</SelectItem>
                                    <SelectItem value="blackmail">Blackmail / Extortion</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="platform"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('report.platform_label')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t('report.platform_placeholder')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                    <SelectItem value="sms">SMS / Text</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="facebook">Facebook / Instagram</SelectItem>
                                    <SelectItem value="call">Phone Call</SelectItem>
                                    <SelectItem value="other">Other Platform</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="suspiciousLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('report.link_label')}</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. http://fake-bank-update.com" {...field} />
                              </FormControl>
                              <FormDescription>{t('report.link_desc')}</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('report.content_label')}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder={t('report.content_placeholder')} 
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* File Upload UI */}
                        <div>
                          <p className="mb-3 block text-sm font-medium leading-none">{t('report.file_label')}</p>
                          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-secondary/50 transition-colors relative">
                            <input 
                              type="file" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                            {uploadedFile ? (
                              <div className="flex items-center justify-center gap-3">
                                <FileText className="w-8 h-8 text-primary" />
                                <div className="text-left">
                                  <p className="text-sm font-semibold">{uploadedFile.name}</p>
                                  <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="ml-auto z-20"
                                  onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                                  <Upload className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium">Click or drag image to upload</p>
                                <p className="text-xs text-muted-foreground">{t('report.file_desc')}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                          {isSubmitting ? t('report.submitting_btn') : t('report.submit_btn')}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-card border border-border rounded-xl p-12 text-center shadow-lg"
              >
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{t('report.success_title')}</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                  {t('report.success_desc')}
                </p>
                <div className="bg-secondary/50 rounded-xl p-4 inline-block mb-8 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">{t('report.ref_id')}</p>
                  <p className="font-mono text-xl font-bold text-primary">#HGC-{Math.floor(Math.random() * 90000) + 10000}</p>
                </div>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={resetForm}>{t('report.another_btn')}</Button>
                  <Button onClick={() => window.location.href = '/dashboard'}>{t('report.dash_btn')}</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Why Report?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>Every report acts as an early warning system for the community.</p>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Blocks malicious links faster</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Updates awareness training</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Helps authorities track trends</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Community Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { type: "Phishing SMS", time: "2 mins ago", platform: "SMS" },
                { type: "Fake Job Offer", time: "15 mins ago", platform: "WhatsApp" },
                { type: "Bank KYC Scam", time: "1 hour ago", platform: "Email" },
                { type: "Prize Scam", time: "3 hours ago", platform: "Facebook" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{item.type}</p>
                    <p className="text-xs text-muted-foreground">via {item.platform}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{item.time}</Badge>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs text-primary mt-2">View All Global Reports <ChevronRight className="w-3 h-3 ml-1" /></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
