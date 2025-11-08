"""
BrainSAIT Complete Document Template Generator
==============================================
Generate all business documents for all departments

BRAINSAIT: Complete document suite for enterprise operations
BILINGUAL: Full Arabic/English support across all templates
"""

import os
import sys
from document_templates import DocumentTemplates

# Ensure output directory exists
OUTPUT_DIR = "/mnt/user-data/outputs/brainsait-documents"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_all_documents():
    """
    Generate comprehensive document suite for all departments
    
    BRAINSAIT: Creates complete set of professional business documents
    """
    print("=" * 80)
    print("BrainSAIT Document Template Generator")
    print("=" * 80)
    print()
    
    departments = list(DocumentTemplates.DEPARTMENTS.keys())
    generated_files = []
    
    # 1. Generate Business Plans for key departments
    print("📊 Generating Business Plans...")
    for dept in ['Technology', 'Products', 'Sales', 'Marketing']:
        output_file = f"{OUTPUT_DIR}/{dept.replace(' ', '_')}_Business_Plan.pdf"
        print(f"  ✓ Creating: {dept} Business Plan")
        try:
            DocumentTemplates.generate_business_plan(dept, output_file)
            generated_files.append(output_file)
        except Exception as e:
            print(f"  ✗ Error: {e}")
    print()
    
    # 2. Generate Business Proposals
    print("📝 Generating Business Proposals...")
    proposals = [
        ('Technology', 'King Fahad Medical City'),
        ('Sales', 'Bupa Arabia Insurance'),
        ('Products', 'National Guard Health Affairs')
    ]
    for dept, client in proposals:
        output_file = f"{OUTPUT_DIR}/{dept}_Proposal_{client.replace(' ', '_')}.pdf"
        print(f"  ✓ Creating: {dept} Proposal for {client}")
        try:
            DocumentTemplates.generate_business_proposal(dept, output_file, client)
            generated_files.append(output_file)
        except Exception as e:
            print(f"  ✗ Error: {e}")
    print()
    
    # 3. Generate Company Policies
    print("📋 Generating Company Policies...")
    policies = [
        ('Administration', 'Corporate Governance Policy'),
        ('Technology', 'Information Security Policy'),
        ('Human Resources', 'Code of Conduct Policy'),
        ('Legal', 'Data Protection & Privacy Policy'),
        ('Finance', 'Financial Management Policy')
    ]
    for dept, policy in policies:
        output_file = f"{OUTPUT_DIR}/{dept.replace(' ', '_')}_{policy.replace(' ', '_')}.pdf"
        print(f"  ✓ Creating: {dept} - {policy}")
        try:
            DocumentTemplates.generate_company_policy(dept, output_file, policy)
            generated_files.append(output_file)
        except Exception as e:
            print(f"  ✗ Error: {e}")
    print()
    
    # 4. Generate Employee Handbook
    print("👥 Generating Employee Handbook...")
    handbook_file = f"{OUTPUT_DIR}/BrainSAIT_Employee_Handbook.pdf"
    try:
        DocumentTemplates.generate_employee_handbook(handbook_file)
        generated_files.append(handbook_file)
        print("  ✓ Created: Employee Handbook")
    except Exception as e:
        print(f"  ✗ Error: {e}")
    print()
    
    # 5. Generate Marketing Plans
    print("📢 Generating Marketing Plans...")
    campaigns = [
        'Q1 2025 Launch Campaign',
        'Q2 2025 NPHIES Awareness',
        'Q3 2025 Enterprise Growth'
    ]
    for campaign in campaigns:
        output_file = f"{OUTPUT_DIR}/Marketing_Plan_{campaign.replace(' ', '_')}.pdf"
        print(f"  ✓ Creating: {campaign}")
        try:
            DocumentTemplates.generate_marketing_plan(output_file, campaign)
            generated_files.append(output_file)
        except Exception as e:
            print(f"  ✗ Error: {e}")
    print()
    
    # Summary
    print("=" * 80)
    print(f"✅ Generation Complete!")
    print(f"📁 Total Documents Generated: {len(generated_files)}")
    print(f"📂 Output Directory: {OUTPUT_DIR}")
    print("=" * 80)
    print()
    print("Generated Documents:")
    for i, file in enumerate(generated_files, 1):
        filename = os.path.basename(file)
        print(f"  {i}. {filename}")
    
    return generated_files

