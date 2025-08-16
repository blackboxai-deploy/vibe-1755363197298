import { 
  Player, 
  Enemy, 
  Bullet, 
  PowerUp, 
  Particle, 
  GameObject, 
  Vector2D, 
  EnemyType, 
  PowerUpType,
  GameConfig
} from '@/types/game';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GameConfig;
  
  public player: Player;
  public enemies: Enemy[] = [];
  public bullets: Bullet[] = [];
  public powerUps: PowerUp[] = [];
  public particles: Particle[] = [];
  
  private keys: { [key: string]: boolean } = {};
  private lastTime = 0;
  private lastEnemySpawn = 0;
  private lastPowerUpSpawn = 0;
  
  public score = 0;
  public level = 1;
  public lives = 3;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    this.config = {
      canvas: {
        width: canvas.width,
        height: canvas.height
      },
      player: {
        speed: 5,
        fireRate: 200,
        maxHealth: 3
      },
      enemies: {
        spawnRate: 1000,
        maxOnScreen: 8,
        speedMultiplier: 1
      },
      physics: {
        friction: 0.95,
        gravity: 0
      }
    };
    
    this.player = this.createPlayer();
    this.setupEventListeners();
  }
  
  private createPlayer(): Player {
    return {
      id: 'player',
      position: { 
        x: this.config.canvas.width / 2, 
        y: this.config.canvas.height - 60 
      },
      velocity: { x: 0, y: 0 },
      size: { x: 40, y: 40 },
      rotation: 0,
      isActive: true,
      health: this.config.player.maxHealth,
      maxHealth: this.config.player.maxHealth,
      fireRate: this.config.player.fireRate,
      lastShotTime: 0,
      powerUps: []
    };
  }
  
  private setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }
  
  public update(deltaTime: number) {
    this.handleInput();
    this.updatePlayer(deltaTime);
    this.updateEnemies(deltaTime);
    this.updateBullets(deltaTime);
    this.updatePowerUps(deltaTime);
    this.updateParticles(deltaTime);
    this.checkCollisions();
    this.spawnEnemies(deltaTime);
    this.spawnPowerUps(deltaTime);
    this.cleanupEntities();
  }
  
  private handleInput() {
    // Movement
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.player.velocity.x = -this.config.player.speed;
    } else if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.player.velocity.x = this.config.player.speed;
    } else {
      this.player.velocity.x *= this.config.physics.friction;
    }
    
    // Shooting
    if (this.keys['Space']) {
      this.playerShoot();
    }
  }
  
  private updatePlayer(deltaTime: number) {
    this.player.position.x += this.player.velocity.x;
    
    // Keep player in bounds
    this.player.position.x = Math.max(
      this.player.size.x / 2,
      Math.min(
        this.config.canvas.width - this.player.size.x / 2,
        this.player.position.x
      )
    );
  }
  
  private updateEnemies(deltaTime: number) {
    this.enemies.forEach(enemy => {
      enemy.position.y += enemy.speed * this.config.enemies.speedMultiplier;
      
      // Enemy shooting (for certain types)
      if (enemy.type === EnemyType.SCOUT || enemy.type === EnemyType.HEAVY) {
        if (!enemy.lastShotTime) enemy.lastShotTime = 0;
        if (Date.now() - enemy.lastShotTime > 2000) {
          this.enemyShoot(enemy);
          enemy.lastShotTime = Date.now();
        }
      }
      
      // Deactivate enemies that go off screen
      if (enemy.position.y > this.config.canvas.height + enemy.size.y) {
        enemy.isActive = false;
        this.lives--;
      }
    });
  }
  
  private updateBullets(deltaTime: number) {
    this.bullets.forEach(bullet => {
      bullet.position.y += bullet.velocity.y;
      
      // Deactivate bullets that go off screen
      if (bullet.position.y < -10 || bullet.position.y > this.config.canvas.height + 10) {
        bullet.isActive = false;
      }
    });
  }
  
  private updatePowerUps(deltaTime: number) {
    this.powerUps.forEach(powerUp => {
      powerUp.position.y += 2;
      powerUp.rotation += 0.05;
      
      if (powerUp.position.y > this.config.canvas.height + powerUp.size.y) {
        powerUp.isActive = false;
      }
    });
  }
  
  private updateParticles(deltaTime: number) {
    this.particles.forEach(particle => {
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.life--;
      
      // Fade out particles
      if (particle.life <= 0) {
        const index = this.particles.indexOf(particle);
        this.particles.splice(index, 1);
      }
    });
  }
  
  private checkCollisions() {
    // Player bullets vs enemies
    this.bullets.forEach(bullet => {
      if (!bullet.isPlayerBullet) return;
      
      this.enemies.forEach(enemy => {
        if (this.isColliding(bullet, enemy)) {
          bullet.isActive = false;
          enemy.health -= bullet.damage;
          
          this.createExplosion(enemy.position, 'orange');
          
          if (enemy.health <= 0) {
            enemy.isActive = false;
            this.score += enemy.points;
            this.createExplosion(enemy.position, 'cyan');
          }
        }
      });
    });
    
    // Enemy bullets vs player
    this.bullets.forEach(bullet => {
      if (bullet.isPlayerBullet) return;
      
      if (this.isColliding(bullet, this.player)) {
        bullet.isActive = false;
        this.lives--;
        this.createExplosion(this.player.position, 'red');
      }
    });
    
    // Player vs enemies
    this.enemies.forEach(enemy => {
      if (this.isColliding(this.player, enemy)) {
        enemy.isActive = false;
        this.lives--;
        this.createExplosion(this.player.position, 'red');
      }
    });
    
    // Player vs power-ups
    this.powerUps.forEach(powerUp => {
      if (this.isColliding(this.player, powerUp)) {
        powerUp.isActive = false;
        this.applyPowerUp(powerUp.type);
        this.createExplosion(powerUp.position, 'green');
      }
    });
  }
  
  private isColliding(obj1: GameObject, obj2: GameObject): boolean {
    const dx = obj1.position.x - obj2.position.x;
    const dy = obj1.position.y - obj2.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (obj1.size.x + obj2.size.x) / 2;
    
    return distance < minDistance;
  }
  
  private playerShoot() {
    const now = Date.now();
    if (now - this.player.lastShotTime < this.player.fireRate) return;
    
    this.player.lastShotTime = now;
    
    const bullet: Bullet = {
      id: `bullet_${now}`,
      position: { 
        x: this.player.position.x, 
        y: this.player.position.y - this.player.size.y / 2 
      },
      velocity: { x: 0, y: -10 },
      size: { x: 4, y: 12 },
      rotation: 0,
      isActive: true,
      damage: 1,
      isPlayerBullet: true,
      color: 'cyan'
    };
    
    this.bullets.push(bullet);
  }
  
  private enemyShoot(enemy: Enemy) {
    const bullet: Bullet = {
      id: `enemyBullet_${Date.now()}`,
      position: { 
        x: enemy.position.x, 
        y: enemy.position.y + enemy.size.y / 2 
      },
      velocity: { x: 0, y: 5 },
      size: { x: 4, y: 8 },
      rotation: 0,
      isActive: true,
      damage: 1,
      isPlayerBullet: false,
      color: 'red'
    };
    
    this.bullets.push(bullet);
  }
  
  private spawnEnemies(deltaTime: number) {
    const now = Date.now();
    if (now - this.lastEnemySpawn < this.config.enemies.spawnRate) return;
    if (this.enemies.filter(e => e.isActive).length >= this.config.enemies.maxOnScreen) return;
    
    this.lastEnemySpawn = now;
    
    const enemyTypes = [EnemyType.ASTEROID, EnemyType.SCOUT, EnemyType.HEAVY];
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
    const enemy = this.createEnemy(type);
    this.enemies.push(enemy);
  }
  
  private createEnemy(type: EnemyType): Enemy {
    const x = Math.random() * (this.config.canvas.width - 40) + 20;
    
    switch (type) {
      case EnemyType.ASTEROID:
        return {
          id: `asteroid_${Date.now()}`,
          position: { x, y: -30 },
          velocity: { x: 0, y: 0 },
          size: { x: 30, y: 30 },
          rotation: Math.random() * Math.PI * 2,
          isActive: true,
          health: 1,
          speed: 2 + Math.random() * 2,
          points: 10,
          type
        };
        
      case EnemyType.SCOUT:
        return {
          id: `scout_${Date.now()}`,
          position: { x, y: -40 },
          velocity: { x: 0, y: 0 },
          size: { x: 35, y: 35 },
          rotation: 0,
          isActive: true,
          health: 2,
          speed: 1.5 + Math.random(),
          points: 25,
          type,
          lastShotTime: 0
        };
        
      case EnemyType.HEAVY:
        return {
          id: `heavy_${Date.now()}`,
          position: { x, y: -50 },
          velocity: { x: 0, y: 0 },
          size: { x: 50, y: 50 },
          rotation: 0,
          isActive: true,
          health: 4,
          speed: 1,
          points: 50,
          type,
          lastShotTime: 0
        };
        
      default:
        return this.createEnemy(EnemyType.ASTEROID);
    }
  }
  
  private spawnPowerUps(deltaTime: number) {
    const now = Date.now();
    if (now - this.lastPowerUpSpawn < 15000) return; // Every 15 seconds
    
    this.lastPowerUpSpawn = now;
    
    const powerUpTypes = [PowerUpType.RAPID_FIRE, PowerUpType.MULTI_SHOT, PowerUpType.SHIELD];
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    const powerUp: PowerUp = {
      id: `powerup_${now}`,
      position: { 
        x: Math.random() * (this.config.canvas.width - 30) + 15, 
        y: -20 
      },
      velocity: { x: 0, y: 0 },
      size: { x: 20, y: 20 },
      rotation: 0,
      isActive: true,
      type,
      duration: 10000 // 10 seconds
    };
    
    this.powerUps.push(powerUp);
  }
  
  private applyPowerUp(type: PowerUpType) {
    switch (type) {
      case PowerUpType.RAPID_FIRE:
        this.player.fireRate = 100;
        setTimeout(() => {
          this.player.fireRate = this.config.player.fireRate;
        }, 10000);
        break;
        
      case PowerUpType.MULTI_SHOT:
        // Implementation would modify shooting pattern
        break;
        
      case PowerUpType.SHIELD:
        // Implementation would add temporary invincibility
        break;
    }
  }
  
  private createExplosion(position: Vector2D, color: string) {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      
      this.particles.push({
        position: { ...position },
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        life: 30,
        maxLife: 30,
        color,
        size: 3 + Math.random() * 3
      });
    }
  }
  
  private cleanupEntities() {
    this.enemies = this.enemies.filter(e => e.isActive);
    this.bullets = this.bullets.filter(b => b.isActive);
    this.powerUps = this.powerUps.filter(p => p.isActive);
  }
  
  public getGameData() {
    return {
      score: this.score,
      level: this.level,
      lives: this.lives,
      enemyCount: this.enemies.length,
      bulletCount: this.bullets.length
    };
  }
  
  public isGameOver(): boolean {
    return this.lives <= 0;
  }
  
  public reset() {
    this.player = this.createPlayer();
    this.enemies = [];
    this.bullets = [];
    this.powerUps = [];
    this.particles = [];
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.lastEnemySpawn = 0;
    this.lastPowerUpSpawn = 0;
  }
}