import React, { createContext, useContext, useState, ReactNode } from 'react';

type TranslationContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Comprehensive translations for all app text
const translations: Record<string, Record<string, string>> = {
  English: {},
  
  French: {
    // Navigation & Layout
    'Navigation': 'Navigation',
    'Home': 'Accueil',
    '30 Day Plan': 'Plan 30 Jours',
    'Instant Workout': 'Entraînement Instantané',
    'Diet Plan': 'Plan Alimentaire',
    'AI Food Tracker': 'Suivi Alimentaire IA',
    'Weight Tracker': 'Suivi du Poids',
    'History': 'Historique',
    'Free Access': 'Accès Gratuit',
    'Fitness Blogs': 'Blogs Fitness',
    'Support': 'Soutien',
    'About': 'À Propos',
    
    // Home Page
    'Welcome to QuickFit': 'Bienvenue sur QuickFit',
    'Your complete fitness companion. Access all your fitness tools in one place.': 'Votre compagnon fitness complet. Accédez à tous vos outils fitness en un seul endroit.',
    'Workouts': 'Entraînements',
    'Your personalized workout plans': 'Vos plans d\'entraînement personnalisés',
    'Generate quick custom workouts': 'Générez des entraînements personnalisés rapidement',
    'Nutrition': 'Nutrition',
    'Personalized nutrition plans': 'Plans nutritionnels personnalisés',
    'Track meals with AI': 'Suivez vos repas avec l\'IA',
    'Tracking': 'Suivi',
    'Monitor your progress': 'Suivez votre progression',
    'View your workout history': 'Consultez votre historique d\'entraînement',
    'More': 'Plus',
    'Refer friends for rewards': 'Parrainez des amis pour des récompenses',
    'Tips and guides': 'Conseils et guides',
    
    // Landing Page
    'Your Complete': 'Votre Compagnon',
    'Fitness Companion': 'Fitness Complet',
    'Personalized workouts, nutrition plans, and AI coaching in one place.': 'Entraînements personnalisés, plans nutritionnels et coaching IA en un seul endroit.',
    'Start Free Today': 'Commencez Gratuitement',
    'No credit card required • Get started in 2 minutes': 'Aucune carte de crédit requise • Commencez en 2 minutes',
    'Instant workout generation': 'Génération d\'entraînement instantanée',
    '30-day personalized plans': 'Plans personnalisés de 30 jours',
    'AI fitness coaching': 'Coaching fitness IA',
    'Get Started': 'Commencer',
    'Everything You Need': 'Tout Ce Dont Vous Avez Besoin',
    'Workouts, meal plans, and tracking in one place.': 'Entraînements, plans repas et suivi en un seul endroit.',
    'Instant Workouts': 'Entraînements Instantanés',
    'Generate personalized workouts in seconds based on your time, equipment, and goals.': 'Générez des entraînements personnalisés en quelques secondes selon votre temps, équipement et objectifs.',
    '30-Day Plans': 'Plans de 30 Jours',
    'Month-long programs that adapt to your fitness level and available equipment.': 'Programmes d\'un mois qui s\'adaptent à votre niveau et équipement disponible.',
    '7-Day Diet Plans': 'Plans Alimentaires de 7 Jours',
    'Personalized meal plans with nutritional guidance for your goals.': 'Plans repas personnalisés avec conseils nutritionnels pour vos objectifs.',
    'Log meals with photos and track nutrition automatically using AI.': 'Enregistrez vos repas avec des photos et suivez la nutrition automatiquement avec l\'IA.',
    'AI Fitness Coach': 'Coach Fitness IA',
    'Get instant answers to fitness questions 24/7.': 'Obtenez des réponses instantanées à vos questions fitness 24h/24.',
    'Simple tips for a healthier lifestyle.': 'Conseils simples pour un mode de vie plus sain.',
    'About the Founder': 'À Propos du Fondateur',
    'As Featured On': 'Présenté Sur',
    'QuickFit on Luxembourg National Radio': 'QuickFit sur la Radio Nationale du Luxembourg',
    'Listen to the Feature': 'Écouter l\'Émission',
    
    // Auth
    'Sign In': 'Connexion',
    'Sign Up': 'Inscription',
    'Sign Out': 'Déconnexion',
    'Email': 'Email',
    'Password': 'Mot de passe',
    'Full Name': 'Nom complet',
    'Forgot Password?': 'Mot de passe oublié ?',
    'Create Account': 'Créer un compte',
    'Already have an account?': 'Vous avez déjà un compte ?',
    "Don't have an account?": "Vous n'avez pas de compte ?",
    'Sign in with Google to continue': 'Connectez-vous avec Google pour continuer',
    'Continue with Google': 'Continuer avec Google',
    'By signing in, you agree to our': 'En vous connectant, vous acceptez notre',
    'and': 'et',
    'Privacy Policy': 'Politique de Confidentialité',
    'Terms & Conditions': 'Conditions Générales',
    
    // Profile & Settings
    'Profile': 'Profil',
    'Terms of Service': 'Conditions d\'Utilisation',
    'Delete Account': 'Supprimer le Compte',
    'Fitness Profile': 'Profil Fitness',
    'Update your fitness information to get better workout recommendations.': 'Mettez à jour vos informations fitness pour de meilleures recommandations.',
    'Language': 'Langue',
    'Select Language': 'Sélectionner la Langue',
    'Are you absolutely sure?': 'Êtes-vous absolument sûr ?',
    'This action cannot be undone. This will permanently delete your account and remove your data from our servers.': 'Cette action est irréversible. Cela supprimera définitivement votre compte et vos données de nos serveurs.',
    
    // Workout
    'Start Workout': 'Commencer l\'Entraînement',
    'Complete Workout': 'Terminer l\'Entraînement',
    'Generate Workout': 'Générer un Entraînement',
    'Duration': 'Durée',
    'Intensity': 'Intensité',
    'Equipment': 'Équipement',
    'Target Muscles': 'Muscles Ciblés',
    'Exercises': 'Exercices',
    'Sets': 'Séries',
    'Reps': 'Répétitions',
    'Rest': 'Repos',
    'Warm Up': 'Échauffement',
    'Cool Down': 'Récupération',
    'minutes': 'minutes',
    'seconds': 'secondes',
    'Low': 'Faible',
    'Medium': 'Moyen',
    'High': 'Élevé',
    'Body Pains': 'Douleurs Corporelles',
    'No workout history yet': 'Pas encore d\'historique d\'entraînement',
    'Generate your first workout to see it here!': 'Générez votre premier entraînement pour le voir ici !',
    'Go to Workouts': 'Aller aux Entraînements',
    
    // Diet
    'Breakfast': 'Petit-déjeuner',
    'Lunch': 'Déjeuner',
    'Dinner': 'Dîner',
    'Snacks': 'Collations',
    'Calories': 'Calories',
    'Protein': 'Protéines',
    'Carbs': 'Glucides',
    'Fats': 'Lipides',
    'Recipe': 'Recette',
    'Ingredients': 'Ingrédients',
    'Instructions': 'Instructions',
    'Generate Diet Plan': 'Générer un Plan Alimentaire',
    'Daily Macros': 'Macros Quotidiennes',
    'Cook Time': 'Temps de Cuisson',
    
    // Food Tracker
    'Scan Food': 'Scanner un Aliment',
    'Log Food': 'Enregistrer un Aliment',
    "Today's Progress": "Progression du Jour",
    'Meal Type': 'Type de Repas',
    'Add Photo': 'Ajouter une Photo',
    'Analyzing...': 'Analyse en cours...',
    
    // Weight Tracker
    'Current Weight': 'Poids Actuel',
    'Goal Weight': 'Poids Objectif',
    'Add Entry': 'Ajouter une Entrée',
    'Weight History': 'Historique du Poids',
    'Progress': 'Progression',
    
    // Buttons & Actions
    'Save': 'Enregistrer',
    'Cancel': 'Annuler',
    'Submit': 'Soumettre',
    'Continue': 'Continuer',
    'Back': 'Retour',
    'Next': 'Suivant',
    'Done': 'Terminé',
    'Edit': 'Modifier',
    'Delete': 'Supprimer',
    'Confirm': 'Confirmer',
    'Close': 'Fermer',
    'Loading...': 'Chargement...',
    'Generating...': 'Génération...',
    
    // Messages
    'Success': 'Succès',
    'Error': 'Erreur',
    'Warning': 'Avertissement',
    'No data available': 'Aucune donnée disponible',
    'Please try again': 'Veuillez réessayer',
    
    // Free Access
    'Exclusive Free Access': 'Accès Gratuit Exclusif',
    'Founder & CEO': 'Fondateur & PDG',
    'Take Me There': 'Allons-y',
    'Instant Access': 'Accès Instantané',
    'Referral Program': 'Programme de Parrainage',
    "Get access to Vatsal's personal workout AND diet plans completely FREE!": "Accédez aux plans d'entraînement ET de régime personnels de Vatsal GRATUITEMENT !",
    
    // Support Page
    'Support QuickFit': 'Soutenir QuickFit',
    'Donate': 'Faire un Don',
    'Donate on GoFundMe': 'Donner sur GoFundMe',
    'Every donation makes a big difference! Your support helps us continue building the best free fitness platform for beginners.': 'Chaque don fait une grande différence ! Votre soutien nous aide à continuer de construire la meilleure plateforme fitness gratuite pour les débutants.',
    'How Your Donation Helps': 'Comment Votre Don Aide',
    'Better Workout Logic': 'Meilleure Logique d\'Entraînement',
    'Making the workout algorithms smarter and more personalized for your fitness journey': 'Rendre les algorithmes d\'entraînement plus intelligents et personnalisés pour votre parcours fitness',
    'Improving UI/UX': 'Améliorer l\'UI/UX',
    'Creating a more beautiful and intuitive experience for all users': 'Créer une expérience plus belle et intuitive pour tous les utilisateurs',
    'Publicity & Marketing': 'Publicité & Marketing',
    'Spreading the word to help more people achieve their fitness goals': 'Faire passer le mot pour aider plus de personnes à atteindre leurs objectifs fitness',
    'AI Functions': 'Fonctions IA',
    'Ensuring our AI features work properly and continue to improve': 'Assurer le bon fonctionnement de nos fonctionnalités IA et continuer à les améliorer',
    'Thank you for believing in QuickFit!': 'Merci de croire en QuickFit !',
    
    // Blogs
    'Health & Fitness': 'Santé & Fitness',
    'Expert tips and advice for a healthier, stronger you': 'Conseils d\'experts pour être en meilleure santé et plus fort',
    'Read more': 'Lire plus',
    'General advice for office goers': 'Conseils généraux pour les employés de bureau',
    'Stay active and healthy despite long hours at your desk': 'Restez actif et en bonne santé malgré les longues heures à votre bureau',
    'How to lose fat and gain muscle': 'Comment perdre du gras et gagner du muscle',
    'Master body recomposition with the right balance of training, nutrition, and recovery': 'Maîtrisez la recomposition corporelle avec le bon équilibre entre entraînement, nutrition et récupération',
    
    // Fitness Profile
    'Height': 'Taille',
    'Weight': 'Poids',
    'Body Type': 'Type de Corps',
    'Fitness Goal': 'Objectif Fitness',
    'Workout Days Per Week': 'Jours d\'Entraînement par Semaine',
    'Available Equipment': 'Équipement Disponible',
    'Diet Preferences': 'Préférences Alimentaires',
    'Food Allergies': 'Allergies Alimentaires',
    'Taste Preferences': 'Préférences Gustatives',
    'Ectomorph': 'Ectomorphe',
    'Mesomorph': 'Mésomorphe',
    'Endomorph': 'Endomorphe',
    'Lose Weight': 'Perdre du Poids',
    'Build Muscle': 'Développer les Muscles',
    'Improve Endurance': 'Améliorer l\'Endurance',
    'Increase Flexibility': 'Augmenter la Flexibilité',
    'General Fitness': 'Forme Générale',
  },
  
  German: {
    // Navigation & Layout
    'Navigation': 'Navigation',
    'Home': 'Startseite',
    '30 Day Plan': '30-Tage-Plan',
    'Instant Workout': 'Sofort-Training',
    'Diet Plan': 'Ernährungsplan',
    'AI Food Tracker': 'KI-Ernährungstracker',
    'Weight Tracker': 'Gewichtstracker',
    'History': 'Verlauf',
    'Free Access': 'Kostenloser Zugang',
    'Fitness Blogs': 'Fitness-Blogs',
    'Support': 'Unterstützung',
    'About': 'Über Uns',
    
    // Home Page
    'Welcome to QuickFit': 'Willkommen bei QuickFit',
    'Your complete fitness companion. Access all your fitness tools in one place.': 'Ihr kompletter Fitness-Begleiter. Greifen Sie an einem Ort auf alle Ihre Fitness-Tools zu.',
    'Workouts': 'Trainings',
    'Your personalized workout plans': 'Ihre personalisierten Trainingspläne',
    'Generate quick custom workouts': 'Erstellen Sie schnell individuelle Trainings',
    'Nutrition': 'Ernährung',
    'Personalized nutrition plans': 'Personalisierte Ernährungspläne',
    'Track meals with AI': 'Mahlzeiten mit KI verfolgen',
    'Tracking': 'Verfolgung',
    'Monitor your progress': 'Überwachen Sie Ihren Fortschritt',
    'View your workout history': 'Sehen Sie Ihren Trainingsverlauf',
    'More': 'Mehr',
    'Refer friends for rewards': 'Freunde empfehlen für Belohnungen',
    'Tips and guides': 'Tipps und Anleitungen',
    
    // Landing Page
    'Your Complete': 'Ihr Kompletter',
    'Fitness Companion': 'Fitness-Begleiter',
    'Personalized workouts, nutrition plans, and AI coaching in one place.': 'Personalisierte Trainings, Ernährungspläne und KI-Coaching an einem Ort.',
    'Start Free Today': 'Heute Kostenlos Starten',
    'No credit card required • Get started in 2 minutes': 'Keine Kreditkarte erforderlich • Starten Sie in 2 Minuten',
    'Instant workout generation': 'Sofortige Trainingsgenerierung',
    '30-day personalized plans': '30-Tage personalisierte Pläne',
    'AI fitness coaching': 'KI-Fitness-Coaching',
    'Get Started': 'Loslegen',
    'Everything You Need': 'Alles Was Sie Brauchen',
    'Workouts, meal plans, and tracking in one place.': 'Trainings, Mahlzeitenpläne und Tracking an einem Ort.',
    'Instant Workouts': 'Sofort-Trainings',
    'Generate personalized workouts in seconds based on your time, equipment, and goals.': 'Generieren Sie in Sekunden personalisierte Trainings basierend auf Ihrer Zeit, Ausrüstung und Zielen.',
    '30-Day Plans': '30-Tage-Pläne',
    'Month-long programs that adapt to your fitness level and available equipment.': 'Monatsprogramme, die sich an Ihr Fitnesslevel und verfügbare Ausrüstung anpassen.',
    '7-Day Diet Plans': '7-Tage-Ernährungspläne',
    'Personalized meal plans with nutritional guidance for your goals.': 'Personalisierte Mahlzeitenpläne mit Ernährungsberatung für Ihre Ziele.',
    'Log meals with photos and track nutrition automatically using AI.': 'Protokollieren Sie Mahlzeiten mit Fotos und verfolgen Sie die Ernährung automatisch mit KI.',
    'AI Fitness Coach': 'KI-Fitness-Coach',
    'Get instant answers to fitness questions 24/7.': 'Erhalten Sie sofortige Antworten auf Fitness-Fragen rund um die Uhr.',
    'Simple tips for a healthier lifestyle.': 'Einfache Tipps für einen gesünderen Lebensstil.',
    'About the Founder': 'Über den Gründer',
    'As Featured On': 'Bekannt Aus',
    'QuickFit on Luxembourg National Radio': 'QuickFit im Luxemburger Nationalradio',
    'Listen to the Feature': 'Das Feature Anhören',
    
    // Auth
    'Sign In': 'Anmelden',
    'Sign Up': 'Registrieren',
    'Sign Out': 'Abmelden',
    'Email': 'E-Mail',
    'Password': 'Passwort',
    'Full Name': 'Vollständiger Name',
    'Forgot Password?': 'Passwort vergessen?',
    'Create Account': 'Konto erstellen',
    'Already have an account?': 'Haben Sie bereits ein Konto?',
    "Don't have an account?": "Haben Sie noch kein Konto?",
    'Sign in with Google to continue': 'Mit Google anmelden um fortzufahren',
    'Continue with Google': 'Mit Google fortfahren',
    'By signing in, you agree to our': 'Durch Ihre Anmeldung stimmen Sie unserer',
    'and': 'und',
    'Privacy Policy': 'Datenschutzrichtlinie',
    'Terms & Conditions': 'AGB',
    
    // Profile & Settings
    'Profile': 'Profil',
    'Terms of Service': 'Nutzungsbedingungen',
    'Delete Account': 'Konto löschen',
    'Fitness Profile': 'Fitness-Profil',
    'Update your fitness information to get better workout recommendations.': 'Aktualisieren Sie Ihre Fitness-Informationen für bessere Trainingsempfehlungen.',
    'Language': 'Sprache',
    'Select Language': 'Sprache auswählen',
    'Are you absolutely sure?': 'Sind Sie absolut sicher?',
    'This action cannot be undone. This will permanently delete your account and remove your data from our servers.': 'Diese Aktion kann nicht rückgängig gemacht werden. Dadurch wird Ihr Konto dauerhaft gelöscht und Ihre Daten von unseren Servern entfernt.',
    
    // Workout
    'Start Workout': 'Training starten',
    'Complete Workout': 'Training abschließen',
    'Generate Workout': 'Training generieren',
    'Duration': 'Dauer',
    'Intensity': 'Intensität',
    'Equipment': 'Ausrüstung',
    'Target Muscles': 'Zielmuskeln',
    'Exercises': 'Übungen',
    'Sets': 'Sätze',
    'Reps': 'Wiederholungen',
    'Rest': 'Pause',
    'Warm Up': 'Aufwärmen',
    'Cool Down': 'Abkühlen',
    'minutes': 'Minuten',
    'seconds': 'Sekunden',
    'Low': 'Niedrig',
    'Medium': 'Mittel',
    'High': 'Hoch',
    'Body Pains': 'Körperschmerzen',
    'No workout history yet': 'Noch kein Trainingsverlauf',
    'Generate your first workout to see it here!': 'Generieren Sie Ihr erstes Training, um es hier zu sehen!',
    'Go to Workouts': 'Zu den Trainings',
    
    // Diet
    'Breakfast': 'Frühstück',
    'Lunch': 'Mittagessen',
    'Dinner': 'Abendessen',
    'Snacks': 'Snacks',
    'Calories': 'Kalorien',
    'Protein': 'Protein',
    'Carbs': 'Kohlenhydrate',
    'Fats': 'Fette',
    'Recipe': 'Rezept',
    'Ingredients': 'Zutaten',
    'Instructions': 'Anleitung',
    'Generate Diet Plan': 'Ernährungsplan erstellen',
    'Daily Macros': 'Tägliche Makros',
    'Cook Time': 'Kochzeit',
    
    // Food Tracker
    'Scan Food': 'Essen scannen',
    'Log Food': 'Essen protokollieren',
    "Today's Progress": "Heutiger Fortschritt",
    'Meal Type': 'Mahlzeitentyp',
    'Add Photo': 'Foto hinzufügen',
    'Analyzing...': 'Analysiere...',
    
    // Weight Tracker
    'Current Weight': 'Aktuelles Gewicht',
    'Goal Weight': 'Zielgewicht',
    'Add Entry': 'Eintrag hinzufügen',
    'Weight History': 'Gewichtsverlauf',
    'Progress': 'Fortschritt',
    
    // Buttons & Actions
    'Save': 'Speichern',
    'Cancel': 'Abbrechen',
    'Submit': 'Absenden',
    'Continue': 'Weiter',
    'Back': 'Zurück',
    'Next': 'Nächste',
    'Done': 'Fertig',
    'Edit': 'Bearbeiten',
    'Delete': 'Löschen',
    'Confirm': 'Bestätigen',
    'Close': 'Schließen',
    'Loading...': 'Laden...',
    'Generating...': 'Generiere...',
    
    // Messages
    'Success': 'Erfolg',
    'Error': 'Fehler',
    'Warning': 'Warnung',
    'No data available': 'Keine Daten verfügbar',
    'Please try again': 'Bitte versuchen Sie es erneut',
    
    // Free Access
    'Exclusive Free Access': 'Exklusiver kostenloser Zugang',
    'Founder & CEO': 'Gründer & CEO',
    'Take Me There': 'Bring mich dorthin',
    'Instant Access': 'Sofortiger Zugang',
    'Referral Program': 'Empfehlungsprogramm',
    "Get access to Vatsal's personal workout AND diet plans completely FREE!": "Erhalten Sie Zugang zu Vatsals persönlichen Trainings- UND Ernährungsplänen völlig KOSTENLOS!",
    
    // Support Page
    'Support QuickFit': 'QuickFit unterstützen',
    'Donate': 'Spenden',
    'Donate on GoFundMe': 'Auf GoFundMe spenden',
    'Every donation makes a big difference! Your support helps us continue building the best free fitness platform for beginners.': 'Jede Spende macht einen großen Unterschied! Ihre Unterstützung hilft uns, die beste kostenlose Fitness-Plattform für Anfänger weiterzuentwickeln.',
    'How Your Donation Helps': 'Wie Ihre Spende Hilft',
    'Better Workout Logic': 'Bessere Trainingslogik',
    'Making the workout algorithms smarter and more personalized for your fitness journey': 'Die Trainingsalgorithmen intelligenter und persönlicher für Ihre Fitness-Reise machen',
    'Improving UI/UX': 'UI/UX Verbessern',
    'Creating a more beautiful and intuitive experience for all users': 'Eine schönere und intuitivere Erfahrung für alle Benutzer schaffen',
    'Publicity & Marketing': 'Werbung & Marketing',
    'Spreading the word to help more people achieve their fitness goals': 'Das Wort verbreiten, um mehr Menschen zu helfen, ihre Fitness-Ziele zu erreichen',
    'AI Functions': 'KI-Funktionen',
    'Ensuring our AI features work properly and continue to improve': 'Sicherstellen, dass unsere KI-Funktionen ordnungsgemäß funktionieren und sich weiter verbessern',
    'Thank you for believing in QuickFit!': 'Danke, dass Sie an QuickFit glauben!',
    
    // Blogs
    'Health & Fitness': 'Gesundheit & Fitness',
    'Expert tips and advice for a healthier, stronger you': 'Expertentipps und Ratschläge für ein gesünderes, stärkeres Sie',
    'Read more': 'Mehr lesen',
    'General advice for office goers': 'Allgemeine Ratschläge für Büroangestellte',
    'Stay active and healthy despite long hours at your desk': 'Bleiben Sie aktiv und gesund trotz langer Stunden am Schreibtisch',
    'How to lose fat and gain muscle': 'Wie man Fett verliert und Muskeln aufbaut',
    'Master body recomposition with the right balance of training, nutrition, and recovery': 'Meistern Sie die Körperrekomposition mit der richtigen Balance aus Training, Ernährung und Erholung',
    
    // Fitness Profile
    'Height': 'Größe',
    'Weight': 'Gewicht',
    'Body Type': 'Körpertyp',
    'Fitness Goal': 'Fitnessziel',
    'Workout Days Per Week': 'Trainingstage pro Woche',
    'Available Equipment': 'Verfügbare Ausrüstung',
    'Diet Preferences': 'Ernährungspräferenzen',
    'Food Allergies': 'Nahrungsmittelallergien',
    'Taste Preferences': 'Geschmackspräferenzen',
    'Ectomorph': 'Ektomorph',
    'Mesomorph': 'Mesomorph',
    'Endomorph': 'Endomorph',
    'Lose Weight': 'Gewicht verlieren',
    'Build Muscle': 'Muskeln aufbauen',
    'Improve Endurance': 'Ausdauer verbessern',
    'Increase Flexibility': 'Flexibilität erhöhen',
    'General Fitness': 'Allgemeine Fitness',
  }
};

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem('quickfit-language') || 'English';
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('quickfit-language', lang);
  };

  const t = (key: string): string => {
    if (language === 'English') {
      return key; // English uses the key itself
    }
    const langTranslations = translations[language];
    if (langTranslations && langTranslations[key]) {
      return langTranslations[key];
    }
    return key; // Fallback to key if no translation found
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationContext;
