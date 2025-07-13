import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
}

const languages = [
  'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani', 'Basque', 'Belarusian',
  'Bengali', 'Bosnian', 'Bulgarian', 'Catalan', 'Cebuano', 'Chinese (Simplified)', 'Chinese (Traditional)',
  'Corsican', 'Croatian', 'Czech', 'Danish', 'Dutch', 'English', 'Esperanto', 'Estonian', 'Finnish',
  'French', 'Frisian', 'Galician', 'Georgian', 'German', 'Greek', 'Gujarati', 'Haitian Creole',
  'Hausa', 'Hawaiian', 'Hebrew', 'Hindi', 'Hmong', 'Hungarian', 'Icelandic', 'Igbo', 'Indonesian',
  'Irish', 'Italian', 'Japanese', 'Javanese', 'Kannada', 'Kazakh', 'Khmer', 'Kinyarwanda', 'Korean',
  'Kurdish', 'Kyrgyz', 'Lao', 'Latin', 'Latvian', 'Lithuanian', 'Luxembourgish', 'Macedonian',
  'Malagasy', 'Malay', 'Malayalam', 'Maltese', 'Maori', 'Marathi', 'Mongolian', 'Myanmar (Burmese)',
  'Nepali', 'Norwegian', 'Nyanja', 'Odia', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi',
  'Romanian', 'Russian', 'Samoan', 'Scots Gaelic', 'Serbian', 'Sesotho', 'Shona', 'Sindhi',
  'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Sundanese', 'Swahili', 'Swedish',
  'Tajik', 'Tamil', 'Tatar', 'Telugu', 'Thai', 'Turkish', 'Turkmen', 'Ukrainian', 'Urdu',
  'Uyghur', 'Uzbek', 'Vietnamese', 'Welsh', 'Xhosa', 'Yiddish', 'Yoruba', 'Zulu'
];

const LanguageSelector = ({ isOpen, onClose, selectedLanguage, onLanguageSelect }: LanguageSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = languages.filter(language =>
    language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = (language: string) => {
    onLanguageSelect(language);
    onClose();
    // Trigger a page reload to apply translations
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Language</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search languages..."
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