export function SubscribeBadge({
  type,
}: {
  type: 'signup' | 'login' | 'creator';
}) {
  const creator = type === 'creator';
  return (
    <button
      type="button"
      className={`py-2 px-[10px] border rounded-[10px] border-border-stroke-regular text-xs flex gap-[6px] items-center ${creator ? 'bg-[#4BD366]' : 'bg-[#EDD117]'} bg-opacity-10`}
    >
      <span
        className={`w-3 h-3 flex rounded-full ${creator ? 'bg-[#4BD366]' : 'bg-[#EDD117]'}`}
      ></span>
      <span className="font-medium">{creator ? 'Creator' : 'Subscriber'}</span>
    </button>
  );
}
