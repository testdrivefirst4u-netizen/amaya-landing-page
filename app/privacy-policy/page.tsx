import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Animations from "@/components/Animations";
import { PHONE, PHONE_HREF } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Privacy Policy · Amaya Senior Living by Vera Vita",
  description:
    "How Vera Vita Living LLP collects, uses and protects your information when you visit the Amaya website or enquire about the project.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="legal-hero">
          <div className="container">
            <span className="eyebrow" data-reveal>
              Legal
            </span>
            <h1 className="legal-hero-title" data-reveal-line>
              <span className="line-mask">
                <span className="line-inner">Privacy Policy</span>
              </span>
            </h1>
            <p className="legal-hero-sub" data-reveal data-delay="0.15">
              Last updated: August 2026
            </p>
          </div>
        </section>

        <section className="legal-page">
          <div className="container">
            <div className="legal-content" data-reveal-fade>
              <p>
                Vera Vita Living LLP (&ldquo;Vera Vita&rdquo;, &ldquo;Amaya&rdquo;,
                &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) respects
                your privacy. This policy explains what information we
                collect through amayaseniorliving.com, how we use it, and the
                choices you have.
              </p>

              <h2>Information we collect</h2>
              <p>
                When you enquire about Amaya, book a visit, or contact us
                through the website or WhatsApp, we may collect your name,
                phone number, email address, and any details you choose to
                share about your requirements. We do not knowingly collect
                sensitive personal data such as financial or health
                information through the website itself.
              </p>
              <p>
                We also automatically collect limited technical information
                &mdash; such as pages visited, device and browser type,
                approximate location and referring website &mdash; through
                analytics and tagging tools described below.
              </p>

              <h2>Cookies and analytics</h2>
              <p>
                This website uses Google Analytics and Google Tag Manager to
                understand how visitors use the site and to improve it over
                time. These tools use cookies and similar technologies to
                collect anonymised usage data. You can disable cookies through
                your browser settings, though some parts of the site may not
                function as intended if you do.
              </p>

              <h2>How we use your information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Respond to enquiries and schedule visits to the Amaya Experience Centre</li>
                <li>Share project updates, pricing and availability that you have requested</li>
                <li>Improve our website, content and communication</li>
                <li>Meet legal, regulatory and RERA-related obligations</li>
              </ul>
              <p>
                We do not sell your personal information. We may share it
                with trusted service providers (such as our sales, CRM or
                hosting partners) strictly to help us operate the website and
                respond to your enquiry, and only to the extent required by
                law or regulatory authorities.
              </p>

              <h2>WhatsApp and phone communication</h2>
              <p>
                If you contact us via the &ldquo;Book a Visit&rdquo; WhatsApp
                link or call the numbers listed on this site, that
                conversation is subject to WhatsApp&rsquo;s and your mobile
                carrier&rsquo;s own privacy practices in addition to this
                policy.
              </p>

              <h2>Data retention and security</h2>
              <p>
                We retain enquiry information only for as long as needed to
                respond to you and fulfil the purposes described above, and
                take reasonable technical and organisational measures to
                protect it against unauthorised access, loss or misuse. No
                method of transmission over the internet is completely
                secure, and we cannot guarantee absolute security.
              </p>

              <h2>Your choices</h2>
              <p>
                You may ask us to correct, update or delete the personal
                information we hold about you by writing to us using the
                contact details below. We will respond within a reasonable
                time, subject to applicable law.
              </p>

              <h2>Changes to this policy</h2>
              <p>
                We may update this Privacy Policy from time to time to
                reflect changes in our practices or applicable law. The
                &ldquo;Last updated&rdquo; date above indicates when this
                policy was last revised.
              </p>

              <h2>Contact us</h2>
              <p>
                For any questions about this Privacy Policy or your
                information, please contact us at{" "}
                <a href={PHONE_HREF}>{PHONE}</a>, or visit the Amaya
                Experience Centre, Munirabad, Medchal, Hyderabad, Telangana.
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
      <Animations />
    </>
  );
}
