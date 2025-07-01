import Image from 'next/image';
import Link from 'next/link';

const navSections = [
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

const socials = [
  { icon: '/twitter.svg', label: 'Twitter', href: '#' },
  { icon: '/facebook.svg', label: 'Facebook', href: '#' },
  { icon: '/tiktok.svg', label: 'Tiktok', href: '#' },
  { icon: '/instagram.svg', label: 'Instagram', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-primary">
      <div className="max-w-screen-xl mx-auto px-4 py-12 md:px-10 md:py-26 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] justify-between gap-6 text-center md:text-left">
        {/* Logo + Description */}
        <div className="flex flex-col gap-6 items-center md:items-start md:max-w-100">
          <Image src="/logo-light.svg" alt="Logo" width={65} height={23} />
          <p className="text-muted-foreground text-sm font-medium">
            We are a residential interior design firm located in Portland. Our
            boutique-studio offers more than just a place to shop.
          </p>
        </div>

        {/* Navigation */}
        {navSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <span className="text-primary-foreground font-semibold text-base mb-2">
              {section.title}
            </span>
            {section.items.map((item) => (
              <span
                key={item}
                className="text-muted-foreground text-sm/8 cursor-pointer hover:underline"
              >
                {item}
              </span>
            ))}
          </div>
        ))}

        {/* Social Icons */}
        <div className="flex justify-center md:justify-start gap-6 mt-4 md:mt-0">
          {socials.map(({ icon, label, href }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={icon} alt={label} width={24} height={24} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
