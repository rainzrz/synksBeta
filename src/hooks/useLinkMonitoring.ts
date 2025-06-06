
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface Link {
  id: string;
  name: string;
  url: string;
  status: 'online' | 'offline' | 'error' | 'pending';
  response_time: number | null;
  last_checked: string | null;
  company_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useLinkMonitoring = (userId: string | undefined) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringInterval, setMonitoringInterval] = useState<NodeJS.Timeout | null>(null);

  const checkAllLinks = useCallback(async () => {
    if (!userId) return;

    try {
      console.log('Checking all links...');
      
      // Get all links
      const response = await apiClient.getLinks();
      if (response.error) {
        throw new Error(response.error);
      }

      const links = response.data || [];
      console.log(`Found ${links.length} links to check`);

      // Check each link
      for (const link of links) {
        try {
          console.log(`Checking link: ${link.name} (${link.url})`);
          
          const checkResponse = await apiClient.checkLink(link.id);
          if (checkResponse.error) {
            console.error(`Error checking link ${link.id}:`, checkResponse.error);
          } else {
            console.log(`Link ${link.name} checked successfully`);
            
            // Show notification if link went offline
            if (link.status === 'online' && checkResponse.data.status === 'offline') {
              toast.error(`🔴 Link offline: ${link.name}`, {
                description: `O link ${link.url} está fora do ar`,
                duration: 5000,
              });
            }
            
            // Show notification if link came back online
            if (link.status === 'offline' && checkResponse.data.status === 'online') {
              toast.success(`🟢 Link online: ${link.name}`, {
                description: `O link ${link.url} voltou ao ar`,
                duration: 5000,
              });
            }
          }
        } catch (error) {
          console.error(`Error checking individual link ${link.id}:`, error);
        }
        
        // Small delay between checks to avoid overwhelming
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log('Finished checking all links');
    } catch (error) {
      console.error('Error checking links:', error);
      toast.error('Erro ao verificar status dos links');
    }
  }, [userId]);

  const startMonitoring = useCallback((intervalMinutes: number = 5) => {
    console.log(`Starting monitoring with ${intervalMinutes} minute interval`);
    
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
    }

    // Run initial check
    checkAllLinks();

    // Set up recurring checks
    const interval = setInterval(() => {
      console.log('Running scheduled link check...');
      checkAllLinks();
    }, intervalMinutes * 60 * 1000);

    setMonitoringInterval(interval);
    setIsMonitoring(true);
    
    toast.success(`Monitoramento iniciado (${intervalMinutes} min)`, {
      description: 'Os links serão verificados automaticamente'
    });
  }, [checkAllLinks, monitoringInterval]);

  const stopMonitoring = useCallback(() => {
    console.log('Stopping monitoring');
    
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
      setIsMonitoring(false);
      toast.info('Monitoramento pausado');
    }
  }, [monitoringInterval]);

  useEffect(() => {
    return () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
      }
    };
  }, [monitoringInterval]);

  return {
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    checkAllLinks
  };
};
