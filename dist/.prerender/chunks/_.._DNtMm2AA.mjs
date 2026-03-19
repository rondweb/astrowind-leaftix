import { c as createComponent } from './consts_Bhtzq3Da.mjs';
import 'piccolore';
import { r as renderComponent, a as renderTemplate, m as maybeRenderHead } from './prerender_Cc-hlpSz.mjs';
import { g as getStaticPathsBlogCategory, b as blogCategoryRobots } from './blog_CyP0zF5k.mjs';
import { $ as $$PageLayout } from './PageLayout_DvEhEmFQ.mjs';
import { $ as $$Headline, a as $$List, b as $$Pagination } from './Pagination_CKEzAOXB.mjs';

const prerender = true;
const getStaticPaths = (async ({ paginate }) => {
  return await getStaticPathsBlogCategory({ paginate });
});
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$;
  const { page, category } = Astro2.props;
  const currentPage = page.currentPage ?? 1;
  const metadata = {
    title: `Category '${category.title}' ${currentPage > 1 ? ` — Page ${currentPage}` : ""}`,
    robots: {
      index: blogCategoryRobots?.index,
      follow: blogCategoryRobots?.follow
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="px-4 md:px-6 py-12 sm:py-16 lg:py-20 mx-auto max-w-4xl"> ${renderComponent($$result2, "Headline", $$Headline, {}, { "default": async ($$result3) => renderTemplate`${category.title}` })} ${renderComponent($$result2, "BlogList", $$List, { "posts": page.data })} ${renderComponent($$result2, "Pagination", $$Pagination, { "prevUrl": page.url.prev, "nextUrl": page.url.next })} </section> ` })}`;
}, "E:/OTHER_PROJECTS/astrowind-leaftix/src/pages/[...blog]/[category]/[...page].astro", void 0);

const $$file = "E:/OTHER_PROJECTS/astrowind-leaftix/src/pages/[...blog]/[category]/[...page].astro";
const $$url = "/[...blog]/[category]/[...page]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
