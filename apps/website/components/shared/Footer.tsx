import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  ShieldCheck,
  Heart
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10 text-slate-600 font-sans">
      {/* Container */}
      <div className="container mx-auto px-4">

        {/* Top Section: Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Column 1: Brand Identity (Span 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h3 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                Wisdom Abacus
              </h3>
              <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mt-1">
                Academy & Competitions
              </p>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-slate-600">
              Empowering young minds for over <strong>12 years</strong>.
              Join India's premier platform for mental math excellence,
              online competitions, and holistic brain development.
            </p>

            {/* Social Links - Light Theme Styles */}
            <div className="flex items-center gap-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" },
                { icon: Twitter, href: "#" }
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 shadow-sm"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Platform (Span 2 cols) */}
          <div className="lg:col-span-2 lg:pl-4">
            <h4 className="font-bold text-slate-900 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/competitions" className="hover:text-orange-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-orange-600 transition-colors" />
                  Competitions
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-orange-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-orange-600 transition-colors" />
                  Our Courses
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-orange-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-orange-600 transition-colors" />
                  Mock Tests
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-orange-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-orange-600 transition-colors" />
                  Results
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Legal (Span 2 cols) */}
          {/* Renamed from "Company" to "Support" as requested */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/about-us" className="hover:text-orange-600 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-orange-600 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-orange-600 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-orange-600 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/cancellation-and-refund" className="hover:text-orange-600 transition-colors">Cancellation & Refund</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Reach Us (Span 4 cols) */}
          {/* Styled as a clean White Card for contrast against the slate footer */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-600" />
              Reach Us
            </h4>
            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-slate-600 leading-relaxed">
                  2-52-7, Santhinagar,<br />
                  Hundred Building Centre Fourth Street,<br />
                  Kakinada, Andhra Pradesh - 533001
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full" />

              <div className="space-y-3">
                {/* <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase">Helpline</p>
                    <a href="tel:+919876543210" className="text-slate-900 hover:text-orange-600 font-bold transition-colors">+91 98765 43210</a>
                  </div>
                </div> */}

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase">Email Support</p>
                    <a href="mailto:info@wisdomabacus.com" className="text-slate-900 hover:text-orange-600 font-bold transition-colors">info@wisdomabacus.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright & "Made with Love" */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">

          <div className="space-y-1">
            <p className="text-sm text-slate-500">
              © 2025 Wisdom Abacus Academy. All rights reserved.
            </p>
            {/* "Made with Love" Text */}
            <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1">
              Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for the brilliant minds of India.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>100% Secure Payments</span>
            </div>
            <span className="text-xs text-slate-400 font-semibold tracking-wider opacity-70">
              POWERED BY RAZORPAY
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};