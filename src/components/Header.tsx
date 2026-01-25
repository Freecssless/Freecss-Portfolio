"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "#home", label: "Inicio" },
  { href: "#testimonials", label: "Clientes" },
  { href: "#videos", label: "Trabajos" },
  { href: "#contact", label: "Contacto" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="https://i.postimg.cc/KkMwCY9L/Grupo-3.png"
                alt="Freecss"
                className="w-10 h-10 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
            </div>
            <span className="text-primary font-heading font-semibold text-lg transition-all duration-300 group-hover:tracking-wider">
              Freecss!
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-gray-300 hover:text-primary transition-colors duration-300 text-sm font-medium group py-2"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-gray-300 hover:text-primary transition-colors p-2 hover:bg-card rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-card-border animate-fade-in-up">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 text-gray-300 hover:text-primary hover:bg-card/50 hover:pl-4 transition-all duration-300 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
