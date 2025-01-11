import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

export function TopBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-300 z-50 border-b border-gray-200
          ${
            scrolled
              ? "bg-white/70 backdrop-blur-md h-12"
              : "bg-white/70 backdrop-blur-md h-24"
          }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 h-full flex items-center ${
            scrolled ? "justify-start" : "justify-center pt-8"
          }`}
        >
          {/* Logo section */}
          <div className="flex items-center space-x-2 overflow-hidden">
            <span
              className={`text-3xl bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent font-bold text-3xltransition-all duration-300
              ${scrolled ? "opacity-0 w-0" : "opacity-100 w-auto"}`}
            >
              Plantigo
            </span>
            <Leaf
              className={`h-6 w-6 text-emerald-500 flex-shrink-0 transition-transform duration-300
              ${scrolled ? "opacity-0 w-0" : ""}`}
            />
          </div>
        </div>
      </header>
    </>
  );
}
