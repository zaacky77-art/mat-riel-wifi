import { useState } from 'react';
import { devices, networkInfo } from './data/devices';
import Dashboard from './components/Dashboard';
import DeviceList from './components/DeviceList';
import DeviceDetail from './components/DeviceDetail';
import NetworkInfo from './components/NetworkInfo';
import { Wifi, LayoutDashboard, Monitor, Info, Menu, X } from 'lucide-react';

type View = 'dashboard' | 'devices' | 'detail' | 'network';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDeviceClick = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setCurrentView('detail');
  };

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);

  const navItems = [
    { id: 'dashboard' as View, label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'devices' as View, label: 'Appareils', icon: Monitor },
    { id: 'network' as View, label: 'Réseau', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">WiFi Monitor</h1>
                <p className="text-xs text-gray-400">{networkInfo.ssid}</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentView === item.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Status indicator */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">
                {devices.filter(d => d.isConnected).length} appareils connectés
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-900">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    currentView === item.id
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'dashboard' && (
          <Dashboard devices={devices} onDeviceClick={handleDeviceClick} />
        )}
        {currentView === 'devices' && (
          <DeviceList devices={devices} onDeviceClick={handleDeviceClick} />
        )}
        {currentView === 'detail' && selectedDevice && (
          <DeviceDetail
            device={selectedDevice}
            onBack={() => setCurrentView('devices')}
          />
        )}
        {currentView === 'network' && <NetworkInfo networkInfo={networkInfo} devices={devices} />}
      </main>
    </div>
  );
}

export default App;
