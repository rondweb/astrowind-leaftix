import { c as createComponent, f as createSvgComponent } from './consts_Bhtzq3Da.mjs';
import 'piccolore';
import { r as renderComponent, a as renderTemplate, u as unescapeHTML, m as maybeRenderHead, b as addAttribute, F as Fragment, s as spreadAttributes, c as renderSlot } from './prerender_Cc-hlpSz.mjs';
import { r as renderScript } from './script_Bg_zmPrs.mjs';
import 'clsx';
import { query, isElementNode, getTextContent, getAttribute } from '@parse5/tools';
import { parse } from 'parse5';
import { AtpAgent, AppBskyEmbedImages, AppBskyEmbedExternal, AppBskyEmbedVideo, AppBskyEmbedRecordWithMedia, RichText, AppBskyEmbedRecord, AppBskyFeedPost, AppBskyGraphStarterpack, AppBskyGraphDefs } from '@atproto/api';

class LRU extends Map {
  constructor(maxSize) {
    super();
    this.maxSize = maxSize;
  }
  get(key) {
    const value = super.get(key);
    if (value) this.#touch(key, value);
    return value;
  }
  set(key, value) {
    this.#touch(key, value);
    if (this.size > this.maxSize) this.delete(this.keys().next().value);
    return this;
  }
  #touch(key, value) {
    this.delete(key);
    super.set(key, value);
  }
}
const formatError = (...lines) => lines.join("\n         ");
const safeGet = makeSafeGetter((res) => res.json());
function makeSafeGetter(handleResponse, { cacheSize = 1e3 } = {}) {
  const cache = new LRU(cacheSize);
  return async function safeGet2(url) {
    try {
      const cached = cache.get(url);
      if (cached) return cached;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          formatError(
            `Failed to fetch ${url}`,
            `Error ${response.status}: ${response.statusText}`
          )
        );
      const result = await handleResponse(response);
      cache.set(url, result);
      return result;
    } catch (e) {
      console.error(formatError(`[error]  astro-embed`, e?.message ?? e));
      return void 0;
    }
  };
}

const $$Tweet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Tweet;
  const { id, theme = "light" } = Astro2.props;
  async function fetchTweet(id2, theme2 = "light") {
    const oembedUrl = new URL("https://publish.twitter.com/oembed");
    oembedUrl.searchParams.set("url", id2);
    oembedUrl.searchParams.set("omit_script", "true");
    oembedUrl.searchParams.set("dnt", "true");
    oembedUrl.searchParams.set("theme", theme2);
    return await safeGet(oembedUrl.href);
  }
  const tweet = await fetchTweet(id, theme);
  return renderTemplate`${tweet && renderTemplate`${renderComponent($$result, "astro-embed-tweet", "astro-embed-tweet", {}, { "default": () => renderTemplate`${unescapeHTML(tweet.html)}` })}`}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-twitter/Tweet.astro", void 0);

const urlPattern$1 = /(?=(\s*))\1(?:<a [^>]*?>)??(?=(\s*))\2(?:https?:\/\/)??(?:w{3}\.)??(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|shorts\/)??([A-Za-z0-9-_]{11})(?:[^\s<>]*)(?=(\s*))\4(?:<\/a>)??(?=(\s*))\5/;
function matcher$1(url) {
  const match = url.match(urlPattern$1);
  return match?.[3];
}

const $$YouTube = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$YouTube;
  const {
    id,
    poster,
    posterQuality = "default",
    title,
    style,
    ...attrs
  } = Astro2.props;
  const idRegExp = /^[A-Za-z0-9-_]+$/;
  function extractID(idOrUrl) {
    if (idRegExp.test(idOrUrl)) return idOrUrl;
    return matcher$1(idOrUrl);
  }
  const videoid = extractID(id);
  const posterFile = {
    max: "maxresdefault",
    high: "sddefault",
    default: "hqdefault",
    low: "default"
  }[posterQuality] || "hqdefault";
  const posterURL = poster || `https://i.ytimg.com/vi/${videoid}/${posterFile}.jpg`;
  const href = `https://youtube.com/watch?v=${videoid}`;
  const styles = [];
  if (style) styles.push(style);
  if (posterURL) styles.push(`background-image: url('${posterURL}')`);
  return renderTemplate`${renderComponent($$result, "lite-youtube", "lite-youtube", { "videoid": videoid, "title": title, "data-title": title, ...attrs, "style": styles.join(";") }, { "default": () => renderTemplate` ${maybeRenderHead()}<a${addAttribute(href, "href")} class="lyt-playbtn"> <span class="lyt-visually-hidden">${attrs.playlabel || "Play"}</span> </a> ` })} ${renderScript($$result, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-youtube/YouTube.astro?astro&type=script&index=0&lang.ts")}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-youtube/YouTube.astro", void 0);

const urlPattern = /(?=(\s*))\1(?:<a [^>]*?>)??(?=(\s*))\2(?:https?:\/\/)??(?:w{3}\.)??(?:vimeo\.com)\/(\d{1,20})(?:[^\s<>]*)(?=(\s*))\4(?:<\/a>)??(?=(\s*))\5/;
function matcher(url) {
  const match = url.match(urlPattern);
  return match?.[3];
}

const $$Vimeo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Vimeo;
  const {
    id,
    poster,
    posterQuality = "default",
    params = "",
    playlabel = "Play",
    style,
    ...attrs
  } = Astro2.props;
  const idRegExp = /^\d+$/;
  function extractID(idOrUrl) {
    if (idRegExp.test(idOrUrl)) return idOrUrl;
    return matcher(idOrUrl);
  }
  const videoid = extractID(id);
  let posterURL = poster;
  if (!posterURL) {
    const data = await safeGet(`https://vimeo.com/api/v2/video/${videoid}.json`);
    if (data) {
      const resolution = { max: 1280, high: 640, default: 480, low: 120 }[posterQuality] || 480;
      const { thumbnail_large } = data?.[0] || {};
      if (thumbnail_large.endsWith("d_640")) {
        posterURL = thumbnail_large.slice(0, -3) + resolution;
      } else {
        posterURL = thumbnail_large;
      }
    }
  }
  let [searchString, t] = params.split("#t=");
  const searchParams = new URLSearchParams(searchString);
  if (!t) t = searchParams.get("t");
  searchParams.append("autoplay", "1");
  if (!searchParams.has("dnt")) searchParams.append("dnt", "1");
  const color = searchParams.get("color");
  const styles = [];
  if (style) styles.push(style);
  if (color) styles.push(`--ltv-color: #${color}`);
  if (posterURL) styles.push(`background-image: url('${posterURL}')`);
  return renderTemplate`${renderComponent($$result, "lite-vimeo", "lite-vimeo", { "data-id": videoid, "data-t": t, "data-params": searchParams.toString(), "style": styles.join(";"), ...attrs }, { "default": () => renderTemplate` ${maybeRenderHead()}<a class="ltv-playbtn"${addAttribute(`https://vimeo.com/${videoid}`, "href")}${addAttribute(playlabel, "aria-label")}></a> ` })} ${renderScript($$result, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-vimeo/Vimeo.astro?astro&type=script&index=0&lang.ts")}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-vimeo/Vimeo.astro", void 0);

const styles = ":host {\n\t--borderWidth-thin: 1px;\n\t--borderRadius-medium: 0.5rem;\n\tdisplay: block;\n\tcolor-scheme: light;\n}\n.gist .gist-file {\n\tborder-radius: calc(var(--borderRadius-medium) + 1px);\n}\n";

const $$Gist = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Gist;
  const { id, file } = Astro2.props;
  const url = new URL(id);
  url.pathname += ".json";
  if (file) {
    url.searchParams.set("file", file);
  }
  async function fetchGist(gistUrl) {
    return await safeGet(gistUrl);
  }
  const gist = await fetchGist(url.href);
  return renderTemplate`${gist && renderTemplate`${renderComponent($$result, "astro-embed-gist", "astro-embed-gist", {}, { "default": () => renderTemplate`<template shadowrootmode="open"><link rel="stylesheet"${addAttribute(gist.stylesheet, "href")}><style>${unescapeHTML(styles)}</style>${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(gist.div)}` })}</template>` })}`}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-gist/Gist.astro", void 0);

const safeGetDOM = makeSafeGetter(async (res) => {
  const document = parse(await res.text());
  return {
    getElement: (element, attributes = {}) => {
      const attrs = Object.entries(attributes);
      const el = query(
        document,
        (node) => isElementNode(node) && node.tagName === element && attrs.every(
          ([name, value]) => node.attrs.some(
            (attr) => attr.name === name && attr.value === value
          )
        )
      );
      return el ? {
        getAttribute: (name) => getAttribute(el, name),
        getTextContent: () => getTextContent(el)
      } : null;
    }
  };
});

const urlOrNull = (url) => url?.slice(0, 8) === "https://" ? url : null;
async function parseOpenGraph(pageUrl) {
  const html = await safeGetDOM(pageUrl);
  if (!html) return;
  const getMetaProperty = (property) => html.getElement("meta", { property })?.getAttribute("content");
  const getMetaName = (name) => html.getElement("meta", { name })?.getAttribute("content");
  const title = getMetaProperty("og:title") || html.getElement("title")?.getTextContent();
  const description = getMetaProperty("og:description") || getMetaName("description");
  const image = urlOrNull(
    getMetaProperty("og:image:secure_url") || getMetaProperty("og:image:url") || getMetaProperty("og:image")
  );
  const imageAlt = getMetaProperty("og:image:alt");
  const video = urlOrNull(
    getMetaProperty("og:video:secure_url") || getMetaProperty("og:video:url") || getMetaProperty("og:video")
  );
  const videoType = getMetaProperty("og:video:type");
  const url = urlOrNull(
    getMetaProperty("og:url") || html.getElement("link", { rel: "canonical" })?.getAttribute("href")
  ) || pageUrl;
  return { title, description, image, imageAlt, url, video, videoType };
}

const $$LinkPreview = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$LinkPreview;
  const { id, hideMedia = false } = Astro2.props;
  const meta = await parseOpenGraph(id);
  const domain = meta?.url ? new URL(meta.url).hostname.replace("www.", "") : "";
  return renderTemplate`${meta && meta.title ? renderTemplate`${maybeRenderHead()}<article${addAttribute([
    "link-preview",
    {
      "link-preview--has-video": !hideMedia && meta.video && meta.videoType,
      "link-preview--no-media": hideMedia || !(meta.video && meta.videoType || meta.image)
    }
  ], "class:list")} data-astro-cid-ztfdmrby><div class="link-preview__content" data-astro-cid-ztfdmrby><header data-astro-cid-ztfdmrby><a class="link-preview__title"${addAttribute(id, "href")} data-astro-cid-ztfdmrby>${meta.title}</a>${" "}${domain && renderTemplate`<small class="link-preview__domain" data-astro-cid-ztfdmrby>${domain}</small>`}</header><small class="link-preview__description" data-astro-cid-ztfdmrby>${meta.description}</small></div>${hideMedia ? null : meta.video && meta.videoType ? renderTemplate`<video controls preload="metadata" width="1200" height="630" data-astro-cid-ztfdmrby><source${addAttribute(meta.video, "src")}${addAttribute(meta.videoType, "type")} data-astro-cid-ztfdmrby></video>` : meta.image ? renderTemplate`<img${addAttribute(meta.image, "src")}${addAttribute(meta.imageAlt || "", "alt")} width="1200" height="630" data-astro-cid-ztfdmrby>` : null}</article>` : renderTemplate`<div class="link-preview link-preview--no-metadata" data-astro-cid-ztfdmrby><a${addAttribute(id, "href")} data-astro-cid-ztfdmrby>${id}</a></div>`}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-link-preview/LinkPreview.astro", void 0);

