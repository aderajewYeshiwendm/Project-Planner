import { useState } from "react";
import { useStore } from "../store/useStore";

export default function Sidebar() {
    const { projects, activeProjectId, setActiveProject, createProject, deleteProject } = useStore();
    const [creating, setCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    function handleCreate(e) {
        e.preventDefault();
        if (!title.trim()) return;
        createProject(title.trim());
        setTitle('');
        setCreating(false);
    }

    return (
        <aside className="w-60 bg-surface border-r border-border flex flex-col shrink-0">

            {/* Logo */}
            <div className="px-5 py-4 border-b border-border">
                <h1 className="font-semibold text-sm tracking-widest text-accent uppercase">
                    Planner
                </h1>
            </div>

            {/* Project list + form */}
            <div className="flex-1 overflow-y-auto py-3">

                <div className="px-4 mb-2 flex items-center justify-between">
                    <span className="text-xs text-muted uppercase tracking-wider">Projects</span>
                    <button
                        onClick={() => setCreating(v => !v)}
                        className="text-muted hover:text-accent text-lg leading-none transition-colors"
                        title="New project"
                    >
                        +
                    </button>
                </div>

                {/* New project form — inside the scrollable div */}
                {creating && (
                    <form onSubmit={handleCreate} className="px-4 mb-3">
                        <input
                            autoFocus
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Project name..."
                            className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-xs text-text placeholder-muted outline-none focus:border-accent transition-colors"
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-accent text-bg text-xs font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => setCreating(false)}
                                className="flex-1 bg-surface2 text-muted text-xs py-2 rounded-lg hover:text-text transition-colors border border-border"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Empty state */}
                {projects.length === 0 && (
                    <p className="px-4 text-xs text-muted">No projects yet.</p>
                )}

                {/* Project items */}
                {projects.map(project => (
                    <div
                        key={project.id}
                        className={`group flex items-center justify-between mx-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                            project.id === activeProjectId
                                ? 'bg-accent/15 text-accent'
                                : 'text-muted hover:bg-surface2 hover:text-text'
                        }`}
                        onClick={() => setActiveProject(project.id)}
                    >
                        <span className="text-xs font-medium truncate">{project.title}</span>

                        {/* Delete */}
                        {confirmDelete === project.id ? (
                            <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={() => { deleteProject(project.id); setConfirmDelete(null); }}
                                    className="text-danger text-xs hover:opacity-80 px-1"
                                >
                                    ✕
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="text-muted text-xs hover:text-text px-1"
                                >
                                    ✗
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={e => { e.stopPropagation(); setConfirmDelete(project.id); }}
                                className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger text-xs transition-all px-1"
                                title="Delete project"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}

            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border">
                <p className="text-xs text-muted">
                    {projects.length} project{projects.length !== 1 ? 's' : ''}
                </p>
            </div>

        </aside>
    );
}