import Image from 'next/image';

export function MobileThumbnails() {
  const images = [
    '/thumbnail1.jpg',
    '/thumbnail2.jpg',
    '/thumbnail3.jpg',
    '/thumbnail4.jpg',
    '/thumbnail5.jpg',
    '/thumbnail6.jpg',
  ];
  return (
    <div className="flex items-center justify-start gap-2 overflow-x-auto">
      {images.map((src, i) => (
        <div
          key={i}
          className="w-14 h-14 rounded-[15px] p-1 overflow-hidden border border-black bg-white"
        >
          <Image
            src={src}
            alt={`Preview ${i + 1}`}
            width={52}
            height={52}
            className="object-cover h-full w-full rounded-xl"
          />
        </div>
      ))}
    </div>
  );
}
