
import React from 'react';
import { HeaderNavItem, User } from '../types';
import { Page, IconName } from '../constants';
import { Icon } from './Icon';

interface HeaderProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  navItems: HeaderNavItem[];
  user: User;
  pageTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ activePage, setActivePage, navItems, user, pageTitle }) => {
  return (
    <header className="bg-bib-dark border-b border-bib-dark-3">
      <div className="px-6 py-2 flex items-center justify-between">
         <div className="flex items-center space-x-1">
            <button className="p-1 rounded-md text-bib-light hover:bg-bib-dark-3">
                <Icon name={IconName.ChevronLeft} className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-md text-bib-light hover:bg-bib-dark-3">
                <Icon name={IconName.ChevronRight} className="w-4 h-4" />
            </button>
        </div>
        <div className="flex-1 mx-4">
             <div className="flex items-center bg-bib-dark-2 rounded-md">
                 <div className="px-3 text-bib-light pointer-events-none">
                     <Icon name={IconName.Home} className="w-4 h-4"/>
                 </div>
                 <p className="w-full bg-transparent text-sm text-bib-light-hover py-1.5 focus:outline-none">Business in a Box / {pageTitle}</p>
             </div>
        </div>
        <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-bib-dark-3 px-3 py-1.5 rounded-md text-sm text-bib-light-hover hover:bg-bib-dark-2">
                <span>Invite users</span>
            </button>
             <button className="p-2 rounded-full text-bib-light hover:bg-bib-dark-3">
                 <Icon name={IconName.Bell} className="w-5 h-5"/>
            </button>
             <button className="p-2 rounded-full text-bib-light hover:bg-bib-dark-3">
                {/* FIX: Use Icon component for QuestionMarkCircle */}
                <Icon name={IconName.QuestionMarkCircle} className="w-5 h-5"/>
            </button>
        </div>
      </div>
      <nav className="px-4">
          <ul className="flex items-center space-x-1">
              {navItems.map(item => (
                <li key={item.label}>
                    <button 
                        onClick={() => setActivePage(item.page)}
                        className={`px-3 py-2 text-sm rounded-t-md ${activePage === item.page ? 'bg-bib-dark-2 text-bib-light-hover' : 'text-bib-light hover:bg-bib-dark-3'}`}>
                        {item.label}
                    </button>
                </li>
              ))}
              <li className="flex-1"></li>
              <li>
                  <button className="px-3 py-2 text-sm rounded-t-md text-bib-light hover:bg-bib-dark-3">
                    <Icon name={IconName.Plus} className="w-4 h-4" />
                  </button>
              </li>
          </ul>
      </nav>
    </header>
  );
};
