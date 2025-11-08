
import React, { useState } from 'react';
import { Icon } from './Icon';
import { IconName, Page } from '../constants';
import { mockTasks } from '../constants';
import { Task } from '../types';
import { Modal } from './Modal';
import { generateText } from '../services/geminiService';

const tasksNavItems = [
    { icon: IconName.Tasks, label: 'My Tasks', page: Page.Tasks },
    { icon: IconName.CheckCircle, label: 'Tasks', page: Page.Tasks },
    { icon: IconName.Projects, label: 'Projects', page: Page.Projects },
    { icon: IconName.Goals, label: 'Goals', page: Page.Goals },
    { icon: IconName.Chart, label: 'People Stats', page: Page.Chart },
];

const TaskItem: React.FC<{ task: Task, onGenerateSubtasks: (task: Task) => void }> = ({ task, onGenerateSubtasks }) => (
    <div className="grid grid-cols-12 gap-4 items-center text-sm px-2 py-3 border-l-2 border-bib-dark-3 ml-3.5 hover:bg-bib-dark-3/50">
        <span className="col-span-3 flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox h-4 w-4 rounded bg-bib-dark-3 text-bib-blue" />
            <span>{task.name}</span>
            <button onClick={() => onGenerateSubtasks(task)} title="Generate Sub-tasks with BRAINSAIT">
                <Icon name={IconName.Sparkles} className="w-4 h-4 text-purple-400 hover:text-purple-300"/>
            </button>
        </span>
        <span>{task.project || '--'}</span>
        <span>{task.status}</span>
        <span>{task.priority}</span>
        <span>{task.difficulty || '--'}</span>
        <span>{task.department || '--'}</span>
        <span>{task.startDate || '--'}</span>
        <span>{task.dueDate || '--'}</span>
    </div>
);

