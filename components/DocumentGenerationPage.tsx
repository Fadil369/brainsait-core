// BRAINSAIT: Document Generation Center
// BILINGUAL: Full Arabic/English document generation support
// MEDICAL: Healthcare-compliant document templates

import { useEffect, useState } from 'react';
import { documentService, type DocumentTemplate } from '../services/documentService';

const fallbackTemplates: DocumentTemplate[] = [
  {
    id: 'business-plan',
    name: 'Business Plan',
    nameAr: 'خطة العمل',
    category: 'Strategy',
    description: '3-year strategic business plan with financial projections',
    icon: '📊',
    tags: ['strategy', 'finance', 'planning'],
    requiredFields: ['department', 'title', 'author'],
    supportedLanguages: ['en', 'ar']
  },
  {
    id: 'proposal',
    name: 'Business Proposal',
    nameAr: 'عرض تجاري',
    category: 'Sales',
    description: 'Professional client proposal with pricing and timeline',
    icon: '📝',
    tags: ['sales', 'client', 'proposal'],
    requiredFields: ['department', 'title'],
    supportedLanguages: ['en', 'ar']
  },
  {
    id: 'policy',
    name: 'Company Policy',
    nameAr: 'سياسة الشركة',
    category: 'Administration',
    description: 'HIPAA-compliant company policy document',
    icon: '📋',
    tags: ['policy', 'compliance', 'HIPAA'],
    requiredFields: ['department', 'title'],
    supportedLanguages: ['en', 'ar']
  },
  {
    id: 'employee-handbook',
    name: 'Employee Handbook',
    nameAr: 'دليل الموظف',
    category: 'HR',
    description: 'Comprehensive bilingual employee handbook',
    icon: '👥',
    tags: ['HR', 'employees', 'handbook'],
    requiredFields: ['department', 'title'],
    supportedLanguages: ['en', 'ar']
  },
  {
    id: 'marketing-plan',
    name: 'Marketing Plan',
    nameAr: 'خطة التسويق',
    category: 'Marketing',
    description: 'Quarterly marketing campaign with budget and metrics',
    icon: '📢',
    tags: ['marketing', 'campaign', 'planning'],
    requiredFields: ['department', 'title'],
    supportedLanguages: ['en', 'ar']
  },
  {
    id: 'healthcare-form',
    name: 'Healthcare Form',
    nameAr: 'نموذج صحي',
    category: 'Healthcare',
    description: 'NPHIES-compliant healthcare documentation',
    icon: '🏥',
    tags: ['healthcare', 'NPHIES', 'medical'],
    requiredFields: ['department', 'title'],
    supportedLanguages: ['en', 'ar']
  }
];

export const DocumentGenerationPage = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(fallbackTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [formData, setFormData] = useState({
    department: '',
    title: '',
    author: '',
    customContent: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const categories = ['all', 'Strategy', 'Sales', 'Administration', 'HR', 'Marketing', 'Healthcare'];

  useEffect(() => {
    const loadTemplates = async () => {
      setTemplatesLoading(true);
      try {
        const remoteTemplates = await documentService.listTemplates();
        if (remoteTemplates.length) {
          setTemplates(remoteTemplates);
          setTemplatesError(null);
          return;
        }
      } catch (error) {
        console.warn('Falling back to local templates', error);
        setTemplatesError('Using local templates because the API is unreachable.');
      } finally {
        setTemplatesLoading(false);
      }
    };

    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      const updated = templates.find(t => t.id === selectedTemplate.id);
      if (updated) {
        setSelectedTemplate(updated);
      }
    }
  }, [templates]);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.nameAr.includes(searchQuery) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGenerateDocument = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);

    try {
      const blob = await documentService.generateDocument({
        templateId: selectedTemplate.id,
        language,
        department: formData.department,
        title: formData.title,
        author: formData.author,
        customContent: formData.customContent,
        metadata: {
          requestedAt: new Date().toISOString(),
        },
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate.id}-${language}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setStatusMessage({ type: 'success', message: 'Document generated successfully.' });
    } catch (error) {
      console.error('Failed to generate document:', error);
      setStatusMessage({ type: 'error', message: 'Failed to generate document. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      {/* BRAINSAIT: Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          📄 Document Generation Center
        </h1>
        <p className="text-gray-600">
          Create professional bilingual business documents with AI-powered templates
        </p>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates... / البحث عن القوالب..."
                className="w-full px-6 py-4 pl-14 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
            </div>
          </div>

          {/* BILINGUAL: Language Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  language === 'ar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🇸🇦 العربية
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {templatesLoading && (
          <div className="col-span-full text-center text-blue-700 bg-blue-50 border border-blue-200 rounded-xl py-4">
            Loading templates from BrainSAIT Core...
          </div>
        )}
        {templatesError && (
          <div className="col-span-full text-center text-amber-700 bg-amber-50 border border-amber-200 rounded-xl py-3">
            {templatesError}
          </div>
        )}
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className={`bg-white rounded-2xl p-6 shadow-lg border-2 cursor-pointer transition-all hover:shadow-xl ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-5xl mb-4">{template.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'en' ? template.name : template.nameAr}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {template.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">{template.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* BRAINSAIT: Document Configuration Panel */}
      {selectedTemplate && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-2xl border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">{selectedTemplate.icon}</span>
            Configure {language === 'en' ? selectedTemplate.name : selectedTemplate.nameAr}
          </h2>

          {statusMessage && (
            <div
              className={`mb-6 rounded-xl p-4 text-sm font-semibold ${
                statusMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {statusMessage.message}
            </div>
          )}

          <div className="space-y-6">
            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department / القسم
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="">Select Department</option>
                <option value="Technology">Technology / التقنية</option>
                <option value="Products">Products / المنتجات</option>
                <option value="Sales">Sales / المبيعات</option>
                <option value="Marketing">Marketing / التسويق</option>
                <option value="HR">Human Resources / الموارد البشرية</option>
                <option value="Finance">Finance / المالية</option>
                <option value="Legal">Legal / القانونية</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Document Title / عنوان الوثيقة
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter document title..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Author / المؤلف
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Your name..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>

            {/* Custom Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Content / محتوى إضافي (Optional)
              </label>
              <textarea
                value={formData.customContent}
                onChange={(e) => setFormData({ ...formData, customContent: e.target.value })}
                placeholder="Add any custom content or notes..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateDocument}
              disabled={!formData.department || !formData.title || isGenerating}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin text-2xl">⚙️</span>
                  Generating Document...
                </>
              ) : (
                <>
                  <span className="text-2xl">✨</span>
                  Generate {language === 'en' ? 'English' : 'Arabic'} Document
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* HIPAA: Compliance Note */}
      <div className="max-w-7xl mx-auto mt-8 bg-green-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-start gap-4">
          <span className="text-3xl">✅</span>
          <div>
            <h3 className="font-bold text-green-900 mb-2">Enterprise-Grade Quality</h3>
            <p className="text-green-700 text-sm">
              All documents are generated with professional formatting, bilingual support,
              and HIPAA/NPHIES compliance where applicable. Documents include BrainSAIT branding
              and OID namespace (1.3.6.1.4.1.61026) for healthcare documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
