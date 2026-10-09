'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BirthInfo } from '@/lib/ziwei/types';
import { SHICHEN } from '@/lib/ziwei/constants';
import { useTheme } from '@/components/ThemeProvider';
import { PROVINCES } from '@/lib/ziwei/cities';

export interface BirthFormState {
  name: string;
  year: string;
  month: string;
  day: string;
  clockHour: string;
  clockMinute: string;
  unknownTime: boolean;
  province: string;
  city: string;
  longitude: number;
  gender: 'male' | 'female';
}

interface BirthFormProps {
  onSubmit: (info: BirthInfo) => void;
  loading?: boolean;
  initialData?: Partial<BirthFormState>;
  onFormSave?: (data: BirthFormState) => void;
  /** 隐藏内部「立即起盘」按钮（合盘等场景由父级统一触发） */
  hideSubmit?: boolean;
}

const SHICHEN_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/** 根据北京时间 + 经度计算真太阳时时辰支 (0-11) */
function calcTrueSolarBranch(clockHour: number, clockMinute: number, longitude: number): number {
  const clockMins = clockHour * 60 + clockMinute;
  const offset = (longitude - 120) * 4;
  const solar = ((clockMins + offset) % 1440 + 1440) % 1440;
  if (solar >= 1380 || solar < 60) return 0;
  return Math.floor((solar - 60) / 120) + 1;
}

