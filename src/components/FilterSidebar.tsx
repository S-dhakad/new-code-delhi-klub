// src/components/klub/FilterSidebar.tsx
'use client';

type FilterSidebarProps = {
  topics: string[];
  typeFilters: string[];
  selectedTopics: string[];
  selectedType: string;
  onTopicSelect: (topic: string) => void;
  onTypeSelect: (type: string) => void;
};

export default function FilterSidebar({
  topics,
  typeFilters,
  selectedTopics,
  selectedType,
  onTopicSelect,
  onTypeSelect,
}: FilterSidebarProps) {
  return (
    <aside
      className="rounded-[20px] p-8 border border-[#ECECEC]"
      style={{
        backgroundImage: "url('/wave.png')",
      }}
    >
      <div
        className="overflow-y-auto scrollbar-hide"
        style={{
          maxHeight: 'calc(100vh - 230px)',
        }}
      >
        {/* Topics */}
        <h3 className="text-base font-semibold text-black mb-[14px]">
          Select topics
        </h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => onTopicSelect(topic)}
              className={`rounded-[10px] border px-[10px] py-[6px] text-sm font-semibold transition ${
                selectedTopics.includes(topic)
                  ? 'bg-[#E6EFF8] text-[#0A5DBC] border-[#0A5DBC]'
                  : 'bg-white text-[#787878] border-[#ECECEC] '
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Type Filters */}
        <h3 className="text-base font-semibold text-black mb-[14px]">Type</h3>
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((type) => (
            <button
              key={type}
              onClick={() => onTypeSelect(type)}
              className={`rounded-[10px] border px-[10px] py-[6px] text-sm font-semibold transition ${
                selectedType === type
                  ? 'bg-[#E6EFF8] text-[#0A5DBC] border-[#0A5DBC]'
                  : 'bg-white text-[#787878] border-[#ECECEC]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
