# Contributing to BrainSAIT Core

Thank you for your interest in contributing to BrainSAIT Core! This document provides guidelines for authorized contributors.

## 🔐 Access & Authorization

This is a **proprietary project**. Contributors must:
- Be authorized BrainSAIT team members
- Have signed the necessary confidentiality agreements
- Have access credentials to the repository

## 🌲 Branch Strategy

We follow **Git Flow** workflow:

### Main Branches
- `main` - Production-ready code
- `develop` - Integration branch for features

### Supporting Branches
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes
- `release/*` - Release preparation

## 📝 Commit Message Format

Follow **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style/formatting
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks
- `security:` - Security improvements
- `compliance:` - HIPAA/NPHIES compliance

### Examples
```bash
feat(ai-assistant): add FHIR R4 patient resource support

Implemented FHIR R4 Patient resource creation with BrainSAIT OID namespace.
Includes validation and bilingual support.

Refs: #123
```

```bash
fix(templates): correct Arabic RTL layout in PDF generation

Fixed alignment issues in Arabic documents with proper RTL text flow.

Fixes: #456
```

## 🚀 Development Workflow

### 1. Create a Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -feature/your-feature-name
```

### 2. Make Changes
- Follow the code style guidelines
- Add appropriate comments using tags (MEDICAL, BRAINSAIT, HIPAA, etc.)
- Write/update tests
- Update documentation

### 3. Test Locally
```bash
# Frontend
npm run dev
npm run type-check

# Document generation
python3 generate_all.py
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat(scope): description"
```

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📋 Code Style Guidelines

### TypeScript/React
- Use **functional components** with hooks
- Use **TypeScript** for type safety
- Follow **BrainSAIT naming conventions**:
  - `PascalCase` for components and types
  - `camelCase` for functions and variables
- Always include bilingual support
- Add RTL/LTR handling for UI components

### Python
- Follow **PEP 8** style guide
- Use **snake_case** for functions and variables
- Use **PascalCase** for classes
- Add docstrings for all public functions
- Include type hints

### Code Comments
Use standardized tags:
```python
# MEDICAL: Handles clinical data
# BRAINSAIT: BrainSAIT-specific logic
# HIPAA: HIPAA compliance requirement
# NPHIES: NPHIES integration
# BILINGUAL: Translation logic
# TODO: Future enhancement
# FIXME: Known issue
# SECURITY: Security-critical code
```

## 🔒 Security Requirements

### Never Commit:
- API keys or secrets
- Passwords or credentials
- PHI (Protected Health Information)
- Personal identifiable information
- Internal system details

### Always:
- Use environment variables for secrets
- Encrypt PHI before storage
- Add audit logging for PHI access
- Follow RBAC principles
- Validate all inputs

## 🧪 Testing Requirements

### Frontend Tests
- Component rendering tests
- User interaction tests
- Bilingual display tests
- Accessibility tests

### Backend Tests
- Unit tests for functions
- FHIR validation tests
- Security tests
- Compliance tests

## 📚 Documentation

Update documentation when:
- Adding new features
- Changing APIs
- Modifying workflows
- Adding dependencies

Required documentation:
- Code comments
- README updates
- API documentation
- User guides (if applicable)

## 🔍 Code Review Process

All code must be reviewed before merging:

1. **Self-review** - Review your own PR first
2. **Peer review** - At least one team member review
3. **Security review** - For security-sensitive changes
4. **Compliance review** - For HIPAA/NPHIES related changes

### Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass and coverage maintained
- [ ] Documentation updated
- [ ] No secrets or PHI in code
- [ ] Bilingual support included
- [ ] Security best practices followed
- [ ] HIPAA/NPHIES compliance maintained

## 🚫 What NOT to Do

- Don't commit directly to `main` or `develop`
- Don't push large binary files
- Don't include generated files
- Don't bypass security checks
- Don't expose sensitive data
- Don't skip code review

## 📞 Getting Help

For questions or assistance:
- **Technical**: tech-team@brainsait.com
- **Security**: security@brainsait.com
- **Compliance**: compliance@brainsait.com

## 📖 Resources

- [BrainSAIT GitHub Copilot Instructions](.github/copilot-instructions.md)
- [FHIR R4 Documentation](https://hl7.org/fhir/R4/)
- [NPHIES Guidelines](https://nphies.sa.gov.sa)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa)

---

**Remember**: We're building healthcare software that handles sensitive patient data. Every line of code must prioritize security, compliance, and patient privacy.

**Thank you for contributing to BrainSAIT!** 🏥💙
