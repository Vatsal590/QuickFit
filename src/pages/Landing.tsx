
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Clock, Target, Zap, Calendar, MessageCircle } from 'lucide-react';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Complete
              <span className="text-fitness-primary"> Fitness Solution</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create personalized 30-day workout plans, generate instant workouts, and get expert fitness advice with our AI chatbot—all tailored to your goals and equipment.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-fitness-primary hover:bg-fitness-primary/90 text-lg px-8 py-3">
                Start Your Journey
              </Button>
            </Link>
          </div>

          {/* Main Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow border-2 hover:border-fitness-primary/20">
              <CardHeader>
                <div className="mx-auto bg-fitness-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-fitness-primary" />
                </div>
                <CardTitle className="text-xl">30-Day Workout Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get a complete month-long personalized workout program designed around your fitness goals and available equipment.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-2 hover:border-fitness-secondary/20">
              <CardHeader>
                <div className="mx-auto bg-fitness-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-fitness-secondary" />
                </div>
                <CardTitle className="text-xl">Instant Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Need a quick workout? Generate personalized routines in seconds based on your time, equipment, target muscles and intensity.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-2 hover:border-fitness-accent/20">
              <CardHeader>
                <div className="mx-auto bg-fitness-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="h-8 w-8 text-fitness-accent" />
                </div>
                <CardTitle className="text-xl">AI Fitness Coach</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Ask our AI chatbot any fitness question—from form tips to nutrition advice. Get guidance 24/7.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-fitness-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-fitness-primary" />
                </div>
                <CardTitle className="text-lg">Time-Based</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  From 10-minute quickies to full hour sessions—workouts that fit your schedule.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-fitness-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Dumbbell className="h-6 w-6 text-fitness-secondary" />
                </div>
                <CardTitle className="text-lg">Equipment Smart</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Works with any equipment setup—from bodyweight to full gym access.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-fitness-accent/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-fitness-accent" />
                </div>
                <CardTitle className="text-lg">Goal-Oriented</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Focused workouts for strength, athlete-style, or weight loss goals.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-fitness-dark/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-fitness-dark" />
                </div>
                <CardTitle className="text-lg">Start Instantly</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get your personalized workout plan in seconds, ready to start immediately.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Fitness?
            </h3>
            <p className="text-gray-600 mb-6">
              Join others who've made fitness simple with personalized plans and instant workouts.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-fitness-primary hover:bg-fitness-primary/90">
                Get started for free
              </Button>
            </Link>
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
