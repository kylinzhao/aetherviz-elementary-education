import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score?: number;
  timeSpent: number; // 分钟
  lastAccessed: string; // ISO 时间戳
  tasksCompleted: string[]; // 已完成的任务 ID
}

interface ProgressState {
  // 状态
  lessons: Record<string, LessonProgress>;
  currentLesson: string | null;
  totalStudyTime: number; // 总学习时间(分钟)

  // 动作
  startLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string, score?: number) => void;
  updateProgress: (lessonId: string, timeSpent: number) => void;
  completeTask: (lessonId: string, taskId: string) => void;
  resetProgress: (lessonId?: string) => void;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // 初始状态
      lessons: {},
      currentLesson: null,
      totalStudyTime: 0,

      // 开始课程
      startLesson: (lessonId) =>
        set((state) => ({
          currentLesson: lessonId,
          lessons: {
            ...state.lessons,
            [lessonId]: {
              lessonId,
              completed: false,
              timeSpent: 0,
              lastAccessed: new Date().toISOString(),
              tasksCompleted: state.lessons[lessonId]?.tasksCompleted || [],
            },
          },
        })),

      // 完成课程
      completeLesson: (lessonId, score) =>
        set((state) => ({
          lessons: {
            ...state.lessons,
            [lessonId]: {
              ...state.lessons[lessonId],
              completed: true,
              score,
              lastAccessed: new Date().toISOString(),
            },
          },
        })),

      // 更新学习进度
      updateProgress: (lessonId, timeSpent) =>
        set((state) => ({
          lessons: {
            ...state.lessons,
            [lessonId]: {
              ...state.lessons[lessonId],
              timeSpent: state.lessons[lessonId]?.timeSpent + timeSpent || timeSpent,
              lastAccessed: new Date().toISOString(),
            },
          },
          totalStudyTime: state.totalStudyTime + timeSpent,
        })),

      // 完成任务
      completeTask: (lessonId, taskId) =>
        set((state) => {
          const currentLesson = state.lessons[lessonId];
          if (!currentLesson) return state;

          const tasksCompleted = currentLesson.tasksCompleted.includes(taskId)
            ? currentLesson.tasksCompleted
            : [...currentLesson.tasksCompleted, taskId];

          return {
            lessons: {
              ...state.lessons,
              [lessonId]: {
                ...currentLesson,
                tasksCompleted,
                lastAccessed: new Date().toISOString(),
              },
            },
          };
        }),

      // 重置进度
      resetProgress: (lessonId) =>
        set((state) => {
          if (lessonId) {
            const { [lessonId]: removed, ...rest } = state.lessons;
            return {
              lessons: rest,
              currentLesson: state.currentLesson === lessonId ? null : state.currentLesson,
            };
          }
          return { lessons: {}, currentLesson: null, totalStudyTime: 0 };
        }),

      // 获取课程进度
      getLessonProgress: (lessonId) => {
        return get().lessons[lessonId];
      },
    }),
    {
      name: 'aetherviz-progress',
      partialize: (state) => ({
        lessons: state.lessons,
        totalStudyTime: state.totalStudyTime,
      }),
    }
  )
);
