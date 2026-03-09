import { useState } from 'react';
import { STATUS, PRIORITY, flattenIds } from '../utils/helpers';

export default function TaskForm({ initial = {}, allTasks = [], onSave, onCancel, isSubtask = false }) {
    const [title, setTitle]           = useState(initial.title || '');
    const [description, setDesc]      = useState(initial.description || '');
    const [status, setStatus]         = useState(initial.status || 'todo');
    const [priority, setPriority]     = useState(initial.priority || 'medium');
    const [dependencies, setDependencies] = useState(initial.dependencies || []);

    const allIds = flattenIds(allTasks).filter(t => t.id !== initial.id);

    function toggleDep(id) {
        setDependencies(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim()) return;
        onSave({ title: title.trim(), description, status, priority, dependencies });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-surface2 border border-border rounded-xl p-4 mt-2 space-y-3"
        >
            {/* Title */}
            <input
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={isSubtask ? 'Subtask title...' : 'Task title...'}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-muted outline-none focus:border-accent transition-colors"
            />

            {/* Description */}
            <textarea
                value={description}
                onChange={e => setDesc(e.target.value)}
                placeholder="Description (optional)..."
                rows={2}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-muted outline-none focus:border-accent transition-colors resize-none"
            />

            {/* Status & Priority */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="text-xs text-muted mb-1 block">Status</label>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text outline-none focus:border-accent transition-colors"
                    >
                        {Object.entries(STATUS).map(([val, { label }]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="text-xs text-muted mb-1 block">Priority</label>
                    <select
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                        className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text outline-none focus:border-accent transition-colors"
                    >
                        {Object.entries(PRIORITY).map(([val, { label }]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Dependencies */}
            {allIds.length > 0 && (
                <div>
                    <label className="text-xs text-muted mb-1 block">Dependencies</label>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                        {allIds.map(({ id, title: t }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => toggleDep(id)}
                                className={`text-xs px-2 py-1 rounded-md border transition-all ${
                                    dependencies.includes(id)
                                        ? 'border-accent2 bg-accent2/10 text-accent2'
                                        : 'border-border text-muted hover:border-accent hover:text-text'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
                <button
                    type="submit"
                    className="flex-1 bg-accent text-bg text-xs font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    {initial.id ? 'Save changes' : isSubtask ? 'Add subtask' : 'Add task'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-surface text-muted text-xs py-2 rounded-lg hover:text-text transition-colors border border-border"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}