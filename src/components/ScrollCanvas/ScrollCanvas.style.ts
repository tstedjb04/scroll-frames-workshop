import clsx from "clsx";

export const section = clsx("relative h-[300vh] bg-[#0F172A]");
export const sticky = clsx(
  "sticky top-0 flex h-screen w-full items-center justify-center",
);
export const canvas = clsx("h-full w-full object-cover");
export const loading = clsx(
  "absolute inset-0 flex items-center justify-center text-white/80",
);
export const hint = clsx(
  "pointer-events-none absolute bottom-8 left-0 right-0 text-center text-sm text-white/60",
);
