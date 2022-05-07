export declare function stripLinks(content: string, expectedSubstringToKeep: string, expectedSubstringToStrip: string): string;
/**
 * @param content Content for which Github theme image links
 * will be stripped.
 * @param keep Theme variant links to keep in the content.
 * @returns Content with Github theme links stripped.
 */
export default function stripGhThemeLinks(content: string, keep: "light" | "dark"): string;
