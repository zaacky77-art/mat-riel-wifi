import { Device, networkInfo as NetworkInfoType } from '../data/devices';
import {
  Wifi,
  Shield,
  Router,
  Globe,
  Clock,
  Server,
  Lock,
  Radio,
  HardDrive,
  Users,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NetworkInfoProps {
  networkInfo: typeof NetworkInfoType;
  devices: Device[];
}

export default function NetworkInfo({ networkInfo, devices }: NetworkInfoProps) {
  const connectedDevices = devices.filter(d => d.isConnected);
  const totalDownload = devices.reduce((acc, d) => acc + d.downloadSpeed, 0);
  const bandwidth24 = connectedDevices.filter(d => d.band === '2.4GHz').length;
  const bandwidth5 = connectedDevices.filter(d => d.band === '5GHz').length;

  // Band usage data
  const bandData = [
    { name: '2.4 GHz', devices: bandwidth24, fill: '#f59e0b' },
    { name: '5 GHz', devices: bandwidth5, fill: '#3b82f6' },
  ];

  // Device type distribution
  const typeDistribution = devices.reduce((acc, d) => {
    const type = d.type;
    if (!acc[type]) acc[type] = 0;
    acc[type]++;
    return acc;
  }, {} as Record<string, number>);

  const typeData = Object.entries(typeDistribution).map(([type, count]) => ({
    name: type === 'smart-tv' ? 'Smart TV' : type === 'iot' ? 'IoT' : type.charAt(0).toUpperCase() + type.slice(1),
    count,
  }));

  const formatData = (mb: number) => {
    if (mb >= 1024 * 1024) return `${(mb / (1024 * 1024)).toFixed(1)} TB`;
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-800/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Router className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{networkInfo.router}</h2>
            <p className="text-sm text-gray-400">Routeur principal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
            <Wifi className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-xs text-gray-400">SSID</p>
              <p className="text-sm font-medium text-white">{networkInfo.ssid}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
            <Lock className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-xs text-gray-400">Sécurité</p>
              <p className="text-sm font-medium text-white">{networkInfo.security}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
            <Radio className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-xs text-gray-400">Bande</p>
              <p className="text-sm font-medium text-white">{networkInfo.band}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
            <Globe className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xs text-gray-400">IP Routeur</p>
              <p className="text-sm font-medium text-white">{networkInfo.routerIP}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
            <Server className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-xs text-gray-400">DNS</p>
              <p className="text-sm font-medium text-white">{networkInfo.dns}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-xs text-gray-400">Uptime</p>
              <p className="text-sm font-medium text-white">
                {formatDistanceToNow(networkInfo.uptime, { locale: fr })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bandwidth Usage */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Utilisation de la bande passante</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Bande passante utilisée</span>
              <span className="text-sm font-medium text-white">{totalDownload.toFixed(0)} / {networkInfo.totalBandwidth} Mbps</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                style={{ width: `${Math.min((totalDownload / networkInfo.totalBandwidth) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{((totalDownload / networkInfo.totalBandwidth) * 100).toFixed(1)}% utilisé</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total données (30j)</span>
                <span className="text-sm font-medium text-white">
                  {formatData(devices.reduce((acc, d) => acc + d.totalDataUsed, 0))}
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Appareils sur le réseau</span>
                <span className="text-sm font-medium text-white">{devices.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Band Distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Répartition par bande</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(value: number) => [`${value} appareils`]}
                />
                <Bar dataKey="devices" radius={[6, 6, 0, 0]}>
                  {bandData.map((entry, index) => (
                    <Bar key={index} dataKey="devices" fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Types */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Types d'appareils</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(value: number) => [`${value} appareil(s)`]}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* IP Address Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Table d'adresses IP</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Appareil</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Adresse IP</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">MAC</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Bande</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Statut</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Dernière activité</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(device => (
                <tr key={device.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 px-3 text-white font-medium">{device.name}</td>
                  <td className="py-3 px-3 text-gray-300 font-mono text-xs">{device.ipAddress}</td>
                  <td className="py-3 px-3 text-gray-400 font-mono text-xs">{device.macAddress}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      device.band === '5GHz' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {device.band}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {device.isConnected ? (
                      <span className="flex items-center gap-1 text-green-400 text-xs">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        En ligne
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">Hors ligne</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-xs">
                    {format(device.lastSeen, 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Sécurité du réseau</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Protection WPA3</span>
            </div>
            <p className="text-xs text-gray-400">Le réseau utilise le protocole de sécurité le plus récent et le plus robuste.</p>
          </div>
          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">DNS Sécurisé</span>
            </div>
            <p className="text-xs text-gray-400">Google DNS (8.8.8.8) configuré pour une résolution rapide et fiable.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
