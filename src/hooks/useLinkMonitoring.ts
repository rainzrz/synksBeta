
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link, LinkStatus } from '@/types';
import { toast } from 'sonner';

export const useLinkMonitoring = (userId: string | undefined) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringInterval, setMonitoringInterval] = useState<NodeJS.Timeout | null>(null);

  const checkLinkStatus = async (link: Link): Promise<{ status: LinkStatus; responseTime: number }> => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(link.url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      const responseTime = Date.now() - startTime;
      
      if (response.ok || response.type === 'opaque') {
        return { status: 'online', responseTime };
      } else {
        return { status: 'offline', responseTime };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return { status: 'error', responseTime };
    }
  };

  const updateLinkStatus = async (linkId: string, status: LinkStatus, responseTime: number) => {
    try {
      await supabase
        .from('links')
        .update({
          status,
          response_time: responseTime,
          last_checked: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', linkId);
    } catch (error) {
      console.error('Error updating link status:', error);
    }
  };

  const checkAllLinks = useCallback(async () => {
    if (!userId) return;

    try {
      const { data: linksData, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // Type cast the data to ensure proper typing
      const links = linksData?.map(link => ({
        ...link,
        status: link.status as LinkStatus
      })) as Link[] || [];

      for (const link of links) {
        const { status, responseTime } = await checkLinkStatus(link);
        
        // Show notification if link went offline
        if (link.status === 'online' && status === 'offline') {
          toast.error(`🔴 Link offline: ${link.name}`, {
            description: `O link ${link.url} está fora do ar`,
            duration: 5000,
          });
        }
        
        // Show notification if link came back online
        if (link.status === 'offline' && status === 'online') {
          toast.success(`🟢 Link online: ${link.name}`, {
            description: `O link ${link.url} voltou ao ar`,
            duration: 5000,
          });
        }

        await updateLinkStatus(link.id, status, responseTime);
        
        // Small delay between checks to avoid overwhelming
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error checking links:', error);
      toast.error('Erro ao verificar status dos links');
    }
  }, [userId]);

  const startMonitoring = useCallback((intervalMinutes: number = 5) => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
    }

    // Run initial check
    checkAllLinks();

    // Set up recurring checks
    const interval = setInterval(() => {
      checkAllLinks();
    }, intervalMinutes * 60 * 1000);

    setMonitoringInterval(interval);
    setIsMonitoring(true);
    
    toast.success(`Monitoramento iniciado (${intervalMinutes} min)`, {
      description: 'Os links serão verificados automaticamente'
    });
  }, [checkAllLinks, monitoringInterval]);

  const stopMonitoring = useCallback(() => {
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
