
import React from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import PrivacyPolicyContent from './PrivacyPolicyContent';

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
          <PrivacyPolicyContent />
          
          <div className="mt-6 pt-4 border-t">
            <Button variant="outline" asChild>
              <Link to="/privacy-policy" target="_blank">
                View Full Privacy Policy
              </Link>
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;
