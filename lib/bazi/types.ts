/**
 * BaZi (Four Pillars of Destiny) Data Types
 * 四柱八字数据类型定义与中英文全息结构
 */

export type WuxingElement = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type WuxingElementCn = '木' | '火' | '土' | '金' | '水';
export type YinYang = 'Yang' | 'Yin';
export type YinYangCn = '阳' | '阴';

export type TenGod =
  | 'BiJian'        // 比肩 (Friend / The Peer)
  | 'JieCai'        // 劫财 (Rob Wealth / The Disruptor)
  | 'ShiShen'       // 食神 (Eating God / The Epicurean Artist)
  | 'ShangGuan'     // 伤官 (Hurting Officer / The Rebel Maverick)
  | 'PianCai'       // 偏财 (Indirect Wealth / The Venture Capitalist)
  | 'ZhengCai'      // 正财 (Direct Wealth / The Steady Builder)
  | 'QiSha'         // 七杀 (Seven Killings / The Fearless Challenger)
  | 'ZhengGuan'     // 正官 (Direct Officer / The Executive Architect)
  | 'PianYin'       // 偏印 / 枭神 (Indirect Resource / The Mystic Innovator)
  | 'ZhengYin';      // 正印 (Direct Resource / The Sage Mentor)

export interface HiddenStem {
  stem: string;
  stemCn: string;
  wuxing: WuxingElement;
  wuxingCn: WuxingElementCn;
  tenGod: TenGod;
  tenGodCn: string;
  tenGodEn: string;
  weight: number; // 比例权重 (0.1 ~ 0.7)
}

export interface PillarShenShaItem {
  name: string;
  nameEn: string;
  type: 'gold' | 'red';
  descriptionCn?: string;
  descriptionEn?: string;
}

export interface BaZiPillar {
  name: 'Year' | 'Month' | 'Day' | 'Hour';
  nameCn: '年柱' | '月柱' | '日柱' | '时柱';
  stem: string; // e.g. 'Jia' / '甲'
  stemCn: string;
  branch: string; // e.g. 'Zi' / '子'
  branchCn: string;
  stemWuxing: WuxingElement;
  stemWuxingCn: WuxingElementCn;
  branchWuxing: WuxingElement;
  branchWuxingCn: WuxingElementCn;
  stemTenGod?: TenGod;
  stemTenGodCn?: string;
  stemTenGodEn?: string;
  hiddenStems: HiddenStem[];
  naYin: string; // 纳音五行
  naYinEn: string;
  changSheng: string; // 十二长生星运
  changShengEn: string;
  xunKong?: string; // 旬空
  pillarShenSha: PillarShenShaItem[];
}

export interface DayMasterProfile {
  stem: string;
  stemCn: string;
  yinYang: YinYang;
  yinYangCn: YinYangCn;
  element: WuxingElement;
  elementCn: WuxingElementCn;
  natureSymbolEn: string; // e.g. "The Ancient Redwood"
  natureSymbolCn: string; // e.g. "参天大树"
  archetypeEn: string;    // e.g. "The Visionary Pioneer"
  archetypeCn: string;    // e.g. "拓荒领袖与开创者"
  essenceEn: string;
  essenceCn: string;
  strengthsEn: string[];
  strengthsCn: string[];
  growthEdgesEn: string[];
  growthEdgesCn: string[];
}

export interface WuxingScore {
  element: WuxingElement;
  elementCn: WuxingElementCn;
  score: number;
  percentage: number;
  status: 'Excessive' | 'Strong' | 'Balanced' | 'Weak' | 'Deficient';
  statusCn: '太旺' | '偏旺' | '中和' | '偏弱' | '极弱';
}

export interface DaYunCycle {
  step: number;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  ganzhi: string;
  stem: string;
  branch: string;
  stemTenGod: TenGod;
  stemTenGodCn: string;
  stemTenGodEn: string;
  themeEn: string;
  themeCn: string;
  isCurrent: boolean;
}

export interface ShenShaMark {
  name: string;
  nameEn: string;
  pillar: 'Year' | 'Month' | 'Day' | 'Hour';
  type: 'Auspicious' | 'Challenging' | 'Neutral';
  descriptionEn: string;
  descriptionCn: string;
}

export interface BaZiClashesAnalysis {
  tg: string; // 天干生克合冲
  dz: string; // 地支六合三合三会冲刑破害
  zz: string; // 盖头截脚
}

export interface BaZiClassicsCanon {
  qiongtong?: string; // 《穷通宝鉴》
  ditiansui?: string; // 《滴天髓》
  sanming?: string;   // 《三命通会》
  tiyao?: string;     // 《八字提要》
  ganzhiNotes?: {
    nature: string;
    sanming?: string;
    yuanhai?: string;
    tiyao?: string;
  };
}

export interface BaZiChart {
  birthInfo: {
    solarDate: string; // YYYY-MM-DD HH:mm
    trueSolarDate?: string;
    longitude?: number;
    timezone?: string;
    gender: 'male' | 'female';
  };
  pillars: {
    year: BaZiPillar;
    month: BaZiPillar;
    day: BaZiPillar;
    hour: BaZiPillar;
  };
  dayMaster: DayMasterProfile;
  wuxingScores: Record<WuxingElement, WuxingScore>;
  dominantElements: WuxingElement[];
  supportingElements: WuxingElement[]; // 喜用神
  challengingElements: WuxingElement[]; // 忌神
  dayunCycles: DaYunCycle[];
  currentDaYun?: DaYunCycle;
  shenShaList: ShenShaMark[];
  clashes: BaZiClashesAnalysis;
  classics: BaZiClassicsCanon;
}
