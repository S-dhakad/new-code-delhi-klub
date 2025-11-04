import Image from 'next/image';

export function Thumbnails() {
  const images = [
    '/thumbnail1.jpg',
    '/thumbnail2.jpg',
    '/thumbnail3.jpg',
    '/thumbnail4.jpg',
    '/thumbnail5.jpg',
    '/thumbnail6.jpg',
  ];

  return (
    <div className="flex justify-center gap-2">
      {images.map((src, i) => (
        <div
          key={i}
          className="w-[60px] h-[60px] rounded-[10px] p-1 overflow-hidden border border-[#000000] flex-shrink-0"
        >
          <Image
            src={src}
            alt={`Preview ${i + 1}`}
            width={56}
            height={56}
            className="object-cover h-full w-full rounded-[10px]"
          />
        </div>
      ))}
    </div>
  );
}
