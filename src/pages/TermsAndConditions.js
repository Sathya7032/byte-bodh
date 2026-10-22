import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import useSEO from "../hooks/useSEO";


function TermsAndConditions() {
  useSEO({
    title: "Terms and Conditions | ByteBodh - User Agreement",
    description: "Read the Terms and Conditions of ByteBodh. Learn about access licenses, account security, limitations of liability, and service conditions.",
    keywords: "terms and conditions, user agreement, bytebodh terms, developer tools usage"
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600 flex flex-col justify-between">
      <Header />
      
      <div className="flex-grow pt-36 pb-20 bg-gradient-to-br from-emerald-50/10 via-white to-teal-50/10">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Terms and Conditions
            </h1>
            <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <div className="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl border border-slate-200/50 p-8 sm:p-10 shadow-sm space-y-8 text-left">
            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                By accessing, registering with, or utilizing ByteBodh ("the Platform", "Website", "we", "us", or "our"), including our web portfolio builder, Linktree bio engine, and Instagram automation services, you accept and agree to be legally bound by these Terms and Conditions. If you do not agree to these terms, you must discontinue use of the platform immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                2. Platform Services
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">
                ByteBodh provides an integrated personal branding and lead generation suite, comprising:
              </p>
              <ul className="list-disc pl-5 text-slate-500 text-sm font-medium space-y-2">
                <li><strong className="text-slate-700">Portfolio Website Builder:</strong> Dynamic web portfolio hosting with customizable templates deployed on user subdomains (<code className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">username.bytebodh.in</code>) and custom domains.</li>
                <li><strong className="text-slate-700">Linktree Bio Link Engine:</strong> Mobile-optimized link hubs (<code className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">bytebodh.in/username</code>) with modular themes, link scheduling, click analytics, and sensitive content gating.</li>
                <li><strong className="text-slate-700">Instagram Comment-to-DM Lead Automation:</strong> Automated webhook-driven messaging that sends direct messages containing user-designated links when Instagram users comment trigger keywords on authorized Reels or Posts.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                3. Instagram Comment-to-DM Automation Terms & Meta Compliance
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">
                Users connecting their Instagram accounts and configuring automation rules agree to the following mandatory standards:
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Official Meta API Authorization</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Instagram automation operates exclusively via authorized Meta / Instagram Graph API OAuth tokens. You must be the rightful administrator of the connected Instagram Professional or Creator account.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Strict Anti-Spam & Content Rules</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You may only trigger automated DMs in direct response to genuine, voluntary user comments requesting your content. You strictly agree NOT to configure triggers or automated DMs for unsolicited bulk spam, phishing, adult or prohibited content, misleading schemes, or harassment.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Pro Plan Requirement</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Instagram Comment-to-DM automation rule creation, active webhook monitoring, and DM dispatch are exclusive to active PRO subscribed users. If a subscription lapses or expires, active automation rules are automatically paused.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Third-Party Platform Disclaimers</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ByteBodh is not affiliated with, endorsed by, or sponsored by Meta Platforms, Inc. or Instagram. You acknowledge that Meta enforces its own rate limits, community guidelines, and API availability. ByteBodh is not liable for actions taken by Meta against your account resulting from excessive spamming, guideline violations, or third-party API interruptions.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                4. User Accounts, Authentication & Subscriptions
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-3">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your profile.
              </p>
              <ul className="list-disc pl-5 text-slate-500 text-sm font-medium space-y-2">
                <li><strong className="text-slate-700">Billing Cycles:</strong> Pro subscriptions are available on monthly and annual billing cycles as indicated at checkout.</li>
                <li><strong className="text-slate-700">Cancellations:</strong> You can cancel your subscription at any time via your dashboard. Your benefits will continue until the end of the active billing cycle.</li>
                <li><strong className="text-slate-700">Refunds:</strong> Subscription fees are non-refundable once the billing period has commenced, except where mandated by statutory law.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                5. User-Generated Content & Linktree Links
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-3">
                You retain ownership of your portfolio content, projects, bio details, and links. However, you grant ByteBodh a worldwide, royalty-free license to host, display, and transmit this content to provide the services.
              </p>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                You agree not to publish infringing, fraudulent, defamatory, or harmful content. We reserve the right to remove any link, portfolio, or account that violates these standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                6. Intellectual Property
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                The ByteBodh software, interface designs, template layouts, logo, branding, and automation algorithms are the intellectual property of ByteBodh. You may not copy, decompile, reverse-engineer, or resell any part of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                7. Limitation of Liability
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                To the fullest extent permitted by law, ByteBodh and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or loss of profits, data, or business opportunities arising from your use of or inability to use the platform or third-party social media integrations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                8. Service Modifications & Termination
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                We reserve the right to modify, suspend, or terminate the platform or any part of the services at any time. We also reserve the right to suspend or ban accounts that engage in platform abuse, spam, or unlawful behavior.
              </p>
            </section>

            <section className="pt-4">
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                9. Contact Information
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                For any questions regarding these Terms and Conditions, please contact us:
              </p>
              
              <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-500/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-sm">
                  <div className="space-y-3">
                    <h5 className="font-black text-slate-800 text-base">ByteBodh</h5>
                    <div className="space-y-2 text-slate-600 font-semibold">
                      <p>
                        <span className="font-bold">Phone:</span>{" "}
                        <a href="tel:+917032488372" className="text-emerald-600 hover:text-emerald-800 transition-colors">
                          +91 70324 88372
                        </a>
                      </p>
                      <p>
                        <span className="font-bold">Email:</span>{" "}
                        <a href="mailto:info@bytebodh.in" className="text-emerald-600 hover:text-emerald-800 transition-colors">
                          info@bytebodh.in
                        </a>
                      </p>
                      <p>
                        <span className="font-bold">Legal:</span>{" "}
                        <a href="mailto:legal@bytebodh.in" className="text-emerald-600 hover:text-emerald-800 transition-colors">
                          legal@bytebodh.in
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-black text-slate-800 text-base">Response Time</h5>
                    <div className="space-y-2 text-slate-500 font-medium">
                      <p>General Inquiries: Within 24 hours</p>
                      <p>Legal Matters: 2-3 business days</p>
                      <p>Technical Support: Within 12 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default TermsAndConditions;