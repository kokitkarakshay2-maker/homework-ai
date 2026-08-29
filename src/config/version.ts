export const CURRENT_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '2.1.0';

export interface VersionChange {
  version: string;
  date?: string;
  title?: string;
  changes: string[];
}

export const VERSION_HISTORY: VersionChange[] = [
  {
    version: '2.1.0',
    title: 'Latest',
    changes: [
      'Implemented robust PWA update system',
      'Added in-app version update notifications',
      'Added Version History screen',
    ]
  },
  {
    version: '2.0.0',
    changes: [
      'Added QR device pairing',
      'Added shared history',
      'Improved result screen',
    ]
  },
  {
    version: '1.0.0',
    changes: [
      'Initial Homework AI release',
    ]
  }
];
