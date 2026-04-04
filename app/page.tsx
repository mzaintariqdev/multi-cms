import Link from "next/link";
import '../app/globals.css';
import Layout from "@/components/Layout";
import Sidebar from "@/components/Sidebar";

const cmsList = [
  { name: "contentful", color: "bg-blue-500" },
  { name: "sanity", color: "bg-red-500" },
  { name: "strapi", color: "bg-purple-500" },
  { name: "storyblok", color: "bg-green-500" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      
      {/* Header */}
      <header className="w-full px-6 py-4 bg-white shadow-sm flex justify-between items-center">
        <h1 className="text-xl text-black font-bold">Multi CMS Manager</h1>
        <span className="text-sm text-gray-500">Dashboard</span>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        
        {/* Title */}
        <div className="text-center mb-10 max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Manage Content Across Multiple CMS
          </h2>
          <p className="text-gray-600">
            Create, edit, and delete posts across different headless CMS platforms from one unified interface.
          </p>
        </div>

        {/* CMS Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
          {cmsList.map((cms) => (
            <Link
              key={cms.name}
              href={`/cms/${cms.name}/posts`}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-1 transition duration-300">
                
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-full ${cms.color} flex items-center justify-center text-white font-bold text-lg mb-4`}
                >
                  {cms.name[0].toUpperCase()}
                </div>

                {/* Name */}
                <h3 className="text-lg text-black font-semibold capitalize">
                  {cms.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 mt-1 text-center">
                  Manage posts
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4">
        Built with Next.js + Multi CMS Architecture
      </footer>
    </div>
  );
}