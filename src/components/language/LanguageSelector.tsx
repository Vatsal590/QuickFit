import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from '@/contexts/TranslationContext';
import { Search } from 'lucide-react';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
}

const languages = ['English', 'Spanish', 'French', 'German'];

const LanguageSelector = ({ isOpen, onClose, selectedLanguage, onLanguageSelect }: LanguageSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  const filteredLanguages = languages.filter(language =>
    language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = (language: string) => {
    onLanguageSelect(language);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('Select Language')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('Search languages...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <ScrollArea className="h-[300px]">
            <div className="space-y-1">
              {filteredLanguages.map((language) => (
                <Button
                  key={language}
                  variant={selectedLanguage === language ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleLanguageSelect(language)}
                >
                  {language}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelector;