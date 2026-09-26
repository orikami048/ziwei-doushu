'use client';
import { useState, useRef, useEffect } from 'react';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import TimeNav, { type TimeView } from '@/components/TimeNav';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';
import { useHistory, type HistoryEntry } from '@/lib/ziwei/history';
import { formToBirthInfo } from '@/lib/ziwei/share';
import { useTheme } from '@/components/ThemeProvider';

/**
 * 命盘页 —— 新版 UI（参照起盘设计稿）
 * 未起盘：顶部导航 + 左侧品牌区/最近命盘 + 右侧生辰表单
 * 已起盘：命盘 + 解读
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [view, setView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState(() => new Date().getFullYear());

  const { history, save, clear } = useHistory();
  const formRef = useRef<BirthFormState | null>(null);

  const handleSubmit = (info: BirthInfo) => {
    if (formRef.current) save(formRef.current);
    setChart(generateChart(info));
  };

  const handleHistoryClick = (entry: HistoryEntry) => {
    const bi = formToBirthInfo(entry.form);
    if (bi) {
      save(entry.form);
      setChart(generateChart(bi));
    }
  };

  // ── 未起盘：参考设计稿的双栏 UI ──
  if (!chart) {
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

    return (
      <div style={{ minHeight: '100vh', background: bg, fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' }}>
        {/* ── 顶部导航 ── */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', height: '52px',
          background: navBg, borderBottom: `1px solid ${navBorder}`,
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '26px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.12em', color: gold }}>紫微命盘</span>
            <NavItem href="/knowledge" isDark={isDark} active={false}>学术中心</NavItem>
            <NavItem href="/chart" isDark={isDark} active>起盘</NavItem>
            <NavItem href="/heming" isDark={isDark} active={false}>合盘</NavItem>
            <NavItem href="#" isDark={isDark} active={false}>账户</NavItem>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '12px', color: textSub, cursor: 'pointer' }}>
              <b style={{ color: gold }}>中</b> / EN
            </span>
            <button style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: isDark ? 'rgba(255,255,255,0.12)' : '#111111',
              color: isDark ? '#e8eef6' : '#ffffff', fontSize: '12px', fontWeight: 500,
            }}>
              升级专业版
            </button>
          </div>
        </nav>

        {/* ── 主体双栏 ── */}
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '56px 24px 80px', display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)', gap: '56px', alignItems: 'start' }}>
          {/* 左栏：品牌 + 最近命盘 */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.3em', color: textFaint, marginBottom: '18px' }}>
              01 / DESTINY ENGINE
            </div>
            <h1 style={{ fontSize: '40px', fontWeight: 700, color: textMain, margin: '0 0 12px', letterSpacing: '0.04em' }}>
              起紫微命盘
            </h1>
            <p style={{ fontSize: '14px', color: textSub, margin: '0 0 44px', lineHeight: 1.7 }}>
              输入出生年月日时
            </p>

            {/* 最近命盘 */}
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '20px', boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.25)' : '0 4px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
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
                          {f.year}年{f.month}月{f.day}日·{SHICHEN_NAMES[br]}时
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
                        清空全部
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 右栏：表单 */}
          <BirthForm
            onSubmit={handleSubmit}
            onFormSave={(f) => { formRef.current = f; }}
          />
        </div>
      </div>
    );
  }

  // ── 已起盘：命盘 + 解读 ──
  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>
      <button
        type="button"
        onClick={() => { setChart(null); setSelectedPalace(null); }}
        style={{
          marginBottom: 16, padding: '6px 14px', cursor: 'pointer',
          border: '1px solid #ccc', borderRadius: 8, background: 'transparent',
        }}
      >
        ← 重新起盘
      </button>

      <TimeNav
        chart={chart}
        view={view}
        liunianYear={liunianYear}
        onViewChange={setView}
        onYearChange={setLiunianYear}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 380px)',
          gap: 20, marginTop: 16, alignItems: 'start',
        }}
      >
        <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
        <InsightPanel chart={chart} selectedPalace={selectedPalace} />
      </div>
    </main>
  );
}

function NavItem({ href, children, active, isDark }: { href: string; children: React.ReactNode; active: boolean; isDark: boolean }) {
  const gold = isDark ? '#d4a843' : '#b08a2c';
  const text = isDark ? '#9db0d0' : '#666666';
  const activeText = isDark ? '#e8eef6' : '#1a1a1a';
  return (
    <a
      href={href}
      onClick={href === '#' ? (e) => e.preventDefault() : undefined}
      style={{
        fontSize: '13px', textDecoration: 'none', color: active ? activeText : text,
        fontWeight: active ? 600 : 400,
        borderBottom: active ? `2px solid ${gold}` : '2px solid transparent',
        padding: '2px 0', cursor: 'pointer',
      }}
    >
      {children}
    </a>
  );
}
