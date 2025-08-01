import { GameState, Obstacle, PowerUp } from '../types';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 400;
export const PLAYER_SIZE = 30;
export const GRAVITY = 0.8;
export const JUMP_FORCE = -15;
export const GAME_SPEED = 3;

export const generateObstacle = (gameTime: number): Obstacle => {
  const types: Obstacle['type'][] = ['checkbox', 'text-wall', 'popup', 'captcha'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const obstacles = {
    checkbox: {
      width: 40,
      height: 40,
      content: '☑️'
    },
    'text-wall': {
      width: 60,
      height: 120,
      content: 'TERMS'
    },
    popup: {
      width: 80,
      height: 60,
      content: 'ACCEPT COOKIES?'
    },
    captcha: {
      width: 100,
      height: 80,
      content: 'SELECT ALL TRAFFIC LIGHTS'
    }
  };

  return {
    id: Math.random().toString(36),
    x: GAME_WIDTH,
    y: Math.random() * (GAME_HEIGHT - obstacles[type].height - 100) + 50,
    width: obstacles[type].width,
    height: obstacles[type].height,
    type,
    content: obstacles[type].content
  };
};

export const generatePowerUp = (): PowerUp => {
  const types: PowerUp['type'][] = ['clear-cookies', 'incognito', 'mute-notifications'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  return {
    id: Math.random().toString(36),
    x: GAME_WIDTH,
    y: Math.random() * (GAME_HEIGHT - 100) + 50,
    type,
    collected: false
  };
};

export const checkCollision = (
  playerX: number,
  playerY: number,
  obstacle: Obstacle
): boolean => {
  return (
    playerX < obstacle.x + obstacle.width &&
    playerX + PLAYER_SIZE > obstacle.x &&
    playerY < obstacle.y + obstacle.height &&
    playerY + PLAYER_SIZE > obstacle.y
  );
};

export const updateGameState = (
  state: GameState,
  obstacles: Obstacle[],
  powerUps: PowerUp[]
): GameState => {
  let newY = state.y + state.velocity;
  let newVelocity = state.velocity + GRAVITY;
  
  // Ground collision
  if (newY > GAME_HEIGHT - PLAYER_SIZE - 50) {
    newY = GAME_HEIGHT - PLAYER_SIZE - 50;
    newVelocity = 0;
  }
  
  // Check collisions with obstacles
  let lives = state.lives;
  if (!state.invulnerable) {
    for (const obstacle of obstacles) {
      if (checkCollision(state.x, newY, obstacle)) {
        lives--;
        break;
      }
    }
  }
  
  return {
    ...state,
    y: newY,
    velocity: newVelocity,
    lives: Math.max(0, lives),
    score: state.score + 1,
    invulnerableTime: state.invulnerable ? Math.max(0, state.invulnerableTime - 1) : 0,
    invulnerable: state.invulnerableTime > 0
  };
};