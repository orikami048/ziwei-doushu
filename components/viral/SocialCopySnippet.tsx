'use client';

import React, { useState } from 'react';
import type { KarmaQuestCardData, CelestialTonicScriptData } from '@/types/viral-card';

interface SocialCopySnippetProps {
  karmaData: KarmaQuestCardData;
  tonicData: CelestialTonicScriptData;
}

export default function SocialCopySnippet({ karmaData, tonicData }: SocialCopySnippetProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const templates = [
    {
      title: '模版 1 · 化忌释怀反转向 (小红书爆款点赞收割机)',
      tag: '高赞释怀',
      text: `原来我这几年受的罪，全是紫微斗数这颗「${karmaData.karmaStar}」在搞鬼😭...

算了一圈星盘八字，终于在紫微斗数里彻底释怀了！
我的生年化忌居然在【${karmaData.karmaGong}】...
难怪一直觉得：${karmaData.karmaPainPoint}

测完才知道：化忌根本不是倒霉，而是这辈子你灵魂自己选的「地狱通关副本」！
你在哪个宫化忌，宇宙就非要逼你在哪里吃满苦头，然后逼你修成绝世神功！
【通关密码】：${karmaData.clearingPassword}

天生贵人：${karmaData.destinedAlly}
远离消耗：${karmaData.karmicNemesis}

建议所有经常内耗焦虑的姐妹都去打一下自己的灵魂卡，真的瞬间和自己和解了🕊️
评论区留下你的命宫主星，我帮你看看你的通关副本是哪个！

#紫微斗数 #化忌 #逆风翻盘 #精神内耗 #玄学治愈 #大女主剧本 #命理探秘`,
    },
    {
      title: '模版 2 · 赛博茶饮经方签向 (白领回血/朋克养生爆款)',
      tag: '养生破圈',
      text: `同仁堂老中医都愣了！我的紫微疾厄宫居然给我开了杯「${tonicData.prescriptions.modernTonicName}」🍵

每天上班如上坟、白天脑雾失眠、晚上刷手机到两点？
朋友推给我的这个「紫微疾厄宫 × 汉唐经方」神仙联动卡，直接把我现在的状态扒得底裤都不剩！
疾厄宫【${tonicData.jiEGongStar}】直接对应【${tonicData.meridianTension}】！
现在状态完全命中：“${tonicData.symptomVibe}”

顺带根据张仲景经典经方【${tonicData.prescriptions.formulaName}】给我开了个赛博茶饮方：
🍵 配料：${tonicData.prescriptions.dailyHerbalTeaItems.map(i => `${i.herb}${i.dose}`).join(' + ')}
💡 冲泡指南：${tonicData.prescriptions.brewingMethod}
✨ 倪师心法：“${tonicData.prescriptions.mindsetState}”

照着抓了泡焖烧杯，喝了两天整个人真的轻松透亮了！
现在的国学产品已经卷到这种程度了吗？这也太懂打工人了吧！

#中药奶茶 #${tonicData.prescriptions.formulaName} #经方养生 #打工人回血 #紫微斗数看健康 #赛博朋克养生`,
    },
    {
      title: '模版 3 · 灵魂人设搞钱向 (大女主/天花板剧本)',
      tag: '搞钱人设',
      text: `天生大女主觉醒！我的紫微命宫原型居然是【${karmaData.mainStarArchetype.archetypeTitle}】✨

测完紫微命盘直接被戳中灵魂：
“${karmaData.mainStarArchetype.soulQuote}”

我的核心气场：${karmaData.mainStarArchetype.auraKeywords.map(k => `#${k}`).join(' ')}
搞钱野心指数直接飙到 ${karmaData.mainStarArchetype.fiveDimensions.ambition}%，逆商高达 ${karmaData.mainStarArchetype.fiveDimensions.resilience}%！
人生主线直接锁定【${karmaData.questTitle}】！

别再当老好人内耗自己了，按自己的出厂配置野蛮生长才是正解。
快来看看你的灵魂原型是什么！

#紫微斗数 #大女主 #搞钱女孩 #人设标签 #反内耗 #逆商天花板`,
    },
  ];

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2500);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2500);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold text-sm">📝 小红书/即刻爆款文案库</span>
          <span className="text-[11px] text-neutral-400">(一键复制即可发布带货种草)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {templates.map((tpl, i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl border border-neutral-700/80 bg-neutral-900/70 hover:border-amber-400/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-200">
                  {tpl.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  {tpl.tag}
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed line-clamp-3 whitespace-pre-line font-mono bg-neutral-950/50 p-2 rounded-lg border border-neutral-800">
                {tpl.text}
              </p>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => handleCopy(tpl.text, i)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
                style={{
                  background: copiedIndex === i ? '#10b981' : 'linear-gradient(135deg, #d4a843 0%, #b08a2c 100%)',
                  color: '#ffffff',
                }}
              >
                {copiedIndex === i ? (
                  <>
                    <span>✓</span>
                    <span>已复制文案到剪贴板！</span>
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    <span>一键复制该文案</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
