export interface Song {
  id: string;
  title: string;
  artist: string;
  type: 'regular' | 'discovered' | 'weekend';
  visible: boolean;
  duration: string;
  art: string;
  label?: string;      // Explaining why recommended (e.g., "Based on your love for M83")
  labelIcon?: 'sparkle' | 'music' | 'fire' | 'compass';
  seedId?: string;     // The ID of the track that seeded this recommendation
}

export type FlowType = 'original' | 'revised';

export interface CritiqueItem {
  id: string;
  title: string;
  description: string;
  rating: 'critical' | 'moderate' | 'excellent';
  analysis: string;
  recommendation: string;
}

export interface MetricCard {
  name: string;
  value: string;
  change: string;
  status: 'up' | 'down' | 'neutral';
  description: string;
}
