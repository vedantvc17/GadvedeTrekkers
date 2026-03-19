/* AI-generated SVG route map — Harishchandragad Trek */
function HarishchandragadRouteMap() {
  const stars = [
    [42,18],[88,32],[134,12],[178,28],[220,8],[265,22],[310,15],[352,30],[395,10],[440,25],
    [485,14],[528,20],[570,8],[615,35],[658,18],[700,28],[742,12],[785,22],[828,16],[870,30],
    [60,55],[110,48],[160,62],[210,44],[260,58],[315,42],[365,56],[418,38],[468,52],[520,46],
    [572,60],[625,40],[675,54],[728,36],[778,50],[830,44],[878,58],[30,80],[85,72],[140,88],
    [195,68],[250,82],[305,74],[360,92],[415,66],[470,84],[525,76],[580,90],[635,70],[690,86],
    [745,64],[800,80],[855,72],[22,105],[78,98],[135,115],[192,102],[248,118],[303,96],
    [358,112],[414,100],[470,116],[525,104],[580,118],[635,96],[690,110],[745,102],[800,114],
    [855,98],[880,108],[50,135],[105,128],[160,142],[215,132],[270,148],[325,130],[380,144],
  ];

  return (
    <div className="td-route-map-wrapper">
      <svg
        viewBox="0 0 900 480"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Harishchandragad Trek Route Map"
        style={{ width: "100%", maxWidth: 900, borderRadius: 20, display: "block", margin: "0 auto" }}
      >
        <defs>
          {/* Pre-dawn sky gradient */}
          <linearGradient id="hcSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0a1e" />
            <stop offset="40%" stopColor="#1a1035" />
            <stop offset="75%" stopColor="#2d1b5e" />
            <stop offset="100%" stopColor="#4a2070" />
          </linearGradient>
          {/* Dawn glow on horizon */}
          <linearGradient id="hcDawn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff6b35" stopOpacity="0" />
            <stop offset="60%" stopColor="#ff6b35" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffb347" stopOpacity="0.4" />
          </linearGradient>
          {/* Far mountain gradient */}
          <linearGradient id="hcMtnFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2e1f4f" />
            <stop offset="100%" stopColor="#1a0f30" />
          </linearGradient>
          {/* Main mountain */}
          <linearGradient id="hcMtnMain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3060" />
            <stop offset="100%" stopColor="#2a1845" />
          </linearGradient>
          {/* Konkan Kada cliff — orange/amber tint */}
          <linearGradient id="hcCliff" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7a4520" />
            <stop offset="100%" stopColor="#5a3015" />
          </linearGradient>
          {/* Trek path gradient */}
          <linearGradient id="hcPath" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="hcGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Soft glow for waypoints */}
          <filter id="hcWaypointGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Milky way */}
          <linearGradient id="hcMilky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(200,180,255,0)" />
            <stop offset="40%" stopColor="rgba(200,180,255,0.08)" />
            <stop offset="60%" stopColor="rgba(220,200,255,0.12)" />
            <stop offset="100%" stopColor="rgba(200,180,255,0)" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="900" height="480" fill="url(#hcSky)" />

        {/* Dawn horizon glow */}
        <rect x="0" y="260" width="900" height="220" fill="url(#hcDawn)" />

        {/* Milky Way band */}
        <ellipse cx="540" cy="90" rx="380" ry="55" fill="url(#hcMilky)" transform="rotate(-18 540 90)" />

        {/* Stars */}
        {stars.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 1.4 : 0.8}
            fill="white" opacity={0.5 + (i % 4) * 0.13} />
        ))}

        {/* Far mountain silhouettes */}
        <polygon
          points="0,310 60,245 130,270 200,220 270,255 340,215 410,250 480,200 550,235 620,210 690,240 760,205 830,230 900,215 900,340 0,340"
          fill="url(#hcMtnFar)" opacity="0.7"
        />

        {/* Main mountain — Harishchandragad with Taramati peak */}
        <polygon
          points="0,370 80,340 160,310 240,280 320,255 380,230 430,190 470,155 500,130 520,110 540,90 560,108 580,130 620,165 670,200 720,235 770,265 820,290 870,310 900,325 900,400 0,400"
          fill="url(#hcMtnMain)"
        />

        {/* Konkan Kada — the dramatic vertical cliff on the right/west side */}
        <polygon
          points="630,165 660,140 700,118 730,130 760,155 790,180 810,210 820,240 810,265 780,265 750,245 720,235"
          fill="url(#hcCliff)" opacity="0.85"
        />
        {/* Cliff face shading */}
        <polygon
          points="760,155 790,180 810,210 820,240 810,265 790,265 775,230 760,200 750,175"
          fill="#3a1a08" opacity="0.5"
        />

        {/* Snow/mist cap at Taramati peak */}
        <polygon
          points="520,110 535,102 548,96 560,108 545,118 530,122"
          fill="white" opacity="0.75"
        />

        {/* Foreground terrain */}
        <polygon
          points="0,400 50,380 120,390 200,370 280,385 360,365 440,378 520,360 600,372 680,355 760,370 840,358 900,368 900,480 0,480"
          fill="#1a0f2e"
        />

        {/* Vegetation at base */}
        {[70, 110, 155, 195, 240].map((x, i) => (
          <g key={i} transform={`translate(${x}, 385)`}>
            <polygon points="0,-18 8,0 -8,0" fill="#1a4a2e" opacity="0.8" />
            <polygon points="0,-12 6,2 -6,2" fill="#1d5c35" opacity="0.9" />
          </g>
        ))}
        {[650, 690, 730, 775, 815, 855].map((x, i) => (
          <g key={i} transform={`translate(${x}, 375)`}>
            <polygon points="0,-15 7,0 -7,0" fill="#1a4a2e" opacity="0.7" />
            <polygon points="0,-10 5,2 -5,2" fill="#1d5c35" opacity="0.8" />
          </g>
        ))}

        {/* Harishchandreshwar temple on peak */}
        <g transform="translate(540, 85)">
          <rect x="-5" y="-14" width="10" height="14" fill="#d4af37" opacity="0.9" />
          <polygon points="-8,-14 0,-24 8,-14" fill="#c41e3a" />
          <line x1="0" y1="-28" x2="0" y2="-34" stroke="#d4af37" strokeWidth="1.2" />
          <circle cx="0" cy="-35" r="2" fill="#ffd700" opacity="0.9" />
        </g>

        {/* Trek path */}
        <path
          d="M 90 450 C 120 435 155 418 188 398 C 218 380 245 360 272 338 C 300 315 322 292 348 268 C 374 244 396 218 418 192 C 435 173 450 150 468 128 C 480 113 492 100 505 90"
          stroke="url(#hcPath)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#hcGlow)"
          strokeDasharray="8 3"
        />
        {/* Solid inner path */}
        <path
          d="M 90 450 C 120 435 155 418 188 398 C 218 380 245 360 272 338 C 300 315 322 292 348 268 C 374 244 396 218 418 192 C 435 173 450 150 468 128 C 480 113 492 100 505 90"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Path to Kokankada (branch) */}
        <path
          d="M 430 185 C 480 170 530 158 580 148 C 620 140 660 138 700 130"
          stroke="#f59e0b"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="6 3"
          opacity="0.8"
          filter="url(#hcGlow)"
        />

        {/* WAYPOINTS */}

        {/* 1 — Pachnai Base Village */}
        <g filter="url(#hcWaypointGlow)">
          <circle cx="90" cy="450" r="9" fill="#22c55e" opacity="0.3" />
          <circle cx="90" cy="450" r="6" fill="#22c55e" />
          <circle cx="90" cy="450" r="3" fill="white" />
        </g>
        <rect x="102" y="440" width="112" height="20" rx="4" fill="rgba(0,0,0,0.6)" />
        <text x="108" y="454" fill="white" fontSize="9.5" fontFamily="sans-serif" fontWeight="600">
          Pachnai Base Village
        </text>
        <text x="108" y="465" fill="#86efac" fontSize="8" fontFamily="sans-serif">
          2592 ft · Start Point
        </text>

        {/* 2 — Temple Area */}
        <g filter="url(#hcWaypointGlow)">
          <circle cx="340" cy="272" r="9" fill="#a855f7" opacity="0.3" />
          <circle cx="340" cy="272" r="6" fill="#a855f7" />
          <circle cx="340" cy="272" r="3" fill="white" />
        </g>
        <rect x="352" y="262" width="130" height="20" rx="4" fill="rgba(0,0,0,0.6)" />
        <text x="358" y="276" fill="white" fontSize="9.5" fontFamily="sans-serif" fontWeight="600">
          Temple &amp; Cave Area
        </text>
        <text x="358" y="287" fill="#d8b4fe" fontSize="8" fontFamily="sans-serif">
          Kedareshwar Cave
        </text>

        {/* 3 — Kokankada Cliff */}
        <g filter="url(#hcWaypointGlow)">
          <circle cx="700" cy="130" r="9" fill="#f59e0b" opacity="0.3" />
          <circle cx="700" cy="130" r="6" fill="#f59e0b" />
          <circle cx="700" cy="130" r="3" fill="white" />
        </g>
        <rect x="712" y="120" width="100" height="20" rx="4" fill="rgba(0,0,0,0.6)" />
        <text x="718" y="134" fill="white" fontSize="9.5" fontFamily="sans-serif" fontWeight="600">
          Konkan Kada
        </text>
        <text x="718" y="145" fill="#fde68a" fontSize="8" fontFamily="sans-serif">
          Circular Rainbow Point
        </text>

        {/* 4 — Summit / Taramati Peak */}
        <g filter="url(#hcWaypointGlow)">
          <circle cx="505" cy="90" r="11" fill="#ef4444" opacity="0.35" />
          <circle cx="505" cy="90" r="7" fill="#ef4444" />
          <circle cx="505" cy="90" r="3.5" fill="white" />
        </g>
        <rect x="518" y="80" width="135" height="20" rx="4" fill="rgba(0,0,0,0.7)" />
        <text x="524" y="94" fill="white" fontSize="9.5" fontFamily="sans-serif" fontWeight="600">
          Harishchandragad Summit
        </text>
        <text x="524" y="105" fill="#fca5a5" fontSize="8" fontFamily="sans-serif">
          Taramati Peak · 4650 ft
        </text>

        {/* Trek Stats Callout */}
        <rect x="20" y="15" width="165" height="72" rx="10" fill="rgba(0,0,0,0.55)" />
        <text x="30" y="35" fill="#86efac" fontSize="11" fontFamily="sans-serif" fontWeight="700">
          Harishchandragad Trek
        </text>
        <text x="30" y="51" fill="white" fontSize="9.5" fontFamily="sans-serif">📏 5 km one way</text>
        <text x="30" y="64" fill="white" fontSize="9.5" fontFamily="sans-serif">⏱ 3 hrs uphill</text>
        <text x="30" y="77" fill="white" fontSize="9.5" fontFamily="sans-serif">⚡ Medium · 4650 ft</text>

        {/* Legend */}
        <rect x="20" y="400" width="175" height="68" rx="10" fill="rgba(0,0,0,0.55)" />
        <text x="30" y="418" fill="white" fontSize="9" fontFamily="sans-serif" fontWeight="700">
          LEGEND
        </text>
        <circle cx="32" cy="430" r="4" fill="#22c55e" />
        <text x="42" y="434" fill="white" fontSize="8.5" fontFamily="sans-serif">Base Village</text>
        <circle cx="32" cy="444" r="4" fill="#a855f7" />
        <text x="42" y="448" fill="white" fontSize="8.5" fontFamily="sans-serif">Temple &amp; Cave</text>
        <circle cx="32" cy="458" r="4" fill="#f59e0b" />
        <text x="42" y="462" fill="white" fontSize="8.5" fontFamily="sans-serif">Konkan Kada</text>
        <circle cx="120" cy="430" r="4" fill="#ef4444" />
        <text x="130" y="434" fill="white" fontSize="8.5" fontFamily="sans-serif">Summit</text>
        <line x1="120" y1="444" x2="138" y2="444" stroke="url(#hcPath)" strokeWidth="2" strokeDasharray="5 2" />
        <text x="143" y="448" fill="white" fontSize="8.5" fontFamily="sans-serif">Trek Path</text>
        <line x1="120" y1="458" x2="138" y2="458" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 2" />
        <text x="143" y="462" fill="white" fontSize="8.5" fontFamily="sans-serif">To Kokankada</text>

        {/* Watermark */}
        <text x="820" y="472" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="sans-serif">
          Gadvede Trekkers
        </text>
      </svg>
    </div>
  );
}

export default HarishchandragadRouteMap;
