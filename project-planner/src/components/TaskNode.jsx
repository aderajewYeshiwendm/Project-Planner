import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store/useStore';
import { STATUS, PRIORITY } from '../utils/helpers';
import TaskForm from './TaskForm';

export default function TaskNode({ task, depth = 0, allTasks = [] }) {
    const { updateTask, deleteTask, addSubtask, toggleCollapse } = useStore();
    const [editing, setEditing]             = useState(false);
    const [addingSub, setAddingSub]         = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const {
        attributes, listeners, setNodeRef,
        transform, transition, isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const statusCfg   = STATUS[task.status]     || STATUS.todo;
    const priorityCfg = PRIORITY[task.priority] || PRIORITY.medium;
    const hasSubs     = task.subtasks?.length > 0;
    const depCount    = task.dependencies?.length || 0;

    

    function handleSave(data) {
    updateTask(task.id, { ...data, id: task.id });
    setEditing(false);
}
function handleAddSub(data) {
        addSubtask(task.id, data);
        setAddingSub(false);
    }

    return (
        <div ref={setNodeRef} style={style} className="select-none">

            {/* ── Task row ── */}
            <div
                className={`group flex items-start gap-2 px-3 py-2.5 rounded-xl border transition-all mb-1 ${
                    task.status === 'done'
                        ? 'border-border/40 bg-surface/40 opacity-60'
                        : 'border-border bg-surface hover:border-accent/30'
                }`}
                style={{ marginLeft: depth * 24 }}
            >
                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="mt-0.5 text-muted/40 hover:text-muted cursor-grab active:cursor-grabbing shrink-0 text-xs"
                    title="Drag to reorder"
                >
                    ⠿
                </button>

                {/* Collapse toggle */}
                <button
                    onClick={() => toggleCollapse(task.id)}
                    className={`mt-0.5 text-xs shrink-0 transition-transform duration-200 ${
                        hasSubs ? 'text-muted hover:text-text' : 'text-transparent pointer-events-none'
                    } ${!task.collapsed ? 'rotate-90' : ''}`}
                >
                    ▶
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">

                        {/* Title */}
                        <span className={`text-sm font-medium ${
                            task.status === 'done'
                                ? 'line-through text-muted'
                                : 'text-text'
                        }`}>
                            {task.title}
                        </span>

                        {/* Status badge */}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.color}`}>
                            {statusCfg.label}
                        </span>

                        {/* Priority */}
                        <span className={`text-xs font-mono ${priorityCfg.color}`}>
                            {priorityCfg.label}
                        </span>

                        {/* Dependencies indicator */}
                        {depCount > 0 && (
                            <span
                                className="text-xs text-accent2/70 font-mono"
                                title={`${depCount} dependenc${depCount > 1 ? 'ies' : 'y'}`}
                            >
                                ⇒ {depCount}
                            </span>
                        )}

                        {/* Subtask count */}
                        {hasSubs && (
                            <span className="text-xs text-muted font-mono">
                                [{task.subtasks.length}]
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {task.description && (
                        <p className="text-xs text-muted mt-0.5 truncate">
                            {task.description}
                        </p>
                    )}
                </div>

                {/* ── Actions (visible on hover) ── */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">

                    {/* Cycle status */}
                    <button
                        onClick={() => {
                            const order = ['todo', 'in_progress', 'done', 'blocked'];
                            const next  = order[(order.indexOf(task.status) + 1) % order.length];
                            updateTask(task.id, { status: next });
                        }}
                        className="text-xs text-muted hover:text-accent px-1.5 py-1 rounded transition-colors"
                        title="Cycle status"
                    >
                        ↻
                    </button>

                    {/* Add subtask */}
                    <button
                        onClick={() => setAddingSub(v => !v)}
                        className="text-xs text-muted hover:text-accent px-1.5 py-1 rounded transition-colors"
                        title="Add subtask"
                    >
                        +
                    </button>

                    {/* Edit */}
                    <button
                        onClick={() => setEditing(v => !v)}
                        className="text-xs text-muted hover:text-text px-1.5 py-1 rounded transition-colors"
                        title="Edit task"
                    >
                        ✎
                    </button>

                    {/* Delete */}
                    {confirmDelete ? (
                        <>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="text-xs text-danger hover:opacity-80 px-1.5 py-1"
                                title="Confirm delete"
                            >
                                ✕
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="text-xs text-muted hover:text-text px-1.5 py-1"
                                title="Cancel"
                            >
                                ✗
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="text-xs text-muted hover:text-danger px-1.5 py-1 rounded transition-colors"
                            title="Delete task"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* ── Edit form ── */}
            {editing && (
                <div style={{ marginLeft: depth * 24 }}>
                    <TaskForm
                        initial={task}
                        allTasks={allTasks}
                        onSave={handleSave}
                        onCancel={() => setEditing(false)}
                    />
                </div>
            )}

            {/* ── Add subtask form ── */}
            {addingSub && (
                <div style={{ marginLeft: (depth + 1) * 24 }}>
                    <TaskForm
                        allTasks={allTasks}
                        onSave={handleAddSub}
                        onCancel={() => setAddingSub(false)}
                        isSubtask
                    />
                </div>
            )}

            {/* ── Subtasks ── */}
            {hasSubs && !task.collapsed && (
                task.subtasks.map(sub => (
                    <TaskNode
                        key={sub.id}
                        task={sub}
                        depth={depth + 1}
                        allTasks={allTasks}
                    />
                ))
            )}

        </div>
    );
}