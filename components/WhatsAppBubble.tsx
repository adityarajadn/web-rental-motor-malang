"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function WhatsAppBubble() {
  const pathname = usePathname();

  // Jangan tampilkan bubble WA di halaman admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Nomor admin MotoRent Malang (contoh format internasional tanpa +)
  const phoneNumber = "6285536952006";
  const defaultMessage = encodeURIComponent(
    "Halo admin MotoRent, saya ingin bertanya seputar penyewaan motor.",
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 group animate-fade-in"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle size={28} />

      {/* Tooltip (hanya muncul saat dihover di desktop) */}
      <span className="absolute right-16 bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Butuh Bantuan? Chat Kami!
      </span>

      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full border-2 border-[#25D366] opacity-0 animate-ping"></span>
    </a>
  );
}
