import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Animations from "@/components/Animations";
import { PHONE, PHONE_HREF } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Terms & Conditions · Amaya Senior Living by Vera Vita",
  description:
    "Terms governing the use of the Amaya website by Vera Vita Living LLP, including disclaimers on project information, imagery and pricing.",
};

export default function TermsPage() {
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
                <span className="line-inner">Terms &amp; Conditions</span>
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
                These Terms &amp; Conditions govern your use of
                amayaseniorliving.com (the &ldquo;Website&rdquo;), operated by
                Vera Vita Living LLP (&ldquo;Vera Vita&rdquo;,
                &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) for
                the Amaya project in Munirabad, Medchal, Hyderabad. By
                accessing or using the Website, you agree to these terms.
              </p>

              <h2>Indicative information only</h2>
              <p>
                All images, renderings, specifications, amenities, distances,
                travel times, floor plans, pricing and other project details
                shown on this Website are indicative and for illustrative
                purposes only. They do not constitute a promise,
                representation, warranty or contractual obligation on the
                part of Vera Vita or its affiliates. The actual development,
                features, specifications, views and surrounding
                infrastructure may vary from what is depicted here.
              </p>
              <p>
                Vera Vita, its architects and consultants reserve the right
                to revise, modify, add to or remove any design element,
                specification, amenity, layout or other project detail,
                where required, subject to applicable laws and approvals.
              </p>

              <h2>Not an offer or contract</h2>
              <p>
                Nothing on this Website constitutes an offer, invitation or
                solicitation to buy or sell any property, nor forms part of
                any legally binding agreement. Any transaction relating to
                Amaya will be governed solely by the terms of the final
                agreement for sale and other project documentation executed
                between you and Vera Vita, and by the terms registered under
                the Real Estate (Regulation and Development) Act, 2016
                (RERA). Prospective buyers should independently verify all
                information and refer to the final approved plans, RERA
                registration and agreements before making any decision.
              </p>

              <h2>Pricing</h2>
              <p>
                Prices mentioned on the Website (including any &ldquo;homes
                from&rdquo; figures) are indicative, subject to change without
                notice, and exclude applicable taxes, statutory charges and
                other costs unless stated otherwise. Please contact our sales
                team for current pricing and availability.
              </p>

              <h2>Intellectual property</h2>
              <p>
                All content on this Website &mdash; including text, images,
                renderings, logos and design &mdash; is the property of Vera
                Vita or its licensors and is protected by applicable
                intellectual property laws. You may not reproduce,
                distribute or use this content for commercial purposes
                without our prior written consent.
              </p>

              <h2>Third-party links and services</h2>
              <p>
                The Website may link to third-party services, including
                WhatsApp for enquiries and Google Analytics/Tag Manager for
                site analytics. We are not responsible for the content,
                policies or practices of these third-party services.
              </p>

              <h2>Limitation of liability</h2>
              <p>
                The Website and its content are provided on an &ldquo;as
                is&rdquo; basis without warranties of any kind, express or
                implied. To the fullest extent permitted by law, Vera Vita
                shall not be liable for any direct, indirect, incidental or
                consequential loss arising from your use of, or reliance on,
                information contained on this Website.
              </p>

              <h2>Governing law</h2>
              <p>
                These Terms &amp; Conditions are governed by the laws of
                India, and any disputes arising from your use of the Website
                shall be subject to the exclusive jurisdiction of the courts
                in Hyderabad, Telangana.
              </p>

              <h2>Changes to these terms</h2>
              <p>
                We may update these Terms &amp; Conditions from time to time.
                Continued use of the Website after any changes constitutes
                your acceptance of the revised terms.
              </p>

              <h2>Contact us</h2>
              <p>
                For any questions about these Terms &amp; Conditions, please
                contact us at <a href={PHONE_HREF}>{PHONE}</a>, or visit the
                Amaya Experience Centre, Munirabad, Medchal, Hyderabad,
                Telangana.
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
