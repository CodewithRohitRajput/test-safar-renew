import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">
        At Safar Wanderlust, your privacy is of utmost importance to us. This
        Privacy Policy outlines how we collect, use, and safeguard your personal
        information when you visit our website, safarwanderlust.com, and engage
        with our services. By using our website, you agree to the practices
        described in this policy.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">
        1. Information We Collect
      </h2>
      <p className="text-gray-600 mb-2">
        We collect the following types of information to provide and improve our
        services:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <span className="font-semibold">Personal Information:</span> Name,
          email address, and phone number.
        </li>
        <li>
          <span className="font-semibold">Payment Information:</span>{' '}
          Credit/debit card details or other payment methods (processed securely
          via third-party payment gateways).
        </li>
        <li>
          <span className="font-semibold">Profile Information:</span> Travel
          preferences, interests, and group travel participation history.
        </li>
        <li>
          <span className="font-semibold">
            Automatically Collected Information:
          </span>{' '}
          IP address, browser type, device information, cookies, and usage data.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">
        2. How We Use Your Information
      </h2>
      <p className="text-gray-600 mb-4">
        We use your information for the following purposes:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          Booking Management: To process your travel bookings and ensure a
          seamless travel experience.
        </li>
        <li>
          Payment Processing: To securely process payments through trusted
          third-party providers.
        </li>
        <li>
          Customer Support: To address inquiries, provide updates, and respond
          to your requests.
        </li>
        <li>
          Marketing: To send you updates about trips, promotions, and offers
          (you may opt-out anytime).
        </li>
        <li>
          Improving Services: To analyze usage data and enhance user experiences
          on our website.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">
        3. Sharing Your Information
      </h2>
      <p className="text-gray-600 mb-4">
        We do not sell, rent, or share your personal information with third
        parties, except:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          With trusted third-party service providers (e.g., payment processors,
          travel partners) to facilitate services.
        </li>
        <li>
          When required by law or to protect the rights and safety of Safar
          Wanderlust.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">4. Payment Security</h2>
      <p className="text-gray-600 mb-4">
        All payment transactions are processed through secure, PCI-compliant
        third-party gateways. We do not store your payment details on our
        servers.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">
        5. Cookies and Tracking Technologies
      </h2>
      <p className="text-gray-600 mb-4">
        Our website uses cookies to enhance user experience, analyze website
        traffic, and remember preferences. You can manage cookie preferences
        through your browser settings.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">6. Data Retention</h2>
      <p className="text-gray-600 mb-4">
        We retain your personal information as long as necessary to fulfill the
        purposes outlined in this policy unless a longer retention period is
        required by law.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">7. Your Rights</h2>
      <p className="text-gray-600 mb-4">You have the right to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Access, update, or delete your personal information.</li>
        <li>Opt-out of marketing communications.</li>
        <li>Request a copy of the data we hold about you.</li>
      </ul>
      <p className="text-gray-600 mb-4">
        To exercise these rights, contact us at{' '}
        <a
          href="mailto:Safarwanderlust@gmail.com"
          className="text-blue-500 underline"
        >
          Safarwanderlust@gmail.com
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">8. Third-Party Links</h2>
      <p className="text-gray-600 mb-4">
        Our website may contain links to third-party websites. We are not
        responsible for the privacy practices or content of these external
        sites.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">
        9. Changes to This Policy
      </h2>
      <p className="text-gray-600 mb-4">
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with the updated effective date.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">10. Contact Us</h2>
      <p className="text-gray-600 mb-4">
        If you have any questions or concerns about this Privacy Policy or your
        data, please contact us at:
      </p>
      <ul className="mb-4">
        <li>
          Email:{' '}
          <a
            href="mailto:Safarwanderlust@gmail.com"
            className="text-blue-500 underline"
          >
            Safarwanderlust@gmail.com
          </a>
        </li>
        <li>
          Phone:{' '}
          <a href="tel:8818931020" className="text-blue-500 underline">
            8818931020
          </a>
        </li>
      </ul>
    </div>
  )
}

export default PrivacyPolicy
