export interface Device {
  id: string;
  name: string;
  macAddress: string;
  ipAddress: string;
  type: 'smartphone' | 'laptop' | 'tablet' | 'smart-tv' | 'iot' | 'printer' | 'gaming' | 'speaker';
  manufacturer: string;
  isConnected: boolean;
  connectedSince: Date;
  lastSeen: Date;
  totalDataUsed: number; // in MB
  downloadSpeed: number; // in Mbps
  uploadSpeed: number; // in Mbps
  signalStrength: number; // -100 to 0 dBm
  band: '2.4GHz' | '5GHz';
  sessions: Session[];
  dailyUsage: DailyUsage[];
}

export interface Session {
  startTime: Date;
  endTime: Date | null;
  dataUsed: number; // in MB
}

export interface DailyUsage {
  date: string;
  download: number; // in MB
  upload: number; // in MB
}

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

function generateDailyUsage(days: number, avgDownload: number, avgUpload: number): DailyUsage[] {
  const usage: DailyUsage[] = [];
  for (let i = days; i >= 0; i--) {
    const date = daysAgo(i);
    const dateStr = date.toISOString().split('T')[0];
    const variation = 0.5 + Math.random();
    usage.push({
      date: dateStr,
      download: Math.round(avgDownload * variation),
      upload: Math.round(avgUpload * variation),
    });
  }
  return usage;
}

