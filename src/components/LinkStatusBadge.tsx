
import React from "react";
import { Badge } from "@/components/ui/badge";
import { LinkStatus } from "@/types";
import { 
  LinkIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertCircleIcon, 
  ClockIcon 
} from "lucide-react";

interface LinkStatusBadgeProps {
  status: LinkStatus;
  downtime?: {
    since?: Date;
    duration?: string;
  };
  lastChecked?: Date;
}

export const LinkStatusBadge: React.FC<LinkStatusBadgeProps> = ({ 
  status, 
  downtime, 
  lastChecked 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          variant: "default" as const,
          label: "Online",
          icon: <CheckCircleIcon className="w-3 h-3 mr-1" />,
          bgClass: "bg-green-600 hover:bg-green-700"
        };
      case "offline":
        return {
          variant: "destructive" as const,
          label: "Offline",
          icon: <XCircleIcon className="w-3 h-3 mr-1" />,
          bgClass: "bg-red-600 hover:bg-red-700"
        };
      case "error":
        return {
          variant: "secondary" as const,
          label: "Erro",
          icon: <AlertCircleIcon className="w-3 h-3 mr-1" />,
          bgClass: "bg-orange-500 hover:bg-orange-600"
        };
      case "loading":
        return {
          variant: "secondary" as const,
          label: "Verificando",
          icon: <ClockIcon className="w-3 h-3 mr-1 animate-spin" />,
          bgClass: "bg-blue-500 hover:bg-blue-600"
        };
      default:
        return {
          variant: "outline" as const,
          label: "Desconhecido",
          icon: <LinkIcon className="w-3 h-3 mr-1" />,
          bgClass: "bg-gray-500 hover:bg-gray-600"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="space-y-1">
      <Badge 
        variant={config.variant} 
        className={`${config.bgClass} whitespace-nowrap text-white flex items-center`}
      >
        {config.icon}
        {config.label}
      </Badge>
      {status === "offline" && downtime?.since && (
        <div className="text-xs text-red-500 flex items-center">
          <ClockIcon className="w-3 h-3 mr-1" />
          {downtime.duration || "Offline há pouco tempo"}
        </div>
      )}
      {lastChecked && (
        <div className="text-xs text-gray-500">
          Verificado: {new Date(lastChecked).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default LinkStatusBadge;
