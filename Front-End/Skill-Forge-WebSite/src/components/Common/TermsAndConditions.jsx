import React, { useState } from 'react';
import { X } from 'lucide-react';

const TermsAndConditions = ({ isOpen, onClose, onAccept }) => {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  // Track scrolling to enable the accept button only when user has scrolled to the bottom
  const handleScroll = (e) => {
    const element = e.target;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 20) {
      setScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-[#0a66c2] text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Terms and Conditions</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-blue-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 p-6 overflow-y-auto text-gray-700"
          onScroll={handleScroll}
        >
          <h3 className="text-lg font-semibold mb-4">1. Acceptance of Terms</h3>
          <p className="mb-4">
            By accessing or using the Skill Forge platform, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access or use our services.
          </p>

          <h3 className="text-lg font-semibold mb-4">2. User Accounts</h3>
          <p className="mb-4">
            When creating an account, you must provide accurate and complete information. You are solely responsible for the activity that occurs on your account, and you must keep your account password secure.
          </p>

          <h3 className="text-lg font-semibold mb-4">3. User Content</h3>
          <p className="mb-4">
            Users may post content, including profiles, workshop materials, comments, and other content. You retain ownership of your content, but grant Skill Forge a non-exclusive license to use, reproduce, and distribute your content in connection with our services.
          </p>

          <h3 className="text-lg font-semibold mb-4">4. Privacy Policy</h3>
          <p className="mb-4">
            Our Privacy Policy explains how we collect, use, and protect your personal information. By using Skill Forge, you agree to our collection and use of information in accordance with our Privacy Policy.
          </p>

          <h3 className="text-lg font-semibold mb-4">5. Prohibited Activities</h3>
          <p className="mb-4">

            You agree not to engage in any of the following prohibited activities: (1) copying, distributing, or disclosing any part of the platform; (2) using any automated system to access the platform; (3) transmitting spam, chain letters, or other unsolicited emails; (4) attempting to interfere with or compromise the system integrity or security; (5) uploading invalid data, viruses, or other malicious code; (6) collecting or harvesting user data without permission; (7) impersonating another person or misrepresenting your affiliation with any person or entity; (8) using the platform for any illegal or unauthorized purpose.
          </p>

          <h3 className="text-lg font-semibold mb-4">6. Termination</h3>
          <p className="mb-4">
            We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including breach of these Terms.
          </p>

          <h3 className="text-lg font-semibold mb-4">7. Limitation of Liability</h3>
          <p className="mb-4">
            In no event shall Skill Forge, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h3 className="text-lg font-semibold mb-4">8. Changes to Terms</h3>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. We will provide notice of any significant changes by posting the new Terms on the platform and/or via email.
          </p>

          <h3 className="text-lg font-semibold mb-4">9. Contact Us</h3>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at support@skillforge.com.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            disabled={!scrolledToBottom}
            className={`px-4 py-2 text-white rounded ${
              scrolledToBottom
                ? 'bg-[#0a66c2] hover:bg-[#084b8a]'
                : 'bg-gray-400 cursor-not-allowed'
            } transition-colors`}
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
