
import React, { useState } from 'react';
import { Icon } from './Icon';
import { IconName, Page } from '../constants';
import { Modal } from './Modal';
import { generateText } from '../services/geminiService';
import { buildCopilotTemplatePrompt } from '../copilotConfig';

// ... (template navigation and data constants remain the same) ...
const templatesNav = [
    { icon: IconName.Home, label: "Home" },
    { icon: IconName.HumanResources, label: "Human Resources" },
    { icon: IconName.FinanceAccounting, label: "Finance & Accounting" },
    { icon: IconName.SalesMarketing, label: "Sales & Marketing" },
    { icon: IconName.ProductOperations, label: "Product & Operations" },
    { icon: IconName.LegalAgreements, label: "Legal Agreements" },
    { icon: IconName.Administration, label: "Administration" },
    { icon: IconName.BusinessPlan, label: "Business Plan" },
    { icon: IconName.StartBusiness, label: "Start a Business" },
    { icon: IconName.FreeTemplates, label: "Free Templates" },
    { icon: IconName.RecentlyAdded, label: "Recently Added" },
    { icon: IconName.Top50, label: "Top 50 Templates" },
    { icon: IconName.DocumentTypes, label: "Document Types" },
    { icon: IconName.BusinessIndustries, label: "Business Industries" },
    { icon: IconName.Favorites, label: "Favorites" },
];

const coreModules = [
    { icon: IconName.HumanResources, label: "HUMAN RESOURCES" },
    { icon: IconName.FinanceAccounting, label: "FINANCE & ACCOUNTING" },
    { icon: IconName.SalesMarketing, label: "SALES & MARKETING" },
    { icon: IconName.ProductOperations, label: "PRODUCT & OPERATIONS" },
    { icon: IconName.LegalAgreements, label: "LEGAL AGREEMENTS" },
    { icon: IconName.Administration, label: "ADMINISTRATION" },
    { icon: IconName.BusinessPlan, label: "BUSINESS PLAN" },
    { icon: IconName.StartBusiness, label: "START A BUSINESS" },
]

const documentTypes = [
    "Business Plans", "Business Proposals", "Company Policies", "Business Agreements",
    "Business Procedures", "Business Checklists", "Business Guides", "Business Resolutions",
    "Business Forms", "Business Spreadsheets", "Business Worksheets", "Business Letters",
    "Press Releases", "Work From Home",
]

const topTemplates = [
    "Business Plan", "Business Proposal", "Confidentiality Agreement", "Employee Handbook",
    "Marketing Plan", "Non-Disclosure Agreement", "Shareholders Agreement"
]

const TemplateFolder: React.FC<{name: string}> = ({name}) => (
    <div className="bg-bib-dark-3 p-3 rounded-md flex items-center space-x-3 cursor-pointer hover:bg-bib-dark-3/80">
        <Icon name={IconName.Folder} className="w-5 h-5 text-bib-light"/>
        <span className="text-sm">{name}</span>
    </div>
);

const TemplatePreview: React.FC<{name: string, onGenerate: (name: string) => void}> = ({name, onGenerate}) => (
    <div
        className="bg-bib-dark-3 rounded-lg cursor-pointer group"
        onClick={() => onGenerate(name)}
        data-testid="template-card"
        data-template-name={name}
        aria-label={`Generate ${name}`}
    >
        <div className="bg-bib-dark h-32 flex items-center justify-center rounded-t-lg border-b-2 border-transparent group-hover:border-blue-500 relative">
            <div className="w-24 h-24 bg-gray-600 p-2 rounded-md">
                <div className="bg-gray-700 h-full w-full"></div>
            </div>
             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-semibold flex items-center space-x-2"><Icon name={IconName.Sparkles} className="w-4 h-4"/><span>Generate</span></span>
            </div>
        </div>
        <div className="p-3">
             <p className="text-sm font-semibold truncate">Business in a Box</p>
             <p className="text-sm truncate">{name}</p>
        </div>
    </div>
);

