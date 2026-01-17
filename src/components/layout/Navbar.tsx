import Link from "next/link";
import Logo from "@/components/Logo";
import { ScrollLink } from "@/components/action/ScrollLink";
import ThemeToggle from "../action/ThemeToggle2";

type Section = {
  label: string;
  route: string;
  primary?: boolean;
};

const sections: Section[] = [
  { route: "/#aboutus", label: "About Us" },
  { route: "/blog", label: "Blog" },
  { route: "/#customersay", label: "Customer Say" },
  { primary: true, route: "/#getquote", label: "Get Quote" },
];

export default function Navbar() {
  return (
    <div className="z-50 w-full relative flex justify-center">
      <div className="w-full py-2 md:py-5 max-w-3xl md:max-w-5xl xl:max-w-6xl mx-3 md:mx-6 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center min-h-[40px]">
          <Logo width={32} height={32} className="text-black dark:text-white" />
          <h1 className="ml-2 text-xl md:text-2xl font-medium tracking-wider">
            REFLECT YOUR VIBE
          </h1>
        </Link>
        <div className="flex items-center md:space-x-2">
          <ThemeToggle />
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-2">
            {
              sections.map(({ label, ...props }) => (
                <ScrollLink key={props.route} {...props}>
                  <span className="text-sm md:text-md">{label}</span>
                </ScrollLink>
              ))
            }
          </nav>
        </div>
      </div>
    </div>
  );
}
