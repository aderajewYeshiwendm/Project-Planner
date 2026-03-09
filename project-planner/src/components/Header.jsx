import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function Header({ project }) {
    const { updateProject } = useStore();
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingDesc, setEditingDesc]   = useState(false);
    const [title, setTitle]               = useState(project.title);
    const [desc, setDesc]                 = useState(project.description);
    const titleRef = useRef();
    const descRef  = useRef();

    useEffect(() => {
        setTitle(project.title);
        setDesc(project.description);
    }, [project.id]);

    function saveTitle() {
        if (title.trim()) updateProject(project.id, { title: title.trim() });
        else setTitle(project.title);
        setEditingTitle(false);
    }

    function saveDesc() {
        updateProject(project.id, { description: desc });
        setEditingDesc(false);
    }

    return (
        <header className="px-6 py-4 border-b border-border bg-surface shrink-0">

            {/* Title */}
            {editingTitle ? (
                <input
                    ref={titleRef}
                    autoFocus
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={saveTitle}
                    onKeyDown={e => {
                        if (e.key === 'Enter') saveTitle();
                        if (e.key === 'Escape') { setTitle(project.title); setEditingTitle(false); }
                    }}
                    className="bg-surface text-xl font-semibold text-text outline-none border-b border-accent w-full max-w-lg caret-accent"
                />
            ) : (
                <h2
                    className="text-xl font-semibold text-text cursor-pointer hover:text-accent transition-colors w-fit"
                    onClick={() => setEditingTitle(true)}
                    title="Click to edit"
                >
                    {project.title}
                </h2>
            )}

            {/* Description */}
            {editingDesc ? (
                <textarea
                    ref={descRef}
                    autoFocus
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    onBlur={saveDesc}
                    onKeyDown={e => {
                        if (e.key === 'Escape') { setDesc(project.description); setEditingDesc(false); }
                    }}
                    rows={2}
                    className="mt-1 bg-surface text-sm text-muted outline-none border-b border-accent w-full max-w-2xl resize-none"
                />
            ) : (
                <p
                    className="mt-1 text-sm text-muted cursor-pointer hover:text-text transition-colors w-fit"
                    onClick={() => setEditingDesc(true)}
                    title="Click to edit"
                >
                    {project.description || 'Add a description...'}
                </p>
            )}

            <p className="mt-2 text-xs text-muted/50">
                Created {new Date(project.createdAt).toLocaleDateString()}
            </p>

        </header>
    );
}