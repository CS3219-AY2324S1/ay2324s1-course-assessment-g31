import { Link } from "react-router-dom";
import titleCase from "../../../util/titleCase";

function Footer() {
  const footerNavigation = {
    pages: [
      { name: "Home", href: "/" },
      { name: "Questions", href: "/questions" },
      { name: "Match", href: "/match" },
    ],
    users: [
      { name: "Profile", href: "/profile" },
      { name: "Sign In", href: "/sign-in" },
      { name: "Register", href: "/register" },
    ],
  };
  return (
    <div className="mx-auto mt-8 max-w-7xl px-6 lg:px-8">
      <footer
        aria-labelledby="footer-heading"
        className="relative border-t border-gray-900/10 dark:border-gray-100/10 py-12 sm:py-16"
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <img className="h-7" src="/logo.png" alt="Peer Prep Logo" />
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            {Object.entries(footerNavigation).map((val) => (
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
                  {titleCase(val[0])}
                </h3>
                <ul className="mt-6 space-y-4">
                  {val[1].map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
export default Footer;
