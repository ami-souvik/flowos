import Link from "next/link";
import { Phone } from "lucide-react";
import ThemeToggle from "@/components/action/ThemeToggle2";
import Logo from "../Logo";
import WhatsApp from "@/components/svg/WhatsApp";
import Instagram from "@/components/svg/Instagram";
import Facebook from "@/components/svg/Facebook";

export default function Footer() {
  return (
    <div>
      <div className="bg-black flex justify-center">
        <div className="w-full max-w-3xl md:max-w-5xl xl:max-w-6xl px-8 font-thin text-white">
          <div className="text-sm md:text-md pt-8 grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr] space-x-4 space-y-12">
            <div className="flex flex-col justify-between">
              <div className="mb-8 flex space-x-4">
                <Link href="/" className="flex items-center min-h-[40px]">
                  <Logo className="w-5 h-5 text-white" />
                  <h1 className="ml-2 text-xl font-medium tracking-wider">
                    RYV
                  </h1>
                </Link>
                <ThemeToggle />
              </div>
              <div className="flex justify-between max-w-16">
                <Link href="https://facebook.com/profile.php?id=61578637522457">
                  <Instagram className="w-6 h-6" />
                </Link>
                <Link href="https://instagram.com/reflect_your_vibe">
                  <Facebook className="w-6 h-6" />
                </Link>
              </div>
            </div>
            <ul className="space-y-2">
              <li className="font-medium">Company</li>
              <li>
                <Link href="/#aboutus">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/#customersay">
                  Customer Say
                </Link>
              </li>
              <li>
                <Link href="/#getquote">
                  Get Quote
                </Link>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="font-medium">Resources</li>
              <li>
                <Link href="/blog">
                  Blog
                </Link>
              </li>
              <li>FAQ</li>
            </ul>
            <div className="hidden sm:block md:hidden" />
            <ul className="space-y-2">
              <li className="font-medium">Contact Us</li>
              <li>
                <Link href="https://wa.me/918420233290" className="text-md font-normal underline underline-offset-1 decoration-1 flex items-center gap-x-2">
                  <WhatsApp className="w-5 h-5" />8420233290
                </Link>
              </li>
              <li>
                <Link href="tel:+917980588506" className="text-md font-normal underline underline-offset-1 decoration-1 flex items-center gap-x-2">
                  <Phone className="w-5 h-5" />7980588506
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full h-18 md:h-12 lg:h-14 overflow-hidden border-b border-white flex justify-end">
            <p className="inline md:hidden text-8xl text-white/70 tracking-wider">RYV</p>
            <p className="hidden md:inline text-6xl lg:text-7xl text-white/70 tracking-wider">REFLECT YOUR VIBE</p>
          </div>
          <div className="py-8 text-sm md:text-md flex justify-between">
            <p>© 2026 Reflect Your Vibe. All rights reserved.</p>
            <p>reflectyourvibe25@gmail.com</p>
          </div>
        </div>
      </div>
    </div >
  );
}