export const devices: Device[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro - Ahmed',
    macAddress: 'A4:83:E7:2B:1C:4F',
    ipAddress: '192.168.1.101',
    type: 'smartphone',
    manufacturer: 'Apple',
    isConnected: true,
    connectedSince: hoursAgo(3),
    lastSeen: now,
    totalDataUsed: 2450,
    downloadSpeed: 45.2,
    uploadSpeed: 12.8,
    signalStrength: -42,
    band: '5GHz',
    sessions: [
      { startTime: hoursAgo(3), endTime: null, dataUsed: 2450 },
      { startTime: hoursAgo(8), endTime: hoursAgo(5), dataUsed: 1200 },
      { startTime: daysAgo(1), endTime: daysAgo(1), dataUsed: 3100 },
    ],
    dailyUsage: generateDailyUsage(30, 2500, 800),
  },
  {
    id: '2',
    name: 'MacBook Pro M3',
    macAddress: '3C:22:FB:7A:9D:12',
    ipAddress: '192.168.1.102',
    type: 'laptop',
    manufacturer: 'Apple',
    isConnected: true,
    connectedSince: hoursAgo(8),
    lastSeen: now,
    totalDataUsed: 8750,
    downloadSpeed: 95.4,
    uploadSpeed: 24.1,
    signalStrength: -35,
    band: '5GHz',
    sessions: [
      { startTime: hoursAgo(8), endTime: null, dataUsed: 8750 },
      { startTime: daysAgo(1), endTime: daysAgo(1), dataUsed: 12400 },
    ],
    dailyUsage: generateDailyUsage(30, 8000, 2000),
  },
  {
    id: '3',
    name: 'Samsung Galaxy S24',
    macAddress: 'F8:75:A4:C3:E2:88',
    ipAddress: '192.168.1.103',
    type: 'smartphone',
    manufacturer: 'Samsung',
    isConnected: true,
    connectedSince: hoursAgo(1),
    lastSeen: now,
    totalDataUsed: 1820,
    downloadSpeed: 38.7,
    uploadSpeed: 8.4,
    signalStrength: -55,
    band: '5GHz',
    sessions: [
      { startTime: hoursAgo(1), endTime: null, dataUsed: 1820 },
      { startTime: hoursAgo(6), endTime: hoursAgo(4), dataUsed: 950 },
    ],
    dailyUsage: generateDailyUsage(30, 1800, 500),
  },
  {
    id: '4',
    name: 'Smart TV Samsung 65"',
    macAddress: '00:1B:39:7E:C4:51',
    ipAddress: '192.168.1.104',
    type: 'smart-tv',
    manufacturer: 'Samsung',
    isConnected: true,
    connectedSince: hoursAgo(12),
    lastSeen: now,
    totalDataUsed: 15200,
    downloadSpeed: 28.3,
    uploadSpeed: 1.2,
    signalStrength: -48,
    band: '5GHz',
    sessions: [
      { startTime: hoursAgo(12), endTime: null, dataUsed: 15200 },
      { startTime: daysAgo(1), endTime: daysAgo(1), dataUsed: 18500 },
    ],
    dailyUsage: generateDailyUsage(30, 14000, 200),
  },
  {
    id: '5',
    name: 'iPad Air',
    macAddress: 'D4:61:2E:8F:3A:67',
    ipAddress: '192.168.1.105',
    type: 'tablet',
    manufacturer: 'Apple',
    isConnected: false,
    connectedSince: hoursAgo(26),
    lastSeen: hoursAgo(2),
    totalDataUsed: 3200,
    downloadSpeed: 0,
    uploadSpeed: 0,
    signalStrength: 0,
    band: '5GHz',
    sessions: [
      { startTime: hoursAgo(26), endTime: hoursAgo(2), dataUsed: 3200 },
      { startTime: daysAgo(2), endTime: daysAgo(2), dataUsed: 2800 },
    ],
    dailyUsage: generateDailyUsage(30, 3000, 600),
  },
  {
    id: '6',
    name: 'Echo Dot (Salon)',
    macAddress: '6C:56:97:4A:B1:23',
    ipAddress: '192.168.1.106',
    type: 'speaker',
    manufacturer: 'Amazon',
    isConnected: true,
    connectedSince: daysAgo(5),
    lastSeen: now,
    totalDataUsed: 450,
    downloadSpeed: 2.1,
    uploadSpeed: 0.8,
    signalStrength: -62,
    band: '2.4GHz',
    sessions: [
      { startTime: daysAgo(5), endTime: null, dataUsed: 450 },
    ],
    dailyUsage: generateDailyUsage(30, 90, 30),
  },
  {
    id: '7',
    name: 'Imprimante HP LaserJet',
    macAddress: 'B8:83:1B:5D:9E:44',
    ipAddress: '192.168.1.107',
    type: 'printer',
    manufacturer: 'HP',
    isConnected: true,
    connectedSince: daysAgo(15),
    lastSeen: now,
    totalDataUsed: 120,
    downloadSpeed: 0.5,
    uploadSpeed: 0.1,
    signalStrength: -70,
    band: '2.4GHz',
    sessions: [
      { startTime: daysAgo(15), endTime: null, dataUsed: 120 },
    ],
    dailyUsage: generateDailyUsage(30, 8, 2),
  },
  {
    id: '8',
    name: 'PlayStation 5',
    macAddress: 'AC:89:95:3F:2D:78',
    ipAddress: '192.168.1.108',
    type: 'gaming',
    manufacturer: 'Sony',
    isConnected: false,
    connectedSince: hoursAgo(48),
    lastSeen: hoursAgo(14),
    totalDataUsed: 22400,
    downloadSpeed: 0,
    uploadSpeed: 0,
    signalStrength: 0,
    band: '5GHz',
    sessions: [
      { startTime: hoursAgo(48), endTime: hoursAgo(14), dataUsed: 22400 },
      { startTime: daysAgo(3), endTime: daysAgo(3), dataUsed: 18000 },
    ],
    dailyUsage: generateDailyUsage(30, 12000, 500),
  },
  {
    id: '9',
    name: 'Thermostat Nest',
    macAddress: '18:B4:30:8E:5F:11',
    ipAddress: '192.168.1.109',
    type: 'iot',
    manufacturer: 'Google',
    isConnected: true,
    connectedSince: daysAgo(30),
    lastSeen: now,
    totalDataUsed: 85,
    downloadSpeed: 0.3,
    uploadSpeed: 0.2,
    signalStrength: -58,
    band: '2.4GHz',
    sessions: [
      { startTime: daysAgo(30), endTime: null, dataUsed: 85 },
    ],
    dailyUsage: generateDailyUsage(30, 3, 2),
  },
  {
    id: '10',
    name: 'Windows PC - Bureau',
    macAddress: 'E8:6A:64:1C:7B:33',
    ipAddress: '192.168.1.110',
    type: 'laptop',
    manufacturer: 'Dell',
    isConnected: true,
    connectedSince: hoursAgo(5),
    lastSeen: now,
    totalDataUsed: 5600,
    downloadSpeed: 72.1,
    uploadSpeed: 18.3,
    signalStrength: -38,
    band: '5GHz',
    sessions: [
      { startTime: hoursAgo(5), endTime: null, dataUsed: 5600 },
      { startTime: daysAgo(1), endTime: daysAgo(1), dataUsed: 9200 },
    ],
    dailyUsage: generateDailyUsage(30, 5500, 1500),
  },
  {
    id: '11',
    name: 'Caméra Sonnette Ring',
    macAddress: '44:65:0D:9A:2E:55',
    ipAddress: '192.168.1.111',
    type: 'iot',
    manufacturer: 'Ring',
    isConnected: true,
    connectedSince: daysAgo(20),
    lastSeen: now,
    totalDataUsed: 4800,
    downloadSpeed: 1.8,
    uploadSpeed: 3.2,
    signalStrength: -65,
    band: '2.4GHz',
    sessions: [
      { startTime: daysAgo(20), endTime: null, dataUsed: 4800 },
    ],
    dailyUsage: generateDailyUsage(30, 240, 380),
  },
  {
    id: '12',
    name: 'Pixel 8 Pro - Sara',
    macAddress: '7A:C2:B6:4D:F8:99',
    ipAddress: '192.168.1.112',
    type: 'smartphone',
    manufacturer: 'Google',
    isConnected: false,
    connectedSince: hoursAgo(72),
    lastSeen: hoursAgo(24),
    totalDataUsed: 4100,
    downloadSpeed: 0,
    uploadSpeed: 0,
    signalStrength: 0,
    band: '5GHz',
    sessions: [
      { startTime: hoursAgo(72), endTime: hoursAgo(24), dataUsed: 4100 },
      { startTime: daysAgo(4), endTime: daysAgo(4), dataUsed: 3500 },
    ],
    dailyUsage: generateDailyUsage(30, 2000, 600),
  },
];

export const networkInfo = {
  ssid: 'Maison_WiFi_5G',
  password: '••••••••',
  security: 'WPA3',
  band: 'Dual Band (2.4GHz + 5GHz)',
  router: 'TP-Link Archer AX73',
  routerIP: '192.168.1.1',
  gateway: '192.168.1.1',
  dns: '8.8.8.8, 8.8.4.4',
  totalBandwidth: 1000, // Mbps
  uptime: daysAgo(12),
};
