import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { useStore } from '../store/useStore';
import TaskNode from './TaskNode';
import TaskForm from './TaskForm';

export default function TaskTree({ tasks, allTasks }) {
    const { addTask, reorderTasks } = useStore();
    const [addingTask, setAddingTask] = useState(false);

    // Require 8px movement before drag starts — prevents accidental drags on click
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = tasks.findIndex(t => t.id === active.id);
        const newIndex = tasks.findIndex(t => t.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        reorderTasks(arrayMove(tasks, oldIndex, newIndex));
    }

    function handleAddTask(data) {
        addTask(data);
        setAddingTask(false);
    }

    // Progress stats — count only root tasks for the bar
    const total = allTasks.length;
    const done  = allTasks.filter(t => t.status === 'done').length;
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
        <div className="max-w-3xl mx-auto">

            {/* ── Progress bar ── */}
            {total > 0 && (
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-muted mb-1.5">
                        <span>{done} of {total} tasks done</span>
                        <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>
            )}

            {/* ── Task list with drag and drop ── */}
            {tasks.length > 0 ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={tasks.map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {tasks.map(task => (
                            <TaskNode
                                key={task.id}
                                task={task}
                                depth={0}
                                allTasks={allTasks}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            ) : (
                <div className="text-center py-16 border border-dashed border-border rounded-2xl">
                    <p className="text-muted text-sm">No tasks yet.</p>
                    <p className="text-muted/50 text-xs mt-1">
                        Add your first task below.
                    </p>
                </div>
            )}

            {/* ── Add task ── */}
            <div className="mt-4">
                {addingTask ? (
                    <TaskForm
                        allTasks={allTasks}
                        onSave={handleAddTask}
                        onCancel={() => setAddingTask(false)}
                    />
                ) : (
                    <button
                        onClick={() => setAddingTask(true)}
                        className="w-full py-2.5 border border-dashed border-border rounded-xl text-sm text-muted hover:text-accent hover:border-accent transition-all"
                    >
                        + Add task
                    </button>
                )}
            </div>

        </div>
    );
}