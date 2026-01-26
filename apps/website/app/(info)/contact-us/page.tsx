import { ContactForm } from "@/components/features/contact-us/contact-form";
import { Mail, MapPin, Phone, Clock, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Contact Support | Wisdom Abacus Academy",
  description: "Get in touch with our support team for admissions, technical issues, or general inquiries.",
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">

      {/* ---------------------------------------------------------
          LEFT PANEL: Contact Info (Dark Theme)
      --------------------------------------------------------- */}
      <div className="w-full lg:w-[40%] bg-[#121212] text-white p-8 md:p-16 lg:p-20 flex flex-col justify-between relative overflow-hidden">

        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
              <MessageSquare className="h-3 w-3" />
              Support Center
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-4">
              Let's Start a <br />
              <span className="text-orange-500">Conversation.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Whether you have a technical issue, a question about admissions, or just want to say hello, we are here to help.
            </p>
          </div>

          {/* Contact Details List */}
          <div className="space-y-6 pt-8">

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Call Us</h3>
                <p className="text-slate-400 text-sm mb-1">Mon-Sat from 9am to 6pm</p>
                <a href="tel:+919876543210" className="text-white hover:text-orange-400 transition-colors font-medium">
                  +91 98765 43210
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Email Us</h3>
                <p className="text-slate-400 text-sm mb-1">We usually reply within 24hrs</p>
                <a href="mailto:support@wisdomabacus.com" className="text-white hover:text-orange-400 transition-colors font-medium">
                  support@wisdomabacus.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Reach Us</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                  Wisdom Abacus Academy, <br />
                  Sector 4, Tech Park Road, <br />
                  Mumbai, Maharashtra - 400001
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 pt-12 mt-auto">
          <p className="text-xs text-slate-500">
            &copy; 2025 Wisdom Abacus Academy. All rights reserved.
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------
          RIGHT PANEL: Form (Light Theme)
      --------------------------------------------------------- */}
      <div className="w-full lg:w-[60%] bg-white flex flex-col justify-center p-6 md:p-12 lg:p-24">
        <div className="max-w-xl w-full mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#121212]">Send us a Message</h2>
            <p className="text-slate-500 mt-2">
              Please fill out the form below and our team will route your request to the correct department.
            </p>
          </div>

          {/* Reusing the Form Component */}
          <ContactForm />
        </div>
      </div>

    </main>
  );
}