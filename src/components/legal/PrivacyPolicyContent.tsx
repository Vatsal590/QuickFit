import React from 'react';

const PrivacyPolicyContent = () => {
  return (
    <div className="space-y-6 text-sm">
      <section className="text-xs text-muted-foreground">
        <p><strong>Last updated:</strong> November 25, 2025</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">1. Introduction</h3>
        <p>Welcome to QuickFit! This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data in accordance with the General Data Protection Regulation (GDPR) (EU) 2016/679 and other applicable data protection laws.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">2. Data Controller Information</h3>
        <p><strong>Data Controller:</strong> QuickFit</p>
        <p><strong>Contact Email:</strong> quickfit06@gmail.com</p>
        <p className="mt-2">For questions regarding data protection or to exercise your rights, please contact us at the email address above.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">3. Categories of Personal Data Collected</h3>
        <p>We collect and process the following categories of personal data:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Account Information:</strong> Full name, email address, username, password (encrypted)</li>
          <li><strong>Fitness Profile Data:</strong> Height, weight, goal weight, body type, fitness goals, available equipment, workout preferences</li>
          <li><strong>Nutrition Data:</strong> Food logs, dietary preferences, food allergies, taste preferences, nutrition goals</li>
          <li><strong>Activity Data:</strong> Workout history, weight entries, completed exercises, workout plans</li>
          <li><strong>Technical Data:</strong> Device information, IP address, browser type, app usage analytics, last login date</li>
          <li><strong>Communication Data:</strong> Push notification preferences, referral codes</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">4. Purposes and Legal Basis for Processing</h3>
        <p>We process your personal data for the following purposes and legal bases:</p>
        <div className="mt-2 space-y-3">
          <div>
            <p className="font-semibold">a) Performance of Contract (Article 6(1)(b) GDPR):</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Creating and managing your user account</li>
              <li>Providing personalized workout plans and diet recommendations</li>
              <li>Tracking your fitness progress and goals</li>
              <li>Delivering the core features and services of the app</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">b) Consent (Article 6(1)(a) GDPR):</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Sending push notifications</li>
              <li>Processing sensitive health data related to body measurements and fitness activities</li>
              <li>Using AI-powered features for meal analysis and workout recommendations</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">c) Legitimate Interests (Article 6(1)(f) GDPR):</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Improving app functionality and user experience</li>
              <li>Analyzing usage patterns to enhance features</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Troubleshooting technical issues</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">d) Legal Obligation (Article 6(1)(c) GDPR):</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Complying with applicable laws and regulations</li>
              <li>Responding to legal requests from authorities</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">5. Data Sharing and Recipients</h3>
        <p>We may share your personal data with the following categories of recipients:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Service Providers:</strong> Cloud hosting (Supabase), analytics services, and AI processing providers who assist in operating our services</li>
          <li><strong>Legal Requirements:</strong> Law enforcement or regulatory authorities when required by law</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale</li>
        </ul>
        <p className="mt-2">We ensure all third-party processors comply with GDPR through appropriate contractual safeguards.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">6. International Data Transfers</h3>
        <p>Your data may be transferred to and processed in countries outside the European Economic Area (EEA). Where such transfers occur, we ensure adequate protection through:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Standard Contractual Clauses approved by the European Commission</li>
          <li>Transfers to countries deemed adequate by the European Commission</li>
          <li>Other legally approved safeguards under GDPR Article 46</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">7. Data Retention Periods</h3>
        <p>We retain your personal data for the following periods:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Account Data:</strong> As long as your account remains active</li>
          <li><strong>Fitness and Nutrition Data:</strong> As long as your account remains active</li>
          <li><strong>Deleted Accounts:</strong> Personal data is permanently deleted within 30 days of account deletion</li>
          <li><strong>Legal Requirements:</strong> Longer retention periods may apply where required by law</li>
          <li><strong>Aggregated Data:</strong> Anonymous, aggregated data may be retained indefinitely for statistical purposes</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">8. Your Rights Under GDPR</h3>
        <p>You have the following rights regarding your personal data:</p>
        <div className="mt-2 space-y-2">
          <div>
            <p className="font-semibold">a) Right of Access (Article 15 GDPR)</p>
            <p className="pl-4">Request confirmation of data processing and obtain a copy of your personal data</p>
          </div>
          <div>
            <p className="font-semibold">b) Right to Rectification (Article 16 GDPR)</p>
            <p className="pl-4">Request correction of inaccurate or incomplete personal data</p>
          </div>
          <div>
            <p className="font-semibold">c) Right to Erasure/"Right to be Forgotten" (Article 17 GDPR)</p>
            <p className="pl-4">Request deletion of your personal data under certain conditions</p>
          </div>
          <div>
            <p className="font-semibold">d) Right to Restriction of Processing (Article 18 GDPR)</p>
            <p className="pl-4">Request limitation of processing in specific circumstances</p>
          </div>
          <div>
            <p className="font-semibold">e) Right to Data Portability (Article 20 GDPR)</p>
            <p className="pl-4">Receive your data in a structured, machine-readable format and transmit it to another controller</p>
          </div>
          <div>
            <p className="font-semibold">f) Right to Object (Article 21 GDPR)</p>
            <p className="pl-4">Object to processing based on legitimate interests or direct marketing</p>
          </div>
          <div>
            <p className="font-semibold">g) Right to Withdraw Consent (Article 7(3) GDPR)</p>
            <p className="pl-4">Withdraw consent at any time for consent-based processing</p>
          </div>
          <div>
            <p className="font-semibold">h) Right to Lodge a Complaint (Article 77 GDPR)</p>
            <p className="pl-4">Lodge a complaint with a supervisory authority in your jurisdiction</p>
          </div>
        </div>
        <p className="mt-3">To exercise any of these rights, contact us at quickfit06@gmail.com. We will respond within one month of receipt of your request.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">9. Automated Decision-Making and Profiling</h3>
        <p>We use automated processing and AI algorithms to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Generate personalized workout plans based on your fitness profile</li>
          <li>Analyze food images to provide nutritional information</li>
          <li>Recommend diet plans based on your preferences and goals</li>
        </ul>
        <p className="mt-2">These automated decisions are based on your explicit input and consent. You have the right to contest these decisions and request human intervention by contacting us.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">10. Data Security Measures</h3>
        <p>We implement appropriate technical and organizational measures to protect your personal data, including:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security assessments and updates</li>
          <li>Access controls and authentication mechanisms</li>
          <li>Employee training on data protection</li>
          <li>Incident response procedures</li>
        </ul>
        <p className="mt-2">In the event of a data breach affecting your rights and freedoms, we will notify you and the relevant supervisory authority within 72 hours as required by Article 33 GDPR.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">11. Statutory or Contractual Requirement</h3>
        <p>Providing personal data is:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Required:</strong> To create an account and use the app's services (email, name)</li>
          <li><strong>Optional:</strong> Fitness profile data, nutrition preferences - but needed for personalized features</li>
        </ul>
        <p className="mt-2">Failure to provide required data will prevent you from using the app. Failure to provide optional data will limit personalization features.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">12. Children's Privacy</h3>
        <p>Our services are not directed to individuals under the age of 16. We do not knowingly collect personal data from children under 16. If you become aware that a child has provided us with personal data, please contact us immediately.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">13. Cookies and Tracking Technologies</h3>
        <p>We use essential cookies and similar technologies to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Maintain your session and authentication</li>
          <li>Remember your preferences</li>
          <li>Analyze app usage (with your consent)</li>
        </ul>
        <p className="mt-2">You can control cookies through your browser settings. Disabling essential cookies may affect app functionality.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">14. Changes to This Privacy Policy</h3>
        <p>We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Material changes will be communicated through:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>In-app notifications</li>
          <li>Email notification to your registered email address</li>
          <li>Prominent notice on our website</li>
        </ul>
        <p className="mt-2">Your continued use of the app after changes constitute acceptance of the updated policy.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">15. Supervisory Authority</h3>
        <p>If you are located in the EEA, you have the right to lodge a complaint with your local data protection supervisory authority. A list of supervisory authorities can be found at: <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://edpb.europa.eu/about-edpb/about-edpb/members_en</a></p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">16. Contact Us</h3>
        <p>For any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact:</p>
        <p className="mt-2">
          <strong>Email:</strong> quickfit06@gmail.com<br />
          <strong>Subject:</strong> Data Protection Request
        </p>
        <p className="mt-2">We will respond to your inquiry within 30 days.</p>
      </section>
    </div>
  );
};

export default PrivacyPolicyContent;
