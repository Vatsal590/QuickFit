import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Clock, Target, Zap, Calendar, MessageCircle, Scale, Apple, BarChart3, CheckCircle, Sparkles, TrendingUp, BookOpen, Award, Instagram, Camera, Radio, ExternalLink, ChevronLeft, ChevronRight, Languages, Play, ArrowRight, Star, Users, Trophy, Shield, Heart } from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);
  
  const handleFounderImgError = () => {
    const next = fallbackPaths.current.shift();
    if (next) {
      setFounderSrc(next);
    } else {
      setFounderSrc(`/placeholder.svg?v=${vRef.current}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      setRadioImageIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0f]">
      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="relative">
                <img 
                  src="/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png" 
                  alt="QuickFit Logo" 
                  className="w-9 h-9 sm:w-11 sm:h-11 transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-500/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Quick<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Fit</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white/70 hover:text-white hover:bg-white/10 h-10 w-10 transition-all duration-300"
                onClick={() => setIsLanguageSelectorOpen(true)}
                aria-label="Change language"
              >
                <Languages className="h-5 w-5" />
              </Button>
              <Link to="/auth">
                <Button className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold px-5 sm:px-8 py-2.5 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95">
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="hidden sm:inline">{t('Get Started')}</span>
                    <span className="sm:hidden">{t('Start')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <LanguageSelector
        isOpen={isLanguageSelectorOpen}
        onClose={() => setIsLanguageSelectorOpen(false)}
      />
 
      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
          <div className="relative max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 animate-fade-in">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white/80 font-medium">{t('Free for everyone • No credit card')}</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[0.95] tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('Your Complete')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 animate-gradient-x">
                {t('Fitness Companion')}
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in font-medium" style={{ animationDelay: '0.2s' }}>
              {t('Personalized workouts, nutrition plans, and AI coaching in one place.')}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto relative overflow-hidden bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white text-lg px-10 py-7 font-bold rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95 group">
                  <span className="relative z-10 flex items-center gap-3">
                    {t('Start Free Today')}
                    <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Button>
              </Link>
              <Link to="/auth" className="text-white/60 hover:text-white flex items-center gap-2 font-medium transition-colors group">
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {t('See how it works')}
              </Link>
            </div>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: Zap, text: t('Instant workout generation') },
                { icon: Calendar, text: t('30-day personalized plans') },
                { icon: Sparkles, text: t('AI fitness coaching') }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2.5 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default group">
                  <item.icon className="h-4 w-4 text-blue-400 group-hover:text-emerald-400 transition-colors" />
                  <span className="text-sm text-white/80 font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
              {[
                { value: '10K+', label: t('Active Users') },
                { value: '50K+', label: t('Workouts Generated') },
                { value: '4.9', label: t('User Rating'), icon: Star }
              ].map((stat, idx) => (
                <div key={idx} className="text-center group cursor-default">
                  <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1 group-hover:scale-110 transition-transform">
                    {stat.value}
                    {stat.icon && <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />}
                  </div>
                  <div className="text-xs sm:text-sm text-white/50 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Featured on Radio Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-8 md:p-12">
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative flex flex-col md:flex-row items-center gap-10">
                {/* Image carousel */}
                <div className="relative flex-shrink-0 group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-emerald-500/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-56 h-56 md:w-64 md:h-64 overflow-hidden rounded-2xl ring-2 ring-white/20">
                    {[radioAraImage1, radioAraImage2, radioAraImage3].map((img, idx) => (
                      <img 
                        key={idx}
                        src={img} 
                        alt={`Vatsal Agarwala featured on RadioARA Luxembourg - Photo ${idx + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                          idx === radioImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                        }`}
                      />
                    ))}
                    {/* Navigation dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {[0, 1, 2].map((idx) => (
                        <button
                          key={idx}
                          onClick={() => setRadioImageIndex(idx)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === radioImageIndex 
                              ? 'bg-white w-6' 
                              : 'bg-white/40 hover:bg-white/60 w-2'
                          }`}
                          aria-label={`View photo ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 text-center md:text-left space-y-5">
                  <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-4 py-1.5 rounded-full">
                    <Radio className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-400 font-bold text-xs tracking-widest uppercase">{t('As Featured On')}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    {t('QuickFit on Luxembourg National Radio')}
                  </h3>
                  <p className="text-white/60 font-medium leading-relaxed">
                    {t("QuickFit was featured on RadioARA, Luxembourg's national radio. Vatsal, the founder of QuickFit was invited as a speaker")}
                  </p>
                  <a 
                    href="https://aracityradio.com/features-blog/2025/11/11/ai-powered-fitness-with-vatsal-agarwala" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button className="bg-white text-gray-900 hover:bg-white/90 font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-white/10">
                      {t('Listen to the Feature')} <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-4 py-1.5 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold text-xs tracking-widest uppercase">{t('Features')}</span>
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                {t('Everything You Need')}
              </h2>
              <p className="text-lg text-white/50 max-w-2xl mx-auto font-medium">
                {t('Workouts, meal plans, and tracking in one place.')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: t('Instant Workouts'), description: t('Generate personalized workouts in seconds based on your time, equipment, and goals.'), color: 'blue' },
                { icon: Calendar, title: t('30-Day Plans'), description: t('Month-long programs that adapt to your fitness level and available equipment.'), color: 'purple' },
                { icon: Apple, title: t('7-Day Diet Plans'), description: t('Personalized meal plans with nutritional guidance for your goals.'), color: 'emerald' },
                { icon: Camera, title: t('AI Food Tracker'), description: t('Log meals with photos and track nutrition automatically using AI.'), color: 'orange' },
                { icon: MessageCircle, title: t('AI Fitness Coach'), description: t('Get instant answers to fitness questions 24/7.'), color: 'pink' },
                { icon: BookOpen, title: t('Fitness Blogs'), description: t('Simple tips for a healthier lifestyle.'), color: 'cyan' }
              ].map((feature, idx) => {
                const colorMap: Record<string, string> = {
                  blue: 'from-blue-500 to-blue-600 shadow-blue-500/20',
                  purple: 'from-purple-500 to-purple-600 shadow-purple-500/20',
                  emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20',
                  orange: 'from-orange-500 to-orange-600 shadow-orange-500/20',
                  pink: 'from-pink-500 to-pink-600 shadow-pink-500/20',
                  cyan: 'from-cyan-500 to-cyan-600 shadow-cyan-500/20'
                };
                return (
                  <Card 
                    key={idx} 
                    className="group relative overflow-hidden bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-2 cursor-default rounded-2xl"
                  >
                    <CardHeader className="pb-2">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[feature.color]} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <feature.icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-emerald-400 transition-all duration-300">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-white/50 leading-relaxed font-medium">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* About Founder Section */}
        <section className="relative py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 px-4 py-1.5 rounded-full mb-6">
                <Heart className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 font-bold text-xs tracking-widest uppercase">{t('Our Story')}</span>
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                {t('About the Founder')}
              </h2>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              {/* Glow */}
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative grid md:grid-cols-2 gap-0">
                <div className="relative aspect-square md:aspect-auto overflow-hidden group">
                  <img 
                    src={founderSrc} 
                    alt="Vatsal Agarwala - Founder of QuickFit" 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    onError={handleFounderImgError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r"></div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-white mb-2">{t('Vatsal Agarwala')}</h3>
                  <p className="text-white/50 font-medium mb-6">{t('Founder & Developer')}</p>
                  
                  <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                    <p className="text-white font-bold flex items-center gap-2">
                      🎉 {t("Get Vatsal's workout & diet plan FREE when you sign up!")}
                    </p>
                  </div>
                  
                  <p className="text-white/60 leading-relaxed font-medium">
                    {t("Created by Vatsal Agarwala, a 15-year-old (now older) from Luxembourg who started his fitness journey at 13. After trying countless apps and videos, he built QuickFit to make fitness simple for everyone.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 px-4 py-1.5 rounded-full mb-6">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-bold text-xs tracking-widest uppercase">{t('Reviews')}</span>
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                {t('What Our Users Say')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Andrew', role: t('Student'), text: t('Clear, well organised. I like the weight tracker.') },
                { name: 'Nina', role: t('Mother'), text: t('Easy to use and navigate.') },
                { name: 'Harshit', role: t('Student'), text: t('Liked how so many features were there for free, even the AI fitness chatbot.') },
                { name: 'Vedika', role: t('Housewife'), text: t('The exercise animations make it so much easier to workout. I like the fitness blogs!') }
              ].map((review, idx) => (
                <Card 
                  key={idx} 
                  className="group relative overflow-hidden bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-2 rounded-2xl"
                >
                  <CardContent className="p-6">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-white/70 leading-relaxed font-medium mb-6">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                        {review.name[0]}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{review.name}</p>
                        <p className="text-white/40 text-sm">{review.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-32 px-4 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-emerald-600/30"></div>
          <div className="absolute inset-0 bg-[#0a0a0f]/50"></div>
          
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8">
              <Users className="h-4 w-4 text-white" />
              <span className="text-white font-semibold text-sm">{t('Join the other Fitness Enthusiasts')}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              {t('Ready to Transform Your')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                {t('Fitness Journey?')}
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-white/60 mb-12 max-w-2xl mx-auto font-medium">
              {t("Join others who've made fitness simple with QuickFit's intelligent approach to workouts, nutrition, and progress tracking.")}
            </p>

            <Link to="/auth" className="inline-block">
              <Button size="lg" className="relative overflow-hidden bg-white text-gray-900 hover:bg-white/90 px-12 py-8 text-xl font-bold rounded-2xl shadow-2xl shadow-white/20 hover:shadow-white/30 transition-all duration-300 hover:scale-105 active:scale-95 group">
                <span className="relative z-10 flex items-center gap-3">
                  {t('Start Your Free Journey')}
                  <TrendingUp className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>

            <div className="flex flex-wrap justify-center items-center gap-6 mt-10 text-white/60 text-sm font-medium">
              {[
                { icon: CheckCircle, text: t('No subscription required') },
                { icon: CheckCircle, text: t('Instant access') },
                { icon: Shield, text: t('Works on any device') }
              ].map((item, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-emerald-400" />
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png" alt="QuickFit" className="w-8 h-8" />
            <span className="text-white/60 font-medium">© 2025 QuickFit. {t('Sculpted by Vatsal Agarwala.')}</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {[
              { href: '/', label: t('Home') },
              { href: '/privacy-policy', label: t('Privacy Policy') },
              { href: '/terms-of-service', label: t('Terms of Service') }
            ].map((link, idx) => (
              <a key={idx} href={link.href} className="text-white/40 hover:text-white transition-colors font-medium text-sm">
                {link.label}
              </a>
            ))}
            <a href="https://www.instagram.com/quickfit.dev/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors flex items-center gap-1.5 font-medium text-sm">
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
          </div>
        </div>
      </footer>

      {/* Custom animations */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;
