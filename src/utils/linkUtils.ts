
import { LinkStatus } from "@/types";

// Function to check URL status
export const checkUrlStatus = async (url: string): Promise<{
  status: LinkStatus;
  responseTime?: number;
  error?: string;
}> => {
  const startTime = Date.now();
  
  try {
    // In a real application, we would use a backend API to check the URL status
    // For demo purposes, we'll simulate different statuses based on URLs
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo logic - in production this would be an actual HTTP request
    if (url.includes('invalidsite') || url.includes('offline')) {
      return { 
        status: 'offline',
        error: 'Site unavailable'
      };
    } else if (url.includes('localhost') || url.includes('error')) {
      return { 
        status: 'error',
        error: 'Connection refused'
      };
    } else {
      const responseTime = Date.now() - startTime;
      return { 
        status: 'online',
        responseTime
      };
    }
  } catch (error) {
    return { 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Format duration from milliseconds
export const formatDuration = (milliseconds: number): string => {
  if (milliseconds < 60000) {
    // Less than a minute
    const seconds = Math.floor(milliseconds / 1000);
    return `${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`;
  } else if (milliseconds < 3600000) {
    // Less than an hour
    const minutes = Math.floor(milliseconds / 60000);
    return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (milliseconds < 86400000) {
    // Less than a day
    const hours = Math.floor(milliseconds / 3600000);
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  } else {
    // Days or more
    const days = Math.floor(milliseconds / 86400000);
    return `${days} ${days === 1 ? 'dia' : 'dias'}`;
  }
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  try {
    // Check if URL has a scheme
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      // If no scheme, try with http://
      url = 'http://' + url;
    }
    
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Format URL for display (remove protocol, etc.)
export const formatUrlForDisplay = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + (urlObj.port ? ':' + urlObj.port : '') + urlObj.pathname;
  } catch (e) {
    return url;
  }
};
