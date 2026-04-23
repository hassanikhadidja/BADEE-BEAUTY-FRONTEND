/**
 * PNG icons from `public/icons/` (CRA serves `/icons/...`).
 * @param {string} name — filename without `.png` (e.g. `facebook`, `delivery`)
 */
export default function IconImg({ name, height = 20, width, alt = "", className, style }) {
  return (
    <img
      src={`/icons/${name}.png`}
      alt={alt}
      className={className}
      width={width}
      height={height}
      style={{
        width: width ?? "auto",
        height,
        objectFit: "contain",
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
