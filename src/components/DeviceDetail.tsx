import { Device } from '../data/devices';
import {
  ArrowLeft,
  Wifi,
  WifiOff,
  Smartphone,
  Laptop,
  Tv,
  Tablet,
  Printer,
  Gamepad2,
  Speaker,
  Cpu,
  Clock,
  Download,
  Upload,
  Activity,
  Globe,
  Hash,
  Signal,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DeviceDetailProps {
  device: Device;
  onBack: () => void;
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

export default function DeviceDetail({ device, onBack }: DeviceDetailProps) {
  const Icon = getDeviceIcon(device.type);

  const formatData = (mb: number) => {
    if (mb >= 1024 * 1024) return `${(mb / (1024 * 1024)).toFixed(1)} TB`;
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  const chartData = device.dailyUsage.slice(-14).map(d => ({
    ...d,
    download: Math.round(d.download / 1024 * 100) / 100,
    upload: Math.round(d.upload / 1024 * 100) / 100,
  }));

  const sessionData = device.sessions.map(s => ({
    date: format(s.startTime, 'dd/MM HH:mm'),
    duree: s.endTime
      ? Math.round((s.endTime.getTime() - s.startTime.getTime()) / (1000 * 60 * 60) * 10) / 10
      : Math.round((new Date().getTime() - s.startTime.getTime()) / (1000 * 60 * 60) * 10) / 10,
    data: Math.round(s.dataUsed / 1024 * 100) / 100,
  }));

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à la liste
      </button>

      {/* Device Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className={`p-4 rounded-xl ${device.isConnected ? 'bg-blue-500/10' : 'bg-gray-800'}`}>
            <Icon className={`w-10 h-10 ${device.isConnected ? 'text-blue-400' : 'text-gray-500'}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-white">{device.name}</h2>
              {device.isConnected ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Connecté
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-700 text-gray-400 text-xs font-medium rounded-full">
                  <WifiOff className="w-3 h-3" />
                  Déconnecté
                </span>
              )}
            </div>
            <p className="text-gray-400 mt-1">{device.manufacturer} • {device.type}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{formatData(device.totalDataUsed)}</p>
            <p className="text-xs text-gray-400">Total consommé</p>
          </div>
        </div>
      </div>

      {/* Device Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-gray-400 mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-wider">Adresse IP</span>
          </div>
          <p className="text-sm font-medium text-white">{device.ipAddress}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-gray-400 mb-1">
            <Hash className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-wider">MAC</span>
          </div>
          <p className="text-sm font-medium text-white font-mono text-xs">{device.macAddress}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-gray-400 mb-1">
            <Signal className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-wider">Signal</span>
          </div>
          <p className="text-sm font-medium text-white">
            {device.signalStrength !== 0 ? `${device.signalStrength} dBm` : 'N/A'}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-gray-400 mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-wider">Bande</span>
          </div>
          <p className="text-sm font-medium text-white">{device.band}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-gray-400 mb-1">
            <Download className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-wider">Download</span>
          </div>
          <p className="text-sm font-medium text-cyan-400">
            {device.isConnected ? `${device.downloadSpeed} Mbps` : '-'}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-gray-400 mb-1">
            <Upload className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-wider">Upload</span>
          </div>
          <p className="text-sm font-medium text-purple-400">
            {device.isConnected ? `${device.uploadSpeed} Mbps` : '-'}
          </p>
        </div>
      </div>

      {/* Connection Time */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Historique des connexions</h3>
        </div>
        <div className="space-y-3">
          {device.sessions.map((session, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className={`w-2 h-2 rounded-full ${session.endTime ? 'bg-gray-500' : 'bg-green-400 animate-pulse'}`}></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-white">
                    {format(session.startTime, "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                  </span>
                  <span className="text-gray-500">→</span>
                  <span className="text-sm text-gray-300">
                    {session.endTime
                      ? format(session.endTime, "dd MMM yyyy 'à' HH:mm", { locale: fr })
                      : 'En cours...'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Durée: {session.endTime
                    ? formatDistanceToNow(session.startTime, { locale: fr }).replace('environ ', '~')
                    : `Depuis ${formatDistanceToNow(session.startTime, { locale: fr })}`
                  }
                  {' • '}
                  {formatData(session.dataUsed)} consommés
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Usage Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Consommation quotidienne (14 derniers jours)</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={11}
                tickFormatter={(val) => format(new Date(val), 'dd/MM')}
              />
              <YAxis stroke="#6b7280" fontSize={11} unit=" GB" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                labelFormatter={(val) => format(new Date(val as string), 'dd MMMM yyyy', { locale: fr })}
                formatter={(value: number, name: string) => [
                  `${value} GB`,
                  name === 'download' ? 'Téléchargement' : 'Upload'
                ]}
              />
              <Area type="monotone" dataKey="download" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="download" />
              <Area type="monotone" dataKey="upload" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="upload" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sessions Bar Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Durée des sessions (heures)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} unit="h" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(value: number) => [`${value}h`, 'Durée']}
              />
              <Bar dataKey="duree" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
