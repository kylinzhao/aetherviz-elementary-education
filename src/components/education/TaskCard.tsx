import React, { useState } from 'react';

export interface Task {
  id: number;
  title: string;
  description: string;
  checkCondition: () => boolean;
  hint?: string;
}

interface TaskCardProps {
  title: string;
  tasks: Task[];
  onAllCompleted?: () => void;
}

export function TaskCard({ title, tasks, onAllCompleted }: TaskCardProps) {
  // 永久记录已完成的任务（一旦完成就永久标记）
  const [permanentCompleted, setPermanentCompleted] = useState<Set<number>>(new Set());

  // 检查任务完成状态
  React.useEffect(() => {
    const checkInterval = setInterval(() => {
      let hasNewCompletion = false;
      const newPermanentCompleted = new Set(permanentCompleted);

      tasks.forEach((task) => {
        // 只有任务条件满足 且 还没有被永久记录，才标记为完成
        if (task.checkCondition() && !permanentCompleted.has(task.id)) {
          newPermanentCompleted.add(task.id);
          hasNewCompletion = true;
        }
      });

      if (hasNewCompletion) {
        setPermanentCompleted(newPermanentCompleted);

        // 检查是否全部完成（只触发一次）
        if (newPermanentCompleted.size === tasks.length && onAllCompleted) {
          onAllCompleted();
        }
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, [tasks, permanentCompleted, onAllCompleted]);

  const allCompleted = permanentCompleted.size === tasks.length;

  return (
    <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-yellow-400 text-lg flex items-center gap-2">
          🎯 {title}
        </h3>
        <div className="text-sm text-white">
          {permanentCompleted.size} / {tasks.length}
        </div>
      </div>

      {/* 进度条 */}
      <div className="w-full bg-slate-700/50 rounded-full h-3 mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${(permanentCompleted.size / tasks.length) * 100}%` }}
        />
      </div>

      {/* 任务列表 */}
      <div className="space-y-2">
        {tasks.map((task, index) => {
          const isCompleted = permanentCompleted.has(task.id);
          const isNext = !isCompleted && (index === 0 || permanentCompleted.has(tasks[index - 1].id));

          return (
            <div
              key={task.id}
              className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                isCompleted
                  ? 'bg-green-500/20 border-green-500/50'
                  : isNext
                  ? 'bg-blue-500/10 border-blue-500/30 animate-pulse'
                  : 'bg-slate-800/30 border-slate-700/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* 状态图标 */}
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <span className="text-2xl">✅</span>
                  ) : isNext ? (
                    <span className="text-2xl animate-bounce">👉</span>
                  ) : (
                    <span className="text-2xl opacity-30">⬜</span>
                  )}
                </div>

                {/* 任务内容 */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isCompleted
                        ? 'text-green-300 line-through'
                        : isNext
                        ? 'text-white'
                        : 'text-slate-400'
                    }`}
                  >
                    {task.title}
                  </p>
                  {isCompleted && task.hint && (
                    <p className="text-xs text-green-400 mt-1">💡 {task.hint}</p>
                  )}
                  {!isCompleted && isNext && (
                    <p className="text-xs text-blue-300 mt-1">{task.description}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 全部完成提示 */}
      {allCompleted && (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-lg text-center">
          <p className="text-lg font-bold text-green-300">🎉 太棒了！所有任务完成！</p>
          <p className="text-sm text-green-400 mt-1">你真是个小天才！继续加油！</p>
        </div>
      )}
    </div>
  );
}