const $$MediaAttachment = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$MediaAttachment;
  const { media, halfWidth } = Astro2.props;
  if (media.type === "unknown") {
    return;
  }
  return renderTemplate`${media.type === "image" && media.preview_url && renderTemplate`${maybeRenderHead()}<a${addAttribute(media.url, "href")}><img${addAttribute(media.description, "alt")} part="image-attachment"${addAttribute(media.meta?.small?.height, "height")}${addAttribute(media.preview_url, "src")}${addAttribute([
    `${media.preview_url} ${media.meta?.small?.width}w`,
    `${media.url} ${media.meta?.original?.width}w`
  ].join(", "), "srcset")}${addAttribute([
    `(width <= 400px) ${halfWidth ? "50vw" : "100vw"}`,
    halfWidth ? "200px" : "400px"
  ].join(", "), "sizes")}${addAttribute(media.meta?.small?.width, "width")} loading="lazy" decoding="async"></a>`}${(media.type === "video" || media.type === "gifv") && renderTemplate`<video${addAttribute(media.description, "aria-label")} part="video-attachment" controls${addAttribute(media.meta?.original?.height, "height")}${addAttribute(media.preview_url, "poster")} preload="metadata"${addAttribute(media.url, "src")}${addAttribute(media.meta?.original?.width, "width")}${addAttribute(media.type === "gifv", "loop")}></video>`}${media.type === "audio" && renderTemplate`<audio${addAttribute(media.description, "aria-label")} part="audio-attachment" controls preload="metadata"${addAttribute(media.url, "src")}></audio>`}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-mastodon/src/MediaAttachment.astro", void 0);

const $$PreviewCardAuthors = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PreviewCardAuthors;
  const { authors } = Astro2.props;
  return renderTemplate`${!!authors?.length && renderTemplate`${maybeRenderHead()}<span part="preview-card-authors"><svg width="16" height="16" viewBox="0 -4 79 79" role="img"><title>Mastodon</title><path d="M63 45.3v-20c0-4.1-1-7.3-3.2-9.7-2.1-2.4-5-3.7-8.5-3.7-4.1 0-7.2 1.6-9.3 4.7l-2 3.3-2-3.3c-2-3.1-5.1-4.7-9.2-4.7-3.5 0-6.4 1.3-8.6 3.7-2.1 2.4-3.1 5.6-3.1 9.7v20h8V25.9c0-4.1 1.7-6.2 5.2-6.2 3.8 0 5.8 2.5 5.8 7.4V37.7H44V27.1c0-4.9 1.9-7.4 5.8-7.4 3.5 0 5.2 2.1 5.2 6.2V45.3h8ZM74.7 16.6c.6 6 .1 15.7.1 17.3 0 .5-.1 4.8-.1 5.3-.7 11.5-8 16-15.6 17.5-.1 0-.2 0-.3 0-4.9 1-10 1.2-14.9 1.4-1.2 0-2.4 0-3.6 0-4.8 0-9.7-.6-14.4-1.7-.1 0-.1 0-.1 0s-.1 0-.1 0 0 .1 0 .1 0 0 0 0c.1 1.6.4 3.1 1 4.5.6 1.7 2.9 5.7 11.4 5.7 5 0 9.9-.6 14.8-1.7 0 0 0 0 0 0 .1 0 .1 0 .1 0 0 .1 0 .1 0 .1.1 0 .1 0 .1.1v5.6s0 .1-.1.1c0 0 0 0 0 .1-1.6 1.1-3.7 1.7-5.6 2.3-.8.3-1.6.5-2.4.7-7.5 1.7-15.4 1.3-22.7-1.2-6.8-2.4-13.8-8.2-15.5-15.2-.9-3.8-1.6-7.6-1.9-11.5-.6-5.8-.6-11.7-.8-17.5C3.9 24.5 4 20 4.9 16 6.7 7.9 14.1 2.2 22.3 1c1.4-.2 4.1-1 16.5-1h.1C51.4 0 56.7.8 58.1 1c8.4 1.2 15.5 7.5 16.6 15.6Z" fill="currentColor"></path></svg>
More from${" "}${authors.map((author) => renderTemplate`<a${addAttribute(author.account.url, "href")}${addAttribute(`@${author.account.username}`, "title")} part="preview-card-author"><img part="preview-card-author-avatar"${addAttribute(author.account.avatar_static, "src")} alt="" width="16" height="16" loading="lazy" decoding="async"><bdi part="preview-card-author-name">${author.account.display_name}</bdi></a>`)}</span>`}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-mastodon/src/PreviewCardAuthors.astro", void 0);

const $$PreviewCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PreviewCard;
  const { card } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div part="preview-card"> <a${addAttribute(card.url, "href")}${addAttribute(`preview-card-link ${!card.image ? "preview-card-link--no-image" : ""}`, "part")}> ${card.image ? renderTemplate`<img alt="" part="preview-card-image"${addAttribute(card.height, "height")}${addAttribute(card.image, "src")}${addAttribute(card.width, "width")} loading="lazy" decoding="async">` : renderTemplate`<span part="preview-card-image-placeholder">  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true" fill="currentColor"> <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520h200L520-800v200Z"></path> </svg> </span>`} <div part="preview-card-content"> <span part="preview-card-provider-name"> ${card.provider_name || new URL(card.url).hostname} </span> <strong part="preview-card-title">${card.title}</strong> ${card.description && renderTemplate`<span part="preview-card-description">${card.description}</span>`} </div> </a> ${renderComponent($$result, "PreviewCardAuthors", $$PreviewCardAuthors, { "authors": card.authors })} </div>`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-mastodon/src/PreviewCard.astro", void 0);

const $$Attachments = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Attachments;
  const { post } = Astro2.props;
  return renderTemplate`${post.media_attachments.length > 0 ? renderTemplate`${maybeRenderHead()}<div${addAttribute(`attachments media-count-${post.media_attachments.length}`, "part")}>${post.media_attachments.map((media, index, attachments) => renderTemplate`<div${addAttribute(
    index === 0 && attachments.length === 3 ? "row-span" : void 0,
    "part"
  )}>${renderComponent($$result, "MediaAttachment", $$MediaAttachment, { "media": media, "halfWidth": attachments.length > 1 })}</div>`)}</div>` : post.card && renderTemplate`${renderComponent($$result, "PreviewCard", $$PreviewCard, { "card": post.card })}`}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-mastodon/src/Attachments.astro", void 0);

