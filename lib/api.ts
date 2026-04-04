import * as contentful from "./cms/contentful";
import * as sanity from "./cms/sanity";
import * as strapi from "./cms/strapi";
import * as storyblok from "./cms/storyblok";

const cmsMap = {
  contentful,
  sanity,
  strapi,
  storyblok,
};

export function getCMS(cms: string) {
  const api = cmsMap[cms as keyof typeof cmsMap];

  if (!api) {
    throw new Error(`CMS "${cms}" not supported`);
  }

  return api;
}
