
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { IconName, Page } from '../constants';
import { mockEmployees } from '../constants';

const hrmNav = [
    { icon: IconName.Home, label: 'Dashboard', page: Page.HRM },
    { icon: IconName.Users, label: 'People', page: Page.People },
    { icon: IconName.Clock, label: 'Time & Attendance', page: Page.TimeAttendance },
    { icon: IconName.Calendar, label: 'Leave & Vacations', page: Page.LeaveVacations },
    { icon: IconName.CreditCard, label: 'Pay', page: Page.Pay },
    { icon: IconName.Briefcase, label: 'Assets', page: Page.Assets },
    { icon: IconName.TrendingUp, label: 'Performance', page: Page.Performance },
    { icon: IconName.Chart, label: 'Reports', page: Page.Reports },
    { icon: IconName.Building, label: 'Organization Profile', page: Page.OrganizationProfile },
    { icon: IconName.UserCircle, label: 'My Account', page: Page.MyAccount },
];

const StatCard: React.FC<{title: string, value: string | number, showAll?: boolean}> = ({title, value, showAll = true}) => (
    <div className="bg-bib-dark-3 p-4 rounded-lg">
        <p className="text-sm text-bib-light">{title}</p>
        <p className="text-4xl font-bold my-2">{value}</p>
        {showAll && <button className="text-sm text-bib-light hover:underline">Show All</button>}
    </div>
);

export const HRMPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEmployees = useMemo(() => {
        return mockEmployees.filter(employee =>
            employee.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="flex h-full bg-bib-dark-2 rounded-lg">
            <aside className="w-64 bg-bib-dark-3 p-4 rounded-l-lg border-r border-bib-dark-2">
                 <nav>
                    <ul>
                        {hrmNav.map(item => (
                            <li key={item.label}>
                                <a href="#" className={`flex items-center space-x-3 px-2 py-2 rounded-md text-sm ${item.page === Page.HRM ? 'bg-bib-dark-2 text-white' : 'text-bib-light hover:bg-bib-dark-2'}`}>
                                    <Icon name={item.icon} className="w-5 h-5"/>
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main className="flex-1 p-6 overflow-y-auto">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Dashboard</h3>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-bib-dark-3 rounded-md px-2">
                            <Icon name={IconName.Search} className="w-4 h-4 text-bib-light"/>
                            <input 
                                type="text" 
                                placeholder="Search employee by name" 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="bg-transparent p-1.5 text-sm focus:outline-none w-48"/>
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <h4 className="font-semibold text-lg">Daily Summary for <span className="text-bib-light">11-Aug-2025</span></h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Present" value="1"/>
                    <StatCard title="Birthdays" value="0"/>
                    <StatCard title="Work anniversaries" value="0"/>
                    <StatCard title="Absent" value="1"/>
                    <StatCard title="On Leave" value="1"/>
                    <StatCard title="Pending timesheets" value="0"/>
                    <StatCard title="Pending leave requests" value="0"/>
                </div>

                <div className="bg-bib-dark-3 rounded-lg">
                    <div className="p-4 flex justify-end">
                        <button onClick={() => alert("Reminder sent to all offline employees!")} className="text-sm flex items-center space-x-1 text-bib-light hover:text-white">
                            <Icon name={IconName.Clock} className="w-4 h-4"/>
                            <span>Remind all to Clock In</span>
                        </button>
                    </div>
                     <table className="w-full text-sm text-left">
                        <thead className="text-xs text-bib-light uppercase bg-bib-dark-2">
                            <tr>
                                <th scope="col" className="px-6 py-3">Employee</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">In</th>
                                <th scope="col" className="px-6 py-3">Out</th>
                                <th scope="col" className="px-6 py-3">Breaks</th>
                                <th scope="col" className="px-6 py-3">Total hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map(employee => (
                                <tr key={employee.name} className="border-t border-bib-dark-2 hover:bg-bib-dark-2/50">
                                    <td className="px-6 py-4 font-medium flex items-center space-x-3">
                                        <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm">{employee.name.split(' ').map(n => n[0]).join('')}</span>
                                        <span>{employee.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center space-x-2 ${employee.status === 'Online' ? 'text-green-400' : 'text-bib-light'}`}>
                                            <div className={`w-2 h-2 rounded-full ${employee.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                            <span>{employee.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{employee.in}</td>
                                    <td className="px-6 py-4">{employee.out}</td>
                                    <td className="px-6 py-4">{employee.breaks}</td>
                                    <td className="px-6 py-4">{employee.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    )
}
