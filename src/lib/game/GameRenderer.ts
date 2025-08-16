import { GameEngine } from './GameEngine';
import { Player, Enemy, Bullet, PowerUp, Particle, EnemyType, PowerUpType } from '@/types/game';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }
  
  public render(gameEngine: GameEngine) {
    this.clearCanvas();
    this.renderStarfield();
    this.renderPlayer(gameEngine.player);
    this.renderEnemies(gameEngine.enemies);
    this.renderBullets(gameEngine.bullets);
    this.renderPowerUps(gameEngine.powerUps);
    this.renderParticles(gameEngine.particles);
  }
  
  private clearCanvas() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  private renderStarfield() {
    // Static stars for performance
    this.ctx.fillStyle = 'white';
    for (let i = 0; i < 100; i++) {
      const x = (i * 137.5) % this.canvas.width;
      const y = (i * 73.3) % this.canvas.height;
      this.ctx.fillRect(x, y, 1, 1);
    }
  }
  
  private renderPlayer(player: Player) {
    const { position, size } = player;
    
    this.ctx.save();
    this.ctx.translate(position.x, position.y);
    
    // Player ship body
    this.ctx.fillStyle = '#00ffff';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, -size.y / 2);
    this.ctx.lineTo(-size.x / 3, size.y / 2);
    this.ctx.lineTo(0, size.y / 3);
    this.ctx.lineTo(size.x / 3, size.y / 2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    
    // Engine glow
    this.ctx.fillStyle = '#ff4400';
    this.ctx.beginPath();
    this.ctx.ellipse(0, size.y / 2 + 5, 8, 12, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  private renderEnemies(enemies: Enemy[]) {
    enemies.forEach(enemy => {
      if (!enemy.isActive) return;
      
      const { position, size, type, rotation } = enemy;
      
      this.ctx.save();
      this.ctx.translate(position.x, position.y);
      this.ctx.rotate(rotation);
      
      switch (type) {
        case EnemyType.ASTEROID:
          this.renderAsteroid(size);
          break;
        case EnemyType.SCOUT:
          this.renderScoutShip(size);
          break;
        case EnemyType.HEAVY:
          this.renderHeavyShip(size);
          break;
      }
      
      this.ctx.restore();
    });
  }
  
  private renderAsteroid(size: { x: number; y: number }) {
    this.ctx.fillStyle = '#8B4513';
    this.ctx.strokeStyle = '#A0522D';
    this.ctx.lineWidth = 2;
    
    this.ctx.beginPath();
    const radius = size.x / 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = radius * (0.8 + Math.random() * 0.4);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }
  
  private renderScoutShip(size: { x: number; y: number }) {
    this.ctx.fillStyle = '#ff0066';
    this.ctx.strokeStyle = '#ff3388';
    this.ctx.lineWidth = 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, -size.y / 2);
    this.ctx.lineTo(-size.x / 2, size.y / 4);
    this.ctx.lineTo(-size.x / 4, size.y / 2);
    this.ctx.lineTo(size.x / 4, size.y / 2);
    this.ctx.lineTo(size.x / 2, size.y / 4);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    
    // Cockpit
    this.ctx.fillStyle = '#660022';
    this.ctx.beginPath();
    this.ctx.ellipse(0, -size.y / 4, 6, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  private renderHeavyShip(size: { x: number; y: number }) {
    this.ctx.fillStyle = '#cc4400';
    this.ctx.strokeStyle = '#ff6622';
    this.ctx.lineWidth = 3;
    
    // Main body
    this.ctx.fillRect(-size.x / 2, -size.y / 2, size.x, size.y);
    this.ctx.strokeRect(-size.x / 2, -size.y / 2, size.x, size.y);
    
    // Weapons
    this.ctx.fillStyle = '#990000';
    this.ctx.fillRect(-size.x / 3, -size.y / 2 - 5, 8, 10);
    this.ctx.fillRect(size.x / 3 - 8, -size.y / 2 - 5, 8, 10);
    
    // Engine exhausts
    this.ctx.fillStyle = '#0088ff';
    this.ctx.fillRect(-size.x / 3, size.y / 2, 6, 8);
    this.ctx.fillRect(size.x / 3 - 6, size.y / 2, 6, 8);
  }
  
  private renderBullets(bullets: Bullet[]) {
    bullets.forEach(bullet => {
      if (!bullet.isActive) return;
      
      const { position, size, color } = bullet;
      
      this.ctx.fillStyle = color;
      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = 10;
      
      this.ctx.fillRect(
        position.x - size.x / 2,
        position.y - size.y / 2,
        size.x,
        size.y
      );
      
      this.ctx.shadowBlur = 0;
    });
  }
  
  private renderPowerUps(powerUps: PowerUp[]) {
    powerUps.forEach(powerUp => {
      if (!powerUp.isActive) return;
      
      const { position, size, type, rotation } = powerUp;
      
      this.ctx.save();
      this.ctx.translate(position.x, position.y);
      this.ctx.rotate(rotation);
      
      let color = '#00ff00';
      let symbol = '';
      
      switch (type) {
        case PowerUpType.RAPID_FIRE:
          color = '#ffaa00';
          symbol = 'R';
          break;
        case PowerUpType.MULTI_SHOT:
          color = '#aa00ff';
          symbol = 'M';
          break;
        case PowerUpType.SHIELD:
          color = '#0088ff';
          symbol = 'S';
          break;
        case PowerUpType.HEALTH:
          color = '#00ff00';
          symbol = 'H';
          break;
      }
      
      // Outer glow
      this.ctx.fillStyle = color;
      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = 15;
      this.ctx.fillRect(-size.x / 2, -size.y / 2, size.x, size.y);
      
      // Inner core
      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(-size.x / 3, -size.y / 3, size.x * 2/3, size.y * 2/3);
      
      // Symbol
      this.ctx.fillStyle = color;
      this.ctx.font = '12px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(symbol, 0, 0);
      
      this.ctx.restore();
    });
  }
  
  private renderParticles(particles: Particle[]) {
    particles.forEach(particle => {
      const { position, size, color, life, maxLife } = particle;
      
      const alpha = life / maxLife;
      this.ctx.fillStyle = color;
      this.ctx.globalAlpha = alpha;
      
      this.ctx.beginPath();
      this.ctx.arc(position.x, position.y, size * alpha, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.globalAlpha = 1;
    });
  }
}