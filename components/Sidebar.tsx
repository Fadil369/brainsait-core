
import React from 'react';
import { NavItem } from '../types';
import { Page, IconName } from '../constants';
import { Icon } from './Icon';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  navItems: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, navItems }) => {
  return (
    <aside className="w-16 bg-bib-dark flex flex-col items-center py-4 space-y-4 border-r border-bib-dark-3">
       <div className="p-2 rounded-md bg-bib-dark-3">
          <Icon name={IconName.Grid} className="w-6 h-6 text-bib-light-hover" />
        </div>
      {navItems.map((item) => (
        <button
          key={item.page}
          onClick={() => setActivePage(item.page)}
          className={`p-2 rounded-md ${
            activePage === item.page ? 'bg-bib-dark-3 text-bib-light-hover' : 'text-bib-light hover:bg-bib-dark-3'
          }`}
          title={item.label}
        >
          <Icon name={item.icon} className="w-6 h-6" />
        </button>
      ))}
      <div className="flex-grow"></div>
       <div className="space-y-4">
          <button className="p-2 rounded-md text-bib-light hover:bg-bib-dark-3">
            <Icon name={IconName.Calendar} className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-md text-bib-light hover:bg-bib-dark-3">
            <Icon name={IconName.Users} className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-md text-bib-light hover:bg-bib-dark-3">
            <Icon name={IconName.FileText} className="w-6 h-6" />
          </button>
       </div>
    </aside>
  );
};
