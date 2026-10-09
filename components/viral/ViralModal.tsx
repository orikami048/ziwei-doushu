'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { resolveKarmaQuest, resolveCelestialTonic } from '@/lib/ziwei/viral-resolver';
import KarmaQuestCard from './KarmaQuestCard';
import CelestialTonicCard from './CelestialTonicCard';
import SocialCopySnippet from './SocialCopySnippet';

interface ViralModalProps {
  open: boolean;
  onClose: () => void;
  chart: ZiweiChart | null;
}

export default function ViralModal({ open, onClose, chart }: ViralModalProps) {
  const [activeTab, setActiveTab] = useState<'karma' | 'tonic' | 'copy'>('karma');
  const [downloading, setDownloading] = useState(false);

  if (!chart) return null;

  const karmaData = resolveKarmaQuest(chart);
  const tonicData = resolveCelestialTonic(chart);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const targetId = activeTab === 'tonic' ? 'celestial-tonic-card' : 'karma-quest-card';
      const node = document.getElementById(targetId);

      if (!node) {
        alert('海报元素未就绪，请稍后重试');
        return;
      }

      const canvas = await html2canvas(node, {
        scale: 2, // 2x 分辨率，保证 1080x1440 级别高清
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const dataURL = canvas.toDataURL('image/png');
      const filename =
        activeTab === 'tonic'
          ? `疾厄经方签_3比4本命海报_${Date.now()}.png`
          : `化忌通关令_3比4灵魂海报_${Date.now()}.png`;

      const link = document.createElement('a');
      link.href = dataURL;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('下载 3:4 海报失败:', err);
      alert('海报生成失败，建议在页面直接长按或截图保存');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl bg-neutral-900 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
          >
            {/* ── 顶部栏 ── */}
            <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-base font-bold">✨ 星宿本命局</span>
                <span className="text-xs text-neutral-400 font-medium">
                  3:4 社交裂变爆款海报 · KARMA-MATRIX
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center text-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* ── Tab 切换器 ── */}
            <div className="px-5 py-2.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-950 border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('karma')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'karma'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  🔮 化忌通关令 (黑金)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('tonic')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'tonic'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  🍵 疾厄经方签 (宋韵)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('copy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'copy'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  📝 小红书文案库
                </button>
              </div>

              {/* 操作按钮区 */}
              {activeTab !== 'copy' && (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #e2c08d 0%, #b08a2c 100%)',
                    color: '#1a1405',
                  }}
                >
                  {downloading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>正在渲染超清海报...</span>
                    </>
                  ) : (
                    <>
                      <span>📥</span>
                      <span>下载 3:4 高清海报</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* ── 内容渲染视窗 ── */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-950/40 flex justify-center items-center">
              {activeTab === 'karma' && (
                <div className="transform scale-[0.92] sm:scale-100 origin-top">
                  <KarmaQuestCard data={karmaData} />
                </div>
              )}

              {activeTab === 'tonic' && (
                <div className="transform scale-[0.92] sm:scale-100 origin-top">
                  <CelestialTonicCard data={tonicData} />
                </div>
              )}

              {activeTab === 'copy' && (
                <div className="w-full max-w-xl">
                  <SocialCopySnippet karmaData={karmaData} tonicData={tonicData} />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
