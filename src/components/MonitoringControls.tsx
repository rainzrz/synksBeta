
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RefreshCw, Settings } from 'lucide-react';
import { useLinkMonitoring } from '@/hooks/useLinkMonitoring';

interface MonitoringControlsProps {
  userId?: string;
}

export default function MonitoringControls({ userId }: MonitoringControlsProps) {
  const [intervalMinutes, setIntervalMinutes] = useState(5);
  const [isAutoCheck, setIsAutoCheck] = useState(false);
  const { isMonitoring, startMonitoring, stopMonitoring, checkAllLinks } = useLinkMonitoring(userId);

  const handleToggleMonitoring = () => {
    if (isMonitoring) {
      stopMonitoring();
      setIsAutoCheck(false);
    } else {
      startMonitoring(intervalMinutes);
      setIsAutoCheck(true);
    }
  };

  const handleManualCheck = () => {
    checkAllLinks();
  };

  const handleIntervalChange = (value: string) => {
    const minutes = parseInt(value);
    if (minutes >= 1 && minutes <= 60) {
      setIntervalMinutes(minutes);
      
      // If monitoring is active, restart with new interval
      if (isMonitoring) {
        stopMonitoring();
        setTimeout(() => startMonitoring(minutes), 100);
      }
    }
  };

  return (
    <Card className="bg-saas-black-light border-saas-gray/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-saas-red" />
          Controles de Monitoramento
          {isMonitoring && (
            <Badge className="bg-green-500 text-white ml-2">
              Ativo
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure e controle a verificação automática dos seus links
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Verificação Automática</Label>
            <p className="text-sm text-gray-400">
              Verificar status dos links automaticamente
            </p>
          </div>
          <Switch
            checked={isAutoCheck}
            onCheckedChange={handleToggleMonitoring}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="interval" className="text-gray-300">
            Intervalo de Verificação (minutos)
          </Label>
          <Input
            id="interval"
            type="number"
            value={intervalMinutes}
            onChange={(e) => handleIntervalChange(e.target.value)}
            className="bg-saas-black border-saas-gray/20 text-white max-w-32"
            min="1"
            max="60"
            disabled={isMonitoring}
          />
          <p className="text-xs text-gray-400">
            Recomendado: 5-15 minutos para um bom equilíbrio
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleToggleMonitoring}
            className={`flex-1 ${
              isMonitoring 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-saas-red hover:bg-saas-red-dark'
            } text-white`}
          >
            {isMonitoring ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pausar Monitoramento
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Iniciar Monitoramento
              </>
            )}
          </Button>
          
          <Button
            onClick={handleManualCheck}
            variant="outline"
            className="border-saas-gray/20 text-gray-300 hover:text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Verificar Agora
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