const $$PostFooter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PostFooter;
  const { post } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div part="footer"> <a${addAttribute(post.url, "href")}> <time${addAttribute(post.created_at, "datetime")}> ${new Date(post.created_at).toLocaleDateString(void 0, {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </time> </a> </div>`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-mastodon/src/PostFooter.astro", void 0);

const wellKnownRTL = ["ar", "fa", "he", "prs", "ps", "syc", "ug", "ur"];
function getLocaleDir(lang) {
  const locale = new Intl.Locale(lang);
  if ("textInfo" in locale) {
    return locale.textInfo.direction;
  } else if ("getTextInfo" in locale) {
    return locale.getTextInfo().direction;
  }
  return wellKnownRTL.includes(locale.language) ? "rtl" : "ltr";
}
const idRegExp = /(\d+)\/?$/;
function extractID(url) {
  const match = url.match(idRegExp);
  return match?.[0];
}
async function fetchMastodonPost(url) {
  const id = extractID(url);
  if (!id) throw new Error("Invalid Mastodon post URL: " + url);
  const data = await safeGet(
    `${new URL(url).origin}/api/v1/statuses/${id}`
  );
  return data ? { ...data, dir: getLocaleDir(data.language) } : void 0;
}
function replaceEmojis(text, emojis) {
  for (const emoji of emojis) {
    text = text.replace(
      new RegExp(`:${emoji.shortcode}:`, "g"),
      `<img alt=":${emoji.shortcode}:" class="mastodon-post-emoji" src="${emoji.static_url}" loading="lazy" decoding="async" />`
    );
  }
  return text;
}

const $$PostHeader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PostHeader;
  const { post } = Astro2.props;
  const { hostname } = new URL(post.account.url);
  const username = `${post.account.username}@${hostname}`;
  return renderTemplate`${maybeRenderHead()}<div part="header"> <a part="user"${addAttribute(post.account.url, "href")}> <img part="user-avatar"${addAttribute(post.account.avatar_static, "src")} alt="" width="46" height="46" loading="lazy" decoding="async"> <span part="user-content"> <bdi> <strong part="user-display-name">${unescapeHTML(replaceEmojis(
    post.account.display_name || post.account.username,
    post.account.emojis
  ))}</strong> </bdi> <span part="user-account">@${username}</span> </span> </a> <a${addAttribute(post.url, "href")}> <span class="invisible">View on Mastodon</span> <svg${spreadAttributes({
    part: "mastodon-logo"
  }, void 0, { "class": "astro-xtkahfu7" })} width="40" height="40" viewBox="0 -4 79 79" aria-hidden="true"> <path d="M63 45.3v-20c0-4.1-1-7.3-3.2-9.7-2.1-2.4-5-3.7-8.5-3.7-4.1 0-7.2 1.6-9.3 4.7l-2 3.3-2-3.3c-2-3.1-5.1-4.7-9.2-4.7-3.5 0-6.4 1.3-8.6 3.7-2.1 2.4-3.1 5.6-3.1 9.7v20h8V25.9c0-4.1 1.7-6.2 5.2-6.2 3.8 0 5.8 2.5 5.8 7.4V37.7H44V27.1c0-4.9 1.9-7.4 5.8-7.4 3.5 0 5.2 2.1 5.2 6.2V45.3h8ZM74.7 16.6c.6 6 .1 15.7.1 17.3 0 .5-.1 4.8-.1 5.3-.7 11.5-8 16-15.6 17.5-.1 0-.2 0-.3 0-4.9 1-10 1.2-14.9 1.4-1.2 0-2.4 0-3.6 0-4.8 0-9.7-.6-14.4-1.7-.1 0-.1 0-.1 0s-.1 0-.1 0 0 .1 0 .1 0 0 0 0c.1 1.6.4 3.1 1 4.5.6 1.7 2.9 5.7 11.4 5.7 5 0 9.9-.6 14.8-1.7 0 0 0 0 0 0 .1 0 .1 0 .1 0 0 .1 0 .1 0 .1.1 0 .1 0 .1.1v5.6s0 .1-.1.1c0 0 0 0 0 .1-1.6 1.1-3.7 1.7-5.6 2.3-.8.3-1.6.5-2.4.7-7.5 1.7-15.4 1.3-22.7-1.2-6.8-2.4-13.8-8.2-15.5-15.2-.9-3.8-1.6-7.6-1.9-11.5-.6-5.8-.6-11.7-.8-17.5C3.9 24.5 4 20 4.9 16 6.7 7.9 14.1 2.2 22.3 1c1.4-.2 4.1-1 16.5-1h.1C51.4 0 56.7.8 58.1 1c8.4 1.2 15.5 7.5 16.6 15.6Z" fill="currentColor"></path> </svg> </a> </div>`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-mastodon/src/PostHeader.astro", void 0);

const $$QuotedPost = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$QuotedPost;
  const { parent, quote, compact = false } = Astro2.props;
  let post;
  if ("quoted_status" in quote && quote.quoted_status) {
    post = quote.quoted_status;
  } else if ("quoted_status_id" in quote && quote.quoted_status_id) {
    post = await fetchMastodonPost(
      new URL(quote.quoted_status_id, parent.url).href
    );
  }
  return renderTemplate`${post && (compact ? renderTemplate`${maybeRenderHead()}<blockquote part="subquote">
Quoted a post by @${post.account.acct}</blockquote>` : renderTemplate`<blockquote part="quote"><div part="quote-header"><img part="quote-avatar"${addAttribute(post.account.avatar_static, "src")} alt="" width="32" height="32" loading="lazy" decoding="async"><span part="quote-display-name"><bdi><strong>${unescapeHTML(replaceEmojis(
    post.account.display_name || post.account.username,
    post.account.emojis
  ))}</strong></bdi><span part="quote-username">@${post.account.acct}</span></span><a${addAttribute(post.url, "href")}>${new Date(post.created_at).toLocaleDateString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric"
  })}</a></div><div part="quote-content"${addAttribute(getLocaleDir(post.language), "dir")}${addAttribute(post.language, "lang")}>${unescapeHTML(replaceEmojis(post.content, post.emojis))}</div>${post.card && renderTemplate`${renderComponent($$result, "PreviewCard", $$PreviewCard, { "card": post.card })}`}${post.media_attachments.map((media) => renderTemplate`${renderComponent($$result, "MediaAttachment", $$MediaAttachment, { "media": media })}`)}${post.quote && renderTemplate`${renderComponent($$result, "Astro.self", Astro2.self, { "parent": post, "quote": post.quote, "compact": true })}`}</blockquote>`)}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-mastodon/src/QuotedPost.astro", void 0);

const styleUrl = "/_astro/GlobalStyles.EO2zW4Rt.css";

const $$MastodonPost = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$MastodonPost;
  const { id } = Astro2.props;
  const post = await fetchMastodonPost(id);
  return renderTemplate`${post && renderTemplate`${renderComponent($$result, "astro-embed-mastodon", "astro-embed-mastodon", {}, { "default": () => renderTemplate`<template shadowrootmode="open"><link rel="stylesheet"${addAttribute(styleUrl, "href")}>${maybeRenderHead()}<blockquote part="root">${renderComponent($$result, "PostHeader", $$PostHeader, { "post": post })}<div part="content"${addAttribute(post.dir, "dir")}${addAttribute(post.language, "lang")}>${unescapeHTML(replaceEmojis(post.content, post.emojis))}</div>${renderComponent($$result, "Attachments", $$Attachments, { "post": post })}${post.quote && renderTemplate`${renderComponent($$result, "QuotedPost", $$QuotedPost, { "parent": post, "quote": post.quote })}`}${renderComponent($$result, "PostFooter", $$PostFooter, { "post": post })}</blockquote></template>` })}`}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-mastodon/src/MastodonPost.astro", void 0);

const $$BaselineIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaselineIcon;
  const paths = {
    limited: `<path fill="var(--color-limited)" d="m10 0 6 6-2 2-6-6 2-2Zm12 12-2 2 6 6 2-2-6-6Zm4-12 2 2-18 18-2-2L26 0Z"/><path fill="var(--color-limited-secondary)" d="m8 2 2 2-6 6 6 6-2 2-8-8 8-8Zm20 0 8 8-8 8-2-2 6-6-6-6 2-2Z"/>`,
    widely: `<path fill="var(--color-widely)" d="m18 8 2 2-2 2-2-2 2-2Z"/><path fill="var(--color-widely)" d="m26 0 2 2-18 18L0 10l2-2 8 8L26 0Z"/><path fill="var(--color-widely-secondary)" d="m28 2-2 2 6 6-6 6-4-4-2 2 6 6 10-10-8-8ZM10 0 2 8l2 2 6-6 4 4 2-2-6-6Z"/>`,
    newly: `<path fill="var(--color-newly-secondary)" d="m10 0 2 2-2 2-2-2 2-2Zm4 4 2 2-2 2-2-2 2-2Zm16 0 2 2-2 2-2-2 2-2Zm4 4 2 2-2 2-2-2 2-2Zm-4 4 2 2-2 2-2-2 2-2Zm-4 4 2 2-2 2-2-2 2-2Zm-4-4 2 2-2 2-2-2 2-2ZM6 4l2 2-2 2-2-2 2-2Z"/><path fill="var(--color-newly)" d="m26 0 2 2-18 18L0 10l2-2 8 8L26 0Z"/>`,
    no_data: `<path fill="var(--color-no_data-secondary)" d="m18 8 2 2-2 2-2-2 2-2Zm10-6-2 2 6 6-6 6-4-4-2 2 6 6 10-10-8-8ZM10 0 2 8l2 2 6-6 4 4 2-2-6-6Z"/><path fill="var(--color-no_data-secondary)" d="m26 0 2 2-18 18L0 10l2-2 8 8L26 0Z"/>`
  };
  return renderTemplate`${maybeRenderHead()}<svg width="36" height="20" viewBox="0 0 36 20" class="baseline-icon" aria-hidden="true">${unescapeHTML(paths[Astro2.props.support])}</svg>`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-baseline-status/BaselineIcon.astro", void 0);

const chrome = createSvgComponent({"meta":{"src":"/_astro/chrome.f1eQSm4k.svg","width":21,"height":21,"format":"svg"},"attributes":{"width":"21","height":"21","viewBox":"-10 -10 276 276"},"children":"\n\t<circle cx=\"128\" cy=\"128\" r=\"64\" fill=\"#fff\" />\n\t<path fill=\"#229342\" d=\"M96 183a64 64 0 0 1-23-23L17 64a128 128 0 0 0 111 192l55-96a64 64 0 0 1-87 23Z\" />\n\t<path fill=\"#FBC116\" d=\"M192 128a64 64 0 0 1-9 32l-55 96A128 128 0 0 0 239 64H128a64 64 0 0 1 64 64Z\" />\n\t<circle cx=\"128\" cy=\"128\" r=\"52\" fill=\"#1a73e8\" />\n\t<path fill=\"#E33B2E\" d=\"M96 73a64 64 0 0 1 32-9h111a128 128 0 0 0-222 0l56 96a64 64 0 0 1 23-87Z\" />\n","styles":[]});

const edge = createSvgComponent({"meta":{"src":"/_astro/edge.B7O1xshw.svg","width":21,"height":21,"format":"svg"},"attributes":{"width":"21","height":"21"},"children":"\n\t<path fill=\"url(#b)\" d=\"M18.416 15.18a7.485 7.485 0 0 1-.845.375 8.121 8.121 0 0 1-2.86.51c-3.77 0-7.053-2.59-7.053-5.92a2.51 2.51 0 0 1 1.307-2.176c-3.41.143-4.287 3.697-4.287 5.777 0 5.897 5.427 6.487 6.598 6.487.63 0 1.578-.184 2.152-.367l.103-.032a10.224 10.224 0 0 0 5.307-4.207.319.319 0 0 0-.422-.447Z\" />\n\t<path fill=\"url(#c)\" d=\"M18.416 15.18a7.485 7.485 0 0 1-.845.375 8.121 8.121 0 0 1-2.86.51c-3.77 0-7.053-2.59-7.053-5.92a2.51 2.51 0 0 1 1.307-2.176c-3.41.143-4.287 3.697-4.287 5.777 0 5.897 5.427 6.487 6.598 6.487.63 0 1.578-.184 2.152-.367l.103-.032a10.224 10.224 0 0 0 5.307-4.207.319.319 0 0 0-.422-.447Z\" opacity=\".35\" />\n\t<path fill=\"url(#d)\" d=\"M8.423 19.229a6.31 6.31 0 0 1-1.809-1.698A6.43 6.43 0 0 1 8.965 7.97c.255-.12.677-.327 1.243-.319a2.582 2.582 0 0 1 2.048 1.036c.32.431.497.953.502 1.49 0-.016 1.953-6.343-6.375-6.343-3.498 0-6.375 3.315-6.375 6.232-.014 1.54.316 3.065.964 4.462a10.2 10.2 0 0 0 12.464 5.34 6.015 6.015 0 0 1-5.005-.638h-.008Z\" />\n\t<path fill=\"url(#e)\" d=\"M8.423 19.229a6.31 6.31 0 0 1-1.809-1.698A6.43 6.43 0 0 1 8.965 7.97c.255-.12.677-.327 1.243-.319a2.582 2.582 0 0 1 2.048 1.036c.32.431.497.953.502 1.49 0-.016 1.953-6.343-6.375-6.343-3.498 0-6.375 3.315-6.375 6.232-.014 1.54.316 3.065.964 4.462a10.2 10.2 0 0 0 12.464 5.34 6.015 6.015 0 0 1-5.005-.638h-.008Z\" opacity=\".41\" />\n\t<path fill=\"url(#f)\" d=\"M12.145 11.857c-.072.08-.271.2-.271.447 0 .207.135.414.382.582 1.14.796 3.3.685 3.307.685a4.75 4.75 0 0 0 2.415-.662A4.893 4.893 0 0 0 20.4 8.694c.024-1.785-.637-2.972-.9-3.498C17.802 1.896 14.16 0 10.2 0A10.2 10.2 0 0 0 0 10.057c.04-2.909 2.933-5.26 6.375-5.26.28 0 1.873.024 3.347.797a5.786 5.786 0 0 1 2.463 2.335c.486.845.573 1.92.573 2.35 0 .431-.215 1.06-.621 1.587l.008-.008Z\" />\n\t<path fill=\"url(#g)\" d=\"M12.145 11.857c-.072.08-.271.2-.271.447 0 .207.135.414.382.582 1.14.796 3.3.685 3.307.685a4.75 4.75 0 0 0 2.415-.662A4.893 4.893 0 0 0 20.4 8.694c.024-1.785-.637-2.972-.9-3.498C17.802 1.896 14.16 0 10.2 0A10.2 10.2 0 0 0 0 10.057c.04-2.909 2.933-5.26 6.375-5.26.28 0 1.873.024 3.347.797a5.786 5.786 0 0 1 2.463 2.335c.486.845.573 1.92.573 2.35 0 .431-.215 1.06-.621 1.587l.008-.008Z\" />\n\t<defs>\n\t\t<radialGradient id=\"c\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(7.6 0 0 7.2 12.527 14.212)\" gradientUnits=\"userSpaceOnUse\">\n\t\t\t<stop offset=\".7\" stop-opacity=\"0\" />\n\t\t\t<stop offset=\".9\" stop-opacity=\".5\" />\n\t\t\t<stop offset=\"1\" />\n\t\t</radialGradient>\n\t\t<radialGradient id=\"e\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(1.7 -11.3 9.1 1.4 5.623 15.854)\" gradientUnits=\"userSpaceOnUse\">\n\t\t\t<stop offset=\".8\" stop-opacity=\"0\" />\n\t\t\t<stop offset=\".9\" stop-opacity=\".5\" />\n\t\t\t<stop offset=\"1\" />\n\t\t</radialGradient>\n\t\t<radialGradient id=\"f\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(-.6 16.1 -34.4 -1.4 2.063 3.77)\" gradientUnits=\"userSpaceOnUse\">\n\t\t\t<stop stop-color=\"#35C1F1\" />\n\t\t\t<stop offset=\".1\" stop-color=\"#34C1ED\" />\n\t\t\t<stop offset=\".2\" stop-color=\"#2FC2DF\" />\n\t\t\t<stop offset=\".3\" stop-color=\"#2BC3D2\" />\n\t\t\t<stop offset=\".7\" stop-color=\"#36C752\" />\n\t\t</radialGradient>\n\t\t<radialGradient id=\"g\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(2.2 7.4 -6 1.8 19.13 6.16)\" gradientUnits=\"userSpaceOnUse\">\n\t\t\t<stop stop-color=\"#66EB6E\" />\n\t\t\t<stop offset=\"1\" stop-color=\"#66EB6E\" stop-opacity=\"0\" />\n\t\t</radialGradient>\n\t\t<linearGradient id=\"b\" x1=\"4.678\" x2=\"18.894\" y1=\"14.105\" y2=\"14.105\" gradientUnits=\"userSpaceOnUse\">\n\t\t\t<stop stop-color=\"#0C59A4\" />\n\t\t\t<stop offset=\"1\" stop-color=\"#114A8B\" />\n\t\t</linearGradient>\n\t\t<linearGradient id=\"d\" x1=\"12.168\" x2=\"3.299\" y1=\"7.937\" y2=\"17.603\" gradientUnits=\"userSpaceOnUse\">\n\t\t\t<stop stop-color=\"#1B9DE2\" />\n\t\t\t<stop offset=\".2\" stop-color=\"#1595DF\" />\n\t\t\t<stop offset=\".7\" stop-color=\"#0680D7\" />\n\t\t\t<stop offset=\"1\" stop-color=\"#0078D4\" />\n\t\t</linearGradient>\n\t</defs>\n","styles":[]});

const firefox = createSvgComponent({"meta":{"src":"/_astro/firefox.CMmddY9p.svg","width":21,"height":21,"format":"svg"},"attributes":{"width":"21","height":"21"},"children":"\n\t<path fill=\"url(#b)\" d=\"M19.66 6.85a5.59 5.59 0 0 0-2.05-2.5c.5.94.85 1.95 1.04 3v.01c-1.16-2.78-3.11-3.9-4.71-6.35L13.7.63l-.12-.2a1.76 1.76 0 0 1-.15-.4l-.02-.02h-.03A7.18 7.18 0 0 0 9.87 5.5a5.2 5.2 0 0 0-2.81 1.05 3.05 3.05 0 0 0-.27-.2 4.44 4.44 0 0 1-.03-2.41A7.53 7.53 0 0 0 4.3 5.78c-.4-.5-.38-2.14-.35-2.48-.12.05-.24.1-.34.18a8.68 8.68 0 0 0-1.95 1.94A8.22 8.22 0 0 0 .27 8.4l-.01.06-.1.62v.02A9.14 9.14 0 0 0 0 10.48v.05c0 2.47.97 4.85 2.7 6.67s4.1 2.95 6.65 3.16a10.45 10.45 0 0 0 7.1-2.02 9.84 9.84 0 0 0 3.83-6.14l.04-.38a9.88 9.88 0 0 0-.66-4.97zM7.9 14.59l.14.07-.14-.07zm10.76-7.22v-.01z\" />\n\t<use fill=\"url(#c)\" href=\"#d\" />\n\t<use fill=\"url(#e)\" href=\"#d\" />\n\t<path fill=\"url(#f)\" d=\"m14.7 8.01.06.05a5.42 5.42 0 0 0-.95-1.2A4.91 4.91 0 0 1 13.37 0a7.18 7.18 0 0 0-3.5 5.49l.35-.02c.91 0 1.8.24 2.6.68A5.07 5.07 0 0 1 14.7 8z\" />\n\t<use fill=\"url(#g)\" href=\"#h\" />\n\t<use fill=\"url(#i)\" href=\"#h\" />\n\t<path fill=\"url(#j)\" d=\"m6.58 6.22.2.14a4.44 4.44 0 0 1-.02-2.42A7.53 7.53 0 0 0 4.3 5.78c.05 0 1.53-.03 2.28.44z\" />\n\t<path fill=\"url(#k)\" d=\"M.1 10.76c.78 4.5 5 7.95 9.8 8.08 4.43.13 7.26-2.37 8.43-4.8.99-2.1 1.1-4.5.32-6.67v-.01c.36 2.3-.84 4.51-2.72 6.02v.01c-3.67 2.9-7.18 1.74-7.89 1.28l-.15-.08c-2.14-.98-3.02-2.87-2.83-4.49a2.61 2.61 0 0 1-2.42-1.47c.56-.33 1.2-.52 1.86-.55a3.96 3.96 0 0 1 1.9.4 5.24 5.24 0 0 0 3.83.15c0-.08-1.78-.76-2.47-1.43l-.7-.65a2.9 2.9 0 0 0-.27-.19l-.2-.13a5.18 5.18 0 0 0-2.28-.45c-.41-.5-.38-2.13-.36-2.47-.12.04-.24.1-.34.17a8.62 8.62 0 0 0-1.96 1.94A8.22 8.22 0 0 0 .28 8.4c0 .02-.37 1.56-.19 2.35z\" />\n\t<path fill=\"url(#l)\" d=\"M13.81 6.86c.37.35.7.76.95 1.2l.15.12c2.32 2.07 1.1 4.99 1.02 5.2 1.88-1.5 3.08-3.73 2.72-6.02-1.16-2.79-3.12-3.91-4.71-6.36L13.7.62l-.12-.2a1.76 1.76 0 0 1-.15-.4L13.41 0h-.03c-.4.19-2.74 3.78.43 6.85z\" />\n\t<path fill=\"url(#m)\" d=\"M14.91 8.18a2.1 2.1 0 0 0-.15-.12L14.7 8a3.61 3.61 0 0 0-2.47-.58c3.68 1.78 2.7 7.9-2.4 7.68a4.7 4.7 0 0 1-1.33-.25l-.3-.12-.17-.08c.72.47 4.22 1.62 7.89-1.27v-.02c.1-.2 1.31-3.12-1-5.2z\" />\n\t<path fill=\"url(#n)\" d=\"M5.63 11.42S6.1 9.72 9 9.72c.31 0 1.21-.85 1.23-1.1a5.24 5.24 0 0 1-3.84-.14 3.96 3.96 0 0 0-1.9-.4 3.9 3.9 0 0 0-1.85.54c.21.45.55.83.98 1.09s.93.4 1.44.39c-.2 1.61.7 3.5 2.83 4.49l.14.06a4.18 4.18 0 0 1-2.4-3.23z\" />\n\t<path fill=\"url(#o)\" d=\"M19.66 6.84a5.59 5.59 0 0 0-2.05-2.5 10.05 10.05 0 0 1 1.04 3v.02C17.49 4.57 15.54 3.45 13.94 1L13.7.62l-.12-.2a1.78 1.78 0 0 1-.15-.4c0-.02-.01-.02-.02-.02h-.02a7.18 7.18 0 0 0-3.52 5.5l.36-.02c.9 0 1.8.23 2.59.68A5.07 5.07 0 0 1 14.7 8a3.61 3.61 0 0 0-2.46-.58c3.67 1.77 2.69 7.9-2.4 7.67a4.7 4.7 0 0 1-1.33-.25l-.3-.12-.18-.08h.01l-.15-.07.14.07a4.18 4.18 0 0 1-2.4-3.23S6.1 9.72 9 9.72c.32 0 1.21-.85 1.23-1.1 0-.08-1.78-.76-2.47-1.43l-.7-.65a3.05 3.05 0 0 0-.27-.19 4.44 4.44 0 0 1-.03-2.42A7.53 7.53 0 0 0 4.3 5.77c-.4-.5-.38-2.13-.35-2.47-.12.04-.24.1-.34.17a8.68 8.68 0 0 0-1.95 1.94 8.22 8.22 0 0 0-1.38 3l-.01.06-.12.62A11.15 11.15 0 0 0 0 10.47v.05c0 2.48.97 4.86 2.7 6.68s4.1 2.95 6.65 3.16a10.45 10.45 0 0 0 7.1-2.02 9.84 9.84 0 0 0 3.83-6.14l.04-.39a9.88 9.88 0 0 0-.66-4.96z\" />\n\t<defs>\n\t\t<radialGradient id=\"c\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(21 0 0 21 17.65 2.3)\" href=\"#p\">\n\t\t\t<stop offset=\".13\" stop-color=\"#ffbd4f\" />\n\t\t\t<stop offset=\".19\" stop-color=\"#ffac31\" />\n\t\t\t<stop offset=\".25\" stop-color=\"#ff9d17\" />\n\t\t\t<stop offset=\".28\" stop-color=\"#ff980e\" />\n\t\t\t<stop offset=\".4\" stop-color=\"#ff563b\" />\n\t\t\t<stop offset=\".47\" stop-color=\"#ff3750\" />\n\t\t\t<stop offset=\".71\" stop-color=\"#f5156c\" />\n\t\t\t<stop offset=\".78\" stop-color=\"#eb0878\" />\n\t\t\t<stop offset=\".86\" stop-color=\"#e50080\" />\n\t\t</radialGradient>\n\t\t<radialGradient id=\"e\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(21 0 0 21 9.75 10.72)\" href=\"#p\">\n\t\t\t<stop offset=\".3\" stop-color=\"#960e18\" />\n\t\t\t<stop offset=\".35\" stop-color=\"#b11927\" stop-opacity=\".74\" />\n\t\t\t<stop offset=\".43\" stop-color=\"#db293d\" stop-opacity=\".34\" />\n\t\t\t<stop offset=\".5\" stop-color=\"#f5334b\" stop-opacity=\".09\" />\n\t\t\t<stop offset=\".53\" stop-color=\"#ff3750\" stop-opacity=\"0\" />\n\t\t</radialGradient>\n\t\t<radialGradient id=\"f\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(15 0 0 15 12.38 -2.3)\" href=\"#p\">\n\t\t\t<stop offset=\".13\" stop-color=\"#fff44f\" />\n\t\t\t<stop offset=\".25\" stop-color=\"#ffdc3e\" />\n\t\t\t<stop offset=\".51\" stop-color=\"#ff9d12\" />\n\t\t\t<stop offset=\".53\" stop-color=\"#ff980e\" />\n\t\t</radialGradient>\n\t\t<radialGradient id=\"g\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(10 0 0 10 7.38 16.08)\" href=\"#p\">\n\t\t\t<stop offset=\".35\" stop-color=\"#3a8ee6\" />\n\t\t\t<stop offset=\".47\" stop-color=\"#5c79f0\" />\n\t\t\t<stop offset=\".67\" stop-color=\"#9059ff\" />\n\t\t\t<stop offset=\"1\" stop-color=\"#c139e6\" />\n\t\t</radialGradient>\n\t\t<radialGradient id=\"i\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(5 -1 1 6 10.78 8.95)\" href=\"#p\">\n\t\t\t<stop offset=\".21\" stop-color=\"#9059ff\" stop-opacity=\"0\" />\n\t\t\t<stop offset=\".28\" stop-color=\"#8c4ff3\" stop-opacity=\".06\" />\n\t\t\t<stop offset=\".75\" stop-color=\"#7716a8\" stop-opacity=\".45\" />\n\t\t\t<stop offset=\".97\" stop-color=\"#6e008b\" stop-opacity=\".6\" />\n\t\t</radialGradient>\n\t\t<radialGradient id=\"j\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(7 0 0 7 9.48 1.54)\" href=\"#p\">\n\t\t\t<stop stop-color=\"#ffe226\" />\n\t\t\t<stop offset=\".12\" stop-color=\"#ffdb27\" />\n\t\t\t<stop offset=\".29\" stop-color=\"#ffc82a\" />\n\t\t\t<stop offset=\".5\" stop-color=\"#ffa930\" />\n\t\t\t<stop offset=\".73\" stop-color=\"#ff7e37\" />\n\t\t\t<stop offset=\".79\" stop-color=\"#ff7139\" />\n\t\t</radialGradient>\n\t\t<radialGradient id=\"k\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(31 0 0 30 15.28 -3.06)\" href=\"#p\">\n\t\t\t<stop offset=\".11\" stop-color=\"#fff44f\" />\n\t\t\t<stop offset=\".46\" stop-color=\"#ff980e\" />\n\t\t\t<stop offset=\".62\" stop-color=\"#ff5634\" />\n\t\t\t<stop offset=\".72\" stop-color=\"#ff3647\" />\n\t\t\t<stop offset=\".9\" stop-color=\"#e31587\" />\n\t\t</radialGradient>\n\t\t<radialGradient id=\"l\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(2 22 -15 2 12.7 -1.39)\" href=\"#p\">\n\t\t\t<stop stop-color=\"#fff44f\" />\n\t\t\t<stop offset=\".06\" stop-color=\"#ffe847\" />\n\t\t\t<stop offset=\".17\" stop-color=\"#ffc830\" />\n\t\t\t<stop offset=\".3\" stop-color=\"#ff980e\" />\n\t\t\t<stop offset=\".36\" stop-color=\"#ff8b16\" />\n\t\t\t<stop offset=\".46\" stop-color=\"#ff672a\" />\n\t\t\t<stop offset=\".57\" stop-color=\"#ff3647\" />\n\t\t\t<stop offset=\".74\" stop-color=\"#e31587\" />\n\t\t</radialGradient>\n\t\t<radialGradient id=\"m\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(19 0 0 19 9.48 4.09)\" href=\"#p\">\n\t\t\t<stop offset=\".14\" stop-color=\"#fff44f\" />\n\t\t\t<stop offset=\".48\" stop-color=\"#ff980e\" />\n\t\t\t<stop offset=\".59\" stop-color=\"#ff5634\" />\n\t\t\t<stop offset=\".66\" stop-color=\"#ff3647\" />\n\t\t\t<stop offset=\".9\" stop-color=\"#e31587\" />\n\t\t</radialGradient>\n\t\t<radialGradient id=\"n\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(21 0 0 21 14.5 5.1)\" href=\"#p\">\n\t\t\t<stop offset=\".09\" stop-color=\"#fff44f\" />\n\t\t\t<stop offset=\".23\" stop-color=\"#ffe141\" />\n\t\t\t<stop offset=\".51\" stop-color=\"#ffaf1e\" />\n\t\t\t<stop offset=\".63\" stop-color=\"#ff980e\" />\n\t\t</radialGradient>\n\t\t<linearGradient id=\"b\" x1=\"18.31\" x2=\"1.88\" y1=\"3.17\" y2=\"19.53\" href=\"#p\">\n\t\t\t<stop offset=\".05\" stop-color=\"#fff44f\" />\n\t\t\t<stop offset=\".11\" stop-color=\"#ffe847\" />\n\t\t\t<stop offset=\".23\" stop-color=\"#ffc830\" />\n\t\t\t<stop offset=\".37\" stop-color=\"#ff980e\" />\n\t\t\t<stop offset=\".4\" stop-color=\"#ff8b16\" />\n\t\t\t<stop offset=\".46\" stop-color=\"#ff672a\" />\n\t\t\t<stop offset=\".53\" stop-color=\"#ff3647\" />\n\t\t\t<stop offset=\".7\" stop-color=\"#e31587\" />\n\t\t</linearGradient>\n\t\t<linearGradient id=\"o\" x1=\"18.1\" x2=\"4.14\" y1=\"3.08\" y2=\"17.49\" href=\"#p\">\n\t\t\t<stop offset=\".17\" stop-color=\"#fff44f\" stop-opacity=\".8\" />\n\t\t\t<stop offset=\".27\" stop-color=\"#fff44f\" stop-opacity=\".63\" />\n\t\t\t<stop offset=\".49\" stop-color=\"#fff44f\" stop-opacity=\".22\" />\n\t\t\t<stop offset=\".6\" stop-color=\"#fff44f\" stop-opacity=\"0\" />\n\t\t</linearGradient>\n\t\t<linearGradient id=\"p\" gradientUnits=\"userSpaceOnUse\" />\n\t\t<path id=\"d\" d=\"M19.66 6.85a5.59 5.59 0 0 0-2.05-2.5c.5.94.85 1.95 1.04 3v.02a8.7 8.7 0 0 1-.32 6.67c-1.17 2.43-4 4.92-8.44 4.8-4.79-.13-9-3.57-9.8-8.08-.14-.71 0-1.07.08-1.65-.1.45-.16.9-.17 1.36v.05c0 2.48.97 4.86 2.7 6.68s4.1 2.95 6.65 3.16a10.45 10.45 0 0 0 7.1-2.02 9.84 9.84 0 0 0 3.83-6.14l.04-.38a9.87 9.87 0 0 0-.66-4.97z\" />\n\t\t<path id=\"h\" d=\"M10.23 8.63C10.2 8.87 9.3 9.72 9 9.72c-2.9 0-3.38 1.7-3.38 1.7a4.18 4.18 0 0 0 2.41 3.24l.17.08.3.12c.43.14.88.23 1.33.24 5.1.23 6.08-5.9 2.4-7.67.87-.1 1.75.1 2.47.58a5.24 5.24 0 0 0-4.47-2.53l-.37.02a5.2 5.2 0 0 0-2.8 1.05c.15.12.32.3.7.65.69.66 2.46 1.34 2.47 1.42z\" />\n\t</defs>\n","styles":[]});

const safari = createSvgComponent({"meta":{"src":"/_astro/safari.CdqjFDzc.svg","width":21,"height":21,"format":"svg"},"attributes":{"width":"21","height":"21"},"children":"\n\t<path fill=\"#000\" d=\"M19.505 10.524a8.76 8.76 0 0 1-.708 3.448 8.995 8.995 0 0 1-2.017 2.922 9.33 9.33 0 0 1-3.019 1.953 9.568 9.568 0 0 1-7.12 0 9.33 9.33 0 0 1-3.019-1.953 8.995 8.995 0 0 1-2.017-2.922 8.761 8.761 0 0 1-.708-3.448c0-2.39.98-4.68 2.725-6.37a9.461 9.461 0 0 1 6.58-2.638 9.57 9.57 0 0 1 3.56.685 9.33 9.33 0 0 1 3.018 1.953 8.995 8.995 0 0 1 2.017 2.923 8.76 8.76 0 0 1 .708 3.447Z\" opacity=\".53\" />\n\t<path fill=\"url(#b)\" stroke=\"#CDCDCD\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\".352\" d=\"M19.859 9.729c0 1.275-.25 2.538-.736 3.716a9.712 9.712 0 0 1-2.093 3.15 9.655 9.655 0 0 1-3.134 2.106 9.612 9.612 0 0 1-10.525-2.105A9.738 9.738 0 0 1 .542 9.729a9.738 9.738 0 0 1 2.83-6.867A9.612 9.612 0 0 1 13.896.757a9.654 9.654 0 0 1 3.133 2.105 9.713 9.713 0 0 1 2.093 3.15 9.757 9.757 0 0 1 .736 3.717Z\" />\n\t<path fill=\"url(#c)\" d=\"M19.102 9.729a8.98 8.98 0 0 1-2.607 6.329 8.877 8.877 0 0 1-6.294 2.62 8.877 8.877 0 0 1-6.295-2.62A8.975 8.975 0 0 1 1.3 9.728c0-2.373.938-4.65 2.607-6.328A8.877 8.877 0 0 1 10.201.778c2.36 0 4.624.943 6.294 2.622a8.975 8.975 0 0 1 2.607 6.329Z\" />\n\t<path fill=\"#F4F2F3\" d=\"M10.2 1.245a.13.13 0 0 0-.13.13v1.506a.13.13 0 1 0 .26 0V1.376a.13.13 0 0 0-.13-.13Zm-.849.054h-.026a.13.13 0 0 0-.116.144l.066.63a.13.13 0 1 0 .258-.028l-.065-.63A.13.13 0 0 0 9.35 1.3Zm1.704 0a.13.13 0 0 0-.116.117l-.066.63a.13.13 0 1 0 .258.027l.066-.63a.13.13 0 0 0-.142-.143Zm-2.576.127-.026.003a.13.13 0 0 0-.1.155l.31 1.472a.13.13 0 1 0 .254-.054l-.31-1.472a.13.13 0 0 0-.128-.104Zm3.448.002a.13.13 0 0 0-.127.103l-.311 1.472a.13.13 0 0 0 .1.155.13.13 0 0 0 .153-.1l.312-1.473a.13.13 0 0 0-.127-.157Zm-4.28.234a.13.13 0 0 0-.135.17l.195.603a.13.13 0 0 0 .163.084.13.13 0 0 0 .084-.165l-.195-.602a.13.13 0 0 0-.112-.09Zm5.108 0a.13.13 0 0 0-.112.09l-.195.603a.13.13 0 0 0 .083.164.13.13 0 0 0 .164-.084l.195-.602a.13.13 0 0 0-.135-.17Zm-5.931.303a.13.13 0 0 0-.116.184l.608 1.375a.13.13 0 0 0 .17.066.13.13 0 0 0 .067-.172l-.608-1.375a.13.13 0 0 0-.121-.078Zm6.763.005a.13.13 0 0 0-.12.077l-.61 1.375a.13.13 0 0 0 .065.172.13.13 0 0 0 .172-.066l.61-1.374a.13.13 0 0 0-.117-.184Zm-7.527.402a.13.13 0 0 0-.121.196l.314.548a.13.13 0 0 0 .178.047.13.13 0 0 0 .047-.178l-.315-.548a.13.13 0 0 0-.103-.065Zm8.28 0a.13.13 0 0 0-.102.065l-.315.548a.13.13 0 0 0 .047.178.129.129 0 0 0 .178-.048l.314-.548a.13.13 0 0 0-.121-.195Zm-9.022.465a.13.13 0 0 0-.1.207l.878 1.218a.13.13 0 0 0 .182.03.13.13 0 0 0 .029-.183l-.88-1.218a.13.13 0 0 0-.109-.054Zm9.774.007a.13.13 0 0 0-.11.053l-.88 1.217a.13.13 0 0 0 .028.183.13.13 0 0 0 .182-.029l.88-1.217a.13.13 0 0 0-.1-.207Zm-10.437.552a.13.13 0 0 0-.103.218l.421.47c.048.054.13.058.183.01a.13.13 0 0 0 .01-.184l-.421-.47a.13.13 0 0 0-.09-.044Zm11.092.001a.13.13 0 0 0-.09.043l-.421.47a.13.13 0 0 0 .01.185.129.129 0 0 0 .183-.01l.421-.47a.13.13 0 0 0-.103-.218ZM4.019 4.01a.13.13 0 0 0-.08.227l1.113 1.007a.129.129 0 0 0 .183-.01.13.13 0 0 0-.01-.184L4.114 4.043a.129.129 0 0 0-.094-.033Zm12.366.004a.129.129 0 0 0-.093.034l-1.114 1.006a.13.13 0 0 0-.01.184.13.13 0 0 0 .184.01l1.113-1.006a.13.13 0 0 0-.08-.228Zm-12.894.68a.13.13 0 0 0-.08.236l.509.371c.058.043.139.03.18-.028a.13.13 0 0 0-.028-.183l-.51-.372a.13.13 0 0 0-.071-.025Zm13.422.004a.13.13 0 0 0-.071.025l-.51.372a.13.13 0 0 0-.029.182.13.13 0 0 0 .181.029l.51-.372a.13.13 0 0 0-.08-.236Zm-13.916.724a.13.13 0 0 0-.056.243l1.297.753a.13.13 0 0 0 .13-.226L3.07 5.439a.13.13 0 0 0-.074-.017Zm14.407 0a.128.128 0 0 0-.074.017l-1.296.753a.13.13 0 0 0 .13.226l1.296-.753a.13.13 0 0 0-.056-.243ZM2.624 6.2a.13.13 0 0 0-.055.25l.574.258a.13.13 0 0 0 .106-.238l-.575-.259a.129.129 0 0 0-.05-.011Zm15.156.005a.13.13 0 0 0-.05.012l-.576.257a.13.13 0 0 0 .106.239l.575-.258a.13.13 0 0 0-.055-.25Zm-15.49.807a.13.13 0 0 0-.03.254l1.425.466a.13.13 0 0 0 .08-.248l-1.423-.466a.13.13 0 0 0-.051-.006Zm15.822.006a.125.125 0 0 0-.051.006l-1.424.465a.13.13 0 0 0 .08.248l1.424-.465a.13.13 0 0 0-.03-.254Zm-16.029.846a.13.13 0 0 0-.127.104.13.13 0 0 0 .1.155l.616.131a.13.13 0 0 0 .153-.1.13.13 0 0 0-.1-.155l-.615-.132a.127.127 0 0 0-.027-.003Zm16.235.002a.159.159 0 0 0-.027.002L17.677 8a.13.13 0 0 0-.1.155.13.13 0 0 0 .154.1l.615-.131a.13.13 0 0 0 .1-.155.13.13 0 0 0-.127-.103ZM1.926 8.72a.13.13 0 0 0-.116.116.13.13 0 0 0 .116.143l1.488.159a.13.13 0 0 0 .143-.116.13.13 0 0 0-.116-.144L1.953 8.72h-.027Zm16.55.011h-.027l-1.489.156a.13.13 0 0 0-.115.144.13.13 0 0 0 .143.116l1.488-.156a.13.13 0 0 0 .116-.144.13.13 0 0 0-.116-.116ZM1.9 9.598a.13.13 0 0 0-.13.13.13.13 0 0 0 .13.131h.63a.13.13 0 0 0 .13-.13.13.13 0 0 0-.13-.13H1.9Zm15.969 0a.13.13 0 0 0-.13.13.13.13 0 0 0 .13.131h.63a.13.13 0 0 0 .13-.13.13.13 0 0 0-.13-.13h-.63Zm-14.43.712h-.027l-1.488.156a.13.13 0 0 0-.116.144.13.13 0 0 0 .142.116l1.49-.157a.13.13 0 0 0 .115-.143.13.13 0 0 0-.116-.116Zm13.52.01a.13.13 0 0 0-.116.115.13.13 0 0 0 .115.144l1.489.158a.13.13 0 0 0 .143-.116.13.13 0 0 0-.116-.144l-1.488-.158a.123.123 0 0 0-.027 0Zm-14.262.88a.13.13 0 0 0-.027.003l-.616.132a.13.13 0 0 0-.1.155.13.13 0 0 0 .154.1l.616-.131a.13.13 0 0 0 .1-.155.13.13 0 0 0-.127-.103Zm15.005.002a.13.13 0 0 0-.128.103.13.13 0 0 0 .1.155l.616.132a.13.13 0 0 0 .054-.255l-.616-.132a.131.131 0 0 0-.026-.003Zm-13.968.514a.126.126 0 0 0-.051.006l-1.424.465a.13.13 0 0 0 .08.248l1.424-.465a.13.13 0 0 0-.03-.254Zm12.93.004a.13.13 0 0 0-.03.254l1.424.467a.13.13 0 0 0 .08-.248l-1.423-.466a.129.129 0 0 0-.051-.007ZM3.192 12.735a.13.13 0 0 0-.05.011l-.576.258a.13.13 0 0 0 .105.238l.576-.257a.13.13 0 0 0-.055-.25Zm14.015.005a.13.13 0 0 0-.055.25l.575.258a.13.13 0 0 0 .106-.238l-.575-.259a.128.128 0 0 0-.05-.011Zm-12.895.283a.127.127 0 0 0-.074.017l-1.297.753a.13.13 0 0 0 .13.226l1.296-.753a.13.13 0 0 0-.055-.243Zm11.777 0a.13.13 0 0 0-.056.243l1.297.753a.13.13 0 0 0 .177-.048.13.13 0 0 0-.047-.178l-1.297-.753a.128.128 0 0 0-.074-.017Zm-12.1 1.104a.13.13 0 0 0-.073.025l-.51.372a.13.13 0 0 0-.028.182.129.129 0 0 0 .181.03l.51-.373a.13.13 0 0 0-.08-.236Zm12.42.005a.13.13 0 0 0-.08.236l.51.372c.057.042.138.03.18-.03a.13.13 0 0 0-.028-.181l-.51-.373a.13.13 0 0 0-.072-.024Zm-11.267.045a.13.13 0 0 0-.093.033l-1.113 1.006a.13.13 0 0 0-.01.184c.048.054.13.059.183.01l1.113-1.006a.13.13 0 0 0-.08-.227Zm10.113.003a.13.13 0 0 0-.08.227l1.113 1.008a.13.13 0 0 0 .183-.01.13.13 0 0 0-.01-.184l-1.112-1.007a.13.13 0 0 0-.094-.034Zm-9.056.956a.129.129 0 0 0-.11.054l-.88 1.217a.13.13 0 0 0 .028.182c.058.043.139.03.181-.028l.88-1.218a.13.13 0 0 0-.1-.207Zm7.996.006a.13.13 0 0 0-.1.207l.878 1.218a.129.129 0 0 0 .181.029.13.13 0 0 0 .03-.182l-.88-1.219a.13.13 0 0 0-.109-.053Zm-9.133.188a.13.13 0 0 0-.09.043l-.421.47a.13.13 0 0 0 .01.184.129.129 0 0 0 .183-.01l.421-.47a.13.13 0 0 0-.103-.218Zm10.276 0a.13.13 0 0 0-.103.218l.421.47c.048.054.13.058.183.01a.13.13 0 0 0 .01-.184l-.421-.47a.13.13 0 0 0-.09-.044Zm-7.91.522a.13.13 0 0 0-.12.078l-.61 1.374a.13.13 0 0 0 .065.172.13.13 0 0 0 .171-.066l.61-1.374a.13.13 0 0 0-.116-.184Zm5.536.004a.13.13 0 0 0-.116.184l.608 1.375a.13.13 0 0 0 .171.066.13.13 0 0 0 .066-.172l-.608-1.376a.13.13 0 0 0-.12-.077Zm-6.607.421a.13.13 0 0 0-.104.065l-.315.549a.13.13 0 0 0 .048.178.13.13 0 0 0 .177-.048l.315-.548a.13.13 0 0 0-.121-.196Zm7.687 0a.13.13 0 0 0-.121.195l.315.549a.13.13 0 0 0 .177.048.13.13 0 0 0 .047-.178l-.314-.549a.13.13 0 0 0-.104-.065Zm-5.258.02a.13.13 0 0 0-.128.103l-.31 1.473a.13.13 0 1 0 .253.054l.311-1.473a.13.13 0 0 0-.126-.157Zm2.824 0-.026.003a.13.13 0 0 0-.1.155l.31 1.473a.13.13 0 0 0 .154.1.13.13 0 0 0 .1-.154l-.31-1.473a.13.13 0 0 0-.128-.103Zm-1.41.15a.13.13 0 0 0-.13.13v1.505a.13.13 0 1 0 .26 0v-1.505a.13.13 0 0 0-.13-.13Zm-2.382.486a.13.13 0 0 0-.112.09l-.195.602a.13.13 0 0 0 .084.164.13.13 0 0 0 .163-.084l.195-.602a.13.13 0 0 0-.135-.17Zm4.764 0a.13.13 0 0 0-.135.17l.195.602a.13.13 0 0 0 .163.084.13.13 0 0 0 .084-.164l-.195-.602a.13.13 0 0 0-.112-.09Zm-3.196.335a.13.13 0 0 0-.117.116l-.065.63a.13.13 0 1 0 .258.027l.066-.63a.13.13 0 0 0-.142-.143Zm1.624 0a.13.13 0 0 0-.142.143l.065.631a.13.13 0 1 0 .258-.027l-.065-.63a.13.13 0 0 0-.116-.116Z\" />\n\t<g filter=\"url(#d)\" opacity=\".409\">\n\t\t<path fill=\"#000\" d=\"m16.283 4.51-7.1 4.147-4.49 7.107 6.568-4.892 5.022-6.363Z\" />\n\t</g>\n\t<path fill=\"#FF5150\" d=\"M11.218 10.8 9.183 8.657l7.22-4.883-5.185 7.026Z\" />\n\t<path fill=\"#F1F1F1\" d=\"M11.218 10.8 9.183 8.657l-5.184 7.027 7.22-4.884Z\" />\n\t<path fill=\"#000\" d=\"m3.999 15.684 7.22-4.884 5.184-7.026-12.404 11.91Z\" opacity=\".243\" />\n\t<defs>\n\t\t<radialGradient id=\"c\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(10 0 0 10 10.24 8.424)\" gradientUnits=\"userSpaceOnUse\">\n\t\t\t<stop stop-color=\"#06C2E7\" />\n\t\t\t<stop offset=\".25\" stop-color=\"#0DB8EC\" />\n\t\t\t<stop offset=\".5\" stop-color=\"#12AEF1\" />\n\t\t\t<stop offset=\".75\" stop-color=\"#1F86F9\" />\n\t\t\t<stop offset=\"1\" stop-color=\"#107DDD\" />\n\t\t</radialGradient>\n\t\t<linearGradient id=\"b\" x1=\"10.2\" x2=\"10.2\" y1=\"19.44\" y2=\".018\" gradientUnits=\"userSpaceOnUse\">\n\t\t\t<stop stop-color=\"#BDBDBD\" />\n\t\t\t<stop offset=\"1\" stop-color=\"#fff\" />\n\t\t</linearGradient>\n\t\t<filter id=\"d\" width=\"16.679\" height=\"16.344\" x=\"2.149\" y=\"1.964\" color-interpolation-filters=\"sRGB\" filterUnits=\"userSpaceOnUse\">\n\t\t\t<feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\" />\n\t\t\t<feBlend in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\" />\n\t\t\t<feGaussianBlur result=\"effect1_foregroundBlur_1510_9490\" stdDeviation=\"1.272\" />\n\t\t</filter>\n\t</defs>\n","styles":[]});

const $$BrowserIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BrowserIcon;
  const { browser } = Astro2.props;
  const icons = { chrome, edge, firefox, safari };
  const { src, width, height } = icons[browser];
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(src, "src")} alt=""${addAttribute(width, "width")}${addAttribute(height, "height")}>`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-baseline-status/BrowserIcon.astro", void 0);

const $$SupportIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SupportIcon;
  const { baseline, browserImplementation } = Astro2.props;
  const paths = {
    available: `<path d="M1.25 3.31a8.84 8.84 0 0 1 5.47-1.88 8.8 8.8 0 0 1 8.84 8.77 8.8 8.8 0 0 1-8.84 8.77 8.84 8.84 0 0 1-5.47-1.88c-.23.34-.49.66-.75.97a10.07 10.07 0 0 0 6.22 2.14c5.57 0 10.07-4.48 10.07-10S12.3.2 6.72.2C4.37.2 2.21 1 .5 2.34c.26.31.52.64.75.97Z"/><path d="m11.35 8.13-5.01 4.93-3-2.96 1-.98 2 1.96 4-3.94 1 .98Z"/>`,
    unavailable: `<path d="M1.25 3.31a8.84 8.84 0 0 1 5.47-1.88 8.8 8.8 0 0 1 8.84 8.77 8.8 8.8 0 0 1-8.84 8.77 8.84 8.84 0 0 1-5.47-1.88c-.23.34-.49.66-.75.97a10.07 10.07 0 0 0 6.22 2.14c5.57 0 10.08-4.48 10.08-10S12.29.2 6.73.2C4.37.2 2.2 1 .5 2.34c.27.31.52.64.75.97Z"/><path d="M10.32 8.13 8.33 10.1l2 1.97-1 .99-1.99-1.98-1.99 1.98-.99-.99 1.99-1.97-1.99-1.97 1-.99 1.98 1.97 1.99-1.97 1 .99Z"/>`,
    no_data: `<path d="M7.18 12.28h-1.2c.01-.41.05-.74.12-1 .07-.27.19-.5.35-.72.16-.22.38-.47.65-.74l.54-.56c.16-.18.3-.37.4-.58.1-.2.16-.45.16-.74 0-.3-.06-.55-.16-.76a1.1 1.1 0 0 0-.47-.5 1.5 1.5 0 0 0-.75-.16c-.25 0-.48.04-.7.13-.23.09-.4.23-.54.41-.14.19-.21.43-.22.72H4.18c0-.48.12-.89.36-1.23.23-.35.55-.61.95-.8.4-.18.84-.27 1.33-.27.55 0 1 .1 1.39.3.38.2.68.47.88.84.2.36.3.79.3 1.29 0 .38-.08.73-.24 1.05-.15.32-.35.62-.6.9-.24.28-.5.55-.77.8-.24.22-.4.47-.48.74-.08.27-.12.56-.12.88ZM5.94 14.3c0-.2.06-.35.18-.49.12-.13.29-.2.52-.2.23 0 .4.07.52.2.12.14.18.3.18.49 0 .18-.06.34-.18.47-.12.13-.3.2-.52.2a.67.67 0 0 1-.52-.2.68.68 0 0 1-.18-.47Z"/><path d="M1.25 3.31a8.84 8.84 0 0 1 5.47-1.88 8.8 8.8 0 0 1 8.84 8.77 8.8 8.8 0 0 1-8.84 8.77c-2.06 0-3.96-.7-5.47-1.88-.23.34-.49.66-.75.97a10.07 10.07 0 0 0 6.22 2.14c5.57 0 10.07-4.48 10.07-10S12.3.2 6.72.2C4.37.2 2.21 1 .5 2.34c.26.31.52.64.75.97Z"/>`
  };
  const support = baseline === "limited" ? browserImplementation?.status || "unavailable" : baseline;
  const icon = support === "newly" || support === "widely" ? "available" : support;
  const fill = {
    no_data: "var(--color-no_data)",
    unavailable: "var(--color-limited)",
    newly: "var(--color-newly)",
    widely: "var(--color-widely)",
    available: "var(--color-widely)"
  }[support];
  return renderTemplate`${maybeRenderHead()}<svg width="17" height="21" aria-hidden="true"${addAttribute(fill, "fill")}>${unescapeHTML(paths[icon])}</svg>`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-baseline-status/SupportIcon.astro", void 0);

const $$BrowserSupport = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BrowserSupport;
  const { browser, feature } = Astro2.props;
  const baseline = feature.baseline.status || "no_data";
  const browserImplementation = feature.browser_implementations?.[browser];
  const browserName = {
    chrome: "Chrome",
    edge: "Edge",
    firefox: "Firefox",
    safari: "Safari"
  }[browser];
  let supportLabel = browserImplementation?.status || "no";
  if (baseline === "no_data") supportLabel = "unknown";
  if (supportLabel === "available") supportLabel = "yes";
  return renderTemplate`${maybeRenderHead()}<span part="browser-support"> <span part="browser-support-label">
Supported in ${browserName}: ${supportLabel}.
</span> ${renderComponent($$result, "BrowserIcon", $$BrowserIcon, { "browser": browser })} ${renderComponent($$result, "SupportIcon", $$SupportIcon, { "baseline": baseline, "browserImplementation": browserImplementation })} </span>`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-baseline-status/BrowserSupport.astro", void 0);

const $$BaselineStatus = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaselineStatus;
  const API_ENDPOINT = "https://api.webstatus.dev/v1/features/";
  const BASELINE_DEFS = {
    limited: {
      title: "Limited availability",
      defaultDescription: "This feature is not Baseline because it does not work in some of the most widely-used browsers."
    },
    newly: {
      title: "",
      defaultDescription: "This feature works across the latest devices and browser versions. This feature might not work in older devices or browsers."
    },
    widely: {
      title: "Widely available",
      defaultDescription: "This feature is well established and works across many devices and browser versions."
    },
    no_data: {
      title: "Unknown availability",
      defaultDescription: "We currently don’t have browser support information about this feature."
    }
  };
  function getBaselineDate(feature2) {
    return feature2.baseline.low_date ? new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long"
    }).format(new Date(feature2.baseline.low_date)) : "";
  }
  function getDescriptionDate(baseline2, date) {
    if (baseline2 === "newly" && date) {
      return `Since ${date} this feature works across the latest
			devices and browser versions. This feature might not work in older
			devices or browsers.`;
    } else if (baseline2 === "widely" && date) {
      return `This feature is well established and works across many
			devices and browser versions. It’s been available across browsers
			since ${date}`;
    }
    return BASELINE_DEFS[baseline2].defaultDescription;
  }
  const featureData = await safeGet(API_ENDPOINT + Astro2.props.id);
  const feature = featureData?.baseline ? featureData : {
    baseline: {
      status: "no_data"
    },
    name: Astro2.props.id || "Unknown feature"
  };
  const baseline = feature.baseline.status || "no_data";
  const title = BASELINE_DEFS[baseline].title;
  const baselineDate = getBaselineDate(feature);
  const description = getDescriptionDate(baseline, baselineDate);
  const year = baseline === "newly" && baselineDate ? baselineDate.split(" ")[1] : "";
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`baseline-status baseline-status--${baseline}`, "class")} data-astro-cid-7wt35nye> <template shadowrootmode="open" data-astro-cid-7wt35nye> <div part="root" data-astro-cid-7wt35nye> <p part="feature-name" data-astro-cid-7wt35nye>${feature.name}</p> <details part="details" data-astro-cid-7wt35nye> <summary part="summary" data-astro-cid-7wt35nye> ${renderComponent($$result, "BaselineIcon", $$BaselineIcon, { "support": baseline, "data-astro-cid-7wt35nye": true })} <div part="summary-content" data-astro-cid-7wt35nye> <div part="summary-label" data-astro-cid-7wt35nye> ${!(baseline === "limited" || baseline === "no_data") && renderTemplate`<strong data-astro-cid-7wt35nye>Baseline</strong>`} ${title} ${year} ${baseline === "newly" && renderTemplate`<span part="badge" data-astro-cid-7wt35nye>newly available</span>`} </div> <div part="browsers" data-astro-cid-7wt35nye> ${renderComponent($$result, "BrowserSupport", $$BrowserSupport, { "browser": "chrome", "feature": feature, "data-astro-cid-7wt35nye": true })} ${renderComponent($$result, "BrowserSupport", $$BrowserSupport, { "browser": "edge", "feature": feature, "data-astro-cid-7wt35nye": true })} ${renderComponent($$result, "BrowserSupport", $$BrowserSupport, { "browser": "firefox", "feature": feature, "data-astro-cid-7wt35nye": true })} ${renderComponent($$result, "BrowserSupport", $$BrowserSupport, { "browser": "safari", "feature": feature, "data-astro-cid-7wt35nye": true })} </div> </div> <style>
						[part='caret'] svg {
							transition: transform var(--animation-duration);
						}
						details[open] [part='caret'] svg {
							transform: rotate(180deg);
						}
					</style> <span part="caret" aria-hidden="true" data-astro-cid-7wt35nye> <svg width="11" height="7" fill="currentColor" data-astro-cid-7wt35nye> <path d="M5.5 6.45.25 1.2l.94-.94L5.5 4.6 9.8.3l.95.94L5.5 6.45Z" data-astro-cid-7wt35nye></path> </svg> </span> </summary> <p part="description" data-astro-cid-7wt35nye>${unescapeHTML(description)}</p> ${baseline !== "no_data" && renderTemplate`<p part="link-container" data-astro-cid-7wt35nye> <a${addAttribute(`https://webstatus.dev/features/${feature.feature_id}`, "href")} target="_top" part="link" data-astro-cid-7wt35nye>${`${feature.name} on Web Platform Status`}</a> </p>`} </details> </div> </template> </div>`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-baseline-status/BaselineStatus.astro", void 0);

const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
const escapeHTML = (str) => str?.replace(/[&<>"']/g, (match) => escapeMap[match] || match) ?? "";
function renderPostAsHtml(post) {
  if (!post) {
    return "";
  }
  const rt = new RichText(post.record);
  let html = "";
  for (const segment of rt.segments()) {
    if (segment.isLink()) {
      html += `<a href="${escapeHTML(segment.link?.uri)}">${escapeHTML(
        segment.text
      )}</a>`;
    } else if (segment.isMention()) {
      html += `<a href="https://bsky.app/profile/${escapeHTML(
        segment.mention?.did
      )}">${escapeHTML(segment.text)}</a>`;
    } else if (segment.isTag()) {
      html += `<a href="https://bsky.app/hashtag/${escapeHTML(
        segment.tag?.tag
      )}">#${escapeHTML(segment.tag?.tag)}</a>`;
    } else {
      html += escapeHTML(segment.text);
    }
  }
  return html;
}
function viewRecordToPostView(viewRecord) {
  const { value, embeds, ...rest } = viewRecord;
  return {
    ...rest,
    $type: "app.bsky.feed.defs#postView",
    record: value,
    embed: embeds?.[0]
  };
}
function viewRecordToEmbed(viewRecord, allowNestedQuotes = false) {
  const { embed } = viewRecordToPostView(viewRecord);
  if (allowNestedQuotes) {
    return embed;
  } else {
    if (AppBskyEmbedImages.isView(embed) || AppBskyEmbedExternal.isView(embed) || AppBskyEmbedVideo.isView(embed)) {
      return embed;
    } else if (AppBskyEmbedRecordWithMedia.isView(embed) && (AppBskyEmbedImages.isView(embed.media) || AppBskyEmbedExternal.isView(embed.media) || AppBskyEmbedVideo.isView(embed.media))) {
      return embed.media;
    }
  }
  return void 0;
}
const agent = new AtpAgent({
  service: "https://public.api.bsky.app"
});
async function resolvePost(postUrl) {
  let atUri;
  if (typeof postUrl === "object") {
    return postUrl;
  }
  if (postUrl.startsWith("at:")) {
    atUri = postUrl;
  } else {
    if (!postUrl.startsWith("https://bsky.app/")) {
      return void 0;
    }
    const urlParts = new URL(postUrl).pathname.split("/");
    let did = urlParts[2];
    const postId = urlParts[4];
    if (!did || !postId) {
      return void 0;
    }
    if (!did.startsWith("did:")) {
      try {
        const handleResolution = await agent.resolveHandle({ handle: did });
        if (!handleResolution.data.did) {
          return void 0;
        }
        did = handleResolution.data.did;
      } catch (e) {
        console.error(
          `[error]  astro-embed
         ` + (e?.message ?? e)
        );
        return void 0;
      }
    }
    atUri = `at://${did}/app.bsky.feed.post/${postId}`;
  }
  try {
    const hydratedPost = await agent.getPosts({ uris: [atUri] });
    return hydratedPost.data.posts[0];
  } catch (e) {
    console.error(`[error]  astro-embed
         ` + (e?.message ?? e));
    return void 0;
  }
}
function atUriToPostUri(atUri) {
  const [, , did, , postId] = atUri.split("/");
  return `https://bsky.app/profile/${did}/post/${postId}`;
}
function atUriToStarterPackUri(atUri) {
  const [, , did, , packId] = atUri.split("/");
  return `https://bsky.app/starter-pack/${did}/${packId}`;
}
function atUriToListUri(atUri) {
  const [, , did, , listId] = atUri.split("/");
  return `https://bsky.app/profile/${did}/lists/${listId}`;
}
function starterPackOgImage(uri) {
  const [, , did, , packId] = uri.split("/");
  return `https://ogcard.cdn.bsky.app/start/${did}/${packId}`;
}

const $$External = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$External;
  const { uri, thumb, title, description } = Astro2.props.embed.external;
  const domain = new URL(uri).hostname;
  const { compact } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(uri, "href")} target="_blank" rel="noopener noreferrer nofollow" class="external-link" data-astro-cid-stjl7fun> ${!compact && thumb && renderTemplate`<img${addAttribute(thumb, "src")}${addAttribute(title, "alt")} class="thumbnail" data-astro-cid-stjl7fun>`} <div class="content" data-astro-cid-stjl7fun> <p class="domain" data-astro-cid-stjl7fun>${domain}</p> ${!compact && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-stjl7fun": true }, { "default": ($$result2) => renderTemplate` <p class="title" data-astro-cid-stjl7fun>${title}</p> <p class="description" data-astro-cid-stjl7fun>${description}</p> ` })}`} </div> </a>`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-bluesky/src/external.astro", void 0);

const $$ImageGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ImageGrid;
  const { images } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="image-grid-container" data-astro-cid-tayatr6q> <div${addAttribute(["image-grid", `image-grid--${images.length}`], "class:list")} data-astro-cid-tayatr6q> ${images.map((image) => renderTemplate`<div class="image-grid-item" data-astro-cid-tayatr6q> <img${addAttribute(image.thumb, "src")}${addAttribute(image.alt || "", "alt")} loading="lazy" decoding="async" data-astro-cid-tayatr6q> </div>`)} </div> </div>`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-bluesky/src/image-grid.astro", void 0);

const $$MediaContainer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$MediaContainer;
  const { aspectRatio, onClick, className = "" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["media-container", className], "class:list")}${addAttribute({
    aspectRatio: aspectRatio ? `${aspectRatio.width}/${aspectRatio.height}` : void 0
  }, "style")}${spreadAttributes(onClick ? { onClick } : {})} data-astro-cid-kx6yyo6i> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-bluesky/src/media-container.astro", void 0);

const $$VideoThumbnail = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$VideoThumbnail;
  const { thumbnail, aspectRatio } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "MediaContainer", $$MediaContainer, { "aspectRatio": aspectRatio, "data-astro-cid-pkddrwlf": true }, { "default": ($$result2) => renderTemplate`${thumbnail && renderTemplate`${maybeRenderHead()}<img${addAttribute(thumbnail, "src")} class="thumbnail" alt="Video thumbnail" data-astro-cid-pkddrwlf>`}<div class="play-button" data-astro-cid-pkddrwlf> <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20fill='none'%20viewBox='0%200%2024%2024'%3e%3cpath%20fill='%23fff'%20d='M9.576%202.534C7.578%201.299%205%202.737%205%205.086v13.828c0%202.35%202.578%203.787%204.576%202.552l11.194-6.914c1.899-1.172%201.899-3.932%200-5.104L9.576%202.534Z'/%3e%3c/svg%3e" class="play-icon" alt="Play button" data-astro-cid-pkddrwlf> </div> ` })}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-bluesky/src/video-thumbnail.astro", void 0);

const $$Avatar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Avatar;
  const { user, link, size = "medium" } = Astro2.props;
  const src = user.avatar;
  return renderTemplate`${link ? renderTemplate`${maybeRenderHead()}<a${addAttribute(["avatar", size], "class:list")}${addAttribute(`https://bsky.app/profile/${user?.handle}`, "href")} target="_blank" rel="noopener noreferrer nofollow" data-astro-cid-manwa2bn>${src && renderTemplate`<img${addAttribute(src, "src")}${addAttribute(user.displayName ?? user.handle, "alt")} data-astro-cid-manwa2bn>`}</a>` : renderTemplate`<div${addAttribute(["avatar", size], "class:list")} data-astro-cid-manwa2bn>${src && renderTemplate`<img${addAttribute(src, "src")}${addAttribute(user.displayName ?? user.handle, "alt")} data-astro-cid-manwa2bn>`}</div>`}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-bluesky/src/avatar.astro", void 0);

const $$QuoteEmbed = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$QuoteEmbed;
  const { embed } = Astro2.props;
  return renderTemplate`${AppBskyEmbedRecord.isViewRecord(embed.record) && AppBskyFeedPost.isRecord(embed.record.value) ? renderTemplate`${maybeRenderHead()}<div class="post-container" data-astro-cid-focmzavi><a${addAttribute(atUriToPostUri(embed.record.uri), "href")} class="post-link" data-astro-cid-focmzavi><div class="user-info" data-astro-cid-focmzavi>${renderComponent($$result, "Avatar", $$Avatar, { "user": embed.record.author, "size": "small", "data-astro-cid-focmzavi": true })}<p class="user-text" data-astro-cid-focmzavi><span class="name" data-astro-cid-focmzavi>${embed.record.author.displayName}</span><span class="handle" data-astro-cid-focmzavi>@${embed.record.author.handle}</span></p></div></a><a${addAttribute(atUriToPostUri(embed.record.uri), "href")} class="post-link" data-astro-cid-focmzavi><p class="content" data-astro-cid-focmzavi>${embed.record.value.text}</p></a>${renderComponent($$result, "Embed", $$Embed, { "embed": viewRecordToEmbed(embed.record), "postUrl": atUriToPostUri(embed.record.uri), "compact": true, "data-astro-cid-focmzavi": true })}</div>` : null}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-bluesky/src/quote-embed.astro", void 0);

const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Card;
  const { href, image, avatarUser, title, subtitle, description } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} target="_blank" rel="noopener noreferrer nofollow" class="card" data-astro-cid-ovxpf64e> ${image && renderTemplate`<img class="cover-image"${addAttribute(image.src, "src")}${addAttribute(image.alt ?? "", "alt")} data-astro-cid-ovxpf64e>`} <div class="content" data-astro-cid-ovxpf64e> <div class="header" data-astro-cid-ovxpf64e> ${renderComponent($$result, "Avatar", $$Avatar, { "user": avatarUser, "data-astro-cid-ovxpf64e": true })} <div class="title-group" data-astro-cid-ovxpf64e> <p class="title" data-astro-cid-ovxpf64e>${title}</p> <p class="subtitle" data-astro-cid-ovxpf64e>${subtitle}</p> </div> </div> ${description && renderTemplate`<p class="description" data-astro-cid-ovxpf64e>${description}</p>`} </div> </a>`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-bluesky/src/card.astro", void 0);

const $$StarterPack = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$StarterPack;
  const { record } = Astro2.props;
  const pack = AppBskyGraphStarterpack.isRecord(record.record) ? record.record : null;
  return renderTemplate`${renderComponent($$result, "Card", $$Card, { "href": atUriToStarterPackUri(record.uri), "image": {
    src: starterPackOgImage(record.uri),
    alt: pack?.name || "Starter pack cover image"
  }, "avatarUser": record.creator, "title": pack?.name || "", "subtitle": `Starter pack by ${record.creator.displayName}`, "description": pack?.description })}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-bluesky/src/starter-pack.astro", void 0);

