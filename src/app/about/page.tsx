import React from 'react';

export const metadata = {
  title: 'About Us',
  description:
    'Learn more about Electronic Store, our mission, and our core values.',
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p>
        Welcome to our electronic store! We offer a wide range of the latest
        electronic products, from smartphones to laptops and more. Our mission
        is to provide quality products and excellent customer service.
      </p>
    </main>
  );
}
