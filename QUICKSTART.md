# 🚀 Quick Start Guide

Get PlayNav running in under 5 minutes!

## Prerequisites

- Node.js 18+ installed ([Download](https://nodejs.org/))
- Git installed

## Installation

### Option 1: Clone & Run (2 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/playnav.git
cd playnav

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser to http://localhost:3000
```

### Option 2: Deploy to Vercel (1 minute)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the button above
2. Import your GitHub repository
3. Deploy!

## First Time Setup

After installation, you can:

1. **Play the game** at [http://localhost:3000](http://localhost:3000)
2. **Read instructions** at [http://localhost:3000/how-to](http://localhost:3000/how-to)
3. **Adjust settings** at [http://localhost:3000/settings](http://localhost:3000/settings)

## Basic Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run lint` | Check code quality |

## Controls

### Desktop
- **←/→** or **A/D**: Move
- **Space** or **J**: Shoot
- **P**: Pause
- **M**: Mute

### Mobile
- Touch controls appear automatically
- **←/→ buttons**: Move
- **FIRE button**: Shoot

## Troubleshooting

### Port 3000 already in use?
```bash
# Use a different port
PORT=3001 npm run dev
```

### Module not found errors?
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build errors?
```bash
# Check Node.js version (should be 18+)
node --version

# Update to latest LTS if needed
```

## Next Steps

- 📖 Read the [full README](README.md)
- 🎮 Check out the [gameplay guide](app/how-to/page.tsx)
- 🤝 Learn how to [contribute](CONTRIBUTING.md)
- 🚀 Deploy to [Vercel](https://vercel.com)

## Need Help?

- 🐛 [Report a bug](https://github.com/yourusername/playnav/issues/new?template=bug_report.md)
- 💡 [Request a feature](https://github.com/yourusername/playnav/issues/new?template=feature_request.md)
- 💬 [Join discussions](https://github.com/yourusername/playnav/discussions)

---

**Happy Gaming! 🎮**


