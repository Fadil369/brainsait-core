
import React, { useState, useCallback } from 'react';
import { Icon } from './Icon';
import { IconName } from '../constants';
import { mockFolders, mockFiles } from '../constants';
import { DriveItem, Folder, FileObject } from '../types';

const driveNav = [
    {icon: IconName.Building, label: 'Organization Drive'},
    {icon: IconName.Folder, label: 'My Drive'},
    {icon: IconName.Clock, label: 'Recent'},
    {icon: IconName.Star, label: 'Favorites'},
    {icon: IconName.Users, label: 'Shared with me'},
    {icon: IconName.UserCircle, label: 'Shared by me'},
    {icon: IconName.Templates, label: 'Templates'},
    {icon: IconName.Trash, label: 'Trash'},
];

export const DrivePage: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [files, setFiles] = useState<FileObject[]>(mockFiles);

  const handleAddFolder = () => {
      const folderName = prompt("Enter new folder name:");
      if (folderName) {
          const newFolder: Folder = {
              id: Date.now(),
              name: folderName,
              type: 'folder',
          };
          setFolders(prev => [...prev, newFolder]);
      }
  }

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
        const newFiles: FileObject[] = Array.from(droppedFiles).map(file => ({
            id: Math.random(), // In real app, use a better ID
            name: file.name,
            type: 'file',
            size: `${(file.size / 1024).toFixed(2)} KB`,
        }));
        setFiles(prev => [...prev, ...newFiles]);
        alert(`${newFiles.length} file(s) "uploaded"! (simulation)`);
    }
  }, []);


  return (
    <div className="flex h-full bg-bib-dark-2 rounded-lg">
        <aside className="w-72 bg-bib-dark-3 p-4 rounded-l-lg border-r border-bib-dark-2">
             {/* Nav */}
        </aside>
        <main className="flex-1 flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Organization Drive</h3>
                {/* Search and view controls */}
            </div>

            <div className="flex items-center space-x-2 mb-6">
                <button className="flex items-center space-x-2 bg-bib-blue text-white font-semibold py-1.5 px-3 rounded-md hover:bg-blue-600 text-sm">
                    <Icon name={IconName.FilePlus} className="w-4 h-4"/><span>New Document</span>
                </button>
                 <button className="flex items-center space-x-2 bg-bib-dark-3 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-bib-dark-3/80 text-sm">
                    <Icon name={IconName.Sheet} className="w-4 h-4"/><span>New Sheet</span>
                </button>
                 <button onClick={handleAddFolder} className="flex items-center space-x-2 bg-bib-dark-3 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-bib-dark-3/80 text-sm">
                    <Icon name={IconName.FolderPlus} className="w-4 h-4"/><span>Add Folder</span>
                </button>
                 <button className="flex items-center space-x-2 bg-bib-dark-3 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-bib-dark-3/80 text-sm">
                    <Icon name={IconName.CloudUpload} className="w-4 h-4"/><span>Upload</span>
                </button>
            </div>
            
            <div>
                <h4 className="font-semibold mb-4">Folders ({folders.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {folders.map(folder => (
                        <div key={folder.id} className="bg-bib-dark-3 p-3 rounded-md flex items-center space-x-3 cursor-pointer hover:bg-bib-dark-3/80">
                            <Icon name={IconName.Folder} className="w-5 h-5 text-bib-light"/>
                            <span className="text-sm">{folder.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h4 className="font-semibold mb-4">Files ({files.length})</h4>
                <div className="space-y-2">
                    {files.map(file => (
                         <div key={file.id} className="bg-bib-dark-3 p-3 rounded-md flex items-center justify-between cursor-pointer hover:bg-bib-dark-3/80">
                            <div className="flex items-center space-x-3">
                                <Icon name={IconName.FileText} className="w-5 h-5 text-blue-400"/>
                                <span className="text-sm">{file.name}</span>
                            </div>
                            <span className="text-xs text-bib-light">{file.size}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div onDragOver={onDragOver} onDrop={onDrop} className="flex-grow flex flex-col items-center justify-center text-bib-light mt-8 border-2 border-dashed border-bib-dark-3 rounded-lg">
                <Icon name={IconName.CloudUpload} className="w-16 h-16 text-blue-500 mb-4"/>
                <p className="font-semibold">Drop your folders and files here</p>
                <p className="text-sm">or click here to upload</p>
            </div>
        </main>
    </div>
  );
};
