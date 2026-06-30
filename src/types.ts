/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  metric?: string;
  architectureDetails?: string[];
}

export interface LeadershipRole {
  id: string;
  title: string;
  organization: string;
  duration: string;
  description: string;
  highlights: string[];
  metric?: {
    value: string;
    label: string;
  };
}

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  date: string;
  type: 'honor' | 'internship' | 'certification';
  description: string;
  credentialUrl?: string;
}

export interface TechSkill {
  name: string;
  category: 'languages' | 'databases' | 'systems' | 'tools';
  level: number; // 1-100
  icon?: string;
}

export interface OperatorProfile {
  name: string;
  title: string;
  subtitle: string;
  summary: string;
  avatarUrl: string;
  operatorHash: string;
  securityLevel: string;
  systemStatus: string;
  coordinates: string;
  encryption: string;
  hobbies: {
    title: string;
    description: string;
    themeColor: 'blue' | 'emerald' | 'purple';
  }[];
}

