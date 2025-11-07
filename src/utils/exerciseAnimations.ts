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
    
    // Shoulders
    'pike push-up': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
    'pike push-ups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
    'pike pushup': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
    'pike pushups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
    'hindu push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
    'hindu push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
    'hindu pushup': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
    'hindu pushups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
    
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
    
    // Biceps
    'sitting bicep curls': 'https://fitliferegime.com/wp-content/uploads/2023/06/Bodyweight-Bicep-Curl.gif',
    'sitting bicep curl': 'https://fitliferegime.com/wp-content/uploads/2023/06/Bodyweight-Bicep-Curl.gif',
    'sitting-bicep-curls': 'https://fitliferegime.com/wp-content/uploads/2023/06/Bodyweight-Bicep-Curl.gif',
    'sitting-bicep-curl': 'https://fitliferegime.com/wp-content/uploads/2023/06/Bodyweight-Bicep-Curl.gif',
    'bag curls': 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/07/400x400_Biceps_Workouts_At_Home_Backpack_Curls.gif?h=840',
    'bag curl': 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/07/400x400_Biceps_Workouts_At_Home_Backpack_Curls.gif?h=840',
    'backpack curls': 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/07/400x400_Biceps_Workouts_At_Home_Backpack_Curls.gif?h=840',
    'backpack curl': 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/07/400x400_Biceps_Workouts_At_Home_Backpack_Curls.gif?h=840',
    
    // Cable machine exercises
    'cable bicep curl': 'https://gymvisual.com/img/p/2/8/1/2/0/28120.gif',
    'cable bicep curls': 'https://gymvisual.com/img/p/2/8/1/2/0/28120.gif',
    'cable machine bicep curl': 'https://gymvisual.com/img/p/2/8/1/2/0/28120.gif',
    'cable machine bicep curls': 'https://gymvisual.com/img/p/2/8/1/2/0/28120.gif',
    'cable hammer curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/rope-bicep-curls.gif',
    'cable hammer curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/rope-bicep-curls.gif',
    'cable bicep hammer curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/rope-bicep-curls.gif',
    'cable bicep hammer curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/rope-bicep-curls.gif',
    'cable pulldown': 'https://i.pinimg.com/originals/74/68/5a/74685a8a1b44b902c9d3ac1404844e88.gif',
    'cable pulldowns': 'https://i.pinimg.com/originals/74/68/5a/74685a8a1b44b902c9d3ac1404844e88.gif',
  };

  return exerciseMap[normalizedName] || 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif';
};
