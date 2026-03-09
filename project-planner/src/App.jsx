import { useState, useEffect } from 'react'
import { useStore } from './store/useStore';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskTree from './components/TaskTree';


function App() {
  const { projects, activeProject, activeProjectId, createProject } = useStore();
  const project = activeProject();

  // create a default project if none exist
  useEffect(()=>{
    if (projects.length === 0) {
      createProject('My First Project', 'A place to plan and organise your work!');
  }
}, []);

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-text">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <div className='flex flex-col flex-1 overflow-hidden'>
        {
          project ? (
            <>
              <Header project={project} />
              <main className='flex-1 overflow-y-auto p-6'>
                <TaskTree tasks={project.tasks} allTasks={project.tasks} />
            
              </main>

              </>
          ):
          (
            <div className='flex-1 flex items-center justify-center text-muted'>
              <p className='text-muted'>No project selected. Please create or select a project to get started.</p>
            </div>
          )
        }

      </div>
    </div>
  )
}

export default App
