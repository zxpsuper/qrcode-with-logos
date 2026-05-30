/**
 * SVG helper functions for building SVG QR code markup.
 * All functions return SVG markup strings — no external dependencies.
 */

/**
 * Wrap body content in a complete <svg> tag.
 */
export function wrapSvg(body: string, width: number): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${width}" width="${width}" height="${width}">` +
    body +
    '</svg>'
  )
}

/**
 * Build a <rect> element.
 */
export function svgRect(
  x: number,
  y: number,
  w: number,
  h: number,
  attrs: Record<string, string> = {}
): string {
  const extra = attrs ? ' ' + attrString(attrs) : ''
  return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}"${extra}/>`
}

/**
 * Build a <circle> element.
 */
export function svgCircle(
  cx: number,
  cy: number,
  r: number,
  attrs: Record<string, string> = {}
): string {
  const extra = attrs ? ' ' + attrString(attrs) : ''
  return `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r)}"${extra}/>`
}

/**
 * Build a <path> element with the given `d` attribute and extra attrs.
 */
export function svgPath(
  d: string,
  attrs: Record<string, string> = {}
): string {
  const extra = attrs ? ' ' + attrString(attrs) : ''
  return `<path d="${d}"${extra}/>`
}

/**
 * Build a <g> (group) element wrapping children.
 */
export function svgGroup(
  children: string,
  attrs: Record<string, string> = {}
): string {
  const extra = attrs ? ' ' + attrString(attrs) : ''
  return `<g${extra}>${children}</g>`
}

/**
 * Build a rounded-rectangle path `d` attribute string.
 * Supports different radii per corner: [tl, tr, br, bl]
 */
export function roundRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  radii: number[]
): string {
  const r = radii.map((v) => Math.min(v, Math.min(w, h) / 2))
  const [tl, tr, br, bl] = r
  const X = fmt
  const Y = fmt
  return (
    `M${X(x + tl)} ${Y(y)}` +
    `L${X(x + w - tr)} ${Y(y)}` +
    (tr ? `A${X(tr)} ${Y(tr)} 0 0 1 ${X(x + w)} ${Y(y + tr)}` : '') +
    `L${X(x + w)} ${Y(y + h - br)}` +
    (br ? `A${X(br)} ${Y(br)} 0 0 1 ${X(x + w - br)} ${Y(y + h)}` : '') +
    `L${X(x + bl)} ${Y(y + h)}` +
    (bl ? `A${X(bl)} ${Y(bl)} 0 0 1 ${X(x)} ${Y(y + h - bl)}` : '') +
    `L${X(x)} ${Y(y + tl)}` +
    (tl ? `A${X(tl)} ${Y(tl)} 0 0 1 ${X(x + tl)} ${Y(y)}` : '') +
    'Z'
  )
}

// ---- Internal helpers ----

function attrString(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ')
}

/**
 * Format number: drop trailing zeros for compact SVG output.
 */
function fmt(n: number): string {
  // Keep 2 decimal places max, strip trailing zeros
  const s = n.toFixed(2)
  return s.replace(/\.?0+$/, '')
}
