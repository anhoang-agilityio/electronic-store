import Image from 'next/image';

export function VisionProBanner() {
  return (
    <section className="w-full h-full bg-primary/90">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-10 sm:pl-0 sm:pr-12 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
        {/* Image */}
        <div className="w-[325px] h-[192px] sm:w-[136px] sm:h-[190px] relative">
          <Image
            src="/vision-pro.png"
            alt="Vision Pro Banner"
            fill={true}
            className="object-contain sm:object-cover sm:object-right"
          />
        </div>
        {/* Title + Description */}
        <div className="flex flex-col gap-4 max-w-xl text-center sm:text-left">
          <h1 className="text-primary-foreground text-4xl sm:text-3xl">
            <span className="font-light">Vision </span>
            <span className="font-medium">Pro</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-sm font-medium">
            An immersive way to experience entertainment
          </p>
        </div>
      </div>
    </section>
  );
}
