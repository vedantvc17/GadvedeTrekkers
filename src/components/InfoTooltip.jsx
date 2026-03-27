export default function InfoTooltip({ text }) {
  return (
    <span
      title={text}
      aria-label={text}
      className="gt-tooltip"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 18,
        height: 18,
        marginLeft: 6,
        borderRadius: "50%",
        background: "#e2e8f0",
        color: "#334155",
        fontSize: 11,
        fontWeight: 800,
        cursor: "help",
        verticalAlign: "middle",
      }}
    >
      i
    </span>
  );
}
