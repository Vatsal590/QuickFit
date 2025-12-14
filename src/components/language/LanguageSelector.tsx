import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages = [
  { code: 'English', label: 'English', flag: '🇺🇸' },
  { code: 'French', label: 'Français', flag: '🇫🇷' },
  { code: 'German', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'Luxembourgish', label: 'Lëtzebuergesch', flag: '🇱🇺' },
];

const LanguageSelector = ({ isOpen, onClose }: LanguageSelectorProps) => {
  const { language, setLanguage, t } = useTranslation();

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('Select Language')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 py-2">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? "default" : "outline"}
              className="w-full justify-between h-12 text-base"
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <span className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
              {language === lang.code && (
                <Check className="h-5 w-5" />
              )}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelector;