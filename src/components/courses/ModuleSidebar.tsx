// ModuleSidebar.tsx
'use client';

import React, {
  FC,
  useEffect,
  useMemo,
  useState,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import { Card, CardContent } from 'src/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { Separator } from '../ui/separator';
import CustomShadcnCheckbox from '../CustomShadcnCheckbox';

type Lesson = {
  id: string;
  title: string;
  completed?: boolean;
};

type Module = {
  id: string;
  label: string;
  title: string;
  completed?: boolean;
  open?: boolean;
  lessons?: Lesson[];
};

type ModuleSidebarProps = {
  title?: string;
  author?: string;
  total?: number;
  modules?: Module[];
  openModuleId?: string | null;
  onOpenChange?: (id: string | null) => void;
  selectedLessonId?: string | null;
  onLessonClick?: (moduleId: string, lessonId: string) => void;
};

const DEFAULT_TOTAL = 6;

const defaultModules: Module[] = [
  {
    id: 'm1',
    label: 'Module 1',
    title: 'Introduction to AI',
    completed: true,
    lessons: [
      { id: 'm1l1', title: 'Welcome & Setup', completed: true },
      { id: 'm1l2', title: 'What is AI?', completed: true },
    ],
  },
  {
    id: 'm2',
    label: 'Module 2',
    title: 'Categories of AI',
    completed: true,
    lessons: [{ id: 'm2l1', title: 'Narrow vs General AI', completed: true }],
  },
  {
    id: 'm3',
    label: 'Module 3',
    title: 'Types of AI',
    completed: false,
    open: true,
    lessons: [
      { id: 'm3l1', title: 'Generative AI basics', completed: true },
      {
        id: 'm3l2',
        title: 'Conversational AI (World of bots)',
        completed: true,
      },
      { id: 'm3l3', title: "LLM's & Training", completed: false },
    ],
  },
  {
    id: 'm4',
    label: 'Module 4',
    title: 'Automation Tools',
    completed: false,
    lessons: [{ id: 'm4l1', title: 'Tooling overview', completed: false }],
  },
  {
    id: 'm5',
    label: 'Module 5',
    title: 'Portfolio Site with AI',
    completed: false,
    lessons: [{ id: 'm5l1', title: 'Project setup', completed: false }],
  },
  {
    id: 'm6',
    label: 'Module 6',
    title: 'Generating leads with Automation',
    completed: false,
    lessons: [{ id: 'm6l1', title: 'Lead pipelines', completed: false }],
  },
];

export const ModuleSidebar: FC<ModuleSidebarProps> = ({
  title = 'Automation on Autopilot',
  author = 'Paula Agard',
  total = DEFAULT_TOTAL,
  modules = defaultModules,
  openModuleId,
  onOpenChange,
  selectedLessonId = null,
  onLessonClick,
}) => {
  // deep clone incoming modules to avoid mutating props
  const initial = useMemo(
    () =>
      (modules ?? defaultModules).map((m) => ({
        ...m,
        lessons: m.lessons ? m.lessons.map((l) => ({ ...l })) : [],
      })),
    [modules],
  );

  const [modulesState, setModulesState] = useState<Module[]>(initial);
  // keep local state in sync when parent updates `modules`
  useEffect(() => {
    setModulesState(initial);
  }, [initial]);
  const [internalOpenId, setInternalOpenId] = useState<string | null>(() => {
    const openModule = initial.find((m) => m.open);
    return openModule ? openModule.id : null;
  });

  const isControlled = typeof openModuleId !== 'undefined';
  const openId = isControlled ? openModuleId : internalOpenId;

  const completedCount = modulesState.filter((m) => !!m.completed).length;
  // percentage is currently unused in UI; computed on demand if needed

  const toggleModuleOpen = (id: string) => {
    const next = openId === id ? null : id;
    if (onOpenChange) onOpenChange(next);
    if (!isControlled) setInternalOpenId(next);
  };

  const onToggleModuleCompleted = (moduleId: string, checked: boolean) => {
    setModulesState((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              completed: checked,
              lessons:
                m.lessons?.map((ls) => ({ ...ls, completed: checked })) ?? [],
            }
          : m,
      ),
    );
  };

  const onToggleLessonCompleted = (
    moduleId: string,
    lessonId: string,
    checked: boolean,
  ) => {
    setModulesState((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;

        const lessons =
          m.lessons?.map((ls) =>
            ls.id === lessonId ? { ...ls, completed: checked } : ls,
          ) ?? [];
        const allLessonsDone =
          lessons.length > 0
            ? lessons.every((l) => !!l.completed)
            : !!m.completed;

        return {
          ...m,
          lessons,
          completed: allLessonsDone,
        };
      }),
    );
  };

  const onHeaderKeyDown = (e: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleModuleOpen(id);
    }
  };

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  return (
    <div className="max-w-[390px] w-full">
      <div className="text-sm text-[#787878] font-semibold w-full lg:w-auto mb-[20px]">
        All Courses &gt; My Courses &gt;{' '}
        <span className="text-black font-bold">{title}</span>
      </div>

      <aside>
        <h1 className="text-[24px] font-semibold text-[#000000] mb-1">
          {title}
        </h1>
        <p className="text-sm font-medium text-[#0A5DBC] mb-[30px] mt-1">
          <span className="text-[#787878]">By,</span> {author}
        </p>

        <Card className="rounded-[20px] shadow-none border bg-transparent p-4 border-[#ECECEC]">
          <CardContent className="p-0">
            <div className="bg-white border border-[#ECECEC] rounded-[20px] p-5">
              <div className="text-xs font-medium text-[#000000] mb-2">
                {completedCount}/{total} Completed
              </div>

              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={completedCount}
                className="flex items-center justify-between flex-wrap gap-2"
              >
                {Array.from({ length: total }).map((_, i) => {
                  const filled = i < completedCount;
                  return (
                    <span
                      key={i}
                      aria-hidden
                      className={`rounded-[10px] transition-colors duration-200
                                                        ${filled ? 'bg-[#13B184]' : 'bg-[#E6E6E6]'}`}
                      style={{ width: 44, height: 8 }}
                    />
                  );
                })}
              </div>
            </div>

            <Separator className="my-4 bg-[#ECECEC]" />

            {/* Module list */}
            <div className="space-y-4">
              {modulesState.map((m) => {
                const isOpen = openId === m.id;

                return (
                  <div
                    key={m.id}
                    className="border border-[#ECECEC] rounded-[20px] overflow-hidden transition-shadow"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      onClick={() => toggleModuleOpen(m.id)}
                      onKeyDown={(e) =>
                        onHeaderKeyDown(
                          e as KeyboardEvent<HTMLDivElement>,
                          m.id,
                        )
                      }
                      className={`px-5 py-3 w-full flex items-center justify-between gap-3 text-left cursor-pointer ${isOpen ? 'bg-white' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          onClick={(e) => stopPropagation(e)}
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          <div
                            onClick={(e) => stopPropagation(e)}
                            className="flex items-center justify-center"
                            style={{ width: 24, height: 24 }}
                          >
                            <CustomShadcnCheckbox
                              checked={!!m.completed}
                              onCheckedChange={(val) =>
                                onToggleModuleCompleted(m.id, val)
                              }
                              size={24}
                              bgChecked="#10B981"
                              bgUnchecked="transparent"
                              tickColorChecked="#FFFFFF"
                              outlineColorUnchecked="rgba(0,0,0,0.12)"
                              ariaLabel={`Mark ${m.title} complete`}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-[#787878]">
                            {m.label}
                          </span>
                          <span className="text-sm font-medium text-[#000000]">
                            {m.title}
                          </span>
                        </div>
                      </div>

                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-gray-600' : 'text-gray-400'
                        }`}
                      />
                    </div>

                    <div
                      className={`px-5 transition-[max-height,padding] duration-300 ease-in-out overflow-hidden border-t ${
                        isOpen ? 'py-4' : 'py-0'
                      }`}
                      style={{ maxHeight: isOpen ? 500 : 0 }}
                    >
                      {m.lessons?.length ? (
                        <ul className="space-y-3">
                          {m.lessons.map((lesson) => (
                            <li
                              key={lesson.id}
                              className="flex items-center gap-3"
                            >
                              <div
                                onClick={(e) => stopPropagation(e)}
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                              >
                                <CustomShadcnCheckbox
                                  checked={!!lesson.completed}
                                  onCheckedChange={(val) =>
                                    onToggleLessonCompleted(
                                      m.id,
                                      lesson.id,
                                      val,
                                    )
                                  }
                                  size={20}
                                  bgChecked="#10B981"
                                  bgUnchecked="transparent"
                                  tickColorChecked="#FFFFFF"
                                  outlineColorUnchecked="rgba(0,0,0,0.12)"
                                  ariaLabel={`Mark ${lesson.title} complete`}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  stopPropagation(e);
                                  onLessonClick &&
                                    onLessonClick(m.id, lesson.id);
                                }}
                                className={`text-left focus:outline-none ${
                                  selectedLessonId === lesson.id
                                    ? 'text-sm font-medium'
                                    : lesson.completed
                                      ? 'text-sm font-medium text-[#000000]'
                                      : 'text-sm font-medium text-[#000000]'
                                }`}
                              >
                                {lesson.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-gray-500">No lessons</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
};

export default ModuleSidebar;
