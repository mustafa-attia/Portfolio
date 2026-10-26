import { useEffect } from "react";

export default function usePageMetadata(
  title: string,
  description: string,
  indexable = true,
) {
  useEffect(() => {
    document.title = title;

    const updateMeta = (
      selector: string,
      attribute: "name" | "property",
      key: string,
      content: string,
    ) => {
      let meta = document.head.querySelector<HTMLMetaElement>(selector);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, key);
        document.head.append(meta);
      }
      meta.content = content;
    };

    updateMeta(
      'meta[name="description"]',
      "name",
      "description",
      description,
    );
    updateMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      indexable ? "index, follow" : "noindex, nofollow",
    );
    updateMeta('meta[property="og:title"]', "property", "og:title", title);
    updateMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );
    updateMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    updateMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description,
    );
  }, [description, indexable, title]);
}
