import { Facebook, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

// Custom TikTok SVG icon as a React component
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width={props.width ?? 24}
    height={props.height ?? 24}
    {...props}
  >
    <path d="M17.25 2A5.25 5.25 0 0 0 22.5 7.25v1.5a.75.75 0 0 1-.75.75 5.25 5.25 0 0 1-4.5-2.5v7.5a6.75 6.75 0 1 1-6.75-6.75h1.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-1.5a3.75 3.75 0 1 0 3.75 3.75V2.75A.75.75 0 0 1 17.25 2Z" />
  </svg>
);

const NAV_SECTIONS = [
  {
    title: 'Services',
    items: [
      'Bonus program',
      'Gift cards',
      'Credit and payment',
      'Service contracts',
      'Non-cash account',
      'Payment',
    ],
  },
  {
    title: 'Assistance to the buyer',
    items: [
      'Find an order',
      'Terms of delivery',
      'Exchange and return of goods',
      'Guarantee',
      'Frequently asked questions',
      'Terms of use of the site',
    ],
  },
];

const SOCIALS = [
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: TikTokIcon, label: 'Tiktok', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
];

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white pt-16 pb-8 px-4 md:px-0">
      <div className="max-w-screen-xl mx-auto flex flex-col gap-8 md:gap-6">
        {/* Info Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-[113px] px-0 md:px-10">
          {/* Logo + Text */}
          <div className="flex flex-col gap-6 max-w-[384px]">
            <div className="w-[65px] h-[23px] relative">
              <Image
                src="/logo.svg"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-[#CFCFCF] text-base leading-6">
              We are a residential interior design firm located in Portland. Our
              boutique-studio offers more than
            </p>
          </div>
          {/* Navigation */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-8 w-full md:w-auto">
            {NAV_SECTIONS.map((section) => (
              <div
                key={section.title}
                className="flex flex-col gap-2 min-w-[184px] md:min-w-[295px]"
              >
                <span className="font-semibold text-white text-base mb-2">
                  {section.title}
                </span>
                {section.items.map((item) => (
                  <span
                    key={item}
                    className="text-[#CFCFCF] text-base leading-8 cursor-pointer hover:underline"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Social Icons */}
        <div className="flex justify-center md:justify-start gap-[15px] mt-4 md:mt-0">
          {SOCIALS.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon
                size={24}
                className="text-white group-hover:text-[#CFCFCF] transition-colors duration-200"
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
