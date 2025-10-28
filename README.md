# 🚀 PlayNav - Space Invaders Arcade

A modern recreation of the classic Space Invaders arcade game built with Next.js 14, React, TypeScript, and TailwindCSS. Features responsive design, smooth 60 FPS gameplay, and works seamlessly on both desktop and mobile devices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![React](https://img.shields.io/badge/React-18-61dafb)

## ✨ Features

- 🎮 **Classic Arcade Gameplay**: Authentic Space Invaders experience with modern enhancements
- 📱 **Fully Responsive**: Optimized for desktop (16:9) and mobile (9:16) with touch controls
- 🎯 **60 FPS Performance**: Smooth gameplay using requestAnimationFrame with delta time
- 🔊 **Web Audio Integration**: Retro sound effects with mute option
- 💾 **Progress Persistence**: High scores and settings saved in localStorage
- ⌨️ **Multiple Control Schemes**: Keyboard controls for desktop, touch controls for mobile
- 🎨 **Retro Pixel Art**: Nostalgic 8-bit graphics and aesthetics
- 🌟 **Progressive Difficulty**: Levels get harder with faster enemies and more aggressive attacks
- ♿ **Accessibility**: Focus indicators, ARIA labels, and large touch targets

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 18](https://react.dev/)
- **Styling**: [TailwindCSS 3](https://tailwindcss.com/)
- **Game Engine**: Custom Canvas API implementation
- **Audio**: Web Audio API
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## 📋 Prerequisites

- **Node.js**: >= 18.0.0 (LTS recommended)
- **Package Manager**: npm, pnpm, or yarn

## 🚀 Getting Started

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/playnav.git
   cd playnav
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if code is formatted |
| `npm run test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run type-check` | Check TypeScript types |

## 🎮 How to Play

### Desktop Controls

- **Arrow Keys** (← →) or **A/D**: Move spaceship left/right
- **Spacebar** or **J**: Fire weapon
- **P**: Pause/Resume game
- **M**: Mute/Unmute sound effects

### Mobile Controls

Touch controls automatically appear on mobile devices:
- **← → Buttons**: Move spaceship
- **FIRE Button**: Shoot at enemies

### Gameplay

1. **Objective**: Destroy all alien invaders before they reach the ground
2. **Lives**: Start with 3 lives; lose one when hit or when enemies reach the bottom
3. **Scoring**: 
   - Yellow Squids: 30 points
   - Magenta Crabs: 20 points
   - Cyan Octopuses: 10 points
4. **Progression**: Clear all enemies to advance to the next level with increased difficulty
5. **Invulnerability**: 2 seconds of invulnerability after being hit (ship blinks)

## 🏗️ Project Structure

```
playnav/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home/Menu page
│   ├── play/                # Game page
│   ├── how-to/              # Instructions page
│   ├── settings/            # Settings page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── GameCanvas.tsx       # Main game canvas
│   └── ui/                  # UI components
│       ├── Button.tsx
│       ├── HUD.tsx
│       ├── MobileControls.tsx
│       └── ToggleMute.tsx
├── game/                    # Game logic
│   ├── engine/              # Core engine
│   │   ├── types.ts        # TypeScript types
│   │   ├── collisions.ts   # Collision detection
│   │   ├── input.ts        # Input management
│   │   └── loop.ts         # Game loop
│   ├── entities/            # Game entities
│   │   ├── Player.ts
│   │   ├── Enemy.ts
│   │   ├── Bullet.ts
│   │   └── Formation.ts
│   └── state/               # State management
│       └── GameStateManager.ts
├── hooks/                   # Custom React hooks
│   ├── useGameLoop.ts
│   ├── useInput.ts
│   ├── useAudio.ts
│   └── useLocalStorage.ts
├── __tests__/               # Test files
├── public/                  # Static assets
└── package.json             # Dependencies and scripts
```

## 🎨 Customization

### Adding Custom Sprites

The game uses programmatic drawing for sprites. To customize enemy appearance:

1. Open `game/entities/Enemy.ts`
2. Modify the `drawEnemyShape()` method
3. Adjust pixel patterns in `drawSquid()`, `drawCrab()`, or `drawOctopus()`

Example:
```typescript
private drawSquid(ctx: CanvasRenderingContext2D, x: number, y: number, offset: number): void {
  // Customize pixel pattern here
  ctx.fillRect(x + 2, y, 2, 1); // Draw pixels at specific positions
  // Add more pixels as needed
}
```

### Adjusting Difficulty

To modify difficulty scaling per level:

1. Open `game/entities/Formation.ts`
2. Edit the `getLevelConfig()` method:

```typescript
private getLevelConfig(level: number): LevelConfig {
  return {
    level,
    enemySpeed: GAME_CONFIG.BASE_ENEMY_SPEED * (1 + (level - 1) * 0.2), // Adjust multiplier
    enemyShootProbability: GAME_CONFIG.BASE_SHOOT_PROBABILITY * (1 + level * 0.3), // Adjust multiplier
    enemyRows: Math.min(5, 3 + Math.floor(level / 3)), // Adjust row count
    enemyCols: Math.min(11, 8 + Math.floor(level / 2)), // Adjust column count
    pointsMultiplier: 1 + (level - 1) * 0.1,
  };
}
```

### Changing Game Constants

Edit `game/engine/types.ts` to modify core game parameters:

```typescript
export const GAME_CONFIG = {
  CANVAS_WIDTH: 320,              // Internal canvas width
  CANVAS_HEIGHT: 180,             // Internal canvas height
  PLAYER_SPEED: 100,              // Player movement speed
  PLAYER_SHOOT_COOLDOWN: 0.5,     // Cooldown between shots (seconds)
  BULLET_SPEED: 150,              // Bullet velocity
  BASE_ENEMY_SPEED: 10,           // Starting enemy speed
  BASE_SHOOT_PROBABILITY: 0.0001, // Enemy shooting probability
  INVULNERABLE_TIME: 2,           // Invulnerability duration (seconds)
  TARGET_FPS: 60,                 // Target frame rate
  // ... more constants
};
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

#### Method 1: Using Vercel Dashboard

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/playnav.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"

#### Method 2: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts and your site will be deployed

### Deploy to Other Platforms

#### Netlify
```bash
npm run build
# Deploy the .next folder
```

#### GitHub Pages
Not recommended for this project due to Next.js server components requirement.

#### Self-hosted
```bash
npm run build
npm run start
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

The project includes tests for:
- ✅ Collision detection (AABB)
- ✅ Game configuration validation
- ✅ Core utility functions

## 🐛 Troubleshooting

### Audio Not Playing on iOS

**Issue**: Audio doesn't play on iOS Safari

**Solution**: Audio on iOS requires a user interaction before playback. The game automatically initializes audio on first touch/click.

### Canvas Scaling Issues

**Issue**: Canvas appears blurry or incorrectly sized

**Solution**: The canvas uses CSS scaling while maintaining internal resolution. Check that:
1. The container has proper dimensions
2. The canvas width/height attributes match GAME_CONFIG values
3. CSS `image-rendering: pixelated` is applied

### Performance Issues

**Issue**: Game runs slowly or stutters

**Solution**:
1. Check browser console for errors
2. Ensure you're running a production build (`npm run build && npm start`)
3. Close other tabs/applications
4. Try a different browser (Chrome recommended)

### LocalStorage Not Persisting

**Issue**: High scores reset after closing browser

**Solution**:
1. Check that localStorage is enabled in browser settings
2. Ensure you're not in Private/Incognito mode
3. Check browser developer tools → Application → Local Storage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the classic Space Invaders arcade game by Tomohiro Nishikado (1978)
- Built with modern web technologies for educational purposes
- Sound effects generated using Web Audio API

## 📧 Contact

Project Link: [https://github.com/yourusername/playnav](https://github.com/yourusername/playnav)

---

Made with ❤️ using Next.js and TypeScript


