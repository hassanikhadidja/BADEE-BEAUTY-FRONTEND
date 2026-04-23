import { useLang } from "../context/LangContext";
import { LogoMark } from "./Logo";

export default function Banner() {
  const { t } = useLang();
  return (
    <div
      style={{
        background: "#1A1A1A",
        color: "#fff",
        padding: "8px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
      }}
    >
      <LogoMark variant="black" height={26} alt="" style={{ flexShrink: 0, opacity: 0.95 }} />
      <div className="mq-wrap" style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 10 }}>
        <span className="mq-track" style={{ fontSize: 12, letterSpacing: ".03em" }}>
          {t.delivery} &nbsp;&nbsp;&nbsp; {t.delivery} &nbsp;&nbsp;&nbsp;
        </span>
      </div>
    </div>
  );
}