const $$List = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$List;
  const { record } = Astro2.props;
  const list = AppBskyGraphDefs.isListView(record) ? record : null;
  const purposes = {
    "app.bsky.graph.defs#curatelist": "User list",
    "app.bsky.graph.defs#modlist": "Moderation list",
    "app.bsky.graph.defs#referencelist": "List"
  };
  const purpose = (list && purposes[list.purpose]) ?? "List";
  return renderTemplate`${renderComponent($$result, "Card", $$Card, { "href": atUriToListUri(record.uri), "avatarUser": record.creator, "title": list?.name || "", "subtitle": `${purpose} by ${record.creator.displayName}`, "description": list?.description })}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-bluesky/src/list.astro", void 0);

const $$Embed = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Embed;
  const { embed, postUrl, compact } = Astro2.props;
  return renderTemplate`${AppBskyEmbedRecordWithMedia.isView(embed) ? renderTemplate`${maybeRenderHead()}<div class="record-with-media" data-astro-cid-ojlygtsz>${renderComponent($$result, "Astro.self", Astro2.self, { "embed": embed.media, "postUrl": postUrl, "compact": compact, "data-astro-cid-ojlygtsz": true })}${renderComponent($$result, "QuoteEmbed", $$QuoteEmbed, { "embed": embed.record, "data-astro-cid-ojlygtsz": true })}</div>` : AppBskyEmbedExternal.isView(embed) ? renderTemplate`${renderComponent($$result, "External", $$External, { "embed": embed, "compact": compact, "data-astro-cid-ojlygtsz": true })}` : AppBskyEmbedImages.isView(embed) ? renderTemplate`<a${addAttribute(postUrl, "href")} data-astro-cid-ojlygtsz>${renderComponent($$result, "ImageGrid", $$ImageGrid, { "images": embed.images, "data-astro-cid-ojlygtsz": true })}</a>` : AppBskyEmbedVideo.isView(embed) ? renderTemplate`<a${addAttribute(postUrl, "href")} data-astro-cid-ojlygtsz>${renderComponent($$result, "VideoThumbnail", $$VideoThumbnail, { "thumbnail": embed.thumbnail, "aspectRatio": embed.aspectRatio, "data-astro-cid-ojlygtsz": true })}</a>` : AppBskyGraphDefs.isStarterPackViewBasic(embed?.record) ? renderTemplate`${renderComponent($$result, "StarterPack", $$StarterPack, { "record": embed.record, "data-astro-cid-ojlygtsz": true })}` : AppBskyGraphDefs.isListView(embed?.record) ? renderTemplate`${renderComponent($$result, "List", $$List, { "record": embed.record, "data-astro-cid-ojlygtsz": true })}` : AppBskyEmbedRecord.isView(embed) ? renderTemplate`${renderComponent($$result, "QuoteEmbed", $$QuoteEmbed, { "embed": embed, "data-astro-cid-ojlygtsz": true })}` : !embed ? null : embed?.$type}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-bluesky/src/embed.astro", void 0);

