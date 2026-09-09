import { Noto_Serif_Telugu } from "next/font/google";

export const teluguFont = Noto_Serif_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500"],
  variable: "--font-telugu",
  display: "swap",
});
