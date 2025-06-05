
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, Globe, Clock, TrendingUp } from 'lucide-react';
import { DashboardStats } from '@/types';

interface QuickStatsProps {
  stats: DashboardStats;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const statCards = [
    {
      title: 'Total de Links',
      value: stats.totalLinks,
      icon: <Link className="h-5 w-5 text-blue-400" />,
      description: `em ${stats.totalCompanies} empresas`
    },
    {
      title: 'Links Online',
      value: stats.onlineLinks,
      icon: <Globe className="h-5 w-5 text-green-400" />,
      description: `${stats.totalLinks > 0 ? Math.round((stats.onlineLinks / stats.totalLinks) * 100) : 0}% funcionando`
    },
    {
      title: 'Tempo Médio',
      value: `${stats.averageResponseTime}ms`,
      icon: <Clock className="h-5 w-5 text-yellow-400" />,
      description: 'tempo de resposta'
    },
    {
      title: 'Disponibilidade',
      value: `${stats.totalLinks > 0 ? Math.round(((stats.onlineLinks) / stats.totalLinks) * 100) : 0}%`,
      icon: <TrendingUp className="h-5 w-5 text-purple-400" />,
      description: 'uptime geral'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-saas-black-light border-saas-gray/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
