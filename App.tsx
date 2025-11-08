
import React, { useState } from 'react';
import { Page, sidebarNavItems, headerNavItems, user, IconName } from './constants';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { InboxPage } from './components/InboxPage';
import { TasksPage } from './components/TasksPage';
import { DrivePage } from './components/DrivePage';
import { TemplatesPage } from './components/TemplatesPage';
import { HRMPage } from './components/HRMPage';
import { GeminiAIAssistant } from './components/GeminiAIAssistant';
import { Icon } from './components/Icon';


const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Home);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case Page.Home:
        return <HomePage setActivePage={setActivePage} />;
      case Page.Inbox:
        return <InboxPage />;
      case Page.Tasks:
        return <TasksPage />;
      case Page.Drive:
        return <DrivePage />;
      case Page.Templates:
        return <TemplatesPage />;
      case Page.HRM:
        return <HRMPage />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  };

  const pageTitle = headerNavItems.find(item => item.page === activePage)?.label || 'Home';

  return (
    <div className="bg-bib-dark text-white font-sans flex h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} navItems={sidebarNavItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activePage={activePage} setActivePage={setActivePage} navItems={headerNavItems} user={user} pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-bib-dark-2">
          {renderPage()}
        </main>
      </div>
      <button
        onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-200 z-50"
        aria-label="Toggle AI Assistant"
      >
        <Icon name={IconName.Sparkles} className="w-6 h-6" />
      </button>
      {isAIAssistantOpen && <GeminiAIAssistant onClose={() => setIsAIAssistantOpen(false)} />}
    </div>
  );
};

export default App;