const TaskCategory: React.FC<{title: string, tasks: Task[], onGenerateSubtasks: (task: Task) => void}> = ({title, tasks, onGenerateSubtasks}) => {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
        <div>
            <div onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 p-2 cursor-pointer">
                <Icon name={isOpen ? IconName.ChevronDown : IconName.ChevronRight} className="w-4 h-4"/>
                <h4 className="font-semibold">{title}</h4>
                <span className="text-xs text-bib-light bg-bib-dark-3 px-1.5 py-0.5 rounded-full">{tasks.length}</span>
            </div>
            {isOpen && (
                <div>
                    {tasks.map(task => <TaskItem key={task.id} task={task} onGenerateSubtasks={onGenerateSubtasks} />)}
                    <div className="pl-8 py-4 border-l-2 border-bib-dark-3 ml-3.5">
                        <div className="flex items-center space-x-2 text-bib-light cursor-pointer">
                            <Icon name={IconName.Plus} className="w-4 h-4"/>
                            <span>Add Task</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
    const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
    const [subtaskParent, setSubtaskParent] = useState<Task | null>(null);
    const [subtaskResult, setSubtaskResult] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskName.trim()) return;
        const newTask: Task = {
            id: Date.now(),
            name: newTaskName,
            priority: newTaskPriority,
            status: 'Todo'
        };
        setTasks(prev => [...prev, newTask]);
        setNewTaskName('');
        setNewTaskPriority('Medium');
        setIsNewTaskModalOpen(false);
    };

    const handleGenerateSubtasks = async (task: Task) => {
        setSubtaskParent(task);
        setSubtaskResult('');
        setIsSubtaskModalOpen(true);
        setIsGenerating(true);
        const prompt = `Break down the following task into smaller, actionable sub-tasks. Present them as a simple list. Task: "${task.name}"`;
        try {
            const result = await generateText(prompt, 'gemini-2.5-flash');
            setSubtaskResult(result);
        } catch(e) {
            setSubtaskResult("Error generating sub-tasks.");
        } finally {
            setIsGenerating(false);
        }
    }
    
  return (
    <div className="flex h-full bg-bib-dark-2 rounded-lg">
        <aside className="w-64 bg-bib-dark-3 p-4 rounded-l-lg border-r border-bib-dark-2">
            <h2 className="text-lg font-semibold px-2 mb-4">My Tasks</h2>
            <nav>
                 {/* ... nav items ... */}
            </nav>
        </aside>
        <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">My Tasks</h3>
                {/* ... search ... */}
            </div>
            <div className="flex items-center space-x-4 border-b border-bib-dark-3 pb-2 mb-4">
                <button onClick={() => setIsNewTaskModalOpen(true)} className="flex items-center space-x-2 bg-bib-blue text-white font-semibold py-1.5 px-3 rounded-md hover:bg-blue-600 text-sm">
                    <Icon name={IconName.Plus} className="w-4 h-4"/>
                    <span>New Task</span>
                </button>
                {/* ... filters ... */}
            </div>
            
            <header className="grid grid-cols-12 gap-4 text-sm text-bib-light px-2 py-2">
                <span className="col-span-3">Task name</span>
                <span>Project</span>
                <span>Status</span>
                <span>Priority</span>
                <span>Difficulty</span>
                <span>Department</span>
                <span>Start Date</span>
                <span>Due Date</span>
            </header>
            
            <div className="space-y-2">
                <TaskCategory title="High" tasks={tasks.filter(t => t.priority === 'High')} onGenerateSubtasks={handleGenerateSubtasks} />
                <TaskCategory title="Medium" tasks={tasks.filter(t => t.priority === 'Medium')} onGenerateSubtasks={handleGenerateSubtasks} />
                <TaskCategory title="Low" tasks={tasks.filter(t => t.priority === 'Low')} onGenerateSubtasks={handleGenerateSubtasks} />
                <TaskCategory title="Unassigned" tasks={tasks.filter(t => t.priority === 'Unassigned')} onGenerateSubtasks={handleGenerateSubtasks} />
            </div>
        </main>
        
        <Modal isOpen={isNewTaskModalOpen} onClose={() => setIsNewTaskModalOpen(false)} title="Create New Task">
            <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                    <label htmlFor="taskName" className="block text-sm font-medium text-bib-light">Task Name</label>
                    <input type="text" id="taskName" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} className="mt-1 block w-full bg-bib-dark-3 border-bib-dark-3 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-bib-blue focus:border-bib-blue sm:text-sm" autoFocus />
                </div>
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-bib-light">Priority</label>
                    <select id="priority" value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value as any)} className="mt-1 block w-full bg-bib-dark-3 border-bib-dark-3 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-bib-blue focus:border-bib-blue sm:text-sm">
                        <option>Medium</option>
                        <option>High</option>
                        <option>Low</option>
                    </select>
                </div>
                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setIsNewTaskModalOpen(false)} className="px-4 py-2 text-sm font-medium text-bib-light bg-bib-dark-3 rounded-md hover:bg-bib-dark-2">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-bib-blue rounded-md hover:bg-blue-600">Add Task</button>
                </div>
            </form>
        </Modal>

        <Modal isOpen={isSubtaskModalOpen} onClose={() => setIsSubtaskModalOpen(false)} title="BRAINSAIT: Generated Sub-tasks">
            <div>
                <p className="text-sm text-bib-light mb-2">Generated sub-tasks for: <span className="font-semibold text-white">{subtaskParent?.name}</span></p>
                <p className="text-xs text-purple-400 mb-4">Powered by BRAINSAIT CORE ENGINE</p>
                {isGenerating ? (
                     <div className="animate-pulse">Generating...</div>
                ) : (
                    <div className="whitespace-pre-wrap bg-bib-dark-3 p-3 rounded-md text-bib-light-hover max-h-80 overflow-y-auto">{subtaskResult}</div>
                )}
                 <div className="flex justify-end mt-4">
                    <button type="button" onClick={() => setIsSubtaskModalOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-bib-blue rounded-md hover:bg-blue-600">Close</button>
                </div>
            </div>
        </Modal>

    </div>
  );
};
