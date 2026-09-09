import Image from "next/image";
import Link from "next/link";
import { PHONE, PHONE_HREF } from "@/lib/assets";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61591786415988",
    Icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/amayaseniorliving/",
    Icon: FaInstagram,
  },
  // {
  //   label: "YouTube",
  //   href: "https://www.youtube.com/@AmayaSeniorLiving",
  //   Icon: FaYoutube,
  // },
  // {
  //   label: "Pinterest",
  //   href: "https://in.pinterest.com/Amayaseniorliving/",
  //   Icon: FaPinterestP,
  // },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/amaya-senior-living/about/",
    Icon: FaLinkedinIn,
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-parent">Vera Vita</span>
            <Image
              src="/Amaya_black_Logo.webp"
              alt="Amaya"
              width={1080}
              height={543}
              className="footer-logo-img"
            />
            <span className="footer-descriptor">
              Independent living, at its most graceful.
            </span>
            <div className="footer-socials">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social-link"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col footer-col--visit">
            <h4>Visit</h4>
            <p>
              Amaya Experience Centre
              <br />
              Munirabad, Medchal
              Hyderabad, Telangana
              <br />
              Monday to Saturday <br/>
              9:00 AM to 6:00 PM
            </p>
            {/* <span className="footer-rera-note">RERA Number: P02200011109</span> */}
          </div>

          <div className="footer-col footer-col--speak">
            <h4>Speak to us</h4>
            <p>
              <a href={PHONE_HREF} className="footer-phone-link">
                {PHONE}
              </a>
              <span className="footer-mobile-optional">
                <br />
                Senior Living by Vera Vita
                <br />1 to 3.5 BHK residences
              </span>
            </p>
            <a
              href="https://wa.me/919553395533"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-whatsapp-link"
            >
              <FaWhatsapp size={20} />
              Chat on WhatsApp
            </a>
          </div>

          <div className="footer-col footer-col--developer">
            <h4>Developer</h4>
            <p>
              Vera Vita Living LLP
              <br />
              Munirabad, Medchal
              <br />
              Hyderabad, Telangana
              <br />
              RERA No: P02200011109
            </p>
          </div>
        </div>

        <nav className="footer-explore-links" aria-label="Explore">
          <Link href="/gallery">Gallery</Link>
          <Link href="/faqs">FAQs</Link>
          <Link href="/blogs">Blogs</Link>
        </nav>

        <div className="footer-bottom">
          <div className="footer-legal-block">
            <span className="footer-legal-title">Disclaimer</span>
            <p className="footer-legal">
              The information, plans, specifications, visuals, elevations and
              other details presented on this website are indicative and for
              representational purposes only. They do not constitute a
              promise, representation, warranty or contractual obligation on
              the part of Vera Vita Living or its affiliates. The developer,
              architects and consultants reserve the right to revise, modify,
              add to or remove any design element, specification, amenity,
              layout or other project detail, where required, subject to
              applicable laws and approvals. For the latest and legally
              applicable information relating to Amaya, including project
              specifications, pricing, approvals and terms of purchase,
              please contact our sales team during office hours.
            </p>
          </div>
          <div className="footer-copy-block">
            <p className="footer-copy">
              &copy; {new Date().getFullYear()} Vera Vita Living LLP
            </p>
            <nav className="footer-legal-links" aria-label="Legal">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
            </nav>
            <p className="footer-credit">
              Developed by
             <Link href="https://www.broaddcast.com/"> <Image
                src="/broaddcast/BroaddCast-Logo.svg"
                alt="BroaddCast"
                width={110}
                height={37}
                className="footer-credit-logo"
              /></Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
