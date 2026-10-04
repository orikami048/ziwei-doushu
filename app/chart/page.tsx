'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';
import { useHistory, type HistoryEntry } from '@/lib/ziwei/history';
import { formToBirthInfo } from '@/lib/ziwei/share';
import { useTheme } from '@/components/ThemeProvider';

/**
 * 命盘页 —— 全平台响应式
 * 未起盘：顶部响应式导航 + 手机单列优先表单/桌面双栏 + 最近命盘
 * 已起盘：桌面双栏并列 / 手机端原生级【命盘图 ☯】与【AI深度解读 ✦】无缝切换
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
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [mobileTab, setMobileTab] = useState<'chart' | 'insight'>('chart');

  const { history, save, clear } = useHistory();
  const formRef = useRef<BirthFormState | null>(null);

  const handleSubmit = (info: BirthInfo) => {
    if (formRef.current) save(formRef.current);
    const generated = generateChart(info);
    setChart(generated);
    setMobileTab('chart');
  };

  const handleHistoryClick = (entry: HistoryEntry) => {
    const bi = formToBirthInfo(entry.form);
    if (bi) {
      save(entry.form);
      const generated = generateChart(bi);
      setChart(generated);
      setMobileTab('chart');
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
  if (!chart) {
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
              紫微命盘
            </Link>
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              <NavItem href="/chart" isDark={isDark} active>起盘</NavItem>
              <NavItem href="/heming" isDark={isDark} active={false}>合盘</NavItem>
              <NavItem href="/knowledge" isDark={isDark} active={false}>学术中心</NavItem>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
              {isDark ? '🌙 暗色' : '☀️ 亮色'}
            </button>
            <button
              style={{
                padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: isDark ? 'rgba(255,255,255,0.12)' : '#111111',
                color: isDark ? '#e8eef6' : '#ffffff', fontSize: '11px', fontWeight: 500,
              }}
              className="hidden sm:inline-block"
            >
              升级专业版
            </button>
          </div>
        </nav>

        {/* ── 主体内容（手机单列优先表单 / 桌面双栏） ── */}
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 lg:gap-14 items-start">
          {/* 左栏（桌面）：品牌 + 最近命盘 / 移动端在表单下方展示历史 */}
          <div className="order-2 lg:order-1">
            <div className="hidden lg:block mb-8">
              <div style={{ fontSize: '11px', letterSpacing: '0.3em', color: textFaint, marginBottom: '14px' }}>
                01 / DESTINY ENGINE
              </div>
              <h1 style={{ fontSize: '38px', fontWeight: 700, color: textMain, margin: '0 0 10px', letterSpacing: '0.04em' }}>
                起紫微命盘
              </h1>
              <p style={{ fontSize: '14px', color: textSub, margin: '0 0 32px', lineHeight: 1.6 }}>
                输入出生年月日时，依据倪海夏正宗体系纳音五行局精准推演
              </p>
            </div>

            {/* 最近命盘卡片 */}
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '18px', boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.25)' : '0 4px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>最近命盘</span>
                <span style={{ fontSize: '11px', color: textFaint }}>已保存到本地</span>
              </div>

              {history.length === 0 ? (
                <div style={{ fontSize: '12px', color: textFaint, padding: '10px 0', lineHeight: 1.7 }}>
                  暂无记录<br />起盘后自动保存在此，方便再次查看
                </div>
              ) : (
                <>
                  {history.slice(0, 6).map((entry, i) => {
                    const f = entry.form;
                    const br = f.unknownTime ? 0 : calcBranch(parseInt(f.clockHour) || 0, parseInt(f.clockMinute) || 0, f.longitude || 120);
                    const city = f.city || f.province || '';
                    const gender = f.gender === 'male' ? '男' : '女';
                    return (
                      <div
                        key={entry.id}
                        onClick={() => handleHistoryClick(entry)}
                        style={{
                          padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                          borderBottom: i < Math.min(history.length, 6) - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'}` : 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = accent; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{ fontSize: '12.5px', color: textMain, marginBottom: '3px' }}>
                          <span style={{ color: textFaint, marginRight: '6px', fontSize: '11px' }}>{i + 1}</span>
                          {f.name ? `${f.name} · ` : ''}{f.year}年{f.month}月{f.day}日 · {SHICHEN_NAMES[br]}时
                        </div>
                        <div style={{ fontSize: '11px', color: textSub }}>
                          {[city, gender, timeAgo(entry.savedAt)].filter(Boolean).join(' · ')}
                        </div>
                      </div>
                    );
                  })}
                  {history.length > 0 && (
                    <div style={{ textAlign: 'right', marginTop: '10px' }}>
                      <button
                        onClick={clear}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: textSub }}
                      >
                        清空全部记录
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 右栏（桌面）/ 手机端置顶表单 */}
          <div className="order-1 lg:order-2 w-full">
            {/* 移动端顶部标题 */}
            <div className="lg:hidden mb-4 text-center">
              <div style={{ fontSize: '10px', letterSpacing: '0.28em', color: textFaint, marginBottom: '4px' }}>
                01 / DESTINY ENGINE
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: textMain, margin: '0 0 4px', letterSpacing: '0.03em' }}>
                起紫微命盘
              </h1>
              <p style={{ fontSize: '12px', color: textSub, margin: 0 }}>
                输入出生年月日时，依据倪海夏正宗算法精准推演
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
            onClick={() => { setChart(null); setSelectedPalace(null); }}
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
            {chart.birthInfo.name ? `${chart.birthInfo.name} 的命盘` : '紫微命盘'}
          </span>
        </div>

        {/* 移动端视图切换 Tab（命盘 / AI解读） */}
        <div className="flex lg:hidden items-center p-1 rounded-lg border gap-1"
          style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f0f0f0', borderColor: cardBorder }}>
          <button
            type="button"
            onClick={() => setMobileTab('chart')}
            className="px-3 py-1 rounded-md text-xs font-medium transition-all"
            style={{
              background: mobileTab === 'chart' ? (isDark ? 'rgba(212,168,67,0.2)' : '#ffffff') : 'transparent',
              color: mobileTab === 'chart' ? gold : textSub,
              boxShadow: mobileTab === 'chart' && !isDark ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            ☯ 命盘
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('insight')}
            className="px-3 py-1 rounded-md text-xs font-medium transition-all"
            style={{
              background: mobileTab === 'insight' ? (isDark ? 'rgba(212,168,67,0.2)' : '#ffffff') : 'transparent',
              color: mobileTab === 'insight' ? gold : textSub,
              boxShadow: mobileTab === 'insight' && !isDark ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            ✦ AI解读
          </button>
        </div>

        {/* 右侧功能 */}
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

      {/* 命盘主体工作区：桌面双栏 / 手机单栏切换 */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] gap-5 items-start">
          {/* 左栏：4x4 命盘主图 */}
          <div className={`${mobileTab === 'chart' ? 'block' : 'hidden'} lg:block w-full min-w-0`}>
            <ChartBoard
              chart={chart}
              onPalaceSelect={setSelectedPalace}
            />

            {/* 移动端直达AI解读提示栏 */}
            <div className="lg:hidden mt-3 p-3 rounded-xl flex items-center justify-between border"
              style={{ background: cardBg, borderColor: cardBorder }}>
              <div className="text-xs pr-2" style={{ color: textSub }}>
                {selectedPalace ? (
                  <span>已选中 <b style={{ color: gold }}>【{selectedPalace.name}】</b>，查看详细剖析？</span>
                ) : (
                  <span>点击任意宫位看三方四正，或查看AI深度解读</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMobileTab('insight')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #b08a2c, #d4a843)', color: '#08080a' }}
              >
                查看解读 →
              </button>
            </div>
          </div>

          {/* 右栏：AI 命理解读面板 */}
          <div className={`${mobileTab === 'insight' ? 'block' : 'hidden'} lg:block w-full min-w-0 lg:sticky lg:top-[68px]`}>
            {/* 移动端返回命盘快捷按键 */}
            <div className="lg:hidden mb-2 flex items-center justify-between px-1">
              <span className="text-xs font-medium" style={{ color: gold }}>✦ 倪海夏体系 · AI深度解盘</span>
              <button
                type="button"
                onClick={() => setMobileTab('chart')}
                className="text-xs cursor-pointer"
                style={{ color: textSub }}
              >
                ← 返回命盘
              </button>
            </div>
            <div style={{ height: 'calc(100vh - 120px)', minHeight: '520px', maxHeight: '780px' }}>
              <InsightPanel chart={chart} selectedPalace={selectedPalace} />
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
