import type { Metadata } from "next";
import Script from "next/script";
import BookVisitProvider from "@/components/BookVisitContext";
import ChatWidget from "@/components/ChatWidget";

import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/jost/300.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "@fontsource/jost/600.css";

import "./globals.css";
import "./sections.css";
import "./redesign.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.amayaseniorliving.com"),
  title: "Amaya · Senior Living by Vera Vita | Medchal, Hyderabad",
  description:
    "Independent living, beautifully supported. A residential community for seniors beside a 700-acre reserve forest in Medchal, Hyderabad. 1 to 3.5 BHK homes from ₹82 Lac.",
  openGraph: {
    title: "Amaya by Vera Vita | Active Senior Living in Hyderabad",
    description:
      "Amaya is a luxury active senior living community in Hyderabad, set beside a 700-acre reserve forest, where independent living is enriched by wellness, healthcare, hospitality and community.",
    type: "website",
    images: [
      {
        url: "/og-images/OG_Tag.png",
        width: 1200,
        height: 628,
        alt: "Amaya by Vera Vita | Active Senior Living in Hyderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amaya by Vera Vita | Active Senior Living in Hyderabad",
    description:
      "Amaya is a luxury active senior living community in Hyderabad, set beside a 700-acre reserve forest, where independent living is enriched by wellness, healthcare, hospitality and community.",
    images: ["/og-images/OG_Tag.png"],
  },
  verification: {
    google: "d7A1cTf_WqvlKjugyMSFGEEbJ4ZaieZjFK-Es1VFaug",
  },
  icons: {
    icon: [
      // { url: "/favicon.ico", sizes: "any" },
      {
        url: "/favicon-light.png",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-dark.png",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LEJQS6NMKX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LEJQS6NMKX');
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18403926863"
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18403926863');
          `}
        </Script>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K929WBRN');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1042687984836815');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K929WBRN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1042687984836815&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <BookVisitProvider>{children}</BookVisitProvider>
        {/* <ChatWidget /> */}
      </body>
    </html>
  );
}
