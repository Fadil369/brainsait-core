
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { IconName, Page } from '../constants';

const TimeDisplay: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const day = time.toLocaleDateString('en-US', { weekday: 'long' });
    const date = time.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    return (
        <div>
            <p className="text-sm text-bib-light">{day}, {date}</p>
        </div>
    )
}

const TimesheetCard: React.FC = () => {
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isClockedIn && startTime) {
            timerRef.current = window.setInterval(() => {
                setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isClockedIn, startTime]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };
    
    const handleClockIn = () => {
        setIsClockedIn(true);
        setStartTime(new Date());
        setElapsedTime(0);
    }
    
    const handleClockOut = () => {
        setIsClockedIn(false);
        // In a real app, you would save the final elapsedTime here
    }

    return (
        <div className="bg-bib-dark-3 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Clock-IN/OUT <span className="text-sm text-bib-light">My Timesheet</span></h3>
            <TimeDisplay />
            <p className="text-5xl font-mono tracking-wider my-2">{formatTime(elapsedTime)}</p>

            <div className="grid grid-cols-2 gap-4 my-4">
                {isClockedIn ? (
                    <button onClick={handleClockOut} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md">
                        Clock-out
                    </button>
                ) : (
                    <button onClick={handleClockIn} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">
                        Clock-in
                    </button>
                )}
                <button onClick={() => alert('You have been marked as absent for today.')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md border border-red-500">
                    Absent
                </button>
            </div>
            <div className="text-sm space-y-2 text-bib-light">
                <div className="flex justify-between"><span>In</span><span>{startTime ? startTime.toLocaleTimeString('en-GB') : '--'}</span></div>
                <div className="flex justify-between"><span>Out</span><span>{isClockedIn || !startTime ? '--' : new Date().toLocaleTimeString('en-GB')}</span></div>
                <div className="flex justify-between"><span>Breaks</span><span>--</span></div>
                <div className="flex justify-between"><span>Overtime</span><span>--</span></div>
                <hr className="border-bib-dark-2 my-2"/>
                <div className="flex justify-between font-bold text-white"><span>Total work hours</span><span>{isClockedIn ? '...' : formatTime(elapsedTime)}</span></div>
            </div>
        </div>
    )
}

const TodoCard: React.FC<{title: string, button?: boolean}> = ({title, button}) => {
    return (
         <div className="bg-bib-dark-3 p-6 rounded-lg flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-bib-light hover:underline cursor-pointer">View all</span>
                    {button && <button onClick={() => alert("Navigate to Tasks page to create a new task.")} className="bg-bib-blue text-white text-sm px-3 py-1 rounded-md">Create Task</button>}
                </div>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center text-bib-light">
                <div className="bg-green-500/20 text-green-400 rounded-full p-3 mb-4">
                    <Icon name={IconName.CheckCircle} className="w-8 h-8"/>
                </div>
                <p>All caught up!</p>
            </div>
        </div>
    )
}

const bookmarks = [
    { name: 'Inbox', icon: IconName.Inbox, page: Page.Inbox },
    { name: 'Tasks', icon: IconName.Tasks, page: Page.Tasks },
    { name: 'Chat', icon: IconName.MessageSquare, page: Page.Home }, // Assuming chat is on home for now
    { name: 'Connect', icon: IconName.Phone, page: Page.Home },
    { name: 'Drive', icon: IconName.Drive, page: Page.Drive },
    { name: 'Templates', icon: IconName.Templates, page: Page.Templates },
    { name: 'Editor', icon: IconName.Edit, page: Page.Home },
    { name: 'Sheets', icon: IconName.Sheet, page: Page.Home },
    { name: 'Notes', icon: IconName.BookOpen, page: Page.Home },
    { name: 'Links', icon: IconName.Link, page: Page.Home },
    { name: 'Contacts', icon: IconName.Users2, page: Page.Home },
    { name: 'HRM', icon: IconName.Hrm, page: Page.HRM },
    { name: 'AI', icon: IconName.Ai, page: Page.Home },
];

const BookmarkCard: React.FC<{setActivePage: (page: Page) => void}> = ({setActivePage}) => {
    return (
        <div className="bg-bib-dark-3 p-6 rounded-lg col-span-1 lg:col-span-3">
             <h3 className="text-lg font-semibold mb-4">Bookmarks</h3>
             <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-4">
                 {bookmarks.map(item => (
                    <button key={item.name} onClick={() => setActivePage(item.page)} className="flex flex-col items-center space-y-2 p-3 bg-bib-dark-2 rounded-lg hover:bg-bib-dark-2/50">
                        <Icon name={item.icon} className="w-6 h-6 text-bib-light"/>
                        <span className="text-xs text-bib-light">{item.name}</span>
                    </button>
                 ))}
             </div>
        </div>
    );
}

const templates = [
    'Business Plan Templates', 'Business Proposal', 'Confidentiality Agreement', 'Employee Handbook',
    'Consulting Agreement Short', 'Marketing Plan', 'Non-Disclosure Agreement', 'Shareholders Agreement'
];

const RecentTemplatesCard: React.FC = () => {
    return (
        <div className="bg-bib-dark-3 p-6 rounded-lg col-span-1 lg:col-span-3">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Templates</h3>
                <span className="text-sm text-bib-light hover:underline cursor-pointer">View all</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {templates.map(name => (
                    <div key={name} className="bg-bib-dark-2 p-4 rounded-md flex items-center space-x-3 hover:bg-bib-dark-2/50 cursor-pointer">
                        <Icon name={IconName.FileText} className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-sm text-bib-light-hover truncate">{name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}


export const HomePage: React.FC<{setActivePage: (page: Page) => void}> = ({ setActivePage }) => {
  return (
    <div className="space-y-6">
        <h2 className="text-xl">Good Evening Mohamed Efadil!</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TimesheetCard />
            <TodoCard title="To-Do" button/>
            <TodoCard title="Overdue"/>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <BookmarkCard setActivePage={setActivePage} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <RecentTemplatesCard />
        </div>
    </div>
  );
};
