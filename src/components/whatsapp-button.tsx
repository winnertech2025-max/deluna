"use client";

import { FaWhatsapp } from "react-icons/fa";

export function WhatsappButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "84949450800";
  const message = "Hello Deluna Studio, I need help with a personalized order.";
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Deluna Studio on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl ring-4 ring-white transition hover:-translate-y-1 hover:bg-[#1ebe5d] sm:bottom-6 sm:right-6"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
