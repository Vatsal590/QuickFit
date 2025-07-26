import React from 'react';

const TermsOfServiceContent = () => {
  return (
    <div className="space-y-6 text-sm">
      <p className="text-xs text-muted-foreground">Last updated: January 26, 2025</p>
      
      <section>
        <h3 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h3>
        <p>By creating an account or using QuickFit, you agree to these Terms of Service and our Privacy Policy.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">2. User Eligibility</h3>
        <p>You must be at least 16 years old to use QuickFit.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">3. Account Responsibilities</h3>
        <p>You agree to provide accurate and complete information. You are responsible for safeguarding your account credentials.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">4. Health Disclaimer</h3>
        <p>QuickFit provides general fitness advice only. It is not a substitute for professional medical guidance. It is recommended to consult a physician before beginning any new exercise program.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">5. Prohibited Conduct</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Using QuickFit for unlawful purposes</li>
          <li>Uploading malicious or harmful content</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">6. Termination</h3>
        <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">7. Limitation of Liability</h3>
        <p>QuickFit is provided "as-is." We do not guarantee results, and we are not liable for damages arising from use of the app.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">8. Governing Law</h3>
        <p>These terms are governed by the laws of Luxembourg and the EU.</p>
      </section>
    </div>
  );
};

export default TermsOfServiceContent;