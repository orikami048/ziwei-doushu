'use client';

import React from 'react';
import type { KarmaQuestCardData } from '@/types/viral-card';
import RadarDimensions from './RadarDimensions';

interface KarmaQuestCardProps {
  data: KarmaQuestCardData;
  cardId?: string;
}

export default function KarmaQuestCard({ data, cardId = 'karma-quest-card' }: KarmaQuestCardProps) {
  const { mainStarArchetype } = data;

  return (
    <div
      id={cardId}
      className="relative mx-auto overflow-hidden text-neutral-100 select-none shadow-2xl"
      style={{
        width: '450px',
        height: '600px', // 精准 3:4 比例 (450 x 600)
        background: 'radial-gradient(ellipse at 50% 15%, #182030 0%, #0a0d14 60%, #06080c 100%)',
        border: '1.5px solid rgba(226, 192, 141, 0.45)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(226, 192, 141, 0.05)',
        borderRadius: '16px',
        padding: '24px 26px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      }}
    >
      {/* 极简星轨与背景光晕暗纹 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 85% 10%, rgba(226, 192, 141, 0.3) 0%, transparent 45%), radial-gradient(circle at 10% 80%, rgba(194, 53, 49, 0.25) 0%, transparent 40%)',
        }}
      />
      {/* 边角古典金饰纹样 */}
      <div className="pointer-events-none absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t border-l border-amber-400/40" />
      <div className="pointer-events-none absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t border-r border-amber-400/40" />
      <div className="pointer-events-none absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b border-l border-amber-400/40" />
      <div className="pointer-events-none absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b border-r border-amber-400/40" />

      {/* ── 头部信息栏 ── */}
      <div className="relative z-10 flex items-center justify-between border-b border-amber-400/20 pb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.22em] text-amber-300 uppercase">
            #星宿本命局 · KARMA MATRIX
          </span>
        </div>
        <div className="text-[10px] tracking-wider text-amber-200/60 font-mono">
          {data.birthFormatted}
        </div>
      </div>

      {/* ── 第一区：灵魂原型人设与五维雷达 ── */}
      <div className="relative z-10 mt-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-[0.16em] px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
                {mainStarArchetype.starName} · 本命原型
              </span>
              <span className="text-[10px] text-neutral-400 tracking-wider">
                {data.userName}
              </span>
            </div>
            <h1 className="text-[20px] font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 mt-1 leading-tight">
              {mainStarArchetype.archetypeTitle}
            </h1>
          </div>
          {/* 朱砂封印 */}
          <div className="w-8 h-8 rounded border border-red-500/60 bg-red-950/40 text-red-400 flex items-center justify-center font-serif text-[11px] font-black tracking-widest shadow-inner rotate-3">
            觉醒
          </div>
        </div>

        {/* 金句 */}
        <p className="text-[11px] leading-relaxed text-amber-100/80 italic mt-1.5 pl-2.5 border-l-2 border-amber-400/50">
          “{mainStarArchetype.soulQuote}”
        </p>

        {/* 标签与五维雷达 */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col gap-1.5 max-w-[210px]">
            <span className="text-[9px] tracking-[0.14em] text-amber-300/60 font-semibold">
              ✦ 核心气场图谱
            </span>
            <div className="flex flex-wrap gap-1">
              {mainStarArchetype.auraKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-[9px] px-2 py-0.5 rounded-full bg-neutral-800/80 text-amber-200/90 border border-amber-400/20"
                >
                  #{kw}
                </span>
              ))}
            </div>
            <div className="mt-1 text-[9px] text-neutral-400 leading-normal">
              能量状态：<span className="text-emerald-400 font-semibold">98% 深度自洽</span>
            </div>
          </div>
          <div className="shrink-0 -mr-2">
            <RadarDimensions dimensions={mainStarArchetype.fiveDimensions} size={135} />
          </div>
        </div>
      </div>

      {/* ── 第二区：化忌通关令 (核心主线副本) ── */}
      <div
        className="relative z-10 rounded-xl p-3 border border-amber-400/25 mt-1"
        style={{
          background: 'linear-gradient(145deg, rgba(226, 192, 141, 0.08) 0%, rgba(20, 26, 38, 0.6) 100%)',
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-red-900/60 text-red-300 border border-red-500/40">
              通关副本
            </span>
            <span className="text-[11px] font-bold text-amber-300 tracking-wide">
              {data.karmaGong} · {data.karmaStar}
            </span>
          </div>
          <span className="text-[10px] text-amber-400/70 font-semibold">
            {data.questTitle}
          </span>
        </div>

        <div className="space-y-1.5 text-[10px] leading-relaxed">
          <div className="flex items-start gap-1">
            <span className="shrink-0 text-red-400 font-bold">[宿命刺痛]</span>
            <span className="text-neutral-300">{data.karmaPainPoint}</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="shrink-0 text-amber-300 font-bold">[因果释怀]</span>
            <span className="text-amber-100/90">{data.reframeInsight}</span>
          </div>
          <div className="flex items-start gap-1 p-1.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-200">
            <span className="shrink-0 text-amber-300 font-black">⚡ [通关密码]</span>
            <span className="font-medium">{data.clearingPassword}</span>
          </div>
        </div>
      </div>

      {/* ── 第三区：社交因果羁绊 ── */}
      <div className="relative z-10 flex items-center justify-between text-[10px] px-1 mt-1 text-neutral-300">
        <div>
          <span className="text-amber-300 font-bold">✦ 天生同盟：</span>
          <span className="text-neutral-200 ml-1">{data.destinedAlly}</span>
        </div>
        <div>
          <span className="text-red-400 font-bold">✕ 避耗指南：</span>
          <span className="text-neutral-200 ml-1">{data.karmicNemesis}</span>
        </div>
      </div>

      {/* ── 底部防伪与裂变标识 ── */}
      <div className="relative z-10 flex items-center justify-between border-t border-amber-400/20 pt-2 mt-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 font-serif text-[10px] font-black">
            紫
          </div>
          <div>
            <div className="text-[10px] font-bold text-amber-200/90 tracking-wider">
              紫微斗数 · 倪海夏学派
            </div>
            <div className="text-[8px] text-neutral-400 tracking-widest">
              长按保存3:4高清海报 · 扫码测算你的灵魂因果
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-mono text-amber-400/70 font-semibold">
            NO. {Date.now().toString().slice(-6)}
          </div>
          <div className="text-[8px] text-neutral-500">
            #小红书爆款灵魂卡
          </div>
        </div>
      </div>
    </div>
  );
}
