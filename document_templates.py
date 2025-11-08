"""
BrainSAIT Document Templates Library
=====================================
Complete collection of business document templates for all departments

BRAINSAIT: Professional templates with audit logging
BILINGUAL: Arabic/English support for all document types
MEDICAL: HIPAA-compliant document structures
"""

from brainsait_document_system import BrainSAITDocumentGenerator
from datetime import datetime, timedelta
from typing import Dict, List, Any


class DocumentTemplates:
    """Master template library for all BrainSAIT documents"""
    
    # Department mapping with Arabic translations
    DEPARTMENTS = {
        'Administration': 'الإدارة',
        'Finance': 'المالية',
        'Human Resources': 'الموارد البشرية',
        'Legal': 'القانونية',
        'Marketing': 'التسويق',
        'Operations': 'العمليات',
        'Products': 'المنتجات',
        'Sales': 'المبيعات',
        'Service': 'الخدمة',
        'Technology': 'التقنية'
    }
    
    @staticmethod
    def generate_business_plan(department: str, output_path: str) -> str:
        """
        Generate comprehensive business plan template
        
        BRAINSAIT: Strategic planning document with financial projections
        """
        dept_ar = DocumentTemplates.DEPARTMENTS.get(department, department)
        
        doc_gen = BrainSAITDocumentGenerator(
            document_type="Business Plan",
            department=department,
            title_en=f"BrainSAIT {department} Business Plan 2025-2027",
            title_ar=f"خطة عمل {dept_ar} برين سايت 2025-2027",
            classification="CONFIDENTIAL - INTERNAL USE ONLY",
            version="1.0"
        )
        
        content_sections = [
            {
                'title': 'Executive Summary',
                'title_ar': 'الملخص التنفيذي',
                'level': 1,
                'content': [
                    """This business plan outlines the strategic direction, objectives, and operational 
                    framework for the BrainSAIT {dept} department for the period 2025-2027. Our mission 
                    is to deliver cutting-edge healthcare AI solutions that comply with international 
                    standards including HIPAA and NPHIES.""".format(dept=department),
                    
                    """<b>Key Objectives:</b> Drive innovation in healthcare technology, expand market 
                    presence in the Saudi Arabian healthcare sector, and maintain the highest standards 
                    of data security and patient privacy."""
                ]
            },
            {
                'title': 'Market Analysis',
                'title_ar': 'تحليل السوق',
                'level': 1,
                'content': [
                    """<b>Market Opportunity:</b> The Saudi Arabian healthcare IT market is projected 
                    to grow at 12.5% CAGR through 2027, driven by Vision 2030 digital transformation 
                    initiatives and NPHIES mandates.""",
                    
                    """<b>Target Market:</b> Healthcare providers, insurance companies, government 
                    health organizations, and private clinics across Saudi Arabia and the broader 
                    MENA region.""",
                    
                    """<b>Competitive Advantages:</b> Bilingual AI capabilities, NPHIES-native 
                    integration, HIPAA compliance, and deep healthcare domain expertise."""
                ]
            },
            {
                'title': 'Strategic Objectives',
                'title_ar': 'الأهداف الاستراتيجية',
                'level': 1,
                'content': [
                    """<b>Year 1 (2025):</b> Establish market presence with 25+ healthcare clients, 
                    achieve 500K+ processed claims, and build comprehensive NPHIES integration suite.""",
                    
                    """<b>Year 2 (2026):</b> Expand to 75+ clients, launch AI-powered clinical 
                    decision support tools, and achieve ISO 27001 certification.""",
                    
                    """<b>Year 3 (2027):</b> Scale to 150+ clients across MENA, introduce predictive 
                    analytics suite, and establish strategic partnerships with major EMR vendors."""
                ]
            },
            {
                'title': 'Financial Projections',
                'title_ar': 'التوقعات المالية',
                'level': 1,
                'content': [
                    """Financial projections are based on conservative growth estimates and proven 
                    market demand for healthcare AI solutions."""
                ],
                'table': {
                    'headers': ['Metric', '2025', '2026', '2027'],
                    'data': [
                        ['Revenue (SAR)', '5.2M', '12.8M', '28.5M'],
                        ['Gross Margin', '72%', '75%', '78%'],
                        ['EBITDA', '1.8M', '5.1M', '13.2M'],
                        ['Active Clients', '25', '75', '150'],
                        ['Team Size', '35', '65', '120']
                    ],
                    'col_widths': [2.5*72, 1.5*72, 1.5*72, 1.5*72]
                }
            },
            {
                'title': 'Operational Strategy',
                'title_ar': 'الاستراتيجية التشغيلية',
                'level': 1,
                'content': [
                    """<b>Technology Stack:</b> Cloud-native architecture on AWS/Azure, microservices 
                    with FastAPI, React/Next.js frontend, and comprehensive AI/ML pipeline.""",
                    
                    """<b>Compliance Framework:</b> HIPAA-compliant infrastructure, NPHIES certification, 
                    SOC 2 Type II audit readiness, and ISO 27001 preparation.""",
                    
                    """<b>Quality Assurance:</b> Automated testing with 95%+ coverage, continuous 
                    integration/deployment, and monthly security audits."""
                ]
            },
            {
                'title': 'Risk Management',
                'title_ar': 'إدارة المخاطر',
                'level': 1,
                'content': [
                    """<b>Technical Risks:</b> Regular system audits, redundant infrastructure, 
                    disaster recovery plans, and 99.9% uptime SLA.""",
                    
                    """<b>Compliance Risks:</b> Dedicated compliance team, quarterly external audits, 
                    comprehensive audit logging, and proactive regulatory monitoring.""",
                    
                    """<b>Market Risks:</b> Diversified client portfolio, flexible pricing models, 
                    continuous product innovation, and strong customer relationships."""
                ]
            }
        ]
        
        return doc_gen.generate_pdf(output_path, content_sections)
    
    @staticmethod
    def generate_business_proposal(department: str, output_path: str, 
                                   client_name: str = "Healthcare Partner") -> str:
        """
        Generate business proposal template
        
        BRAINSAIT: Client-facing proposal with technical specifications
        """
        dept_ar = DocumentTemplates.DEPARTMENTS.get(department, department)
        
        doc_gen = BrainSAITDocumentGenerator(
            document_type="Business Proposal",
            department=department,
            title_en=f"BrainSAIT Healthcare AI Platform - Proposal for {client_name}",
            title_ar=f"منصة برين سايت للذكاء الاصطناعي الصحي - مقترح لـ {client_name}",
            classification="CONFIDENTIAL - RECIPIENT ONLY"
        )
        
        content_sections = [
            {
                'title': 'Introduction',
                'title_ar': 'المقدمة',
                'level': 1,
                'content': [
                    f"""BrainSAIT is pleased to present this comprehensive proposal for implementing 
                    our Healthcare AI Platform at {client_name}. Our solution delivers NPHIES-compliant, 
                    bilingual healthcare technology with proven ROI and exceptional user experience.""",
                    
                    """<b>Our Expertise:</b> Over 5 years of healthcare technology development, 
                    registered OID (1.3.6.1.4.1.61026), HIPAA compliance, and deep understanding 
                    of Saudi healthcare regulations."""
                ]
            },
            {
                'title': 'Proposed Solution',
                'title_ar': 'الحل المقترح',
                'level': 1,
                'content': [
                    """<b>Core Platform Components:</b>""",
                    """• DocuLINC Lite: Intelligent document processing with OCR and AI classification""",
                    """• ClaimLINC Monitor: Real-time claims tracking and NPHIES integration""",
                    """• Voice2Care Studio: Voice-enabled clinical documentation""",
                    """• HealthBot Arabic: Bilingual patient engagement chatbot""",
                    """• Compliance Dashboard: Real-time audit and compliance monitoring"""
                ]
            },
            {
                'title': 'Technical Specifications',
                'title_ar': 'المواصفات الفنية',
                'level': 1,
                'content': [
                    """<b>Architecture:</b> Cloud-native, microservices-based, with 99.9% uptime SLA""",
                    """<b>Security:</b> End-to-end encryption, role-based access, comprehensive audit logs""",
                    """<b>Integration:</b> RESTful APIs, FHIR R4 support, HL7 compatibility, NPHIES-native""",
                    """<b>Scalability:</b> Handles 1000+ concurrent users, 50K+ transactions per day""",
                    """<b>Languages:</b> Full Arabic and English support with RTL/LTR layouts"""
                ]
            },
            {
                'title': 'Implementation Timeline',
                'title_ar': 'الجدول الزمني للتنفيذ',
                'level': 1,
                'content': [
                    """We propose a phased implementation approach to minimize disruption and 
                    ensure smooth adoption."""
                ],
                'table': {
                    'headers': ['Phase', 'Duration', 'Deliverables', 'Milestone'],
                    'data': [
                        ['1. Discovery', '2 weeks', 'Requirements analysis, integration planning', 
                         'Signed SOW'],
                        ['2. Setup', '3 weeks', 'Infrastructure setup, initial configuration', 
                         'Environment ready'],
                        ['3. Integration', '4 weeks', 'NPHIES integration, data migration', 
                         'Systems connected'],
                        ['4. Training', '2 weeks', 'User training, documentation', 
                         'Staff certified'],
                        ['5. Go-Live', '1 week', 'Production deployment, monitoring', 
                         'System operational']
                    ],
                    'col_widths': [1.2*72, 1.2*72, 2.5*72, 1.5*72]
                }
            },
            {
                'title': 'Investment & ROI',
                'title_ar': 'الاستثمار والعائد',
                'level': 1,
                'content': [
                    """<b>Implementation Investment:</b> SAR 450,000 (one-time)""",
                    """<b>Monthly Subscription:</b> SAR 35,000 (includes support, updates, hosting)""",
                    """<b>Expected ROI:</b> 6-8 months through:""",
                    """• 40% reduction in claims processing time""",
                    """• 25% decrease in claim rejection rates""",
                    """• 50% improvement in documentation efficiency""",
                    """• 30% reduction in compliance audit preparation time"""
                ]
            },
            {
                'title': 'Support & Maintenance',
                'title_ar': 'الدعم والصيانة',
                'level': 1,
                'content': [
                    """<b>24/7 Technical Support:</b> Bilingual support team with <2 hour response time""",
                    """<b>Regular Updates:</b> Monthly feature releases and security patches""",
                    """<b>Training Programs:</b> Quarterly refresher training and new feature workshops""",
                    """<b>Compliance Monitoring:</b> Continuous compliance checks and annual audits"""
                ]
            }
        ]
        
        return doc_gen.generate_pdf(output_path, content_sections)
    
    @staticmethod
    def generate_company_policy(department: str, output_path: str, 
                                policy_name: str = "Information Security Policy") -> str:
        """
        Generate company policy template
        
        MEDICAL: Compliance-focused policy documents with versioning
        """
        dept_ar = DocumentTemplates.DEPARTMENTS.get(department, department)
        
        doc_gen = BrainSAITDocumentGenerator(
            document_type="Company Policy",
            department=department,
            title_en=f"BrainSAIT {policy_name}",
            title_ar=f"سياسة برين سايت - {policy_name}",
            classification="INTERNAL USE - MANDATORY COMPLIANCE",
            version="2.1"
        )
        
        effective_date = datetime.now().strftime("%B %d, %Y")
        review_date = (datetime.now() + timedelta(days=365)).strftime("%B %d, %Y")
        
        content_sections = [
            {
                'title': 'Policy Information',
                'title_ar': 'معلومات السياسة',
                'level': 1,
                'content': [
                    f"""<b>Effective Date:</b> {effective_date}""",
                    f"""<b>Next Review Date:</b> {review_date}""",
                    f"""<b>Policy Owner:</b> {department} Department""",
                    f"""<b>Approved By:</b> BrainSAIT Executive Committee""",
                    f"""<b>Compliance Framework:</b> HIPAA, NPHIES, ISO 27001"""
                ]
            },
            {
                'title': '1. Purpose and Scope',
                'title_ar': '1. الغرض والنطاق',
                'level': 1,
                'content': [
                    """<b>Purpose:</b> This policy establishes the standards and requirements for 
                    information security across all BrainSAIT operations, systems, and data assets. 
                    It ensures compliance with healthcare regulations and protects patient health 
                    information (PHI) and personally identifiable information (PII).""",
                    
                    """<b>Scope:</b> This policy applies to all BrainSAIT employees, contractors, 
                    partners, and third-party vendors who have access to company systems, data, 
                    or facilities. It covers all information assets regardless of form or location."""
                ]
            },
            {
                'title': '2. Policy Statements',
                'title_ar': '2. بيانات السياسة',
                'level': 1,
                'content': [
                    """<b>2.1 Data Classification:</b> All data must be classified according to 
                    sensitivity levels: Public, Internal, Confidential, and Restricted (PHI/PII).""",
                    
                    """<b>2.2 Access Control:</b> Access to systems and data shall be granted based 
                    on the principle of least privilege and role-based access control (RBAC). All 
                    access requests must be approved by department managers and logged.""",
                    
                    """<b>2.3 Encryption:</b> All PHI and PII must be encrypted at rest using AES-256 
                    and in transit using TLS 1.3. Encryption keys must be managed using approved 
                    key management systems.""",
                    
                    """<b>2.4 Audit Logging:</b> All system access, data modifications, and security 
                    events must be logged with comprehensive audit trails retained for minimum 7 years. 
                    Logs must be regularly reviewed for anomalies.""",
                    
                    """<b>2.5 Incident Response:</b> Security incidents must be reported within 1 hour 
                    of discovery. The incident response team will investigate and remediate according 
                    to established procedures."""
                ]
            },
            {
                'title': '3. Roles and Responsibilities',
                'title_ar': '3. الأدوار والمسؤوليات',
                'level': 1,
                'content': [
                    """<b>Executive Management:</b> Approve policy, allocate resources, enforce compliance""",
                    """<b>Department Managers:</b> Implement policy in departments, approve access requests""",
                    """<b>IT Security Team:</b> Monitor compliance, conduct audits, manage security tools""",
                    """<b>All Employees:</b> Comply with policy, report incidents, complete training"""
                ]
            },
            {
                'title': '4. Compliance and Enforcement',
                'title_ar': '4. الامتثال والتطبيق',
                'level': 1,
                'content': [
                    """<b>Compliance Monitoring:</b> Quarterly audits will be conducted to ensure 
                    policy compliance. Non-compliance will be documented and remediation plans required.""",
                    
                    """<b>Training Requirements:</b> All personnel must complete annual security 
                    awareness training. New hires must complete training within 30 days.""",
                    
                    """<b>Violations:</b> Policy violations may result in disciplinary action up to 
                    and including termination. Serious violations will be reported to regulatory 
                    authorities as required by law."""
                ]
            },
            {
                'title': '5. Related Documents',
                'title_ar': '5. الوثائق ذات الصلة',
                'level': 1,
                'content': [
                    """• Acceptable Use Policy""",
                    """• Data Protection Policy""",
                    """• Incident Response Procedure""",
                    """• Access Control Procedure""",
                    """• HIPAA Compliance Manual""",
                    """• Business Continuity Plan"""
                ]
            }
        ]
        
        return doc_gen.generate_pdf(output_path, content_sections)
    
    @staticmethod
    def generate_employee_handbook(output_path: str) -> str:
        """
        Generate comprehensive employee handbook
        
        BRAINSAIT: HR policy manual with bilingual content
        """
        doc_gen = BrainSAITDocumentGenerator(
            document_type="Employee Handbook",
            department="Human Resources",
            title_en="BrainSAIT Employee Handbook",
            title_ar="دليل موظفي برين سايت",
            classification="INTERNAL USE - ALL EMPLOYEES",
            version="3.0"
        )
        
        content_sections = [
            {
                'title': 'Welcome to BrainSAIT',
                'title_ar': 'مرحباً بكم في برين سايت',
                'level': 1,
                'content': [
                    """Welcome to BrainSAIT! We are thrilled to have you join our team of healthcare 
                    technology innovators. This handbook provides essential information about our 
                    company culture, policies, and procedures.""",
                    
                    """<b>Our Mission:</b> To revolutionize healthcare delivery in the Middle East 
                    through AI-powered, compliant, and user-friendly technology solutions.""",
                    
                    """<b>Our Values:</b>""",
                    """• Innovation: Continuously pushing the boundaries of healthcare technology""",
                    """• Compliance: Unwavering commitment to patient privacy and regulatory standards""",
                    """• Excellence: Delivering exceptional quality in everything we do""",
                    """• Collaboration: Working together to achieve common goals"""
                ]
            },
            {
                'title': 'Employment Policies',
                'title_ar': 'سياسات التوظيف',
                'level': 1,
                'content': [
                    """<b>Equal Opportunity:</b> BrainSAIT is an equal opportunity employer committed 
                    to diversity and inclusion. We do not discriminate based on race, color, religion, 
                    sex, national origin, age, disability, or any other protected characteristic.""",
                    
                    """<b>Working Hours:</b> Standard working hours are Sunday-Thursday, 9:00 AM - 
                    6:00 PM. Flexible working arrangements and remote work options available with 
                    manager approval.""",
                    
                    """<b>Probation Period:</b> New employees have a 90-day probationary period with 
                    monthly performance reviews. Confirmation of employment requires satisfactory 
                    performance evaluation."""
                ]
            },
            {
                'title': 'Compensation and Benefits',
                'title_ar': 'التعويضات والمزايا',
                'level': 1,
                'content': [
                    """<b>Salary:</b> Competitive market-rate compensation paid monthly. Annual salary 
                    reviews conducted in Q1 based on performance and market conditions.""",
                    
                    """<b>Health Insurance:</b> Comprehensive medical, dental, and vision coverage for 
                    employees and eligible dependents. Coverage begins on the first day of employment.""",
                    
                    """<b>Annual Leave:</b> 30 days paid annual leave after completion of probation. 
                    Leave accrues monthly and can be carried forward up to 15 days.""",
                    
                    """<b>Professional Development:</b> Annual training budget of SAR 15,000 per employee 
                    for conferences, courses, and certifications."""
                ]
            },
            {
                'title': 'Code of Conduct',
                'title_ar': 'مدونة السلوك',
                'level': 1,
                'content': [
                    """<b>Professional Behavior:</b> All employees must maintain professional conduct, 
                    respect colleagues, and uphold BrainSAIT's reputation.""",
                    
                    """<b>Confidentiality:</b> Employees must protect confidential information including 
                    patient data, trade secrets, and proprietary technology. Confidentiality obligations 
                    continue after employment ends.""",
                    
                    """<b>Conflicts of Interest:</b> Employees must disclose any potential conflicts 
                    of interest and avoid situations that could compromise professional judgment."""
                ]
            },
            {
                'title': 'Technology and Security',
                'title_ar': 'التقنية والأمان',
                'level': 1,
                'content': [
                    """<b>Equipment:</b> BrainSAIT provides necessary equipment including laptop, 
                    monitors, and accessories. Equipment remains company property.""",
                    
                    """<b>Data Security:</b> Employees must follow all security policies, use strong 
                    passwords, enable MFA, and report security incidents immediately.""",
                    
                    """<b>HIPAA Compliance:</b> All employees handling PHI must complete HIPAA training 
                    within 30 days and annually thereafter. Violations will result in disciplinary action."""
                ]
            }
        ]
        
        return doc_gen.generate_pdf(output_path, content_sections)
    
    @staticmethod
    def generate_marketing_plan(output_path: str, campaign_name: str = "Q1 2025 Campaign") -> str:
        """Generate marketing plan template"""
        doc_gen = BrainSAITDocumentGenerator(
            document_type="Marketing Plan",
            department="Marketing",
            title_en=f"BrainSAIT Marketing Plan: {campaign_name}",
            title_ar=f"خطة التسويق برين سايت: {campaign_name}",
            classification="CONFIDENTIAL - MARKETING TEAM"
        )
        
        content_sections = [
            {
                'title': 'Campaign Overview',
                'title_ar': 'نظرة عامة على الحملة',
                'level': 1,
                'content': [
                    f"""<b>Campaign Name:</b> {campaign_name}""",
                    f"""<b>Duration:</b> January 1 - March 31, 2025""",
                    f"""<b>Budget:</b> SAR 750,000""",
                    f"""<b>Primary Objective:</b> Generate 150 qualified leads and close 15 new clients""",
                    f"""<b>Target Audience:</b> Healthcare providers, insurance companies, government 
                    health organizations in Saudi Arabia"""
                ]
            },
            {
                'title': 'Marketing Strategy',
                'title_ar': 'الاستراتيجية التسويقية',
                'level': 1,
                'content': [
                    """<b>Digital Marketing (40% of budget):</b>""",
                    """• LinkedIn advertising targeting healthcare executives""",
                    """• Google Search ads for NPHIES-related keywords""",
                    """• Content marketing: weekly blog posts, case studies, whitepapers""",
                    """• Email campaigns to qualified prospects""",
                    
                    """<b>Events and Partnerships (35% of budget):</b>""",
                    """• Sponsor Saudi Health Conference 2025""",
                    """• Host 3 webinars on NPHIES compliance""",
                    """• Partner with healthcare associations""",
                    
                    """<b>Direct Sales (25% of budget):</b>""",
                    """• Targeted account-based marketing for top 50 prospects""",
                    """• In-person product demonstrations""",
                    """• Custom proposals for enterprise clients"""
                ]
            },
            {
                'title': 'Success Metrics',
                'title_ar': 'مقاييس النجاح',
                'level': 1,
                'content': [
                    """<b>Lead Generation:</b> 150 qualified leads (MQL)""",
                    """<b>Conversion Rate:</b> 10% MQL to customer""",
                    """<b>Customer Acquisition Cost:</b> SAR 50,000 per client""",
                    """<b>Pipeline Value:</b> SAR 5M+ in opportunities""",
                    """<b>Brand Awareness:</b> 50% increase in website traffic"""
                ]
            }
        ]
        
        return doc_gen.generate_pdf(output_path, content_sections)


# Additional template functions can be added for:
# - NDA (Non-Disclosure Agreement)
# - Service Level Agreement
# - Business Forms
# - Employee Evaluation Forms
# - etc.
