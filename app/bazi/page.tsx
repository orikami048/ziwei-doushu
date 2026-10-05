'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import BaZiBoard from '@/components/BaZiBoard';
import InsightPanel from '@/components/InsightPanel';
import { calculateBaZi } from '@/lib/bazi/engine';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { BaZiChart } from '@/lib/bazi/types';
import { useHistory, type HistoryEntry } from '@/lib/ziwei/history';
import { formToBirthInfo } from '@/lib/ziwei/share';
import { useTheme } from '@/components/ThemeProvider';

/**
 * 八字排盘独立专业工作台 —— 独立四柱八字产品线 (/bazi)
 * 传承四库古籍权威经籍（《穷通宝鉴》《滴天髓》《三命通会》《八字提要》）
 * 包含：问真级四柱全息矩阵、十二长生星运、柱位神煞矩阵、原局刑冲克害合透视、五行雷达、十年大运
 */

const SHICHEN_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function calcBranch(hour: number, minute: number, longitude: number): number {
  const clockMins = hour * 60 + minute;
  const offset = (longitude - 120) * 4;
  const solar = ((clockMins + offset) % 1440 + 1440) % 1440;
  if (solar >= 1380 || solar < 60) return 0;
  return Math.floor((solar - 60) / 120) + 1;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min}分钟前`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}小时前`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}天前`;
  return `${Math.floor(d / 30)}月前`;
}

export default function BaZiPage() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  const [bazi, setBazi] = useState<BaZiChart | null>(null);
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [mobileTab, setMobileTab] = useState<'bazi' | 'insight'>('bazi');

  const { history, save, clear } = useHistory();
  const formRef = useRef<BirthFormState | null>(null);

  const computeCharts = (info: BirthInfo) => {
    const clockHour = info.origInput?.clockHour ?? (info.hour * 2);
    const clockMinute = info.origInput?.clockMinute ?? 0;
    const baziData = calculateBaZi({
      year: info.origInput?.year ?? info.year,
      month: info.origInput?.month ?? info.month,
      day: info.origInput?.day ?? info.day,
      hour: clockHour,
      minute: clockMinute,
      gender: info.gender,
      longitude: info.longitude,
    });
    const ziweiData = generateChart(info);
    setBazi(baziData);
    setChart(ziweiData);
    setMobileTab('bazi');
  };

  const handleSubmit = (info: BirthInfo) => {
    if (formRef.current) save(formRef.current);
    computeCharts(info);
  };

  const handleHistoryClick = (entry: HistoryEntry) => {
    const bi = formToBirthInfo(entry.form);
    if (bi) {
      save(entry.form);
      computeCharts(bi);
    }
  };

  const bg = isDark ? '#0a0f1e' : '#f7f5f0';
  const navBg = isDark ? '#0e1526' : '#ffffff';
  const navBorder = isDark ? 'rgba(255,255,255,0.08)' : '#ececec';
  const cardBg = isDark ? 'rgba(15,24,44,0.9)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.10)' : '#e8e8e8';
  const textMain = isDark ? '#e8eef6' : '#1a1a1a';
  const textSub = isDark ? '#9db0d0' : '#8a8a8a';
  const textFaint = isDark ? 'rgba(240,246,255,0.4)' : '#b8b8b8';
  const gold = isDark ? '#d4a843' : '#b08a2c';

  // ── 未排盘：起盘界面 ──
  if (!bazi || !chart) {
    return (
      <div style={{ minHeight: '100vh', background: bg, fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' }}>
        {/* 顶部独立导航 */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: '52px',
          background: navBg, borderBottom: `1px solid ${navBorder}`,
          position: 'sticky', top: 0, zIndex: 100,
        }} className="sm:px-7">
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar">
            <Link href="/" style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.12em', color: gold, textDecoration: 'none' }} className="shrink-0">
              四柱八字工作台
            </Link>
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              <NavItem href="/bazi" isDark={isDark} active>八字排盘</NavItem>
              <NavItem href="/chart" isDark={isDark} active={false}>紫微命盘</NavItem>
              <NavItem href="/heming" isDark={isDark} active={false}>合盘</NavItem>
              <NavItem href="/knowledge" isDark={isDark} active={false}>学术中心</NavItem>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="切换主题"
              className="text-[11px] px-2.5 py-1 rounded-full border transition-colors cursor-pointer"
              style={{
                borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(176,138,44,0.25)',
                color: gold,
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
              }}
            >
              {isDark ? '🌙' : '☀️'}
            </button>
          </div>
        </nav>

        {/* 主体区域 */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-6 sm:gap-12 items-start">
            {/* 桌面端左侧介绍 */}
            <div className="hidden lg:flex flex-col gap-8">
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.28em', color: textFaint, marginBottom: '10px' }}>
                  BAZI · FOUR PILLARS WORKSPACE
                </div>
                <h1 style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1.25, color: textMain, margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  四柱八字全息排盘
                </h1>
                <p style={{ fontSize: '14px', lineHeight: 1.8, color: textSub, margin: 0 }}>
                  权威四柱八字排盘系统。涵盖天干地支、藏干十神、星运自坐十二长生、空亡纳音、柱位专属神煞矩阵、原局刑冲克害合透视、五行面积雷达与《穷通宝鉴》《滴天髓》《三命通会》《八字提要》四库经籍原文全息考证。
                </p>
              </div>

              {/* 历史命盘卡片 */}
              {history.length > 0 && (
                <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '20px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '11px', letterSpacing: '0.18em', color: textFaint, fontWeight: 600 }}>
                      RECENT CHARTS / 最近命盘
                    </span>
                    <button
                      type="button"
                      onClick={clear}
                      style={{ fontSize: '11px', color: textFaint, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      清空
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {history.slice(0, 5).map(entry => {
                      const f = entry.form;
                      const dateStr = `${f.year}年${f.month}月${f.day}日`;
                      const timeStr = `${f.clockHour ? SHICHEN_NAMES[calcBranch(Number(f.clockHour), Number(f.clockMinute || 0), Number(f.longitude || 120))] : '—'}时`;
                      const genderStr = f.gender === 'female' ? '坤造' : '乾造';
                      return (
                        <div
                          key={entry.id}
                          onClick={() => handleHistoryClick(entry)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 14px', borderRadius: '10px',
                            border: `1px solid ${cardBorder}`,
                            cursor: 'pointer', transition: 'all 0.15s ease',
                          }}
                          className="hover:border-amber-500/30"
                        >
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: textMain, marginRight: '8px' }}>
                              {f.name || '未命名'}
                            </span>
                            <span style={{ fontSize: '11px', color: textSub }}>
                              {genderStr} · {dateStr} {timeStr}
                            </span>
                          </div>
                          <span style={{ fontSize: '11px', color: textFaint }}>
                            {timeAgo(entry.savedAt)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 移动端标题 */}
            <div className="lg:hidden mb-4 text-center">
              <div style={{ fontSize: '10px', letterSpacing: '0.28em', color: textFaint, marginBottom: '4px' }}>
                BAZI WORKSPACE
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: textMain, margin: '0 0 4px', letterSpacing: '0.03em' }}>
                四柱八字全息排盘
              </h1>
              <p style={{ fontSize: '12px', color: textSub, margin: 0 }}>
                问真级四柱全息矩阵、神煞、五行能量与四库古籍引证
              </p>
            </div>

            <BirthForm
              onSubmit={handleSubmit}
              onFormSave={(f) => { formRef.current = f; }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── 已排盘：八字全息工作台展示 ──
  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' }}>
      {/* 顶部工具栏 */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '52px',
        background: navBg, borderBottom: `1px solid ${navBorder}`,
        position: 'sticky', top: 0, zIndex: 100,
      }} className="sm:px-7">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setBazi(null); setChart(null); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer border"
            style={{
              borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#d1d5db',
              color: textMain,
              background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
            }}
          >
            <span>←</span>
            <span>重新排盘</span>
          </button>
          <span className="hidden sm:inline-block text-xs font-semibold tracking-wider" style={{ color: gold }}>
            {bazi.dayMaster.stemCn}{bazi.dayMaster.elementCn} · {bazi.dayMaster.archetypeCn}
          </span>
        </div>

        {/* 顶部直达紫微斗数快捷按钮 */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/chart"
            className="px-3 py-1 rounded-md text-xs font-medium border transition-all"
            style={{ borderColor: cardBorder, color: textSub, background: isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6' }}
          >
            去紫微命盘 ☯
          </Link>
        </div>

        {/* 移动端视图切换 Tab（八字 / AI解读） */}
        <div className="flex lg:hidden items-center p-1 rounded-lg border gap-1"
          style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f0f0f0', borderColor: cardBorder }}>
          <button
            type="button"
            onClick={() => setMobileTab('bazi')}
            className="px-3 py-1 rounded-md text-xs font-medium transition-all"
            style={{
              background: mobileTab === 'bazi' ? (isDark ? 'rgba(212,168,67,0.2)' : '#ffffff') : 'transparent',
              color: mobileTab === 'bazi' ? gold : textSub,
              fontWeight: mobileTab === 'bazi' ? 600 : 400,
            }}
          >
            🔮 八字全息
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('insight')}
            className="px-3 py-1 rounded-md text-xs font-medium transition-all"
            style={{
              background: mobileTab === 'insight' ? (isDark ? 'rgba(212,168,67,0.2)' : '#ffffff') : 'transparent',
              color: mobileTab === 'insight' ? gold : textSub,
              fontWeight: mobileTab === 'insight' ? 600 : 400,
            }}
          >
            ✦ AI深度解读
          </button>
        </div>

        {/* 右侧切换主题 */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="切换主题"
            className="text-[11px] px-2.5 py-1 rounded-full border transition-colors cursor-pointer"
            style={{
              borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(176,138,44,0.25)',
              color: gold,
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
            }}
          >
            {isDark ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      {/* 主体工作区 */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] gap-5 items-start">
          {/* 左栏：独立八字全息工作台 */}
          <div className={`${mobileTab === 'bazi' ? 'block' : 'hidden'} lg:block w-full min-w-0`}>
            <BaZiBoard bazi={bazi} />

            {/* 底部联动提示条 */}
            <div className="mt-4 p-3.5 rounded-xl flex items-center justify-between border"
              style={{ background: cardBg, borderColor: cardBorder }}>
              <div className="text-xs pr-2" style={{ color: textSub }}>
                可随时在紫微斗数十二宫罗盘与八字全息矩阵之间交叉比对
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/chart"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                  style={{ borderColor: cardBorder, color: textMain, background: isDark ? 'rgba(255,255,255,0.05)' : '#f8f8f8' }}
                >
                  查看紫微斗数 ☯
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileTab('insight')}
                  className="lg:hidden px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #b08a2c, #d4a843)', color: '#08080a' }}
                >
                  查看解读 →
                </button>
              </div>
            </div>
          </div>

          {/* 右栏：AI 深度解读面板 */}
          <div className={`${mobileTab === 'insight' ? 'block' : 'hidden'} lg:block w-full min-w-0 lg:sticky lg:top-[68px]`}>
            {/* 移动端返回八字快捷键 */}
            <div className="lg:hidden mb-2 flex items-center justify-between px-1">
              <span className="text-xs font-medium" style={{ color: gold }}>✦ 八字元神与双擎合参解读</span>
              <button
                type="button"
                onClick={() => setMobileTab('bazi')}
                className="text-xs cursor-pointer"
                style={{ color: textSub }}
              >
                ← 返回八字
              </button>
            </div>
            <div style={{ height: 'calc(100vh - 120px)', minHeight: '520px', maxHeight: '780px' }}>
              <InsightPanel chart={chart} bazi={bazi} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, children, active, isDark }: { href: string; children: React.ReactNode; active: boolean; isDark: boolean }) {
  const gold = isDark ? '#d4a843' : '#b08a2c';
  const text = isDark ? '#9db0d0' : '#666666';
  const activeText = isDark ? '#e8eef6' : '#1a1a1a';
  return (
    <Link
      href={href}
      style={{
        fontSize: '13px', textDecoration: 'none', color: active ? activeText : text,
        fontWeight: active ? 600 : 400,
        borderBottom: active ? `2px solid ${gold}` : '2px solid transparent',
        padding: '2px 0', cursor: 'pointer',
      }}
      className="shrink-0 whitespace-nowrap"
    >
      {children}
    </Link>
  );
}
