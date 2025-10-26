// Utility function to get exercise animation URLs
export const getExerciseAnimationUrl = (exerciseName: string): string => {
  const normalizedName = exerciseName.toLowerCase().trim();
  
  const exerciseMap: { [key: string]: string } = {
    // Functional exercises
    'burpees': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/10/burpee.gif',
    'burpee': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/10/burpee.gif',
    'box jumps': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/02/box-jump.gif',
    'box jump': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/02/box-jump.gif',
    'battle ropes': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/battle-rope-slam.gif',
    'battle rope': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/battle-rope-slam.gif',
    'kettlebell swings': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/03/kettlebell-swing.gif',
    'kettlebell swing': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/03/kettlebell-swing.gif',
    'medicine ball slams': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/medicine-ball-slam.gif',
    'medicine ball slam': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/medicine-ball-slam.gif',
    'farmer\'s walk': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/12/farmers-walk.gif',
    'farmers walk': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/12/farmers-walk.gif',
    'sled push': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/11/prowler-sled-push.gif',
    'sled pushes': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/11/prowler-sled-push.gif',
    'tire flips': 'https://www.inspireusafoundation.org/file/2022/12/tire-flip.gif',
    'tire flip': 'https://www.inspireusafoundation.org/file/2022/12/tire-flip.gif',
    'bear crawl': 'https://www.inspireusafoundation.org/file/2022/12/bear-crawl.gif',
    'bear crawls': 'https://www.inspireusafoundation.org/file/2022/12/bear-crawl.gif',
    'turkish get-up': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/kettlebell-turkish-getup.gif',
    'turkish get-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/kettlebell-turkish-getup.gif',
    'wall balls': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/wall-ball.gif',
    'wall ball': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/wall-ball.gif',
    'rowing machine': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/rowing-machine.gif',
    'jump rope': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/06/jump-rope.gif',
    'jump ropes': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/06/jump-rope.gif',
    'thruster': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/dumbbell-thruster.gif',
    'thrusters': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/dumbbell-thruster.gif',
    
    // Push-ups
    'push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif',
    'push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif',
    'pushups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif',
    'standard push-ups': 'https://www.inspireusafoundation.org/file/2023/04/incline-push-up-bench.gif',
    'incline push-ups': 'https://www.inspireusafoundation.org/file/2023/04/incline-push-up-bench.gif',
    'incline push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Push-Up.gif',
    'diamond push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/diamond-pushup.gif',
    'diamond push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/diamond-pushup.gif',
    
    // Back exercises
    'pull-ups': 'https://www.inspireusafoundation.org/file/2022/11/pull-up.gif',
    'pull ups': 'https://www.inspireusafoundation.org/file/2022/11/pull-up.gif',
    'pullups': 'https://www.inspireusafoundation.org/file/2022/11/pull-up.gif',
    
    // Legs
    'squats': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/06/bodyweight-squat.gif',
    'bodyweight squats': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/06/bodyweight-squat.gif',
    'lunges': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/dumbbell-lunges.gif',
    
    // Core
    'plank': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif',
    'planks': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif',
    'mountain climbers': 'https://i.pinimg.com/originals/fb/fa/09/fbfa0902f381a5735972c21255935aff.gif',
    'mountain climber': 'https://i.pinimg.com/originals/fb/fa/09/fbfa0902f381a5735972c21255935aff.gif',
  };

  return exerciseMap[normalizedName] || 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif';
};