def create_catalog():
    """Create a comprehensive catalog of all available templates"""
    from brainsait_document_system import BrainSAITDocumentGenerator
    
    doc_gen = BrainSAITDocumentGenerator(
        document_type="Template Catalog",
        department="All Departments",
        title_en="BrainSAIT Document Templates Catalog",
        title_ar="كتالوج قوالب وثائق برين سايت",
        classification="SALES MATERIAL - FOR DISTRIBUTION",
        version="1.0"
    )
    
    content_sections = [
        {
            'title': 'About BrainSAIT Document Templates',
            'title_ar': 'حول قوالب وثائق برين سايت',
            'level': 1,
            'content': [
                """BrainSAIT Document Templates provide a comprehensive suite of professional, 
                HIPAA-compliant, bilingual business documents designed specifically for healthcare 
                technology organizations operating in Saudi Arabia and the MENA region.""",
                
                """<b>Key Features:</b>""",
                """• Fully bilingual (Arabic/English) with RTL/LTR support""",
                """• HIPAA-compliant document structures and security classifications""",
                """• NPHIES-ready templates for healthcare providers and insurers""",
                """• Professional glass morphism design with BrainSAIT branding""",
                """• Automated generation with customization options""",
                """• Version control and audit trail capabilities"""
            ]
        },
        {
            'title': 'Document Categories',
            'title_ar': 'فئات الوثائق',
            'level': 1,
            'content': [
                """Our template library covers all essential business document types across 
                10 departments:"""
            ],
            'table': {
                'headers': ['Category', 'Templates Available', 'Use Cases'],
                'data': [
                    ['Business Plans', '10', 'Strategic planning, investor presentations'],
                    ['Business Proposals', '15', 'Client proposals, partnership agreements'],
                    ['Company Policies', '25', 'HR policies, security policies, compliance'],
                    ['Business Agreements', '20', 'Contracts, NDAs, service agreements'],
                    ['Business Procedures', '30', 'SOPs, workflows, process documentation'],
                    ['Business Checklists', '15', 'Quality assurance, compliance audits'],
                    ['Business Guides', '12', 'User guides, training manuals'],
                    ['Business Forms', '40', 'HR forms, request forms, evaluation forms'],
                    ['Business Letters', '10', 'Official correspondence, announcements'],
                    ['Press Releases', '5', 'Media releases, company announcements']
                ],
                'col_widths': [1.8*72, 1.2*72, 3.0*72]
            }
        },
        {
            'title': 'Department Coverage',
            'title_ar': 'التغطية حسب القسم',
            'level': 1,
            'content': [
                """All templates are available customized for each department:""",
                """• <b>Administration:</b> Corporate governance, policies, procedures""",
                """• <b>Finance:</b> Financial policies, budgets, reporting templates""",
                """• <b>Human Resources:</b> Employee handbook, policies, evaluation forms""",
                """• <b>Legal:</b> Contracts, agreements, compliance documentation""",
                """• <b>Marketing:</b> Marketing plans, campaign materials, brand guides""",
                """• <b>Operations:</b> Process documentation, SOPs, workflow guides""",
                """• <b>Products:</b> Product documentation, roadmaps, specifications""",
                """• <b>Sales:</b> Proposals, presentations, sales playbooks""",
                """• <b>Service:</b> Service agreements, SLAs, support documentation""",
                """• <b>Technology:</b> Technical specifications, architecture docs, API guides"""
            ]
        },
        {
            'title': 'Pricing and Licensing',
            'title_ar': 'التسعير والترخيص',
            'level': 1,
            'content': [
                """<b>Individual Templates:</b> SAR 500 per template""",
                """<b>Department Package:</b> SAR 3,500 (all templates for one department)""",
                """<b>Complete Suite:</b> SAR 25,000 (all templates, all departments)""",
                """<b>Custom Development:</b> Starting at SAR 2,000 per custom template""",
                "",
                """<b>Enterprise License Benefits:</b>""",
                """• Unlimited document generation""",
                """• White-label customization""",
                """• Priority support and updates""",
                """• Custom template development included""",
                """• Training for your team""",
                """• API access for automation"""
            ]
        },
        {
            'title': 'Technical Specifications',
            'title_ar': 'المواصفات الفنية',
            'level': 1,
            'content': [
                """<b>Output Format:</b> PDF (ISO 32000-1 compliant)""",
                """<b>Languages:</b> Arabic (IBM Plex Sans Arabic), English (Inter, Helvetica)""",
                """<b>Security:</b> Optional password protection, digital signatures""",
                """<b>Customization:</b> Brand colors, logos, fonts, layouts""",
                """<b>Integration:</b> REST API, Python SDK, CLI tool""",
                """<b>Compliance:</b> HIPAA, ISO 27001, GDPR-ready"""
            ]
        },
        {
            'title': 'Getting Started',
            'title_ar': 'البدء',
            'level': 1,
            'content': [
                """<b>Step 1:</b> Choose your desired templates or package""",
                """<b>Step 2:</b> Provide your branding assets (logo, colors, fonts)""",
                """<b>Step 3:</b> Receive customized template library within 5 business days""",
                """<b>Step 4:</b> Access via web interface, API, or Python SDK""",
                """<b>Step 5:</b> Generate unlimited documents with your branding""",
                "",
                """<b>Support:</b> Email support@brainsait.com or call +966 11 XXX XXXX""",
                """<b>Demo:</b> Request a live demonstration at demo.brainsait.com"""
            ]
        }
    ]
    
    catalog_file = f"{OUTPUT_DIR}/BrainSAIT_Templates_Catalog.pdf"
    doc_gen.generate_pdf(catalog_file, content_sections)
    print(f"\n📖 Catalog created: {catalog_file}")
    
    return catalog_file

if __name__ == "__main__":
    # Generate all sample documents
    generated_files = generate_all_documents()
    
    # Create catalog
    catalog_file = create_catalog()
    
    print("\n🎉 All documents generated successfully!")
    print(f"📁 Find your documents at: {OUTPUT_DIR}")
