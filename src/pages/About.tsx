
import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            About <span className="text-fitness-primary">QuickFit</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            QuickFit is your personal fitness companion, designed to make working out accessible, 
            convenient, and enjoyable for everyone. Whether you have 10 minutes or an hour, 
            whether you're at home or in the gym, QuickFit creates personalized workouts that 
            fit your schedule, equipment, and fitness goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-fitness-primary">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To make fitness accessible to everyone, regardless of their experience level, 
                available time, or equipment. We believe that consistency beats perfection, 
                and every workout counts towards your fitness journey.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-fitness-primary">What Makes Us Different</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-600 space-y-2">
                <li>• Instant workout generation based on your available time</li>
                <li>• Equipment-flexible routines from bodyweight to full gym</li>
                <li>• 30-day structured workout plans</li>
                <li>• AI-powered fitness coaching and support</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Meet the Founder</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png" 
                alt="Vatsal Agarwala" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-fitness-primary mb-2">Vatsal Agarwala</h3>
              <p className="text-gray-500 mb-4">Founder & CEO, Age 15</p>
            </div>
            
            <div className="text-left max-w-3xl mx-auto space-y-4 text-gray-600">
              <p>
                QuickFit was founded by Vatsal Agarwala, a 15-year-old from Luxembourg with a deep 
                passion for fitness and helping others get started.
              </p>
              
              <p>
                Vatsal's journey began at just 13 years old, training in his home garage using nothing 
                but bodyweight exercises and a pair of spare car tyres as makeshift equipment. Determined 
                to push further, he slowly added a dumbbell and a pull-up bar to his routine, teaching 
                himself discipline and creativity along the way.
              </p>
              
              <p>
                At 14, Vatsal finally stepped into a real gym, where he transformed his self-taught 
                discipline into structured training. Now, at 15, he has built QuickFit — an app designed 
                to make it easier, friendlier, and more personal for anyone to begin their fitness journey, 
                just like he did.
              </p>
              
              <p className="text-fitness-primary font-medium text-center mt-6">
                QuickFit isn't just an app; it's a reflection of Vatsal's belief that anyone, anywhere, 
                with any resources can start getting stronger and healthier today.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default About;
