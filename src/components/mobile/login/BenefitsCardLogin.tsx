import Image from 'next/image';
export function BenefitsCardLogin() {
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
    <div
      className="rounded-2xl border border-border-stroke-regular py-5 px-3 bg-cover bg-center"
      style={{ backgroundImage: "url('/benifits.jpg')" }}
    >
      <div className="p-5 bg-white bg-opacity-70 rounded-2xl backdrop-blur-[8px]">
        <h3 className="text-lg font-semibold mb-5">What you get?</h3>
        <ul className="space-y-[10px]">
          {items.map((t, i) => (
            <li key={i} className="flex items-center gap-3 text-sm font-medium">
              <Image src="/check.svg" alt="check icon" width={15} height={15} />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
