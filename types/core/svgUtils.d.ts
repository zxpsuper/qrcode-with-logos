/**
 * SVG helper functions for building SVG QR code markup.
 * All functions return SVG markup strings — no external dependencies.
 */
/**
 * Wrap body content in a complete <svg> tag.
 */
export declare function wrapSvg(body: string, width: number): string;
/**
 * Build a <rect> element.
 */
export declare function svgRect(x: number, y: number, w: number, h: number, attrs?: Record<string, string>): string;
/**
 * Build a <circle> element.
 */
export declare function svgCircle(cx: number, cy: number, r: number, attrs?: Record<string, string>): string;
/**
 * Build a <path> element with the given `d` attribute and extra attrs.
 */
export declare function svgPath(d: string, attrs?: Record<string, string>): string;
/**
 * Build a <g> (group) element wrapping children.
 */
export declare function svgGroup(children: string, attrs?: Record<string, string>): string;
/**
 * Build a rounded-rectangle path `d` attribute string.
 * Supports different radii per corner: [tl, tr, br, bl]
 */
export declare function roundRectPath(x: number, y: number, w: number, h: number, radii: number[]): string;
