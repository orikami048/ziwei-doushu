'use client';

import React from 'react';
import type { CelestialTonicScriptData } from '@/types/viral-card';

interface CelestialTonicCardProps {
  data: CelestialTonicScriptData;
  cardId?: string;
}

export default function CelestialTonicCard({
  data,
  cardId = 'celestial-tonic-card',
}: CelestialTonicCardProps) {
  const { prescriptions } = data;

  return (
    <div
      id={cardId}
      className="relative mx-auto overflow-hidden text-neutral-800 select-none shadow-2xl"
      style={{
        width: '450px',
        height: '600px', // 精准 3:4 比例 (450 x 600)
        background: '#FAF6ED', // 宋韵米白羊皮纸质感
        border: '1.5px solid #C8B896',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45), inset 0 0 50px rgba(184, 146, 42, 0.12)',
        borderRadius: '16px',
        padding: '24px 26px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        fontFamily: '"Noto Serif SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", serif',
      }}
    >
      {/* 宣纸纤维质感与朱墨暗纹 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(194, 53, 49, 0.2) 0%, transparent 40%), radial-gradient(circle at 20% 85%, rgba(184, 146, 42, 0.25) 0%, transparent 45%)',
        }}
      />
      {/* 复古角标 */}
      <div className="pointer-events-none absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t border-l border-[#A38242]" />
      <div className="pointer-events-none absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t border-r border-[#A38242]" />
      <div className="pointer-events-none absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b border-l border-[#A38242]" />
      <div className="pointer-events-none absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b border-r border-[#A38242]" />

      {/* ── 顶栏：医圣处方笺头 ── */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#D8C7A3] pb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C23531]" />
          <span className="text-[11px] font-black tracking-[0.2em] text-[#2C2A29]">
            汉唐方典 · 疾厄经方签
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#EADECA] text-[#7A5813] font-bold border border-[#CDBA93]">
            {data.elementPhase}行元气
          </span>
          <span className="text-[10px] text-[#8C6D23] font-bold tracking-wider">
            疾厄宫 · {data.jiEGongStar}
          </span>
        </div>
      </div>

      {/* ── 第一区：经络病机与打工人症候 ── */}
      <div className="relative z-10 mt-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-[0.16em] text-[#8C6D23] font-bold uppercase">
              MERIDIAN PATHOLOGY
            </div>
            <h2 className="text-[18px] font-black tracking-wide text-[#2C2A29] mt-0.5">
              【 {data.meridianTension} 】
            </h2>
          </div>
          {/* 朱砂药印 */}
          <div className="w-10 h-10 rounded-sm border-2 border-[#C23531] text-[#C23531] flex flex-col items-center justify-center font-serif text-[9px] font-black leading-tight tracking-widest shadow-sm rotate-2 bg-[#FAF6ED]">
            <span>仲景</span>
            <span>真传</span>
          </div>
        </div>

        <div className="mt-2 p-2.5 rounded-lg bg-[#F2ECE0] border border-[#DDD0B8]">
          <div className="text-[9px] font-bold text-[#8C6D23] tracking-widest mb-1 flex items-center gap-1">
            <span>✦</span> 现代打工人能量损耗映射
          </div>
          <p className="text-[11px] text-[#4A443B] leading-relaxed italic">
            “{data.symptomVibe}”
          </p>
        </div>
      </div>

      {/* ── 第二区：匹配经方与赛博时尚特调 ── */}
      <div
        className="relative z-10 rounded-xl p-3 border border-[#CDBA93] mt-2 shadow-sm"
        style={{
          background: 'linear-gradient(145deg, #FFFFFF 0%, #F5EFE3 100%)',
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <div className="text-[9px] text-[#8C6D23] font-medium tracking-wide">
              {prescriptions.sourceBook}
            </div>
            <div className="text-[14px] font-black text-[#2C2A29] tracking-tight">
              {prescriptions.formulaName}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black px-2 py-0.8 rounded-full bg-[#EFE3C8] text-[#8B6214] border border-[#D9C49A]">
              {prescriptions.modernTonicName}
            </span>
          </div>
        </div>

        {/* 四味配方网格 */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {prescriptions.dailyHerbalTeaItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-1.5 rounded bg-[#FAF6EE] border border-[#E3D7C1] text-[10px]"
            >
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-[#8C6D23] text-white flex items-center justify-center text-[8px] font-bold">
                  {item.role}
                </span>
                <span className="font-bold text-[#2C2A29]">{item.herb}</span>
              </div>
              <span className="font-mono font-bold text-[#8C6D23]">{item.dose}</span>
            </div>
          ))}
        </div>

        {/* 冲泡法 */}
        <div className="mt-2 text-[10px] text-[#554C3F] leading-normal pt-1.5 border-t border-[#E8DEC9] flex items-start gap-1">
          <span className="font-bold text-[#8C6D23] shrink-0">🍵 焖泡指南:</span>
          <span>{prescriptions.brewingMethod}</span>
        </div>
      </div>

      {/* ── 第三区：医圣心法指引 ── */}
      <div className="relative z-10 p-2.5 rounded-lg bg-[#F5EDE1] border-l-4 border-[#C23531] mt-2">
        <div className="text-[9px] font-bold text-[#C23531] tracking-wider mb-0.5">
          ✦ 倪师临床情志心法
        </div>
        <p className="text-[11px] text-[#3D352B] leading-relaxed font-medium">
          “{prescriptions.mindsetState}”
        </p>
      </div>

      {/* ── 底部防伪与经方印章 ── */}
      <div className="relative z-10 flex items-center justify-between border-t border-[#D8C7A3] pt-2 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#C23531] text-white flex items-center justify-center font-serif text-[10px] font-black">
            方
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#2C2A29] tracking-wider">
              {data.sealText}
            </div>
            <div className="text-[8px] text-[#7A6E5D] tracking-widest">
              汉唐经方 391 首全量数据库 · 打工人的赛博回血方
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-mono text-[#8C6D23] font-bold">
            TONIC-{Date.now().toString().slice(-6)}
          </div>
          <div className="text-[8px] text-[#9E907B]">
            #小红书经方打卡
          </div>
        </div>
      </div>
    </div>
  );
}
