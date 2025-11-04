import Image from 'next/image';

export function Benefits2() {
  const items = [
    'Learn directly from top creators & experts',
    'Join live sessions, workshops & Q&As',
    'Access exclusive courses, guides & tools',
    'Connect with like-minded learners & pros',
    'Be part of focused, high-value communities',
    'One account, unlimited communities',
    'Clean and distraction-free learning space',
  ];

  return (
    <div className="py-[40px] px-[24px] bg-white/70 backdrop-blur-[16px] rounded-[20px]">
      <h3 className="text-lg font-semibold text-[#000000] mb-5">
        What you get?
      </h3>
      <ul className="space-y-2 text-sm font-medium text-[#000000]">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <Image src="/Check.svg" alt="check icon" width={16} height={16} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
