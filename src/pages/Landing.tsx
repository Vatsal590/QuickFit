import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Calendar, MessageCircle, Apple, CheckCircle, Sparkles, BookOpen, Instagram, Camera, Radio, ExternalLink, ChevronLeft, ChevronRight, Languages, Trophy, Flame, Play } from 'lucide-react';
import radioAraImage1 from '@/assets/radioara-feature.png';
import radioAraImage2 from '@/assets/radioara-feature-2.png';
import radioAraImage3 from '@/assets/radioara-feature-3.png';
import jelEvent1 from '@/assets/jel-event-1.png';
import jelEvent2 from '@/assets/jel-event-2.png';
import quickfitLogo from '@/assets/quickfit-logo.png';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LanguageSelector from '@/components/language/LanguageSelector';
import { useTranslation } from '@/contexts/TranslationContext';

const Landing = () => {
  const { t } = useTranslation();
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const vRef = React.useRef(Date.now().toString());
  const exts = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG', '.webp', '.avif'];
  const bases = ['/lovable-uploads/vatsal-agarwala-founder.jpg', 'lovable-uploads/vatsal-agarwala-founder.jpg', `${import.meta.env.BASE_URL}lovable-uploads/vatsal-agarwala-founder`];
  const allCandidates = React.useMemo(() => {
    const v = vRef.current;
    const withV = (p: string) => `${p}?v=${v}`;
    const list: string[] = [];
    bases.forEach(b => exts.forEach(e => list.push(withV(`${b}${e}`))));
    list.push(withV('/lovable-uploads/vatsal-agarwala-founder.jpg'));
    return list;
  }, []);
  const [founderSrc, setFounderSrc] = React.useState(allCandidates[0]);
  const [radioImageIndex, setRadioImageIndex] = React.useState(0);
  const [featureSlide, setFeatureSlide] = React.useState(0);
  const [jelImageIndex, setJelImageIndex] = React.useState(0);
  const [reviewIndex, setReviewIndex] = React.useState(0);
  const [reviewPaused, setReviewPaused] = React.useState(false);
  const fallbackPaths = React.useRef(allCandidates.slice(1));

  const handleFounderImgError = () => {
    const next = fallbackPaths.current.shift();
    if (next) setFounderSrc(next);
    else setFounderSrc(`/placeholder.svg?v=${vRef.current}`);
  };

  useEffect(() => {
    const checkVerification = async () => {
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      if (error || errorDescription) {
        toast({
          title: errorDescription?.includes('expired') ? "Verification Link Expired" : "Verification Error",
          description: errorDescription || "There was an issue verifying your email. Please try again.",
          variant: "destructive",
        });
        navigate('/', { replace: true });
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate('/home', { replace: true });
    };
    checkVerification();
  }, [searchParams, navigate, toast]);

  const reviews = [
    { name: 'Andrew', role: t('Student'), text: t('Clear, well organised. I like the weight tracker.') },
    { name: 'Nina', role: t('Mother'), text: t('Easy to use and navigate.') },
    { name: 'Harshit', role: t('Student'), text: t('Liked how so many features were there for free, even the AI fitness chatbot.') },
    { name: 'Vedika', role: t('Housewife'), text: t('The exercise animations make it so much easier to workout. I like the fitness blogs!') },
  ];

  useEffect(() => {
    if (reviewPaused) return;
    const id = setInterval(() => setReviewIndex(i => (i + 1) % reviews.length), 5500);
    return () => clearInterval(id);
  }, [reviewPaused, reviews.length]);

  const features = [
    { icon: Dumbbell, title: t('Instant Workouts'), description: t('Smart workouts in seconds based on your time, equipment, and goals.') },
    { icon: Calendar, title: t('30-Day Plans'), description: t('Stay consistent with a structured 30-day plan tailored to you.') },
    { icon: Apple, title: t('7-Day Diet Plans'), description: t('Simple 7-day meal plans aligned with your fitness goals.') },
    { icon: Camera, title: t('AI Food Tracker'), description: t('Snap a photo, let AI estimate and track your nutrition.') },
    { icon: MessageCircle, title: t('AI Fitness Coach'), description: t('Chat with an AI coach 24/7 for form, plan tweaks, and guidance.') },
    { icon: BookOpen, title: t('Fitness Blogs'), description: t('Short, practical articles to build better habits.') },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={quickfitLogo} alt="QuickFit Logo" className="h-9 md:h-10 w-auto" />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsLanguageSelectorOpen(true)}
                aria-label="Change language"
              >
                <Languages className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">EN</span>
              </Button>
              <Link to="/auth">
                <Button size="sm" className="rounded-full px-5 font-semibold shadow-sm">
                  {t('Get Started')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <LanguageSelector isOpen={isLanguageSelectorOpen} onClose={() => setIsLanguageSelectorOpen(false)} />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-fitness-primary/10 via-background to-fitness-secondary/10" />
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-fitness-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-fitness-secondary/20 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28 min-h-[88vh] flex items-center">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
              {/* Text */}
              <div className="lg:col-span-7 space-y-7">
                <div
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 backdrop-blur px-3 py-1.5 text-xs font-medium text-muted-foreground opacity-0 animate-fade-in"
                  style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-fitness-primary" />
                  {t('AI-powered fitness, made simple')}
                </div>

                <h1
                  className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] opacity-0 animate-fade-in"
                  style={{ animationDelay: '80ms', animationFillMode: 'forwards' }}
                >
                  {t('Your Complete')}{' '}
                  <span className="bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
                    {t('Fitness Companion')}
                  </span>
                </h1>

                <p
                  className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed opacity-0 animate-fade-in"
                  style={{ animationDelay: '180ms', animationFillMode: 'forwards' }}
                >
                  {t('Personalized workouts, nutrition plans, and AI coaching in one place.')}
                </p>

                <div
                  className="flex flex-col sm:flex-row gap-3 opacity-0 animate-fade-in"
                  style={{ animationDelay: '260ms', animationFillMode: 'forwards' }}
                >
                  <Link to="/auth">
                    <Button size="lg" className="rounded-full px-7 h-12 font-semibold shadow-lg shadow-fitness-primary/20 hover:shadow-fitness-primary/40 transition-shadow animate-cta-pulse">
                      {t('Start Free Today')}
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button size="lg" variant="outline" className="rounded-full px-7 h-12 font-semibold gap-2">
                      <Play className="h-4 w-4" />
                      {t('View Demo')}
                    </Button>
                  </a>
                </div>

                <p
                  className="text-sm text-muted-foreground opacity-0 animate-fade-in"
                  style={{ animationDelay: '340ms', animationFillMode: 'forwards' }}
                >
                  {t('Instant workouts • 30-day plans • AI fitness coaching')}
                </p>
              </div>

              {/* App mockup */}
              <div
                className="lg:col-span-5 opacity-0 animate-fade-in"
                style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
              >
                <div className="relative mx-auto max-w-sm">
                  <div className="absolute -inset-6 bg-gradient-to-br from-fitness-primary/30 to-fitness-secondary/30 rounded-[2.5rem] blur-2xl opacity-60" />
                  <div className="relative rounded-[2rem] border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{t("Today's Workout")}</p>
                        <p className="text-lg font-bold">{t('Upper Body Strength')}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-fitness-primary/10 flex items-center justify-center">
                        <Flame className="h-5 w-5 text-fitness-primary" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { v: '42', l: t('min') },
                        { v: '6', l: t('exercises') },
                        { v: '380', l: t('kcal') },
                      ].map((s, i) => (
                        <div key={i} className="rounded-xl bg-muted/60 p-3 text-center">
                          <p className="text-base font-bold">{s.v}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.l}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      {[
                        { name: t('Bench Press'), sets: '4 × 8' },
                        { name: t('Pull-ups'), sets: '3 × 10' },
                        { name: t('Shoulder Press'), sets: '3 × 12' },
                      ].map((ex, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-fitness-primary to-fitness-secondary flex items-center justify-center">
                            <Dumbbell className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{ex.name}</p>
                            <p className="text-xs text-muted-foreground">{ex.sets}</p>
                          </div>
                          <CheckCircle className="h-4 w-4 text-fitness-secondary" />
                        </div>
                      ))}
                    </div>

                    <Button className="w-full rounded-xl" size="sm">
                      {t('Start Workout')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AS FEATURED ON */}
        <section className="py-20 bg-muted/30 border-y border-border/60">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">{t('As Featured On')}</p>
              <h2 className="text-2xl md:text-3xl font-bold mt-3">{t('Trusted & Recognized')}</h2>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {[t('RadioARA Feature'), t('JEL Alumni Award')].map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => setFeatureSlide(idx)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    featureSlide === idx
                      ? 'bg-foreground text-background'
                      : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* RadioARA */}
            <div className={featureSlide === 0 ? 'block' : 'hidden'}>
              <div className="flex flex-col md:flex-row items-center gap-8 bg-card rounded-2xl p-6 md:p-8 border border-border/60 shadow-sm">
                <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0 overflow-hidden rounded-2xl">
                  {[radioAraImage1, radioAraImage2, radioAraImage3].map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Vatsal Agarwala on RadioARA - Photo ${idx + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${idx === radioImageIndex ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {[0, 1, 2].map(idx => (
                      <button
                        key={idx}
                        onClick={() => setRadioImageIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${idx === radioImageIndex ? 'bg-white w-5' : 'bg-white/60 w-1.5'}`}
                        aria-label={`Photo ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <button onClick={() => setRadioImageIndex(p => (p === 0 ? 2 : p - 1))} className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1" aria-label="Previous">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => setRadioImageIndex(p => (p === 2 ? 0 : p + 1))} className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1" aria-label="Next">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Radio className="h-4 w-4 text-fitness-primary" />
                    <span className="text-fitness-primary font-semibold text-xs tracking-widest uppercase">{t('Luxembourg National Radio')}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">{t('QuickFit on Luxembourg National Radio')}</h3>
                  <p className="text-muted-foreground">
                    {t("QuickFit was featured on RadioARA, Luxembourg's national radio. Vatsal, the founder of QuickFit was invited as a speaker")}
                  </p>
                  <a href="https://soundcloud.com/aracityradio/ai-powered-fitness-with-vatsal-agarwala" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="rounded-full mt-2 gap-2">
                      {t('Listen to the Feature')} <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* JEL */}
            <div className={featureSlide === 1 ? 'block' : 'hidden'}>
              <div className="flex flex-col md:flex-row items-center gap-8 bg-card rounded-2xl p-6 md:p-8 border border-border/60 shadow-sm">
                <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0 overflow-hidden rounded-2xl">
                  {[jelEvent1, jelEvent2].map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`JEL event - Photo ${idx + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover object-left transition-opacity duration-500 ${idx === jelImageIndex ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {[0, 1].map(idx => (
                      <button
                        key={idx}
                        onClick={() => setJelImageIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${idx === jelImageIndex ? 'bg-white w-5' : 'bg-white/60 w-1.5'}`}
                        aria-label={`Photo ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-500 font-semibold text-xs tracking-widest uppercase">{t('Award Winner')}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">{t('JEL Alumni Award at Vente en Commun')}</h3>
                  <p className="text-muted-foreground">
                    {t("QuickFit won the 2026 My First Enterprise JEL Alumni Award held at Cloche D'Or, Luxembourg. The event was organised by Jonk Entrepreneuren Luxembourg (JEL), the Luxembourg chapter of Junior Achievement (JA) Europe — the largest non-profit in Europe dedicated to entrepreneurship education.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{t('Everything You Need')}</h2>
              <p className="text-lg text-muted-foreground mt-4">{t('Workouts, meal plans, and tracking in one place.')}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200 ease-out animate-fade-in opacity-0"
                  style={{ animationDelay: `${idx * 70}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="h-12 w-12 rounded-xl bg-fitness-primary/10 flex items-center justify-center mb-5 transition-colors group-hover:bg-fitness-primary/20">
                    <f.icon className="h-6 w-6 text-fitness-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS - slider */}
        <section className="py-24 bg-muted/30 border-y border-border/60">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">{t('Reviews')}</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-3">{t('What Our Users Say')}</h2>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setReviewPaused(true)}
              onMouseLeave={() => setReviewPaused(false)}
            >
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${reviewIndex * 100}%)` }}
                >
                  {reviews.map((r, idx) => (
                    <div key={idx} className="w-full flex-shrink-0 px-2">
                      <div className="bg-card rounded-2xl border border-border/60 p-8 md:p-10 text-center shadow-sm">
                        <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-fitness-primary/10 flex items-center justify-center text-xl font-bold text-fitness-primary">
                          {r.name[0]}
                        </div>
                        <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground/90">"{r.text}"</p>
                        <p className="mt-5 font-semibold">{r.name}</p>
                        <p className="text-sm text-muted-foreground">{r.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-6">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setReviewIndex(idx)}
                    className={`h-2 rounded-full transition-all ${idx === reviewIndex ? 'bg-foreground w-6' : 'bg-muted-foreground/30 w-2'}`}
                    aria-label={`Review ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOUNDER */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-10 items-center">
              <div className="mx-auto">
                <div className="relative h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden border-4 border-background shadow-xl ring-1 ring-border">
                  <img src={founderSrc} alt="Vatsal Agarwala" className="w-full h-full object-cover" onError={handleFounderImgError} />
                </div>
              </div>
              <div className="text-center md:text-left space-y-3">
                <p className="text-xs font-bold tracking-[0.2em] text-fitness-primary uppercase">{t('Meet the Founder')}</p>
                <h3 className="text-3xl font-bold">{t('Vatsal Agarwala')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('Vatsal started his fitness journey at 13 and built QuickFit to make fitness less confusing for beginners.')}
                </p>
                <div className="inline-flex items-center gap-2 rounded-full bg-fitness-primary/10 text-fitness-primary px-4 py-1.5 text-sm font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t('Get a customized plan made for you by Vatsal!')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-fitness-primary to-fitness-secondary" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

          <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              {t('Ready to Transform Your')} <span className="block">{t('Fitness Journey?')}</span>
            </h2>
            <p className="text-lg md:text-xl text-white/90 mt-5 max-w-2xl mx-auto">
              {t("Join others who've made fitness simple with QuickFit's intelligent approach to workouts, nutrition, and progress tracking.")}
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/auth">
                <Button size="lg" className="rounded-full px-8 h-12 bg-white text-fitness-primary hover:bg-white/90 font-semibold shadow-xl">
                  {t('Start Free Today')}
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-white/80">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" />{t('No subscription required')}</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" />{t('Instant access')}</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" />{t('Works on any device')}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-fitness-dark text-white py-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm font-medium mb-4">© 2025 QuickFit. {t('Sculpted by Vatsal Agarwala.')}</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/70">
            <a href="/" className="hover:text-white transition-colors">{t('Home')}</a>
            <a href="/privacy-policy" className="hover:text-white transition-colors">{t('Privacy Policy')}</a>
            <a href="/terms-of-service" className="hover:text-white transition-colors">{t('Terms of Service')}</a>
            <a href="https://www.instagram.com/quickfit.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Instagram className="h-4 w-4" /> Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
