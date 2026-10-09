/**
 * KARMA-MATRIX: 星宿本命局 3:4 社交裂变卡片系统回归测试
 * 运行: npx tsx scripts/regression/viral-card-matrix.test.ts
 */

import { generateChart } from '../../lib/ziwei/algorithm';
import {
  STAR_ARCHETYPES,
  KARMA_PALACE_QUESTS,
  CELESTIAL_TONIC_PRESETS,
  resolveKarmaQuest,
  resolveCelestialTonic,
  formatBirthLabel,
} from '../../lib/ziwei/viral-resolver';
import type { BirthInfo, ZiweiChart } from '../../lib/ziwei/types';

let failures = 0;
const fail = (msg: string) => {
  console.error(`  ✗ ${msg}`);
  failures++;
};
const ok = (msg: string) => console.log(`  ✓ ${msg}`);

console.log('\n=== KARMA-MATRIX 回归测试套件 ===\n');

// 1. 验证十四主星 + 命无正曜原型完整性
console.log('1. 验证主星原型字典与五维雷达数值...');
const requiredStars = [
  '七杀', '破军', '廉贞', '贪狼', '紫微', '天府', '武曲', '天相',
  '太阳', '巨门', '天机', '太阴', '天梁', '天同', '命无正曜',
];

for (const star of requiredStars) {
  const item = STAR_ARCHETYPES[star];
  if (!item) {
    fail(`缺失主星原型: ${star}`);
    continue;
  }
  if (!item.archetypeTitle || item.archetypeTitle.length < 3) {
    fail(`${star} 原型称号过短`);
  }
  if (!item.soulQuote || item.soulQuote.length < 5) {
    fail(`${star} 灵魂金句缺失或过短`);
  }
  if (!Array.isArray(item.auraKeywords) || item.auraKeywords.length < 3) {
    fail(`${star} 气场标签少于 3 个`);
  }
  const dims = item.fiveDimensions;
  if (!dims) {
    fail(`${star} 缺失五维雷达数据`);
  } else {
    for (const k of ['ambition', 'resilience', 'intuition', 'empathyCost', 'freedomIndex'] as const) {
      if (typeof dims[k] !== 'number' || dims[k] < 0 || dims[k] > 100) {
        fail(`${star} 五维雷达维度 ${k} 超出 0-100 范围: ${dims[k]}`);
      }
    }
  }
}
ok(`15 个核心主星及命无正曜原型全部校验通过！`);

// 2. 验证十二宫化忌通关剧本库完整性
console.log('\n2. 验证十二宫化忌通关剧本库...');
const requiredGongs = [
  '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
  '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫',
];

for (const gong of requiredGongs) {
  const q = KARMA_PALACE_QUESTS[gong];
  if (!q) {
    fail(`缺失宫位通关剧本: ${gong}`);
    continue;
  }
  if (!q.questTitle || !q.karmaPainPoint || !q.reframeInsight || !q.clearingPassword) {
    fail(`${gong} 通关剧本字段不完整`);
  }
  if (!q.destinedAlly || !q.karmicNemesis) {
    fail(`${gong} 社交羁绊匹配字段缺失`);
  }
}
ok(`十二宫化忌通关剧本与社交羁绊全部校验通过！`);

// 3. 验证疾厄宫×汉唐经方茶饮映射
console.log('\n3. 验证疾厄经方签与汉唐经方联动预设...');
if (CELESTIAL_TONIC_PRESETS.length < 5) {
  fail(`疾厄经方预设少于 5 组 (当前: ${CELESTIAL_TONIC_PRESETS.length})`);
}
for (const preset of CELESTIAL_TONIC_PRESETS) {
  const p = preset.prescriptions;
  if (!p.formulaName || !p.modernTonicName || !p.sourceBook) {
    fail(`经方基本信息不全: ${p.formulaName}`);
  }
  if (!Array.isArray(p.dailyHerbalTeaItems) || p.dailyHerbalTeaItems.length !== 4) {
    fail(`经方 ${p.formulaName} 轻养茶配方必须严格为 4 味药（君臣佐使）`);
  }
  for (const item of p.dailyHerbalTeaItems) {
    if (!['君', '臣', '佐', '使'].includes(item.role)) {
      fail(`经方 ${p.formulaName} 药味 ${item.herb} 角色非法: ${item.role}`);
    }
  }
  if (!p.brewingMethod || !p.mindsetState || !preset.sealText) {
    fail(`冲泡法/心法/印章文案缺失: ${p.formulaName}`);
  }
}
ok(`疾厄经方签 5 大脏腑体质与君臣佐使药茶配方校验通过！`);

// 4. 动态采样排盘端到端契约校验
console.log('\n4. 针对动态排盘采样进行端到端契约断言...');
const sampleBirths: BirthInfo[] = [
  { year: 1988, month: 4, day: 15, hour: 3, gender: 'male' },
  { year: 1995, month: 11, day: 24, hour: 8, gender: 'female' },
  { year: 2002, month: 7, day: 9, hour: 0, gender: 'female' },
  { year: 1976, month: 2, day: 4, hour: 11, gender: 'male' },
];

for (const b of sampleBirths) {
  const chart: ZiweiChart = generateChart(b);
  const karmaCard = resolveKarmaQuest(chart);
  const tonicCard = resolveCelestialTonic(chart);

  if (!karmaCard.questTitle || !karmaCard.mainStarArchetype) {
    fail(`排盘解析 karmaCard 失败: ${JSON.stringify(b)}`);
  }
  if (!tonicCard.prescriptions.formulaName || !tonicCard.meridianTension) {
    fail(`排盘解析 tonicCard 失败: ${JSON.stringify(b)}`);
  }
  const label = formatBirthLabel(chart);
  if (!label || label.length < 8) {
    fail(`排盘时间格式化异常: ${label}`);
  }
}
ok(`动态采样排盘端到端契约断言全部通过！`);

if (failures > 0) {
  console.error(`\n❌ 测试失败，共 ${failures} 处断言未通过\n`);
  process.exit(1);
} else {
  console.log('\n🎉 KARMA-MATRIX 社交裂变特性所有测试 100% 绿标通过！\n');
}
