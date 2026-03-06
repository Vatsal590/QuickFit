import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dumbbell, Clock, Target, Zap, Calendar, MessageCircle, Scale, Apple, BarChart3, CheckCircle, Sparkles, TrendingUp, BookOpen, Award, Instagram, Camera, Radio, ExternalLink, ChevronLeft, ChevronRight, Languages, ArrowRight, Play } from 'lucide-react';
import radioAraImage1 from '@/assets/radioara-feature.png';
import radioAraImage2 from '@/assets/radioara-feature-2.png';
import radioAraImage3 from '@/assets/radioara-feature-3.png';
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
  const fallbackPaths = React.useRef(allCandidates.slice(1));

  const handleFounderImgError = () => {
    const next = fallbackPaths.current.shift();
    if (next) {
      setFounderSrc(next);
    } else {
      setFounderSrc(`/placeholder.svg?v=${vRef.current}`);
    }
  };

  useEffect(() => {
    const checkVerification = async () => {
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      if (error || errorDescription) {
        if (errorDescription?.includes('expired') || errorDescription?.includes('invalid')) {
          toast({
            title: "Verification Link Expired",
            description: "Your email confirmation link has expired or is invalid. Please sign up again to receive a new confirmation email.",
            variant: "destructive"
          });
          navigate('/', { replace: true });
        } else {
          toast({
            title: "Verification Error",
            description: errorDescription || "There was an issue verifying your email. Please try again.",
            variant: "destructive"
          });
          navigate('/', { replace: true });
        }
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/home', { replace: true });
      }
    };
    checkVerification();
  }, [searchParams, navigate, toast]);

  // Auto-rotate radio images
  useEffect(() => {
    const interval = setInterval(() => {
      setRadioImageIndex(prev => (prev === 2 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Zap, title: t('Instant Workouts'), description: t('Generate personalized workouts in seconds based on your time, equipment, and goals.'), tag: 'AI-Powered' },
    { icon: Calendar, title: t('30-Day Plans'), description: t('Month-long programs that adapt to your fitness level and available equipment.'), tag: 'Structured' },
    { icon: Apple, title: t('7-Day Diet Plans'), description: t('Personalized meal plans with nutritional guidance for your goals.'), tag: 'Nutrition' },
    { icon: Camera, title: t('AI Food Tracker'), description: t('Log meals with photos and track nutrition automatically using AI.'), tag: 'Smart' },
    { icon: MessageCircle, title: t('AI Fitness Coach'), description: t('Get instant answers to fitness questions 24/7.'), tag: 'Chat' },
    { icon: BookOpen, title: t('Fitness Blogs'), description: t('Simple tips for a healthier lifestyle.'), tag: 'Learn' },
  ];

  const reviews = [
    { name: 'Andrew', role: t('Student'), text: t('Clear, well organised. I like the weight tracker.') },
    { name: 'Nina', role: t('Mother'), text: t('Easy to use and navigate.') },
    { name: 'Harshit', role: t('Student'), text: t('Liked how so many features were there for free, even the AI fitness chatbot.') },
    { name: 'Vedika', role: t('Housewife'), text: t('The exercise animations make it so much easier to workout. I like the fitness blogs!') },
  ];

  return (
    <div className="min-h-screen bg-foreground text-primary-foreground">
      {/* Header — minimal, dark */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary-foreground/10">
        <div className="backdrop-blur-2xl bg-foreground/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center gap-2">
                <img
                  src="/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png"
                  alt="QuickFit Logo"
                  className="w-7 h-7 sm:w-8 sm:h-8"
                />
                <span className="text-lg sm:text-xl font-bold tracking-tight text-primary-foreground">
                  QuickFit
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsLanguageSelectorOpen(true)}
                  className="flex items-center gap-1.5 text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm font-medium px-2.5 py-1.5 rounded-lg hover:bg-primary-foreground/5"
                  aria-label="Change language"
                  type="button"
                >
                  <Languages className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">🌐</span>
                </button>
                <Link to="/auth">
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 sm:px-5 text-sm font-semibold"
                  >
                    {t('Get Started')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <LanguageSelector
        isOpen={isLanguageSelectorOpen}
        onClose={() => setIsLanguageSelectorOpen(false)}
      />

      <main>
        {/* Hero — bold, editorial */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-14 sm:pt-16 overflow-hidden">
          {/* Subtle gradient accent */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-fitness-secondary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/5 border border-primary-foreground/10 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-primary-foreground/70 mb-8">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              {t('Free to use • No credit card')}
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-6">
              {t('Your Complete')}
              <br />
              <span className="bg-gradient-to-r from-primary via-fitness-secondary to-fitness-accent bg-clip-text text-transparent">
                {t('Fitness Companion')}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-primary-foreground/50 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              {t('Personalized workouts, nutrition plans, and AI coaching in one place.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-semibold group"
                >
                  {t('Start Free Today')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {[
                { icon: Zap, text: t('Instant workout generation') },
                { icon: Calendar, text: t('30-day personalized plans') },
                { icon: Sparkles, text: t('AI fitness coaching') },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-primary-foreground/5 border border-primary-foreground/10 px-4 py-2 rounded-full text-sm text-primary-foreground/60"
                >
                  <item.icon className="h-3.5 w-3.5 text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured on Radio — editorial card */}
        <section className="relative py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="rounded-3xl border border-primary-foreground/10 bg-primary-foreground/[0.03] overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-square md:aspect-auto overflow-hidden">
                  {[radioAraImage1, radioAraImage2, radioAraImage3].map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`QuickFit featured on RadioARA Luxembourg - Photo ${idx + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === radioImageIndex ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {[0, 1, 2].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => setRadioImageIndex(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === radioImageIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                        aria-label={`View photo ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-8 sm:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Radio className="h-4 w-4 text-primary" />
                    <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">{t('As Featured On')}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4 tracking-tight">
                    {t('QuickFit on Luxembourg National Radio')}
                  </h3>
                  <p className="text-primary-foreground/50 mb-6 leading-relaxed">
                    {t("QuickFit was featured on RadioARA, Luxembourg's national radio. Vatsal, the founder of QuickFit was invited as a speaker")}
                  </p>
                  <a
                    href="https://aracityradio.com/features-blog/2025/11/11/ai-powered-fitness-with-vatsal-agarwala"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button variant="outline" className="rounded-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/5 group">
                      {t('Listen to the Feature')}
                      <ExternalLink className="ml-2 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features — grid with monochrome cards */}
        <section className="relative py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mb-16">
              <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">{t('Features')}</span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mt-3 text-primary-foreground">
                {t('Everything You Need')}
              </h2>
              <p className="text-primary-foreground/40 text-lg mt-4">
                {t('Workouts, meal plans, and tracking in one place.')}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl border border-primary-foreground/8 bg-primary-foreground/[0.02] p-6 sm:p-8 hover:bg-primary-foreground/[0.05] hover:border-primary-foreground/15 transition-all duration-500"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary-foreground/30">
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary-foreground mb-2 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/40 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder — asymmetric layout */}
        <section className="relative py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="rounded-3xl border border-primary-foreground/10 bg-primary-foreground/[0.03] overflow-hidden">
              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-2 relative overflow-hidden">
                  <img
                    src={founderSrc}
                    alt="Vatsal Agarwala - Founder of QuickFit"
                    className="w-full h-full object-cover min-h-[300px]"
                    onError={handleFounderImgError}
                  />
                </div>
                <div className="md:col-span-3 p-8 sm:p-12 flex flex-col justify-center">
                  <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">{t('About the Founder')}</span>
                  <h3 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-3 tracking-tight">
                    {t('Vatsal Agarwala')}
                  </h3>
                  <p className="text-primary text-sm font-semibold mb-4">
                    🎉 {t("Get Vatsal's workout & diet plan FREE when you sign up!")}
                  </p>
                  <p className="text-primary-foreground/50 leading-relaxed">
                    {t("Created by Vatsal Agarwala, a 15-year-old (now older) from Luxembourg who started his fitness journey at 13. After trying countless apps and videos, he built QuickFit to make fitness simple for everyone.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews — minimal cards */}
        <section className="relative py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mb-16">
              <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">{t('Reviews')}</span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 text-primary-foreground">
                {t('What Our Users Say')}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-primary-foreground/8 bg-primary-foreground/[0.02] p-6 hover:bg-primary-foreground/[0.05] hover:border-primary-foreground/15 transition-all duration-500"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {review.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-foreground">{review.name}</p>
                      <p className="text-xs text-primary-foreground/30">{review.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-primary-foreground/50 leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA — dramatic gradient */}
        <section className="relative py-28 sm:py-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-fitness-secondary to-primary opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_70%)]" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter leading-[0.95] mb-6">
              {t('Ready to Transform Your')}
              <br />
              {t('Fitness Journey?')}
            </h2>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              {t("Join others who've made fitness simple with QuickFit's intelligent approach to workouts, nutrition, and progress tracking.")}
            </p>
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 rounded-full px-10 py-6 text-base font-bold shadow-2xl shadow-black/20 group"
              >
                {t('Start Your Free Journey')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-white/50 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                {t('No subscription required')}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                {t('Instant access')}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                {t('Works on any device')}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer — clean */}
      <footer className="border-t border-primary-foreground/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/30">
              © 2025 QuickFit. {t('Sculpted by Vatsal Agarwala.')}
            </p>
            <div className="flex items-center gap-5 text-sm text-primary-foreground/30">
              <a href="/" className="hover:text-primary-foreground/60 transition-colors">{t('Home')}</a>
              <a href="/privacy-policy" className="hover:text-primary-foreground/60 transition-colors">{t('Privacy Policy')}</a>
              <a href="/terms-of-service" className="hover:text-primary-foreground/60 transition-colors">{t('Terms of Service')}</a>
              <a href="https://www.instagram.com/quickfit.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground/60 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
