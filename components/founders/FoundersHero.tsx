import PageHero from "@/components/PageHero";

export default function FoundersHero() {
  return (
    <PageHero
      eyebrow="The Founders"
      titleLines={["The people behind", "Vera Vita."]}
      sub="Three friends. Three strengths. One shared purpose."
      strip={[
        { label: "Founders", value: "Dhruv, Arudra and Tanay" },
        { label: "Families", value: "Three Hyderabad houses" },
        { label: "Earliest legacy", value: "Since 1895" },
      ]}
    />
  );
}
