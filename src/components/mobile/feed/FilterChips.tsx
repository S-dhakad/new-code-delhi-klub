'use client';

import React, { useEffect, useState } from 'react';
import AddSpace from 'src/components/mobile/modals/AddSpace';

type FilterChipsProps = {
  spaces?: string[];
  selectedSpace?: string;
  onSpaceSelect?: (space: string) => void;
  initialSelected?: string[];
  onChange?: (selected: string[]) => void;
  onAddSpace?: (name: string) => Promise<void> | void;
};

export default function FilterChips({
  spaces = [],
  selectedSpace,
  onSpaceSelect,
  initialSelected = [],
  onChange,
  onAddSpace,
}: FilterChipsProps) {
  // Use workspaces if provided, otherwise use default chips
  const chips =
    spaces.length > 0
      ? ['# All', ...spaces, '+ Add New']
      : ['All', 'Instructions', 'Intros', 'General', 'Q&A', 'Wins', 'Help'];

  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    onChange?.(selected);
  }, [selected, onChange]);

  const toggle = (tag: string) => {
    if (spaces.length > 0 && tag === '+ Add New') {
      setNewSpaceName('');
      setShowAddModal(true);
      return;
    }
    if (onSpaceSelect && spaces.length > 0) {
      // For workspace mode - pass the tag as-is with # prefix
      onSpaceSelect(tag);
    } else {
      // For tag filtering mode
      setSelected((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
      );
    }
  };

  return (
    <section className="px-4 pt-7 pb-4">
      <div
        className="chips-scroll flex gap-2 overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {chips.map((tag) => {
          const isAddNew = spaces.length > 0 && tag === '+ Add New';
          const isAllTag = tag === '# All';
          const isActive =
            spaces.length > 0
              ? isAddNew
                ? false
                : isAllTag
                  ? !selectedSpace ||
                    selectedSpace === '# All' ||
                    selectedSpace === 'All'
                  : selectedSpace === tag
              : selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={isActive}
              onClick={() => toggle(tag)}
              className={`whitespace-nowrap rounded-[10px] border px-3 py-2 text-sm font-medium transition-colors ${
                isAddNew
                  ? 'bg-primary text-white'
                  : isActive
                    ? 'bg-blue-50 text-primary border-primary'
                    : 'bg-white text-text-secondary border-border-stroke-regular'
              }`}
            >
              {spaces.length > 0 ? tag : `# ${tag}`}
            </button>
          );
        })}
      </div>
      <style jsx>{`
        .chips-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <AddSpace
            value={newSpaceName}
            onChange={setNewSpaceName}
            loading={saving}
            onSave={async () => {
              if (!newSpaceName.trim()) return;
              try {
                setSaving(true);
                await onAddSpace?.(newSpaceName.trim());
                setShowAddModal(false);
              } finally {
                setSaving(false);
              }
            }}
            onClose={() => setShowAddModal(false)}
          />
        </div>
      )}
    </section>
  );
}
