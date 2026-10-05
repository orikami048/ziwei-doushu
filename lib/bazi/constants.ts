import { WuxingElement, WuxingElementCn, YinYang, YinYangCn, TenGod, DayMasterProfile } from './types';

export const STEMS_CN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const STEMS_EN = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];

export const BRANCHES_CN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const BRANCHES_EN = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];

export const STEM_WUXING: Record<string, { element: WuxingElement; elementCn: WuxingElementCn; yinYang: YinYang; yinYangCn: YinYangCn }> = {
  甲: { element: 'Wood', elementCn: '木', yinYang: 'Yang', yinYangCn: '阳' },
  乙: { element: 'Wood', elementCn: '木', yinYang: 'Yin', yinYangCn: '阴' },
  丙: { element: 'Fire', elementCn: '火', yinYang: 'Yang', yinYangCn: '阳' },
  丁: { element: 'Fire', elementCn: '火', yinYang: 'Yin', yinYangCn: '阴' },
  戊: { element: 'Earth', elementCn: '土', yinYang: 'Yang', yinYangCn: '阳' },
  己: { element: 'Earth', elementCn: '土', yinYang: 'Yin', yinYangCn: '阴' },
  庚: { element: 'Metal', elementCn: '金', yinYang: 'Yang', yinYangCn: '阳' },
  辛: { element: 'Metal', elementCn: '金', yinYang: 'Yin', yinYangCn: '阴' },
  壬: { element: 'Water', elementCn: '水', yinYang: 'Yang', yinYangCn: '阳' },
  癸: { element: 'Water', elementCn: '水', yinYang: 'Yin', yinYangCn: '阴' },
};

export const BRANCH_WUXING: Record<string, { element: WuxingElement; elementCn: WuxingElementCn }> = {
  子: { element: 'Water', elementCn: '水' },
  丑: { element: 'Earth', elementCn: '土' },
  寅: { element: 'Wood', elementCn: '木' },
  卯: { element: 'Wood', elementCn: '木' },
  辰: { element: 'Earth', elementCn: '土' },
  巳: { element: 'Fire', elementCn: '火' },
  午: { element: 'Fire', elementCn: '火' },
  未: { element: 'Earth', elementCn: '土' },
  申: { element: 'Metal', elementCn: '金' },
  酉: { element: 'Metal', elementCn: '金' },
  戌: { element: 'Earth', elementCn: '土' },
  亥: { element: 'Water', elementCn: '水' },
};

export const BRANCH_CANGGAN: Record<string, { stem: string; weight: number }[]> = {
  子: [{ stem: '癸', weight: 1.0 }],
  丑: [{ stem: '己', weight: 0.6 }, { stem: '癸', weight: 0.3 }, { stem: '辛', weight: 0.1 }],
  寅: [{ stem: '甲', weight: 0.6 }, { stem: '丙', weight: 0.3 }, { stem: '戊', weight: 0.1 }],
  卯: [{ stem: '乙', weight: 1.0 }],
  辰: [{ stem: '戊', weight: 0.6 }, { stem: '乙', weight: 0.3 }, { stem: '癸', weight: 0.1 }],
  巳: [{ stem: '丙', weight: 0.6 }, { stem: '戊', weight: 0.3 }, { stem: '庚', weight: 0.1 }],
  午: [{ stem: '丁', weight: 0.7 }, { stem: '己', weight: 0.3 }],
  未: [{ stem: '己', weight: 0.6 }, { stem: '丁', weight: 0.3 }, { stem: '乙', weight: 0.1 }],
  申: [{ stem: '庚', weight: 0.6 }, { stem: '壬', weight: 0.3 }, { stem: '戊', weight: 0.1 }],
  酉: [{ stem: '辛', weight: 1.0 }],
  戌: [{ stem: '戊', weight: 0.6 }, { stem: '辛', weight: 0.3 }, { stem: '丁', weight: 0.1 }],
  亥: [{ stem: '壬', weight: 0.7 }, { stem: '甲', weight: 0.3 }],
};

