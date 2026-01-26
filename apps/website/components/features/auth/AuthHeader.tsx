import Link from "next/link";
import Image from "next/image";

export const AuthHeader = () => {
  return (
    <header className="py-6 w-full z-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group w-fit">
          <div className="relative h-9 w-9 transition-transform group-hover:scale-105">
            <Image
              src={"/brand.png"}
              fill
              className="object-contain"
              alt="Wisdom Abacus"
            />
          </div>
          <span className="text-xl font-display font-bold text-slate-900 tracking-tight">
            Wisdom Abacus
          </span>
        </Link>
      </div>
    </header>
  );
};