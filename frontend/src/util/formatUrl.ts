import stripLeadingSlash from "./stripLeadingSlash";
import stripTrailingSlash from "./stripTrailingSlash";

export default function formatUrl(url: string): string {
  return stripLeadingSlash(stripTrailingSlash(url.trim()));
}
