import Link from "next/link";

const resources = [
  "Privacy Policy",
  "Terms of Services",
  "Contact Support",
  "University Guidelines",
];

export function Footer() {
  return (
    <footer className="mt-auto bg-navy-deep text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">University IMS</h3>
          <p className="max-w-xs text-sm leading-relaxed text-white/70">
            The ultimate Internship Management System bridging the path from
            education to industry excellence. Empowering students of the
            University through digital transformation.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-base font-semibold text-white">Portals</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/student/login" className="hover:text-white">
                Student Login
              </Link>
            </li>
            <li>
              <Link href="/department/auth" className="hover:text-white">
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-base font-semibold text-white">Resources</h4>
          <ul className="space-y-2 text-sm">
            {resources.map((r) => (
              <li key={r}>
                <a href="#" className="hover:text-white">
                  {r}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-navy py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-6 text-xs text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} IMS Portal. All rights reserved by the
            Department of Computer Science.
          </p>
          <div className="flex flex-wrap gap-4">
            {resources.map((r) => (
              <a key={r} href="#" className="hover:text-white">
                {r}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
