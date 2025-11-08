# BrainSAIT Document Templates - Quick Reference Guide

## 🚀 5-Minute Quick Start

### Generate Your First Document

```python
from document_templates import DocumentTemplates

# Generate a business plan
DocumentTemplates.generate_business_plan(
    department="Technology",
    output_path="my_plan.pdf"
)
```

**That's it!** Your professional, branded, bilingual business plan is ready.

---

## 📋 Common Commands

### 1. Business Plans
```python
DocumentTemplates.generate_business_plan(
    department="Sales",           # or Marketing, Finance, etc.
    output_path="sales_plan.pdf"
)
```

### 2. Business Proposals
```python
DocumentTemplates.generate_business_proposal(
    department="Technology",
    output_path="tech_proposal.pdf",
    client_name="ABC Hospital"
)
```

### 3. Company Policies
```python
DocumentTemplates.generate_company_policy(
    department="Human Resources",
    output_path="hr_policy.pdf",
    policy_name="Remote Work Policy"
)
```

### 4. Employee Handbook
```python
DocumentTemplates.generate_employee_handbook(
    output_path="handbook.pdf"
)
```

### 5. Marketing Plans
```python
DocumentTemplates.generate_marketing_plan(
    output_path="marketing.pdf",
    campaign_name="Q1 2025 Launch"
)
```

---

## 🎨 Brand Colors Reference

```python
MIDNIGHT_BLUE = '#1a365d'    # Primary
MEDICAL_BLUE = '#2b6cb8'      # Headings
SIGNAL_TEAL = '#0ea5e9'       # Accents
DEEP_ORANGE = '#ea580c'       # Alerts
PROFESSIONAL_GRAY = '#64748b' # Body text
```

---

## 📁 Available Departments

- ✅ Administration (الإدارة)
- ✅ Finance (المالية)
- ✅ Human Resources (الموارد البشرية)
- ✅ Legal (القانونية)
- ✅ Marketing (التسويق)
- ✅ Operations (العمليات)
- ✅ Products (المنتجات)
- ✅ Sales (المبيعات)
- ✅ Service (الخدمة)
- ✅ Technology (التقنية)

---

## 🔐 Security Classifications

- **PUBLIC**: General information, press releases
- **INTERNAL USE**: Company-wide documents
- **CONFIDENTIAL**: Sensitive business information
- **RESTRICTED**: PHI, PII, highly sensitive data
- **HIPAA PROTECTED**: Patient health information

---

## 📊 Custom Document Template

```python
from brainsait_document_system import BrainSAITDocumentGenerator

# Initialize generator
doc = BrainSAITDocumentGenerator(
    document_type="Custom Report",
    department="Technology",
    title_en="My Document",
    title_ar="وثيقتي",  # Optional
    classification="INTERNAL USE",
    version="1.0"
)

# Define content
sections = [
    {
        'title': 'Section 1',
        'level': 1,
        'content': ['Paragraph 1', 'Paragraph 2']
    },
    {
        'title': 'Section 2',
        'level': 1,
        'content': ['Content here'],
        'table': {
            'headers': ['Col 1', 'Col 2'],
            'data': [['Data 1', 'Data 2']]
        }
    }
]

# Generate PDF
doc.generate_pdf("output.pdf", sections)
```

---

## 🔧 Common Customizations

### Add Custom Section
```python
section = {
    'title': 'Custom Section',
    'title_ar': 'قسم مخصص',
    'level': 1,
    'content': [
        'Your content here',
        '<b>Bold text</b>',
        '<font color="#ea580c">Colored text</font>'
    ]
}
```

### Add Table
```python
table_section = {
    'title': 'Data Table',
    'level': 1,
    'content': ['Table description'],
    'table': {
        'headers': ['Header 1', 'Header 2', 'Header 3'],
        'data': [
            ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
            ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
        ],
        'col_widths': [2*72, 2*72, 2*72]  # 72 points = 1 inch
    }
}
```

### Add Bullet List
```python
content = doc.create_bullet_list([
    'First item',
    'Second item',
    'Third item'
])
```

---

## 🌍 Bilingual Content

### English Only
```python
title_en = "Information Security Policy"
title_ar = ""  # Leave empty
```

### Both Languages
```python
title_en = "Information Security Policy"
title_ar = "سياسة أمن المعلومات"
```

### Arabic Paragraphs
```python
content = [
    'English paragraph here',
    '<para align="right">نص عربي هنا</para>'
]
```

---

## ⚡ Batch Generation

```python
departments = ['Sales', 'Marketing', 'Technology']

for dept in departments:
    output = f"{dept}_Plan.pdf"
    DocumentTemplates.generate_business_plan(dept, output)
    print(f"✓ Generated: {output}")
```

---

## 📞 Need Help?

**Documentation**: README.md
**Support**: support@brainsait.com
**Phone**: +966 11 XXX XXXX
**Demo**: demo.brainsait.com

---

## 🎯 Pro Tips

1. **Use descriptive filenames**: `Technology_Business_Plan_2025.pdf`
2. **Version your documents**: Set `version="2.0"` for updates
3. **Add dates to titles**: Include quarter/year in document names
4. **Customize classifications**: Match your organization's security levels
5. **Test with samples first**: Generate examples before customizing

---

## ✅ Checklist for New Users

- [ ] Install dependencies: `pip install reportlab`
- [ ] Review sample documents in `/output`
- [ ] Generate first document using template
- [ ] Customize with your content
- [ ] Add your branding (colors, logo)
- [ ] Test bilingual content
- [ ] Integrate into workflows
- [ ] Train your team

---

**Built with ❤️ by BrainSAIT | محمية بواسطة برين سايت**