export const TEN_GOD_NAMES: Record<TenGod, { cn: string; en: string; archetypeEn: string; archetypeCn: string }> = {
  BiJian: { cn: '比肩', en: 'The Peer', archetypeEn: 'The Autonomous Peer', archetypeCn: '同侪共建者 / 独立先锋' },
  JieCai: { cn: '劫财', en: 'The Disruptor', archetypeEn: 'The Charismatic Disruptor', archetypeCn: '魄力开拓者 / 破局黑马' },
  ShiShen: { cn: '食神', en: 'The Epicurean', archetypeEn: 'The Creative Epicurean', archetypeCn: '灵性艺术家 / 美好生活家' },
  ShangGuan: { cn: '伤官', en: 'The Maverick', archetypeEn: 'The Rebel Innovator', archetypeCn: '颠覆创造者 / 变革极客' },
  PianCai: { cn: '偏财', en: 'The Visionary Investor', archetypeEn: 'The Venture Capitalist', archetypeCn: '敏锐风投家 / 商业领航者' },
  ZhengCai: { cn: '正财', en: 'The Steady Builder', archetypeEn: 'The Prudent Architect', archetypeCn: '稳健实干家 / 财富奠基人' },
  QiSha: { cn: '七杀', en: 'The Challenger', archetypeEn: 'The Fearless Warrior', archetypeCn: '无畏挑战者 / 危机统帅' },
  ZhengGuan: { cn: '正官', en: 'The Executive', archetypeEn: 'The Noble Guardian', archetypeCn: '秩序守护者 / 卓越领袖' },
  PianYin: { cn: '偏印', en: 'The Mystic Scholar', archetypeEn: 'The Esoteric Alchemist', archetypeCn: '深邃哲思者 / 独特洞察家' },
  ZhengYin: { cn: '正印', en: 'The Sage Mentor', archetypeEn: 'The Benevolent Guide', archetypeCn: '博学导师 / 慈爱守护者' },
};

/**
 * 十神推导逻辑：以日主天干为参照
 */
export function getTenGod(dayStem: string, targetStem: string): TenGod {
  const me = STEM_WUXING[dayStem];
  const target = STEM_WUXING[targetStem];
  if (!me || !target) return 'BiJian';

  const samePolarity = me.yinYang === target.yinYang;

  // 同我者（比肩、劫财）
  if (me.element === target.element) {
    return samePolarity ? 'BiJian' : 'JieCai';
  }

  // 我生者（食神、伤官）
  const shengMap: Record<WuxingElement, WuxingElement> = {
    Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood'
  };
  if (shengMap[me.element] === target.element) {
    return samePolarity ? 'ShiShen' : 'ShangGuan';
  }

  // 我克者（偏财、正财）
  const keMap: Record<WuxingElement, WuxingElement> = {
    Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood'
  };
  if (keMap[me.element] === target.element) {
    return samePolarity ? 'PianCai' : 'ZhengCai';
  }

  // 克我者（七杀、正官）
  if (keMap[target.element] === me.element) {
    return samePolarity ? 'QiSha' : 'ZhengGuan';
  }

  // 生我者（偏印、正印）
  if (shengMap[target.element] === me.element) {
    return samePolarity ? 'PianYin' : 'ZhengYin';
  }

  return 'BiJian';
}

