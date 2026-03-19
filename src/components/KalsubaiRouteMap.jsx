function KalsubaiRouteMap() {
  const stars = [
    [30,18,1.8],[78,10,1.2],[128,24,2.2],[175,8,1.0],[222,20,1.6],[268,14,1.0],
    [315,28,1.4],[362,10,1.8],[408,22,1.2],[455,8,2.0],[502,18,1.4],[548,28,1.0],
    [595,12,1.6],[642,24,1.2],[688,10,1.8],[735,20,1.4],[782,8,1.0],[828,22,1.6],
    [875,14,2.0],[45,52,1.2],[92,62,1.6],[140,44,1.0],[188,58,1.8],[236,48,1.4],
    [284,65,1.0],[332,50,1.6],[380,60,1.2],[428,44,2.0],[476,56,1.4],[524,48,1.0],
    [572,62,1.6],[620,48,1.2],[668,60,1.8],[716,44,1.0],[764,58,1.6],[812,48,1.2],
    [860,64,1.8],[20,95,1.0],[68,108,1.4],[116,92,1.8],[164,110,1.2],[212,96,1.6],
    [260,112,1.0],[308,98,1.8],[356,108,1.4],[404,94,1.2],[452,110,1.6],[500,96,1.0],
    [548,108,1.8],[596,92,1.4],[644,110,1.2],[692,96,1.8],[740,108,1.0],[788,94,1.6],
    [836,110,1.2],[884,96,1.8],[35,145,1.4],[84,132,1.0],[133,148,1.8],[182,136,1.2],
    [231,150,1.6],[280,134,1.0],[329,148,1.4],[378,138,1.8],[720,138,1.2],[768,150,1.6],
    [816,136,1.0],[864,150,1.4],[885,138,1.8],
  ];

  return (
    <div className="trek-route-map-container" role="img" aria-label="Kalsubai Trek Route Map">
      <svg
        viewBox="0 0 900 500"
        xmlns="http://www.w3.org/2000/svg"
        className="trek-route-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Sky gradient */}
          <linearGradient id="kSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020d1a" />
            <stop offset="45%" stopColor="#061e3a" />
            <stop offset="78%" stopColor="#0a3020" />
            <stop offset="100%" stopColor="#071a0e" />
          </linearGradient>
          {/* Mountain far */}
          <linearGradient id="kMtnFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d3322" />
            <stop offset="100%" stopColor="#071608" />
          </linearGradient>
          {/* Mountain main */}
          <linearGradient id="kMtnMain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#163d24" />
            <stop offset="100%" stopColor="#071408" />
          </linearGradient>
          {/* Foreground */}
          <linearGradient id="kFg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a2010" />
            <stop offset="100%" stopColor="#040c06" />
          </linearGradient>
          {/* Path gradient */}
          <linearGradient id="kPath" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="50%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#86efac" />
          </linearGradient>
          {/* Path glow */}
          <filter id="kGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Soft star glow */}
          <filter id="kStarGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Summit glow */}
          <filter id="kSummitGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Milky way */}
          <linearGradient id="kMilky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(200,220,255,0)" />
            <stop offset="30%" stopColor="rgba(200,220,255,0.04)" />
            <stop offset="50%" stopColor="rgba(200,220,255,0.09)" />
            <stop offset="70%" stopColor="rgba(200,220,255,0.04)" />
            <stop offset="100%" stopColor="rgba(200,220,255,0)" />
          </linearGradient>
          <filter id="kMilkyBlur">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        {/* Sky */}
        <rect width="900" height="500" fill="url(#kSky)" rx="20" />

        {/* Milky Way band */}
        <rect x="-100" y="30" width="1100" height="180" rx="90"
          fill="url(#kMilky)" filter="url(#kMilkyBlur)"
          transform="rotate(-18 450 120)" opacity="0.8" />

        {/* Stars */}
        {stars.map(([cx, cy, r], i) => (
          <circle
            key={i} cx={cx} cy={cy} r={r}
            fill="white"
            opacity={0.4 + (i % 5) * 0.12}
            filter="url(#kStarGlow)"
          />
        ))}

        {/* Moon */}
        <circle cx="808" cy="52" r="34" fill="#fef3c7" opacity="0.88" filter="url(#kGlow)" />
        <circle cx="823" cy="42" r="29" fill="#061e3a" />

        {/* Far background mountains */}
        <path
          d="M0,500 L0,310 L55,295 L110,305 L175,268 L235,282 L295,248 L358,262 L420,228 L480,242 L540,210 L600,225 L660,195 L720,212 L780,182 L840,198 L900,172 L900,500 Z"
          fill="url(#kMtnFar)" opacity="0.65"
        />

        {/* Main mountain silhouette with Kalsubai peak (x≈450, y≈95) */}
        <path
          d="M0,500 L0,430 L70,418 L145,408 L230,392 L310,362 L370,318 L405,272 L430,215 L450,95 L470,215 L498,268 L535,305 L590,335 L650,355 L720,368 L800,378 L900,382 L900,500 Z"
          fill="url(#kMtnMain)"
        />

        {/* Snow cap on Kalsubai peak */}
        <path
          d="M442,135 L450,95 L458,135 L454,128 L450,138 L446,128 Z"
          fill="rgba(255,255,255,0.55)"
        />

        {/* Foreground terrain */}
        <path
          d="M0,500 L0,468 L80,458 L160,472 L240,460 L320,474 L400,466 L480,478 L560,466 L640,474 L720,462 L800,472 L900,460 L900,500 Z"
          fill="url(#kFg)"
        />

        {/* Tree silhouettes at base — left cluster */}
        {[60,75,90,105,45].map((x, i) => (
          <g key={`tl${i}`}>
            <polygon points={`${x},${468-i*3} ${x-7},${490} ${x+7},${490}`} fill="#0a2010" opacity="0.8" />
          </g>
        ))}
        {/* Tree silhouettes — right cluster */}
        {[750,765,778,792,740].map((x, i) => (
          <g key={`tr${i}`}>
            <polygon points={`${x},${465-i*2} ${x-7},${488} ${x+7},${488}`} fill="#0a2010" opacity="0.7" />
          </g>
        ))}

        {/* Trek path — glow underlay */}
        <path
          d="M 82 462 C 118 445 155 424 192 400 C 229 376 258 352 285 325 C 312 298 334 274 358 250 C 382 226 404 200 422 172 C 434 152 443 128 450 108"
          stroke="#4ade80" strokeWidth="10" fill="none"
          opacity="0.18" strokeLinecap="round"
        />

        {/* Trek path — main glowing line */}
        <path
          d="M 82 462 C 118 445 155 424 192 400 C 229 376 258 352 285 325 C 312 298 334 274 358 250 C 382 226 404 200 422 172 C 434 152 443 128 450 108"
          stroke="url(#kPath)" strokeWidth="3.5" fill="none"
          strokeLinecap="round" filter="url(#kGlow)"
          strokeDasharray="6 3"
        />

        {/* ── WAYPOINTS ── */}

        {/* 1 — Bari Village (Start) */}
        <circle cx="82" cy="462" r="11" fill="#16a34a" stroke="white" strokeWidth="2.5" />
        <circle cx="82" cy="462" r="18" fill="none" stroke="#4ade80" strokeWidth="1.5" opacity="0.5" />
        <text x="82" y="466" textAnchor="middle" fill="white" fontSize="9" fontWeight="800">S</text>
        {/* Label */}
        <rect x="96" y="452" width="114" height="24" rx="7" fill="rgba(0,0,0,0.72)" />
        <text x="153" y="468" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="700">🏘 Bari Village • 680m</text>

        {/* 2 — 1st Ladder (1/3) */}
        <circle cx="285" cy="325" r="9" fill="#f59e0b" stroke="white" strokeWidth="2" />
        <circle cx="285" cy="325" r="15" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" />
        <text x="285" y="329" textAnchor="middle" fill="white" fontSize="8" fontWeight="800">1</text>
        {/* Label box above */}
        <rect x="300" y="312" width="128" height="22" rx="6" fill="rgba(0,0,0,0.72)" />
        <text x="364" y="327" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="700">⚡ 1st Ladder • 1/3 Done</text>

        {/* 3 — Last Ladder (2/3) */}
        <circle cx="400" cy="204" r="9" fill="#f59e0b" stroke="white" strokeWidth="2" />
        <circle cx="400" cy="204" r="15" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" />
        <text x="400" y="208" textAnchor="middle" fill="white" fontSize="8" fontWeight="800">2</text>
        {/* Label box */}
        <rect x="414" y="194" width="130" height="22" rx="6" fill="rgba(0,0,0,0.72)" />
        <text x="479" y="209" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="700">⚡ Last Ladder • 2/3 Done</text>

        {/* 4 — Kalsubai Summit */}
        {/* Glow halo */}
        <circle cx="450" cy="108" r="26" fill="rgba(239,68,68,0.22)" filter="url(#kSummitGlow)" />
        <circle cx="450" cy="108" r="15" fill="#ef4444" stroke="white" strokeWidth="2.5" filter="url(#kGlow)" />
        <circle cx="450" cy="108" r="22" fill="none" stroke="#fca5a5" strokeWidth="1.5" opacity="0.7" />
        {/* Temple flag */}
        <line x1="450" y1="93" x2="450" y2="75" stroke="white" strokeWidth="1.5" />
        <polygon points="450,75 462,80 450,85" fill="#fef08a" opacity="0.95" />
        {/* Summit label */}
        <rect x="466" y="90" width="158" height="44" rx="10" fill="rgba(185,28,28,0.88)" />
        <text x="545" y="108" textAnchor="middle" fill="white" fontSize="11.5" fontWeight="800">🏔 KALSUBAI PEAK</text>
        <text x="545" y="126" textAnchor="middle" fill="#fecaca" fontSize="10">1646m • 5400 ft • Maharashtra</text>

        {/* Distance markers */}
        <text x="175" y="445" textAnchor="middle" fill="rgba(134,239,172,0.55)" fontSize="9">1.8 km</text>
        <text x="335" y="288" textAnchor="middle" fill="rgba(134,239,172,0.55)" fontSize="9">3.2 km</text>
        <text x="432" y="156" textAnchor="middle" fill="rgba(134,239,172,0.55)" fontSize="9">5.5 km</text>

        {/* ── Legend ── */}
        <rect x="14" y="14" width="188" height="112" rx="12" fill="rgba(0,0,0,0.58)" />
        <text x="108" y="34" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" letterSpacing="1">TREK ROUTE MAP</text>
        <line x1="24" y1="40" x2="192" y2="40" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <circle cx="34" cy="56" r="6" fill="#16a34a" />
        <text x="46" y="60" fill="rgba(255,255,255,0.85)" fontSize="10">Start — Bari Village (680m)</text>
        <circle cx="34" cy="76" r="6" fill="#f59e0b" />
        <text x="46" y="80" fill="rgba(255,255,255,0.85)" fontSize="10">Checkpoints / Ladders</text>
        <circle cx="34" cy="96" r="6" fill="#ef4444" />
        <text x="46" y="100" fill="rgba(255,255,255,0.85)" fontSize="10">Summit (1646m • 5400ft)</text>
        <rect x="26" y="106" width="24" height="4" rx="2" fill="#4ade80" opacity="0.7" />
        <text x="56" y="114" fill="rgba(255,255,255,0.7)" fontSize="10">Trek Path (5.5km)</text>

        {/* Time callout */}
        <rect x="680" y="420" width="206" height="64" rx="12" fill="rgba(0,0,0,0.62)" />
        <text x="783" y="440" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">⏱ TREK STATS</text>
        <text x="783" y="457" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="9.5">Distance: 5.5 km one way</text>
        <text x="783" y="472" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="9.5">Climb Time: 3.5 – 4 hrs</text>

        {/* Gadvede Trekkers watermark */}
        <text x="448" y="492" textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="10" fontWeight="600">Gadvede Trekkers • Kalsubai Night Trek</text>
      </svg>
    </div>
  );
}

export default KalsubaiRouteMap;