/** 检查日期是否合法 */
function isValidDate(y: number, m: number, d: number): boolean {
  if (!y || !m || !d) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export default function BirthForm({ onSubmit, loading, initialData, onFormSave, hideSubmit }: BirthFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [form, setForm] = useState<BirthFormState>({
    name: initialData?.name ?? '',
    year: initialData?.year ?? '',
    month: initialData?.month ?? '',
    day: initialData?.day ?? '',
    clockHour: initialData?.clockHour ?? '8',
    clockMinute: initialData?.clockMinute ?? '0',
    unknownTime: initialData?.unknownTime ?? false,
    province: initialData?.province ?? '',
    city: initialData?.city ?? '',
    longitude: initialData?.longitude ?? 120,
    gender: initialData?.gender ?? 'male',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [lunarHint, setLunarHint] = useState(false);

  // 表单状态变化时实时同步给父级（合盘等场景下父级靠这个收集双方数据）
  useEffect(() => {
    onFormSave?.({ ...form });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const cityList = useMemo(() => {
    const prov = PROVINCES.find(p => p.name === form.province);
    return prov ? prov.cities : [];
  }, [form.province]);

  const branch = useMemo(() => {
    if (form.unknownTime) return 0;
    return calcTrueSolarBranch(
      parseInt(form.clockHour) || 0,
      parseInt(form.clockMinute) || 0,
      form.longitude,
    );
  }, [form.clockHour, form.clockMinute, form.longitude, form.unknownTime]);

  const offsetMin = Math.round((form.longitude - 120) * 4);
  const shichenInfo = SHICHEN[branch];

  // ─── 校验逻辑 ───────────────────────────────────────────
  const y = parseInt(form.year) || 0;
  const m = parseInt(form.month) || 0;
  const d = parseInt(form.day) || 0;

  const errors = {
    year: !form.year ? '请选择出生年份'
      : y < 1900 || y > 2026 ? '年份范围：1900–2026'
      : '',
    month: !form.month ? '请选择月份' : '',
    day: !form.day ? '请选择日期'
      : form.year && form.month && !isValidDate(y, m, d) ? `${m}月没有${d}日`
      : '',
  };
  const hasError = Object.values(errors).some(Boolean);

  const handleProvince = (prov: string) => {
    const provData = PROVINCES.find(p => p.name === prov);
    const firstCity = provData?.cities[0];
    setForm({ ...form, province: prov, city: firstCity?.name || '', longitude: firstCity?.longitude ?? 120 });
  };

  const handleCity = (cityName: string) => {
    const prov = PROVINCES.find(p => p.name === form.province);
    const cityData = prov?.cities.find(c => c.name === cityName);
    setForm({ ...form, city: cityName, longitude: cityData?.longitude ?? 120 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ year: true, month: true, day: true });
    if (hasError) return;
    onFormSave?.({ ...form });
    onSubmit({ year: y, month: m, day: d, hour: branch, gender: form.gender, name: form.name || undefined, province: form.province || undefined, city: form.city || undefined, longitude: form.province ? form.longitude : undefined });
  };

  const switchCalendar = (t: 'solar' | 'lunar') => {
    setCalendarType(t);
    if (t === 'lunar') {
      setLunarHint(true);
      setTimeout(() => setLunarHint(false), 2600);
    }
  };

  // ─── 样式变量（白色简洁风，参考新版 UI） ─────────────────
  const cardBg = isDark ? 'rgba(13,22,42,0.92)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.14)' : '#e8e8e8';
  const labelClr = isDark ? '#cbd5e1' : '#4b5563';
  const inputBg = isDark ? '#0f172a' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.22)' : '#d1d5db';
  const inputClr = isDark ? '#f8fafc' : '#0f172a';
  const focusBorder = isDark ? '#f59e0b' : '#c8a24a';
  const errorClr = isDark ? '#f87171' : '#dc2626';
  const panelBg = isDark ? '#1e293b' : '#f3f4f6';
  const panelBorder = isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb';
  const goldText = isDark ? '#fcd34d' : '#b08a2c';
  const mutedClr = isDark ? '#94a3b8' : '#6b7280';

  const inputStyle = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: inputClr,
    borderRadius: '10px',
    padding: '9px 10px',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  } as React.CSSProperties;

  const selectStyle = {
    ...inputStyle,
    colorScheme: isDark ? 'dark' : 'light',
    backgroundColor: inputBg,
    color: inputClr,
    cursor: 'pointer',
  } as React.CSSProperties;

  const errorInputStyle = { ...inputStyle, borderColor: errorClr };
  const errorSelectStyle = { ...selectStyle, borderColor: errorClr };

  function FieldError({ msg }: { msg: string }) {
    return (
      <AnimatePresence>
        {msg && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            style={{ color: errorClr, fontSize: '11px', marginTop: '4px' }}
          >
            ✕ {msg}
          </motion.p>
        )}
      </AnimatePresence>
    );
  }

  const showErr = (field: string) => touched[field] || submitAttempted;

  const tabBase = {
    flex: 1, padding: '5px 0', fontSize: '12px', borderRadius: '7px',
    cursor: 'pointer', transition: 'all 0.2s', border: 'none', textAlign: 'center' as const,
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-7 rounded-2xl w-full"
      style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.35)' : '0 6px 28px rgba(0,0,0,0.05)' }}
    >
      {/* 标题 */}
      <h3 style={{ color: goldText, fontSize: '13px', letterSpacing: '0.35em', textAlign: 'center', marginBottom: '18px', fontWeight: 500 }}>
        —— 输入生辰八字 ——
      </h3>

      {/* ── 姓名 ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: labelClr, marginBottom: '6px' }}>姓名（可选）</label>
        <input
          type="text"
          placeholder="请输入姓名"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = focusBorder; e.target.style.boxShadow = `0 0 0 3px ${isDark ? 'rgba(212,168,67,0.12)' : 'rgba(200,162,74,0.12)'}`; }}
          onBlur={e => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
        />
      </div>

      {/* ── 出生日期（公历/农历切换） ── */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{ fontSize: '12px', color: labelClr }}>出生日期</label>
          <div style={{ display: 'flex', background: panelBg, borderRadius: '8px', padding: '2px', border: `1px solid ${panelBorder}` }}>
            {(['solar', 'lunar'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => switchCalendar(t)}
                style={{
                  ...tabBase,
                  background: calendarType === t ? (isDark ? 'rgba(212,168,67,0.2)' : '#ffffff') : 'transparent',
                  color: calendarType === t ? goldText : mutedClr,
                  fontWeight: calendarType === t ? 600 : 400,
                  boxShadow: calendarType === t ? (isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.08)') : 'none',
                }}
              >
                {t === 'solar' ? '公历' : '农历'}
              </button>
            ))}
          </div>
        </div>

        {calendarType === 'lunar' ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="lunar-hint"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '18px 12px', borderRadius: '10px', textAlign: 'center',
                fontSize: '12px', color: goldText,
                background: isDark ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.06)',
                border: `1px dashed ${isDark ? 'rgba(212,168,67,0.3)' : 'rgba(200,162,74,0.35)'}`,
                minHeight: '112px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {lunarHint ? '农历输入暂未开放，请使用公历' : '农历输入暂未开放，请使用公历'}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <div>
              <select
                value={form.year}
                onChange={e => { setForm({ ...form, year: e.target.value }); setTouched(t => ({ ...t, year: true })); }}
                style={showErr('year') && errors.year ? errorSelectStyle : selectStyle}
                required
              >
                <option value="" style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#94a3b8' : '#6b7280' }}>年份</option>
                {Array.from({ length: 127 }, (_, i) => 2026 - i).map(yr => (
                  <option key={yr} value={String(yr)} style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>{yr}</option>
                ))}
              </select>
              <FieldError msg={showErr('year') ? errors.year : ''} />
            </div>
            <div>
              <select
                value={form.month}
                onChange={e => { setForm({ ...form, month: e.target.value }); setTouched(t => ({ ...t, month: true })); }}
                style={showErr('month') && errors.month ? errorSelectStyle : selectStyle}
                required
              >
                <option value="" style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#94a3b8' : '#6b7280' }}>月份</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(mo => (
                  <option key={mo} value={String(mo)} style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>{mo}</option>
                ))}
              </select>
              <FieldError msg={showErr('month') ? errors.month : ''} />
            </div>
            <div>
              <select
                value={form.day}
                onChange={e => { setForm({ ...form, day: e.target.value }); setTouched(t => ({ ...t, day: true })); }}
                style={showErr('day') && errors.day ? errorSelectStyle : selectStyle}
                required
              >
                <option value="" style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#94a3b8' : '#6b7280' }}>日期</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(dy => (
                  <option key={dy} value={String(dy)} style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>{dy}</option>
                ))}
              </select>
              <FieldError msg={showErr('day') ? errors.day : ''} />
            </div>
          </div>
        )}
      </div>

      {/* ── 出生地点 ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: labelClr, marginBottom: '6px' }}>出生地点（用于真太阳时校正）</label>
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <select
            value={form.province}
            onChange={e => handleProvince(e.target.value)}
            style={selectStyle}
            onFocus={e => { e.target.style.borderColor = focusBorder; }}
            onBlur={e => { e.target.style.borderColor = inputBorder; }}
          >
            <option value="" style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#94a3b8' : '#6b7280' }}>选择出生地</option>
            {PROVINCES.map(p => (
              <option key={p.name} value={p.name} style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>{p.name}</option>
            ))}
          </select>
          <select
            value={form.city}
            onChange={e => handleCity(e.target.value)}
            disabled={!form.province}
            style={{ ...selectStyle, opacity: form.province ? 1 : 0.45 }}
            onFocus={e => { e.target.style.borderColor = focusBorder; }}
            onBlur={e => { e.target.style.borderColor = inputBorder; }}
          >
            <option value="" style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#94a3b8' : '#6b7280' }}>{form.province ? '城市' : '先选省份'}</option>
            {cityList.map(c => (
              <option key={c.name} value={c.name} style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>{c.name}</option>
            ))}
          </select>
        </div>
        <AnimatePresence mode="wait">
          {form.province ? (
            <motion.p
              key="location-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '11px', color: isDark ? 'rgba(180,210,235,0.85)' : '#a0a0a0', marginTop: '5px' }}
            >
              {form.city || '（请选择城市）'} · 经度 {form.longitude.toFixed(1)}°E · 时差 {offsetMin > 0 ? '+' : ''}{offsetMin} 分钟
            </motion.p>
          ) : (
            <motion.p
              key="location-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '11px', color: mutedClr, marginTop: '5px' }}
            >
              * 倪海夏批命用真太阳时，建议填写出生地以自动校正时辰
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── 出生时间 ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: labelClr, marginBottom: '6px' }}>出生时间（北京时间）</label>
        <div style={{ borderRadius: '12px', padding: '12px', background: panelBg, border: `1px solid ${panelBorder}`, opacity: form.unknownTime ? 0.45 : 1, pointerEvents: form.unknownTime ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2">
            <select
              value={form.clockHour}
              onChange={e => setForm({ ...form, clockHour: e.target.value })}
              style={selectStyle}
            >
              {Array.from({ length: 24 }, (_, i) => i).map(h => (
                <option key={h} value={String(h)} style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>{h.toString().padStart(2, '0')} 时</option>
              ))}
            </select>
            <select
              value={form.clockMinute}
              onChange={e => setForm({ ...form, clockMinute: e.target.value })}
              style={selectStyle}
            >
              {Array.from({ length: 60 }, (_, i) => i).map(min => (
                <option key={min} value={String(min)} style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>{min.toString().padStart(2, '0')} 分</option>
              ))}
            </select>
          </div>
          {/* 时辰结果 */}
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <span style={{ fontSize: '11px', color: mutedClr }}>真太阳时 → {form.clockHour.padStart(2, '0')}:{form.clockMinute.padStart(2, '0')} · </span>
            <span style={{ fontSize: '15px', color: goldText, fontWeight: 600, letterSpacing: '0.08em' }}>
              {SHICHEN_NAMES[branch]}时
            </span>
            {shichenInfo && (
              <span style={{ fontSize: '11px', color: mutedClr, marginLeft: '4px' }}>
                ({shichenInfo.range})
              </span>
            )}
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.unknownTime}
            onChange={e => setForm({ ...form, unknownTime: e.target.checked })}
            style={{ width: '14px', height: '14px', borderRadius: '4px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '11px', color: mutedClr }}>
            不知道出生时间，以子时（23:00–01:00）起盘
          </span>
        </label>
      </div>

      {/* ── 性别 ── */}
      <div style={{ marginBottom: '22px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: labelClr, marginBottom: '6px' }}>性别</label>
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {(['male', 'female'] as const).map(g => {
            const active = form.gender === g;
            const isMale = g === 'male';
            const accent = isMale ? '37,99,235' : '225,29,72';
            return (
              <motion.button
                key={g}
                type="button"
                onClick={() => setForm({ ...form, gender: g })}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 500,
                  border: `1px solid ${active ? `rgba(${accent},0.55)` : inputBorder}`,
                  background: active ? `rgba(${accent},0.06)` : inputBg,
                  color: active ? `rgba(${accent},0.95)` : (isDark ? 'rgba(190,205,225,0.7)' : '#999999'),
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                {isMale ? '♂ 男' : '♀ 女'}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── 提交按钮 ── */}
      {!hideSubmit && <motion.button
        type="submit"
        disabled={loading}
        whileHover={loading ? {} : { scale: 1.01 }}
        whileTap={loading ? {} : { scale: 0.98 }}
        style={{
          width: '100%',
          padding: '13px 16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: loading
            ? (isDark ? 'rgba(212,168,67,0.15)' : 'rgba(176,138,44,0.15)')
            : (isDark
              ? 'linear-gradient(135deg, rgba(180,130,40,0.9), rgba(240,200,80,0.9))'
              : 'linear-gradient(135deg, #b08a2c, #c9a24a)'),
          color: loading ? (isDark ? 'rgba(212,168,67,0.4)' : 'rgba(140,110,30,0.4)') : (isDark ? '#08080a' : '#ffffff'),
          boxShadow: loading ? 'none' : (isDark ? '0 4px 20px rgba(212,168,67,0.2)' : '0 4px 16px rgba(176,138,44,0.22)'),
          transition: 'all 0.2s',
        }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }}
            />
            紫微起盘中…
          </span>
        ) : '立即起盘 · 查看命盘解析'}
      </motion.button>}
    </motion.form>
  );
}
