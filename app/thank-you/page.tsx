import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Animations from "@/components/Animations";
import { IconCheck } from "@/components/Icons";
import { PHONE, PHONE_HREF } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Thank You · Amaya Senior Living by Vera Vita",
  description: "Your visit request has been received.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      {/* Google tag (gtag.js) event */}
      <Script id="google-ads-conversion-event" strategy="afterInteractive">
        {`
          gtag('event', 'amayaseniorliving', {
            // <event_parameters>
          });
        `}
      </Script>
      <Nav />
      <main>
        <section className="thanks">
          <div className="container thanks-inner">
            <span className="thanks-icon" data-reveal-scale>
              <IconCheck size={40} />
            </span>
            <span className="eyebrow" data-reveal>
              Request Received
            </span>
            <h1 className="thanks-title" data-reveal-line>
              <span className="line-mask">
                <span className="line-inner">Thank you.</span>
              </span>
            </h1>
            <p className="thanks-sub" data-reveal data-delay="0.15">
              We&rsquo;ve received your visit request. Our team will call you
              shortly to confirm your appointment at the Amaya Experience
              Centre.
            </p>

            <div className="thanks-ctas" data-reveal data-delay="0.25">
              <Link className="btn btn-primary btn-lg" href="/">
                Back to Home
              </Link>
              <a className="btn btn-secondary btn-lg" href={PHONE_HREF}>
                {PHONE}
              </a>
            </div>
          </div>
        </section>
        <Footer />
      </main>
      <Animations />
    </>
  );
}
