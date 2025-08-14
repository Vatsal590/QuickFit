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
      // In a real app, you'd load from files or an API
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

// Simple translation function - in a real app, you'd use a proper translation service
const getTranslationsForLanguage = async (language: string): Promise<Record<string, string>> => {
  // This is a simplified example. In production, you'd use a translation API or pre-built files
  const translationMaps: Record<string, Record<string, string>> = {
    'Spanish': {
      'Custom Workout Generator': 'Generador de Entrenamientos Personalizados',
      'Generate instant custom workouts based on your available time, equipment, and target muscle groups.': 'Genera entrenamientos personalizados instantáneos basados en tu tiempo disponible, equipo y grupos musculares objetivo.',
      'Perfect for quick sessions when you need a workout right now.': 'Perfecto para sesiones rápidas cuando necesitas un entrenamiento ahora mismo.',
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
      'Are you sure you want to permanently delete your account? This action cannot be undone and will:': '¿Estás seguro de que quieres eliminar permanentemente tu cuenta? Esta acción no se puede deshacer y:',
      'Delete all your workout plans and history': 'Eliminará todos tus planes de entrenamiento e historial',
      'Remove your fitness profile': 'Eliminará tu perfil de fitness',
      'Permanently delete your account': 'Eliminará permanentemente tu cuenta',
      'Prevent you from signing in with this email again': 'Te impedirá iniciar sesión con este email nuevamente',
      'Cancel': 'Cancelar',
      'Deleting...': 'Eliminando...',
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
    },
    'French': {
      'Custom Workout Generator': 'Générateur d\'Entraînement Personnalisé',
      'Generate instant custom workouts based on your available time, equipment, and target muscle groups.': 'Générez des entraînements personnalisés instantanés basés sur votre temps disponible, équipement et groupes musculaires ciblés.',
      'Perfect for quick sessions when you need a workout right now.': 'Parfait pour des sessions rapides quand vous avez besoin d\'un entraînement maintenant.',
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
      'Are you sure you want to permanently delete your account? This action cannot be undone and will:': 'Êtes-vous sûr de vouloir supprimer définitivement votre compte? Cette action ne peut pas être annulée et va:',
      'Delete all your workout plans and history': 'Supprimer tous vos plans d\'entraînement et historique',
      'Remove your fitness profile': 'Supprimer votre profil de fitness',
      'Permanently delete your account': 'Supprimer définitivement votre compte',
      'Prevent you from signing in with this email again': 'Vous empêcher de vous connecter avec cet email à nouveau',
      'Cancel': 'Annuler',
      'Deleting...': 'Suppression...',
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
    },
    'German': {
      'Custom Workout Generator': 'Benutzerdefinierter Workout-Generator',
      'Generate instant custom workouts based on your available time, equipment, and target muscle groups.': 'Erstellen Sie sofortige benutzerdefinierte Workouts basierend auf Ihrer verfügbaren Zeit, Ausrüstung und Zielmuskelgruppen.',
      'Perfect for quick sessions when you need a workout right now.': 'Perfekt für schnelle Sessions, wenn Sie jetzt ein Workout brauchen.',
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
      'Are you sure you want to permanently delete your account? This action cannot be undone and will:': 'Sind Sie sicher, dass Sie Ihr Konto dauerhaft löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden und wird:',
      'Delete all your workout plans and history': 'Alle Ihre Trainingspläne und Verlauf löschen',
      'Remove your fitness profile': 'Ihr Fitnessprofil entfernen',
      'Permanently delete your account': 'Ihr Konto dauerhaft löschen',
      'Prevent you from signing in with this email again': 'Sie daran hindern, sich mit dieser E-Mail wieder anzumelden',
      'Cancel': 'Abbrechen',
      'Deleting...': 'Löschen...',
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
    },
  };

  return translationMaps[language] || {};
};