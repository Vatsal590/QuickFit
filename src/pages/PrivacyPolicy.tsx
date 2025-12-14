import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import PageContainer from '@/components/layout/PageContainer';
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent';
import { useTranslation } from '@/contexts/TranslationContext';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('Back to Home')}
            </Link>
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-fitness-dark mb-2">{t('QuickFit Privacy Policy')}</h1>
              <p className="text-muted-foreground">
                {t('Your privacy is important to us. This policy explains how we handle your data.')}
              </p>
            </div>
            
            <ScrollArea className="h-[70vh] pr-4">
              <PrivacyPolicyContent />
            </ScrollArea>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default PrivacyPolicy;