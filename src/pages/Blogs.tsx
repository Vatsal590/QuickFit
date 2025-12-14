import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslation } from "@/contexts/TranslationContext";

const blogsData = [
  {
    id: 1,
    title: "General advice for office goers",
    description: "Stay active and healthy despite long hours at your desk",
    content: (
      <>
        <p className="text-muted-foreground">
          Working long hours at a desk can take a toll on your body. Prolonged sitting often leads to stiff hips, tight shoulders, lower back pain, and overall fatigue. But with a few simple changes to your daily routine, you can stay active, mobile, and healthy—even with a sitting job.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">1. Hip Flexor Exercises</h2>
        <p className="text-muted-foreground mb-3">
          Sitting keeps your hip flexors shortened for hours, which can cause stiffness and even back pain. Try these quick fixes:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Standing Hip Flexor Stretch:</strong> Step one leg back, bend your front knee, and push your hips forward. Hold for 30 seconds each side.</li>
          <li><strong>Kneeling Lunge Stretch:</strong> From a lunge position on one knee, gently press your hips forward while keeping your torso upright.</li>
          <li><strong>Glute Bridges:</strong> Lie on your back, bend your knees, and push your hips up. Hold for 2–3 seconds, repeat 10–12 times.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">2. Lower Back Care</h2>
        <p className="text-muted-foreground mb-3">
          Your back is under constant stress when sitting with poor posture. Strengthening and stretching helps.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Cat-Cow Stretch:</strong> On all fours, alternate arching and rounding your back.</li>
          <li><strong>Seated Forward Fold:</strong> While seated, slowly bend forward to stretch your lower back.</li>
          <li><strong>Core Activation:</strong> Add planks or side planks a few times per week to support your spine.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">3. Move Every Hour</h2>
        <p className="text-muted-foreground mb-3">
          Set a timer or reminder to stand up and move every 50–60 minutes. You don't need a full workout—just simple actions:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Walk to get water.</li>
          <li>Do 10 bodyweight squats.</li>
          <li>Stretch your arms overhead and rotate your shoulders.</li>
          <li>Take a short stroll if possible.</li>
        </ul>
        <p className="text-muted-foreground mt-3">
          Movement breaks reset your posture, improve blood flow, and keep energy levels high.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">4. Healthy Lifestyle Habits at Work</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Posture Setup:</strong> Keep your monitor at eye level, feet flat on the ground, and shoulders relaxed.</li>
          <li><strong>Stay Hydrated:</strong> Water over coffee—aim for at least 2 liters daily.</li>
          <li><strong>Snack Smart:</strong> Choose nuts, fruits, or yogurt instead of chips or sweets.</li>
          <li><strong>Walk More:</strong> Take stairs, walk during phone calls, or park further away.</li>
          <li><strong>Active Commute:</strong> If possible, bike or walk part of your journey to work.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">Final Thoughts</h2>
        <p className="text-muted-foreground">
          Your desk job doesn't have to mean poor health. By adding simple hip flexor stretches, lower back exercises, and hourly movement breaks, you can prevent stiffness and pain. Combine these with small lifestyle tweaks—hydration, posture, and smart snacking—and you'll feel healthier, more energetic, and more productive every day.
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: "How to lose fat and gain muscle",
    description: "Master body recomposition with the right balance of training, nutrition, and recovery",
    content: (
      <>
        <p className="text-muted-foreground">
          Losing fat and gaining muscle at the same time is called body recomposition. It's possible if you balance training, nutrition, and recovery the right way.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">1. Prioritize Strength Training</h2>
        <p className="text-muted-foreground">
          Focus on resistance training 3–5 times per week. Compound movements like squats, deadlifts, bench presses, and pull-ups are the most effective for stimulating muscle growth.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">2. Eat Enough Protein</h2>
        <p className="text-muted-foreground">
          Protein repairs and builds muscle. Aim for 1.6–2.2g of protein per kg of body weight daily. Choose lean meats, fish, eggs, dairy, beans, or plant-based sources.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">3. Be in a Slight Calorie Deficit</h2>
        <p className="text-muted-foreground">
          To burn fat, you need to eat fewer calories than you burn — but not too few. A small deficit of 200–400 calories/day is enough to shed fat without sacrificing muscle.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">4. Do Cardio Wisely</h2>
        <p className="text-muted-foreground">
          Add 2–3 sessions of cardio per week. Low to moderate intensity (walking, cycling, swimming) helps burn calories without harming recovery.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">5. Stay Consistent and Patient</h2>
        <p className="text-muted-foreground mb-3">
          Body recomposition takes time. Track progress using photos, strength gains, and measurements — not just the scale.
        </p>

        <p className="text-muted-foreground font-semibold mt-6">
          💡 Pro tip: Beginners often see results faster since their bodies adapt quickly to new training and nutrition habits.
        </p>

        <p className="text-muted-foreground mt-4">
          By combining structured workouts, smart eating, and proper recovery, you can lose fat and gain lean muscle at the same time.
        </p>
      </>
    ),
  },
];

const Blogs = () => {
  const { t } = useTranslation();
  const [selectedBlog, setSelectedBlog] = useState<typeof blogsData[0] | null>(null);

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-block">
            <span className="text-fitness-primary font-bold text-sm tracking-widest uppercase bg-fitness-primary/10 px-6 py-2 rounded-full">
              {t('Health & Fitness')}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900">
            {t('Fitness Blogs')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            {t('Expert tips and advice for a healthier, stronger you')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogsData.map((blog, idx) => (
            <Card
              key={blog.id}
              className="group cursor-pointer border-2 border-transparent hover:border-fitness-primary/20 bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => setSelectedBlog(blog)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fitness-primary/5 to-fitness-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-fitness-primary to-fitness-secondary rounded-xl flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <span className="text-2xl font-bold text-white">
                    {blog.id}
                  </span>
                </div>
                <CardTitle className="text-2xl font-bold mb-3 group-hover:text-fitness-primary transition-colors duration-300">
                  {blog.title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed text-gray-600 font-medium">
                  {blog.description}
                </CardDescription>
                <div className="mt-6 text-fitness-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                  {t('Read more')}
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </CardHeader>
              
              {/* Decorative corner */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-fitness-primary to-fitness-secondary opacity-5 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
        <DialogContent className="max-w-4xl w-[92vw] md:w-auto max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md border-2">
          <DialogHeader className="border-b pb-6">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
              {selectedBlog?.title}
            </DialogTitle>
            <DialogDescription className="sr-only">{t('Full article content')}</DialogDescription>
          </DialogHeader>
          <div className="prose prose-slate prose-lg dark:prose-invert max-w-none pb-6 pt-6">
            {selectedBlog?.content}
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Blogs;