export const DAY_MASTER_ARCHETYPES: Record<string, DayMasterProfile> = {
  甲: {
    stem: 'Jia',
    stemCn: '甲',
    yinYang: 'Yang',
    yinYangCn: '阳',
    element: 'Wood',
    elementCn: '木',
    natureSymbolEn: 'The Ancient Redwood',
    natureSymbolCn: '参天大树',
    archetypeEn: 'The Visionary Pioneer',
    archetypeCn: '拓荒领袖与开创者',
    essenceEn: 'Standing tall and rooted deeply, you possess unyielding integrity, forward vision, and the strength to shelter others in times of storm.',
    essenceCn: '巍然参天，根深叶茂。天生具备坚韧不拔的拓荒意志与领袖风骨，崇尚正直坦荡，乐于为他人遮风避雨。',
    strengthsEn: ['Visionary leadership', 'Unyielding resilience', 'Inherent integrity', 'Inspiring generosity'],
    strengthsCn: ['高瞻远瞩的领导力', '不屈不挠的韧性', '正直坚定的道德操守', '庇护同侪的胸襟'],
    growthEdgesEn: ['Stubbornness in transition', 'Reluctance to show vulnerability', 'Risk of burnout from bearing too much alone'],
    growthEdgesCn: ['原则过强易失圆融', '不愿显露软弱易内耗', '一木独支易承担过重压力'],
  },
  乙: {
    stem: 'Yi',
    stemCn: '乙',
    yinYang: 'Yin',
    yinYangCn: '阴',
    element: 'Wood',
    elementCn: '木',
    natureSymbolEn: 'The Resilient Vine',
    natureSymbolCn: '柔韧藤蔓',
    archetypeEn: 'The Strategic Diplomat',
    archetypeCn: '敏捷谋略家与外交官',
    essenceEn: 'Flexible, graceful, and remarkably persistent, you thrive where rigid structures fail, weaving strategic alliances with emotional intelligence.',
    essenceCn: '柔韧如蔓，遇势而发。极具随屈就伸的生存智慧与高超情商，善于借势整合资源，在复杂环境中繁衍生息。',
    strengthsEn: ['Unrivaled adaptability', 'High emotional intelligence', 'Strategic networking', 'Subtle persuasion'],
    strengthsCn: ['无出其右的适应力', '出色的共情与情商', '善于借力与资源整合', '润物无声的说服力'],
    growthEdgesEn: ['Indecisiveness under pressure', 'Over-reliance on external supports', 'Vulnerability to mood swings'],
    growthEdgesCn: ['面临决断时易犹豫不决', '易依赖外界环境与人际', '情绪敏感易受环境波动'],
  },
  丙: {
    stem: 'Bing',
    stemCn: '丙',
    yinYang: 'Yang',
    yinYangCn: '阳',
    element: 'Fire',
    elementCn: '火',
    natureSymbolEn: 'The Blazing Sun',
    natureSymbolCn: '烈日骄阳',
    archetypeEn: 'The Inspiring Luminary',
    archetypeCn: '光芒万丈的启发者',
    essenceEn: 'Generous, radiant, and dynamic, your presence brings warmth, illumination, and irresistible creative energy to every room you enter.',
    essenceCn: '光照万物，坦荡无私。拥有烈阳般充沛的热情与感染力，乐于分享与启发他人，渴望在广阔天地间大展拳脚。',
    strengthsEn: ['Charismatic magnetism', 'Boundary-pushing enthusiasm', 'Radical transparency', 'Broad-horizon optimism'],
    strengthsCn: ['极具号召力的魅力', '感染全场的热情', '心怀坦荡透明度高', '面向未来的乐观远见'],
    growthEdgesEn: ['Impatience with tedious details', 'Tendency toward dramatic burnouts', 'Vulnerability to superficial flattery'],
    growthEdgesCn: ['对繁琐细节缺乏耐心', '热情过盛易快速能量见底', '喜听好言易轻信他人'],
  },
  丁: {
    stem: 'Ding',
    stemCn: '丁',
    yinYang: 'Yin',
    yinYangCn: '阴',
    element: 'Fire',
    elementCn: '火',
    natureSymbolEn: 'The Starlight Candle',
    natureSymbolCn: '烛光幽火',
    archetypeEn: 'The Guiding Beacon',
    archetypeCn: '深邃指引者与灵性导师',
    essenceEn: 'Quietly brilliant and laser-focused, you hold penetrating psychological insight and spiritual intuition, gently illuminating the darkest nights.',
    essenceCn: '万籁寂静中的一盏心灯。看似温和内敛，实则内藏聚光灯般的敏锐洞察与执着信念，极具精神感召力。',
    strengthsEn: ['Deep penetrating insight', 'Subtle strategic brilliance', 'Fierce loyalty', 'Intuitive problem solving'],
    strengthsCn: ['穿透事物本质的洞察', '高度专注与精深研判', '深情内敛且极度忠诚', '直觉通透的解惑能力'],
    growthEdgesEn: ['Overthinking and secretive anxiety', 'Difficulty forgiving betrayal', 'Hypersensitivity to critique'],
    growthEdgesCn: ['容易多虑与隐蔽性内耗', '极难释怀人际背叛与伤害', '内心骄傲对批评格外敏感'],
  },
  戊: {
    stem: 'Wu',
    stemCn: '戊',
    yinYang: 'Yang',
    yinYangCn: '阳',
    element: 'Earth',
    elementCn: '土',
    natureSymbolEn: 'The Immovable Mountain',
    natureSymbolCn: '巍峨崇山',
    archetypeEn: 'The Grounded Anchor',
    archetypeCn: '坚定基石与守望者',
    essenceEn: 'Solid, steadfast, and deeply trustworthy, you provide the unwavering foundation that stabilizes organizations and relationships.',
    essenceCn: '山峙渊渟，重厚笃实。言出必行、极重承诺，是周围人最可靠的定海神针，具有极强的包容力与沉稳定力。',
    strengthsEn: ['Unshakable reliability', 'Calm composure in crisis', 'Long-term stamina', 'Magnanimous generosity'],
    strengthsCn: ['坚如磐石的可靠度', '临危不乱的沉着静气', '卓越的长期主义耐力', '敦厚厚重的胸襟气度'],
    growthEdgesEn: ['Resistance to rapid pivots', 'Procrastination disguised as patience', 'Reluctance to step into the spotlight'],
    growthEdgesCn: ['因循守旧抵触快速变革', '常以耐性为名拖延破局', '行事过稳易错失先机'],
  },
  己: {
    stem: 'Ji',
    stemCn: '己',
    yinYang: 'Yin',
    yinYangCn: '阴',
    element: 'Earth',
    elementCn: '土',
    natureSymbolEn: 'The Fertile Garden Soil',
    natureSymbolCn: '沃土良田',
    archetypeEn: 'The Nurturing Alchemist',
    archetypeCn: '温和滋养者与孵化家',
    essenceEn: 'Rich, adaptable, and endlessly receptive, you cultivate potential in others and turn raw ideas into thriving realities.',
    essenceCn: '厚德载物，孕育万机。极具包容心与细腻关怀，善于发掘他人潜能并细致孵化项目，拥有极高的多元可塑性。',
    strengthsEn: ['Exceptional talent nurturing', 'Multifaceted versatility', 'Empathic patience', 'Practical problem-solving'],
    strengthsCn: ['卓越的育人与赋能天资', '多才多艺的多样可塑性', '细腻敏锐的共情耐心', '务实周全的落地能力'],
    growthEdgesEn: ['Struggling to set personal boundaries', 'Absorbing too much negativity', 'Tendency toward people-pleasing'],
    growthEdgesCn: ['边界感模糊难以说“不”', '易吸收他人负面情绪', '过度迁就他人牺牲自我'],
  },
  庚: {
    stem: 'Geng',
    stemCn: '庚',
    yinYang: 'Yang',
    yinYangCn: '阳',
    element: 'Metal',
    elementCn: '金',
    natureSymbolEn: 'The Forged Steel Blade',
    natureSymbolCn: '淬火利剑',
    archetypeEn: 'The Fearless Champion',
    archetypeCn: '破风勇者与革新统帅',
    essenceEn: 'Decisive, bold, and fiercely loyal to truth, you cut through ambiguity with swift action and champion transformative justice.',
    essenceCn: '千锤百炼，刚毅果决。讲求正义与原则，行事雷厉风行、不拖泥带水，敢于打破旧制，具有披荆斩棘的执行魄力。',
    strengthsEn: ['Direct, razor-sharp decisiveness', 'Relentless execution power', 'Loyal camaraderie', 'Moral courage'],
    strengthsCn: ['一针见血的雷霆决断', '雷厉风行的超强执行力', '重情重义的侠骨柔肠', '勇于斗争的改革胆魄'],
    growthEdgesEn: ['Bluntness that wounds sensitive ties', 'Rigid impatience with nuance', 'Pride preventing strategic retreats'],
    growthEdgesCn: ['直来直去易伤人情面', '缺乏迂回妥协的耐心', '刚极易折不甘主动服软'],
  },
  辛: {
    stem: 'Xin',
    stemCn: '辛',
    yinYang: 'Yin',
    yinYangCn: '阴',
    element: 'Metal',
    elementCn: '金',
    natureSymbolEn: 'The Cut Diamond / Jewel',
    natureSymbolCn: '璀璨美玉',
    archetypeEn: 'The Refined Artisan',
    archetypeCn: '完美主义者与鉴赏家',
    essenceEn: 'Exquisite, discerning, and driven by perfection, you possess an innate eye for beauty, precision, and timeless elegance.',
    essenceCn: '温润灵秀，自蕴华彩。追求极致的美学与专业精度，自尊心强、自律严谨，在专业领域常展现出大师级的工匠精神。',
    strengthsEn: ['Impeccable aesthetic standards', 'Meticulous attention to detail', 'Subtle charisma', 'Endurance under pressure'],
    strengthsCn: ['出类拔萃的美学品位', '精益求精的细节把控', '自带高级感的独特气质', '百炼成金的抗压韧劲'],
    growthEdgesEn: ['Fragile ego under direct critique', 'Perfectionist paralysis', 'Secretive envy of effortless ease'],
    growthEdgesCn: ['内心高傲极重面子与名誉', '过度苛求完美易陷入停滞', '暗自攀比容易心生落寞'],
  },
  壬: {
    stem: 'Ren',
    stemCn: '壬',
    yinYang: 'Yang',
    yinYangCn: '阳',
    element: 'Water',
    elementCn: '水',
    natureSymbolEn: 'The Rushing Ocean Torrent',
    natureSymbolCn: '浩瀚汪洋',
    archetypeEn: 'The Boundless Explorer',
    archetypeCn: '自由开拓者与探索家',
    essenceEn: 'Vast, energetic, and unstoppable, your intellect flows across domains, connecting diverse ideas and riding the currents of change.',
    essenceCn: '奔流到海，浩荡无垠。胸怀广阔、智计百出，极度渴望自由与广袤舞台，善于在风起云涌的时代大潮中借力航行。',
    strengthsEn: ['Strategic macro vision', 'Unbounded intellectual curiosity', 'Mastery over momentum', 'Inspiring storytelling'],
    strengthsCn: ['全局宏观的战略视野', '永不停歇的求知探索欲', '顺应大势的驭浪智慧', '富有煽动性的表达才华'],
    growthEdgesEn: ['Restlessness and lack of persistence', 'Overpowering intensity', 'Resistance to routine discipline'],
    growthEdgesCn: ['心浮气躁难以耐受琐碎', '气势过盛给周围人带来压迫', '讨厌受规矩约束易生懈怠'],
  },
  癸: {
    stem: 'Gui',
    stemCn: '癸',
    yinYang: 'Yin',
    yinYangCn: '阴',
    element: 'Water',
    elementCn: '水',
    natureSymbolEn: 'The Morning Dew / Mist',
    natureSymbolCn: '晨曦甘露',
    archetypeEn: 'The Intuitive Mystic',
    archetypeCn: '灵性通达者与智者',
    essenceEn: 'Quiet, reflective, and deeply intuitive, you permeate beneath the surface of reality, perceiving unspoken feelings and cosmic flow.',
    essenceCn: '润物无声，至清至澈。具备极高的精神灵性与超常的直觉感知，善解人意、内敛沉静，以柔和之姿化解万千冲突。',
    strengthsEn: ['Psychic intuitive depth', 'Gentle, healing presence', 'Nimble lateral thinking', 'Unassuming wisdom'],
    strengthsCn: ['极高维度的直觉第六感', '抚慰人心的温和治愈力', '天马行空的跳跃思维', '大智若愚的处世哲学'],
    growthEdgesEn: ['Escapist tendencies when stressed', 'Overly secretive emotional world', 'Drifting without clear anchor'],
    growthEdgesCn: ['压力之下容易逃避现实', '情感世界过于隐秘不愿言明', '缺乏锚定容易随波逐流'],
  },
};
