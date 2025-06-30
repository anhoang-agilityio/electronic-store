import Image from 'next/image';

export default function AirpodsMax() {
  return (
    <section className="w-full h-full bg-muted">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:p-0 sm:pr-12 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-12">
        {/* Image */}
        <div className="size-50 sm:w-[104px] sm:h-[272px] relative">
          <Image
            src="/airpods-max.png"
            alt="AirPods Max Banner"
            fill={true}
            className="object-contain sm:object-cover sm:object-right"
          />
        </div>
        {/* Title + Description */}
        <div className="flex flex-col gap-4 max-w-xl text-center sm:text-left">
          <h1 className="text-foreground text-4xl sm:text-3xl">
            <span className="font-light">Apple AirPods </span>
            <span className="font-medium">Max</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-sm font-medium">
            Computational audio. Listen, it&apos;s powerful
          </p>
        </div>
      </div>
    </section>
  );
}
