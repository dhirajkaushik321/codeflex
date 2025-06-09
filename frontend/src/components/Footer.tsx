import Link from "next/link";

const practiceLinks = [
  { name: "MCQs", href: "/mcqs" },
  { name: "Coding Questions", href: "/coding-questions" },
  { name: "System Design", href: "/system-design" },
  { name: "Data Structures", href: "/data-structures" },
];
const featureLinks = [
  { name: "AI Mock Interviews", href: "/ai-mock-interviews" },
  { name: "Resume Builder", href: "/resume-maker" },
  { name: "Hackathons", href: "/hackathons" },
  { name: "Certifications", href: "/certifications" },
];
const supportLinks = [
  { name: "Help Center", href: "/help" },
  { name: "Contact Us", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

const socials = [
  { name: "Twitter", href: "#", icon: (
    <svg width="20" height="20" fill="currentColor" className="text-blue-400" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.239-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
  ) },
  { name: "LinkedIn", href: "#", icon: (
    <svg width="20" height="20" fill="currentColor" className="text-blue-700" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
  ) },
  { name: "GitHub", href: "#", icon: (
    <svg width="20" height="20" fill="currentColor" className="text-gray-800 dark:text-gray-200" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"/></svg>
  ) },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pt-12 pb-4 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row gap-12 md:gap-0 justify-between">
        {/* Left: Logo & Desc */}
        <div className="flex-1 mb-8 md:mb-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">&lt;/&gt;</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">code<span className="text-indigo-500 dark:text-indigo-400">Veer</span></span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-xs">
            Comprehensive technical interview preparation platform powered by AI.
          </p>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a key={s.name} href={s.href} className="hover:scale-110 transition-transform" aria-label={s.name}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        {/* Right: Links */}
        <div className="flex gap-12 md:gap-16">
          <div>
            <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Practice</div>
            <ul className="space-y-1">
              {practiceLinks.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Features</div>
            <ul className="space-y-1">
              {featureLinks.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Support</div>
            <ul className="space-y-1">
              {supportLinks.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 dark:text-gray-500 text-sm mt-10">
        © 2024 codeVeer. All rights reserved.
      </div>
    </footer>
  );
} 