import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard, Image, Bitcoin, BarChart2, Calendar, User,
  Search, Menu, X, ChevronRight, ArrowUpRight, ArrowDownRight,
  Clock, ExternalLink, ChevronDown, ChevronLeft, ChevronUp,
  Wallet, Bell, Settings, LogOut, TrendingUp, TrendingDown,
  Star, Filter, Grid, List, Heart, Share2, Eye, Plus,
  Flame, Zap, Award, Activity, PieChart, DollarSign,
  Globe, Twitter, Send, Copy, Check, RefreshCw, Info,
  AlertCircle, CheckCircle, Lock, Unlock, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as ReTip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar, LineChart, Line, PieChart as RePie,
  Pie, Cell, RadialBarChart, RadialBar, Legend,
} from "recharts";

// ─── Global CSS ────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#2a2a2a; border-radius:4px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:.2} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  .card  { animation:fadeUp .35s ease both; }
  .rh:hover { background:#1c1c1c !important; }
  .nb:hover { background:#1c1c1c !important; color:#f2f2f2 !important; }
  .ib:hover { color:#f2f2f2 !important; }
  .sc:hover { border-color:#2d2d2d !important; transform:translateY(-1px); }
  .nft-card:hover { border-color:#333 !important; transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,0,0,.4); }
  .coin-row:hover { background:#1c1c1c !important; }
  .sc, .nft-card { transition: all .18s ease !important; }
  .table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
  @media (max-width:767px) {
    table { min-width:480px; }
    .hide-mobile { display:none !important; }
  }
`;

// ─── Tokens ────────────────────────────────────────────────────────────────
const C = {
  bg:"#0f0f0f", surf:"#161616", s2:"#1c1c1c", s3:"#212121",
  border:"#1f1f1f", b2:"#2a2a2a", b3:"#333",
  text:"#f0f0f0", m:"#555", m2:"#888", m3:"#aaa",
  green:"#22c55e", red:"#ef4444", amber:"#f59e0b", blue:"#3b82f6",
  purple:"#a855f7", pink:"#ec4899", cyan:"#06b6d4",
};
const SY = { fontFamily:"'Syne',sans-serif" };
const MO = { fontFamily:"'DM Mono',monospace" };

// ─── Seed random helpers ───────────────────────────────────────────────────
const rndAddr = () => `0x${Math.random().toString(16).slice(2,6)}...${Math.random().toString(16).slice(2,6)}`;
const rndEth  = (lo=1,hi=50) => `${(Math.random()*(hi-lo)+lo).toFixed(2)} ETH`;

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════
const COLLECTIONS = [
  { rank:1, name:"CryptoPunks", img:"🟦", volume:"10,058 ETH", chg:"-48.4%", floor:"99.99 ETH", sales:12, owners:3559, cap:"742,096 ETH", up:false },
  { rank:2, name:"Bored Apes",  img:"🦍", volume:"8,234 ETH",  chg:"+12.1%", floor:"72.5 ETH",  sales:21, owners:6200, cap:"610,200 ETH", up:true  },
  { rank:3, name:"Azuki",       img:"🌸", volume:"4,912 ETH",  chg:"+5.3%",  floor:"14.2 ETH",  sales:44, owners:5100, cap:"290,440 ETH", up:true  },
  { rank:4, name:"Doodles",     img:"🎨", volume:"2,340 ETH",  chg:"-9.2%",  floor:"6.8 ETH",   sales:89, owners:4800, cap:"120,000 ETH", up:false },
  { rank:5, name:"CloneX",      img:"🤖", volume:"1,980 ETH",  chg:"+2.7%",  floor:"5.2 ETH",   sales:67, owners:9800, cap:"98,500 ETH",  up:true  },
];

const TOP_SALES = [
  { id:1,  name:"CryptoPunk #8363", price:"$35.5k", eth:"12.3 ETH", ago:"1 hr",  img:"🟦" },
  { id:2,  name:"Bored Ape #2201",  price:"$29.1k", eth:"10.1 ETH", ago:"2 hr",  img:"🦍" },
  { id:3,  name:"Azuki #9001",      price:"$12.4k", eth:"4.3 ETH",  ago:"3 hr",  img:"🌸" },
  { id:4,  name:"Doodle #3310",     price:"$8.9k",  eth:"3.1 ETH",  ago:"4 hr",  img:"🎨" },
  { id:5,  name:"CloneX #7712",     price:"$7.2k",  eth:"2.5 ETH",  ago:"5 hr",  img:"🤖" },
  { id:6,  name:"CryptoPunk #0041", price:"$34.2k", eth:"11.9 ETH", ago:"6 hr",  img:"🟦" },
  { id:7,  name:"Bored Ape #5500",  price:"$28.0k", eth:"9.7 ETH",  ago:"7 hr",  img:"🦍" },
  { id:8,  name:"Azuki #4412",      price:"$11.9k", eth:"4.1 ETH",  ago:"8 hr",  img:"🌸" },
  { id:9,  name:"Doodle #0002",     price:"$9.2k",  eth:"3.2 ETH",  ago:"9 hr",  img:"🎨" },
  { id:10, name:"CloneX #1129",     price:"$6.8k",  eth:"2.4 ETH",  ago:"10 hr", img:"🤖" },
];

const UPCOMING = [
  { name:"KillaBears",  supply:"10,000", release:"Mar 15", img:"🐻" },
  { name:"MoonBirds",   supply:"8,000",  release:"Mar 18", img:"🦅" },
  { name:"Otherdeed",   supply:"55,000", release:"Mar 20", img:"🌍" },
  { name:"DigiDaigaku", supply:"2,022",  release:"Mar 22", img:"⚔️" },
  { name:"Invisibles",  supply:"5,000",  release:"Mar 25", img:"👁️" },
  { name:"Y00ts",       supply:"15,000", release:"Mar 28", img:"🐐" },
];

const BUYERS  = Array.from({length:8},()=>({ addr:rndAddr(), vol:rndEth(), count:Math.floor(Math.random()*5)+1 }));
const SELLERS = Array.from({length:8},()=>({ addr:rndAddr(), vol:rndEth(), count:Math.floor(Math.random()*5)+1 }));

const NEWS = [
  { time:"11:36 · Jul 10, 2022", headline:"Q1 Saw $1.2B Invested in 128 GameFi Companies", hot:true  },
  { time:"10:14 · Jul 10, 2022", headline:"OpenSea Announces Creator Revenue Tool Update",  hot:false },
  { time:"09:55 · Jul 10, 2022", headline:"Yuga Labs Acquires CryptoPunks & Meebits IP",    hot:true  },
  { time:"08:32 · Jul 10, 2022", headline:"NFT Market Volume Drops 49% From Q1 Highs",      hot:false },
  { time:"07:10 · Jul 10, 2022", headline:"Blur Surpasses OpenSea in Daily Trading Volume",  hot:true  },
  { time:"06:48 · Jul 10, 2022", headline:"Polygon NFT Sales Hit Record $67M in June",       hot:false },
  { time:"05:20 · Jul 10, 2022", headline:"Magic Eden Launches Ethereum Marketplace",        hot:false },
  { time:"04:05 · Jul 10, 2022", headline:"Coinbase NFT Beta Opens to All US Users",         hot:false },
];

const FEED_CHART = [
  {d:"Nov 5",v:112,m:98},{d:"Nov 6",v:128,m:110},{d:"Nov 7",v:118,m:105},
  {d:"Nov 8",v:142,m:118},{d:"Nov 9",v:160,m:130},{d:"Nov 10",v:148,m:125},
  {d:"Nov 11",v:155,m:132},{d:"Nov 12",v:140,m:120},{d:"Nov 13",v:150,m:128},
];

// NFTs page data
const NFT_ITEMS = [
  { id:1,  name:"CryptoPunk #3100", col:"CryptoPunks", price:"99.99 ETH", last:"102 ETH", liked:false, likes:284, rarity:"Legendary", img:"🟦", bg:"#1a2a4a" },
  { id:2,  name:"Bored Ape #7495",  col:"BAYC",        price:"72.5 ETH",  last:"68 ETH",  liked:true,  likes:512, rarity:"Epic",      img:"🦍", bg:"#2a1a3a" },
  { id:3,  name:"Azuki #9209",      col:"Azuki",       price:"14.2 ETH",  last:"12.5 ETH",liked:false, likes:193, rarity:"Rare",      img:"🌸", bg:"#3a1a2a" },
  { id:4,  name:"Doodle #6914",     col:"Doodles",     price:"6.8 ETH",   last:"7.1 ETH", liked:false, likes:98,  rarity:"Uncommon",  img:"🎨", bg:"#1a3a2a" },
  { id:5,  name:"CloneX #11571",    col:"CloneX",      price:"5.2 ETH",   last:"4.9 ETH", liked:true,  likes:341, rarity:"Epic",      img:"🤖", bg:"#2a2a1a" },
  { id:6,  name:"Moonbird #2491",   col:"Moonbirds",   price:"8.5 ETH",   last:"9.0 ETH", liked:false, likes:127, rarity:"Rare",      img:"🦅", bg:"#1a2a3a" },
  { id:7,  name:"Otherdeed #8834",  col:"Otherside",   price:"2.1 ETH",   last:"1.9 ETH", liked:false, likes:66,  rarity:"Common",    img:"🌍", bg:"#2a1a1a" },
  { id:8,  name:"Y00t #4401",       col:"y00ts",       price:"3.3 ETH",   last:"3.0 ETH", liked:true,  likes:210, rarity:"Uncommon",  img:"🐐", bg:"#1a3a3a" },
  { id:9,  name:"Invisible #0012",  col:"Invisibles",  price:"12.0 ETH",  last:"11.5 ETH",liked:false, likes:88,  rarity:"Rare",      img:"👁️", bg:"#3a2a1a" },
];

const NFT_ACTIVITY = [
  { type:"Sale",     name:"CryptoPunk #3100", price:"99.99 ETH", from:"0xabc...111", to:"0xdef...222", ago:"2 min",  img:"🟦" },
  { type:"Listing",  name:"Bored Ape #7495",  price:"72.5 ETH",  from:"0x123...abc", to:"—",           ago:"5 min",  img:"🦍" },
  { type:"Transfer", name:"Azuki #9209",      price:"—",         from:"0xfed...321", to:"0x987...xyz", ago:"12 min", img:"🌸" },
  { type:"Sale",     name:"Doodle #6914",     price:"6.8 ETH",   from:"0xaaa...bbb", to:"0xccc...ddd", ago:"18 min", img:"🎨" },
  { type:"Mint",     name:"KillaBear #0001",  price:"0.08 ETH",  from:"0x000...000", to:"0xeee...fff", ago:"30 min", img:"🐻" },
  { type:"Sale",     name:"CloneX #11571",    price:"5.2 ETH",   from:"0x111...222", to:"0x333...444", ago:"44 min", img:"🤖" },
];

// Crypto page data
const COINS = [
  { rank:1,  name:"Bitcoin",  sym:"BTC", price:"$28,412", chg:"+2.4%",  chg7:"+8.1%",  mcap:"$552B", vol:"$18.2B", up:true,  color:C.amber  },
  { rank:2,  name:"Ethereum", sym:"ETH", price:"$1,842",  chg:"+3.1%",  chg7:"+11.2%", mcap:"$221B", vol:"$9.8B",  up:true,  color:C.blue   },
  { rank:3,  name:"BNB",      sym:"BNB", price:"$312",    chg:"-0.8%",  chg7:"+2.3%",  mcap:"$48B",  vol:"$1.4B",  up:false, color:C.amber  },
  { rank:4,  name:"XRP",      sym:"XRP", price:"$0.512",  chg:"+1.2%",  chg7:"+5.6%",  mcap:"$27B",  vol:"$1.1B",  up:true,  color:C.cyan   },
  { rank:5,  name:"Solana",   sym:"SOL", price:"$22.4",   chg:"+5.8%",  chg7:"+18.3%", mcap:"$9B",   vol:"$980M",  up:true,  color:C.purple },
  { rank:6,  name:"Cardano",  sym:"ADA", price:"$0.384",  chg:"-1.4%",  chg7:"-3.2%",  mcap:"$13B",  vol:"$420M",  up:false, color:C.blue   },
  { rank:7,  name:"Avalanche",sym:"AVAX",price:"$14.2",   chg:"+4.1%",  chg7:"+12.7%", mcap:"$5B",   vol:"$350M",  up:true,  color:C.red    },
  { rank:8,  name:"Polkadot", sym:"DOT", price:"$5.92",   chg:"-2.1%",  chg7:"-4.8%",  mcap:"$7B",   vol:"$220M",  up:false, color:C.pink   },
];

const BTC_CHART = [
  {d:"Mar 1",p:25100},{d:"Mar 2",p:26200},{d:"Mar 3",p:25800},{d:"Mar 4",p:27100},
  {d:"Mar 5",p:27800},{d:"Mar 6",p:26900},{d:"Mar 7",p:28412},{d:"Mar 8",p:27600},
  {d:"Mar 9",p:28900},{d:"Mar 10",p:29100},{d:"Mar 11",p:28200},{d:"Mar 12",p:28412},
];

const PORTFOLIO = [
  { name:"BTC", val:45, color:C.amber  },
  { name:"ETH", val:30, color:C.blue   },
  { name:"SOL", val:12, color:C.purple },
  { name:"Other",val:13,color:C.m2     },
];

// Analytics page data
const VOL_DATA = [
  {m:"Jan",vol:4200,sales:340,fees:120},{m:"Feb",vol:5800,sales:412,fees:160},
  {m:"Mar",vol:4900,sales:380,fees:140},{m:"Apr",vol:7200,sales:520,fees:200},
  {m:"May",vol:8100,sales:610,fees:230},{m:"Jun",vol:6400,sales:490,fees:180},
  {m:"Jul",vol:9200,sales:700,fees:270},{m:"Aug",vol:8700,sales:660,fees:250},
  {m:"Sep",vol:10100,sales:780,fees:300},{m:"Oct",vol:9800,sales:760,fees:290},
  {m:"Nov",vol:11200,sales:850,fees:340},{m:"Dec",vol:12400,sales:940,fees:380},
];

const CHAIN_PIE = [
  { name:"Ethereum", value:62, color:C.blue   },
  { name:"Solana",   value:18, color:C.purple },
  { name:"Polygon",  value:11, color:C.pink   },
  { name:"BNB",      value:9,  color:C.amber  },
];

const TOP_TRADERS = [
  { addr:"0xDead...Beef", vol:"1,240 ETH", trades:84, pnl:"+$124k", up:true  },
  { addr:"0xCafe...F00d", vol:"980 ETH",   trades:61, pnl:"+$87k",  up:true  },
  { addr:"0xBabe...C0de", vol:"740 ETH",   trades:43, pnl:"-$12k",  up:false },
  { addr:"0xFeed...Face", vol:"612 ETH",   trades:55, pnl:"+$54k",  up:true  },
  { addr:"0xAce0...1234", vol:"504 ETH",   trades:38, pnl:"+$31k",  up:true  },
];

// Calendar page data
const EVENTS = [
  { day:1,  type:"mint",    name:"KillaBears Mint",    time:"10:00 AM", price:"0.08 ETH", supply:"10,000", img:"🐻" },
  { day:3,  type:"auction", name:"CryptoPunk #1 Auction",time:"2:00 PM", price:"500 ETH+", supply:"1",   img:"🟦" },
  { day:5,  type:"drop",    name:"Azuki New Chapter",  time:"12:00 PM", price:"Free",     supply:"5,000",  img:"🌸" },
  { day:8,  type:"mint",    name:"MoonBirds Season 2", time:"6:00 PM",  price:"0.15 ETH", supply:"8,000",  img:"🦅" },
  { day:10, type:"event",   name:"NFT NYC Conference", time:"All Day",  price:"—",        supply:"—",      img:"🗽" },
  { day:12, type:"drop",    name:"Otherdeed Phase 2",  time:"3:00 PM",  price:"Raffle",   supply:"20,000", img:"🌍" },
  { day:15, type:"auction", name:"BAYC #9999 Auction", time:"11:00 AM", price:"200 ETH+", supply:"1",      img:"🦍" },
  { day:18, type:"mint",    name:"Y00ts Genesis",      time:"9:00 PM",  price:"0.22 ETH", supply:"15,000", img:"🐐" },
  { day:20, type:"event",   name:"Blur Season 2 Launch",time:"12:00 PM",price:"—",        supply:"—",      img:"🔥" },
  { day:22, type:"drop",    name:"DigiDaigaku Weapons",time:"5:00 PM",  price:"Free",     supply:"2,022",  img:"⚔️" },
  { day:25, type:"mint",    name:"Invisible Friends",  time:"2:00 PM",  price:"0.12 ETH", supply:"5,000",  img:"👁️" },
  { day:28, type:"event",   name:"OpenSea Creator Day",time:"All Day",  price:"—",        supply:"—",      img:"🌊" },
];

// Profile page data
const MY_NFTS = [
  { name:"CryptoPunk #4156", col:"CryptoPunks", val:"88 ETH",  img:"🟦", bg:"#1a2a4a" },
  { name:"Bored Ape #3001",  col:"BAYC",        val:"65 ETH",  img:"🦍", bg:"#2a1a3a" },
  { name:"Azuki #5512",      col:"Azuki",       val:"13 ETH",  img:"🌸", bg:"#3a1a2a" },
  { name:"CloneX #8812",     col:"CloneX",      val:"4.8 ETH", img:"🤖", bg:"#2a2a1a" },
  { name:"Doodle #112",      col:"Doodles",     val:"7.2 ETH", img:"🎨", bg:"#1a3a2a" },
  { name:"Moonbird #991",    col:"Moonbirds",   val:"9.1 ETH", img:"🦅", bg:"#1a2a3a" },
];

const TX_HISTORY = [
  { type:"Buy",  name:"Bored Ape #3001",  price:"60 ETH",  date:"Mar 12, 2023", status:"Confirmed", img:"🦍" },
  { type:"Sell", name:"Azuki #2200",      price:"18 ETH",  date:"Feb 28, 2023", status:"Confirmed", img:"🌸" },
  { type:"Buy",  name:"CryptoPunk #4156", price:"82 ETH",  date:"Feb 10, 2023", status:"Confirmed", img:"🟦" },
  { type:"Sell", name:"Doodle #8801",     price:"9.5 ETH", date:"Jan 22, 2023", status:"Confirmed", img:"🎨" },
  { type:"Buy",  name:"CloneX #8812",     price:"4.5 ETH", date:"Jan 15, 2023", status:"Confirmed", img:"🤖" },
];

const PORTFOLIO_CHART = [
  {m:"Sep",v:120},{m:"Oct",v:148},{m:"Nov",v:135},{m:"Dec",v:162},
  {m:"Jan",v:155},{m:"Feb",v:178},{m:"Mar",v:194},
];

const NAV_ITEMS = [
  { id:"feed",      label:"Feed",      Icon:LayoutDashboard },
  { id:"nfts",      label:"NFTs",      Icon:Image           },
  { id:"crypto",    label:"Crypto",    Icon:Bitcoin         },
  { id:"analytics", label:"Analytics", Icon:BarChart2       },
  { id:"calendar",  label:"Calendar",  Icon:Calendar        },
  { id:"profile",   label:"Profile",   Icon:User            },
];

// ═══════════════════════════════════════════════════════════════════════════
// PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════
function Card({ children, style={}, delay=0 }) {
  return (
    <div className="card" style={{
      background:C.surf, border:`1px solid ${C.border}`, borderRadius:14,
      padding:"18px 20px", overflow:"hidden", animationDelay:`${delay}ms`, ...style
    }}>{children}</div>
  );
}

function STitle({ children }) {
  return <span style={{ ...SY, fontSize:12, fontWeight:700, letterSpacing:1.4, textTransform:"uppercase", color:C.text }}>{children}</span>;
}

function CH({ title, right, mb=14 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:mb }}>
      <STitle>{title}</STitle>
      {right}
    </div>
  );
}

function TF({ options=["1D","7D","30D"], active, set }) {
  return (
    <div style={{ display:"flex", gap:3 }}>
      {options.map(o=>(
        <button key={o} onClick={()=>set(o)} style={{
          ...MO, padding:"3px 8px", borderRadius:6, fontSize:10, cursor:"pointer",
          border:`1px solid ${active===o?C.b2:C.border}`,
          background:active===o?C.s2:"transparent",
          color:active===o?C.text:C.m, fontWeight:active===o?600:400, transition:"all .12s"
        }}>{o}</button>
      ))}
    </div>
  );
}

function Thumb({ emoji, size=28, bg="#1c1c1c" }) {
  return (
    <div style={{ width:size, height:size, borderRadius:7, background:bg, border:`1px solid ${C.b2}`,
      display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.46, flexShrink:0 }}>
      {emoji}
    </div>
  );
}

function LiveDot({ color=C.green }) {
  return <span style={{ width:6, height:6, borderRadius:"50%", background:color,
    display:"inline-block", animation:"blink 2s ease infinite", flexShrink:0 }} />;
}

function VBtn({ children="VIEW MORE" }) {
  return (
    <Button variant="outline" size="sm" style={{ fontSize:10, height:26, ...SY, letterSpacing:.8,
      borderColor:C.b2, color:C.m2, background:"transparent", gap:4 }}>
      {children} <ExternalLink size={9} />
    </Button>
  );
}

function StatCard({ label, value, sub, icon:Icon, color=C.blue, delay=0 }) {
  return (
    <Card delay={delay} style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ ...MO, fontSize:10, color:C.m, letterSpacing:.6 }}>{label}</span>
        <div style={{ width:30, height:30, borderRadius:8, background:`${color}18`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon size={14} color={color} />
        </div>
      </div>
      <div style={{ ...SY, fontSize:22, fontWeight:800 }}>{value}</div>
      {sub && <div style={{ ...MO, fontSize:10, color:C.m2 }}>{sub}</div>}
    </Card>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:C.s2, border:`1px solid ${C.b2}`, borderRadius:10, padding:"8px 12px" }}>
      <div style={{ ...MO, fontSize:10, color:C.m2, marginBottom:4 }}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{ ...MO, fontSize:11, color:p.color||C.text }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FEED PAGE SECTIONS
// ═══════════════════════════════════════════════════════════════════════════
function TopCollections({ delay=0 }) {
  return (
    <Card delay={delay} style={{ display:"flex", flexDirection:"column" }}>
      <CH title="Top Collections" right={<VBtn />} />
      <div style={{ overflowX:"auto" }}>
        <div className="table-wrap"><table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["#","Collection","Volume","Floor","Sales","Owners","Mkt Cap"].map(h=>(
            <th key={h} style={{ ...SY, color:C.m, fontWeight:600, letterSpacing:.8, fontSize:10,
              textAlign:"left", padding:"5px 8px", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
          ))}</tr></thead>
          <tbody>{COLLECTIONS.map(c=>(
            <tr key={c.rank} className="rh" style={{ cursor:"pointer", transition:"background .12s" }}>
              <td style={{ ...MO, padding:"10px 8px", fontSize:11, color:C.m }}>{c.rank}</td>
              <td style={{ padding:"10px 8px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <Thumb emoji={c.img} size={28} />
                  <div>
                    <div style={{ ...SY, fontWeight:700, fontSize:12 }}>{c.name}</div>
                    <div style={{ ...MO, color:C.m, fontSize:9 }}>1hr ago</div>
                  </div>
                </div>
              </td>
              <td style={{ padding:"10px 8px" }}>
                <div style={{ ...MO, fontSize:11, marginBottom:3 }}>{c.volume}</div>
                <span style={{ ...MO, fontSize:9, fontWeight:600, padding:"2px 6px", borderRadius:4,
                  background:c.up?"rgba(34,197,94,.12)":"rgba(239,68,68,.12)",
                  color:c.up?C.green:C.red }}>{c.chg}</span>
              </td>
              <td style={{ ...MO, padding:"10px 8px", fontSize:11 }}>{c.floor}</td>
              <td style={{ ...MO, padding:"10px 8px", fontSize:11 }}>{c.sales}</td>
              <td style={{ ...MO, padding:"10px 8px", fontSize:11 }}>{c.owners.toLocaleString()}</td>
              <td style={{ ...MO, padding:"10px 8px", fontSize:11 }}>{c.cap}</td>
            </tr>
          ))}</tbody>
        </table>
        </div>
      </div>
    </Card>
  );
}

function TopSales({ delay=0, fillHeight=false }) {
  return (
    <Card delay={delay} style={fillHeight ? { display:"flex", flexDirection:"column", height:"100%" } : {}}>
      <CH title="Top Sales" right={<VBtn />} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, flex: fillHeight ? 1 : undefined }}>
        {TOP_SALES.map(s=>(
          <div key={s.id} className="sc" style={{ display:"flex", alignItems:"center", gap:8,
            background:C.s2, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 10px", cursor:"pointer" }}>
            <span style={{ ...MO, color:C.m, fontSize:10, width:14, flexShrink:0 }}>{s.id}</span>
            <Thumb emoji={s.img} size={30} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ ...SY, fontWeight:700, fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:3, marginTop:2 }}>
                <Clock size={9} color={C.m} />
                <span style={{ ...MO, color:C.m, fontSize:9 }}>{s.ago} ago</span>
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ ...MO, fontSize:11, color:C.green, fontWeight:600 }}>{s.price}</div>
              <div style={{ ...MO, color:C.m, fontSize:9 }}>{s.eth}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

const TRENDING = [
  { name:"CryptoPunks", img:"🟦", floor:"99.9 ETH", chg:"+4.2%",  up:true  },
  { name:"Bored Apes",  img:"🦍", floor:"72.5 ETH", chg:"+8.1%",  up:true  },
  { name:"Azuki",       img:"🌸", floor:"14.2 ETH", chg:"-2.3%",  up:false },
  { name:"CloneX",      img:"🤖", floor:"5.2 ETH",  chg:"+12.4%", up:true  },
  { name:"Doodles",     img:"🎨", floor:"6.8 ETH",  chg:"-1.8%",  up:false },
];

function TrendingPanel({ delay=0 }) {
  return (
    <Card delay={delay} style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <CH title="Trending" right={
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <Flame size={12} color={C.amber} />
          <span style={{ ...MO, fontSize:9, color:C.amber }}>HOT</span>
        </div>
      } />
      <div style={{ display:"flex", flexDirection:"column", gap:4, flex:1 }}>
        {TRENDING.map((t,i)=>(
          <div key={i} className="rh" style={{ display:"flex", alignItems:"center", gap:10,
            padding:"9px 8px", borderRadius:9, cursor:"pointer", transition:"background .12s" }}>
            <span style={{ ...MO, color:C.m, fontSize:10, width:14, flexShrink:0 }}>{i+1}</span>
            <Thumb emoji={t.img} size={28} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ ...SY, fontWeight:700, fontSize:12 }}>{t.name}</div>
              <div style={{ ...MO, color:C.m, fontSize:9 }}>Floor: {t.floor}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              {t.up ? <TrendingUp size={11} color={C.green}/> : <TrendingDown size={11} color={C.red}/>}
              <span style={{ ...MO, fontSize:10, fontWeight:600, color:t.up?C.green:C.red }}>{t.chg}</span>
            </div>
          </div>
        ))}
        {/* Mini sparkline row */}
        <div style={{ marginTop:"auto", paddingTop:10, borderTop:`1px solid ${C.border}` }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[
              { label:"24h Vol",   value:"52k ETH",  up:true  },
              { label:"Avg Price", value:"8.4 ETH",  up:false },
              { label:"Sales",     value:"1,204",    up:true  },
            ].map(s=>(
              <div key={s.label} style={{ background:C.s2, borderRadius:8, padding:"8px 10px", border:`1px solid ${C.border}` }}>
                <div style={{ ...MO, fontSize:9, color:C.m, marginBottom:3 }}>{s.label}</div>
                <div style={{ ...SY, fontWeight:700, fontSize:13 }}>{s.value}</div>
                <div style={{ ...MO, fontSize:9, color:s.up?C.green:C.red, marginTop:2 }}>
                  {s.up?"▲":"▼"} {s.up?"+3.2%":"-1.1%"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function NewsPanel({ delay=0 }) {
  return (
    <Card delay={delay} style={{ display:"flex", flexDirection:"column", height:"100%", flex:1 }}>
      <CH title="News" right={<div style={{ display:"flex", alignItems:"center", gap:5 }}><LiveDot /><span style={{ ...MO, fontSize:9, color:C.m }}>LIVE</span></div>} />
      <div style={{ flex:1, overflowY:"auto", minHeight:0 }}>
        {NEWS.map((n,i)=>(
          <div key={i} className="news-row" style={{ padding:"11px 0",
            borderBottom:`1px solid ${C.border}`, cursor:"pointer", transition:"opacity .12s" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:9 }}>
              <LiveDot color={n.hot?C.amber:C.m} />
              <div style={{ flex:1 }}>
                <div style={{ ...MO, color:C.m, fontSize:9, marginBottom:3 }}>{n.time}</div>
                <div style={{ ...SY, fontSize:12, fontWeight:600, lineHeight:1.55 }}>{n.headline}</div>
              </div>
              <ArrowUpRight size={11} color={C.m} style={{ flexShrink:0, marginTop:3 }} />
            </div>
          </div>
        ))}
        {/* Extra news to fill the panel */}
        {[
          { time:"03:22 · Jul 10, 2022", headline:"Larva Labs Passes Creative Control to Yuga Labs", hot:false },
          { time:"02:48 · Jul 10, 2022", headline:"NBA Top Shot Volume Surges 30% After New Drop",   hot:true  },
          { time:"01:14 · Jul 10, 2022", headline:"DraftKings NFT Marketplace Goes Live in Beta",     hot:false },
          { time:"00:30 · Jul 10, 2022", headline:"MetaMask Hits 30M Monthly Active Users Milestone", hot:true  },
        ].map((n,i)=>(
          <div key={`x${i}`} className="news-row" style={{ padding:"11px 0",
            borderBottom:`1px solid ${C.border}`, cursor:"pointer", transition:"opacity .12s" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:9 }}>
              <LiveDot color={n.hot?C.amber:C.m} />
              <div style={{ flex:1 }}>
                <div style={{ ...MO, color:C.m, fontSize:9, marginBottom:3 }}>{n.time}</div>
                <div style={{ ...SY, fontSize:12, fontWeight:600, lineHeight:1.55 }}>{n.headline}</div>
              </div>
              <ArrowUpRight size={11} color={C.m} style={{ flexShrink:0, marginTop:3 }} />
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" style={{ width:"100%", marginTop:12, flexShrink:0, fontSize:10, ...SY,
        letterSpacing:.8, borderColor:C.b2, color:C.m2, background:"transparent" }}>VIEW ALL NEWS</Button>
    </Card>
  );
}

function UpcomingProjects({ delay=0 }) {
  const [page, setPage] = useState(0);
  const PER=5, pages=Math.ceil(UPCOMING.length/PER);
  const items=UPCOMING.slice(page*PER,page*PER+PER);
  return (
    <Card delay={delay} style={{ flex:1, display:"flex", flexDirection:"column" }}>
      <CH title="Upcoming Projects" right={
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} style={{ ...pgBtn, opacity:page===0?.35:1 }}><ChevronLeft size={11}/></button>
          <span style={{ ...MO, fontSize:9, color:C.m }}>{page+1}/{pages}</span>
          <button onClick={()=>setPage(p=>Math.min(pages-1,p+1))} style={{ ...pgBtn, opacity:page===pages-1?.35:1 }}><ChevronRight size={11}/></button>
        </div>
      } />
      <div className="table-wrap"><table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead><tr>{["Collection","Supply","Release"].map(h=>(
          <th key={h} style={{ ...SY, color:C.m, fontWeight:600, letterSpacing:.8, fontSize:10,
            textAlign:"left", padding:"5px 8px", borderBottom:`1px solid ${C.border}` }}>{h}</th>
        ))}</tr></thead>
        <tbody>{items.map((p,i)=>(
          <tr key={i} className="rh" style={{ cursor:"pointer", transition:"background .12s" }}>
            <td style={{ padding:"9px 8px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Thumb emoji={p.img} size={26} />
                <div>
                  <div style={{ ...SY, fontWeight:700, fontSize:12 }}>{p.name}</div>
                  <div style={{ ...MO, color:C.m, fontSize:9 }}>{p.supply}</div>
                </div>
              </div>
            </td>
            <td style={{ padding:"9px 8px" }}>
              <div style={{ width:22, height:22, borderRadius:"50%", border:`1px solid ${C.b2}`,
                display:"flex", alignItems:"center", justifyContent:"center", color:C.m2, fontSize:13, cursor:"pointer" }}>+</div>
            </td>
            <td style={{ padding:"9px 8px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <Calendar size={10} color={C.m} />
                <span style={{ ...MO, color:C.m2, fontSize:11 }}>{p.release}</span>
              </div>
            </td>
          </tr>
        ))}</tbody>
      </table>
      </div>
      <div style={{ flex:1 }} />
      <div style={{ marginTop:14, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
        <Button variant="outline" size="sm" style={{ width:"100%", fontSize:10, ...SY,
          letterSpacing:.8, borderColor:C.b2, color:C.m2, background:"transparent" }}>
          SEE MORE <ExternalLink size={9} style={{ marginLeft:4 }} />
        </Button>
      </div>
    </Card>
  );
}

const pgBtn = { background:"transparent", border:`1px solid ${C.border}`, color:C.m2,
  width:22, height:22, borderRadius:6, cursor:"pointer", display:"inline-flex",
  alignItems:"center", justifyContent:"center" };

function WalletTable({ data, label, isBuy, delay=0 }) {
  const [q,setQ]=useState("");
  const rows=data.filter(r=>r.addr.includes(q));
  return (
    <Card delay={delay} style={{ display:"flex", flexDirection:"column" }}>
      <CH title={label} right={<TF active="1D" set={()=>{}} />} />
      <div className="table-wrap"><table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead><tr>{["Address","Volume",isBuy?"BUY":"SELL"].map(h=>(
          <th key={h} style={{ ...SY, color:C.m, fontWeight:600, letterSpacing:.8, fontSize:10,
            textAlign:"left", padding:"5px 8px", borderBottom:`1px solid ${C.border}` }}>{h}</th>
        ))}</tr></thead>
        <tbody>{rows.map((r,i)=>(
          <tr key={i} className="rh" style={{ cursor:"pointer", transition:"background .12s" }}>
            <td style={{ padding:"8px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:`hsl(${i*45+10},55%,38%)`, flexShrink:0 }} />
                <span style={{ ...MO, fontSize:11 }}>{r.addr}</span>
              </div>
            </td>
            <td style={{ ...MO, padding:"8px", fontSize:11 }}>{r.vol}</td>
            <td style={{ ...MO, padding:"8px", fontSize:11, color:isBuy?C.green:C.red }}>{r.count}</td>
          </tr>
        ))}</tbody>
      </table>
      </div>
      <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:7, background:C.s2,
        border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 10px" }}>
        <Search size={11} color={C.m} />
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search address…"
          style={{ ...MO, background:"transparent", border:"none", outline:"none", color:C.text, fontSize:11, flex:1 }} />
      </div>
    </Card>
  );
}

function MarketOverview({ delay=0 }) {
  const [tf,setTf]=useState("1D");
  const [metric,setMetric]=useState("Volume");
  return (
    <Card delay={delay}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6, flexWrap:"wrap", gap:10 }}>
        <STitle>Market Overview</STitle>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" style={{ fontSize:10, height:26, ...SY, letterSpacing:.8, borderColor:C.b2, color:C.m2, background:"transparent", gap:4 }}>
                {metric} <ChevronDown size={9} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:10, zIndex:99 }}>
              {["Volume","Market Cap","Sales","Floor"].map(m=>(
                <DropdownMenuItem key={m} onClick={()=>setMetric(m)} style={{ ...SY, fontSize:11, color:C.m2, cursor:"pointer" }}>{m}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <TF active={tf} set={setTf} />
        </div>
      </div>
      <div style={{ ...MO, color:C.m, fontSize:10, marginBottom:12 }}>{metric.toUpperCase()} · ETH</div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={FEED_CHART} margin={{ top:5, right:4, left:-20, bottom:0 }}>
          <defs>
            <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={C.text} stopOpacity={.12}/>
              <stop offset="95%" stopColor={C.text} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="gv2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={C.blue} stopOpacity={.1}/>
              <stop offset="95%" stopColor={C.blue} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="d" tick={{ fill:C.m, fontSize:10, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill:C.m, fontSize:10, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} domain={[80,175]} />
          <ReTip content={<ChartTooltip/>} cursor={{ stroke:"rgba(255,255,255,.07)" }} />
          <Area type="monotone" dataKey="v" name="Volume"   stroke={C.text} strokeWidth={1.8} fill="url(#gv)"  dot={false} />
          <Area type="monotone" dataKey="m" name="Mkt Cap"  stroke={C.blue} strokeWidth={1.5} fill="url(#gv2)" dot={false} strokeDasharray="4 3" />
        </AreaChart>
      </ResponsiveContainer>
      {/* Stats strip below chart */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:8, marginTop:16,
        borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
        {[
          { label:"Total Volume",   value:"52,412 ETH", chg:"+18.4%", up:true  },
          { label:"Total Sales",    value:"1,204",       chg:"+5.2%",  up:true  },
          { label:"Avg Sale Price", value:"8.4 ETH",     chg:"-0.3%",  up:false },
          { label:"Active Wallets", value:"24,810",      chg:"+3.1%",  up:true  },
          { label:"New Mints",      value:"310",         chg:"+22.0%", up:true  },
        ].map(s=>(
          <div key={s.label} style={{ padding:"10px 12px", background:C.s2, borderRadius:10, border:`1px solid ${C.border}` }}>
            <div style={{ ...MO, fontSize:9, color:C.m, marginBottom:4 }}>{s.label}</div>
            <div style={{ ...SY, fontWeight:800, fontSize:15 }}>{s.value}</div>
            <div style={{ ...MO, fontSize:10, color:s.up?C.green:C.red, marginTop:3 }}>
              {s.up?"▲ ":"▼ "}{s.chg}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NFTs PAGE
// ═══════════════════════════════════════════════════════════════════════════
const RARITY_COLOR = { Legendary:C.amber, Epic:C.purple, Rare:C.blue, Uncommon:C.cyan, Common:C.m2 };

const NFT_OFFERS = [
  { name:"CryptoPunk #3100", from:"0xBee...f00d", offer:"105 ETH", exp:"2h",  img:"🟦" },
  { name:"Bored Ape #7495",  from:"0xAce...1234", offer:"70 ETH",  exp:"5h",  img:"🦍" },
  { name:"Azuki #9209",      from:"0xCaf...babe", offer:"13 ETH",  exp:"11h", img:"🌸" },
  { name:"CloneX #11571",    from:"0xDead...bee", offer:"4.9 ETH", exp:"22h", img:"🤖" },
];

const NFT_EXTRA_ACTIVITY = [
  { type:"Sale",     name:"Moonbird #2491",  price:"8.5 ETH",  from:"0xaaa...111", to:"0xbbb...222", ago:"52 min",  img:"🦅" },
  { type:"Listing",  name:"Y00t #4401",      price:"3.5 ETH",  from:"0xccc...333", to:"—",           ago:"1 hr",    img:"🐐" },
  { type:"Mint",     name:"KillaBear #0912", price:"0.08 ETH", from:"0x000...000", to:"0xddd...444", ago:"1.5 hr",  img:"🐻" },
];

function NFTsPage({ isMobile=false, isTablet=false }) {
  const [view,setView]=useState("grid");
  const [liked,setLiked]=useState({2:true,5:true,8:true});
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("All");

  const filtered = NFT_ITEMS.filter(n=>{
    const ms = n.name.toLowerCase().includes(search.toLowerCase()) || n.col.toLowerCase().includes(search.toLowerCase());
    const mf = filter==="All" || n.rarity===filter;
    return ms && mf;
  });

  const allActivity = [...NFT_ACTIVITY, ...NFT_EXTRA_ACTIVITY];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:12 }}>
        <StatCard label="FLOOR PRICE"  value="14.2 ETH"   sub="Across all owned" icon={DollarSign} color={C.amber}  delay={40} />
        <StatCard label="ITEMS OWNED"  value="9"          sub="Across 5 collections" icon={Image}  color={C.blue}   delay={80} />
        <StatCard label="EST. VALUE"   value="198 ETH"    sub="≈ $364,740 USD"   icon={Wallet}     color={C.purple} delay={120}/>
      </div>

      {/* Controls bar */}
      <Card delay={160} style={{ padding:"12px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:180, display:"flex", alignItems:"center", gap:7, background:C.s2,
            border:`1px solid ${C.border}`, borderRadius:9, padding:"7px 10px" }}>
            <Search size={12} color={C.m} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search NFTs or collections…"
              style={{ ...MO, background:"transparent", border:"none", outline:"none", color:C.text, fontSize:12, flex:1 }} />
          </div>
          <div style={{ display:"flex", gap:4 }}>
            {["All","Legendary","Epic","Rare","Uncommon"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{
                ...MO, padding:"5px 10px", borderRadius:7, fontSize:10, cursor:"pointer",
                border:`1px solid ${filter===f?C.b3:C.border}`,
                background:filter===f?C.s3:"transparent",
                color:filter===f?(RARITY_COLOR[f]||C.text):C.m, transition:"all .12s"
              }}>{f}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:4 }}>
            {[{v:"grid",I:Grid},{v:"list",I:List}].map(({v,I})=>(
              <button key={v} onClick={()=>setView(v)} style={{ ...pgBtn, background:view===v?C.s2:"transparent",
                borderColor:view===v?C.b2:C.border, color:view===v?C.text:C.m }}>
                <I size={13}/>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 300px", gap:14, alignItems:"start" }}>

        {/* Left: NFT grid / list + activity */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {view==="grid" ? (
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(3,1fr)", gap:12 }}>
              {filtered.map((n,i)=>(
                <div key={n.id} className="nft-card" style={{ background:C.surf, border:`1px solid ${C.border}`,
                  borderRadius:14, overflow:"hidden", cursor:"pointer", animationDelay:`${i*30}ms` }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.b3}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                  <div style={{ height:150, background:n.bg, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:64, position:"relative" }}>
                    {n.img}
                    <span style={{ position:"absolute", top:8, right:8, ...MO, fontSize:8, fontWeight:600,
                      padding:"2px 6px", borderRadius:4, background:`${RARITY_COLOR[n.rarity]}22`, color:RARITY_COLOR[n.rarity] }}>{n.rarity}</span>
                  </div>
                  <div style={{ padding:"11px 13px" }}>
                    <div style={{ ...MO, color:C.m, fontSize:9, marginBottom:2 }}>{n.col}</div>
                    <div style={{ ...SY, fontWeight:700, fontSize:12, marginBottom:7 }}>{n.name}</div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ ...MO, color:C.m, fontSize:9 }}>Price</div>
                        <div style={{ ...MO, fontSize:11, fontWeight:600, color:C.green }}>{n.price}</div>
                      </div>
                      <button onClick={()=>setLiked(l=>({...l,[n.id]:!l[n.id]}))} style={{
                        background:"transparent", border:"none", cursor:"pointer",
                        display:"flex", alignItems:"center", gap:3, color:liked[n.id]?C.red:C.m }}>
                        <Heart size={12} fill={liked[n.id]?"currentColor":"none"} />
                        <span style={{ ...MO, fontSize:9 }}>{n.likes}</span>
                      </button>
                    </div>
                    <Button variant="outline" size="sm" style={{ width:"100%", marginTop:8, fontSize:10, height:26,
                      ...SY, borderColor:C.b2, color:C.m2, background:"transparent" }}>Make Offer</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card delay={200}>
              <div className="table-wrap"><table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>{["Item","Collection","Price","Last Sale","Rarity",""].map(h=>(
                  <th key={h} style={{ ...SY, color:C.m, fontWeight:600, letterSpacing:.8, fontSize:10,
                    textAlign:"left", padding:"5px 10px", borderBottom:`1px solid ${C.border}` }}>{h}</th>
                ))}</tr></thead>
                <tbody>{filtered.map((n,i)=>(
                  <tr key={n.id} className="rh" style={{ cursor:"pointer", transition:"background .12s" }}>
                    <td style={{ padding:"10px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:40, height:40, borderRadius:8, background:n.bg,
                          display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{n.img}</div>
                        <span style={{ ...SY, fontWeight:700, fontSize:12 }}>{n.name}</span>
                      </div>
                    </td>
                    <td style={{ ...MO, padding:"10px", fontSize:11, color:C.m2 }}>{n.col}</td>
                    <td style={{ ...MO, padding:"10px", fontSize:11, color:C.green, fontWeight:600 }}>{n.price}</td>
                    <td style={{ ...MO, padding:"10px", fontSize:11 }}>{n.last}</td>
                    <td style={{ padding:"10px" }}>
                      <span style={{ ...MO, fontSize:9, padding:"2px 7px", borderRadius:4,
                        background:`${RARITY_COLOR[n.rarity]}18`, color:RARITY_COLOR[n.rarity] }}>{n.rarity}</span>
                    </td>
                    <td style={{ padding:"10px" }}>
                      <Button variant="outline" size="sm" style={{ fontSize:10, height:24, ...SY, borderColor:C.b2, color:C.m2, background:"transparent" }}>Buy</Button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
              </div>
            </Card>
          )}

          {/* Recent Activity — full width */}
          <Card delay={240}>
            <CH title="Recent Activity" right={<VBtn />} />
            <div className="table-wrap"><table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Event","Item","Price","From","To","Time"].map(h=>(
                <th key={h} style={{ ...SY, color:C.m, fontWeight:600, letterSpacing:.8, fontSize:10,
                  textAlign:"left", padding:"5px 10px", borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}</tr></thead>
              <tbody>{allActivity.map((a,i)=>(
                <tr key={i} className="rh" style={{ cursor:"pointer", transition:"background .12s" }}>
                  <td style={{ padding:"10px" }}>
                    <span style={{ ...MO, fontSize:10, padding:"3px 8px", borderRadius:5,
                      background:{Sale:"rgba(34,197,94,.12)",Listing:"rgba(59,130,246,.12)",Transfer:"rgba(168,85,247,.12)",Mint:"rgba(245,158,11,.12)"}[a.type],
                      color:{Sale:C.green,Listing:C.blue,Transfer:C.purple,Mint:C.amber}[a.type] }}>{a.type}</span>
                  </td>
                  <td style={{ padding:"10px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <Thumb emoji={a.img} size={24} />
                      <span style={{ ...SY, fontWeight:600, fontSize:11 }}>{a.name}</span>
                    </div>
                  </td>
                  <td style={{ ...MO, padding:"10px", fontSize:11, color:C.green }}>{a.price}</td>
                  <td style={{ ...MO, padding:"10px", fontSize:10, color:C.m2 }}>{a.from}</td>
                  <td style={{ ...MO, padding:"10px", fontSize:10, color:C.m2 }}>{a.to}</td>
                  <td style={{ ...MO, padding:"10px", fontSize:10, color:C.m }}>{a.ago} ago</td>
                </tr>
              ))}</tbody>
            </table>
            </div>
          </Card>
        </div>

        {/* Right sidebar: collection stats + offers */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Collection stats */}
          <Card delay={50}>
            <CH title="Collection Stats" />
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {COLLECTIONS.map((c,i)=>(
                <div key={i} className="rh" style={{ display:"flex", alignItems:"center", gap:9,
                  padding:"8px 6px", borderRadius:9, cursor:"pointer", transition:"background .12s" }}>
                  <Thumb emoji={c.img} size={28} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ ...SY, fontWeight:700, fontSize:12 }}>{c.name}</div>
                    <div style={{ ...MO, fontSize:9, color:C.m }}>Floor: {c.floor}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ ...MO, fontSize:10, color:c.up?C.green:C.red, fontWeight:600 }}>{c.chg}</div>
                    <div style={{ ...MO, fontSize:9, color:C.m }}>{c.sales} sales</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Offers */}
          <Card delay={80}>
            <CH title="Active Offers" right={<span style={{ ...MO, fontSize:10, color:C.amber }}>{NFT_OFFERS.length} pending</span>} />
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {NFT_OFFERS.map((o,i)=>(
                <div key={i} style={{ background:C.s2, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                    <Thumb emoji={o.img} size={26} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ ...SY, fontWeight:700, fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.name}</div>
                      <div style={{ ...MO, fontSize:9, color:C.m }}>from {o.from}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ ...MO, fontSize:11, color:C.green, fontWeight:600 }}>{o.offer}</div>
                      <div style={{ ...MO, fontSize:9, color:C.m }}>exp. {o.exp}</div>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                    <Button size="sm" style={{ fontSize:10, height:24, ...SY, background:C.green+"22", color:C.green, border:`1px solid ${C.green}44` }}>Accept</Button>
                    <Button variant="outline" size="sm" style={{ fontSize:10, height:24, ...SY, borderColor:C.b2, color:C.m2, background:"transparent" }}>Decline</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Rarity breakdown */}
          <Card delay={110}>
            <CH title="Rarity Breakdown" />
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {Object.entries(RARITY_COLOR).map(([r,color])=>{
                const count = NFT_ITEMS.filter(n=>n.rarity===r).length;
                const pct = Math.round(count/NFT_ITEMS.length*100);
                return (
                  <div key={r}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ ...MO, fontSize:10, color }}>{r}</span>
                      <span style={{ ...MO, fontSize:10, color:C.m2 }}>{count} items · {pct}%</span>
                    </div>
                    <div style={{ height:4, borderRadius:2, background:C.s2, overflow:"hidden" }}>
                      <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CRYPTO PAGE
// ═══════════════════════════════════════════════════════════════════════════
const COIN_CHARTS = {
  BTC: [{d:"1",p:25100},{d:"2",p:26200},{d:"3",p:25800},{d:"4",p:27100},{d:"5",p:27800},{d:"6",p:26900},{d:"7",p:28412}],
  ETH: [{d:"1",p:1600},{d:"2",p:1720},{d:"3",p:1680},{d:"4",p:1750},{d:"5",p:1800},{d:"6",p:1820},{d:"7",p:1842}],
  SOL: [{d:"1",p:16},{d:"2",p:17},{d:"3",p:18.5},{d:"4",p:19},{d:"5",p:20},{d:"6",p:21},{d:"7",p:22.4}],
};

const GAS_DATA = [
  {t:"00:00",g:14},{t:"04:00",g:12},{t:"08:00",g:22},{t:"12:00",g:35},
  {t:"16:00",g:28},{t:"20:00",g:18},{t:"24:00",g:16},
];

const RECENT_TXS = [
  { hash:"0xabc...f01", type:"Swap",     val:"2.4 ETH → 4,420 USDC", fee:"$1.10", ago:"1 min"  },
  { hash:"0xdef...a02", type:"Transfer", val:"0.5 ETH",               fee:"$0.42", ago:"4 min"  },
  { hash:"0x123...b03", type:"Approval", val:"USDC unlimited",         fee:"$0.21", ago:"9 min"  },
  { hash:"0x456...c04", type:"Swap",     val:"1,000 USDC → 0.54 ETH", fee:"$0.98", ago:"15 min" },
  { hash:"0x789...d05", type:"Mint",     val:"NFT KillaBear #0012",    fee:"$4.20", ago:"22 min" },
];

const TX_TYPE_COLOR = { Swap:C.blue, Transfer:C.green, Approval:C.amber, Mint:C.purple };

function CryptoPage({ isMobile=false, isTablet=false }) {
  const [tf,setTf]=useState("7D");
  const [selCoin,setSelCoin]=useState("BTC");
  const [search,setSearch]=useState("");
  const filtered = COINS.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.sym.toLowerCase().includes(search.toLowerCase()));
  const chartData = COIN_CHARTS[selCoin] || COIN_CHARTS.BTC;
  const coin = COINS.find(c=>c.sym===selCoin)||COINS[0];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:12 }}>
        <StatCard label="GLOBAL MKT CAP"  value="$1.12T"  sub="+3.2% (24h)"     icon={Globe}    color={C.blue}   delay={0}  />
        <StatCard label="24H VOLUME"       value="$48.2B"  sub="Across all pairs" icon={Activity} color={C.green}  delay={40} />
        <StatCard label="BTC DOMINANCE"    value="49.3%"   sub="-0.4% today"      icon={Bitcoin}  color={C.amber}  delay={80} />
        <StatCard label="ETH GAS"          value="18 Gwei" sub="~$1.20 per tx"    icon={Zap}      color={C.purple} delay={120}/>
      </div>

      {/* Two-column main area */}
      <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 300px", gap:14, alignItems:"start" }}>

        {/* Left column */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Price chart — coin selector built in */}
          <Card delay={160}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, flexWrap:"wrap", gap:8 }}>
              <div style={{ display:"flex", gap:6 }}>
                {["BTC","ETH","SOL"].map(s=>{
                  const c=COINS.find(x=>x.sym===s);
                  return (
                    <button key={s} onClick={()=>setSelCoin(s)} style={{
                      display:"flex", alignItems:"center", gap:7, padding:"6px 12px", borderRadius:9, cursor:"pointer",
                      border:`1px solid ${selCoin===s?C.b3:C.border}`, background:selCoin===s?C.s2:"transparent",
                      color:selCoin===s?C.text:C.m, transition:"all .12s"
                    }}>
                      <div style={{ width:20, height:20, borderRadius:5, background:`${c.color}20`,
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:11 }}>
                        {s==="BTC"?"₿":s==="ETH"?"Ξ":"◎"}
                      </div>
                      <div style={{ textAlign:"left" }}>
                        <div style={{ ...SY, fontWeight:700, fontSize:11 }}>{s}</div>
                        <div style={{ ...MO, fontSize:9, color:c?.up?C.green:C.red }}>{c?.chg}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ textAlign:"right" }}>
                  <div style={{ ...SY, fontWeight:800, fontSize:20 }}>{coin.price}</div>
                  <div style={{ ...MO, fontSize:11, color:coin.up?C.green:C.red }}>{coin.up?"▲":"▼"} {coin.chg} (24h)</div>
                </div>
                <TF active={tf} set={setTf} />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top:5, right:4, left:-20, bottom:0 }}>
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={coin.color} stopOpacity={.18}/>
                    <stop offset="95%" stopColor={coin.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="d" tick={{ fill:C.m, fontSize:9, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:C.m, fontSize:9, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} domain={["auto","auto"]} />
                <ReTip content={<ChartTooltip/>} cursor={{ stroke:"rgba(255,255,255,.07)" }} />
                <Area type="monotone" dataKey="p" name="Price" stroke={coin.color} strokeWidth={2} fill="url(#cg)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            {/* Coin detail stats strip */}
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:8, marginTop:14,
              borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
              {[["Market Cap",coin.mcap],["Volume 24h",coin.vol],["7d Change",coin.chg7],["Rank",`#${coin.rank}`]].map(([l,v])=>(
                <div key={l} style={{ background:C.s2, borderRadius:8, padding:"8px 10px", border:`1px solid ${C.border}` }}>
                  <div style={{ ...MO, fontSize:9, color:C.m, marginBottom:3 }}>{l}</div>
                  <div style={{ ...SY, fontWeight:700, fontSize:13 }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Gas tracker */}
          <Card delay={190}>
            <CH title="Gas Tracker" right={
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                {[["Slow","12"],["Avg","18"],["Fast","28"]].map(([l,g])=>(
                  <div key={l} style={{ background:C.s2, border:`1px solid ${C.border}`, borderRadius:7,
                    padding:"4px 10px", textAlign:"center" }}>
                    <div style={{ ...MO, fontSize:9, color:C.m }}>{l}</div>
                    <div style={{ ...SY, fontSize:12, fontWeight:700 }}>{g}</div>
                  </div>
                ))}
                <span style={{ ...MO, fontSize:9, color:C.m }}>Gwei</span>
              </div>
            } />
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={GAS_DATA} margin={{ top:5, right:4, left:-20, bottom:0 }}>
                <defs>
                  <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.purple} stopOpacity={.15}/>
                    <stop offset="95%" stopColor={C.purple} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" tick={{ fill:C.m, fontSize:9, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:C.m, fontSize:9, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                <ReTip content={<ChartTooltip/>} cursor={{ stroke:"rgba(255,255,255,.07)" }} />
                <Area type="monotone" dataKey="g" name="Gas (Gwei)" stroke={C.purple} strokeWidth={2} fill="url(#gg)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Coin table */}
          <Card delay={210}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <STitle>Market</STitle>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, background:C.s2,
                  border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 10px" }}>
                  <Search size={11} color={C.m} />
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search coin…"
                    style={{ ...MO, background:"transparent", border:"none", outline:"none", color:C.text, fontSize:11, width:120 }} />
                </div>
                <TF active={tf} set={setTf} />
              </div>
            </div>
            <div className="table-wrap"><table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["#","Name","Price","24h","7d","Mkt Cap","Volume",""].map(h=>(
                <th key={h} style={{ ...SY, color:C.m, fontWeight:600, letterSpacing:.8, fontSize:10,
                  textAlign:"left", padding:"6px 10px", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
              ))}</tr></thead>
              <tbody>{filtered.map(c=>(
                <tr key={c.rank} className="coin-row" style={{ cursor:"pointer", transition:"background .12s" }}
                  onClick={()=>COIN_CHARTS[c.sym]&&setSelCoin(c.sym)}>
                  <td style={{ ...MO, padding:"11px 10px", fontSize:11, color:C.m }}>{c.rank}</td>
                  <td style={{ padding:"11px 10px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ width:28, height:28, borderRadius:7, background:`${c.color}18`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontSize:13 }}>{c.sym==="BTC"?"₿":c.sym==="ETH"?"Ξ":c.sym[0]}</span>
                      </div>
                      <div>
                        <div style={{ ...SY, fontWeight:700, fontSize:12 }}>{c.name}</div>
                        <div style={{ ...MO, color:C.m, fontSize:9 }}>{c.sym}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...MO, padding:"11px 10px", fontSize:12, fontWeight:600 }}>{c.price}</td>
                  <td style={{ padding:"11px 10px" }}><span style={{ ...MO, fontSize:11, color:c.up?C.green:C.red }}>{c.chg}</span></td>
                  <td style={{ padding:"11px 10px" }}><span style={{ ...MO, fontSize:11, color:parseFloat(c.chg7)>0?C.green:C.red }}>{c.chg7}</span></td>
                  <td style={{ ...MO, padding:"11px 10px", fontSize:11 }}>{c.mcap}</td>
                  <td style={{ ...MO, padding:"11px 10px", fontSize:11 }}>{c.vol}</td>
                  <td style={{ padding:"11px 10px" }}>
                    <Button variant="outline" size="sm" style={{ fontSize:10, height:24, ...SY, borderColor:C.b2, color:C.m2, background:"transparent" }}>Trade</Button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Portfolio donut */}
          <Card delay={180}>
            <CH title="My Portfolio" />
            <ResponsiveContainer width="100%" height={160}>
              <RePie>
                <Pie data={PORTFOLIO} cx="50%" cy="50%" innerRadius={44} outerRadius={70}
                  dataKey="val" paddingAngle={3}>
                  {PORTFOLIO.map((e,i)=><Cell key={i} fill={e.color} />)}
                </Pie>
                <ReTip content={<ChartTooltip/>} />
              </RePie>
            </ResponsiveContainer>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {PORTFOLIO.map(p=>(
                <div key={p.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <div style={{ width:8, height:8, borderRadius:2, background:p.color }} />
                    <span style={{ ...MO, fontSize:11 }}>{p.name}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:50, height:3, borderRadius:2, background:C.s2, overflow:"hidden" }}>
                      <div style={{ width:`${p.val}%`, height:"100%", background:p.color }} />
                    </div>
                    <span style={{ ...MO, fontSize:10, color:C.m2, width:28, textAlign:"right" }}>{p.val}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
              <div style={{ ...MO, fontSize:9, color:C.m, marginBottom:3 }}>TOTAL VALUE</div>
              <div style={{ ...SY, fontWeight:800, fontSize:18 }}>$84,210.50</div>
              <div style={{ ...MO, fontSize:10, color:C.green, marginTop:2 }}>+$4,120 today (+5.1%)</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
              <Button variant="outline" style={{ fontSize:11, ...SY, borderColor:C.b2, color:C.m2, background:"transparent" }}>Withdraw</Button>
              <Button style={{ fontSize:11, ...SY, background:C.text, color:C.bg }}>Deposit</Button>
            </div>
          </Card>

          {/* Recent transactions */}
          <Card delay={200}>
            <CH title="Recent Transactions" right={<VBtn />} />
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {RECENT_TXS.map((t,i)=>(
                <div key={i} className="rh" style={{ display:"flex", alignItems:"center", gap:10,
                  padding:"9px 8px", borderRadius:9, cursor:"pointer", transition:"background .12s" }}>
                  <div style={{ width:32, height:32, borderRadius:8, flexShrink:0,
                    background:`${TX_TYPE_COLOR[t.type]}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Activity size={13} color={TX_TYPE_COLOR[t.type]} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                      <span style={{ ...MO, fontSize:9, padding:"1px 6px", borderRadius:4,
                        background:`${TX_TYPE_COLOR[t.type]}18`, color:TX_TYPE_COLOR[t.type] }}>{t.type}</span>
                      <span style={{ ...MO, fontSize:9, color:C.m }}>{t.ago} ago</span>
                    </div>
                    <div style={{ ...MO, fontSize:10, color:C.m3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.val}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ ...MO, fontSize:10, color:C.m2 }}>fee</div>
                    <div style={{ ...MO, fontSize:10, color:C.red }}>{t.fee}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick swap widget */}
          <Card delay={220}>
            <CH title="Quick Swap" />
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[{label:"You Pay",val:"1.0",sym:"ETH",color:C.blue},{label:"You Get",val:"1,840",sym:"USDC",color:C.green}].map((r,i)=>(
                <div key={i} style={{ background:C.s2, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ ...MO, fontSize:9, color:C.m, marginBottom:6 }}>{r.label}</div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ ...SY, fontSize:22, fontWeight:800 }}>{r.val}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, background:C.surf,
                      border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 10px" }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", background:`${r.color}25`,
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>
                        {r.sym==="ETH"?"Ξ":"$"}
                      </div>
                      <span style={{ ...SY, fontWeight:700, fontSize:12 }}>{r.sym}</span>
                      <ChevronDown size={10} color={C.m} />
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ ...MO, fontSize:9, color:C.m, textAlign:"center" }}>
                1 ETH = 1,840 USDC · fee ≈ $0.98
              </div>
              <Button style={{ ...SY, fontSize:12, background:C.text, color:C.bg, height:38 }}>
                Swap Now
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS PAGE
// ═══════════════════════════════════════════════════════════════════════════
const HEATMAP = [
  { col:"CryptoPunks", d:["92","88","76","81","95","70","84"] },
  { col:"Bored Apes",  d:["65","72","80","68","74","90","85"] },
  { col:"Azuki",       d:["45","50","38","60","55","48","52"] },
  { col:"Doodles",     d:["30","28","35","40","22","38","31"] },
  { col:"CloneX",      d:["58","62","70","55","66","72","60"] },
];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function heatColor(v) {
  const n=parseInt(v)/100;
  return `rgba(59,130,246,${0.08+n*0.7})`;
}

function AnalyticsPage({ isMobile=false, isTablet=false }) {
  const [tf,setTf]=useState("12M");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:12 }}>
        <StatCard label="TOTAL VOLUME"   value="$2.4B"   sub="+24% YTD"          icon={TrendingUp}  color={C.green}  delay={0}  />
        <StatCard label="TOTAL SALES"    value="8,940"   sub="+12% this month"    icon={Award}       color={C.blue}   delay={40} />
        <StatCard label="ACTIVE WALLETS" value="142k"    sub="+5.4% (30d)"        icon={Wallet}      color={C.amber}  delay={80} />
        <StatCard label="AVG SALE PRICE" value="2.8 ETH" sub="-0.3 ETH WoW"       icon={DollarSign}  color={C.purple} delay={120}/>
      </div>

      {/* Two-column layout */}
      <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 300px", gap:14, alignItems:"start" }}>

        {/* Left column */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Volume bar chart */}
          <Card delay={160}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:8 }}>
              <STitle>Volume Over Time</STitle>
              <TF options={["3M","6M","12M"]} active={tf} set={setTf} />
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={VOL_DATA} margin={{ top:5, right:4, left:-20, bottom:0 }}>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" tick={{ fill:C.m, fontSize:10, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:C.m, fontSize:10, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                <ReTip content={<ChartTooltip/>} cursor={{ fill:"rgba(255,255,255,.04)" }} />
                <Bar dataKey="vol"   name="Volume (ETH)" fill={C.blue}   radius={[4,4,0,0]} />
                <Bar dataKey="sales" name="Sales"        fill={C.purple} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", gap:14, marginTop:10 }}>
              {[{c:C.blue,l:"Volume (ETH)"},{c:C.purple,l:"Sales"}].map(({c,l})=>(
                <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:c }} />
                  <span style={{ ...MO, fontSize:9, color:C.m }}>{l}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Sales trend + Fees */}
          <Card delay={200}>
            <CH title="Sales & Fees Trend" right={<TF options={["3M","6M","12M"]} active={tf} set={setTf} />} />
            <ResponsiveContainer width="100%" height={170}>
              <LineChart data={VOL_DATA} margin={{ top:5, right:4, left:-20, bottom:0 }}>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" tick={{ fill:C.m, fontSize:10, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:C.m, fontSize:10, fontFamily:"DM Mono" }} axisLine={false} tickLine={false} />
                <ReTip content={<ChartTooltip/>} cursor={{ stroke:"rgba(255,255,255,.07)" }} />
                <Line type="monotone" dataKey="sales" name="Sales" stroke={C.green} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="fees"  name="Fees"  stroke={C.red}   strokeWidth={2} dot={false} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", gap:14, marginTop:8 }}>
              {[{c:C.green,l:"Sales"},{c:C.red,l:"Fees (dashed)"}].map(({c,l})=>(
                <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:8, height:2, background:c }} />
                  <span style={{ ...MO, fontSize:9, color:C.m }}>{l}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity heatmap */}
          <Card delay={220}>
            <CH title="Sales Heatmap" right={<span style={{ ...MO, fontSize:9, color:C.m }}>Last 7 days</span>} />
            <div style={{ overflowX:"auto" }}>
              <div style={{ minWidth:400 }}>
                <div style={{ display:"grid", gridTemplateColumns:"100px repeat(7,1fr)", gap:3, marginBottom:4 }}>
                  <div/>
                  {DAYS.map(d=><div key={d} style={{ ...MO, fontSize:9, color:C.m, textAlign:"center" }}>{d}</div>)}
                </div>
                {HEATMAP.map((row,ri)=>(
                  <div key={ri} style={{ display:"grid", gridTemplateColumns:"100px repeat(7,1fr)", gap:3, marginBottom:3 }}>
                    <div style={{ ...MO, fontSize:10, color:C.m2, display:"flex", alignItems:"center", paddingRight:8,
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{row.col}</div>
                    {row.d.map((v,ci)=>(
                      <TooltipProvider key={ci} delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div style={{ height:32, borderRadius:5, background:heatColor(v), cursor:"pointer",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              border:`1px solid ${C.border}` }}>
                              <span style={{ ...MO, fontSize:9, color:C.m2 }}>{v}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent style={{ background:C.s2, border:`1px solid ${C.b2}`, color:C.text, ...SY, fontSize:11 }}>
                            {row.col} · {DAYS[ci]}: {v} sales
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Top traders */}
          <Card delay={240}>
            <CH title="Top Traders" right={<TF active="7D" set={()=>{}} />} />
            <div className="table-wrap"><table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Wallet","Volume","Trades","P&L",""].map(h=>(
                <th key={h} style={{ ...SY, color:C.m, fontWeight:600, letterSpacing:.8, fontSize:10,
                  textAlign:"left", padding:"6px 10px", borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}</tr></thead>
              <tbody>{TOP_TRADERS.map((t,i)=>(
                <tr key={i} className="rh" style={{ cursor:"pointer", transition:"background .12s" }}>
                  <td style={{ padding:"10px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:24, height:24, borderRadius:"50%", background:`hsl(${i*60},55%,40%)` }} />
                      <span style={{ ...MO, fontSize:11 }}>{t.addr}</span>
                      {i===0 && <Award size={12} color={C.amber} />}
                    </div>
                  </td>
                  <td style={{ ...MO, padding:"10px", fontSize:11 }}>{t.vol}</td>
                  <td style={{ ...MO, padding:"10px", fontSize:11, color:C.m2 }}>{t.trades}</td>
                  <td style={{ ...MO, padding:"10px", fontSize:11, color:t.up?C.green:C.red, fontWeight:600 }}>{t.pnl}</td>
                  <td style={{ padding:"10px" }}>
                    <Button variant="outline" size="sm" style={{ fontSize:10, height:24, ...SY, borderColor:C.b2, color:C.m2, background:"transparent" }}>Profile</Button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Chain breakdown */}
          <Card delay={180}>
            <CH title="Chain Breakdown" />
            <ResponsiveContainer width="100%" height={155}>
              <RePie>
                <Pie data={CHAIN_PIE} cx="50%" cy="50%" innerRadius={38} outerRadius={62}
                  dataKey="value" paddingAngle={4}>
                  {CHAIN_PIE.map((e,i)=><Cell key={i} fill={e.color} />)}
                </Pie>
                <ReTip content={<ChartTooltip/>} />
              </RePie>
            </ResponsiveContainer>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {CHAIN_PIE.map(p=>(
                <div key={p.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <div style={{ width:8, height:8, borderRadius:2, background:p.color }} />
                    <span style={{ ...MO, fontSize:11 }}>{p.name}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:55, height:4, borderRadius:2, background:C.s2, overflow:"hidden" }}>
                      <div style={{ width:`${p.value}%`, height:"100%", background:p.color }} />
                    </div>
                    <span style={{ ...MO, fontSize:10, color:C.m2, width:26, textAlign:"right" }}>{p.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Monthly highlights */}
          <Card delay={200}>
            <CH title="Monthly Highlights" />
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                { label:"Highest Single Sale",  val:"CryptoPunk #5822",  sub:"8,000 ETH",  icon:Award,      color:C.amber  },
                { label:"Most Active Buyer",     val:"0xDead...Beef",     sub:"240 trades", icon:TrendingUp, color:C.blue   },
                { label:"Top Collection Vol",    val:"CryptoPunks",       sub:"10,058 ETH", icon:Flame,      color:C.red    },
                { label:"New Wallets This Month",val:"14,210",            sub:"+22.4%",     icon:Wallet,     color:C.green  },
                { label:"Avg Gas Spent/Trade",   val:"$1.84",             sub:"-12% MoM",   icon:Zap,        color:C.purple },
              ].map(({label,val,sub,icon:Icon,color})=>(
                <div key={label} style={{ display:"flex", alignItems:"center", gap:10,
                  background:C.s2, border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 12px" }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:`${color}18`,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon size={13} color={color} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ ...MO, fontSize:9, color:C.m }}>{label}</div>
                    <div style={{ ...SY, fontWeight:700, fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{val}</div>
                  </div>
                  <span style={{ ...MO, fontSize:10, color, flexShrink:0 }}>{sub}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Marketplace share */}
          <Card delay={220}>
            <CH title="Marketplace Share" />
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                { name:"OpenSea",   pct:48, color:C.blue   },
                { name:"Blur",      pct:31, color:C.purple },
                { name:"LooksRare", pct:12, color:C.green  },
                { name:"X2Y2",      pct:6,  color:C.amber  },
                { name:"Other",     pct:3,  color:C.m2     },
              ].map(m=>(
                <div key={m.name}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ ...MO, fontSize:10, color:C.m2 }}>{m.name}</span>
                    <span style={{ ...MO, fontSize:10, color:m.color }}>{m.pct}%</span>
                  </div>
                  <div style={{ height:5, borderRadius:3, background:C.s2, overflow:"hidden" }}>
                    <div style={{ width:`${m.pct}%`, height:"100%", background:m.color, borderRadius:3 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CALENDAR PAGE
// ═══════════════════════════════════════════════════════════════════════════
const EVT_COLOR = { mint:C.green, auction:C.amber, drop:C.blue, event:C.purple };

const EVT_STATS = [
  { label:"Events This Month", value:"12",   icon:Calendar,   color:C.blue   },
  { label:"Mints",             value:"5",    icon:Zap,        color:C.green  },
  { label:"Auctions",          value:"2",    icon:Award,      color:C.amber  },
  { label:"Total Supply",      value:"115k", icon:Globe,      color:C.purple },
];

function CalendarPage({ isMobile=false, isTablet=false }) {
  const [sel, setSel] = useState(null);
  const [view, setView] = useState("month"); // "month" | "list"
  const daysInMonth = 31;
  const firstDay = 3;
  const cells = Array.from({length:firstDay+daysInMonth},(_,i)=>i<firstDay?null:i-firstDay+1);
  while(cells.length%7!==0) cells.push(null);

  const evtMap = useMemo(()=>{
    const m={};
    EVENTS.forEach(e=>{ if(!m[e.day]) m[e.day]=[]; m[e.day].push(e); });
    return m;
  },[]);

  const selEvents = sel ? (evtMap[sel]||[]) : [];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:12 }}>
        {EVT_STATS.map((s,i)=>(
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} delay={i*40} />
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 310px", gap:14, alignItems:"start" }}>

        {/* Left: calendar + event list */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Calendar card */}
          <Card delay={0}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <button style={{ ...pgBtn }}><ChevronLeft size={11}/></button>
                <span style={{ ...SY, fontWeight:700, fontSize:14 }}>March 2023</span>
                <button style={{ ...pgBtn }}><ChevronRight size={11}/></button>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ display:"flex", gap:5 }}>
                  {Object.entries(EVT_COLOR).map(([k,v])=>(
                    <div key={k} style={{ display:"flex", alignItems:"center", gap:3 }}>
                      <div style={{ width:7, height:7, borderRadius:2, background:v }} />
                      <span style={{ ...MO, fontSize:9, color:C.m, textTransform:"capitalize" }}>{k}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:3 }}>
                  {[{v:"month",l:"Month"},{v:"list",l:"List"}].map(({v,l})=>(
                    <button key={v} onClick={()=>setView(v)} style={{
                      ...MO, padding:"3px 8px", borderRadius:6, fontSize:10, cursor:"pointer",
                      border:`1px solid ${view===v?C.b2:C.border}`,
                      background:view===v?C.s2:"transparent", color:view===v?C.text:C.m
                    }}>{l}</button>
                  ))}
                </div>
              </div>
            </div>

            {view==="month" ? (<>
              {/* Day headers */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:3 }}>
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
                  <div key={d} style={{ ...MO, fontSize:9, color:C.m, textAlign:"center", padding:"4px 0" }}>{d}</div>
                ))}
              </div>
              {/* Day cells */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
                {cells.map((day,i)=>{
                  const evts = day ? (evtMap[day]||[]) : [];
                  const isToday = day===15;
                  const isSel = day===sel;
                  return (
                    <div key={i} onClick={()=>day&&setSel(isSel?null:day)} style={{
                      minHeight:68, borderRadius:9, padding:"6px 7px", cursor:day?"pointer":"default",
                      border:`1px solid ${isSel?C.b3:isToday?C.blue+"44":C.border}`,
                      background:isSel?C.s2:isToday?C.blue+"08":"transparent",
                      transition:"all .12s", opacity:day?1:.15
                    }}>
                      {day && <>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ ...MO, fontSize:10, color:isSel?C.text:isToday?C.blue:C.m2,
                            fontWeight:isToday||isSel?700:400 }}>{day}</span>
                          {isToday && <span style={{ ...MO, fontSize:7, color:C.blue, background:`${C.blue}18`,
                            padding:"1px 4px", borderRadius:3 }}>TODAY</span>}
                        </div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:2 }}>
                          {evts.map((e,j)=>(
                            <div key={j} title={e.name} style={{ width:5, height:5, borderRadius:1, background:EVT_COLOR[e.type] }} />
                          ))}
                        </div>
                        {evts.length>0 && (
                          <div style={{ marginTop:3, overflow:"hidden" }}>
                            <div style={{ ...MO, fontSize:8, color:C.m2,
                              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {evts[0].name.split(" ").slice(0,2).join(" ")}
                            </div>
                          </div>
                        )}
                      </>}
                    </div>
                  );
                })}
              </div>
            </>) : (
              /* List view */
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {EVENTS.map((e,i)=>(
                  <div key={i} onClick={()=>setSel(e.day)} className="rh" style={{
                    display:"flex", alignItems:"center", gap:12, padding:"10px 10px",
                    borderRadius:10, cursor:"pointer", transition:"background .12s",
                    borderLeft:`3px solid ${EVT_COLOR[e.type]}`,
                    background:sel===e.day?C.s2:"transparent"
                  }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:`${EVT_COLOR[e.type]}14`,
                      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ ...SY, fontSize:13, fontWeight:800, color:EVT_COLOR[e.type] }}>{e.day}</span>
                      <span style={{ ...MO, fontSize:7, color:C.m }}>MAR</span>
                    </div>
                    <span style={{ fontSize:20 }}>{e.img}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ ...SY, fontWeight:700, fontSize:12 }}>{e.name}</div>
                      <div style={{ ...MO, fontSize:9, color:C.m }}>{e.time} · {e.price}</div>
                    </div>
                    <span style={{ ...MO, fontSize:9, padding:"2px 7px", borderRadius:4,
                      background:`${EVT_COLOR[e.type]}18`, color:EVT_COLOR[e.type], textTransform:"capitalize", flexShrink:0 }}>
                      {e.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Bottom stats */}
          <Card delay={100}>
            <CH title="Event Breakdown" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
              {Object.entries(EVT_COLOR).map(([type,color])=>{
                const count = EVENTS.filter(e=>e.type===type).length;
                return (
                  <div key={type} style={{ background:C.s2, border:`1px solid ${C.border}`,
                    borderRadius:10, padding:"12px 14px", borderTop:`3px solid ${color}` }}>
                    <div style={{ ...MO, fontSize:9, color:C.m, textTransform:"capitalize", marginBottom:4 }}>{type}s</div>
                    <div style={{ ...SY, fontWeight:800, fontSize:22 }}>{count}</div>
                    <div style={{ ...MO, fontSize:9, color:C.m2, marginTop:2 }}>this month</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Selected day detail */}
          {sel && selEvents.length>0 && (
            <Card delay={0}>
              <CH title={`March ${sel}`} right={
                <button onClick={()=>setSel(null)} style={{ background:"transparent", border:"none", cursor:"pointer", color:C.m }}>
                  <X size={13}/>
                </button>
              }/>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {selEvents.map((e,i)=>(
                  <div key={i} style={{ background:C.s2, borderRadius:10, padding:"12px 14px",
                    borderLeft:`3px solid ${EVT_COLOR[e.type]}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:22 }}>{e.img}</span>
                      <div>
                        <div style={{ ...SY, fontWeight:700, fontSize:13 }}>{e.name}</div>
                        <div style={{ ...MO, fontSize:9, color:C.m }}>{e.time}</div>
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10 }}>
                      {[["Price",e.price],["Supply",e.supply],["Type",e.type],["Date",`Mar ${e.day}`]].map(([k,v])=>(
                        <div key={k} style={{ background:C.surf, borderRadius:7, padding:"6px 9px" }}>
                          <div style={{ ...MO, fontSize:8, color:C.m, marginBottom:2 }}>{k}</div>
                          <div style={{ ...SY, fontSize:11, fontWeight:700, textTransform:"capitalize" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <Button variant="outline" size="sm" style={{ flex:1, fontSize:10, height:26, ...SY, borderColor:C.b2, color:C.m2, background:"transparent" }}>
                        Remind Me
                      </Button>
                      <Button size="sm" style={{ flex:1, fontSize:10, height:26, ...SY,
                        background:`${EVT_COLOR[e.type]}22`, color:EVT_COLOR[e.type],
                        border:`1px solid ${EVT_COLOR[e.type]}44` }}>
                        {e.type==="mint"?"Mint Now":e.type==="auction"?"Bid Now":e.type==="drop"?"Get Drop":"View"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* All upcoming events */}
          <Card delay={40}>
            <CH title="All Upcoming" right={<span style={{ ...MO, fontSize:9, color:C.m }}>{EVENTS.length} events</span>} />
            <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
              {EVENTS.map((e,i)=>(
                <div key={i} className="rh" onClick={()=>setSel(sel===e.day?null:e.day)} style={{
                  display:"flex", alignItems:"center", gap:10, padding:"9px 6px",
                  borderRadius:8, cursor:"pointer", transition:"background .12s",
                  borderLeft:`2px solid ${sel===e.day?EVT_COLOR[e.type]:C.border}`,
                  background:sel===e.day?C.s2:"transparent"
                }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:`${EVT_COLOR[e.type]}14`,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:14 }}>{e.img}</span>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ ...SY, fontWeight:700, fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.name}</div>
                    <div style={{ ...MO, fontSize:9, color:C.m }}>Mar {e.day} · {e.time}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ ...MO, fontSize:10, color:C.m2 }}>{e.price}</div>
                    <span style={{ ...MO, fontSize:8, padding:"1px 5px", borderRadius:3,
                      background:`${EVT_COLOR[e.type]}18`, color:EVT_COLOR[e.type], textTransform:"capitalize" }}>{e.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Watchlist quick-add */}
          <Card delay={80}>
            <CH title="My Watchlist" right={<span style={{ ...MO, fontSize:9, color:C.green }}>3 watching</span>} />
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {EVENTS.filter(e=>e.type==="mint").map((e,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:9, background:C.s2,
                  border:`1px solid ${C.border}`, borderRadius:9, padding:"9px 11px" }}>
                  <span style={{ fontSize:18 }}>{e.img}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ ...SY, fontWeight:700, fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.name}</div>
                    <div style={{ ...MO, fontSize:9, color:C.m }}>Mar {e.day} · {e.price}</div>
                  </div>
                  <div style={{ width:20, height:20, borderRadius:5, background:`${C.green}18`,
                    display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    <Check size={10} color={C.green}/>
                  </div>
                </div>
              ))}
              <button style={{ ...MO, fontSize:10, color:C.m, background:"transparent", border:`1px dashed ${C.border}`,
                borderRadius:8, padding:"8px", cursor:"pointer", width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                <Plus size={12}/> Add to watchlist
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════════════════════
const ACHIEVEMENTS = [
  { icon:"🏆", label:"Diamond Hands",   sub:"Held 1yr+",     earned:true  },
  { icon:"🐋", label:"Whale",           sub:">100 ETH vol",  earned:true  },
  { icon:"🔥", label:"7-Day Streak",    sub:"Daily logins",  earned:true  },
  { icon:"👁",  label:"Early Adopter",   sub:"Beta user",     earned:false },
  { icon:"⚡", label:"Speed Minter",    sub:"< 1min mint",   earned:false },
  { icon:"🌟", label:"Curator",         sub:"5 saves",       earned:false },
];

const FOLLOWING = [
  { name:"0xBeef...1234", img:"🦊", vol:"420 ETH",  followers:"1.2k" },
  { name:"0xFace...abcd", img:"🐺", vol:"310 ETH",  followers:"890"  },
  { name:"0xDead...cafe", img:"🐉", vol:"180 ETH",  followers:"540"  },
  { name:"0xBabe...5678", img:"🦁", vol:"95 ETH",   followers:"280"  },
];

function ProfilePage({ isMobile=false, isTablet=false }) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("nfts"); // nfts | activity | offers
  const addr = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  const short = `${addr.slice(0,6)}...${addr.slice(-4)}`;
  const copy = () => { setCopied(true); setTimeout(()=>setCopied(false),1500); };

  const tabContent = {
    nfts: (
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(3,1fr)", gap:10 }}>
        {MY_NFTS.map((n,i)=>(
          <div key={i} className="nft-card" style={{ background:C.s2, border:`1px solid ${C.border}`,
            borderRadius:12, overflow:"hidden", cursor:"pointer" }}>
            <div style={{ height:95, background:n.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:46 }}>{n.img}</div>
            <div style={{ padding:"8px 10px" }}>
              <div style={{ ...MO, color:C.m, fontSize:8, marginBottom:2 }}>{n.col}</div>
              <div style={{ ...SY, fontWeight:700, fontSize:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{n.name}</div>
              <div style={{ ...MO, color:C.green, fontSize:10, fontWeight:600, marginTop:2 }}>{n.val}</div>
            </div>
          </div>
        ))}
      </div>
    ),
    activity: (
      <div className="table-wrap"><table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead><tr>{["Type","Item","Price","Date","Status"].map(h=>(
          <th key={h} style={{ ...SY, color:C.m, fontWeight:600, letterSpacing:.8, fontSize:10,
            textAlign:"left", padding:"5px 10px", borderBottom:`1px solid ${C.border}` }}>{h}</th>
        ))}</tr></thead>
        <tbody>{TX_HISTORY.map((t,i)=>(
          <tr key={i} className="rh" style={{ cursor:"pointer", transition:"background .12s" }}>
            <td style={{ padding:"10px" }}>
              <span style={{ ...MO, fontSize:10, padding:"3px 8px", borderRadius:5,
                background:t.type==="Buy"?"rgba(34,197,94,.12)":"rgba(239,68,68,.12)",
                color:t.type==="Buy"?C.green:C.red }}>{t.type}</span>
            </td>
            <td style={{ padding:"10px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Thumb emoji={t.img} size={24}/>
                <span style={{ ...SY, fontWeight:600, fontSize:11 }}>{t.name}</span>
              </div>
            </td>
            <td style={{ ...MO, padding:"10px", fontSize:11, fontWeight:600 }}>{t.price}</td>
            <td style={{ ...MO, padding:"10px", fontSize:10, color:C.m2 }}>{t.date}</td>
            <td style={{ padding:"10px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <CheckCircle size={11} color={C.green}/>
                <span style={{ ...MO, fontSize:10, color:C.green }}>Confirmed</span>
              </div>
            </td>
          </tr>
        ))}</tbody>
      </table>
      </div>
    ),
    offers: (
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {NFT_OFFERS.map((o,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background:C.s2,
            border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px" }}>
            <Thumb emoji={o.img} size={30}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ ...SY, fontWeight:700, fontSize:12 }}>{o.name}</div>
              <div style={{ ...MO, fontSize:9, color:C.m }}>from {o.from} · exp {o.exp}</div>
            </div>
            <div style={{ ...MO, fontSize:12, color:C.green, fontWeight:600, marginRight:10 }}>{o.offer}</div>
            <div style={{ display:"flex", gap:6 }}>
              <Button size="sm" style={{ fontSize:10, height:26, ...SY, background:`${C.green}22`, color:C.green, border:`1px solid ${C.green}44` }}>Accept</Button>
              <Button variant="outline" size="sm" style={{ fontSize:10, height:26, ...SY, borderColor:C.b2, color:C.m2, background:"transparent" }}>Decline</Button>
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      {/* Hero banner */}
      <Card delay={0} style={{ padding:0, overflow:"hidden" }}>
        <div style={{ height:130, background:"linear-gradient(135deg,#1a2a4a,#2a1a3a,#1a3a2a)", position:"relative" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 50%,rgba(59,130,246,.2) 0%,transparent 55%),radial-gradient(circle at 80% 30%,rgba(168,85,247,.15) 0%,transparent 55%),radial-gradient(circle at 50% 80%,rgba(34,197,94,.08) 0%,transparent 40%)" }} />
        </div>
        <div style={{ padding:"0 24px 20px" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:-40, marginBottom:14, flexWrap:"wrap", gap:8 }}>
            <div style={{ width:80, height:80, borderRadius:18, background:"#2a2a2a",
              border:`3px solid ${C.surf}`, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:42, flexShrink:0 }}>🐸</div>
            <div style={{ display:"flex", gap:8, paddingBottom:4 }}>
              {[{I:Twitter,c:C.blue},{I:Globe,c:C.cyan},{I:Share2,c:C.m2}].map(({I,c},i)=>(
                <button key={i} style={{ width:32, height:32, borderRadius:8, background:C.s2,
                  border:`1px solid ${C.border}`, display:"flex", alignItems:"center",
                  justifyContent:"center", cursor:"pointer", color:c }}>
                  <I size={14}/>
                </button>
              ))}
              <Button size="sm" style={{ ...SY, fontSize:11, height:32, background:C.text, color:C.bg }}>
                Edit Profile
              </Button>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ ...SY, fontWeight:800, fontSize:22 }}>山么#4444</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
                <span style={{ ...MO, fontSize:11, color:C.m2 }}>{short}</span>
                <button onClick={copy} style={{ background:"transparent", border:"none", cursor:"pointer", color:C.m }}>
                  {copied?<Check size={12} color={C.green}/>:<Copy size={12}/>}
                </button>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:C.green, animation:"blink 2s ease infinite" }}/>
                  <span style={{ ...MO, fontSize:9, color:C.green }}>Connected</span>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {[["9","NFTs"],["5","Collections"],["194 ETH","Portfolio"],["1.2k","Followers"],["84","Following"]].map(([v,l])=>(
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ ...SY, fontWeight:800, fontSize:15 }}>{v}</div>
                  <div style={{ ...MO, fontSize:9, color:C.m }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Main two-column layout */}
      <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 320px", gap:14, alignItems:"start" }}>

        {/* Left column */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Portfolio chart */}
          <Card delay={40}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4, flexWrap:"wrap", gap:8 }}>
              <div>
                <STitle>Portfolio Value</STitle>
                <div style={{ ...SY, fontWeight:800, fontSize:26, marginTop:4 }}>194.1 ETH</div>
                <div style={{ ...MO, fontSize:11, color:C.green }}>▲ +12.4 ETH this month (+6.8%)</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                <TF options={["1M","3M","6M"]} active="6M" set={()=>{}}/>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))", gap:6 }}>
                  {[["Unrealised PnL","+$14.2k",true],["Realised PnL","+$8.1k",true],["Spent","$142k",false]].map(([l,v,up])=>(
                    <div key={l} style={{ background:C.s2, border:`1px solid ${C.border}`, borderRadius:7, padding:"6px 8px", textAlign:"right" }}>
                      <div style={{ ...MO, fontSize:8, color:C.m }}>{l}</div>
                      <div style={{ ...SY, fontSize:12, fontWeight:700, color:up?C.green:C.m2 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={155}>
              <AreaChart data={PORTFOLIO_CHART} margin={{ top:5, right:4, left:-20, bottom:0 }}>
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.green} stopOpacity={.15}/>
                    <stop offset="95%" stopColor={C.green} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="m" tick={{ fill:C.m, fontSize:10, fontFamily:"DM Mono" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:C.m, fontSize:10, fontFamily:"DM Mono" }} axisLine={false} tickLine={false}/>
                <ReTip content={<ChartTooltip/>} cursor={{ stroke:"rgba(255,255,255,.07)" }}/>
                <Area type="monotone" dataKey="v" name="Value (ETH)" stroke={C.green} strokeWidth={2} fill="url(#pg)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Tabbed NFTs / Activity / Offers */}
          <Card delay={60}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ display:"flex", gap:2 }}>
                {[["nfts","My NFTs"],["activity","Activity"],["offers","Offers"]].map(([t,l])=>(
                  <button key={t} onClick={()=>setTab(t)} style={{
                    ...SY, padding:"5px 12px", borderRadius:8, fontSize:11, cursor:"pointer",
                    border:`1px solid ${tab===t?C.b2:C.border}`,
                    background:tab===t?C.s2:"transparent",
                    color:tab===t?C.text:C.m, fontWeight:tab===t?700:400, transition:"all .12s"
                  }}>{l}</button>
                ))}
              </div>
              <VBtn/>
            </div>
            {tabContent[tab]}
          </Card>

          {/* Achievements */}
          <Card delay={80}>
            <CH title="Achievements" right={<span style={{ ...MO, fontSize:9, color:C.m2 }}>3/6 earned</span>}/>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(3,1fr)", gap:10 }}>
              {ACHIEVEMENTS.map((a,i)=>(
                <div key={i} style={{ background:C.s2, border:`1px solid ${a.earned?C.b2:C.border}`,
                  borderRadius:10, padding:"12px 14px", opacity:a.earned?1:.45,
                  display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:22 }}>{a.icon}</span>
                  <div>
                    <div style={{ ...SY, fontWeight:700, fontSize:11 }}>{a.label}</div>
                    <div style={{ ...MO, fontSize:9, color:C.m }}>{a.sub}</div>
                  </div>
                  {a.earned && <CheckCircle size={12} color={C.green} style={{ marginLeft:"auto", flexShrink:0 }}/>}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Wallet card */}
          <Card delay={20}>
            <CH title="Wallet"/>
            <div style={{ background:C.s2, borderRadius:10, padding:"14px", marginBottom:12 }}>
              <div style={{ ...MO, fontSize:9, color:C.m, marginBottom:6 }}>CONNECTED WALLET</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:`${C.blue}18`,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Wallet size={15} color={C.blue}/>
                </div>
                <div>
                  <div style={{ ...SY, fontWeight:700, fontSize:12 }}>MetaMask</div>
                  <div style={{ ...MO, fontSize:9, color:C.m }}>{short}</div>
                </div>
                <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:C.green }}/>
                  <span style={{ ...MO, fontSize:9, color:C.green }}>Active</span>
                </div>
              </div>
              <Separator style={{ background:C.border, margin:"10px 0" }}/>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div>
                  <div style={{ ...MO, fontSize:9, color:C.m }}>ETH Balance</div>
                  <div style={{ ...SY, fontWeight:700, fontSize:16 }}>12.84 ETH</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ ...MO, fontSize:9, color:C.m }}>USD Value</div>
                  <div style={{ ...SY, fontWeight:700, fontSize:16 }}>$23,650</div>
                </div>
              </div>
            </div>
            {/* Token list */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:12 }}>
              {[{sym:"ETH",val:"12.84",usd:"$23,650",color:C.blue,icon:"Ξ"},
                {sym:"USDC",val:"4,200",usd:"$4,200",color:C.green,icon:"$"},
                {sym:"WETH",val:"2.1",usd:"$3,867",color:C.purple,icon:"Ξ"}].map(t=>(
                <div key={t.sym} style={{ display:"flex", alignItems:"center", gap:9,
                  padding:"7px 8px", borderRadius:8, background:C.surf, border:`1px solid ${C.border}` }}>
                  <div style={{ width:26, height:26, borderRadius:7, background:`${t.color}18`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:t.color, flexShrink:0 }}>{t.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ ...SY, fontWeight:700, fontSize:11 }}>{t.sym}</div>
                    <div style={{ ...MO, fontSize:9, color:C.m }}>{t.val}</div>
                  </div>
                  <div style={{ ...MO, fontSize:11, color:C.m2 }}>{t.usd}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <Button variant="outline" style={{ fontSize:11, ...SY, borderColor:C.b2, color:C.m2, background:"transparent" }}>Send</Button>
              <Button style={{ fontSize:11, ...SY, background:C.text, color:C.bg }}>Receive</Button>
            </div>
          </Card>

          {/* Following */}
          <Card delay={60}>
            <CH title="Following" right={<span style={{ ...MO, fontSize:9, color:C.m }}>{FOLLOWING.length} collectors</span>}/>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {FOLLOWING.map((f,i)=>(
                <div key={i} className="rh" style={{ display:"flex", alignItems:"center", gap:10,
                  padding:"8px 6px", borderRadius:9, cursor:"pointer", transition:"background .12s" }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:C.s2,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{f.img}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ ...MO, fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                    <div style={{ ...MO, fontSize:9, color:C.m }}>{f.followers} followers</div>
                  </div>
                  <div style={{ ...MO, fontSize:10, color:C.green, flexShrink:0 }}>{f.vol}</div>
                </div>
              ))}
              <button style={{ ...MO, fontSize:10, color:C.m, background:"transparent", border:`1px dashed ${C.border}`,
                borderRadius:8, padding:"7px", cursor:"pointer", width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:5, marginTop:4 }}>
                <Plus size={11}/> Find collectors
              </button>
            </div>
          </Card>

          {/* Settings */}
          <Card delay={80}>
            <CH title="Settings"/>
            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              {[
                {Icon:Bell,     label:"Notifications",  sub:"Manage alerts",    color:C.blue  },
                {Icon:Lock,     label:"Security",        sub:"2FA & privacy",    color:C.amber },
                {Icon:Globe,    label:"Network",         sub:"Ethereum Mainnet", color:C.green },
                {Icon:Settings, label:"Preferences",     sub:"Theme & display",  color:C.purple},
                {Icon:User,     label:"Edit Profile",    sub:"Name, bio, avatar",color:C.cyan  },
              ].map(({Icon,label,sub,color})=>(
                <div key={label} className="rh" style={{ display:"flex", alignItems:"center", gap:10,
                  padding:"9px 8px", borderRadius:9, cursor:"pointer", transition:"background .12s" }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:`${color}14`,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon size={13} color={color}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ ...SY, fontSize:12, fontWeight:600 }}>{label}</div>
                    <div style={{ ...MO, fontSize:9, color:C.m }}>{sub}</div>
                  </div>
                  <ChevronRight size={13} color={C.m}/>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
              <button style={{ display:"flex", alignItems:"center", gap:8, width:"100%", background:"transparent",
                border:"none", cursor:"pointer", padding:"8px", borderRadius:8, color:C.red }}>
                <LogOut size={13}/>
                <span style={{ ...SY, fontSize:12, fontWeight:600 }}>Sign Out</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════
function Sidebar({ active, setActive, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div onClick={()=>setMobileOpen(false)} style={{ position:"fixed", inset:0,
          background:"rgba(0,0,0,.75)", zIndex:40, backdropFilter:"blur(3px)" }} />
      )}
      <aside style={{
        position:"fixed", top:0, left:0, bottom:0, zIndex:50,
        width:collapsed?64:220, background:C.surf, borderRight:`1px solid ${C.border}`,
        display:"flex", flexDirection:"column", padding:"18px 10px",
        transition:"width .2s ease", overflow:"hidden",
      }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:collapsed?"center":"space-between", marginBottom:22, paddingLeft:collapsed?0:4 }}>
          {!collapsed && (
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <rect width="30" height="30" rx="8" fill="#1c1c1c"/>
                <path d="M15 6C10 6 6 10 6 15C6 20 10 24 15 24C20 24 24 20 24 15" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M15 6C20 6 24 10 24 15" stroke="#444" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="15" cy="15" r="2.8" fill="white"/>
              </svg>
              <span style={{ ...SY, fontWeight:800, fontSize:16, letterSpacing:.4, whiteSpace:"nowrap" }}>NFTvault</span>
            </div>
          )}
          <button onClick={()=>setCollapsed(c=>!c)} style={{ background:"transparent",
            border:`1px solid ${C.border}`, borderRadius:8, width:28, height:28, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", color:C.m, flexShrink:0 }}>
            {collapsed?<ChevronRight size={13}/>:<Menu size={13}/>}
          </button>
        </div>

        {!collapsed ? (
          <div style={{ display:"flex", alignItems:"center", gap:7, background:C.s2,
            border:`1px solid ${C.border}`, borderRadius:9, padding:"7px 10px", marginBottom:18 }}>
            <Search size={12} color={C.m} />
            <input placeholder="Search…" style={{ ...MO, background:"transparent", border:"none",
              outline:"none", color:C.text, fontSize:12, flex:1 }} />
          </div>
        ):<div style={{ height:16 }} />}

        <nav style={{ display:"flex", flexDirection:"column", gap:2, flex:1 }}>
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const on = active===id;
            return (
              <TooltipProvider key={id} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="nb" onClick={()=>{ setActive(id); setMobileOpen(false); }} style={{
                      display:"flex", alignItems:"center", gap:10,
                      padding:collapsed?"10px":"10px 12px", justifyContent:collapsed?"center":"flex-start",
                      borderRadius:10, cursor:"pointer", border:"none", width:"100%",
                      background:on?C.s2:"transparent",
                      borderLeft:on&&!collapsed?`2px solid ${C.text}`:"2px solid transparent",
                      color:on?C.text:C.m, transition:"all .12s",
                    }}>
                      <Icon size={17} strokeWidth={on?2.2:1.7} />
                      {!collapsed&&<span style={{ ...SY, fontSize:14, fontWeight:on?700:400, whiteSpace:"nowrap" }}>{label}</span>}
                    </button>
                  </TooltipTrigger>
                  {collapsed&&<TooltipContent side="right" style={{ background:C.s2, border:`1px solid ${C.b2}`, color:C.text, ...SY, fontSize:12, borderRadius:8 }}>{label}</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>

        <Separator style={{ background:C.border, margin:"10px 0" }} />

        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {[{Icon:Bell,label:"Notifications"},{Icon:Settings,label:"Settings"},{Icon:LogOut,label:"Sign Out"}].map(({Icon,label})=>(
            <TooltipProvider key={label} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ib" style={{ display:"flex", alignItems:"center", gap:10,
                    padding:collapsed?"10px":"10px 12px", justifyContent:collapsed?"center":"flex-start",
                    borderRadius:10, cursor:"pointer", border:"none", background:"transparent",
                    color:C.m, width:"100%", transition:"color .12s" }}>
                    <Icon size={16} strokeWidth={1.7} />
                    {!collapsed&&<span style={{ ...SY, fontSize:13, whiteSpace:"nowrap" }}>{label}</span>}
                  </button>
                </TooltipTrigger>
                {collapsed&&<TooltipContent side="right" style={{ background:C.s2, border:`1px solid ${C.b2}`, color:C.text, ...SY, fontSize:12, borderRadius:8 }}>{label}</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        <div style={{ marginTop:12 }}>
          {!collapsed ? (
            <div style={{ background:C.s2, borderRadius:10, padding:"10px 11px",
              display:"flex", alignItems:"center", gap:9, border:`1px solid ${C.border}` }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"#2a2a2a",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>🐸</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ ...MO, color:C.m, fontSize:9 }}>Welcome back</div>
                <div style={{ ...SY, fontSize:12, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>山么#4444</div>
              </div>
              <Wallet size={12} color={C.m} />
            </div>
          ) : (
            <div style={{ display:"flex", justifyContent:"center" }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"#2a2a2a",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🐸</div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE TOPBAR
// ═══════════════════════════════════════════════════════════════════════════
function Topbar({ active, mobileOpen, setMobileOpen }) {
  const nav=NAV_ITEMS.find(n=>n.id===active);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"13px 16px", borderBottom:`1px solid ${C.border}`, background:C.surf, flexShrink:0 }}>
      <button onClick={()=>setMobileOpen(o=>!o)} style={{ background:"transparent", border:"none", cursor:"pointer", color:C.text, padding:"6px", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {mobileOpen ? <X size={20} color={C.text}/> : <Menu size={20} color={C.text}/>}
      </button>
      <span style={{ ...SY, fontWeight:700, fontSize:15 }}>{nav?.label}</span>
      <Bell size={17} color={C.m} style={{ cursor:"pointer" }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FEED PAGE
// ═══════════════════════════════════════════════════════════════════════════
function FeedPage({ isMobile=false, isTablet=false }) {
  if (isMobile) return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <TopCollections /><TopSales /><TrendingPanel /><NewsPanel /><UpcomingProjects />
      <WalletTable data={BUYERS}  label="Top Buyers"  isBuy />
      <WalletTable data={SELLERS} label="Top Sellers" isBuy={false} />
      <MarketOverview />
    </div>
  );

  if (isTablet) return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
      <TopCollections delay={0} />
      <TopSales delay={50} />
      <TrendingPanel delay={90} />
      <NewsPanel delay={30} />
      <UpcomingProjects delay={80} />
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <WalletTable data={BUYERS}  label="Top Buyers"  isBuy      delay={100} />
        <WalletTable data={SELLERS} label="Top Sellers" isBuy={false} delay={110} />
      </div>
      <div style={{ gridColumn:"1/3" }}>
        <MarketOverview delay={140} />
      </div>
    </div>
  );

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 258px", gap:14, alignItems:"stretch" }}>

      {/* ── Col 1: TopCollections + UpcomingProjects ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:14, gridColumn:"1/2", gridRow:"1/3" }}>
        <TopCollections delay={0} />
        <UpcomingProjects delay={80} />
      </div>

      {/* ── Col 2: TopSales + Trending + Buyers+Sellers ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:14, gridColumn:"2/3", gridRow:"1/3" }}>
        <TopSales delay={50} />
        <TrendingPanel delay={90} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, flex:1 }}>
          <WalletTable data={BUYERS}  label="Top Buyers"  isBuy      delay={100} />
          <WalletTable data={SELLERS} label="Top Sellers" isBuy={false} delay={110} />
        </div>
      </div>

      {/* ── Col 3: News spans rows 1-2 ── */}
      <div style={{ gridColumn:"3/4", gridRow:"1/3", display:"flex" }}>
        <NewsPanel delay={30} />
      </div>

      {/* ── Row 3: Market Overview spans cols 1-3 ── */}
      <div style={{ gridColumn:"1/4" }}>
        <MarketOverview delay={140} />
      </div>

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSIVE HOOK
// ═══════════════════════════════════════════════════════════════════════════
function useIsMobile() {
  const [m,setM]=useState(typeof window!=="undefined"&&window.innerWidth<768);
  const [t,setT]=useState(typeof window!=="undefined"&&window.innerWidth<1024);
  useEffect(()=>{
    const h=()=>{ setM(window.innerWidth<768); setT(window.innerWidth<1024); };
    window.addEventListener("resize",h);
    return ()=>window.removeEventListener("resize",h);
  },[]);
  return { isMobile:m, isTablet:t };
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [active,setActive]=useState("feed");
  const [collapsed,setCollapsed]=useState(false);
  const [mobileOpen,setMobileOpen]=useState(false);
  const {isMobile,isTablet}=useIsMobile();
  const sideW=isMobile?0:collapsed?64:220;

  const pages = {
    feed:      <FeedPage isMobile={isMobile} isTablet={isTablet} />,
    nfts:      <NFTsPage isMobile={isMobile} isTablet={isTablet} />,
    crypto:    <CryptoPage isMobile={isMobile} isTablet={isTablet} />,
    analytics: <AnalyticsPage isMobile={isMobile} isTablet={isTablet} />,
    calendar:  <CalendarPage isMobile={isMobile} isTablet={isTablet} />,
    profile:   <ProfilePage isMobile={isMobile} isTablet={isTablet} />,
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display:"flex", height:"100vh", width:"100vw", background:C.bg,
        color:C.text, overflow:"hidden", fontFamily:"'Syne',sans-serif" }}>

        {(!isMobile||mobileOpen) && (
          <Sidebar active={active} setActive={setActive}
            collapsed={isMobile?false:collapsed} setCollapsed={setCollapsed}
            mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        )}

        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden",
          marginLeft:isMobile?0:sideW, transition:"margin-left .2s ease" }}>
          {isMobile&&<Topbar active={active} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />}
          <main style={{ flex:1, overflowY:"auto", padding:isMobile?"12px":"18px" }}>
            {pages[active]}
          </main>
        </div>
      </div>
    </>
  );
}