const $$Post = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Post;
  const postRef = Astro2.props.id ?? Astro2.props.post;
  if (!postRef) {
    return new Response("");
  }
  const post = await resolvePost(postRef);
  if (!post) {
    return new Response("");
  }
  const postUrl = atUriToPostUri(post.uri);
  const { record, embed, author } = post;
  const authorUrl = `https://bsky.app/profile/${author?.handle}`;
  const body = renderPostAsHtml(post);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
    timeZoneName: "short"
  });
  return renderTemplate`${maybeRenderHead()}<div class="bluesky-post-container not-content" data-astro-cid-cefdu6fu> <div class="post-content" data-astro-cid-cefdu6fu> <div class="post-header" data-astro-cid-cefdu6fu> ${renderComponent($$result, "Avatar", $$Avatar, { "user": author, "link": true, "data-astro-cid-cefdu6fu": true })} <div class="user-info" data-astro-cid-cefdu6fu> <a${addAttribute(authorUrl, "href")} class="display-name" data-astro-cid-cefdu6fu>${author?.displayName}</a> <a${addAttribute(authorUrl, "href")} class="username" data-astro-cid-cefdu6fu>@${author?.handle}</a> </div> <a${addAttribute(postUrl, "href")} class="logo-link" data-astro-cid-cefdu6fu> <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20fill='none'%20viewBox='0%200%20320%20286'%3e%3cpath%20fill='rgb(10,122,255)'%20d='M69.364%2019.146c36.687%2027.806%2076.147%2084.186%2090.636%20114.439%2014.489-30.253%2053.948-86.633%2090.636-114.439C277.107-.917%20320-16.44%20320%2032.957c0%209.865-5.603%2082.875-8.889%2094.729-11.423%2041.208-53.045%2051.719-90.071%2045.357%2064.719%2011.12%2081.182%2047.953%2045.627%2084.785-80%2082.874-106.667-44.333-106.667-44.333s-26.667%20127.207-106.667%2044.333c-35.555-36.832-19.092-73.665%2045.627-84.785-37.026%206.362-78.648-4.149-90.071-45.357C5.603%20115.832%200%2042.822%200%2032.957%200-16.44%2042.893-.917%2069.364%2019.147Z'/%3e%3c/svg%3e" class="bluesky-logo" alt="Bluesky" data-astro-cid-cefdu6fu> </a> </div> <p class="post-text" data-astro-cid-cefdu6fu>${unescapeHTML(body)}</p> ${embed && renderTemplate`${renderComponent($$result, "Embed", $$Embed, { "embed": embed, "postUrl": postUrl, "data-astro-cid-cefdu6fu": true })}`} <a${addAttribute(postUrl, "href")} class="timestamp" data-astro-cid-cefdu6fu> ${formatter.format(new Date(record.createdAt ?? ""))} </a> </div> </div>`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/node_modules/@astro-community/astro-embed-bluesky/src/post.astro", void 0);

export { $$YouTube as $, $$Tweet as a, $$Vimeo as b };
