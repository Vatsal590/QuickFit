import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
];

const Blogs = () => {
  const [selectedBlog, setSelectedBlog] = useState<typeof blogsData[0] | null>(null);

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Blogs</h1>
          <p className="text-muted-foreground">Tips and advice for a healthier lifestyle</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogsData.map((blog) => (
            <Card
              key={blog.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedBlog(blog)}
            >
              <CardHeader>
                <CardTitle className="text-xl">{blog.title}</CardTitle>
                <CardDescription>{blog.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedBlog?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-full pr-4">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {selectedBlog?.content}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Blogs;
