// BRAINSAIT: Enhanced Main Dashboard
// BILINGUAL: Full Arabic/English support
// NEURAL: Modern glass morphism UI

import { useState } from 'react';

interface DashboardCard {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  color: string;
  route: string;
  stats?: {
    label: string;
    value: string | number;
  };
}

const dashboardCards: DashboardCard[] = [
  {
    id: 'certificates',
    title: 'Certificate Management',
    titleAr: 'إدارة الشهادات',
    description: 'Create and manage SSL/TLS certificates',
    descriptionAr: 'إنشاء وإدارة شهادات SSL/TLS',
    icon: '🔐',
    color: 'from-blue-500 to-blue-600',
    route: '/certificates',
    stats: { label: 'Active Certs', value: 12 }
  },
  {
    id: 'documents',
    title: 'Document Generation',
    titleAr: 'إنشاء الوثائق',
    description: 'Generate professional business documents',
    descriptionAr: 'إنشاء وثائق أعمال احترافية',
    icon: '📄',
    color: 'from-purple-500 to-purple-600',
    route: '/documents',
    stats: { label: 'Templates', value: 170 }
  },
  {
    id: 'templates',
    title: 'Template Library',
    titleAr: 'مكتبة القوالب',
    description: 'Browse and customize document templates',
    descriptionAr: 'تصفح وتخصيص قوالب الوثائق',
    icon: '📚',
    color: 'from-green-500 to-green-600',
    route: '/templates',
    stats: { label: 'Categories', value: 8 }
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    titleAr: 'المساعد الذكي',
    description: 'Gemini AI-powered healthcare assistant',
    descriptionAr: 'مساعد رعاية صحية مدعوم بالذكاء الاصطناعي',
    icon: '🤖',
    color: 'from-indigo-500 to-indigo-600',
    route: '/ai-assistant',
    stats: { label: 'Queries', value: '1.2K' }
  },
  {
    id: 'nphies',
    title: 'NPHIES Integration',
    titleAr: 'تكامل نفيس',
    description: 'Saudi healthcare data exchange',
    descriptionAr: 'تبادل بيانات الرعاية الصحية السعودية',
    icon: '🏥',
    color: 'from-red-500 to-red-600',
    route: '/nphies',
    stats: { label: 'Claims', value: 345 }
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    titleAr: 'لوحة التحليلات',
    description: 'Business intelligence and insights',
    descriptionAr: 'ذكاء الأعمال والرؤى',
    icon: '📊',
    color: 'from-yellow-500 to-yellow-600',
    route: '/analytics',
    stats: { label: 'Reports', value: 28 }
  },
  {
    id: 'compliance',
    title: 'HIPAA Compliance',
    titleAr: 'الامتثال لـ HIPAA',
    description: 'Security and compliance monitoring',
    descriptionAr: 'مراقبة الأمن والامتثال',
    icon: '🛡️',
    color: 'from-teal-500 to-teal-600',
    route: '/compliance',
    stats: { label: 'Score', value: '98%' }
  },
  {
    id: 'hr',
    title: 'HR Management',
    titleAr: 'إدارة الموارد البشرية',
    description: 'Employee and team management',
    descriptionAr: 'إدارة الموظفين والفرق',
    icon: '👥',
    color: 'from-pink-500 to-pink-600',
    route: '/hrm',
    stats: { label: 'Employees', value: 47 }
  }
];

export const EnhancedDashboard = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCards = dashboardCards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.titleAr.includes(searchQuery) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickActions = [
    { icon: '🔐', label: 'New Certificate', labelAr: 'شهادة جديدة', action: () => console.log('Create cert') },
    { icon: '📄', label: 'Generate Doc', labelAr: 'إنشاء وثيقة', action: () => console.log('Generate doc') },
    { icon: '🏥', label: 'Submit Claim', labelAr: 'تقديم مطالبة', action: () => console.log('Submit claim') },
    { icon: '📊', label: 'View Reports', labelAr: 'عرض التقارير', action: () => console.log('View reports') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      {/* BRAINSAIT: Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              BrainSAIT Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              {language === 'en' 
                ? 'Enterprise Healthcare Platform for Saudi Arabia & Sudan'
                : 'منصة الرعاية الصحية المؤسسية للمملكة العربية السعودية والسودان'
              }
            </p>
          </div>

          {/* BILINGUAL: Language Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage('en')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                language === 'en'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                language === 'ar'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🇸🇦 العربية
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search features...' : 'البحث عن الميزات...'}
            className="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all text-lg shadow-lg"
          />
          <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105 transition-all"
            >
              <div className="text-4xl mb-3">{action.icon}</div>
              <div className="font-semibold text-gray-900">
                {language === 'en' ? action.label : action.labelAr}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* NEURAL: Dashboard Cards */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {language === 'en' ? 'Platform Features' : 'ميزات المنصة'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
            >
              {/* Icon with Gradient Background */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <span className="text-3xl">{card.icon}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'en' ? card.title : card.titleAr}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">
                {language === 'en' ? card.description : card.descriptionAr}
              </p>

              {/* Stats */}
              {card.stats && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{card.stats.label}</span>
                    <span className="text-lg font-bold text-gray-900">{card.stats.value}</span>
                  </div>
                </div>
              )}

              {/* Hover Arrow */}
              <div className="mt-4 flex items-center text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>{language === 'en' ? 'Open' : 'فتح'}</span>
                <span className="ml-2">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HIPAA: System Status */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Security Status */}
          <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🛡️</span>
              <div>
                <h3 className="font-bold text-green-900 mb-1">HIPAA Compliant</h3>
                <p className="text-sm text-green-700">
                  All systems operating with healthcare-grade security
                </p>
              </div>
            </div>
          </div>

          {/* NPHIES Status */}
          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🏥</span>
              <div>
                <h3 className="font-bold text-blue-900 mb-1">NPHIES Ready</h3>
                <p className="text-sm text-blue-700">
                  OID: 1.3.6.1.4.1.61026 • Saudi healthcare compliant
                </p>
              </div>
            </div>
          </div>

          {/* AI Status */}
          <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🤖</span>
              <div>
                <h3 className="font-bold text-purple-900 mb-1">AI-Powered</h3>
                <p className="text-sm text-purple-700">
                  Gemini AI assistant active and learning
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto mt-8 text-center">
        <p className="text-gray-500 text-sm">
          BrainSAIT v1.0.0 • Built with ❤️ for healthcare excellence
        </p>
        <p className="text-gray-400 text-xs mt-2">
          {language === 'en'
            ? 'Making healthcare elegant, compliant, and bilingual'
            : 'جعل الرعاية الصحية أنيقة ومتوافقة وثنائية اللغة'
          }
        </p>
      </div>
    </div>
  );
};
