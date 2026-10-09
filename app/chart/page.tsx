'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import BaZiBoard from '@/components/BaZiBoard';
import InsightPanel from '@/components/InsightPanel';
import { generateChart } from '@/lib/ziwei/algorithm';
import { calculateBaZi } from '@/lib/bazi/engine';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { BaZiChart } from '@/lib/bazi/types';
import { useHistory, type HistoryEntry } from '@/lib/ziwei/history';
import { formToBirthInfo } from '@/lib/ziwei/share';
import { useTheme } from '@/components/ThemeProvider';
import ViralModal from '@/components/viral/ViralModal';

/**
 * 命盘页 —— 全球化东方命理双引擎（紫微斗数 + 四柱八字）
 * 未起盘：顶部响应式导航 + 手机单列优先表单/桌面双栏 + 最近命盘
 * 已起盘：桌面【紫微斗数 ☯】与【四柱八字 🔮】自由切换 + 右侧【AI深度解读 ✦】
 *         移动端三合一【☯ 紫微】/【🔮 八字】/【✦ 解读】无缝切换
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

export default function ChartPage() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [bazi, setBazi] = useState<BaZiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);

  // 桌面端左侧视窗模式：'ziwei' (4x4 罗盘) | 'bazi' (四柱全息)
  const [boardMode, setBoardMode] = useState<'ziwei' | 'bazi'>('ziwei');
  // 移动端视图切换 Tab：'ziwei' | 'bazi' | 'insight'
  const [mobileTab, setMobileTab] = useState<'ziwei' | 'bazi' | 'insight'>('ziwei');
  // 3:4 社交裂变爆款海报弹窗状态
  const [viralModalOpen, setViralModalOpen] = useState(false);

  const { history, save, clear } = useHistory();
  const formRef = useRef<BirthFormState | null>(null);

  const computeDualCharts = (info: BirthInfo) => {
    const generatedChart = generateChart(info);
    const clockHour = info.origInput?.clockHour ?? (info.hour * 2);
    const clockMinute = info.origInput?.clockMinute ?? 0;
    const generatedBazi = calculateBaZi({
      year: info.origInput?.year ?? info.year,
      month: info.origInput?.month ?? info.month,
      day: info.origInput?.day ?? info.day,
      hour: clockHour,
      minute: clockMinute,
      gender: info.gender,
      longitude: info.longitude,
    });

    setChart(generatedChart);
    setBazi(generatedBazi);
    setBoardMode('ziwei');
    setMobileTab('ziwei');
  };

  const handleSubmit = (info: BirthInfo) => {
    if (formRef.current) save(formRef.current);
    computeDualCharts(info);
  };

  const handleHistoryClick = (entry: HistoryEntry) => {
    const bi = formToBirthInfo(entry.form);
    if (bi) {
      save(entry.form);
      computeDualCharts(bi);
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
  const accent = isDark ? 'rgba(212,168,67,0.2)' : 'rgba(176,138,44,0.12)';

  // ── 未起盘：响应式输入 UI ──
  if (!chart || !bazi) {
    return (
      <div style={{ minHeight: '100vh', background: bg, fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' }}>
        {/* ── 顶部导航 ── */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: '52px',
          background: navBg, borderBottom: `1px solid ${navBorder}`,
          position: 'sticky', top: 0, zIndex: 100,
        }} className="sm:px-7">
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar">
            <Link href="/" style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.12em', color: gold, textDecoration: 'none' }} className="shrink-0">
              东方双擎命理
            </Link>
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              <NavItem href="/chart" isDark={isDark} active>紫微排盘</NavItem>
              <NavItem href="/bazi" isDark={isDark} active={false}>八字排盘</NavItem>
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

        {/* ── 主体区域：桌面双列 / 移动单列 ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-6 sm:gap-12 items-start">
            {/* 桌面端左侧介绍 + 历史记录 */}
            <div className="hidden lg:flex flex-col gap-8">
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.28em', color: textFaint, marginBottom: '10px' }}>
                  01 / DUAL-ENGINE ASTROLOGY
                </div>
                <h1 style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1.25, color: textMain, margin: '0 0 14px', letterSpacing: '0.02em' }}>
                  紫微斗数 & 四柱八字
                </h1>
                <p style={{ fontSize: '14px', lineHeight: 1.8, color: textSub, margin: 0 }}>
                  融合倪海夏《天纪》正宗紫微斗数与《子平真诠》《滴天髓》四柱八字权威体系。输入公历或农历生辰，一次性生成【十二宫全息星盘】与【五行十神元神图谱】。
                </p>
              </div>

              {/* 最近命盘历史 */}
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

            {/* 移动端顶部标题 */}
            <div className="lg:hidden mb-4 text-center">
              <div style={{ fontSize: '10px', letterSpacing: '0.28em', color: textFaint, marginBottom: '4px' }}>
                01 / DUAL-ENGINE METAPHYSICS
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: textMain, margin: '0 0 4px', letterSpacing: '0.03em' }}>
                紫微斗数 & 四柱八字
              </h1>
              <p style={{ fontSize: '12px', color: textSub, margin: 0 }}>
                输入出生生辰，系统一次性推演紫微十二宫罗盘与八字五行元神
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

  // ── 已起盘：命盘 + 解读 ──
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
            onClick={() => { setChart(null); setBazi(null); setSelectedPalace(null); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer border"
            style={{
              borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#d1d5db',
              color: textMain,
              background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
            }}
          >
            <span>←</span>
            <span>重新起盘</span>
          </button>
          <span className="hidden sm:inline-block text-xs font-semibold tracking-wider" style={{ color: gold }}>
            {chart.birthInfo.name ? `${chart.birthInfo.name} 的双擎命盘` : '东方双擎命盘'}
          </span>
        </div>

        {/* 桌面端双引擎切换器 (紫微 ☯ / 八字 🔮) */}
        <div className="hidden lg:flex items-center p-1 rounded-lg border gap-1"
          style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f0f0f0', borderColor: cardBorder }}>
          <button
            type="button"
            onClick={() => setBoardMode('ziwei')}
            className="px-3.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer"
            style={{
              background: boardMode === 'ziwei' ? (isDark ? 'rgba(212,168,67,0.2)' : '#ffffff') : 'transparent',
              color: boardMode === 'ziwei' ? gold : textSub,
              boxShadow: boardMode === 'ziwei' && !isDark ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              fontWeight: boardMode === 'ziwei' ? 600 : 400,
            }}
          >
            ☯ 紫微斗数
          </button>
          <button
            type="button"
            onClick={() => setBoardMode('bazi')}
            className="px-3.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer"
            style={{
              background: boardMode === 'bazi' ? (isDark ? 'rgba(212,168,67,0.2)' : '#ffffff') : 'transparent',
              color: boardMode === 'bazi' ? gold : textSub,
              boxShadow: boardMode === 'bazi' && !isDark ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              fontWeight: boardMode === 'bazi' ? 600 : 400,
            }}
          >
            🔮 四柱八字
          </button>
        </div>

        {/* 移动端视图切换 Tab（紫微 / 八字 / AI解读） */}
        <div className="flex lg:hidden items-center p-1 rounded-lg border gap-1"
          style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f0f0f0', borderColor: cardBorder }}>
          <button
            type="button"
            onClick={() => setMobileTab('ziwei')}
            className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
            style={{
              background: mobileTab === 'ziwei' ? (isDark ? 'rgba(212,168,67,0.2)' : '#ffffff') : 'transparent',
              color: mobileTab === 'ziwei' ? gold : textSub,
              fontWeight: mobileTab === 'ziwei' ? 600 : 400,
            }}
          >
            ☯ 紫微
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('bazi')}
            className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
            style={{
              background: mobileTab === 'bazi' ? (isDark ? 'rgba(212,168,67,0.2)' : '#ffffff') : 'transparent',
              color: mobileTab === 'bazi' ? gold : textSub,
              fontWeight: mobileTab === 'bazi' ? 600 : 400,
            }}
          >
            🔮 八字
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('insight')}
            className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
            style={{
              background: mobileTab === 'insight' ? (isDark ? 'rgba(212,168,67,0.2)' : '#ffffff') : 'transparent',
              color: mobileTab === 'insight' ? gold : textSub,
              fontWeight: mobileTab === 'insight' ? 600 : 400,
            }}
          >
            ✦ 解读
          </button>
        </div>

        {/* 右侧功能 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViralModalOpen(true)}
            aria-label="3:4 爆款报告与赛博经方签"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-md hover:opacity-95 shrink-0"
            style={{
              background: 'linear-gradient(135deg, #e2c08d 0%, #b08a2c 100%)',
              color: '#1a1405',
              border: '1px solid rgba(226,192,141,0.6)',
            }}
          >
            <span>✨</span>
            <span className="hidden sm:inline">3:4 爆款报告 / 经方签</span>
            <span className="sm:hidden">爆款卡</span>
          </button>
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

      {/* 命盘主体工作区：桌面双栏 / 手机单栏切换 */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] gap-5 items-start">
          {/* 左栏：紫微 4x4 命盘 或 八字全息看板 */}
          <div className="w-full min-w-0">
            {/* 1. 紫微命盘视图 */}
            <div className={`${(mobileTab === 'ziwei' || (!isMobileView() && boardMode === 'ziwei')) ? 'block' : 'hidden'}`}>
              <ChartBoard
                chart={chart}
                onPalaceSelect={setSelectedPalace}
              />

              {/* 底部快捷切换条 */}
              <div className="mt-3 p-3 rounded-xl flex items-center justify-between border"
                style={{ background: cardBg, borderColor: cardBorder }}>
                <div className="text-xs pr-2" style={{ color: textSub }}>
                  {selectedPalace ? (
                    <span>已选中 <b style={{ color: gold }}>【{selectedPalace.name}】</b>，在右侧AI面板查看详细剖析</span>
                  ) : (
                    <span>已生成四柱八字元神图谱，随时可切换至八字视图</span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViralModalOpen(true)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer border shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(226,192,141,0.2) 0%, rgba(176,138,44,0.15) 100%)',
                      borderColor: 'rgba(212,168,67,0.4)',
                      color: gold,
                    }}
                  >
                    ✨ 3:4 灵魂卡
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBoardMode('bazi'); setMobileTab('bazi'); }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer border"
                    style={{ borderColor: cardBorder, color: textMain, background: isDark ? 'rgba(255,255,255,0.05)' : '#f8f8f8' }}
                  >
                    看八字 🔮
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileTab('insight')}
                    className="lg:hidden px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #b08a2c, #d4a843)', color: '#08080a' }}
                  >
                    看解读 →
                  </button>
                </div>
              </div>
            </div>

            {/* 2. 生辰八字视图 */}
            <div className={`${(mobileTab === 'bazi' || (!isMobileView() && boardMode === 'bazi')) ? 'block' : 'hidden'}`}>
              <BaZiBoard bazi={bazi} />

              {/* 八字视图底部快捷切换条 */}
              <div className="mt-3 p-3 rounded-xl flex items-center justify-between border"
                style={{ background: cardBg, borderColor: cardBorder }}>
                <div className="text-xs pr-2" style={{ color: textSub }}>
                  日主【{bazi.dayMaster.stemCn}{bazi.dayMaster.elementCn} · {bazi.dayMaster.archetypeCn}】，可切回紫微斗数查十二宫
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViralModalOpen(true)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer border shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(226,192,141,0.2) 0%, rgba(176,138,44,0.15) 100%)',
                      borderColor: 'rgba(212,168,67,0.4)',
                      color: gold,
                    }}
                  >
                    ✨ 3:4 灵魂卡
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBoardMode('ziwei'); setMobileTab('ziwei'); }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer border"
                    style={{ borderColor: cardBorder, color: textMain, background: isDark ? 'rgba(255,255,255,0.05)' : '#f8f8f8' }}
                  >
                    看紫微 ☯
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileTab('insight')}
                    className="lg:hidden px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #b08a2c, #d4a843)', color: '#08080a' }}
                  >
                    看解读 →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右栏：AI 命理解读面板（双擎合参） */}
          <div className={`${mobileTab === 'insight' ? 'block' : 'hidden'} lg:block w-full min-w-0 lg:sticky lg:top-[68px]`}>
            {/* 移动端返回命盘快捷按键 */}
            <div className="lg:hidden mb-2 flex items-center justify-between px-1">
              <span className="text-xs font-medium" style={{ color: gold }}>✦ 东方双擎 · AI深度解盘</span>
              <button
                type="button"
                onClick={() => setMobileTab('ziwei')}
                className="text-xs cursor-pointer"
                style={{ color: textSub }}
              >
                ← 返回命盘
              </button>
            </div>
            <div style={{ height: 'calc(100vh - 120px)', minHeight: '520px', maxHeight: '780px' }}>
              <InsightPanel chart={chart} selectedPalace={selectedPalace} bazi={bazi} />
            </div>
          </div>
        </div>
      </main>

      {/* 3:4 社交裂变爆款海报弹窗 */}
      <ViralModal
        open={viralModalOpen}
        onClose={() => setViralModalOpen(false)}
        chart={chart}
      />
    </div>
  );
}

function isMobileView(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 1024;
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
