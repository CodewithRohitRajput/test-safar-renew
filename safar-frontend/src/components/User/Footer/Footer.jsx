"use client";
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { FiMail, FiPhone, FiGlobe } from "react-icons/fi";
import Image from "next/image";
import Logo from "@/_assets/svgs/logo/Safar Wanderlust (1).png";
import Skyline from "@/_assets/footer/skyline.png";
import Skylinem from "@/_assets/footer/skylinem.png";
import Link from "next/link";

// const partners = [
//   { id: 1, name: "Tanishq Holidays", className: "text-orange-500" },
//   { id: 2, name: "TravaClan", className: "text-gray-100" },
//   { id: 3, name: "Kabila Camp", className: "text-gray-300" },
//   { id: 4, name: "MakeMyTrip", className: "text-red-500" },
//   { id: 5, name: "Trekzy.in", className: "text-blue-500" },
// ];

const Footer = () => {
  return (
    <>
      <footer className="hidden md:block bg-[#2d2d2d] text-white">
        <div className="mx-auto max-w-6xl px-6 pt-14 pb-10">
          {" "}
          {/* increased spacing */}
          {/* Top row: Brand + 3 columns */}
          <div className="grid grid-cols-12 gap-16">
            {/* Brand + address */}
            <div className="col-span-5">
              <div className="flex items-start gap-4">
                <Image
                  src={Logo}
                  alt="Safar Wanderlust"
                  className="w-[70px] h-[100px] object-contain shrink-0"
                />
                <div>
                  <div className="text-3xl font-semibold leading-none">
                    <span className="text-[#ff7a00]">Safar</span> Wanderlust
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/85">
                    5th Floor, behind C21 Mall, Behind C21 Mall, Vijay Nagar,
                    Scheme 54 PU4, Indore, Madhya Pradesh 452010
                  </p>
                </div>
              </div>
            </div>

            {/* Company */}
            {/* <div className="col-span-2">
              <div className="font-semibold mb-3">Company</div>
              <ul className="space-y-2 text-sm text-white/90">
                <li>
                  <a href="/about" className="hover:underline">
                    About us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:underline">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="/careers" className="hover:underline">
                    Career With us
                  </a>
                </li>
                <li>
                  <a href="/payment-policy" className="hover:underline">
                    Payment Policy
                  </a>
                </li>
                <li>
                  <a href="/gift-cards" className="hover:underline">
                    Travel Gift Cards
                  </a>
                </li>
              </ul>
            </div> */}

            {/* Tours */}
            <div className="col-span-2">
              <div className="font-semibold mb-3">Tours</div>
              <ul className="space-y-2 text-sm text-white/90">
                <li>
                  <a href="/explore/ladakh" className="hover:underline">
                    Manali Tours
                  </a>
                </li>
                <li>
                  <a
                    href="/explore/monsoon-special-trips"
                    className="hover:underline"
                  >
                    Winter Tours
                  </a>
                </li>
                <li>
                  <a href="/explore/aa" className="hover:underline">
                    Internationnal Tours
                  </a>
                </li>
                <li>
                  <a href="/explore/himachal" className="hover:underline">
                    Off-beat Tours
                  </a>
                </li>
                <li>
                  <a
                    href="/explore/uttarakhand-trips"
                    className="hover:underline"
                  >
                    Weekend Tours
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact us */}
            <div className="col-span-3">
              <div className="font-semibold mb-3">Contact us</div>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-center gap-2">
                  <FiMail className="opacity-90" />
                  <a
                    href="mailto:safarwanderlust@gmail.com"
                    className="hover:underline"
                  >
                    safarwanderlust@gmail.com
                  </a>
                </li>

                <li className="flex items-center gap-2">
                  <FiGlobe className="opacity-90" />
                  <a
                    href="https://safarwanderlust.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    safarwanderlust.com
                  </a>
                </li>

                <li className="flex items-center gap-2">
                  <FiPhone className="opacity-90" />
                  <a href="tel:+917999131020" className="hover:underline">
                    +91 7999131020
                  </a>
                </li>

                <li className="flex items-center gap-2">
                  <FiPhone className="opacity-90" />
                  <a href="tel:+917067632820" className="hover:underline">
                    +91 7067632820
                  </a>
                </li>

                <li className="flex items-center gap-2">
                  <FiPhone className="opacity-90" />
                  <a href="tel:+917581815249" className="hover:underline">
                    +91 7581815249
                  </a>
                </li>
              </ul>
            </div>

            {/* Empty spacer */}
          {/* <div className="col-span-1"></div> */}

            {/* Stay In Touch */}
            <div className="col-span-2">
              <div className="flex flex-col items-start gap-2">
                <div className="text-2xl font-semibold whitespace-nowrap">
                  Stay In Touch
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition">
                  <a
                    href="https://www.instagram.com/safar_wanderlust/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-md bg-white flex items-center justify-center text-black hover:bg-gray-200 transition"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/safar-wanderlust/posts/?feedView=all"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-md bg-white flex items-center justify-center text-black hover:bg-gray-200 transition"
                  >
                    <FaLinkedinIn />
                  </a>
                  <a
                    href="https://wa.me/918818931020"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-md bg-white flex items-center justify-center text-black hover:bg-gray-200 transition"
                  >
                    <FaWhatsapp />
                  </a>
                  <a
                    href="https://www.youtube.com/@SafarWanderlust"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-md bg-white flex items-center justify-center text-black hover:bg-gray-200 transition"
                  >
                    <FaYoutube />
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Partners + Social row (stacked titles above) */}
          <div className="mt-14">
            <div className="flex flex-col md:flex-row md:items-start gap-10">
              {/* Travel Partners */}
              <div className="flex-1">
                {/* <div className="text-3xl font-semibold mb-1">
                  Travel Partners
                </div> */}
                {/* <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                  {partners.map((p) => (
                    <span
                      key={p.id}
                      className={`text-xl font-semibold ${p.className}`}
                    >
                      {p.name}
                    </span>
                  ))}
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Skyline strip image at the very bottom */}
        {/* <div className="w-full">
          <Image
            src={Skyline}
            alt="City skyline"
            className="w-full h-auto object-cover"
            priority
          />
        </div> */}

        {/* Legal bar */}
        <div className="bg-[#2d2d2d]">
          <div className="mx-auto max-w-6xl px-6 py-6 text-center">
            {" "}
            {/* more spacing */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/85">
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>
              <a href="/term_and_conditions" className="hover:underline">
                Terms and Condition
              </a>
              <a href="/refunds" className="hover:underline">
                Sales and Refund
              </a>
              <a href="/legal" className="hover:underline">
                Legal
              </a>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white-600 hover:underline transition-colors"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Footer (unchanged) */}
      <footer className="md:hidden bg-[#262727] text-white">
        <div className="px-5 pt-7 pb-5">
          {/* Row 1: Logo + Text | Tours & Company */}
          <div className="flex gap-4">
            {/* Left: Logo + Brand */}
            <div className="w-1/2">
              <div className="flex items-center gap-2">
                {" "}
                {/* Changed to items-center for better alignment */}
                <Image
                  src={Logo}
                  alt="Safar Wanderlust"
                  className="w-10 h-14 object-contain shrink-0"
                />
                <div className="leading-none">
                  {" "}
                  {/* Changed to leading-none */}
                  <div className="text-lg font-semibold">
                    {" "}
                    {/* Adjusted size */}
                    <span className="text-[#ff7a00]">Safar</span> Wanderlust
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[10px] leading-4 text-white/90">
                {" "}
                {/* Smaller text */}
                Safar Wonderlust is your gateway to unforgettable journeys. We
                craft personalized travel experiences that blend adventure,
                culture, and comfort—turning every trip into a story worth
                telling.
              </p>
            </div>

            {/* Right: Tours & Company side-by-side */}
            <div className="w-1/2 flex justify-start gap-x-8">
              <div className="min-w-[80px] ml-12">
                <div className="font-semibold mb-1 text-[12px]">Tours</div>
                <ul className="space-y-0.5 text-[10px]">
                  <li>
                    <a
                      href="/explore/ladakh"
                      className="hover:underline"
                    >
                      Manali Tours
                    </a>
                  </li>
                  <li>
                    <a href="/explore/monsoon-special-trips" className="hover:underline">
                      Winter Tours
                    </a>
                  </li>
                  <li>
                    <a href="/explore/aa" className="hover:underline">
                      International Tours
                    </a>
                  </li>
                  <li>
                    <a href="/explore/aa" className="hover:underline">
                      Off-Beat Tours
                    </a>
                  </li>
                  <li>
                    <a
                      href="/explore/uttarakhand-trips"
                      className="hover:underline"
                    >
                      Weekend Tours
                    </a>
                  </li>
                </ul>
              </div>
              {/* <div className="min-w-[80px] -ml-4">
                <div className="font-semibold mb-1 text-[12px]">Company</div>
                <ul className="space-y-0.5 text-[10px]">
                  <li>
                    <a href="/about" className="hover:underline">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="hover:underline">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="/careers" className="hover:underline">
                      Career With Us
                    </a>
                  </li>
                  <li>
                    <a href="/payment-policy" className="hover:underline">
                      Payment Policy
                    </a>
                  </li>
                  <li>
                    <a href="/gift-cards" className="hover:underline">
                      Travel Gift Cards
                    </a>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>

          {/* Row 2: Big center title + partners in one line */}
          <div className="mt-5 text-center">
            <div className="text-2xl font-semibold">
              <span className="text-[#ff7a00]">Safar</span> Wanderlust
            </div>
          </div>
          {/* <div className="mt-2 flex flex-wrap items-center justify-between text-[10px] font-semibold">
            {partners.map((p) => (
              <span key={p.id} className={p.className}>
                {p.name}
              </span>
            ))}
          </div> */}

          {/* Row 3: Address */}
          <p className="mt-3 text-center text-[10px] leading-4 text-white/90">
            5th Floor, Behind C21 Mall, Vijay Nagar,
            <br />
            Scheme 54 PU4, Indore, Madhya Pradesh 452010
          </p>

          {/* Row 4: Contact Info in one line */}
          <div className="mt-3 grid grid-cols-2 gap-1 text-[10px]">
            <div className="flex items-center justify-center gap-1">
              <FiMail className="opacity-90 text-xs" />
              <a
                href="mailto:safarwanderlust@gmail.com"
                className="hover:underline"
              >
                safarwanderlust@gmail.com
              </a>
            </div>

            <div className="flex items-center justify-center gap-1">
              <FiGlobe className="opacity-90 text-xs" />
              <a
                href="https://safarwanderlust.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Safarwanderlust.com
              </a>
            </div>
          </div>

          {/* Social pill */}
          <div className="mt-3 flex justify-center">
            <div className="rounded-full bg-white/10 px-3 py-1.5 flex items-center gap-2">
              {" "}
              {/* Reduced gap */}
              <a
                href="https://www.youtube.com/@SafarWanderlust"
                className="h-6 w-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <FaYoutube className="text-xs" />
              </a>
              <a
                href="https://www.instagram.com/safar_wanderlust/"
                className="h-6 w-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <FaInstagram className="text-xs" />
              </a>
              <a
                href="https://www.linkedin.com/company/safar-wanderlust/posts/?feedView=all"
                className="h-6 w-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <FaLinkedinIn className="text-xs" />
              </a>
              <a
                href="https://wa.me/918818931020"
                className="h-6 w-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <FaWhatsapp className="text-xs" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-3 mb-3 grid grid-cols-3 gap-1 text-[11px]">
          <div className="flex items-center justify-center gap-1">
            <FiPhone className="opacity-90 text-xs" />
            <a href="tel:+917999131020" className="hover:underline">
              +91 7999131020
            </a>
          </div>

          <div className="flex items-center justify-center gap-1">
            <FiPhone className="opacity-90 text-xs" />
            <a href="tel:+917067632820" className="hover:underline">
              +91 7067632820
            </a>
          </div>

          <div className="flex items-center justify-center gap-1">
            <FiPhone className="opacity-90 text-xs" />
            <a href="tel:+917581815249" className="hover:underline">
              +91 7581815249
            </a>
          </div>
        </div>

        {/* Skyline image */}
        {/* <div className="w-full">
          <Image
            src={Skylinem}
            alt="City skyline"
            className="w-full h-auto object-cover"
            priority
          />
        </div> */}

        {/* Legal links in a single row */}
        <div className="px-4 py-2 bg-[#262727]">
          <div className="flex items-center justify-between text-[9px] text-white/85 whitespace-nowrap">
            {" "}
            {/* Smaller text */}
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/term_and_conditions" className="hover:underline">
              Terms and Condition
            </a>
            <a href="/refunds" className="hover:underline">
              Sales and Refund
            </a>
            <a href="/legal" className="hover:underline">
              Legal
            </a>
            <a href="/sitemap" className="hover:underline">
              Site Map
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
