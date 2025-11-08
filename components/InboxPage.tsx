
import React, { useState } from 'react';
import { Icon } from './Icon';
import { IconName, Page } from '../constants';
import { mockEmails } from '../constants';
import { Email } from '../types';
import { generateText } from '../services/geminiService';
import { Modal } from './Modal';

const inboxNavItems = [
    { icon: IconName.Inbox, label: 'Inbox', page: Page.Inbox, folder: 'Inbox' },
    { icon: IconName.Flag, label: 'Flagged', page: Page.Flagged, folder: 'Inbox' },
    { icon: IconName.Send, label: 'Sent', page: Page.Sent, folder: 'Sent' },
    { icon: IconName.Draft, label: 'Drafts', page: Page.Drafts, folder: 'Drafts' },
    { icon: IconName.Archive, label: 'Archive', page: Page.Archive, folder: 'Inbox' },
    { icon: IconName.Trash, label: 'Trash', page: Page.Trash, folder: 'Trash' },
];

const EmailDetail: React.FC<{ email: Email }> = ({ email }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [reply, setReply] = useState('');

    const handleGenerateReply = async () => {
        setIsGenerating(true);
        setReply('');
        const prompt = `Generate a professional and concise reply to the following email:\n\n---\nSubject: ${email.subject}\nFrom: ${email.from}\n\n${email.body}\n---`;
        try {
            const result = await generateText(prompt, 'gemini-2.5-flash');
            setReply(result);
        } catch (error) {
            console.error(error);
            setReply('Sorry, there was an error generating a reply.');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <h2 className="text-2xl font-semibold mb-2">{email.subject}</h2>
            <p className="text-sm text-bib-light mb-4">From: {email.from}</p>
            <div className="flex-grow overflow-y-auto text-bib-light-hover leading-relaxed">
                {email.body}
            </div>
            <div className="mt-6 pt-4 border-t border-bib-dark-3">
                 <button onClick={handleGenerateReply} disabled={isGenerating} className="flex items-center space-x-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-purple-400">
                    <Icon name={IconName.Sparkles} className="w-5 h-5" />
                    <span>{isGenerating ? "Generating..." : "Draft Reply with BRAINSAIT"}</span>
                </button>
                 {isGenerating && <p className="text-sm text-bib-light mt-2 animate-pulse">BRAINSAIT CORE ENGINE is thinking...</p>}
                 {reply && (
                    <div className="mt-4">
                        <textarea className="w-full h-40 bg-bib-dark-3 p-2 rounded-md text-bib-light-hover" value={reply} onChange={(e) => setReply(e.target.value)}></textarea>
                    </div>
                 )}
            </div>
        </div>
    )
}

export const InboxPage: React.FC = () => {
  const [emails] = useState<Email[]>(mockEmails);
  const [activeFolder, setActiveFolder] = useState('Inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails.find(e => e.folder === 'Inbox') || null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const filteredEmails = emails.filter(e => e.folder === activeFolder);
    
  return (
    <div className="flex h-full bg-bib-dark-2 rounded-lg overflow-hidden">
        <aside className="w-64 bg-bib-dark-3 p-4 rounded-l-lg border-r border-bib-dark-2 flex flex-col">
            <h2 className="text-lg font-semibold px-2 mb-4">Inbox</h2>
            <button onClick={() => setIsComposeOpen(true)} className="w-full bg-bib-blue text-white font-semibold py-2 px-4 rounded-md mb-6 hover:bg-blue-600">
                New Message
            </button>
            <nav className="flex-grow">
                <ul>
                    {inboxNavItems.map(item => (
                        <li key={item.label}>
                            <button onClick={() => { setActiveFolder(item.folder); setSelectedEmail(null); }} className={`w-full text-left flex items-center space-x-3 px-2 py-2 rounded-md text-sm ${activeFolder === item.folder ? 'bg-bib-dark-2 text-white' : 'text-bib-light hover:bg-bib-dark-2'}`}>
                                <Icon name={item.icon} className="w-5 h-5"/>
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>

        {filteredEmails.length === 0 && !selectedEmail ? (
             <main className="flex-1 flex flex-col items-center justify-center p-8">
                <h3 className="text-2xl font-semibold mb-2">Your {activeFolder} is empty!</h3>
                <p className="text-bib-light mb-6">There are no messages to display.</p>
            </main>
        ) : (
            <>
            <aside className="w-1/3 border-r border-bib-dark-3 overflow-y-auto">
                {filteredEmails.map(email => (
                     <div key={email.id} onClick={() => setSelectedEmail(email)} className={`p-4 border-b border-bib-dark-3 cursor-pointer ${selectedEmail?.id === email.id ? 'bg-bib-dark' : 'hover:bg-bib-dark-3'}`}>
                        <div className="flex justify-between text-sm">
                            <p className="font-bold">{email.from}</p>
                            <p className="text-bib-light">{email.timestamp}</p>
                        </div>
                        <p className="font-semibold truncate pr-4">{email.subject}</p>
                        <p className="text-sm text-bib-light truncate pr-4">{email.body}</p>
                    </div>
                ))}
            </aside>
            <main className="flex-1 flex flex-col">
                 {selectedEmail ? <EmailDetail email={selectedEmail} /> : (
                    <div className="flex-1 flex items-center justify-center text-bib-light">
                        <p>Select an email to read</p>
                    </div>
                 )}
            </main>
            </>
        )}

        <Modal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} title="New Message">
            <form className="space-y-4">
                <div>
                    <label htmlFor="to" className="block text-sm font-medium text-bib-light">To</label>
                    <input type="email" id="to" className="mt-1 block w-full bg-bib-dark-3 border border-bib-dark-3 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-bib-blue focus:border-bib-blue sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-bib-light">Subject</label>
                    <input type="text" id="subject" className="mt-1 block w-full bg-bib-dark-3 border border-bib-dark-3 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-bib-blue focus:border-bib-blue sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="body" className="block text-sm font-medium text-bib-light">Body</label>
                    <textarea id="body" rows={10} className="mt-1 block w-full bg-bib-dark-3 border border-bib-dark-3 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-bib-blue focus:border-bib-blue sm:text-sm"></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setIsComposeOpen(false)} className="px-4 py-2 text-sm font-medium text-bib-light bg-bib-dark-3 rounded-md hover:bg-bib-dark-2">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-bib-blue rounded-md hover:bg-blue-600">Send</button>
                </div>
            </form>
        </Modal>

    </div>
  );
};
