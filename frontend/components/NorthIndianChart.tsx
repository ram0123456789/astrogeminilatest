import React, { useState } from 'react';
import { PlanetPosition } from '../types';

interface NorthIndianChartProps {
  lagnaNumber: number; // 1 (Aries) to 12 (Pisces)
  planets: PlanetPosition[];
  title?: string;
}

// Exact coordinates for the 12 Houses in a 400x400 North Indian Diamond Kundli SVG
const HOUSE_CENTERS: Record<number, { x: number; y: number; rashiX: number; rashiY: number }> = {
  1: { x: 200, y: 110, rashiX: 200, rashiY: 168 },
  2: { x: 100, y: 45, rashiX: 100, rashiY: 82 },
  3: { x: 45, y: 100, rashiX: 80, rashiY: 100 },
  4: { x: 110, y: 200, rashiX: 165, rashiY: 200 },
  5: { x: 45, y: 300, rashiX: 80, rashiY: 300 },
  6: { x: 100, y: 355, rashiX: 100, rashiY: 320 },
  7: { x: 200, y: 290, rashiX: 200, rashiY: 235 },
  8: { x: 300, y: 355, rashiX: 300, rashiY: 320 },
  9: { x: 355, y: 300, rashiX: 320, rashiY: 300 },
  10: { x: 290, y: 200, rashiX: 235, rashiY: 200 },
  11: { x: 355, y: 100, rashiX: 320, rashiY: 100 },
  12: { x: 300, y: 45, rashiX: 300, rashiY: 82 },
};

