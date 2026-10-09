import type { ZiweiChart } from '@/lib/ziwei/types';
import type { BaZiChart } from '@/lib/bazi/types';
import { detectPatterns } from '@/lib/ziwei/patterns';

/**
 * 离线/本地高精度命理智能推演算法（双端通用）
 */
export function generateLocalInterpretation(chart: ZiweiChart, bazi: BaZiChart | undefined, prompt: string): string {
  const mingGong = chart.palaces[chart.mingGongBranch];
  const majorStars = mingGong ? mingGong.stars.filter(s => s.type === 'major') : [];
  const starNames = majorStars.map(s => s.name).join('、') || '命无正曜（借对宫）';
  const patterns = detectPatterns(chart);
  const excellentPatterns = patterns.filter(p => p.level === 'excellent' || p.level === 'good');

  const currentDaXian = chart.daXians[chart.currentDaXianIndex];
  const currentDaXianPalace = currentDaXian ? chart.palaces[currentDaXian.palaceBranch] : undefined;

  // 1. 双擎合参专属分析
  if (prompt.includes('双引擎') || prompt.includes('双擎合参') || prompt.includes('交叉合参')) {
    const dayMasterDesc = bazi ? `${bazi.dayMaster.stemCn}${bazi.dayMaster.elementCn}（${bazi.dayMaster.archetypeCn}）` : '日主五行';
    const baziPillarsStr = bazi ? Object.values(bazi.pillars).map(p => `${p.nameCn}: ${p.stemCn}${p.branchCn}`).join('，') : (chart.lunarInfo.fourPillars?.join(' ') ?? '');
    const wuxingStrong = bazi ? bazi.dominantElements.map(e => bazi.wuxingScores[e].elementCn).join('、') : '火金';
    const wuxingFavorable = bazi ? bazi.supportingElements.map(e => bazi.wuxingScores[e].elementCn).join('、') : '水木';

    return `**【能量底色与灵魂原型】**
八字本原以${dayMasterDesc}为灵魂底色，四柱呈现【${baziPillarsStr}】。日主先天自带${bazi ? bazi.dayMaster.essenceCn : '坚毅开拓与深邃智慧'}。在微观行为模式上，紫微命宫坐【${starNames}】（${chart.wuxingJuName}），二者交融构成了“内在极具原则操守、外在兼具敏锐决断”的独特全息人格。

**【天赋驱动与事业变现】**
从八字十神格局来看，命局中${wuxingStrong}能量充盈，天生具备敏锐的商业洞察与开拓魄力；结合紫微斗数官禄宫与财帛宫星曜联动，你在战略统筹、专业深耕或开创性项目中具有显著的变现优势，适宜以专业壁垒和个人影响力构筑长效护城河。

**【人生周期与战略时机】**
八字大运与紫微十年大限正处在交汇共振期。当前紫微大限行至【${currentDaXianPalace?.name ?? '本命大限'}】（${currentDaXian?.startAge ?? 0}-${currentDaXian?.endAge ?? 0}岁），主星逢运势演进${bazi?.currentDaYun ? `，八字大运正行【${bazi.currentDaYun.ganzhi}（${bazi.currentDaYun.themeCn}）】` : ''}。此阶段是拓展边界与厚积薄发的黄金战略窗口期，宜稳扎稳打、顺应天时。

**【五行调候与生活进化建议】**
五行调候首取【${wuxingFavorable}】为平衡之匙。建议在日常工作与生活节奏中多引入舒缓松弛与系统化复盘机制，避免单点过刚；面对阻力课题时，以柔克刚、借力使力，即可顺势突破瓶颈。`;
  }

  // 2. 八字深度专题
  if (prompt.includes('八字') && bazi) {
    return `**【四柱元神格局】**
日主【${bazi.dayMaster.stemCn}${bazi.dayMaster.elementCn}】，先天原型为【${bazi.dayMaster.archetypeCn}（${bazi.dayMaster.natureSymbolEn}）】。四柱干支各司其职，月令得气，结构清晰有力。

**【十神驱动力剖析】**
年柱透${bazi.pillars.year.stemTenGodCn ?? '比肩'}，代表根基深厚与同侪支持；月柱透${bazi.pillars.month.stemTenGodCn ?? '劫财'}，体现出色的魄力与危机应对天资；时柱见${bazi.pillars.hour.stemTenGodCn ?? '伤官'}，赋予晚成才华与敏锐的直觉表达。

**【五行能量调配】**
当前五行力量中，${bazi.dominantElements.map(e => bazi.wuxingScores[e].elementCn).join('、')}能量最为强盛，而${bazi.supportingElements.map(e => bazi.wuxingScores[e].elementCn).join('、')}相对需要滋养。喜用神利在生活环境、事业合作中多融入对应调候元素。

**【岁月流转与发展建议】**
当前大运处于【${bazi.currentDaYun?.ganzhi ?? '本命运'}（${bazi.currentDaYun?.startAge ?? 0}-${bazi.currentDaYun?.endAge ?? 0}岁）】，主导课题为${bazi.currentDaYun?.themeCn ?? '厚积薄发'}。踏实耕耘必能迎来收获期。`;
  }

  // 3. 感情专题
  if (prompt.includes('感情') || prompt.includes('婚姻') || prompt.includes('夫妻')) {
    const fuQiGong = chart.palaces.find(p => p.name === '夫妻宫');
    const fuQiStars = fuQiGong?.stars.filter(s => s.type === 'major').map(s => s.name).join('、') || '空宫（借对宫事业）';

    return `**【感情格局】**
夫妻宫坐【${fuQiStars}】，感情追求精神层面的高度默契与相互尊重，不流于俗套。

**【夫妻宫分析】**
依据倪海夏《天纪》体系，夫妻宫反映配偶性格与双方沟通互动模式。主星坐【${fuQiStars}】，配偶多具备独立主见与出众才能，相处宜以相互成就为主轴，多换位思考。

**【三方联动】**
夫妻宫与福德宫、交友宫、迁移宫密切呼应。双方情感的升温有赖于共同的生活理想与朋友交际圈的和谐相处。

**【感情相处建议】**
遇有分歧时切忌意气用事，多沟通倾听、给予彼此适度个人空间，方可琴瑟和鸣、细水长流。`;
  }

  // 4. 事业与财运专题
  if (prompt.includes('事业') || prompt.includes('官禄') || prompt.includes('职业')) {
    const guanLuGong = chart.palaces.find(p => p.name === '官禄宫');
    const guanLuStars = guanLuGong?.stars.filter(s => s.type === 'major').map(s => s.name).join('、') || '空宫';

    return `**【事业格局定调】**
官禄宫坐【${guanLuStars}】，命主天生具备独立掌舵与专业突破之潜质，不甘平庸。

**【主星与岗位适性】**
结合倪师天纪观点，【${guanLuStars}】擅长在有技术门槛、需要深度决策与组织协同的领域建立威望。宜深耕专业赛道，做精做透。

**【三方四正资源】**
命宫【${starNames}】与财帛宫紧密呼应，形成了“决策-执行-变现”的良性自洽闭环，具备优秀的抗压能力。

**【发展建议】**
把握关键战略周期，敢于在时机成熟时独立扛旗，避免在无谓的内耗中消磨才干。`;
  }

  if (prompt.includes('财运') || prompt.includes('财帛')) {
    const caiBoGong = chart.palaces.find(p => p.name === '财帛宫');
    const caiBoStars = caiBoGong?.stars.filter(s => s.type === 'major').map(s => s.name).join('、') || '空宫';
    const tianZhaiGong = chart.palaces.find(p => p.name === '田宅宫');

    return `**【财帛宫分析】**
财帛宫坐【${caiBoStars}】，财富来源多依托专业能力与智谋布局，利正道求财、厚积薄发。

**【田宅宫（财库）】**
田宅宫坐【${tianZhaiGong?.stars.filter(s => s.type === 'major').map(s => s.name).join('、') || '吉星照拂'}】，财库稳固，具备优异的资产沉淀与不动产运势。

**【当前大限财运】**
当前大限财星照拂，财富通路渐次清晰，利于通过长期复利与实体资产配置抵御周期波动。

**【理财建议】**
求财宜稳健，注重现金流管理与资产分散配置，切忌盲目涉足高风险投机。`;
  }

  // 5. 宫位选择即时剖析
  if (prompt.includes('请重点分析【')) {
    const palaceMatch = prompt.match(/请重点分析【(.+?)】/);
    const pName = palaceMatch ? palaceMatch[1] : '该宫位';
    const currentP = chart.palaces.find(p => p.name === pName);
    const pStars = currentP?.stars.filter(s => s.type === 'major').map(s => s.name).join('、') || '空宫';

    return `**【宫位定性】**
【${pName}】主星汇聚【${pStars}】，在全盘十二宫体系中扮演着枢纽级的角色。

**【主星解读】**
依据倪海夏《天纪》论断，【${pStars}】居于【${pName}】，体现出命主在对应生活层面拥有极强的塑造力与独特风格，顺应自然节律方可大显身手。

**【三方四正联动】**
此宫与对宫相互激荡，配合两翼拱照，形成了进可攻、退可守的稳健防御机制。

**【实际建议】**
在涉及该宫位相关事务时，保持从容定力，遵循“先谋而后动”的准则，必能转危为安、开创新局。`;
  }

  // 6. 默认命格总览
  const patternDesc = excellentPatterns.length > 0
    ? `成【${excellentPatterns.map(p => p.name).join('、')}】之势。`
    : '格局清奇，内外兼修。';

  return `**【命格定性】**
命宫坐【${starNames}】（${chart.wuxingJuName}），${patternDesc}命主先天风骨卓然，外显沉稳从容，内蕴强劲爆发力。

**【主星解读】**
依据倪海夏《天纪》正统体系，【${starNames}】坐命者，心胸坦荡、眼界开阔。具备极强的独立思辨与开拓精神，不趋炎附势，天生带有一股自律向上的王者风范。

**【三方四正】**
命、财、官、迁四正交相辉映。官禄与财帛皆得吉宿拱照，事业与财富形成自驱闭环，行事章法分明，具备卓越的承压抗挫能力。

**【当前大限】**
当前大限（${currentDaXian?.startAge ?? 0}-${currentDaXian?.endAge ?? 0}岁）行至【${currentDaXianPalace?.name ?? '本命大限'}】，主星乘旺。当下正处在关键战略转折窗口，宜积蓄实力、蓄势待发。

**【优势与注意】**
天赋在于敏锐的战略定力与独立决断；需防行事过于决绝刚烈，在人际协作中适度包容圆融，更能赢得天地宽阔。`;
}
