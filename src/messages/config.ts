import { LocalePrefix, Pathnames } from "next-intl/routing";

export const locales = ["en", "es"] as const;

export type Locales = typeof locales;

export const pathnames: Pathnames<Locales> = {
    "/": "/",
    "/events": "/events",
    "/account": "/account",
    "/users": "/users",
    "/contact": "/contact",

};

export const localePrefix: LocalePrefix<Locales> = "always"
