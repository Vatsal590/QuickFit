import React, { createContext, useContext, useState, useEffect } from 'react';

interface TranslationContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('selectedLanguage') || 'English';
  });
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    localStorage.setItem('selectedLanguage', language);
    loadTranslations(language);
  }, [language]);

  const loadTranslations = async (lang: string) => {
    try {
      // If English, use the default keys
      if (lang === 'English') {
        setTranslations({});
        return;
      }

      // For other languages, we'll use a simple translation service
      const translationMap = await getTranslationsForLanguage(lang);
      setTranslations(translationMap);
    } catch (error) {
      console.error('Failed to load translations:', error);
      setTranslations({});
    }
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Complete translations for 3 languages with comprehensive coverage
const getTranslationsForLanguage = async (language: string): Promise<Record<string, string>> => {
  const translationMaps: Record<string, Record<string, string>> = {
    'Spanish': {
      // Navigation & Profile
      'Home': 'Inicio',
      'History': 'Historial',
      'Profile': 'Perfil',
      'About': 'Acerca de',
      'Language': 'Idioma',
      'Customize': 'Personalizar',
      'Privacy Policy': 'Política de Privacidad',
      'Terms of Conditions': 'Términos y Condiciones',
      'Sign Out': 'Cerrar Sesión',
      'Remove Account': 'Eliminar Cuenta',
      'Member since': 'Miembro desde',
      'Delete Account': 'Eliminar Cuenta',
      'Cancel': 'Cancelar',
      'Deleting...': 'Eliminando...',
      'Unknown': 'Desconocido',
      'Are you sure you want to permanently delete your account? This action cannot be undone and will:': '¿Estás seguro de que quieres eliminar permanentemente tu cuenta? Esta acción no se puede deshacer y:',
      'Delete all your workout plans and history': 'Eliminará todos tus planes de entrenamiento e historial',
      'Remove your fitness profile': 'Eliminará tu perfil de fitness',
      'Permanently delete your account': 'Eliminará permanentemente tu cuenta',
      'Prevent you from signing in with this email again': 'Te impedirá iniciar sesión con este email nuevamente',

      // Authentication
      'Welcome Back': 'Bienvenido de Vuelta',
      'Get Started': 'Comenzar',
      'Sign in to your QuickFit account': 'Inicia sesión en tu cuenta de QuickFit',
      'Create your QuickFit account': 'Crea tu cuenta de QuickFit',
      'Full Name': 'Nombre Completo',
      'Enter your full name': 'Ingresa tu nombre completo',
      'Email': 'Correo Electrónico',
      'Enter your email': 'Ingresa tu correo electrónico',
      'Password': 'Contraseña',
      'Enter your password': 'Ingresa tu contraseña',
      'Sign In': 'Iniciar Sesión',
      'Create Account': 'Crear Cuenta',
      'By creating an account, you accept our': 'Al crear una cuenta, aceptas nuestra',
      'and': 'y',
      "Don't have an account? Sign up": '¿No tienes una cuenta? Regístrate',
      'Already have an account? Sign in': '¿Ya tienes una cuenta? Inicia sesión',

      // Home Page
      'Custom Workout Generator': 'Generador de Entrenamientos Personalizados',
      'Generate instant custom workouts based on your available time, equipment, and target muscle groups.': 'Genera entrenamientos personalizados instantáneos basados en tu tiempo disponible, equipo y grupos musculares objetivo.',
      'Perfect for quick sessions when you need a workout right now.': 'Perfecto para sesiones rápidas cuando necesitas un entrenamiento ahora mismo.',

      // Workout Plans
      'My 30-Day Workout Plans': 'Mis Planes de Entrenamiento de 30 Días',
      'Generate Workout Plan': 'Generar Plan de Entrenamiento',
      'Start Plan': 'Comenzar Plan',
      'Continue Plan': 'Continuar Plan',
      'Day': 'Día',
      'Rest Day': 'Día de Descanso',
      'Complete': 'Completar',
      'Mark as Complete': 'Marcar como Completado',
      'Completed': 'Completado',
      'Delete Plan': 'Eliminar Plan',
      'Are you sure you want to delete this workout plan?': '¿Estás seguro de que quieres eliminar este plan de entrenamiento?',
      'This action cannot be undone.': 'Esta acción no se puede deshacer.',
      'No workout plans yet': 'No hay planes de entrenamiento aún',
      'Create your first 30-day workout plan to get started on your fitness journey!': '¡Crea tu primer plan de entrenamiento de 30 días para comenzar tu viaje de fitness!',
      'Create Plan': 'Crear Plan',
      'days': 'días',

      // Workout Form
      'Create Your Workout': 'Crea Tu Entrenamiento',
      'Tell us what you have available and we\'ll generate the perfect workout for you': 'Dinos qué tienes disponible y generaremos el entrenamiento perfecto para ti',
      'Time Available': 'Tiempo Disponible',
      'Available Equipment': 'Equipo Disponible',
      'What to Train Today': 'Qué Entrenar Hoy',
      'Workout Intensity': 'Intensidad del Entrenamiento',
      'Generate Workout': 'Generar Entrenamiento',
      'Equipment required': 'Equipo requerido',
      'Select at least one equipment option': 'Selecciona al menos una opción de equipo',
      'Muscle group required': 'Grupo muscular requerido',
      'Select at least one muscle group to train': 'Selecciona al menos un grupo muscular para entrenar',

      // Equipment Options
      'No Equipment': 'Sin Equipo',
      'Dumbbells': 'Mancuernas',
      'Barbell': 'Barra',
      'Kettlebell': 'Pesa Rusa',
      'Resistance Bands': 'Bandas de Resistencia',
      'Cable Machine': 'Máquina de Cable',
      'Bench': 'Banco',
      'Pull-up Bar': 'Barra de Dominadas',

      // Muscle Groups
      'Chest': 'Pecho',
      'Back': 'Espalda',
      'Shoulders': 'Hombros',
      'Legs': 'Piernas',
      'Biceps': 'Bíceps',
      'Triceps': 'Tríceps',
      'Core': 'Core',
      'Full Body': 'Cuerpo Completo',
      'Cardio': 'Cardio',

      // Intensity Levels
      'Light': 'Ligero',
      'Moderate': 'Moderado',
      'Intense': 'Intenso',
      'Recovery or beginner friendly workout': 'Entrenamiento de recuperación o para principiantes',
      'Standard workout with balanced effort': 'Entrenamiento estándar con esfuerzo equilibrado',
      'Challenging workout with higher intensity': 'Entrenamiento desafiante con mayor intensidad',

      // History Page
      'Your Workout History': 'Tu Historial de Entrenamientos',
      'Workout History': 'Historial de Entrenamientos',
      'You haven\'t completed any workouts yet': 'Aún no has completado ningún entrenamiento',
      'No workout history yet': 'No hay historial de entrenamientos aún',
      'Generate your first workout and complete it to start tracking your progress': 'Genera tu primer entrenamiento y complétalo para comenzar a rastrear tu progreso',
      'Track your workout progress over time': 'Rastrea tu progreso de entrenamiento a lo largo del tiempo',
      'View Details': 'Ver Detalles',
      'No equipment': 'Sin equipo',
      'Multiple': 'Múltiple',
      'Create Your First Workout': 'Crea Tu Primer Entrenamiento',
      'Start by creating a workout and completing it to track your progress over time.': 'Comienza creando un entrenamiento y completándolo para rastrear tu progreso a lo largo del tiempo.',

      // About Page
      'Your Complete': 'Tu Solución',
      'Fitness Solution': 'de Fitness Completa',
      'QuickFit is your personal fitness companion, designed to make working out accessible, convenient, and enjoyable for everyone. Whether you have 10 minutes or an hour, whether you\'re at home or in the gym, QuickFit creates personalized workouts that fit your schedule, equipment, and fitness goals.': 'QuickFit es tu compañero personal de fitness, diseñado para hacer que el ejercicio sea accesible, conveniente y agradable para todos. Ya sea que tengas 10 minutos o una hora, ya sea que estés en casa o en el gimnasio, QuickFit crea entrenamientos personalizados que se adaptan a tu horario, equipo y objetivos de fitness.',
      'Our Mission': 'Nuestra Misión',
      'To make fitness accessible to everyone, regardless of their experience level, available time, or equipment. We believe that consistency beats perfection, and every workout counts towards your fitness journey.': 'Hacer que el fitness sea accesible para todos, independientemente de su nivel de experiencia, tiempo disponible o equipo. Creemos que la consistencia supera a la perfección, y cada entrenamiento cuenta hacia tu viaje de fitness.',
      'What Makes Us Different': 'Qué Nos Hace Diferentes',
      '• Instant workout generation based on your available time': '• Generación instantánea de entrenamientos basada en tu tiempo disponible',
      '• Equipment-flexible routines from bodyweight to full gym': '• Rutinas flexibles de equipo desde peso corporal hasta gimnasio completo',
      '• 30-day structured workout plans': '• Planes de entrenamiento estructurados de 30 días',
      '• AI-powered fitness coaching and support': '• Entrenamiento y soporte de fitness impulsado por IA',
      'Meet the Founder': 'Conoce al Fundador',
      'Founder & CEO, Age 15': 'Fundador y CEO, 15 años',

      // Landing Page
      'Start Your Journey': 'Comienza Tu Viaje',
      '30-Day Workout Plans': 'Planes de Entrenamiento de 30 Días',
      'Get a complete month-long personalized workout program designed around your fitness goals and available equipment.': 'Obtén un programa completo de entrenamiento personalizado de un mes diseñado en torno a tus objetivos de fitness y equipo disponible.',
      'Instant Workouts': 'Entrenamientos Instantáneos',
      'Need a quick workout? Generate personalized routines in seconds based on your time, equipment, target muscles and intensity.': '¿Necesitas un entrenamiento rápido? Genera rutinas personalizadas en segundos basadas en tu tiempo, equipo, músculos objetivo e intensidad.',
      'AI Fitness Coach': 'Entrenador de Fitness IA',
      'Ask our AI chatbot any fitness question—from form tips to nutrition advice. Get guidance 24/7.': 'Pregunta a nuestro chatbot de IA cualquier pregunta sobre fitness—desde consejos de forma hasta consejos nutricionales. Obtén orientación 24/7.',
      'Time-Based': 'Basado en Tiempo',
      'From 10-minute quickies to full hour sessions—workouts that fit your schedule.': 'Desde sesiones rápidas de 10 minutos hasta sesiones completas de una hora—entrenamientos que se adaptan a tu horario.',
      'Equipment Smart': 'Inteligente con Equipo',
      'Works with any equipment setup—from bodyweight to full gym access.': 'Funciona con cualquier configuración de equipo—desde peso corporal hasta acceso completo al gimnasio.',
      'Goal-Oriented': 'Orientado a Objetivos',
      'Focused workouts for strength, athlete-style, or weight loss goals.': 'Entrenamientos enfocados para objetivos de fuerza, estilo atlético o pérdida de peso.',
      'Start Instantly': 'Comienza Instantáneamente',
      'Get your personalized workout plan in seconds, ready to start immediately.': 'Obtén tu plan de entrenamiento personalizado en segundos, listo para comenzar inmediatamente.',
      'Ready to Transform Your Fitness?': '¿Listo para Transformar tu Fitness?',
      'Join others who\'ve made fitness simple with personalized plans and instant workouts.': 'Únete a otros que han hecho el fitness simple con planes personalizados y entrenamientos instantáneos.',
      'Get started for free': 'Comienza gratis',

      // Language Selector
      'Select Language': 'Seleccionar Idioma',
      'Search languages...': 'Buscar idiomas...',

      // Common Words
      'min': 'min',
      'minutes': 'minutos',
      'seconds': 'segundos',
      'sets': 'series',
      'reps': 'repeticiones',
      'Workout': 'Entrenamiento',
    },

    'French': {
      // Navigation & Profile
      'Home': 'Accueil',
      'History': 'Historique',
      'Profile': 'Profil',
      'About': 'À propos',
      'Language': 'Langue',
      'Customize': 'Personnaliser',
      'Privacy Policy': 'Politique de Confidentialité',
      'Terms of Conditions': 'Conditions d\'Utilisation',
      'Sign Out': 'Se Déconnecter',
      'Remove Account': 'Supprimer le Compte',
      'Member since': 'Membre depuis',
      'Delete Account': 'Supprimer le Compte',
      'Cancel': 'Annuler',
      'Deleting...': 'Suppression...',
      'Unknown': 'Inconnu',
      'Are you sure you want to permanently delete your account? This action cannot be undone and will:': 'Êtes-vous sûr de vouloir supprimer définitivement votre compte? Cette action ne peut pas être annulée et va:',
      'Delete all your workout plans and history': 'Supprimer tous vos plans d\'entraînement et historique',
      'Remove your fitness profile': 'Supprimer votre profil de fitness',
      'Permanently delete your account': 'Supprimer définitivement votre compte',
      'Prevent you from signing in with this email again': 'Vous empêcher de vous connecter avec cet email à nouveau',

      // Authentication
      'Welcome Back': 'Bon Retour',
      'Get Started': 'Commencer',
      'Sign in to your QuickFit account': 'Connectez-vous à votre compte QuickFit',
      'Create your QuickFit account': 'Créez votre compte QuickFit',
      'Full Name': 'Nom Complet',
      'Enter your full name': 'Entrez votre nom complet',
      'Email': 'E-mail',
      'Enter your email': 'Entrez votre e-mail',
      'Password': 'Mot de Passe',
      'Enter your password': 'Entrez votre mot de passe',
      'Sign In': 'Se Connecter',
      'Create Account': 'Créer un Compte',
      'By creating an account, you accept our': 'En créant un compte, vous acceptez notre',
      'and': 'et',
      "Don't have an account? Sign up": 'Vous n\'avez pas de compte? Inscrivez-vous',
      'Already have an account? Sign in': 'Vous avez déjà un compte? Connectez-vous',

      // Home Page
      'Custom Workout Generator': 'Générateur d\'Entraînement Personnalisé',
      'Generate instant custom workouts based on your available time, equipment, and target muscle groups.': 'Générez des entraînements personnalisés instantanés basés sur votre temps disponible, équipement et groupes musculaires ciblés.',
      'Perfect for quick sessions when you need a workout right now.': 'Parfait pour des sessions rapides quand vous avez besoin d\'un entraînement maintenant.',

      // Workout Plans
      'My 30-Day Workout Plans': 'Mes Plans d\'Entraînement de 30 Jours',
      'Generate Workout Plan': 'Générer un Plan d\'Entraînement',
      'Start Plan': 'Commencer le Plan',
      'Continue Plan': 'Continuer le Plan',
      'Day': 'Jour',
      'Rest Day': 'Jour de Repos',
      'Complete': 'Terminer',
      'Mark as Complete': 'Marquer comme Terminé',
      'Completed': 'Terminé',
      'Delete Plan': 'Supprimer le Plan',
      'Are you sure you want to delete this workout plan?': 'Êtes-vous sûr de vouloir supprimer ce plan d\'entraînement?',
      'This action cannot be undone.': 'Cette action ne peut pas être annulée.',
      'No workout plans yet': 'Aucun plan d\'entraînement pour le moment',
      'Create your first 30-day workout plan to get started on your fitness journey!': 'Créez votre premier plan d\'entraînement de 30 jours pour commencer votre parcours de fitness!',
      'Create Plan': 'Créer un Plan',
      'days': 'jours',

      // Workout Form
      'Create Your Workout': 'Créez Votre Entraînement',
      'Tell us what you have available and we\'ll generate the perfect workout for you': 'Dites-nous ce que vous avez disponible et nous générerons l\'entraînement parfait pour vous',
      'Time Available': 'Temps Disponible',
      'Available Equipment': 'Équipement Disponible',
      'What to Train Today': 'Quoi Entraîner Aujourd\'hui',
      'Workout Intensity': 'Intensité de l\'Entraînement',
      'Generate Workout': 'Générer un Entraînement',
      'Equipment required': 'Équipement requis',
      'Select at least one equipment option': 'Sélectionnez au moins une option d\'équipement',
      'Muscle group required': 'Groupe musculaire requis',
      'Select at least one muscle group to train': 'Sélectionnez au moins un groupe musculaire à entraîner',

      // Equipment Options
      'No Equipment': 'Sans Équipement',
      'Dumbbells': 'Haltères',
      'Barbell': 'Barre',
      'Kettlebell': 'Kettlebell',
      'Resistance Bands': 'Bandes de Résistance',
      'Cable Machine': 'Machine à Câbles',
      'Bench': 'Banc',
      'Pull-up Bar': 'Barre de Traction',

      // Muscle Groups
      'Chest': 'Poitrine',
      'Back': 'Dos',
      'Shoulders': 'Épaules',
      'Legs': 'Jambes',
      'Biceps': 'Biceps',
      'Triceps': 'Triceps',
      'Core': 'Core',
      'Full Body': 'Corps Entier',
      'Cardio': 'Cardio',

      // Intensity Levels
      'Light': 'Léger',
      'Moderate': 'Modéré',
      'Intense': 'Intense',
      'Recovery or beginner friendly workout': 'Entraînement de récupération ou adapté aux débutants',
      'Standard workout with balanced effort': 'Entraînement standard avec effort équilibré',
      'Challenging workout with higher intensity': 'Entraînement difficile avec intensité plus élevée',

      // History Page
      'Your Workout History': 'Votre Historique d\'Entraînements',
      'Workout History': 'Historique d\'Entraînements',
      'You haven\'t completed any workouts yet': 'Vous n\'avez encore terminé aucun entraînement',
      'No workout history yet': 'Aucun historique d\'entraînement pour le moment',
      'Generate your first workout and complete it to start tracking your progress': 'Générez votre premier entraînement et terminez-le pour commencer à suivre vos progrès',
      'Track your workout progress over time': 'Suivez vos progrès d\'entraînement au fil du temps',
      'View Details': 'Voir les Détails',
      'No equipment': 'Sans équipement',
      'Multiple': 'Multiple',
      'Create Your First Workout': 'Créez Votre Premier Entraînement',
      'Start by creating a workout and completing it to track your progress over time.': 'Commencez par créer un entraînement et le terminer pour suivre vos progrès au fil du temps.',

      // About Page
      'Your Complete': 'Votre Solution',
      'Fitness Solution': 'de Fitness Complète',
      'QuickFit is your personal fitness companion, designed to make working out accessible, convenient, and enjoyable for everyone. Whether you have 10 minutes or an hour, whether you\'re at home or in the gym, QuickFit creates personalized workouts that fit your schedule, equipment, and fitness goals.': 'QuickFit est votre compagnon de fitness personnel, conçu pour rendre l\'exercice accessible, pratique et agréable pour tous. Que vous ayez 10 minutes ou une heure, que vous soyez à la maison ou à la salle de sport, QuickFit crée des entraînements personnalisés qui s\'adaptent à votre emploi du temps, votre équipement et vos objectifs de fitness.',
      'Our Mission': 'Notre Mission',
      'To make fitness accessible to everyone, regardless of their experience level, available time, or equipment. We believe that consistency beats perfection, and every workout counts towards your fitness journey.': 'Rendre le fitness accessible à tous, quel que soit leur niveau d\'expérience, le temps disponible ou l\'équipement. Nous croyons que la cohérence bat la perfection, et chaque entraînement compte pour votre parcours de fitness.',
      'What Makes Us Different': 'Ce Qui Nous Rend Différents',
      '• Instant workout generation based on your available time': '• Génération instantanée d\'entraînements basée sur votre temps disponible',
      '• Equipment-flexible routines from bodyweight to full gym': '• Routines flexibles d\'équipement du poids corporel à la salle complète',
      '• 30-day structured workout plans': '• Plans d\'entraînement structurés de 30 jours',
      '• AI-powered fitness coaching and support': '• Coaching et support de fitness alimentés par l\'IA',
      'Meet the Founder': 'Rencontrez le Fondateur',
      'Founder & CEO, Age 15': 'Fondateur et PDG, 15 ans',

      // Landing Page
      'Start Your Journey': 'Commencez Votre Parcours',
      '30-Day Workout Plans': 'Plans d\'Entraînement de 30 Jours',
      'Get a complete month-long personalized workout program designed around your fitness goals and available equipment.': 'Obtenez un programme d\'entraînement personnalisé complet d\'un mois conçu autour de vos objectifs de fitness et de votre équipement disponible.',
      'Instant Workouts': 'Entraînements Instantanés',
      'Need a quick workout? Generate personalized routines in seconds based on your time, equipment, target muscles and intensity.': 'Besoin d\'un entraînement rapide? Générez des routines personnalisées en secondes basées sur votre temps, équipement, muscles ciblés et intensité.',
      'AI Fitness Coach': 'Coach Fitness IA',
      'Ask our AI chatbot any fitness question—from form tips to nutrition advice. Get guidance 24/7.': 'Posez à notre chatbot IA toute question de fitness—des conseils de forme aux conseils nutritionnels. Obtenez des conseils 24/7.',
      'Time-Based': 'Basé sur le Temps',
      'From 10-minute quickies to full hour sessions—workouts that fit your schedule.': 'Des sessions rapides de 10 minutes aux sessions complètes d\'une heure—des entraînements qui s\'adaptent à votre emploi du temps.',
      'Equipment Smart': 'Intelligent avec l\'Équipement',
      'Works with any equipment setup—from bodyweight to full gym access.': 'Fonctionne avec n\'importe quelle configuration d\'équipement—du poids corporel à l\'accès complet à la salle de sport.',
      'Goal-Oriented': 'Orienté Objectifs',
      'Focused workouts for strength, athlete-style, or weight loss goals.': 'Entraînements ciblés pour les objectifs de force, style athlète ou perte de poids.',
      'Start Instantly': 'Commencez Instantanément',
      'Get your personalized workout plan in seconds, ready to start immediately.': 'Obtenez votre plan d\'entraînement personnalisé en secondes, prêt à commencer immédiatement.',
      'Ready to Transform Your Fitness?': 'Prêt à Transformer Votre Fitness?',
      'Join others who\'ve made fitness simple with personalized plans and instant workouts.': 'Rejoignez d\'autres qui ont rendu le fitness simple avec des plans personnalisés et des entraînements instantanés.',
      'Get started for free': 'Commencez gratuitement',

      // Language Selector
      'Select Language': 'Sélectionner la Langue',
      'Search languages...': 'Rechercher des langues...',

      // Common Words
      'min': 'min',
      'minutes': 'minutes',
      'seconds': 'secondes',
      'sets': 'séries',
      'reps': 'répétitions',
      'Workout': 'Entraînement',
    },

    'German': {
      // Navigation & Profile
      'Home': 'Startseite',
      'History': 'Verlauf',
      'Profile': 'Profil',
      'About': 'Über',
      'Language': 'Sprache',
      'Customize': 'Anpassen',
      'Privacy Policy': 'Datenschutzrichtlinie',
      'Terms of Conditions': 'Nutzungsbedingungen',
      'Sign Out': 'Abmelden',
      'Remove Account': 'Konto Entfernen',
      'Member since': 'Mitglied seit',
      'Delete Account': 'Konto Löschen',
      'Cancel': 'Abbrechen',
      'Deleting...': 'Löschen...',
      'Unknown': 'Unbekannt',
      'Are you sure you want to permanently delete your account? This action cannot be undone and will:': 'Sind Sie sicher, dass Sie Ihr Konto dauerhaft löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden und wird:',
      'Delete all your workout plans and history': 'Alle Ihre Trainingspläne und Verlauf löschen',
      'Remove your fitness profile': 'Ihr Fitnessprofil entfernen',
      'Permanently delete your account': 'Ihr Konto dauerhaft löschen',
      'Prevent you from signing in with this email again': 'Sie daran hindern, sich mit dieser E-Mail wieder anzumelden',

      // Authentication
      'Welcome Back': 'Willkommen Zurück',
      'Get Started': 'Loslegen',
      'Sign in to your QuickFit account': 'Melden Sie sich bei Ihrem QuickFit-Konto an',
      'Create your QuickFit account': 'Erstellen Sie Ihr QuickFit-Konto',
      'Full Name': 'Vollständiger Name',
      'Enter your full name': 'Geben Sie Ihren vollständigen Namen ein',
      'Email': 'E-Mail',
      'Enter your email': 'Geben Sie Ihre E-Mail ein',
      'Password': 'Passwort',
      'Enter your password': 'Geben Sie Ihr Passwort ein',
      'Sign In': 'Anmelden',
      'Create Account': 'Konto Erstellen',
      'By creating an account, you accept our': 'Durch das Erstellen eines Kontos akzeptieren Sie unsere',
      'and': 'und',
      "Don't have an account? Sign up": 'Haben Sie kein Konto? Registrieren',
      'Already have an account? Sign in': 'Haben Sie bereits ein Konto? Anmelden',

      // Home Page
      'Custom Workout Generator': 'Benutzerdefinierter Workout-Generator',
      'Generate instant custom workouts based on your available time, equipment, and target muscle groups.': 'Erstellen Sie sofortige benutzerdefinierte Workouts basierend auf Ihrer verfügbaren Zeit, Ausrüstung und Zielmuskelgruppen.',
      'Perfect for quick sessions when you need a workout right now.': 'Perfekt für schnelle Sessions, wenn Sie jetzt ein Workout brauchen.',

      // Workout Plans
      'My 30-Day Workout Plans': 'Meine 30-Tage-Trainingspläne',
      'Generate Workout Plan': 'Trainingsplan Generieren',
      'Start Plan': 'Plan Starten',
      'Continue Plan': 'Plan Fortsetzen',
      'Day': 'Tag',
      'Rest Day': 'Ruhetag',
      'Complete': 'Abschließen',
      'Mark as Complete': 'Als Abgeschlossen Markieren',
      'Completed': 'Abgeschlossen',
      'Delete Plan': 'Plan Löschen',
      'Are you sure you want to delete this workout plan?': 'Sind Sie sicher, dass Sie diesen Trainingsplan löschen möchten?',
      'This action cannot be undone.': 'Diese Aktion kann nicht rückgängig gemacht werden.',
      'No workout plans yet': 'Noch keine Trainingspläne',
      'Create your first 30-day workout plan to get started on your fitness journey!': 'Erstellen Sie Ihren ersten 30-Tage-Trainingsplan, um Ihre Fitness-Reise zu beginnen!',
      'Create Plan': 'Plan Erstellen',
      'days': 'Tage',

      // Workout Form
      'Create Your Workout': 'Erstellen Sie Ihr Workout',
      'Tell us what you have available and we\'ll generate the perfect workout for you': 'Sagen Sie uns, was Sie verfügbar haben, und wir generieren das perfekte Workout für Sie',
      'Time Available': 'Verfügbare Zeit',
      'Available Equipment': 'Verfügbare Ausrüstung',
      'What to Train Today': 'Was Heute Trainieren',
      'Workout Intensity': 'Workout-Intensität',
      'Generate Workout': 'Workout Generieren',
      'Equipment required': 'Ausrüstung erforderlich',
      'Select at least one equipment option': 'Wählen Sie mindestens eine Ausrüstungsoption',
      'Muscle group required': 'Muskelgruppe erforderlich',
      'Select at least one muscle group to train': 'Wählen Sie mindestens eine Muskelgruppe zum Trainieren',

      // Equipment Options
      'No Equipment': 'Keine Ausrüstung',
      'Dumbbells': 'Hanteln',
      'Barbell': 'Langhantel',
      'Kettlebell': 'Kettlebell',
      'Resistance Bands': 'Widerstandsbänder',
      'Cable Machine': 'Kabelmaschine',
      'Bench': 'Bank',
      'Pull-up Bar': 'Klimmzugstange',

      // Muscle Groups
      'Chest': 'Brust',
      'Back': 'Rücken',
      'Shoulders': 'Schultern',
      'Legs': 'Beine',
      'Biceps': 'Bizeps',
      'Triceps': 'Trizeps',
      'Core': 'Core',
      'Full Body': 'Ganzkörper',
      'Cardio': 'Cardio',

      // Intensity Levels
      'Light': 'Leicht',
      'Moderate': 'Moderat',
      'Intense': 'Intensiv',
      'Recovery or beginner friendly workout': 'Erholung oder anfängerfreundliches Workout',
      'Standard workout with balanced effort': 'Standard-Workout mit ausgewogenem Aufwand',
      'Challenging workout with higher intensity': 'Herausforderndes Workout mit höherer Intensität',

      // History Page
      'Your Workout History': 'Ihr Workout-Verlauf',
      'Workout History': 'Workout-Verlauf',
      'You haven\'t completed any workouts yet': 'Sie haben noch keine Workouts abgeschlossen',
      'No workout history yet': 'Noch kein Workout-Verlauf',
      'Generate your first workout and complete it to start tracking your progress': 'Generieren Sie Ihr erstes Workout und schließen Sie es ab, um Ihren Fortschritt zu verfolgen',
      'Track your workout progress over time': 'Verfolgen Sie Ihren Workout-Fortschritt über die Zeit',
      'View Details': 'Details Anzeigen',
      'No equipment': 'Keine Ausrüstung',
      'Multiple': 'Mehrere',
      'Create Your First Workout': 'Erstellen Sie Ihr Erstes Workout',
      'Start by creating a workout and completing it to track your progress over time.': 'Beginnen Sie mit der Erstellung eines Workouts und schließen Sie es ab, um Ihren Fortschritt über die Zeit zu verfolgen.',

      // About Page
      'Your Complete': 'Ihre Vollständige',
      'Fitness Solution': 'Fitness-Lösung',
      'QuickFit is your personal fitness companion, designed to make working out accessible, convenient, and enjoyable for everyone. Whether you have 10 minutes or an hour, whether you\'re at home or in the gym, QuickFit creates personalized workouts that fit your schedule, equipment, and fitness goals.': 'QuickFit ist Ihr persönlicher Fitness-Begleiter, entwickelt, um das Training für jeden zugänglich, bequem und angenehm zu machen. Ob Sie 10 Minuten oder eine Stunde haben, ob Sie zu Hause oder im Fitnessstudio sind, QuickFit erstellt personalisierte Workouts, die zu Ihrem Zeitplan, Ihrer Ausrüstung und Ihren Fitnesszielen passen.',
      'Our Mission': 'Unsere Mission',
      'To make fitness accessible to everyone, regardless of their experience level, available time, or equipment. We believe that consistency beats perfection, and every workout counts towards your fitness journey.': 'Fitness für jeden zugänglich zu machen, unabhängig von Erfahrungslevel, verfügbarer Zeit oder Ausrüstung. Wir glauben, dass Beständigkeit Perfektion schlägt, und jedes Workout zählt für Ihre Fitness-Reise.',
      'What Makes Us Different': 'Was Uns Unterscheidet',
      '• Instant workout generation based on your available time': '• Sofortige Workout-Generierung basierend auf Ihrer verfügbaren Zeit',
      '• Equipment-flexible routines from bodyweight to full gym': '• Ausrüstungsflexible Routinen vom Körpergewicht bis zum vollständigen Fitnessstudio',
      '• 30-day structured workout plans': '• 30-Tage strukturierte Trainingspläne',
      '• AI-powered fitness coaching and support': '• KI-gestütztes Fitness-Coaching und Support',
      'Meet the Founder': 'Lernen Sie den Gründer Kennen',
      'Founder & CEO, Age 15': 'Gründer & CEO, 15 Jahre alt',

      // Landing Page
      'Start Your Journey': 'Beginnen Sie Ihre Reise',
      '30-Day Workout Plans': '30-Tage-Trainingspläne',
      'Get a complete month-long personalized workout program designed around your fitness goals and available equipment.': 'Erhalten Sie ein vollständiges, monatelanges personalisiertes Trainingsprogramm, das um Ihre Fitnessziele und verfügbare Ausrüstung entwickelt wurde.',
      'Instant Workouts': 'Sofortige Workouts',
      'Need a quick workout? Generate personalized routines in seconds based on your time, equipment, target muscles and intensity.': 'Brauchen Sie ein schnelles Workout? Generieren Sie personalisierte Routinen in Sekunden basierend auf Ihrer Zeit, Ausrüstung, Zielmuskeln und Intensität.',
      'AI Fitness Coach': 'KI Fitness Coach',
      'Ask our AI chatbot any fitness question—from form tips to nutrition advice. Get guidance 24/7.': 'Stellen Sie unserem KI-Chatbot jede Fitness-Frage—von Formtipps bis hin zu Ernährungsberatung. Erhalten Sie 24/7 Beratung.',
      'Time-Based': 'Zeitbasiert',
      'From 10-minute quickies to full hour sessions—workouts that fit your schedule.': 'Von 10-minütigen Schnellsessions bis zu vollständigen Stundensessions—Workouts, die zu Ihrem Zeitplan passen.',
      'Equipment Smart': 'Ausrüstungsklug',
      'Works with any equipment setup—from bodyweight to full gym access.': 'Funktioniert mit jeder Ausrüstungseinrichtung—vom Körpergewicht bis zum vollständigen Fitnessstudio-Zugang.',
      'Goal-Oriented': 'Zielorientiert',
      'Focused workouts for strength, athlete-style, or weight loss goals.': 'Fokussierte Workouts für Kraft-, Athleten-Stil oder Gewichtsverlust-Ziele.',
      'Start Instantly': 'Sofort Starten',
      'Get your personalized workout plan in seconds, ready to start immediately.': 'Erhalten Sie Ihren personalisierten Trainingsplan in Sekunden, bereit zum sofortigen Start.',
      'Ready to Transform Your Fitness?': 'Bereit, Ihre Fitness zu Transformieren?',
      'Join others who\'ve made fitness simple with personalized plans and instant workouts.': 'Schließen Sie sich anderen an, die Fitness einfach gemacht haben mit personalisierten Plänen und sofortigen Workouts.',
      'Get started for free': 'Kostenlos starten',

      // Language Selector
      'Select Language': 'Sprache Auswählen',
      'Search languages...': 'Sprachen suchen...',

      // Common Words
      'min': 'min',
      'minutes': 'Minuten',
      'seconds': 'Sekunden',
      'sets': 'Sätze',
      'reps': 'Wiederholungen',
      'Workout': 'Workout',
    },
  };

  return translationMaps[language] || {};
};