
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from '@/contexts/TranslationContext';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy = ({ isOpen, onClose }: PrivacyPolicyProps) => {
  const { t } = useTranslation();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t('QuickFit Privacy Policy')}</DialogTitle>
          <DialogDescription>
            {t('Your privacy is important to us. This policy explains how we handle your data.')}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-semibold mb-2">1. {t('Introduction')}</h3>
              <p>{t('Welcome to QuickFit! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal data in accordance with the General Data Protection Regulation (GDPR) of the European Union.')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">2. {t('Data We Collect')}</h3>
              <p>{t('When you use QuickFit, we may collect the following personal data:')}</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>{t('Username')}</li>
                <li>{t('Email address')}</li>
                <li>{t('Height')}</li>
                <li>{t('Weight')}</li>
                <li>{t('App usage data (e.g., last login date, interactions)')}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">3. {t('Purpose of Collection')}</h3>
              <p>{t('We collect and process your data to:')}</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>{t('Provide personalized fitness recommendations')}</li>
                <li>{t('Allow user account creation and login')}</li>
                <li>{t('Communicate with you (e.g., account support, app updates)')}</li>
                <li>{t('Improve app functionality and user experience')}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">4. {t('Legal Basis for Processing')}</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>{t('Consent:')}</strong> {t('You provide clear consent for data processing.')}</li>
                <li><strong>{t('Performance of Contract:')}</strong> {t('To deliver app services you request.')}</li>
                <li><strong>{t('Legitimate Interests:')}</strong> {t('To improve our services.')}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">5. {t('Data Retention')}</h3>
              <p>{t('We retain your data as long as you have an active QuickFit account. If you delete your account, your data will be permanently removed within 30 days.')}</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;
