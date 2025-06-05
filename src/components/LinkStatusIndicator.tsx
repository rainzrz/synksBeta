
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { LinkStatus } from '@/types';

interface LinkStatusIndicatorProps {
  status: LinkStatus;
  responseTime?: number | null;
  lastChecked?: string | null;
}

export default function LinkStatusIndicator({ 
  status, 
  responseTime, 
  lastChecked 
}: LinkStatusIndicatorProps) {
  const getStatusConfig = (status: LinkStatus) => {
    switch (status) {
      case 'online':
        return {
          variant: 'default' as const,
          className: 'bg-green-500 hover:bg-green-600 text-white',
          icon: <Wifi className="h-3 w-3" />,
          label: 'Online'
        };
      case 'offline':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-500 hover:bg-red-600 text-white',
          icon: <WifiOff className="h-3 w-3" />,
          label: 'Offline'
        };
      case 'error':
        return {
          variant: 'secondary' as const,
          className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
          icon: <AlertTriangle className="h-3 w-3" />,
          label: 'Erro'
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-gray-500 hover:bg-gray-600 text-white',
          icon: <Clock className="h-3 w-3" />,
          label: 'Pendente'
        };
    }
  };

  const config = getStatusConfig(status);
  
  const formatLastChecked = (dateString?: string | null) => {
    if (!dateString) return 'Nunca verificado';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };

  const tooltipContent = (
    <div className="text-sm">
      <div className="font-medium">{config.label}</div>
      {responseTime && (
        <div className="text-gray-300">
          Tempo: {responseTime}ms
        </div>
      )}
      <div className="text-gray-300">
        {formatLastChecked(lastChecked)}
      </div>
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={config.variant} className={`${config.className} gap-1 cursor-help`}>
          {config.icon}
          {config.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
}
