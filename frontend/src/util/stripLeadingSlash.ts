export default function stripLeadingSlash(str: string): string {
  return str.startsWith("/") ? str.slice(1) : str;
}
