import { FiInfo } from "react-icons/fi";

export default function InfoTip({ text }: { text: string }) {
  return (
    <span className="info-tip" tabIndex={0}>
      <FiInfo size={13} />
      <span className="info-tip-bubble" role="tooltip">
        {text}
      </span>
    </span>
  );
}
