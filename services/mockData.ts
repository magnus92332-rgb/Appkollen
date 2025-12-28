
import { Message, UtilityStatus, ConsumptionData } from '../types';

const generateData = (count: number, min: number, max: number, prefix: string): ConsumptionData[] => 
  Array.from({ length: count }, (_, i) => ({
    date: `${prefix} ${i + 1}`,
    value: min + Math.random() * (max - min)
  }));

export const getMockMessages = (address: string): Message[] => [
  {
    id: '1',
    sender: 'Message Pro',
    title: 'Driftstörning i ditt område',
    body: `Hej boende på ${address}. Vi utför underhållsarbete på vattenledningar under tisdagen mellan 08:00 - 12:00.`,
    timestamp: new Date().toISOString(),
    isRead: false,
    priority: 'high'
  },
  {
    id: '2',
    sender: 'Avfallsappen',
    title: 'Påminnelse: Matavfall',
    body: 'Imorgon är det dags för tömning av matavfall. Glöm inte att ställa ut kärlet!',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: true,
    priority: 'medium'
  },
  {
    id: '3',
    sender: 'MyEnergi',
    title: 'Ny månadsrapport tillgänglig',
    body: 'Din förbrukningsrapport för förra månaden finns nu att läsa i appen.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    priority: 'low'
  }
];

export interface ExtendedUtilityStatus extends UtilityStatus {
  electricity: UtilityStatus['electricity'] & {
    weeklyData: ConsumptionData[];
    monthlyData: ConsumptionData[];
  };
  water: UtilityStatus['water'] & {
    weeklyData: ConsumptionData[];
    monthlyData: ConsumptionData[];
  };
}

export const getMockUtilityStatus = (): ExtendedUtilityStatus => ({
  electricity: {
    currentUsage: 2.4,
    provider: 'MyEnergi (Digpro)',
    dailyData: generateData(7, 8, 15, 'Dag'),
    weeklyData: generateData(4, 60, 100, 'Vecka'),
    monthlyData: generateData(12, 250, 400, 'Månad'),
  },
  water: {
    currentUsage: 142,
    provider: 'READy (Kamstrup)',
    dailyData: generateData(7, 100, 180, 'Dag'),
    weeklyData: generateData(4, 700, 1000, 'Vecka'),
    monthlyData: generateData(12, 3000, 4500, 'Månad'),
  },
  waste: [
    { type: 'Restavfall', nextDate: '2024-05-20', status: 'upcoming' },
    { type: 'Matavfall', nextDate: '2024-05-18', status: 'today' },
    { type: 'Pappersförpackningar', nextDate: '2024-05-25', status: 'upcoming' }
  ]
});
