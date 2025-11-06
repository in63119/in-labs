import type { PluggableList } from "unified";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

export const markdownRehypePlugins: PluggableList = [
  rehypeRaw,
  rehypeSanitize,
];
