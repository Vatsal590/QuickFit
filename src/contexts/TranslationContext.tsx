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

const languages = ['English', 'Spanish', 'French', 'German'];

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('selectedLanguage') || 'English';
  });
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    localStorage.setItem('selectedLanguage', language);
    loadTranslations(language);
  }, [language]);

  const loadTranslations = (lang: string) => {
    if (lang === 'English') {
      setTranslations({});
      return;
    }
    
    const translationMap = getTranslationsForLanguage(lang);
    setTranslations(translationMap);
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

// Static translations for supported languages
const getTranslationsForLanguage = (language: string): Record<string, string> => {
  const translationMaps: Record<string, Record<string, string>> = {
    'Spanish': {
      // Core UI
      'Home': 'Inicio',
      'History': 'Historial',
      'Profile': 'Perfil',
      'About': 'Acerca de',
      'Privacy Policy': 'Política de Privacidad',
      'Terms of Conditions': 'Términos y Condiciones',
      'Sign Out': 'Cerrar Sesión',
      'Delete Account': 'Eliminar Cuenta',
      'Cancel': 'Cancelar',
      'Select Language': 'Seleccionar Idioma',
      'Search languages...': 'Buscar idiomas...',
      
      // Privacy Policy
      'QuickFit Privacy Policy': 'Política de Privacidad de QuickFit',
      'Your privacy is important to us. This policy explains how we handle your data.': 'Tu privacidad es importante para nosotros. Esta política explica cómo manejamos tus datos.',
      'Introduction': 'Introducción',
      'Welcome to QuickFit! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal data in accordance with the General Data Protection Regulation (GDPR) of the European Union.': '¡Bienvenido a QuickFit! Tu privacidad es importante para nosotros. Esta Política de Privacidad explica cómo recolectamos, usamos y protegemos tus datos personales de acuerdo con el Reglamento General de Protección de Datos (GDPR) de la Unión Europea.',
      'Data We Collect': 'Datos que Recolectamos',
      'When you use QuickFit, we may collect the following personal data:': 'Cuando usas QuickFit, podemos recolectar los siguientes datos personales:',
      'Username': 'Nombre de usuario',
      'Email address': 'Dirección de correo electrónico',
      'Height': 'Altura',
      'Weight': 'Peso',
      'App usage data (e.g., last login date, interactions)': 'Datos de uso de la aplicación (ej. fecha del último inicio de sesión, interacciones)',
      'Purpose of Collection': 'Propósito de la Recolección',
      'We collect and process your data to:': 'Recolectamos y procesamos tus datos para:',
      'Provide personalized fitness recommendations': 'Proporcionar recomendaciones de fitness personalizadas',
      'Allow user account creation and login': 'Permitir la creación de cuentas de usuario e inicio de sesión',
      'Communicate with you (e.g., account support, app updates)': 'Comunicarnos contigo (ej. soporte de cuenta, actualizaciones de la aplicación)',
      'Improve app functionality and user experience': 'Mejorar la funcionalidad de la aplicación y la experiencia del usuario',
      'Legal Basis for Processing': 'Base Legal para el Procesamiento',
      'Consent:': 'Consentimiento:',
      'You provide clear consent for data processing.': 'Proporcionas consentimiento claro para el procesamiento de datos.',
      'Performance of Contract:': 'Cumplimiento del Contrato:',
      'To deliver app services you request.': 'Para entregar los servicios de la aplicación que solicitas.',
      'Legitimate Interests:': 'Intereses Legítimos:',
      'To improve our services.': 'Para mejorar nuestros servicios.',
      'Data Retention': 'Retención de Datos',
      'We retain your data as long as you have an active QuickFit account. If you delete your account, your data will be permanently removed within 30 days.': 'Retenemos tus datos mientras tengas una cuenta activa de QuickFit. Si eliminas tu cuenta, tus datos serán eliminados permanentemente dentro de 30 días.',
      
      // Terms
      'Please read these terms carefully before using QuickFit.': 'Por favor lee estos términos cuidadosamente antes de usar QuickFit.',
      'Acceptance of Terms': 'Aceptación de Términos',
      'By creating an account or using QuickFit, you agree to these Terms of Service and our Privacy Policy.': 'Al crear una cuenta o usar QuickFit, aceptas estos Términos de Servicio y nuestra Política de Privacidad.',
      'User Eligibility': 'Elegibilidad del Usuario',
      'You must be at least 16 years old to use QuickFit.': 'Debes tener al menos 16 años para usar QuickFit.',
      'Account Responsibilities': 'Responsabilidades de la Cuenta',
      'You agree to provide accurate and complete information. You are responsible for safeguarding your account credentials.': 'Aceptas proporcionar información precisa y completa. Eres responsable de proteger las credenciales de tu cuenta.',
      'Health Disclaimer': 'Descargo de Responsabilidad de Salud',
      'QuickFit provides general fitness advice only. It is not a substitute for professional medical guidance. It is recommended to consult a physician before beginning any new exercise program.': 'QuickFit proporciona solo consejos generales de fitness. No es un sustituto de la orientación médica profesional. Se recomienda consultar a un médico antes de comenzar cualquier nuevo programa de ejercicios.',
      'Prohibited Conduct': 'Conducta Prohibida',
      'Using QuickFit for unlawful purposes': 'Usar QuickFit para propósitos ilegales',
      'Uploading malicious or harmful content': 'Subir contenido malicioso o dañino',
      'Termination': 'Terminación',
      'We reserve the right to suspend or terminate accounts that violate these terms.': 'Nos reservamos el derecho de suspender o terminar cuentas que violen estos términos.',
      'Limitation of Liability': 'Limitación de Responsabilidad',
      'QuickFit is provided "as-is." We do not guarantee results, and we are not liable for damages arising from use of the app.': 'QuickFit se proporciona "tal como está". No garantizamos resultados y no somos responsables de daños que surjan del uso de la aplicación.',
      'Governing Law': 'Ley Aplicable',
      'These terms are governed by the laws of Luxembourg and the EU.': 'Estos términos se rigen por las leyes de Luxemburgo y la UE.',

      // About page
      'About Us': 'Acerca de Nosotros',
      'Learn more about QuickFit and our mission': 'Aprende más sobre QuickFit y nuestra misión',
      'QuickFit is your ultimate fitness companion, designed to create personalized workouts that fit your schedule, equipment, and fitness goals. Whether you have 10 minutes or an hour, we\'ll generate the perfect workout for you.': 'QuickFit es tu compañero de fitness definitivo, diseñado para crear entrenamientos personalizados que se adapten a tu horario, equipo y objetivos de fitness. Ya sea que tengas 10 minutos o una hora, generaremos el entrenamiento perfecto para ti.',
      'Our Mission': 'Nuestra Misión',
      'To make fitness accessible to everyone, regardless of their equipment, time constraints, or fitness level. We believe that everyone deserves a personalized workout experience.': 'Hacer que el fitness sea accesible para todos, independientemente de su equipo, limitaciones de tiempo o nivel de fitness. Creemos que todos merecen una experiencia de entrenamiento personalizada.',
      'What Makes Us Different': 'Qué Nos Hace Diferentes',
      'Truly personalized workouts based on your available time and equipment': 'Entrenamientos verdaderamente personalizados basados en tu tiempo y equipo disponibles',
      'No subscription fees - completely free to use': 'Sin tarifas de suscripción - completamente gratis de usar',
      'Works with any equipment or no equipment at all': 'Funciona con cualquier equipo o sin equipo en absoluto',
      'Quick and efficient - generate a workout in seconds': 'Rápido y eficiente - genera un entrenamiento en segundos',
      'Meet the Founder': 'Conoce al Fundador',
      'Vatsal Agarwala': 'Vatsal Agarwala',
      'Fitness Enthusiast & Developer': 'Entusiasta del Fitness y Desarrollador',
      'As someone who struggled to maintain a consistent workout routine due to busy schedules and limited equipment access, I created QuickFit to solve a problem I faced daily. I believe that fitness should adapt to your life, not the other way around.': 'Como alguien que luchó por mantener una rutina de ejercicios consistente debido a horarios ocupados y acceso limitado a equipos, creé QuickFit para resolver un problema que enfrentaba diariamente. Creo que el fitness debe adaptarse a tu vida, no al revés.',
      'The idea for QuickFit came during a particularly hectic period in my life when I couldn\'t make it to the gym regularly. I realized that what I needed wasn\'t another generic workout app, but something that could create truly personalized workouts based on what I actually had available at the moment.': 'La idea de QuickFit surgió durante un período particularmente agitado en mi vida cuando no podía ir al gimnasio regularmente. Me di cuenta de que lo que necesitaba no era otra aplicación genérica de entrenamientos, sino algo que pudiera crear entrenamientos verdaderamente personalizados basados en lo que realmente tenía disponible en ese momento.',
      'Today, QuickFit helps thousands of people maintain their fitness journey, regardless of their circumstances. Whether you\'re a busy professional, a parent with limited time, or someone just starting their fitness journey, QuickFit is here to help you succeed.': 'Hoy, QuickFit ayuda a miles de personas a mantener su viaje de fitness, independientemente de sus circunstancias. Ya seas un profesional ocupado, un padre con tiempo limitado, o alguien que apenas comienza su viaje de fitness, QuickFit está aquí para ayudarte a tener éxito.',

      // Workout forms and basic UI
      'Create Your Workout': 'Crea Tu Entrenamiento',
      'Tell us what you have available and we\'ll generate the perfect workout for you': 'Dinos qué tienes disponible y generaremos el entrenamiento perfecto para ti',
      'Time Available': 'Tiempo Disponible',
      'Available Equipment': 'Equipo Disponible',
      'What to Train Today': 'Qué Entrenar Hoy',
      'Workout Intensity': 'Intensidad del Entrenamiento',
      'Generate Workout': 'Generar Entrenamiento',
      '10 min': '10 min',
      '20 min': '20 min',
      '30 min': '30 min',
      '45 min': '45 min',
      '60 min': '60 min',
      'No Equipment': 'Sin Equipo',
      'Dumbbells': 'Mancuernas',
      'Barbell': 'Barra',
      'Kettlebell': 'Pesa Rusa',
      'Resistance Bands': 'Bandas de Resistencia',
      'Cable Machine': 'Máquina de Cable',
      'Bench': 'Banco',
      'Pull-up Bar': 'Barra de Dominadas',
      'Chest': 'Pecho',
      'Back': 'Espalda',
      'Shoulders': 'Hombros',
      'Legs': 'Piernas',
      'Biceps': 'Bíceps',
      'Triceps': 'Tríceps',
      'Core': 'Core',
      'Full Body': 'Cuerpo Completo',
      'Cardio': 'Cardio',
      'Light': 'Ligero',
      'Moderate': 'Moderado',
      'Intense': 'Intenso',
      'Recovery or beginner friendly workout': 'Entrenamiento de recuperación o para principiantes',
      'Standard workout with balanced effort': 'Entrenamiento estándar con esfuerzo equilibrado',
      'Challenging workout with higher intensity': 'Entrenamiento desafiante con mayor intensidad',
      'Complete Workout': 'Completar Entrenamiento',
      'Workout History': 'Historial de Entrenamientos',
      'Track your workout progress over time': 'Rastrea tu progreso de entrenamiento a lo largo del tiempo',
      'View Details': 'Ver Detalles',
      'min': 'min',
      'Delete Account Confirmation': 'Confirmación de Eliminación de Cuenta',
      'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.': '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y eliminará permanentemente todos tus datos.',
    },

    'French': {
      // Core UI
      'Home': 'Accueil',
      'History': 'Historique',
      'Profile': 'Profil',
      'About': 'À propos',
      'Privacy Policy': 'Politique de Confidentialité',
      'Terms of Conditions': 'Conditions d\'Utilisation',
      'Sign Out': 'Se Déconnecter',
      'Delete Account': 'Supprimer le Compte',
      'Cancel': 'Annuler',
      'Select Language': 'Sélectionner la Langue',
      'Search languages...': 'Rechercher des langues...',
      
      // Privacy Policy
      'QuickFit Privacy Policy': 'Politique de Confidentialité QuickFit',
      'Your privacy is important to us. This policy explains how we handle your data.': 'Votre confidentialité est importante pour nous. Cette politique explique comment nous traitons vos données.',
      'Introduction': 'Introduction',
      'Welcome to QuickFit! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal data in accordance with the General Data Protection Regulation (GDPR) of the European Union.': 'Bienvenue sur QuickFit! Votre confidentialité est importante pour nous. Cette Politique de Confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) de l\'Union Européenne.',
      'Data We Collect': 'Données que Nous Collectons',
      'When you use QuickFit, we may collect the following personal data:': 'Lorsque vous utilisez QuickFit, nous pouvons collecter les données personnelles suivantes:',
      'Username': 'Nom d\'utilisateur',
      'Email address': 'Adresse e-mail',
      'Height': 'Taille',
      'Weight': 'Poids',
      'App usage data (e.g., last login date, interactions)': 'Données d\'utilisation de l\'application (ex. date de dernière connexion, interactions)',
      'Purpose of Collection': 'Objectif de la Collecte',
      'We collect and process your data to:': 'Nous collectons et traitons vos données pour:',
      'Provide personalized fitness recommendations': 'Fournir des recommandations de fitness personnalisées',
      'Allow user account creation and login': 'Permettre la création de comptes utilisateur et la connexion',
      'Communicate with you (e.g., account support, app updates)': 'Communiquer avec vous (ex. support de compte, mises à jour de l\'application)',
      'Improve app functionality and user experience': 'Améliorer la fonctionnalité de l\'application et l\'expérience utilisateur',
      'Legal Basis for Processing': 'Base Légale pour le Traitement',
      'Consent:': 'Consentement:',
      'You provide clear consent for data processing.': 'Vous donnez un consentement clair pour le traitement des données.',
      'Performance of Contract:': 'Exécution du Contrat:',
      'To deliver app services you request.': 'Pour fournir les services d\'application que vous demandez.',
      'Legitimate Interests:': 'Intérêts Légitimes:',
      'To improve our services.': 'Pour améliorer nos services.',
      'Data Retention': 'Rétention des Données',
      'We retain your data as long as you have an active QuickFit account. If you delete your account, your data will be permanently removed within 30 days.': 'Nous conservons vos données tant que vous avez un compte QuickFit actif. Si vous supprimez votre compte, vos données seront définitivement supprimées dans les 30 jours.',
      
      // Terms
      'Please read these terms carefully before using QuickFit.': 'Veuillez lire attentivement ces conditions avant d\'utiliser QuickFit.',
      'Acceptance of Terms': 'Acceptation des Conditions',
      'By creating an account or using QuickFit, you agree to these Terms of Service and our Privacy Policy.': 'En créant un compte ou en utilisant QuickFit, vous acceptez ces Conditions de Service et notre Politique de Confidentialité.',
      'User Eligibility': 'Éligibilité de l\'Utilisateur',
      'You must be at least 16 years old to use QuickFit.': 'Vous devez avoir au moins 16 ans pour utiliser QuickFit.',
      'Account Responsibilities': 'Responsabilités du Compte',
      'You agree to provide accurate and complete information. You are responsible for safeguarding your account credentials.': 'Vous acceptez de fournir des informations exactes et complètes. Vous êtes responsable de la protection de vos identifiants de compte.',
      'Health Disclaimer': 'Avertissement Santé',
      'QuickFit provides general fitness advice only. It is not a substitute for professional medical guidance. It is recommended to consult a physician before beginning any new exercise program.': 'QuickFit fournit uniquement des conseils de fitness généraux. Ce n\'est pas un substitut aux conseils médicaux professionnels. Il est recommandé de consulter un médecin avant de commencer tout nouveau programme d\'exercice.',
      'Prohibited Conduct': 'Conduite Interdite',
      'Using QuickFit for unlawful purposes': 'Utiliser QuickFit à des fins illégales',
      'Uploading malicious or harmful content': 'Télécharger du contenu malveillant ou nuisible',
      'Termination': 'Résiliation',
      'We reserve the right to suspend or terminate accounts that violate these terms.': 'Nous nous réservons le droit de suspendre ou de résilier les comptes qui violent ces conditions.',
      'Limitation of Liability': 'Limitation de Responsabilité',
      'QuickFit is provided "as-is." We do not guarantee results, and we are not liable for damages arising from use of the app.': 'QuickFit est fourni "tel quel". Nous ne garantissons pas les résultats et ne sommes pas responsables des dommages résultant de l\'utilisation de l\'application.',
      'Governing Law': 'Droit Applicable',
      'These terms are governed by the laws of Luxembourg and the EU.': 'Ces conditions sont régies par les lois du Luxembourg et de l\'UE.',

      // About page
      'About Us': 'À Propos de Nous',
      'Learn more about QuickFit and our mission': 'En savoir plus sur QuickFit et notre mission',
      'QuickFit is your ultimate fitness companion, designed to create personalized workouts that fit your schedule, equipment, and fitness goals. Whether you have 10 minutes or an hour, we\'ll generate the perfect workout for you.': 'QuickFit est votre compagnon de fitness ultime, conçu pour créer des entraînements personnalisés qui correspondent à votre horaire, équipement et objectifs de fitness. Que vous ayez 10 minutes ou une heure, nous générerons l\'entraînement parfait pour vous.',
      'Our Mission': 'Notre Mission',
      'To make fitness accessible to everyone, regardless of their equipment, time constraints, or fitness level. We believe that everyone deserves a personalized workout experience.': 'Rendre le fitness accessible à tous, indépendamment de leur équipement, contraintes de temps ou niveau de fitness. Nous croyons que tout le monde mérite une expérience d\'entraînement personnalisée.',
      'What Makes Us Different': 'Ce Qui Nous Distingue',
      'Truly personalized workouts based on your available time and equipment': 'Entraînements vraiment personnalisés basés sur votre temps et équipement disponibles',
      'No subscription fees - completely free to use': 'Aucun frais d\'abonnement - complètement gratuit à utiliser',
      'Works with any equipment or no equipment at all': 'Fonctionne avec n\'importe quel équipement ou sans équipement du tout',
      'Quick and efficient - generate a workout in seconds': 'Rapide et efficace - générez un entraînement en quelques secondes',
      'Meet the Founder': 'Rencontrez le Fondateur',
      'Vatsal Agarwala': 'Vatsal Agarwala',
      'Fitness Enthusiast & Developer': 'Passionné de Fitness et Développeur',
      'As someone who struggled to maintain a consistent workout routine due to busy schedules and limited equipment access, I created QuickFit to solve a problem I faced daily. I believe that fitness should adapt to your life, not the other way around.': 'En tant que quelqu\'un qui avait du mal à maintenir une routine d\'exercice cohérente en raison d\'horaires chargés et d\'un accès limité à l\'équipement, j\'ai créé QuickFit pour résoudre un problème auquel je faisais face quotidiennement. Je crois que le fitness devrait s\'adapter à votre vie, et non l\'inverse.',
      'The idea for QuickFit came during a particularly hectic period in my life when I couldn\'t make it to the gym regularly. I realized that what I needed wasn\'t another generic workout app, but something that could create truly personalized workouts based on what I actually had available at the moment.': 'L\'idée de QuickFit est venue pendant une période particulièrement mouvementée de ma vie où je ne pouvais pas aller régulièrement au gymnase. J\'ai réalisé que ce dont j\'avais besoin n\'était pas une autre application d\'entraînement générique, mais quelque chose qui pourrait créer des entraînements vraiment personnalisés basés sur ce que j\'avais réellement disponible à ce moment-là.',
      'Today, QuickFit helps thousands of people maintain their fitness journey, regardless of their circumstances. Whether you\'re a busy professional, a parent with limited time, or someone just starting their fitness journey, QuickFit is here to help you succeed.': 'Aujourd\'hui, QuickFit aide des milliers de personnes à maintenir leur parcours de fitness, indépendamment de leurs circonstances. Que vous soyez un professionnel occupé, un parent avec un temps limité, ou quelqu\'un qui commence tout juste son parcours de fitness, QuickFit est là pour vous aider à réussir.',

      // Workout forms and basic UI
      'Create Your Workout': 'Créez Votre Entraînement',
      'Tell us what you have available and we\'ll generate the perfect workout for you': 'Dites-nous ce que vous avez disponible et nous générerons l\'entraînement parfait pour vous',
      'Time Available': 'Temps Disponible',
      'Available Equipment': 'Équipement Disponible',
      'What to Train Today': 'Quoi Entraîner Aujourd\'hui',
      'Workout Intensity': 'Intensité de l\'Entraînement',
      'Generate Workout': 'Générer un Entraînement',
      '10 min': '10 min',
      '20 min': '20 min',
      '30 min': '30 min',
      '45 min': '45 min',
      '60 min': '60 min',
      'No Equipment': 'Sans Équipement',
      'Dumbbells': 'Haltères',
      'Barbell': 'Barre',
      'Kettlebell': 'Kettlebell',
      'Resistance Bands': 'Bandes de Résistance',
      'Cable Machine': 'Machine à Câbles',
      'Bench': 'Banc',
      'Pull-up Bar': 'Barre de Traction',
      'Chest': 'Poitrine',
      'Back': 'Dos',
      'Shoulders': 'Épaules',
      'Legs': 'Jambes',
      'Biceps': 'Biceps',
      'Triceps': 'Triceps',
      'Core': 'Core',
      'Full Body': 'Corps Entier',
      'Cardio': 'Cardio',
      'Light': 'Léger',
      'Moderate': 'Modéré',
      'Intense': 'Intense',
      'Recovery or beginner friendly workout': 'Entraînement de récupération ou adapté aux débutants',
      'Standard workout with balanced effort': 'Entraînement standard avec effort équilibré',
      'Challenging workout with higher intensity': 'Entraînement difficile avec intensité plus élevée',
      'Complete Workout': 'Terminer l\'Entraînement',
      'Workout History': 'Historique des Entraînements',
      'Track your workout progress over time': 'Suivez vos progrès d\'entraînement au fil du temps',
      'View Details': 'Voir les Détails',
      'min': 'min',
      'Delete Account Confirmation': 'Confirmation de Suppression de Compte',
      'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.': 'Êtes-vous sûr de vouloir supprimer votre compte? Cette action ne peut pas être annulée et supprimera définitivement toutes vos données.',
    },

    'German': {
      // Core UI
      'Home': 'Startseite',
      'History': 'Verlauf',
      'Profile': 'Profil',
      'About': 'Über uns',
      'Privacy Policy': 'Datenschutzrichtlinie',
      'Terms of Conditions': 'Nutzungsbedingungen',
      'Sign Out': 'Abmelden',
      'Delete Account': 'Konto Löschen',
      'Cancel': 'Abbrechen',
      'Select Language': 'Sprache Auswählen',
      'Search languages...': 'Sprachen suchen...',
      
      // Privacy Policy
      'QuickFit Privacy Policy': 'QuickFit Datenschutzrichtlinie',
      'Your privacy is important to us. This policy explains how we handle your data.': 'Ihre Privatsphäre ist uns wichtig. Diese Richtlinie erklärt, wie wir mit Ihren Daten umgehen.',
      'Introduction': 'Einführung',
      'Welcome to QuickFit! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal data in accordance with the General Data Protection Regulation (GDPR) of the European Union.': 'Willkommen bei QuickFit! Ihre Privatsphäre ist uns wichtig. Diese Datenschutzrichtlinie erklärt, wie wir Ihre persönlichen Daten gemäß der Datenschutz-Grundverordnung (DSGVO) der Europäischen Union sammeln, verwenden und schützen.',
      'Data We Collect': 'Daten, die Wir Sammeln',
      'When you use QuickFit, we may collect the following personal data:': 'Wenn Sie QuickFit verwenden, können wir die folgenden persönlichen Daten sammeln:',
      'Username': 'Benutzername',
      'Email address': 'E-Mail-Adresse',
      'Height': 'Größe',
      'Weight': 'Gewicht',
      'App usage data (e.g., last login date, interactions)': 'App-Nutzungsdaten (z.B. letztes Anmeldedatum, Interaktionen)',
      'Purpose of Collection': 'Zweck der Sammlung',
      'We collect and process your data to:': 'Wir sammeln und verarbeiten Ihre Daten, um:',
      'Provide personalized fitness recommendations': 'Personalisierte Fitness-Empfehlungen bereitzustellen',
      'Allow user account creation and login': 'Benutzerkonto-Erstellung und Anmeldung zu ermöglichen',
      'Communicate with you (e.g., account support, app updates)': 'Mit Ihnen zu kommunizieren (z.B. Konto-Support, App-Updates)',
      'Improve app functionality and user experience': 'App-Funktionalität und Benutzererfahrung zu verbessern',
      'Legal Basis for Processing': 'Rechtliche Grundlage für die Verarbeitung',
      'Consent:': 'Einwilligung:',
      'You provide clear consent for data processing.': 'Sie geben eine klare Einwilligung zur Datenverarbeitung.',
      'Performance of Contract:': 'Vertragserfüllung:',
      'To deliver app services you request.': 'Um die von Ihnen angeforderten App-Services zu liefern.',
      'Legitimate Interests:': 'Berechtigte Interessen:',
      'To improve our services.': 'Um unsere Services zu verbessern.',
      'Data Retention': 'Datenspeicherung',
      'We retain your data as long as you have an active QuickFit account. If you delete your account, your data will be permanently removed within 30 days.': 'Wir speichern Ihre Daten, solange Sie ein aktives QuickFit-Konto haben. Wenn Sie Ihr Konto löschen, werden Ihre Daten innerhalb von 30 Tagen dauerhaft entfernt.',

      // Terms
      'Please read these terms carefully before using QuickFit.': 'Bitte lesen Sie diese Bedingungen sorgfältig durch, bevor Sie QuickFit verwenden.',
      'Acceptance of Terms': 'Annahme der Bedingungen',
      'By creating an account or using QuickFit, you agree to these Terms of Service and our Privacy Policy.': 'Durch das Erstellen eines Kontos oder die Nutzung von QuickFit stimmen Sie diesen Nutzungsbedingungen und unserer Datenschutzrichtlinie zu.',
      'User Eligibility': 'Benutzerberechtigung',
      'You must be at least 16 years old to use QuickFit.': 'Sie müssen mindestens 16 Jahre alt sein, um QuickFit zu verwenden.',
      'Account Responsibilities': 'Konto-Verantwortlichkeiten',
      'You agree to provide accurate and complete information. You are responsible for safeguarding your account credentials.': 'Sie verpflichten sich, genaue und vollständige Informationen bereitzustellen. Sie sind verantwortlich für den Schutz Ihrer Konto-Anmeldedaten.',
      'Health Disclaimer': 'Gesundheitshinweis',
      'QuickFit provides general fitness advice only. It is not a substitute for professional medical guidance. It is recommended to consult a physician before beginning any new exercise program.': 'QuickFit bietet nur allgemeine Fitness-Beratung. Es ist kein Ersatz für professionelle medizinische Beratung. Es wird empfohlen, einen Arzt zu konsultieren, bevor Sie ein neues Trainingsprogramm beginnen.',
      'Prohibited Conduct': 'Verbotenes Verhalten',
      'Using QuickFit for unlawful purposes': 'QuickFit für rechtswidrige Zwecke verwenden',
      'Uploading malicious or harmful content': 'Hochladen von bösartigem oder schädlichem Inhalt',
      'Termination': 'Kündigung',
      'We reserve the right to suspend or terminate accounts that violate these terms.': 'Wir behalten uns das Recht vor, Konten zu sperren oder zu kündigen, die gegen diese Bedingungen verstoßen.',
      'Limitation of Liability': 'Haftungsbeschränkung',
      'QuickFit is provided "as-is." We do not guarantee results, and we are not liable for damages arising from use of the app.': 'QuickFit wird "wie besehen" bereitgestellt. Wir garantieren keine Ergebnisse und haften nicht für Schäden, die durch die Nutzung der App entstehen.',
      'Governing Law': 'Anwendbares Recht',
      'These terms are governed by the laws of Luxembourg and the EU.': 'Diese Bedingungen unterliegen den Gesetzen von Luxemburg und der EU.',

      // About page
      'About Us': 'Über Uns',
      'Learn more about QuickFit and our mission': 'Erfahren Sie mehr über QuickFit und unsere Mission',
      'QuickFit is your ultimate fitness companion, designed to create personalized workouts that fit your schedule, equipment, and fitness goals. Whether you have 10 minutes or an hour, we\'ll generate the perfect workout for you.': 'QuickFit ist Ihr ultimativer Fitness-Begleiter, entwickelt um personalisierte Workouts zu erstellen, die zu Ihrem Zeitplan, Ihrer Ausrüstung und Ihren Fitnesszielen passen. Ob Sie 10 Minuten oder eine Stunde haben, wir generieren das perfekte Workout für Sie.',
      'Our Mission': 'Unsere Mission',
      'To make fitness accessible to everyone, regardless of their equipment, time constraints, or fitness level. We believe that everyone deserves a personalized workout experience.': 'Fitness für jeden zugänglich zu machen, unabhängig von Ausrüstung, Zeitbeschränkungen oder Fitnesslevel. Wir glauben, dass jeder eine personalisierte Workout-Erfahrung verdient.',
      'What Makes Us Different': 'Was Uns Unterscheidet',
      'Truly personalized workouts based on your available time and equipment': 'Wirklich personalisierte Workouts basierend auf Ihrer verfügbaren Zeit und Ausrüstung',
      'No subscription fees - completely free to use': 'Keine Abonnementgebühren - völlig kostenlos zu verwenden',
      'Works with any equipment or no equipment at all': 'Funktioniert mit jeder Ausrüstung oder ganz ohne Ausrüstung',
      'Quick and efficient - generate a workout in seconds': 'Schnell und effizient - generieren Sie ein Workout in Sekunden',
      'Meet the Founder': 'Lernen Sie den Gründer Kennen',
      'Vatsal Agarwala': 'Vatsal Agarwala',
      'Fitness Enthusiast & Developer': 'Fitness-Enthusiast & Entwickler',
      'As someone who struggled to maintain a consistent workout routine due to busy schedules and limited equipment access, I created QuickFit to solve a problem I faced daily. I believe that fitness should adapt to your life, not the other way around.': 'Als jemand, der Schwierigkeiten hatte, eine konsistente Trainingsroutine aufgrund von vollen Terminplänen und begrenztem Zugang zu Ausrüstung aufrechtzuerhalten, habe ich QuickFit erstellt, um ein Problem zu lösen, dem ich täglich gegenüberstand. Ich glaube, dass sich Fitness an Ihr Leben anpassen sollte, nicht umgekehrt.',
      'The idea for QuickFit came during a particularly hectic period in my life when I couldn\'t make it to the gym regularly. I realized that what I needed wasn\'t another generic workout app, but something that could create truly personalized workouts based on what I actually had available at the moment.': 'Die Idee für QuickFit entstand während einer besonders hektischen Zeit in meinem Leben, als ich nicht regelmäßig ins Fitnessstudio gehen konnte. Mir wurde klar, dass ich keine weitere generische Workout-App brauchte, sondern etwas, das wirklich personalisierte Workouts basierend auf dem erstellen konnte, was ich tatsächlich in dem Moment zur Verfügung hatte.',
      'Today, QuickFit helps thousands of people maintain their fitness journey, regardless of their circumstances. Whether you\'re a busy professional, a parent with limited time, or someone just starting their fitness journey, QuickFit is here to help you succeed.': 'Heute hilft QuickFit Tausenden von Menschen dabei, ihre Fitness-Reise fortzusetzen, unabhängig von ihren Umständen. Ob Sie ein beschäftigter Berufstätiger, ein Elternteil mit begrenzter Zeit oder jemand sind, der gerade erst seine Fitness-Reise beginnt, QuickFit ist hier, um Ihnen beim Erfolg zu helfen.',

      // Workout forms and basic UI
      'Create Your Workout': 'Erstellen Sie Ihr Workout',
      'Tell us what you have available and we\'ll generate the perfect workout for you': 'Sagen Sie uns, was Sie zur Verfügung haben, und wir generieren das perfekte Workout für Sie',
      'Time Available': 'Verfügbare Zeit',
      'Available Equipment': 'Verfügbare Ausrüstung',
      'What to Train Today': 'Was Heute Trainieren',
      'Workout Intensity': 'Workout-Intensität',
      'Generate Workout': 'Workout Generieren',
      '10 min': '10 Min',
      '20 min': '20 Min',
      '30 min': '30 Min',
      '45 min': '45 Min',
      '60 min': '60 Min',
      'No Equipment': 'Keine Ausrüstung',
      'Dumbbells': 'Hanteln',
      'Barbell': 'Langhantel',
      'Kettlebell': 'Kettlebell',
      'Resistance Bands': 'Widerstandsbänder',
      'Cable Machine': 'Kabelmaschine',
      'Bench': 'Bank',
      'Pull-up Bar': 'Klimmzugstange',
      'Chest': 'Brust',
      'Back': 'Rücken',
      'Shoulders': 'Schultern',
      'Legs': 'Beine',
      'Biceps': 'Bizeps',
      'Triceps': 'Trizeps',
      'Core': 'Körpermitte',
      'Full Body': 'Ganzkörper',
      'Cardio': 'Cardio',
      'Light': 'Leicht',
      'Moderate': 'Moderat',
      'Intense': 'Intensiv',
      'Recovery or beginner friendly workout': 'Erholung oder anfängerfreundliches Workout',
      'Standard workout with balanced effort': 'Standard-Workout mit ausgewogenem Aufwand',
      'Challenging workout with higher intensity': 'Herausforderndes Workout mit höherer Intensität',
      'Complete Workout': 'Workout Abschließen',
      'Workout History': 'Workout-Verlauf',
      'Track your workout progress over time': 'Verfolgen Sie Ihren Workout-Fortschritt über die Zeit',
      'View Details': 'Details Anzeigen',
      'min': 'Min',
      'Delete Account Confirmation': 'Konto Löschen Bestätigung',
      'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.': 'Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden und wird alle Ihre Daten dauerhaft entfernen.',
    }
  };

  return translationMaps[language] || {};
};