# NFT Dashboard Demo

> A full-featured, dark-themed NFT & crypto analytics dashboard built with React and Vite. This is a **demo project** showcasing UI/UX design and front-end development skills — all data is simulated.

🔗 **Live Demo:** [brando4152.github.io/NFT-Dashboard-Demo](https://brando4152.github.io/NFT-Dashboard-Demo)

---

[NFT Dashboard Preview]([https://brando4152.github.io/NFT-Dashboard-Demo/preview.png](https://brando4152.github.io/NFT-Dashboard-Demo/))

---

## Features

- **Feed** — Live market overview with top collections, top sales, trending NFTs, news feed, upcoming mints, and top buyers/sellers
- **NFTs** — Grid and list view of NFT items with search, rarity filtering, activity log, and offer management
- **Crypto** — Real-time-style price charts for BTC, ETH, SOL with gas tracker, coin market table, and portfolio breakdown
- **Analytics** — Volume bar charts, sales trend lines, sales heatmap, top traders leaderboard, chain and marketplace breakdowns
- **Calendar** — Month and list views of upcoming mints, auctions, drops, and events with a personal watchlist
- **Profile** — Portfolio value chart, tabbed NFT/activity/offers view, achievements, wallet info, and following list

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev) | UI framework |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [Recharts](https://recharts.org) | Charts & data visualization |
| [Lucide React](https://lucide.dev) | Icon library |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [React Router DOM](https://reactrouter.com) | Client-side routing |
| [shadcn/ui](https://ui.shadcn.com) | UI primitives (Button, Badge, Tooltip, etc.) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone git@github.com:Brando4152/NFT-Dashboard-Demo.git

# Navigate into the project
cd NFT-Dashboard-Demo

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
src/
├── components/
│   ├── ui/               # shadcn/ui primitives
│   │   ├── button.jsx
│   │   ├── badge.jsx
│   │   ├── tooltip.jsx
│   │   ├── dropdown-menu.jsx
│   │   ├── scroll-area.jsx
│   │   └── separator.jsx
├── data/
│   └── projects.js       # Simulated data
├── App.jsx               # Main app — all pages & components
├── main.jsx              # Entry point
└── index.css             # Global styles
```

---

## Pages

### Feed
The home dashboard. Displays top NFT collections by volume, recent top sales, trending collections, a live news ticker, upcoming project drops, and top buyer/seller wallet tables. The market overview chart tracks volume and market cap over time.

### NFTs
Browse a collection of NFTs in grid or list view. Filter by rarity (Legendary, Epic, Rare, Uncommon) and search by name or collection. Includes an activity feed for recent sales, listings, transfers, and mints — plus an open offers panel.

### Crypto
Select between BTC, ETH, and SOL price charts with timeframe controls. Includes a gas tracker chart, a searchable coin market table with 8 assets, a portfolio donut chart, and a quick swap widget.

### Analytics
Annual volume bar chart, sales & fees trend line, an interactive sales heatmap by collection and day of week, and a top traders leaderboard. Right column shows chain breakdown (Ethereum, Solana, Polygon, BNB), monthly highlights, and marketplace share (OpenSea, Blur, LooksRare, etc.).

### Calendar
Monthly calendar grid with color-coded event dots for mints, auctions, drops, and events. Click a day to see event details. Also includes a list view, an all-upcoming events panel, and a personal watchlist.

### Profile
User profile with banner, avatar, wallet address copy, and follower stats. Portfolio value area chart with unrealised/realised PnL. Tabbed view for owned NFTs, transaction history, and incoming offers. Achievements panel and a following list.

---

## Responsive Design

The dashboard is fully responsive across three breakpoints:

| Breakpoint | Layout |
|-----------|--------|
| Desktop (1024px+) | Full multi-column layout with sidebar |
| Tablet (768–1023px) | Two-column layout, stacked sidebar |
| Mobile (<768px) | Single column, collapsible drawer navigation |

---

## Deployment

Deployed to GitHub Pages via `gh-pages`:

```bash
npm run deploy
```

The `vite.config.js` includes `base: '/NFT-Dashboard-Demo/'` and routing uses `HashRouter` for GitHub Pages compatibility.

---

## Disclaimer

This is a **demo project** — all NFT data, prices, wallet addresses, and market statistics are entirely simulated and for display purposes only. This is not financial advice and no real transactions are possible.

---

## Author

**Brando** — [@builtbybrando](https://twitter.com/builtbybrando)

Built by [BBB — Built by Brando](https://wa.me/17863835995)

---

## License

MIT — free to use as inspiration or a starting point for your own projects.
