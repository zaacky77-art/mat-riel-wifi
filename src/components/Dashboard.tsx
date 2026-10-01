import { Device } from '../data/devices';
import {
  Wifi,
  WifiOff,
  Download,
  Upload,
  Clock,
  Activity,
  TrendingUp,
  Smartphone,
  Laptop,
  Tv,
  Tablet,
  Printer,
  Gamepad2,
  Speaker,
  Cpu,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DashboardProps {
  devices: Device[];
  onDeviceClick: (id: string) => void;
}

function getDeviceIcon(type: Device['type']) {
  switch (type) {
    case 'smartphone': return Smartphone;
    case 'laptop': return Laptop;
    case 'tablet': return Tablet;
    case 'smart-tv': return Tv;
    case 'printer': return Printer;
    case 'gaming': return Gamepad2;
    case 'speaker': return Speaker;
    case 'iot': return Cpu;
    default: return Wifi;
  }
}

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

export default function Dashboard({ devices, onDeviceClick }: DashboardProps) {
  const connectedDevices = devices.filter(d => d.isConnected);
  const totalDownload = devices.reduce((acc, d) => acc + d.totalDataUsed, 0);
  const totalBandwidth = devices.filter(d => d.isConnected).reduce((acc, d) => acc + d.downloadSpeed, 0);

  // Aggregate daily usage for the network
  const dailyNetworkUsage = devices[0]?.dailyUsage.map((_, dayIndex) => {
    const date = devices[0].dailyUsage[dayIndex].date;
    const download = devices.reduce((acc, d) => acc + (d.dailyUsage[dayIndex]?.download || 0), 0);
    const upload = devices.reduce((acc, d) => acc + (d.dailyUsage[dayIndex]?.upload || 0), 0);
    return { date, download: Math.round(download / 1024 * 10) / 10, upload: Math.round(upload / 1024 * 10) / 10 };
  }).slice(-14);

  // Data usage by device for pie chart
  const usageByDevice = devices
    .map(d => ({ name: d.name.split(' - ')[0].split(' (')[0], value: d.totalDataUsed }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const formatData = (mb: number) => {
    if (mb >= 1024 * 1024) return `${(mb / (1024 * 1024)).toFixed(1)} TB`;
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Appareils connectés</p>
              <p className="text-3xl font-bold text-white mt-1">{connectedDevices.length}</p>
              <p className="text-xs text-gray-500 mt-1">sur {devices.length} total</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <Wifi className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Bande passante active</p>
              <p className="text-3xl font-bold text-white mt-1">{totalBandwidth.toFixed(0)}<span className="text-lg text-gray-400"> Mbps</span></p>
              <p className="text-xs text-gray-500 mt-1">sur 1000 Mbps</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Données téléchargées</p>
              <p className="text-3xl font-bold text-white mt-1">{formatData(totalDownload)}</p>
              <p className="text-xs text-gray-500 mt-1">total cumulé</p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-lg">
              <Download className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Appareils hors ligne</p>
              <p className="text-3xl font-bold text-white mt-1">{devices.length - connectedDevices.length}</p>
              <p className="text-xs text-gray-500 mt-1">déconnectés</p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-lg">
              <WifiOff className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Traffic Chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Trafic réseau (14 derniers jours)</h3>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyNetworkUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={11}
                  tickFormatter={(val) => format(new Date(val), 'dd/MM', { locale: fr })}
                />
                <YAxis stroke="#6b7280" fontSize={11} unit=" GB" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                  labelFormatter={(val) => format(new Date(val as string), 'dd MMMM yyyy', { locale: fr })}
                  formatter={(value: number, name: string) => [`${value} GB`, name === 'download' ? 'Téléchargement' : 'Upload']}
                />
                <Area type="monotone" dataKey="download" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="download" />
                <Area type="monotone" dataKey="upload" stackId="2" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} name="upload" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Usage Pie Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Consommation par appareil</h3>
            <Upload className="w-5 h-5 text-purple-400" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={usageByDevice}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  dataKey="value"
                  stroke="none"
                >
                  {usageByDevice.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(value: number) => [formatData(value)]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-1.5">
            {usageByDevice.slice(0, 4).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-gray-400 truncate max-w-[120px]">{item.name}</span>
                </div>
                <span className="text-gray-300 font-medium">{formatData(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connected Devices Quick View */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Appareils connectés en ce moment</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {connectedDevices.map(device => {
            const Icon = getDeviceIcon(device.type);
            return (
              <button
                key={device.id}
                onClick={() => onDeviceClick(device.id)}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800 transition-all text-left"
              >
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{device.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{device.ipAddress}</span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-green-400">{device.downloadSpeed} Mbps</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {format(device.connectedSince, 'HH:mm', { locale: fr })}
                  </p>
                  <p className="text-xs text-gray-500">{device.band}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
