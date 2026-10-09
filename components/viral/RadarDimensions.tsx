'use client';

import React from 'react';

interface RadarDimensionsProps {
  dimensions: {
    ambition: number;      // 搞钱野心
    resilience: number;    // 逆商韧性
    intuition: number;     // 灵性直觉
    empathyCost: number;   // 内耗成本
    freedomIndex: number;  // 自由不受控
  };
  size?: number;
}

export default function RadarDimensions({ dimensions, size = 180 }: RadarDimensionsProps) {
  const center = size / 2;
  const radius = (size / 2) * 0.68;

  const keys: Array<{ key: keyof typeof dimensions; label: string }> = [
    { key: 'ambition', label: '搞钱野心' },
    { key: 'resilience', label: '逆商韧性' },
    { key: 'intuition', label: '灵性直觉' },
    { key: 'empathyCost', label: '内耗成本' },
    { key: 'freedomIndex', label: '自由指数' },
  ];

  const total = keys.length;
  // 计算顶点位置 (从顶部开始，顺时针)
  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (val / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // 背景网格同心多边形
  const rings = [0.25, 0.5, 0.75, 1];
  const ringPolygons = rings.map(scale => {
    return keys
      .map((_, i) => {
        const { x, y } = getCoordinates(i, scale * 100);
        return `${x},${y}`;
      })
      .join(' ');
  });

  // 数据多边形点
  const dataPoints = keys.map((item, i) => {
    const val = Math.max(10, Math.min(100, dimensions[item.key] ?? 50));
    return getCoordinates(i, val);
  });
  const dataPolygonString = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          {/* 金光渐变填充 */}
          <linearGradient id="radarGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2c08d" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#d4a843" stopOpacity="0.12" />
          </linearGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 同心背景环 */}
        {ringPolygons.map((pts, i) => (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke="rgba(226, 192, 141, 0.18)"
            strokeWidth="0.8"
            strokeDasharray={i < 3 ? '2 2' : 'none'}
          />
        ))}

        {/* 轴线 */}
        {keys.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(226, 192, 141, 0.25)"
              strokeWidth="0.8"
            />
          );
        })}

        {/* 数据多边形区域 */}
        <polygon
          points={dataPolygonString}
          fill="url(#radarGoldGrad)"
          stroke="#f3d79e"
          strokeWidth="1.6"
          filter="url(#radarGlow)"
        />

        {/* 数据顶点高亮圆点 */}
        {dataPoints.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="3"
            fill="#ffffff"
            stroke="#d4a843"
            strokeWidth="1.5"
          />
        ))}

        {/* 文字标签与数值 */}
        {keys.map((item, i) => {
          const { x, y } = getCoordinates(i, 122);
          const val = dimensions[item.key] ?? 50;
          return (
            <g key={i}>
              <text
                x={x}
                y={y - 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#f5e6c8"
                fontSize="9"
                fontWeight="600"
                letterSpacing="0.04em"
              >
                {item.label}
              </text>
              <text
                x={x}
                y={y + 8}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#d4a843"
                fontSize="8"
                fontWeight="700"
                fontFamily="ui-monospace, monospace"
              >
                {val}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