export const NorthIndianChart: React.FC<NorthIndianChartProps> = ({
  lagnaNumber,
  planets,
  title = 'Lagna Chart (D-1)',
}) => {
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');

  const getRashiForHouse = (houseNum: number) => {
    return ((lagnaNumber + houseNum - 2) % 12) + 1;
  };

  const getPlanetsInHouse = (houseNum: number) => {
    return planets.filter((p) => Number(p.house) === houseNum);
  };

  return (
    <div className="bg-[#FDFBF7] text-[#2A1810] rounded-2xl p-5 border-2 border-[#C89B3C]/60 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#9E2A2B] font-semibold block">
            Sacred Varga Chakra
          </span>
          <h4 className="font-display font-bold text-lg text-[#2A1810]">{title}</h4>
        </div>
        <div className="flex rounded-lg bg-[#2A1810]/10 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setChartStyle('north')}
            className={`px-2.5 py-1 rounded-md transition ${
              chartStyle === 'north'
                ? 'bg-[#9E2A2B] text-white shadow-sm'
                : 'text-[#2A1810]/70 hover:text-[#2A1810]'
            }`}
          >
            North Indian
          </button>
          <button
            type="button"
            onClick={() => setChartStyle('south')}
            className={`px-2.5 py-1 rounded-md transition ${
              chartStyle === 'south'
                ? 'bg-[#9E2A2B] text-white shadow-sm'
                : 'text-[#2A1810]/70 hover:text-[#2A1810]'
            }`}
          >
            South Indian
          </button>
        </div>
      </div>

      {chartStyle === 'north' ? (
        <div className="relative w-full aspect-square max-w-[380px] mx-auto">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Parchment background */}
            <rect
              x="4"
              y="4"
              width="392"
              height="392"
              rx="8"
              fill="#FDFBF7"
              stroke="#9E2A2B"
              strokeWidth="3"
            />
            <rect
              x="10"
              y="10"
              width="380"
              height="380"
              fill="none"
              stroke="#C89B3C"
              strokeWidth="1"
              strokeDasharray="4 2"
            />

            {/* Main Diagonals */}
            <line x1="4" y1="4" x2="396" y2="396" stroke="#9E2A2B" strokeWidth="2" />
            <line x1="396" y1="4" x2="4" y2="396" stroke="#9E2A2B" strokeWidth="2" />

            {/* Inner Diamond */}
            <polygon
              points="200,4 396,200 200,396 4,200"
              fill="none"
              stroke="#9E2A2B"
              strokeWidth="2.2"
            />

            {/* Center Sacred Om Emblem */}
            <circle cx="200" cy="200" r="14" fill="#FDFBF7" stroke="#C89B3C" strokeWidth="1.5" />
            <text
              x="200"
              y="205"
              textAnchor="middle"
              className="font-serif text-[13px] fill-[#9E2A2B] font-bold"
            >
              ॐ
            </text>

            {/* Render each of the 12 Houses */}
            {Array.from({ length: 12 }, (_, idx) => idx + 1).map((houseNum) => {
              const coords = HOUSE_CENTERS[houseNum];
              const rashiNum = getRashiForHouse(houseNum);
              const housePlanets = getPlanetsInHouse(houseNum);

              return (
                <g key={houseNum}>
                  {/* Rashi Number in corner of house */}
                  <text
                    x={coords.rashiX}
                    y={coords.rashiY}
                    textAnchor="middle"
                    className="font-mono text-[11px] fill-[#9E2A2B]/80 font-bold"
                  >
                    {rashiNum}
                  </text>

                  {/* Lagna marker in House 1 */}
                  {houseNum === 1 && (
                    <text
                      x={coords.x}
                      y={coords.y - 24}
                      textAnchor="middle"
                      className="font-display text-[10px] fill-[#C89B3C] font-bold tracking-wider"
                    >
                      LAGNA
                    </text>
                  )}

                  {/* Planets in this house */}
                  <text
                    x={coords.x}
                    y={coords.y}
                    textAnchor="middle"
                    className="font-mono text-[12px] font-bold fill-[#2A1810]"
                  >
                    {housePlanets.length === 0 ? (
                      <tspan fill="#2A1810" fillOpacity="0.2">·</tspan>
                    ) : (
                      housePlanets.map((p, i) => (
                        <tspan
                          key={p.planet}
                          x={coords.x}
                          dy={i === 0 ? (housePlanets.length > 2 ? -8 : 0) : 14}
                          fill={p.benefic ? '#1B5E20' : '#9E2A2B'}
                        >
                          {p.symbol}
                          {p.isRetrograde ? '(R)' : ''}
                        </tspan>
                      ))
                    )}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        /* South Indian 4x4 Grid Chart */
        <div className="grid grid-cols-4 grid-rows-4 aspect-square max-w-[380px] mx-auto border-2 border-[#9E2A2B] rounded-lg overflow-hidden bg-[#FDFBF7]">
          {[12, 1, 2, 3, 11, -1, -2, 4, 10, -3, -4, 5, 9, 8, 7, 6].map((rashiCell, idx) => {
            if (rashiCell === -1) {
              return (
                <div
                  key={idx}
                  className="col-span-2 row-span-2 flex flex-col items-center justify-center border border-[#C89B3C]/60 bg-[#9E2A2B]/5 p-2 text-center"
                >
                  <span className="text-2xl text-[#9E2A2B] font-serif">ॐ</span>
                  <span className="font-display font-bold text-xs text-[#2A1810] mt-1">
                    RASHI CHAKRA
                  </span>
                  <span className="font-mono text-[10px] text-[#9E2A2B]">
                    Lagna: Rashi #{lagnaNumber}
                  </span>
                </div>
              );
            }
            if (rashiCell < 0) return null;

            const houseForThisRashi = ((rashiCell - lagnaNumber + 12) % 12) + 1;
            const cellPlanets = getPlanetsInHouse(houseForThisRashi);
            const isLagna = rashiCell === lagnaNumber;

            return (
              <div
                key={idx}
                className={`border border-[#9E2A2B]/40 p-1.5 flex flex-col justify-between relative ${
                  isLagna ? 'bg-[#C89B3C]/20' : ''
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-[#9E2A2B]">
                  <span>#{rashiCell}</span>
                  {isLagna && (
                    <span className="px-1 bg-[#9E2A2B] text-white rounded text-[9px] font-bold">
                      ASC
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 my-auto justify-center">
                  {cellPlanets.map((p) => (
                    <span
                      key={p.planet}
                      className={`font-mono text-xs font-bold ${
                        p.benefic ? 'text-emerald-800' : 'text-[#9E2A2B]'
                      }`}
                    >
                      {p.symbol}
                    </span>
                  ))}
                </div>
                <div className="text-[9px] text-right text-[#2A1810]/50 font-mono">
                  H{houseForThisRashi}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 pt-2.5 border-t border-[#C89B3C]/30 flex items-center justify-between text-[11px] font-mono text-[#2A1810]/80">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-700 inline-block"></span> Shubha (Benefic)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#9E2A2B] inline-block"></span> Papa/Krura (Intense)
        </span>
        <span>(R) = Vakri</span>
      </div>
    </div>
  );
};
