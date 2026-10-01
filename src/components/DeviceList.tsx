import { useState } from 'react';
import { Device } from '../data/devices';
import {
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
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  Download,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DeviceListProps {
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

type SortField = 'name' | 'data' | 'connected' | 'speed';
type FilterStatus = 'all' | 'connected' | 'disconnected';

export default function DeviceList({ devices, onDeviceClick }: DeviceListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredDevices = devices
    .filter(d => {
      if (filter === 'connected' && !d.isConnected) return false;
      if (filter === 'disconnected' && d.isConnected) return false;
      if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.ipAddress.includes(search)) return false;
      return true;
    })
    .sort((a, b) => {
      const multiplier = sortAsc ? 1 : -1;
      switch (sortField) {
        case 'name': return multiplier * a.name.localeCompare(b.name);
        case 'data': return multiplier * (a.totalDataUsed - b.totalDataUsed);
        case 'connected': return multiplier * (a.connectedSince.getTime() - b.connectedSince.getTime());
        case 'speed': return multiplier * (a.downloadSpeed - b.downloadSpeed);
        default: return 0;
      }
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const formatData = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  const getSignalColor = (signal: number) => {
    if (signal === 0) return 'text-gray-500';
    if (signal >= -50) return 'text-green-400';
    if (signal >= -65) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSignalBars = (signal: number) => {
    if (signal === 0) return 0;
    if (signal >= -50) return 4;
    if (signal >= -60) return 3;
    if (signal >= -70) return 2;
    return 1;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher un appareil ou une IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 text-xs font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Tous ({devices.length})
            </button>
            <button
              onClick={() => setFilter('connected')}
              className={`px-3 py-2 text-xs font-medium transition-colors ${filter === 'connected' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Wifi className="w-3 h-3 inline mr-1" />
              {devices.filter(d => d.isConnected).length}
            </button>
            <button
              onClick={() => setFilter('disconnected')}
              className={`px-3 py-2 text-xs font-medium transition-colors ${filter === 'disconnected' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <WifiOff className="w-3 h-3 inline mr-1" />
              {devices.filter(d => !d.isConnected).length}
            </button>
          </div>
        </div>
      </div>

      {/* Sort buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Trier par:
        </span>
        {[
          { field: 'name' as SortField, label: 'Nom' },
          { field: 'data' as SortField, label: 'Données' },
          { field: 'connected' as SortField, label: 'Connexion' },
          { field: 'speed' as SortField, label: 'Vitesse' },
        ].map(item => (
          <button
            key={item.field}
            onClick={() => handleSort(item.field)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              sortField === item.field
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white bg-gray-800 border border-gray-700'
            }`}
          >
            {item.label}
            {sortField === item.field && <ArrowUpDown className="w-3 h-3" />}
          </button>
        ))}
      </div>

      {/* Device List */}
      <div className="space-y-2">
        {filteredDevices.map(device => {
          const Icon = getDeviceIcon(device.type);
          const signalBars = getSignalBars(device.signalStrength);

          return (
            <button
              key={device.id}
              onClick={() => onDeviceClick(device.id)}
              className="w-full flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-blue-500/50 hover:bg-gray-800/50 transition-all text-left group"
            >
              {/* Icon */}
              <div className={`p-3 rounded-lg ${device.isConnected ? 'bg-blue-500/10' : 'bg-gray-800'}`}>
                <Icon className={`w-6 h-6 ${device.isConnected ? 'text-blue-400' : 'text-gray-500'}`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">{device.name}</p>
                  {device.isConnected ? (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-medium rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      En ligne
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-gray-700 text-gray-400 text-[10px] font-medium rounded-full">
                      Hors ligne
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">{device.ipAddress}</span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-400">{device.manufacturer}</span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-400">{device.band}</span>
                </div>
              </div>

              {/* Connection time */}
              <div className="hidden sm:block text-right">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {device.isConnected
                    ? formatDistanceToNow(device.connectedSince, { locale: fr, addSuffix: false })
                    : format(device.lastSeen, 'dd/MM HH:mm', { locale: fr })
                  }
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {device.isConnected ? 'connecté depuis' : 'vu pour la dernière fois'}
                </p>
              </div>

              {/* Data usage */}
              <div className="hidden md:block text-right min-w-[80px]">
                <div className="flex items-center gap-1 text-sm font-medium text-white">
                  <Download className="w-3 h-3 text-purple-400" />
                  {formatData(device.totalDataUsed)}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">consommation</p>
              </div>

              {/* Speed */}
              {device.isConnected && (
                <div className="hidden lg:block text-right min-w-[70px]">
                  <p className="text-sm font-medium text-cyan-400">{device.downloadSpeed} Mbps</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">↓ {device.uploadSpeed} Mbps ↑</p>
                </div>
              )}

              {/* Signal */}
              <div className="hidden sm:flex flex-col items-center gap-0.5">
                <div className="flex items-end gap-0.5 h-4">
                  {[1, 2, 3, 4].map(bar => (
                    <div
                      key={bar}
                      className={`w-1 rounded-full transition-colors ${
                        bar <= signalBars ? getSignalColor(device.signalStrength) : 'bg-gray-700'
                      }`}
                      style={{ height: `${bar * 25}%` }}
                    ></div>
                  ))}
                </div>
                <span className={`text-[9px] ${getSignalColor(device.signalStrength)}`}>
                  {device.signalStrength !== 0 ? `${device.signalStrength}dBm` : '-'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <WifiOff className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Aucun appareil trouvé</p>
          <p className="text-sm text-gray-500 mt-1">Essayez de modifier vos filtres</p>
        </div>
      )}
    </div>
  );
}
