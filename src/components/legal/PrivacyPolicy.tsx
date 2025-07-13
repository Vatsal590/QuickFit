
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy = ({ isOpen, onClose }: PrivacyPolicyProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>QuickFit Privacy Policy</DialogTitle>
          <DialogDescription>
            Your privacy is important to us. This policy explains how we handle your data.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-semibold mb-2">1. Introduction</h3>
              <p>Welcome to QuickFit! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal data in accordance with the General Data Protection Regulation (GDPR) of the European Union.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">2. Data We Collect</h3>
              <p>When you use QuickFit, we may collect the following personal data:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Username</li>
                <li>Email address</li>
                <li>Height</li>
                <li>Weight</li>
                <li>App usage data (e.g., last login date, interactions)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">3. Purpose of Collection</h3>
              <p>We collect and process your data to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Provide personalized fitness recommendations</li>
                <li>Allow user account creation and login</li>
                <li>Communicate with you (e.g., account support, app updates)</li>
                <li>Improve app functionality and user experience</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">4. Legal Basis for Processing</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Consent:</strong> You provide clear consent for data processing.</li>
                <li><strong>Performance of Contract:</strong> To deliver app services you request.</li>
                <li><strong>Legitimate Interests:</strong> To improve our services.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">5. Data Retention</h3>
              <p>We retain your data as long as you have an active QuickFit account. If you delete your account, your data will be permanently removed within 30 days.</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;
