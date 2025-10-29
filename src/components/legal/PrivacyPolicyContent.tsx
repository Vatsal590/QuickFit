import React from 'react';

const PrivacyPolicyContent = () => {
  return (
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

      <section>
        <h3 className="text-lg font-semibold mb-2">6. Your Rights Under GDPR</h3>
        <p>You have the following rights regarding your personal data:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Right of Access:</strong> Request copies of your personal data</li>
          <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
          <li><strong>Right to Restrict Processing:</strong> Request restriction of data processing</li>
          <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
          <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">7. Data Security</h3>
        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">8. Contact Information</h3>
        <p>If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us - quickfit06@gmail.com .</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">9. Updates to This Policy</h3>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy within the app.</p>
      </section>

      <section className="text-xs text-muted-foreground">
        <p><strong>Last updated:</strong> January 2025</p>
      </section>
    </div>
  );
};

export default PrivacyPolicyContent;
