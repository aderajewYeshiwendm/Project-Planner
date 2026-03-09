export function uid(){
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// Deep clone
export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Find a task by id anywhere in the tree
export function findTask(tasks, id) {
    for (const task of tasks) {
        if (task.id === id) return task;
        if (task.subtasks?.length) {
            const found = findTask(task.subtasks, id);
            if (found) return found;
        }
    }
    return null;
}

// Update a task by id anywhere in the tree
export function updateTask(tasks, id, changes) {
    return tasks.map(task => {
        if (task.id === id) {
            return { ...task, ...changes };
        }
        if (task.subtasks?.length) {
            return { ...task, subtasks: updateTask(task.subtasks, id, changes) };
        }
        return task;
    });
}

// Delete a task by id anywhere in the tree
export function deleteTask(tasks, id) {
    return tasks.filter(task => task.id !== id).map(task => {
        if (task.subtasks?.length) {
            return { ...task, subtasks: deleteTask(task.subtasks, id) };
        }
        return task;
    });
}

// Add subtask to a parent

export function addSubtask(tasks, parentId, subtask) {
    return tasks.map(task => {
        if (task.id === parentId) {
            return { ...task, subtasks: [...(task.subtasks || []), subtask] };
        }
        if (task.subtasks?.length) {
            return { ...task, subtasks: addSubtask(task.subtasks, parentId, subtask) };
        }
        return task;
    });
}

// Get flat list of all task ids (for dependency picker)

export function flattenIds(tasks, result = []) {
    for (const task of tasks) {
        result.push({ id: task.id, title: task.title });
        if (task.subtasks?.length) {
            flattenIds(task.subtasks, result);
        }
    }
    return result;
}

// status config

export const STATUS = {
    todo: { label: 'To Do', color: 'bg-muted/20 text-muted' },
    in_progress: { label: 'In Progress', color: 'bg-accent/20 text-accent' },
    done: { label: 'Done', color: 'bg-success/20 text-success' },
    blocked: { label: 'Blocked', color: 'bg-danger/20 text-danger' },
};


// priority config
export const PRIORITY = {
    low: { label: 'Low', color: 'bg-muted' },
    medium: { label: 'Medium', color: 'bg-warn' },
    high: { label: 'High', color: 'bg-danger' },
};

// Default new task shape

export function newTask(overrides = {}) {
    return {
        id: uid(),
        title: 'New Task',
        description: '',
        status: 'todo',
        priority: 'medium',
        dependencies: [],
        subtasks: [],
        collapsed: false,
        order: Date.now(),
        ...overrides,
        
    };
}

// Default new project shape
export function newProject(overrides = {}) {
    return {
        id: uid(),
        title: 'New Project',
        description: '',
        tasks: [],
        createdAt: new Date().toISOString(),
        ...overrides,
    };
}

