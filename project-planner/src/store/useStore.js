import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {uid, clone, newProject, newTask, updateTask, deleteTask, addSubtask} from '../utils/helpers';
import { add } from '@dnd-kit/utilities';


const useStore = create(persist((set, get) => ({
    projects: [],
    activeProjectId: null,
    activeProject: () => {
        const {projects, activeProjectId} = get();
        return projects.find(p => p.id === activeProjectId) || null;
    },
    createProject: (title='New Project', description='') =>{
        const newProj = newProject(title, description);
        set(state => ({ projects: [...state.projects, newProj], activeProjectId: newProj.id }));
        return newProj.id;
    },
    updateProject: (id, changes) => {
        set(state => ({
            projects: state.projects.map(p => p.id === id ? { ...p, ...changes } : p)
        }));

    },
    deleteProject: (id) => {
        set(state => {
            const remaining = state.projects.filter(p => p.id !== id);
            return {
                projects: remaining,
                activeProjectId: state.activeProjectId === id ? (remaining[0]?.id || null) : state.activeProjectId
            };
        });
    },

    setActiveProject: (id) => {
        set({ activeProjectId: id });
    },

    addTask: (task) => {
        const newTaskObj = newTask(task);
        set(state => ({
            projects: state.projects.map(p => p.id === state.activeProjectId ? { ...p, tasks: [...p.tasks, newTaskObj] } : p)
        }));
        return newTaskObj.id;
    },
    addSubtask: (parentId, task) => {
        const newTaskObj = newTask(task);
        set(state => ({
            projects: state.projects.map(p => {
                if (p.id === state.activeProjectId) {
                    return { ...p, tasks: addSubtask(p.tasks, parentId, newTaskObj) };
                }
                return p;
            })
        }));
        return newTaskObj.id;
    },
    updateTask: (id, changes) => {
    set(state => ({
        projects: state.projects.map(p =>
            p.id === state.activeProjectId
                ? { ...p, tasks: updateTask(p.tasks, id, changes) }
                : p
        ),
    }));
},
    deleteTask: (id) => {
        set(state => ({
            projects: state.projects.map(p => {
                if (p.id === state.activeProjectId) {
                    return { ...p, tasks: deleteTask(p.tasks, id) };
                }
                return p;
            })
        }));
    },

    toggleCollapse: (id) => {
        set(state => ({
            projects: state.projects.map(p => {
                if (p.id === state.activeProjectId) {
                    return { ...p, tasks: p.tasks.map(t => t.id === id ? { ...t, collapsed: !t.collapsed } : t) };
                }
                return p;
            })
        }));
    },

    reorderTasks: (tasks) => {
        set(state => ({
            projects: state.projects.map(p => {
                if (p.id === state.activeProjectId) {
                    return { ...p, tasks };
                }
                return p;
            })
        }));
    },

}), {
    name: 'project-planner-v1',
}));


export { useStore };
