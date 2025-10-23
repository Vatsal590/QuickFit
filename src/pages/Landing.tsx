
import React, { useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Clock, Target, Zap, Calendar, MessageCircle, Scale, Apple, BarChart3, CheckCircle, Sparkles, TrendingUp, BookOpen, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Landing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const vRef = React.useRef(Date.now().toString());
  const exts = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG', '.webp', '.avif'];
  const bases = [
    '/lovable-uploads/vatsal-agarwala-founder.jpg',
    'lovable-uploads/vatsal-agarwala-founder.jpg',
    `${import.meta.env.BASE_URL}lovable-uploads/vatsal-agarwala-founder`
  ];
  const allCandidates = React.useMemo(() => {
    const v = vRef.current;
    const withV = (p: string) => `${p}?v=${v}`;
    const list: string[] = [];
    bases.forEach(b => exts.forEach(e => list.push(withV(`${b}${e}`))));
    list.push(withV('/lovable-uploads/vatsal-agarwala-founder.jpg'));
    return list;
  }, []);
  const [founderSrc, setFounderSrc] = React.useState(allCandidates[0]);
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
            variant: "destructive",
          });
          navigate('/', { replace: true });
        } else {
          toast({
            title: "Verification Error",
            description: errorDescription || "There was an issue verifying your email. Please try again.",
            variant: "destructive",
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-fitness-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fitness-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-fitness-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header with Glassmorphism */}
      <header className="relative bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png" 
                  alt="QuickFit Logo" 
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-100 group-hover:rotate-6"
                />
                <div className="absolute inset-0 bg-fitness-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
                QuickFit
              </h1>
            </div>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:shadow-lg hover:shadow-fitness-primary/30 transition-all duration-300 hover:scale-105 px-6 py-2 text-base font-semibold">
                Get Started <Sparkles className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative flex-grow">
        {/* Hero Section with Curved Bottom */}
        <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 pb-32 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-fitness-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute top-40 -left-20 w-96 h-96 bg-fitness-primary/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16 space-y-8">
              <h2 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 animate-fade-in-up leading-tight">
                Your Complete
                <span className="block bg-gradient-to-r from-fitness-primary via-fitness-secondary to-fitness-accent bg-clip-text text-transparent mt-4 animate-shimmer" style={{ backgroundSize: '200% auto' }}>
                  Fitness Companion
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in font-medium" style={{ animationDelay: '0.2s' }}>
                Personalized workouts, nutrition plans, and AI coaching in one app.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <Link to="/auth" className="group">
                  <Button size="lg" className="relative bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:shadow-2xl hover:shadow-fitness-primary/40 text-lg px-16 py-8 font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105">
                    <span className="relative z-10 flex items-center gap-2">
                      Start Free Today
                      <Zap className="h-5 w-5 group-hover:animate-pulse" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-fitness-secondary to-fitness-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </Link>
                <p className="text-sm text-gray-600 font-medium">
                  No credit card required • Get started in 2 minutes
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-8 text-base text-gray-700 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                {[
                  { icon: Zap, text: 'Instant workout generation' },
                  { icon: Calendar, text: '30-day personalized plans' },
                  { icon: Sparkles, text: 'AI fitness coaching' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                    <item.icon className="h-5 w-5 text-fitness-primary" />
                    <span className="font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Curved Bottom */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg className="relative block w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-50"></path>
            </svg>
          </div>
        </div>

        {/* Core Features with Tilted Cards */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 -mt-12">
          <div className="text-center mb-20">
            <h3 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Everything You Need
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Workouts, meal plans, and tracking in one place.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Zap,
                title: 'Instant Workouts',
                description: 'Generate personalized workouts in seconds based on your time, equipment, and goals.',
                gradient: 'from-fitness-primary to-blue-600',
                delay: '0s'
              },
              {
                icon: Calendar,
                title: '30-Day Plans',
                description: 'Month-long programs that adapt to your fitness level and available equipment.',
                gradient: 'from-fitness-secondary to-green-600',
                delay: '0.1s'
              },
              {
                icon: Apple,
                title: '7-Day Diet Plans',
                description: 'Personalized meal plans with nutritional guidance for your goals.',
                gradient: 'from-fitness-accent to-yellow-600',
                delay: '0.2s'
              },
              {
                icon: Apple,
                title: 'AI Food Tracker',
                description: 'Log meals with photos and track nutrition automatically using AI.',
                gradient: 'from-blue-500 to-indigo-600',
                delay: '0.3s'
              },
              {
                icon: MessageCircle,
                title: 'AI Fitness Coach',
                description: 'Get instant answers to fitness questions 24/7.',
                gradient: 'from-green-500 to-emerald-600',
                delay: '0.4s'
              },
              {
                icon: BookOpen,
                title: 'Fitness Blogs',
                description: 'Simple tips for a healthier lifestyle.',
                gradient: 'from-purple-500 to-pink-600',
                delay: '0.5s'
              }
            ].map((feature, idx) => (
              <Card 
                key={idx} 
                className="group relative overflow-hidden border-2 border-transparent hover:border-gray-200 bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: feature.delay }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <CardHeader className="pb-4 relative">
                  <div className={`mx-auto bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold mb-2 group-hover:text-fitness-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-gray-600 font-medium">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                
                {/* Decorative corner accent */}
                <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`}></div>
              </Card>
            ))}
          </div>
        </div>

        {/* Curved Transition */}
        <div className="relative w-full overflow-hidden">
          <svg className="relative block w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-white"></path>
          </svg>
        </div>

        {/* About the Founder - Angled Section */}
        <div className="relative bg-white py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-5xl font-black text-gray-900 mb-4">
                About the Founder
              </h3>
            </div>

            <div className="relative">
              {/* Tilted background accent */}
              <div className="absolute -inset-4 bg-gradient-to-r from-fitness-primary/5 to-fitness-secondary/5 transform -rotate-1 rounded-3xl"></div>
              
              <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-fitness-primary/10 to-fitness-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img
                      src={founderSrc}
                      alt="Vatsal Agarwala - Founder of QuickFit"
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                      onError={handleFounderImgError}
                    />
                  </div>
                  <div className="p-10 flex flex-col justify-center space-y-6">
                    <h4 className="text-3xl font-bold text-gray-900">Vatsal Agarwala</h4>
                    <p className="text-fitness-primary font-bold text-lg tracking-wide text-center">
                      🎉 Get Vatsal's workout & diet plan <span className="underline">FREE</span> when you sign up!
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Created by Vatsal Agarwala, a 15-year-old from Luxembourg who started his fitness journey at 13. After trying countless apps and videos, he built QuickFit to make fitness simple for everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

       {/* Reviews Section */}
<div className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #dcfce7 100%)' }}>
  {/* Dot Pattern Overlay */}
  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <span className="text-fitness-accent font-bold text-sm tracking-widest uppercase bg-fitness-accent/20 px-6 py-2 rounded-full">
        Reviews
      </span>
      <h3 className="text-5xl font-black text-gray-900 mt-6">
        What Our Users Say
      </h3>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          name: 'Andrew',
          role: 'Student',
          text: 'Clear, well organised. I like the weight tracker.',
        },
        {
          name: 'Nina',
          role: 'Mother',
          text: 'Easy to use and navigate.',
        },
        {
          name: 'Harshit',
          role: 'Student',
          text: 'Liked how so many features were there for free, even the AI fitness chatbot.',
        },
        {
          name: 'Vedika',
          role: 'Housewife',
          text: 'The exercise animations make it so much easier to workout. I like the fitness blogs!',
        },
      ].map((review, idx) => (
        <Card
          key={idx}
          className="group bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-scale-in"
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <CardContent className="flex flex-col items-center text-center p-6">
            <div className="mb-4 w-16 h-16 rounded-full bg-fitness-primary/10 flex items-center justify-center text-2xl font-bold text-fitness-primary">
              {review.name[0]}
            </div>
            <p className="text-gray-900 font-semibold text-lg">{review.name}</p>
            <p className="text-gray-500 text-sm mb-4">{review.role}</p>
            <CardDescription className="text-base leading-relaxed font-medium text-gray-700">
              "{review.text}"
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</div>

{/* Tailwind animation */}
<style>{`
  @keyframes scale-in {
    0% { opacity: 0; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }
  .animate-scale-in {
    animation: scale-in 0.5s ease forwards;
  }
`}</style>


        {/* Final CTA with Gradient and Glow */}
        <div className="relative py-24 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-fitness-primary via-fitness-secondary to-fitness-accent opacity-95"></div>
          
          {/* Glowing orbs */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-glow"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1s' }}></div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-bold border border-white/30">
                <Sparkles className="h-4 w-4" />
                <span>Join the other Fitness Enthusiasts</span>
              </div>

              <h3 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                Ready to Transform Your
                <span className="block mt-2">Fitness Journey?</span>
              </h3>

              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                Join others who've made fitness simple with QuickFit's intelligent approach to workouts, nutrition, and progress tracking.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Link to="/auth" className="group">
                  <Button size="lg" className="relative bg-white text-fitness-primary hover:bg-gray-50 px-16 py-8 text-xl font-bold shadow-2xl shadow-black/20 overflow-hidden transition-all duration-300 hover:scale-110">
                    <span className="relative z-10 flex items-center gap-3">
                      Start Your Free Journey
                      <TrendingUp className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-8 text-base text-white/80 font-semibold">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  No subscription required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Instant access
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Works on any device
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-fitness-dark text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-base font-semibold mb-4">© 2025 QuickFit. Sculpted by Vatsal Agarwala.</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/70">
            <a href="/" className="hover:text-white transition-colors duration-300 font-medium">Home</a>
            <a href="/privacy-policy" className="hover:text-white transition-colors duration-300 font-medium">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-white transition-colors duration-300 font-medium">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
