export interface GameState {
  x: number;
  y: number;
  velocity: number;
  isJumping: boolean;
  score: number;
  lives: number;
  powerUps: PowerUp[];
  invulnerable: boolean;
  invulnerableTime: number;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'checkbox' | 'text-wall' | 'popup' | 'captcha';
  content?: string;
}

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: 'clear-cookies' | 'incognito' | 'mute-notifications';
  collected: boolean;
}

export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  newsletter: boolean;
}