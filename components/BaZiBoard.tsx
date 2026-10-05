'use client';
import React, { useState } from 'react';
import type { BaZiChart, BaZiPillar, WuxingElement } from '@/lib/bazi/types';
import { useTheme } from '@/components/ThemeProvider';

interface BaZiBoardProps {
  bazi: BaZiChart;
}

const WUXING_COLORS: Record<WuxingElement, { bg: string; text: string; border: string; bar: string }> = {
  Wood: { bg: 'rgba(34, 197, 94, 0.12)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)', bar: '#22c55e' },
  Fire: { bg: 'rgba(239, 68, 68, 0.12)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)', bar: '#ef4444' },
  Earth: { bg: 'rgba(234, 179, 8, 0.12)', text: '#eab308', border: 'rgba(234, 179, 8, 0.3)', bar: '#eab308' },
  Metal: { bg: 'rgba(217, 119, 6, 0.12)', text: '#d97706', border: 'rgba(217, 119, 6, 0.3)', bar: '#f59e0b' },
  Water: { bg: 'rgba(59, 130, 246, 0.12)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)', bar: '#3b82f6' },
};

export default function BaZiBoard({ bazi }: BaZiBoardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'pillars' | 'clashes' | 'wuxing' | 'dayun' | 'classics'>('pillars');

  const cardBg = isDark ? 'rgba(15,24,44,0.85)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const textMain = isDark ? '#e8eef6' : '#111827';
  const textSub = isDark ? '#9db0d0' : '#4b5563';
  const textFaint = isDark ? 'rgba(240,246,255,0.4)' : '#9ca3af';
  const gold = isDark ? '#d4a843' : '#b08a2c';
  const goldBg = isDark ? 'rgba(212,168,67,0.15)' : 'rgba(176,138,44,0.10)';

  const { pillars, dayMaster, wuxingScores, supportingElements, challengingElements, dayunCycles, clashes, classics } = bazi;

  return (
    <div className="w-full space-y-4">
      {/* ── 1. 日主灵魂原型卡片 (Day Master Soul Archetype) ── */}
      <div
        className="rounded-2xl p-4 sm:p-6 border transition-all"
        style={{
          background: `linear-gradient(135deg, ${cardBg}, ${isDark ? 'rgba(30,41,69,0.7)' : 'rgba(245,240,230,0.6)'})`,
          borderColor: cardBorder,
          boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.37)' : '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-2xl border shrink-0"
              style={{
                background: WUXING_COLORS[dayMaster.element].bg,
                color: WUXING_COLORS[dayMaster.element].text,
                borderColor: WUXING_COLORS[dayMaster.element].border,
              }}
            >
              {dayMaster.stemCn}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold" style={{ color: textMain }}>
                  {dayMaster.stemCn}{dayMaster.elementCn} · {dayMaster.archetypeCn}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border"
                  style={{ background: goldBg, color: gold, borderColor: gold }}>
                  {dayMaster.yinYangCn}{dayMaster.elementCn}
                </span>
              </div>
              <div className="text-xs tracking-wider" style={{ color: textFaint }}>
                {dayMaster.natureSymbolEn} · {dayMaster.archetypeEn}
              </div>
            </div>
          </div>

          <div className="text-xs px-3 py-1.5 rounded-lg border shrink-0 self-stretch sm:self-auto text-center"
            style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: cardBorder, color: textSub }}>
            公历: {bazi.birthInfo.solarDate}
          </div>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed mb-3.5" style={{ color: textSub }}>
          {dayMaster.essenceCn}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl border" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderColor: cardBorder }}>
            <span className="font-semibold block mb-1 text-[11px]" style={{ color: gold }}>
              ✦ 核心天赋优势 (Strengths)
            </span>
            <ul className="space-y-0.5 list-disc list-inside" style={{ color: textSub }}>
              {dayMaster.strengthsCn.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="p-2.5 rounded-xl border" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderColor: cardBorder }}>
            <span className="font-semibold block mb-1 text-[11px]" style={{ color: '#ef4444' }}>
              ✦ 觉察与成长盲区 (Growth Edges)
            </span>
            <ul className="space-y-0.5 list-disc list-inside" style={{ color: textSub }}>
              {dayMaster.growthEdgesCn.map((g, idx) => (
                <li key={idx}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── 2. 四柱八字分栏切换 (Sub Tabs) ── */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl border overflow-x-auto no-scrollbar"
        style={{ background: cardBg, borderColor: cardBorder }}>
        {[
          { key: 'pillars', label: '🏛️ 问真四柱矩阵' },
          { key: 'clashes', label: '⚡ 原局刑冲合害' },
          { key: 'wuxing', label: '⚖️ 五行平衡' },
          { key: 'dayun', label: '⏳ 十年大运' },
          { key: 'classics', label: '📜 四库全息引证' },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
            style={{
              background: activeTab === tab.key ? goldBg : 'transparent',
              color: activeTab === tab.key ? gold : textSub,
              fontWeight: activeTab === tab.key ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab 内容 1: 问真级四柱全息矩阵 ── */}
      {activeTab === 'pillars' && (
        <div className="rounded-2xl border overflow-hidden p-3 sm:p-5" style={{ background: cardBg, borderColor: cardBorder }}>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {(['year', 'month', 'day', 'hour'] as const).map(pKey => {
              const p = pillars[pKey];
              const isDay = pKey === 'day';
              const stemColor = WUXING_COLORS[p.stemWuxing];
              const branchColor = WUXING_COLORS[p.branchWuxing];

              return (
                <div
                  key={pKey}
                  className="rounded-xl border p-2.5 sm:p-4 text-center flex flex-col justify-between"
                  style={{
                    background: isDay ? (isDark ? 'rgba(212,168,67,0.06)' : 'rgba(176,138,44,0.04)') : 'transparent',
                    borderColor: isDay ? gold : cardBorder,
                  }}
                >
                  {/* 柱名 */}
                  <div className="mb-2">
                    <span className="text-[11px] sm:text-xs font-semibold block" style={{ color: isDay ? gold : textSub }}>
                      {p.nameCn}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider block" style={{ color: textFaint }}>
                      {p.name}
                    </span>
                  </div>

                  {/* 十神天干 */}
                  <div className="my-1">
                    <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-medium inline-block mb-1"
                      style={{ background: isDay ? goldBg : 'rgba(255,255,255,0.05)', color: isDay ? gold : textSub }}>
                      {p.stemTenGodCn ?? '日主'}
                    </span>
                    <div
                      className="text-2xl sm:text-4xl font-extrabold my-1 tracking-tight"
                      style={{ color: stemColor.text }}
                    >
                      {p.stemCn}
                    </div>
                    <span className="text-[9px] sm:text-[10px] block" style={{ color: textFaint }}>
                      {p.stemWuxingCn} · {p.stem}
                    </span>
                  </div>

                  {/* 地支 */}
                  <div className="my-2 pt-2 border-t" style={{ borderColor: cardBorder }}>
                    <div
                      className="text-2xl sm:text-4xl font-extrabold my-1 tracking-tight"
                      style={{ color: branchColor.text }}
                    >
                      {p.branchCn}
                    </div>
                    <span className="text-[9px] sm:text-[10px] block" style={{ color: textFaint }}>
                      {p.branchWuxingCn} · {p.branch}
                    </span>
                  </div>

                  {/* 十二长生自坐 & 旬空 */}
                  <div className="py-1 px-1.5 my-1.5 rounded-lg border text-[10px] flex items-center justify-around"
                    style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: cardBorder }}>
                    <span className="font-semibold" style={{ color: gold }}>{p.changSheng}</span>
                    {p.xunKong && <span className="text-[9px]" style={{ color: textFaint }}>{p.xunKong}</span>}
                  </div>

                  {/* 藏干 */}
                  <div className="pt-2 border-t space-y-1" style={{ borderColor: cardBorder }}>
                    <span className="text-[9px] block text-left font-medium" style={{ color: textFaint }}>
                      藏干:
                    </span>
                    {p.hiddenStems.map((hs, hIdx) => (
                      <div key={hIdx} className="flex items-center justify-between text-[10px]" style={{ color: textSub }}>
                        <span style={{ color: WUXING_COLORS[hs.wuxing].text, fontWeight: 600 }}>{hs.stemCn}</span>
                        <span className="text-[9px]" style={{ color: textFaint }}>{hs.tenGodCn}</span>
                      </div>
                    ))}
                  </div>

                  {/* 柱位专属神煞标签 */}
                  <div className="mt-2 pt-1.5 border-t text-left" style={{ borderColor: cardBorder }}>
                    <span className="text-[9px] block mb-1 font-medium" style={{ color: textFaint }}>
                      柱位神煞:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {p.pillarShenSha.length === 0 ? (
                        <span className="text-[9px]" style={{ color: textFaint }}>—</span>
                      ) : (
                        p.pillarShenSha.map((ss, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[9px] px-1 py-0.2 rounded font-medium"
                            style={{
                              background: ss.type === 'gold' ? goldBg : 'rgba(239, 68, 68, 0.12)',
                              color: ss.type === 'gold' ? gold : '#ef4444',
                            }}
                          >
                            {ss.name}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 纳音 */}
                  <div className="mt-2 pt-1.5 border-t text-[10px]" style={{ borderColor: cardBorder, color: textFaint }}>
                    {p.naYin}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tab 内容 2: 原局刑冲克害合透视 ── */}
      {activeTab === 'clashes' && (
        <div className="rounded-2xl border p-4 sm:p-6 space-y-4" style={{ background: cardBg, borderColor: cardBorder }}>
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: textMain }}>
              原局干支张力透视 (Cosmic Interplay & Structural Frictions)
            </h3>
            <p className="text-xs" style={{ color: textSub }}>
              分析四柱间天干合化冲克与地支六合、三合、六冲、相刑、六害、自刑等系统动力学关系：
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderColor: cardBorder }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: gold }} />
                <span className="text-xs font-bold" style={{ color: textMain }}>天干交汇 (Celestial Stem Interplay)</span>
              </div>
              <div className="text-xs font-medium pl-4" style={{ color: gold }}>
                {clashes.tg}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderColor: cardBorder }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: '#3b82f6' }} />
                <span className="text-xs font-bold" style={{ color: textMain }}>地支激荡 (Terrestrial Branch Frictions & Harmonies)</span>
              </div>
              <div className="text-xs font-medium pl-4" style={{ color: textMain }}>
                {clashes.dz}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderColor: cardBorder }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
                <span className="text-xs font-bold" style={{ color: textMain }}>盖头截脚 (Upper-Lower Alignment)</span>
              </div>
              <div className="text-xs font-medium pl-4" style={{ color: textSub }}>
                {clashes.zz}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 内容 3: 五行平衡雷达与喜用神 ── */}
      {activeTab === 'wuxing' && (
        <div className="rounded-2xl border p-4 sm:p-6 space-y-4" style={{ background: cardBg, borderColor: cardBorder }}>
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: textMain }}>
              五行能量量化分布 (Elemental Balance)
            </h3>
            <p className="text-xs" style={{ color: textSub }}>
              综合天干透出与地支藏干月令乘旺权重计算得出的五行原力百分比：
            </p>
          </div>

          {/* 五行条形图 */}
          <div className="space-y-2.5">
            {(['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as WuxingElement[]).map(el => {
              const sc = wuxingScores[el];
              const col = WUXING_COLORS[el];
              return (
                <div key={el} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: col.bar }} />
                      <span style={{ color: textMain }}>{sc.elementCn} ({el})</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-[11px] px-1.5 py-0.2 rounded" style={{ background: col.bg, color: col.text }}>
                        {sc.statusCn}
                      </span>
                      <span style={{ color: textMain, fontWeight: 600 }}>{sc.percentage}%</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, sc.percentage)}%`, background: col.bar }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 喜用神与忌神建议 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t" style={{ borderColor: cardBorder }}>
            <div className="p-3 rounded-xl border" style={{ background: isDark ? 'rgba(34, 197, 94, 0.05)' : 'rgba(34, 197, 94, 0.03)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
              <span className="text-xs font-bold block mb-1 text-green-500">
                ✦ 喜用神 (Supporting Energies)
              </span>
              <div className="flex gap-2 my-1.5">
                {supportingElements.map(el => (
                  <span key={el} className="px-2 py-0.5 rounded text-xs font-bold border"
                    style={{ background: WUXING_COLORS[el].bg, color: WUXING_COLORS[el].text, borderColor: WUXING_COLORS[el].border }}>
                    {wuxingScores[el].elementCn} ({el})
                  </span>
                ))}
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: textSub }}>
                生命中起到调节平衡的关键元素。利在职业选择、合作搭档及生活作息中增补相应能量。
              </p>
            </div>

            <div className="p-3 rounded-xl border" style={{ background: isDark ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.03)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <span className="text-xs font-bold block mb-1 text-red-500">
                ✦ 忌神 (Challenging Energies)
              </span>
              <div className="flex gap-2 my-1.5">
                {challengingElements.map(el => (
                  <span key={el} className="px-2 py-0.5 rounded text-xs font-bold border"
                    style={{ background: WUXING_COLORS[el].bg, color: WUXING_COLORS[el].text, borderColor: WUXING_COLORS[el].border }}>
                    {wuxingScores[el].elementCn} ({el})
                  </span>
                ))}
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: textSub }}>
                命局中过盛或失衡的元素。逢相应岁运时需防固执冒进，宜修心自律、保持谦逊。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 内容 4: 十年大运时光轴 ── */}
      {activeTab === 'dayun' && (
        <div className="rounded-2xl border p-4 sm:p-6 space-y-3" style={{ background: cardBg, borderColor: cardBorder }}>
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: textMain }}>
              十年大运周期长河 (10-Year Epoch Timeline)
            </h3>
            <p className="text-xs" style={{ color: textSub }}>
              人生以十年为一大周期，随干支演进而经历不同的主导课题与发展机遇：
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {dayunCycles.map((dy) => (
              <div
                key={dy.step}
                className="p-3 rounded-xl border relative transition-all"
                style={{
                  background: dy.isCurrent ? goldBg : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'),
                  borderColor: dy.isCurrent ? gold : cardBorder,
                }}
              >
                {dy.isCurrent && (
                  <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.2 rounded font-semibold"
                    style={{ background: gold, color: '#08080a' }}>
                    当前大运
                  </span>
                )}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xl font-bold tracking-tight" style={{ color: dy.isCurrent ? gold : textMain }}>
                    {dy.ganzhi}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: textSub }}>
                    {dy.startAge} - {dy.endAge} 岁
                  </span>
                </div>
                <div className="text-[11px] font-medium mb-1" style={{ color: dy.isCurrent ? gold : textSub }}>
                  {dy.stemTenGodCn} · {dy.themeCn}
                </div>
                <div className="text-[10px]" style={{ color: textFaint }}>
                  公元 {dy.startYear} - {dy.endYear} 年
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab 内容 5: 四库古籍全息引证 ── */}
      {activeTab === 'classics' && (
        <div className="rounded-2xl border p-4 sm:p-6 space-y-3.5" style={{ background: cardBg, borderColor: cardBorder }}>
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: textMain }}>
              四库经典全息引证 (Canonical Classics Canon)
            </h3>
            <p className="text-xs" style={{ color: textSub }}>
              直接索引《穷通宝鉴》《滴天髓》《三命通会》《八字提要》等易学权威经籍：
            </p>
          </div>

          <div className="space-y-3">
            {classics.qiongtong && (
              <div className="p-3.5 rounded-xl border" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderColor: cardBorder }}>
                <span className="text-xs font-bold block mb-1.5" style={{ color: gold }}>
                  📜 《穷通宝鉴》· 调候取用精论
                </span>
                <p className="text-xs leading-relaxed" style={{ color: textSub }}>
                  {classics.qiongtong}
                </p>
              </div>
            )}

            {classics.ditiansui && (
              <div className="p-3.5 rounded-xl border" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderColor: cardBorder }}>
                <span className="text-xs font-bold block mb-1.5" style={{ color: '#10B981' }}>
                  📜 《滴天髓》· 原文与阐微
                </span>
                <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: textSub }}>
                  {classics.ditiansui}
                </p>
              </div>
            )}

            {classics.sanming && (
              <div className="p-3.5 rounded-xl border" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderColor: cardBorder }}>
                <span className="text-xs font-bold block mb-1.5" style={{ color: '#38BDF8' }}>
                  📜 《三命通会》· 日元甲子原局立论
                </span>
                <p className="text-xs leading-relaxed" style={{ color: textSub }}>
                  {classics.sanming}
                </p>
              </div>
            )}

            {classics.tiyao && (
              <div className="p-3.5 rounded-xl border" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderColor: cardBorder }}>
                <span className="text-xs font-bold block mb-1.5" style={{ color: '#8B5CF6' }}>
                  📜 《八字提要》· 徐乐吾月令时盘详论
                </span>
                <p className="text-xs leading-relaxed" style={{ color: textSub }}>
                  {classics.tiyao}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