export const TemplatesPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isGenerateModalOpen, setGenerateModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [userPrompt, setUserPrompt] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateClick = (templateName: string) => {
        setSelectedTemplate(templateName);
        setUserPrompt('');
        setGenerateModalOpen(true);
    }
    
    const handleGenerateDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerateModalOpen(false);
        setIsGenerating(true);
        setIsResultModalOpen(true);
        setGeneratedContent('');
        
        const prompt = buildCopilotTemplatePrompt({
            templateName: selectedTemplate,
            description: userPrompt,
        });
        try {
            const result = await generateText(prompt, 'gemini-2.5-pro');
            setGeneratedContent(result);
        } catch(err) {
            setGeneratedContent("There was an error generating the document.");
        } finally {
            setIsGenerating(false);
        }
    }
    
    const filteredModules = coreModules.filter(m => m.label.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredDocTypes = documentTypes.filter(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredTopTemplates = topTemplates.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex h-full bg-bib-dark-2 rounded-lg">
        <aside className="w-72 bg-bib-dark-3 p-4 rounded-l-lg border-r border-bib-dark-2 overflow-y-auto">
             {/* Nav */}
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Templates to Manage Every Aspect of Your Business</h3>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-bib-dark-3 rounded-md px-2">
                        <Icon name={IconName.Search} className="w-4 h-4 text-bib-light"/>
                        <input type="text" placeholder="Search for a template" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-transparent p-1.5 text-sm focus:outline-none w-48"/>
                    </div>
                </div>
            </div>

            {filteredModules.length > 0 && <section className="mb-8">
                <h4 className="font-semibold mb-4 flex items-center"><Icon name={IconName.ChevronDown} className="w-4 h-4 mr-2"/> 8 Core Business Modules</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredModules.map(module => (
                        <div key={module.label} className="bg-bib-dark-3 p-4 rounded-lg flex flex-col items-center justify-center space-y-3 cursor-pointer hover:bg-bib-dark-3/80">
                            <Icon name={module.icon} className="w-8 h-8 text-bib-light"/>
                            <span className="text-sm text-center font-semibold">{module.label}</span>
                        </div>
                    ))}
                </div>
            </section>}
            
            {filteredDocTypes.length > 0 && <section className="mb-8">
                <h4 className="font-semibold mb-4 flex items-center"><Icon name={IconName.ChevronDown} className="w-4 h-4 mr-2"/> Document Types</h4>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredDocTypes.map(type => <TemplateFolder key={type} name={type} />)}
                </div>
            </section>}
            
            {filteredTopTemplates.length > 0 && <section>
                <h4 className="font-semibold mb-4 flex items-center"><Icon name={IconName.ChevronDown} className="w-4 h-4 mr-2"/> Top 50 Templates</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                     {filteredTopTemplates.map(template => <TemplatePreview key={template} name={template} onGenerate={handleGenerateClick} />)}
                </div>
            </section>}
        </main>

        <Modal isOpen={isGenerateModalOpen} onClose={() => setGenerateModalOpen(false)} title="Generate with BRAINSAIT">
             <form onSubmit={handleGenerateDocument} className="space-y-4">
                <p className="text-sm text-bib-light">Provide a brief description of the <span className="font-bold text-white">{selectedTemplate}</span> you want to create.</p>
                <div>
                    <label htmlFor="userPrompt" className="block text-sm font-medium text-bib-light">Description</label>
                    <input type="text" id="userPrompt" value={userPrompt} onChange={e => setUserPrompt(e.target.value)} placeholder="e.g., A coffee shop in San Francisco" className="mt-1 block w-full bg-bib-dark-3 border-bib-dark-3 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-bib-blue focus:border-bib-blue sm:text-sm" autoFocus required />
                </div>
                 <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setGenerateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-bib-light bg-bib-dark-3 rounded-md hover:bg-bib-dark-2">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-bib-blue rounded-md hover:bg-blue-600">Generate</button>
                </div>
            </form>
        </Modal>

         <Modal isOpen={isResultModalOpen} onClose={() => setIsResultModalOpen(false)} title={`BRAINSAIT: Generated ${selectedTemplate}`}>
            <div>
                <p className="text-xs text-purple-400 mb-4">Powered by BRAINSAIT CORE ENGINE</p>
                {isGenerating ? (
                     <div className="animate-pulse">Generating your document...</div>
                ) : (
                    <div className="whitespace-pre-wrap bg-bib-dark-3 p-3 rounded-md text-bib-light-hover max-h-[60vh] overflow-y-auto">{generatedContent}</div>
                )}
                 <div className="flex justify-end mt-4">
                    <button type="button" onClick={() => setIsResultModalOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-bib-blue rounded-md hover:bg-blue-600">Close</button>
                </div>
            </div>
        </Modal>

    </div>
  );
};
