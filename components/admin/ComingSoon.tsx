import { FiTool } from "react-icons/fi";

export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="admin-topbar">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="admin-coming-soon">
        <FiTool size={28} />
        <h2>Coming soon</h2>
        <p>This section isn&rsquo;t built out yet — check back in a future update.</p>
      </div>
    </div>
  );
}
