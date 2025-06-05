
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Company, Link } from '@/types';

interface DashboardChartsProps {
  companies: Company[];
  links: Link[];
}

export default function DashboardCharts({ companies, links }: DashboardChartsProps) {
  const onlineLinks = links.filter(l => l.status === 'online').length;
  const offlineLinks = links.filter(l => l.status === 'offline').length;
  const errorLinks = links.filter(l => l.status === 'error').length;
  const pendingLinks = links.filter(l => l.status === 'pending').length;

  const statusData = [
    { name: 'Online', value: onlineLinks, color: '#10b981' },
    { name: 'Offline', value: offlineLinks, color: '#ef4444' },
    { name: 'Erro', value: errorLinks, color: '#f59e0b' },
    { name: 'Pendente', value: pendingLinks, color: '#6b7280' },
  ];

  const responseTimeData = links
    .filter(link => link.response_time && link.status === 'online')
    .slice(0, 10)
    .map(link => ({
      name: link.name.substring(0, 15) + '...',
      responseTime: link.response_time,
    }));

  const chartConfig = {
    online: { label: 'Online', color: '#10b981' },
    offline: { label: 'Offline', color: '#ef4444' },
    error: { label: 'Erro', color: '#f59e0b' },
    pending: { label: 'Pendente', color: '#6b7280' },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Distribution */}
      <Card className="bg-saas-black-light border-saas-gray/20">
        <CardHeader>
          <CardTitle className="text-white">Distribuição de Status</CardTitle>
          <CardDescription className="text-gray-400">
            Status atual de todos os links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Response Times */}
      <Card className="bg-saas-black-light border-saas-gray/20">
        <CardHeader>
          <CardTitle className="text-white">Tempo de Resposta</CardTitle>
          <CardDescription className="text-gray-400">
            Top 10 links por tempo de resposta (ms)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#9ca3af" />
                <Bar dataKey="responseTime" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
