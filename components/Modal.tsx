
import React, { ReactNode } from 'react';
import { Icon } from './Icon';
import { IconName } from '../constants';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div 
                className="bg-bib-dark-2 rounded-lg shadow-xl w-full max-w-lg m-4 flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <header className="flex items-center justify-between p-4 border-b border-bib-dark-3">
                    <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-bib-dark-3">
                        <Icon name={IconName.X} className="w-5 h-5 text-bib-light" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
