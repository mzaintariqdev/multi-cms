"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const cmsList = ["contentful", "sanity", "strapi", "storyblok"];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="p-6 font-bold text-2xl text-blue-600 dark:text-blue-400">Multi CMS</div>
      <nav className="flex flex-col flex-1">
        {cmsList.map((cms) => (
          <Link
            key={cms}
            href={`/cms/${cms}/posts`}
            className={`p-4 mx-3 my-1 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-blue-700
              ${pathname.includes(cms) ? "bg-blue-200 dark:bg-blue-600 font-semibold" : ""}`}
          >
            {cms.charAt(0).toUpperCase() + cms.slice(1)}
          </Link>
        ))}
      </nav>
    </div>
  );
}