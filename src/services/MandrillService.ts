import { getAuth } from 'firebase/auth';

interface MandrillTemplate {
  name: string;
  slug: string;
}

/**
 * Service for interacting with Mandrill email templates
 */
export class MandrillService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || '';
    if (!this.apiUrl) {
      console.error('REACT_APP_API_URL is not defined in environment variables');
    }
  }

  /**
   * Get the current Firebase auth token
   */
  private async getToken(): Promise<string | null> {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error('No user is signed in');
      return null;
    }
    
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Get all Mandrill templates
   */
  public async getTemplates(): Promise<MandrillTemplate[]> {
    const token = await this.getToken();
    
    if (!token) {
      throw new Error('Authentication required. Please sign in again.');
    }
    
    try {
      console.log('Fetching Mandrill templates from:', `${this.apiUrl}/api/mandrill/templates`);
      
      const response = await fetch(`${this.apiUrl}/api/mandrill/templates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Always try to parse the response body, even if the status is not OK
      const data = await response.json().catch(error => {
        console.error('Error parsing response:', error);
        throw new Error('Failed to parse server response');
      });
      
      if (!response.ok) {
        console.error('Error response from server:', data);
        
        // Extract error message from response if available
        const errorMessage = data.error || `Failed to get templates: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      console.log('Successfully fetched templates:', data);
      return data;
    } catch (error: any) {
      console.error('Error fetching Mandrill templates:', error);
      
      // Provide more specific error messages based on common issues
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else if (error.message.includes('401') || error.message.includes('403')) {
        throw new Error('Authentication error. You may not have permission to access Mandrill templates.');
      } else if (error.message.includes('500')) {
        throw new Error('Server error. The Mandrill API may be experiencing issues.');
      }
      
      throw error;
    }
  }
} 