import React from 'react';

export const metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Electronic Store for support, inquiries, or feedback.',
};

export default function ContactUsPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p>If you have any questions or need support, please contact us at:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Email: support@cyber.com</li>
        <li>Phone: (123) 456-7890</li>
        <li>Address: 123 Main Street, City, Country</li>
      </ul>
    </main>
  );
}
