import { normalizeHex } from "../utils/shadeUtils";

/**
 * Single shade color swatch — uses global `.pc-swatch` (same as product cards / product list).
 */
export default function ShadeSwatch({ hex, title, className = "", style, ...rest }) {
  return (
    <span
      className={["pc-swatch", className].filter(Boolean).join(" ")}
      title={title}
      style={{ background: normalizeHex(hex), ...style }}
      {...rest}
    />
  );
}

/**
 * Read-only horizontal row of swatches (home, category grid, related products).
 */
export function ProductShadeSwatches({ variants }) {
  if (!variants?.length) return null;
  return (
    <div className="pc-swatches-wrap">
      <div
        className="pc-swatches"
        role="list"
        aria-label={`Teintes (${variants.length})`}
      >
        {variants.map((s) => (
          <ShadeSwatch key={s.name} hex={s.hex} title={s.name} role="listitem" />
        ))}
      </div>
    </div>
  );
}

function shadeIsOut(sh) {
  return sh.stock != null && !Number.isNaN(Number(sh.stock)) && Number(sh.stock) <= 0;
}

/**
 * Same horizontal scroll + swatch look as product cards / list, with native radios for a11y.
 */
export function SelectableProductShadeSwatches({ name, variants, value, onSelect, groupAriaLabel }) {
  if (!variants?.length) return null;
  return (
    <div className="pc-swatches-wrap pd-shade-picker">
      <div
        className="pc-swatches"
        role="radiogroup"
        aria-label={groupAriaLabel || `Teintes (${variants.length})`}
      >
        {variants.map((sh) => {
          const out = shadeIsOut(sh);
          const on = value === sh.name;
          return (
            <label
              key={sh.name}
              className={["pd-shade-swatch-hit", on && "pd-shade-swatch-hit--on", out && "pd-shade-swatch-hit--out"].filter(Boolean).join(" ")}
            >
              <input
                type="radio"
                name={name}
                className="pd-shade-swatch-input"
                value={sh.name}
                checked={on}
                disabled={out}
                onChange={(e) => onSelect(e.target.value)}
              />
              <ShadeSwatch hex={sh.hex} title={sh.name} aria-hidden />
            </label>
          );
        })}
      </div>
    </div>
  );
}
