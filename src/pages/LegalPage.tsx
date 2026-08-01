import { motion } from 'framer-motion';

interface LegalPageProps {
  type: 'terms' | 'privacy' | 'refund' | 'aup';
}

const legalContent = {
  terms: {
    title: 'Terms of Service',
    icon: '📜',
    lastUpdated: 'January 1, 2026',
    sections: [
      { heading: '1. Acceptance of Terms', content: 'By accessing and using Range Cloud Hosting services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all visitors, users, and customers of Range Cloud Hosting.' },
      { heading: '2. Service Description', content: 'Range Cloud Hosting provides game server hosting, Discord bot hosting, and related services. We use enterprise-grade infrastructure including AMD Ryzen 9 processors, NVMe SSD storage, and DDoS protection. Services are provided on a subscription basis with various plans available.' },
      { heading: '3. Account Registration', content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 13 years of age to use our services.' },
      { heading: '4. Payment Terms', content: 'Services are billed on a recurring basis (monthly or quarterly). Payment is due at the beginning of each billing cycle. We accept major credit cards, PayPal, and select cryptocurrency payments. Failure to pay may result in service suspension.' },
      { heading: '5. Service Level Agreement', content: 'Range Cloud Hosting guarantees 99.9% network uptime. In the event of downtime exceeding this guarantee, customers may be eligible for service credits. Scheduled maintenance windows are excluded from uptime calculations.' },
      { heading: '6. Termination', content: 'Either party may terminate the service agreement at any time. Upon termination, you will lose access to your servers and data. We recommend creating backups before cancellation. Range Cloud reserves the right to terminate accounts that violate these terms.' },
      { heading: '7. Limitation of Liability', content: 'Range Cloud Hosting shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    icon: '🔒',
    lastUpdated: 'January 1, 2026',
    sections: [
      { heading: '1. Information We Collect', content: 'We collect information you provide directly to us, including name, email address, billing information, and server data. We also automatically collect certain information when you use our services, including IP addresses, browser type, and usage patterns.' },
      { heading: '2. How We Use Your Information', content: 'We use collected information to provide, maintain, and improve our services; process transactions; send service notifications; respond to support requests; and detect and prevent fraud or abuse. We do not sell your personal information to third parties.' },
      { heading: '3. Data Storage and Security', content: 'Your data is stored on secure servers with encryption at rest and in transit. We implement industry-standard security measures including firewalls, access controls, and regular security audits. Server data is stored in the region you select.' },
      { heading: '4. Data Sharing', content: 'We may share information with trusted third-party service providers who assist us in operating our services (payment processors, analytics providers). We may also disclose information when required by law or to protect our rights and safety.' },
      { heading: '5. Your Rights', content: 'You have the right to access, correct, or delete your personal data. You can manage your account settings through our client area. For data deletion requests, please contact our support team. We will respond to requests within 30 days.' },
      { heading: '6. Cookies', content: 'We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can control cookie preferences through your browser settings.' },
    ],
  },
  refund: {
    title: 'Refund Policy',
    icon: '💰',
    lastUpdated: 'January 1, 2026',
    sections: [
      { heading: '1. Money-Back Guarantee', content: 'Range Cloud Hosting offers a 48-hour money-back guarantee on all new hosting services. If you are not satisfied with our services within the first 48 hours of purchase, you may request a full refund.' },
      { heading: '2. Eligibility', content: 'Refunds are available for new purchases only. Renewals, upgrades, add-ons, and dedicated IP purchases are not eligible for refund under the money-back guarantee. One refund per customer per 12-month period.' },
      { heading: '3. How to Request a Refund', content: 'To request a refund, submit a support ticket through our client area or contact our billing team at billing@rangecloud.gg. Please include your account details and reason for the refund request.' },
      { heading: '4. Processing Time', content: 'Approved refunds are processed within 5-10 business days. Refunds are issued to the original payment method. PayPal refunds may appear sooner than credit card refunds.' },
      { heading: '5. Chargebacks', content: 'We encourage customers to contact us before initiating a chargeback with their payment provider. Unauthorized chargebacks may result in account termination and may affect future service eligibility.' },
    ],
  },
  aup: {
    title: 'Acceptable Use Policy',
    icon: '⚖️',
    lastUpdated: 'January 1, 2026',
    sections: [
      { heading: '1. General Use', content: 'Our services must be used for lawful purposes only. You are responsible for all content hosted on your servers and for ensuring compliance with all applicable laws and regulations.' },
      { heading: '2. Prohibited Activities', content: 'The following activities are strictly prohibited: DDoS attacks or network abuse; distribution of malware; cryptocurrency mining; hosting of illegal content; spamming or phishing; unauthorized access to other systems; resource abuse or excessive resource consumption.' },
      { heading: '3. Resource Usage', content: 'Each plan has allocated resources (CPU, RAM, disk space). Consistently exceeding your allocated resources may result in service restrictions or required upgrades. We monitor resource usage to ensure fair allocation for all customers.' },
      { heading: '4. Content Policy', content: 'You are solely responsible for the content hosted on your server. Content that is illegal, infringing on intellectual property rights, or harmful is strictly prohibited. We reserve the right to remove content that violates this policy.' },
      { heading: '5. Enforcement', content: 'Violations of this policy may result in warnings, service suspension, or account termination depending on the severity. Repeated violations will result in permanent termination. No refunds are provided for policy-related terminations.' },
      { heading: '6. Reporting', content: 'If you become aware of any violations of this Acceptable Use Policy, please report them to abuse@rangecloud.gg. We investigate all reports and take appropriate action.' },
    ],
  },
};

export function LegalPage({ type }: LegalPageProps) {
  const content = legalContent[type];

  return (
    <div className="pt-20">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-5xl mb-4 block">{content.icon}</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{content.title}</h1>
            <p className="text-white/40 text-sm">Last updated: {content.lastUpdated}</p>
          </motion.div>

          <div className="glass rounded-2xl p-8 md:p-12 space-y-8">
            {content.sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <h2 className="text-lg font-bold text-white mb-3">{section.heading}</h2>
                <p className="text-sm text-white/50 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-white/30">
              If you have questions about this {content.title.toLowerCase()}, please contact us at legal@rangecloud.gg
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
