// BRAINSAIT: Document Generation Service
// BILINGUAL: Support for Arabic/English document generation
// MEDICAL: Healthcare-compliant document templates

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const withBase = (path: string) => (API_BASE_URL ? `${API_BASE_URL}${path}` : path);

export interface DocumentRequest {
  templateId: string;
  language: 'en' | 'ar';
  department: string;
  title: string;
  author: string;
  customContent?: string;
  metadata?: Record<string, any>;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  description: string;
  icon: string;
  tags: string[];
  requiredFields: string[];
  supportedLanguages: ('en' | 'ar')[];
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  title: string;
  language: 'en' | 'ar';
  generatedDate: string;
  author: string;
  fileUrl: string;
  fileSize: number;
}

class DocumentService {
  private baseUrl = withBase('/api/documents');

  /**
   * BRAINSAIT: Generate a document from template
   * BILINGUAL: Supports Arabic and English
   */
  async generateDocument(request: DocumentRequest): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate document');
      }

      return await response.blob();
    } catch (error) {
      console.error('Document generation error:', error);
      throw error;
    }
  }

  /**
   * List available templates
   */
  async listTemplates(category?: string): Promise<DocumentTemplate[]> {
    try {
      const url = category 
        ? `${this.baseUrl}/templates?category=${category}`
        : `${this.baseUrl}/templates`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to list templates:', error);
      throw error;
    }
  }

  /**
   * Get template details
   */
  async getTemplate(templateId: string): Promise<DocumentTemplate> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/${templateId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get template:', error);
      throw error;
    }
  }

  /**
   * List user's generated documents
   */
  async listDocuments(): Promise<GeneratedDocument[]> {
    try {
      const response = await fetch(`${this.baseUrl}/list`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to list documents:', error);
      throw error;
    }
  }

  /**
   * Download a previously generated document
   */
  async downloadDocument(documentId: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/${documentId}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      return await response.blob();
    } catch (error) {
      console.error('Failed to download document:', error);
      throw error;
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      throw error;
    }
  }

  /**
   * BRAINSAIT: Batch generate multiple documents
   */
  async batchGenerate(requests: DocumentRequest[]): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/batch-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documents: requests }),
      });

      if (!response.ok) {
        throw new Error('Failed to batch generate documents');
      }

      // Returns a ZIP file with all documents
      return await response.blob();
    } catch (error) {
      console.error('Batch generation error:', error);
      throw error;
    }
  }

  /**
   * BILINGUAL: Get translations for a template
   */
  async getTemplateTranslations(templateId: string): Promise<Record<string, string>> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/${templateId}/translations`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch translations');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get translations:', error);
      throw error;
    }
  }
}

export const documentService = new DocumentService();
