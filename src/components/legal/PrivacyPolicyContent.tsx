import React from 'react';

const PrivacyPolicyContent = () => {
  return (
    <div className="space-y-6 text-sm">
      <section className="text-xs text-muted-foreground">
        <p><strong>Last updated:</strong> October 16, 2026</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">1. Introduction</h3>
        <p>Welcome to QuickFit! This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data in accordance with the General Data Protection Regulation (GDPR) (EU) 2016/679 and other applicable data protection laws.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">2. Data Controller Information</h3>
        <p>QuickFit is a project operated by Vatsal Agarwala, a private individual based in Luxembourg. QuickFit is not a registered company. Vatsal Agarwala is the data controller responsible for your personal data.</p>
        <p><strong>Contact Email:</strong> quickfit06@gmail.com</p>
        <p className="mt-2">For questions regarding data protection or to exercise your rights, please contact us at the email address above.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">3. Categories of Personal Data Collected</h3>
        <p>We only collect the data needed to provide QuickFit:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Account Information:</strong> Name, email address, and password (stored encrypted), or your Google account name and email if you sign in with Google</li>
          <li><strong>Fitness Profile Data:</strong> Height, weight, goal weight, body type, fitness goals, available equipment, workout schedule</li>
          <li><strong>Nutrition Preferences:</strong> Dietary preferences (e.g. vegetarian, vegan), cuisine preferences, food logs and nutrition goals</li>
          <li><strong>Activity Data:</strong> Workout history, weight entries, completed exercises, workout plans</li>
          <li><strong>Technical Data:</strong> Device and browser type, last login date, and anonymous usage statistics</li>
        </ul>
        <p className="mt-2">We do not ask for medical conditions or diagnoses. Food allergy and body-pain fields are optional and are described in Section 4(b).</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">4. Purposes and Legal Basis for Processing</h3>
        <div className="mt-2 space-y-3">
          <div>
            <p className="font-semibold">a) Performance of Contract (Article 6(1)(b) GDPR):</p>
            <p className="mt-1">We process the data that QuickFit needs to provide the service you signed up for:</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Creating and managing your account</li>
              <li>Generating personalised workout and nutrition plans (including with the help of AI, which is the technology used to provide these core features)</li>
              <li>Analysing food photos you choose to upload, and tracking your progress</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">b) Optional health-related information (Article 9(2)(a) GDPR – explicit consent):</p>
            <p className="mt-1">Food allergies and body-pain selections may be considered health data. Providing them is entirely optional and QuickFit works without them. If you choose to enter them, they are used only to filter meals and exercises for you. You can remove them at any time in your profile. Users under 16 should only enter this information with the agreement of a parent or guardian.</p>
          </div>
          <div>
            <p className="font-semibold">c) Consent (Article 6(1)(a) GDPR):</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Push notifications (off unless you turn them on; you can turn them off at any time)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">d) Legitimate Interests (Article 6(1)(f) GDPR):</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Keeping the app secure and fixing technical problems</li>
              <li>Anonymous usage statistics to improve the app</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">e) Legal Obligation (Article 6(1)(c) GDPR):</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Complying with applicable laws and responding to lawful requests from authorities</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">5. Service Providers We Use</h3>
        <p>We share data only with the providers needed to run QuickFit:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Supabase</strong> – database, account login and file storage (data hosted in the EU region where available)</li>
          <li><strong>Google (Google Sign-In)</strong> – only if you choose to sign in with Google</li>
          <li><strong>Google Gemini, accessed via the Lovable AI Gateway</strong> – generates workout suggestions, recipes and food photo analysis</li>
          <li><strong>Vercel</strong> – website hosting and cookie-free, anonymous usage statistics</li>
        </ul>
        <p className="mt-2">We do not sell your data. We may also disclose data to authorities when legally required.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">6. International Data Transfers</h3>
        <p>Some of the providers above (in particular Google, Vercel and the AI provider) may process data outside the European Economic Area, including in the United States. In these cases the providers rely on safeguards recognised under GDPR, such as the EU-U.S. Data Privacy Framework or Standard Contractual Clauses approved by the European Commission.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">7. Data Retention Periods</h3>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Account, fitness and nutrition data:</strong> As long as your account remains active</li>
          <li><strong>Deleted accounts:</strong> Personal data is deleted within 30 days of account deletion</li>
          <li><strong>Legal requirements:</strong> Longer retention may apply where required by law</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">8. Your Rights Under GDPR</h3>
        <p>You have the right to access, correct, delete, restrict or move (port) your personal data, to object to processing based on legitimate interests, to withdraw consent at any time, and to lodge a complaint with a supervisory authority (see Section 15).</p>
        <p className="mt-3">To exercise any of these rights, contact us at quickfit06@gmail.com. We will respond within one month of receipt of your request. You can also delete your account directly in the app.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">9. Automated Processing</h3>
        <p>We use automated processing and AI to generate workout plans, meal plans and food photo analysis based on the information you provide. These are suggestions only and do not produce legal or similarly significant effects on you. You can contact us if you have questions about a result.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">10. Data Security Measures</h3>
        <p>We protect your data using the following measures:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Encrypted connections (HTTPS) for all data in transit</li>
          <li>Passwords stored in hashed form, never in plain text</li>
          <li>Database access rules so that each user can only access their own data</li>
        </ul>
        <p className="mt-2">If a personal data breach occurs, we will notify the CNPD within 72 hours where the breach is likely to result in a risk to your rights and freedoms. If the breach is likely to result in a high risk to you, we will also inform you without undue delay.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">11. Statutory or Contractual Requirement</h3>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Required:</strong> Email address and name, to create an account</li>
          <li><strong>Optional:</strong> Fitness profile and nutrition preferences – needed for personalised plans</li>
          <li><strong>Optional:</strong> Food allergies and body-pain information – never required</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">12. Children and Young Users</h3>
        <p>QuickFit is available to users aged 13 and older. Users under 13 may not create an account. Users aged 13 to 15 may sign up themselves for the core service. However, for optional features that rely on consent (push notifications and optional health-related information such as allergies or body pain), users under 16 need the agreement of a parent or guardian, as required under Luxembourg law. If we learn that a child under 13 has created an account, we will delete it. Parents or guardians can contact us at any time at quickfit06@gmail.com.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">13. Cookies and Similar Technologies</h3>
        <p>We only use technologies that are strictly necessary to run QuickFit, such as storing your login session and language setting on your device. Our usage statistics (Vercel Analytics) do not use cookies and do not identify you personally. We do not use advertising or tracking cookies.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">14. Changes to This Privacy Policy</h3>
        <p>We may update this Privacy Policy to reflect changes in QuickFit or in the law. We will inform you of important changes in the app or by email.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">15. Supervisory Authority</h3>
        <p>The supervisory authority in Luxembourg is the Commission nationale pour la protection des données (CNPD), 15, Boulevard du Jazz, L-4370 Belvaux, <a href="https://cnpd.public.lu" target="_blank" rel="noopener noreferrer" className="text-primary underline">cnpd.public.lu</a>. You may also contact the supervisory authority in the EU country where you live.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">16. Contact Us</h3>
        <p>
          <strong>Email:</strong> quickfit06@gmail.com<br />
          <strong>Subject:</strong> Data Protection Request
        </p>
        <p className="mt-2">We will respond within one month.</p>
      </section>
    </div>
  );
};

export default PrivacyPolicyContent;
