
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Clock, Target, Zap, Calendar, MessageCircle, Scale, Apple, BarChart3, CheckCircle } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png" 
                alt="QuickFit Logo" 
                className="w-8 h-8"
              />
              <h1 className="text-2xl font-bold text-fitness-primary">QuickFit</h1>
            </div>
            <Link to="/auth">
              <Button className="bg-fitness-primary hover:bg-fitness-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
              Your Complete
              <span className="block text-fitness-primary mt-2">Fitness Companion</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Everything you need to reach your fitness goals: instant workouts, 30-day plans, 
              nutrition guidance, progress tracking, and AI coaching—all in one powerful app.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/auth">
                <Button size="lg" className="bg-fitness-primary hover:bg-fitness-primary/90 text-lg px-12 py-4 font-semibold">
                  Start Free Today
                </Button>
              </Link>
              <p className="text-sm text-gray-500">No credit card required • Get started in 2 minutes</p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Instant workout generation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>30-day personalized plans</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>AI fitness coaching</span>
              </div>
            </div>
          </div>

          {/* Core Features */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Everything You Need to Succeed
            </h3>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              QuickFit combines intelligent workout generation, comprehensive planning, 
              and smart tracking to make fitness simple and effective.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-fitness-primary/30 bg-white">
                <CardHeader className="pb-4">
                  <div className="mx-auto bg-gradient-to-br from-fitness-primary to-fitness-primary/80 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Instant Workouts</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Generate personalized workouts in seconds. Choose your time, equipment, 
                    target muscles, and intensity—get a complete routine instantly.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-fitness-secondary/30 bg-white">
                <CardHeader className="pb-4">
                  <div className="mx-auto bg-gradient-to-br from-fitness-secondary to-fitness-secondary/80 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Calendar className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">30-Day Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Complete month-long workout programs tailored to your goals. 
                    Progressive training that adapts to your fitness level and equipment.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-fitness-accent/30 bg-white">
                <CardHeader className="pb-4">
                  <div className="mx-auto bg-gradient-to-br from-fitness-accent to-fitness-accent/80 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Apple className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">7-Day Diet Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Personalized nutrition plans that complement your workouts. 
                    Meal suggestions and dietary guidance for optimal results.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500/30 bg-white">
                <CardHeader className="pb-4">
                  <div className="mx-auto bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Scale className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Weight Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Monitor your progress with intuitive weight tracking. 
                    Visualize your journey with charts and milestone celebrations.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500/30 bg-white">
                <CardHeader className="pb-4">
                  <div className="mx-auto bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <MessageCircle className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">AI Fitness Coach</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Get instant answers to fitness questions. Form tips, nutrition advice, 
                    and motivation—your personal trainer available 24/7.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

        {/* About the Founder */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-6">
            About the Founder
          </h3>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg border p-6 md:p-10">
              <div className="w-full max-w-md mb-6">
                <img
                  src="/lovable-uploads/vatsal-agarwala-founder.jpg"
                  alt="Vatsal Agarwala - Founder of QuickFit"
                  className="w-full h-auto rounded-xl object-cover shadow-md"
                />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                QuickFit was created by Vatsal Agarwala, a 15-year-old student, athlete, and AI enthusiast based in Luxembourg. Vatsal began his fitness journey at the age of 13. After trying multiple fitness apps, watching countless YouTube videos, and reading numerous fitness articles, he ended up even more confused. However, the best thing he did was not giving up. He did what suited his body, pushed to the limits, ate healthy, and the result is above. That's why he created QuickFit - to help people stay active and healthy, whether they’re beginners, office goers or anyone for that matter.
              </p>
            </div>
          </div>
        </div>

          {/* Why Choose QuickFit */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <Card className="text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-white to-gray-50">
              <CardHeader>
                <div className="mx-auto bg-fitness-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-fitness-primary" />
                </div>
                <CardTitle className="text-lg">Any Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  10-minute quickies to full 90-minute sessions. Workouts that adapt to your time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-white to-gray-50">
              <CardHeader>
                <div className="mx-auto bg-fitness-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Dumbbell className="h-8 w-8 text-fitness-secondary" />
                </div>
                <CardTitle className="text-lg">Any Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Bodyweight only, home gym, or full commercial gym—we've got you covered.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-white to-gray-50">
              <CardHeader>
                <div className="mx-auto bg-fitness-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-fitness-accent" />
                </div>
                <CardTitle className="text-lg">Your Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Strength, endurance, weight loss, or athletic performance—tailored to you.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-white to-gray-50">
              <CardHeader>
                <div className="mx-auto bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-lg">Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor improvements with detailed analytics and milestone tracking.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Final CTA Section */}
          <div className="text-center bg-gradient-to-r from-fitness-primary to-fitness-secondary rounded-3xl p-12 shadow-2xl text-white">
            <h3 className="text-4xl font-bold mb-6">
              Ready to Transform Your Fitness Journey?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands who've made fitness simple with QuickFit's intelligent approach to workouts, nutrition, and progress tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="bg-white text-fitness-primary hover:bg-gray-100 px-12 py-4 text-lg font-semibold">
                  Start Your Free Journey
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-80">
              <span>✓ No subscription required</span>
              <span>✓ Instant access</span>
              <span>✓ Works on any device</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-fitness-dark text-white py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>© 2025 QuickFit. Sculpted by Vatsal Agarwala.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
