'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/905555555555" // Buraya gerçek numara eklenecek
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 group flex items-center justify-center"
      aria-label="WhatsApp İletişim"
    >
      <MessageCircle size={28} className="text-white" />
      {/* Tooltip on hover */}
      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-medium py-2 px-4 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Bize Ulaşın
      </span>
    </Link>
  );
}
