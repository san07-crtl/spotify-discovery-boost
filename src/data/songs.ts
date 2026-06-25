import { Song } from '../types';

export const INITIAL_SONGS: Song[] = [
  {
    id: 's0',
    title: 'Midnight City',
    artist: 'M83',
    type: 'regular',
    visible: true,
    duration: '4:03',
    art: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop'
  },
  {
    id: 's1',
    title: 'Electric Feel',
    artist: 'MGMT',
    type: 'regular',
    visible: true,
    duration: '3:50',
    art: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop'
  },
  {
    id: 's2',
    title: 'Instant Crush',
    artist: 'Daft Punk',
    type: 'regular',
    visible: true,
    duration: '5:37',
    art: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop'
  },
  {
    id: 's3',
    title: 'Take a Walk',
    artist: 'Passion Pit',
    type: 'regular',
    visible: true,
    duration: '4:25',
    art: 'https://images.unsplash.com/photo-1504898770365-14a3a785d209?w=400&h=400&fit=crop'
  },
  {
    id: 's4',
    title: 'The Less I Know the Better',
    artist: 'Tame Impala',
    type: 'regular',
    visible: true,
    duration: '3:36',
    art: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
  }
];

export const BOOST_POOL: Song[] = [
  {
    id: 'd1',
    title: 'Neon Dreams',
    artist: 'Kavinsky',
    type: 'discovered',
    visible: false,
    duration: '3:42',
    art: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    label: 'Inspired by your love for M83',
    labelIcon: 'sparkle',
    seedId: 's0'
  },
  {
    id: 'd2',
    title: 'Night Sky',
    artist: 'The Midnight',
    type: 'discovered',
    visible: false,
    duration: '4:15',
    art: 'https://images.unsplash.com/photo-1520454974749-611b7248f5d4?w=400&h=400&fit=crop',
    label: 'Matches the upbeat synth of MGMT',
    labelIcon: 'music',
    seedId: 's1'
  },
  {
    id: 'd3',
    title: 'Genesis',
    artist: 'Justice',
    type: 'discovered',
    visible: false,
    duration: '3:54',
    art: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    label: 'Recommended as you enjoyed Daft Punk',
    labelIcon: 'compass',
    seedId: 's2'
  },
  {
    id: 'd4',
    title: 'Walking on a Dream',
    artist: 'Empire of the Sun',
    type: 'discovered',
    visible: false,
    duration: '3:18',
    art: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=400&h=400&fit=crop',
    label: 'Trending with fans of Passion Pit',
    labelIcon: 'fire',
    seedId: 's3'
  }
];

export const WEEKEND_POOL: Song[] = [
  {
    id: 'w1',
    title: 'Cosmic Love',
    artist: 'Florence + The Machine',
    type: 'weekend',
    visible: false,
    duration: '4:06',
    art: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    label: 'Weekend Boost • Expansive, high-energy mood match',
    labelIcon: 'fire',
    seedId: 's0'
  }
];
