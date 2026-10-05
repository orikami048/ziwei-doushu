import { Solar } from 'lunar-javascript';
import {
  BaZiChart,
  BaZiPillar,
  HiddenStem,
  WuxingElement,
  WuxingScore,
  DaYunCycle,
  ShenShaMark,
  PillarShenShaItem,
  BaZiClashesAnalysis,
  BaZiClassicsCanon,
} from './types';
import {
  STEMS_CN,
  STEMS_EN,
  BRANCHES_CN,
  BRANCHES_EN,
  STEM_WUXING,
  BRANCH_WUXING,
  BRANCH_CANGGAN,
  TEN_GOD_NAMES,
  getTenGod,
  DAY_MASTER_ARCHETYPES,
} from './constants';
import { GANZHI_EXPANDED_DB, CANON_SEVEN_DB, SHENSHA_EXPANDED_DB } from './classics_data';

// 纳音五行中英对照
const NAYIN_EN: Record<string, string> = {
  '海中金': 'Gold in the Sea', '炉中火': 'Fire in the Furnace', '大林木': 'Great Forest Wood',
  '路旁土': 'Earth by the Roadside', '剑锋金': 'Sword-edge Metal', '山头火': 'Fire on the Mountaintop',
  '涧下水': 'Water in the Mountain Ravine', '城头土': 'Earth on the City Wall', '白蜡金': 'White Wax Metal',
  '杨柳木': 'Willow Tree Wood', '泉中水': 'Water in the Spring', '屋上土': 'Earth on the Rooftop',
  '霹雳火': 'Thunderbolt Fire', '松柏木': 'Pine and Cypress Wood', '长流水': 'Long Flowing River Water',
  '沙中金': 'Gold in the Sand', '山下火': 'Fire at the Mountain Foot', '平地木': 'Plains Wood',
  '壁上土': 'Earth on the Wall', '金箔金': 'Gold Foil Metal', '佛灯火': 'Lamp Fire in the Temple',
  '天河水': 'Water of the Heavenly River', '大驿土': 'Earth of the Highway Station', '钗钏金': 'Jeweled Hairpin Metal',
  '桑柘木': 'Mulberry Wood', '大溪水': 'Great Stream Water', '沙中土': 'Earth in the Sand',
  '天上火': 'Fire in the Heavens', '石榴木': 'Pomegranate Wood', '大海水': 'Great Ocean Water',
};

// 十二长生中英文对照
const CHANGSHENG_EN: Record<string, string> = {
  '长生': 'Awakening (Birth)',
  '沐浴': 'Purification (Bath)',
  '冠带': 'Maturation (Crown)',
  '临官': 'Emergence (Official)',
  '帝旺': 'Peak Zenith (Apex)',
  '衰': 'Attenuation (Decline)',
  '病': 'Vulnerability (Infirmity)',
  '死': 'Stillness (Dormancy)',
  '墓': 'Chrysalis (Storage)',
  '绝': 'Extinction (Reset)',
  '胎': 'Conception (Embryo)',
  '养': 'Incubation (Nurture)',
};

const CHANGSHENG_TABLE: Record<string, Record<string, string>> = {
  '甲': { '亥': '长生', '子': '沐浴', '丑': '冠带', '寅': '临官', '卯': '帝旺', '辰': '衰', '巳': '病', '午': '死', '未': '墓', '申': '绝', '酉': '胎', '戌': '养' },
  '乙': { '午': '长生', '巳': '沐浴', '辰': '冠带', '卯': '临官', '寅': '帝旺', '丑': '衰', '子': '病', '亥': '死', '戌': '墓', '酉': '绝', '申': '胎', '未': '养' },
  '丙': { '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺', '未': '衰', '申': '病', '酉': '死', '戌': '墓', '亥': '绝', '子': '胎', '丑': '养' },
  '戊': { '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺', '未': '衰', '申': '病', '酉': '死', '戌': '墓', '亥': '绝', '子': '胎', '丑': '养' },
  '丁': { '酉': '长生', '申': '沐浴', '未': '冠带', '午': '临官', '巳': '帝旺', '辰': '衰', '卯': '病', '寅': '死', '丑': '墓', '子': '绝', '亥': '胎', '戌': '养' },
  '己': { '酉': '长生', '申': '沐浴', '未': '冠带', '午': '临官', '巳': '帝旺', '辰': '衰', '卯': '病', '寅': '死', '丑': '墓', '子': '绝', '亥': '胎', '戌': '养' },
  '庚': { '巳': '长生', '午': '沐浴', '未': '冠带', '申': '临官', '酉': '帝旺', '戌': '衰', '亥': '病', '子': '死', '丑': '墓', '寅': '绝', '卯': '胎', '辰': '养' },
  '辛': { '子': '长生', '亥': '沐浴', '戌': '冠带', '酉': '临官', '申': '帝旺', '未': '衰', '午': '病', '巳': '死', '辰': '墓', '卯': '绝', '寅': '胎', '丑': '养' },
  '壬': { '申': '长生', '酉': '沐浴', '戌': '冠带', '亥': '临官', '子': '帝旺', '丑': '衰', '寅': '病', '卯': '死', '辰': '墓', '巳': '绝', '午': '胎', '未': '养' },
  '癸': { '卯': '长生', '寅': '沐浴', '丑': '冠带', '子': '临官', '亥': '帝旺', '戌': '衰', '酉': '病', '申': '死', '未': '墓', '午': '绝', '巳': '胎', '辰': '养' }
};

// 旬空快速推导（以干支序号推）
function getXunKong(stemCn: string, branchCn: string): string {
  const gIdx = STEMS_CN.indexOf(stemCn);
  const zIdx = BRANCHES_CN.indexOf(branchCn);
  if (gIdx < 0 || zIdx < 0) return '';
  const diff = ((zIdx - gIdx) % 12 + 12) % 12;
  const kongMap: Record<number, string> = {
    10: '戌亥空',
    8: '申酉空',
    6: '午未空',
    4: '辰巳空',
    2: '寅卯空',
    0: '子丑空',
  };
  return kongMap[diff] ?? '';
}

// 柱位专属神煞查算法（多维互查，基于 bazi-liuyao-database 权威规则）
function calculatePillarShenSha(
  pillarGan: string,
  pillarZhi: string,
  isDay: boolean,
  dayGan: string,
  yearGan: string,
  yearZhi: string,
  dayZhi: string,
  monthZhi: string,
): PillarShenShaItem[] {
  const stars: PillarShenShaItem[] = [];

  const add = (name: string, type: 'gold' | 'red') => {
    const meta = SHENSHA_EXPANDED_DB?.[name] ?? {};
    stars.push({
      name,
      nameEn: meta.nature ?? name,
      type,
      descriptionCn: meta.poetry ?? '',
      descriptionEn: meta.meaning ?? '',
    });
  };

  // 1. 天乙贵人
  const tianyiMap: Record<string, string[]> = {
    '甲': ['丑', '未'], '戊': ['丑', '未'], '乙': ['子', '申'], '己': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'], '壬': ['卯', '巳'], '癸': ['卯', '巳'],
    '庚': ['寅', '午'], '辛': ['寅', '午']
  };
  if ((tianyiMap[dayGan] || []).includes(pillarZhi) || (tianyiMap[yearGan] || []).includes(pillarZhi)) {
    add('天乙贵人', 'gold');
  }

  // 2. 福星贵人
  const fuxingMap: Record<string, string | string[]> = {
    '甲': ['寅', '子'], '丙': ['寅', '子'], '乙': ['卯', '丑'], '癸': ['卯', '丑'],
    '戊': '申', '己': '未', '丁': '亥', '庚': '午', '辛': '巳', '壬': '辰'
  };
  const fxD = fuxingMap[dayGan], fxY = fuxingMap[yearGan];
  if ((Array.isArray(fxD) && fxD.includes(pillarZhi)) || fxD === pillarZhi || (Array.isArray(fxY) && fxY.includes(pillarZhi)) || fxY === pillarZhi) {
    add('福星贵人', 'gold');
  }

  // 3. 德秀贵人
  const dexiumap: Record<string, string[]> = {
    '寅': ['丙', '丁', '戊'], '午': ['丙', '丁', '戊'], '戌': ['丙', '丁', '戊'],
    '申': ['壬', '癸', '甲'], '子': ['壬', '癸', '甲', '丙', '戊', '己'], '辰': ['壬', '癸', '甲'],
    '巳': ['庚', '辛'], '酉': ['庚', '辛'], '丑': ['庚', '辛'], '亥': ['甲', '乙'],
    '卯': ['甲', '乙'], '未': ['甲', '乙']
  };
  if ((dexiumap[monthZhi] || []).includes(pillarGan)) add('德秀贵人', 'gold');

  // 4. 天德贵人
  const tiandeMap: Record<string, string> = {
    '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛', '午': '亥', '未': '甲',
    '申': '癸', '酉': '寅', '戌': '丙', '亥': '乙', '子': '巳', '丑': '庚'
  };
  if (tiandeMap[monthZhi] === pillarGan || tiandeMap[monthZhi] === pillarZhi) add('天德贵人', 'gold');

  // 5. 月德贵人
  const yuedeMap: Record<string, string> = {
    '寅': '丙', '午': '丙', '戌': '丙', '申': '壬', '子': '壬', '辰': '壬',
    '亥': '甲', '卯': '甲', '未': '甲', '巳': '庚', '酉': '庚', '丑': '庚'
  };
  if (yuedeMap[monthZhi] === pillarGan) add('月德贵人', 'gold');

  // 6. 文昌贵人
  const wenchangMap: Record<string, string> = {
    '甲': '巳', '乙': '午', '丙': '申', '戊': '申', '丁': '酉', '己': '酉',
    '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯'
  };
  if (wenchangMap[dayGan] === pillarZhi || wenchangMap[yearGan] === pillarZhi) add('文昌贵人', 'gold');

  // 7. 禄神
  const luMap: Record<string, string> = {
    '甲': '寅', '乙': '卯', '丙': '巳', '戊': '巳', '丁': '午', '己': '午',
    '庚': '申', '辛': '酉', '壬': '亥', '癸': '子'
  };
  if (luMap[dayGan] === pillarZhi || luMap[yearGan] === pillarZhi) add('禄神', 'gold');

  // 8. 将星
  const jiangxingMap: Record<string, string> = {
    '申': '子', '子': '子', '辰': '子', '寅': '午', '午': '午', '戌': '午',
    '巳': '酉', '酉': '酉', '丑': '酉', '亥': '卯', '卯': '卯', '未': '卯'
  };
  if (jiangxingMap[yearZhi] === pillarZhi || jiangxingMap[dayZhi] === pillarZhi) add('将星', 'gold');

  // 9. 华盖
  const huagaiMap: Record<string, string> = {
    '申': '辰', '子': '辰', '辰': '辰', '寅': '戌', '午': '戌', '戌': '戌',
    '巳': '丑', '酉': '丑', '丑': '丑', '亥': '未', '卯': '未', '未': '未'
  };
  if (huagaiMap[yearZhi] === pillarZhi || huagaiMap[dayZhi] === pillarZhi) add('华盖', 'gold');

  // 10. 驿马
  const yimaMap: Record<string, string> = {
    '申': '寅', '子': '寅', '辰': '寅', '寅': '申', '午': '申', '戌': '申',
    '巳': '亥', '酉': '亥', '丑': '亥', '亥': '巳', '卯': '巳', '未': '巳'
  };
  if (yimaMap[yearZhi] === pillarZhi || yimaMap[dayZhi] === pillarZhi) add('驿马', 'gold');

  // 11. 咸池桃花
  const taohuaMap: Record<string, string> = {
    '申': '酉', '子': '酉', '辰': '酉', '寅': '卯', '午': '卯', '戌': '卯',
    '巳': '午', '酉': '午', '丑': '午', '亥': '子', '卯': '子', '未': '子'
  };
  if (taohuaMap[yearZhi] === pillarZhi || taohuaMap[dayZhi] === pillarZhi) add('咸池桃花', 'red');

  // 12. 羊刃
  const yangrenMap: Record<string, string> = {
    '甲': '卯', '乙': '辰', '丙': '午', '戊': '午', '丁': '未', '己': '未',
    '庚': '酉', '辛': '戌', '壬': '子', '癸': '丑'
  };
  if (yangrenMap[dayGan] === pillarZhi) add('羊刃', 'red');

  // 13. 红艳煞
  const hongyanMap: Record<string, string> = {
    '甲': '午', '乙': '申', '丙': '寅', '丁': '未', '戊': '辰', '己': '辰',
    '庚': '戌', '辛': '酉', '壬': '子', '癸': '申'
  };
  if (hongyanMap[dayGan] === pillarZhi || hongyanMap[yearGan] === pillarZhi) add('红艳煞', 'red');

  // 14. 魁罡 (日柱见)
  if (isDay && ['壬辰', '庚戌', '庚辰', '戊戌'].includes(`${pillarGan}${pillarZhi}`)) {
    add('魁罡贵人', 'gold');
  }

  // 去重
  const seen = new Set<string>();
  return stars.filter(s => {
    if (seen.has(s.name)) return false;
    seen.add(s.name);
    return true;
  });
}

// 原局刑冲克害合透视算法
function analyzeClashes(gans: string[], zhis: string[]): BaZiClashesAnalysis {
  const tianganFindings: string[] = [];
  const hePairs = [['甲', '己', '合土'], ['乙', '庚', '合金'], ['丙', '辛', '合水'], ['丁', '壬', '合木'], ['戊', '癸', '合火']];
  const chongPairs = [['甲', '庚', '相冲'], ['乙', '辛', '相冲'], ['丙', '壬', '相冲'], ['丁', '癸', '相冲']];

  for (let i = 0; i < gans.length; i++) {
    for (let j = i + 1; j < gans.length; j++) {
      hePairs.forEach(p => {
        if ((gans[i] === p[0] && gans[j] === p[1]) || (gans[i] === p[1] && gans[j] === p[0])) tianganFindings.push(`${gans[i]}${gans[j]}${p[2]}`);
      });
      chongPairs.forEach(p => {
        if ((gans[i] === p[0] && gans[j] === p[1]) || (gans[i] === p[1] && gans[j] === p[0])) tianganFindings.push(`${gans[i]}${gans[j]}${p[2]}`);
      });
    }
  }

  const dizhiFindings: string[] = [];
  const zhiHe: Record<string, string> = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
  const zhiChong: Record<string, string> = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' };
  const zhiHai: Record<string, string> = { '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '巳', '巳': '寅', '卯': '辰', '辰': '卯', '申': '亥', '亥': '申', '酉': '戌', '戌': '酉' };
  const zhiXing = [['寅', '巳', '相刑'], ['巳', '申', '相刑'], ['寅', '申', '相刑'], ['丑', '戌', '相刑'], ['戌', '未', '相刑'], ['丑', '未', '相刑'], ['子', '卯', '相刑']];

  for (let i = 0; i < zhis.length; i++) {
    for (let j = i + 1; j < zhis.length; j++) {
      const z1 = zhis[i], z2 = zhis[j];
      if (zhiHe[z1] === z2) dizhiFindings.push(`${z1}${z2}六合`);
      if (zhiChong[z1] === z2) dizhiFindings.push(`${z1}${z2}相冲`);
      if (zhiHai[z1] === z2) dizhiFindings.push(`${z1}${z2}相害`);
      if (z1 === z2 && ['辰', '午', '酉', '亥'].includes(z1)) dizhiFindings.push(`${z1}${z2}自刑`);
      zhiXing.forEach(x => {
        if ((z1 === x[0] && z2 === x[1]) || (z1 === x[1] && z2 === x[0])) dizhiFindings.push(`${z1}${z2}${x[2]}`);
      });
      if ((z1 === '子' && z2 === '巳') || (z1 === '巳' && z2 === '子')) dizhiFindings.push(`子巳暗合`);
      if ((z1 === '寅' && z2 === '丑') || (z1 === '丑' && z2 === '寅')) dizhiFindings.push(`寅丑暗合`);
      if ((z1 === '卯' && z2 === '申') || (z1 === '申' && z2 === '卯')) dizhiFindings.push(`卯申暗合`);
    }
  }

  const zhengzhuFindings: string[] = [];
  const gaitouList = ['戊子', '己亥', '丙申', '丁酉', '庚寅', '辛卯', '甲辰', '乙丑'];
  const jiejiaoList = ['丙子', '丁丑', '甲申', '乙酉', '戊寅', '己卯', '庚午', '辛巳', '壬辰', '癸丑'];
  for (let i = 0; i < 4; i++) {
    const pair = `${gans[i]}${zhis[i]}`;
    if (gaitouList.includes(pair)) zhengzhuFindings.push(`${pair}盖头`);
    if (jiejiaoList.includes(pair)) zhengzhuFindings.push(`${pair}截脚`);
  }

  return {
    tg: Array.from(new Set(tianganFindings)).join(' · ') || '天干气纯无冲克',
    dz: Array.from(new Set(dizhiFindings)).join(' · ') || '地支纯和无破',
    zz: Array.from(new Set(zhengzhuFindings)).join(' · ') || '干支上下相安',
  };
}

export interface CalculateBaZiOptions {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  gender: 'male' | 'female';
  longitude?: number;
  timezoneOffset?: number;
}

export function calculateBaZi(options: CalculateBaZiOptions): BaZiChart {
  const { year, month, day, hour, minute = 0, gender } = options;

  // 使用 lunar-javascript 获取高精度立春与节气交节的八字排盘
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const solar = (Solar as any).fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  const dayStemCn = ec.getDayGan() as string;
  const dayBranchCn = ec.getDayZhi() as string;
  const yearStemCn = ec.getYearGan() as string;
  const yearBranchCn = ec.getYearZhi() as string;
  const monthStemCn = ec.getMonthGan() as string;
  const monthBranchCn = ec.getMonthZhi() as string;
  const timeStemCn = ec.getTimeGan() as string;
  const timeBranchCn = ec.getTimeZhi() as string;

  const gans = [yearStemCn, monthStemCn, dayStemCn, timeStemCn];
  const zhis = [yearBranchCn, monthBranchCn, dayBranchCn, timeBranchCn];

  // 1. 组装四柱数据
  const makePillar = (
    name: 'Year' | 'Month' | 'Day' | 'Hour',
    nameCn: '年柱' | '月柱' | '日柱' | '时柱',
    stemCn: string,
    branchCn: string,
    naYinCn: string,
    isDayPillar = false,
  ): BaZiPillar => {
    const stemIdx = STEMS_CN.indexOf(stemCn);
    const branchIdx = BRANCHES_CN.indexOf(branchCn);
    const stemEn = stemIdx >= 0 ? STEMS_EN[stemIdx] : stemCn;
    const branchEn = branchIdx >= 0 ? BRANCHES_EN[branchIdx] : branchCn;

    const stemMeta = STEM_WUXING[stemCn] ?? { element: 'Wood', elementCn: '木' };
    const branchMeta = BRANCH_WUXING[branchCn] ?? { element: 'Wood', elementCn: '木' };

    const stemTenGod = isDayPillar ? undefined : getTenGod(dayStemCn, stemCn);
    const stemTenGodCn = stemTenGod ? TEN_GOD_NAMES[stemTenGod].cn : '日主';
    const stemTenGodEn = stemTenGod ? TEN_GOD_NAMES[stemTenGod].en : 'Self';

    // 藏干计算
    const rawCangGan = BRANCH_CANGGAN[branchCn] ?? [{ stem: stemCn, weight: 1.0 }];
    const hiddenStems: HiddenStem[] = rawCangGan.map(cg => {
      const tg = getTenGod(dayStemCn, cg.stem);
      const wuxingData = STEM_WUXING[cg.stem] ?? { element: 'Wood', elementCn: '木' };
      return {
        stem: STEMS_EN[STEMS_CN.indexOf(cg.stem)] ?? cg.stem,
        stemCn: cg.stem,
        wuxing: wuxingData.element,
        wuxingCn: wuxingData.elementCn,
        tenGod: tg,
        tenGodCn: TEN_GOD_NAMES[tg].cn,
        tenGodEn: TEN_GOD_NAMES[tg].en,
        weight: cg.weight,
      };
    });

    // 十二长生星运自坐
    const csCn = CHANGSHENG_TABLE[dayStemCn]?.[branchCn] ?? '长生';
    const csEn = CHANGSHENG_EN[csCn] ?? csCn;

    // 旬空空亡
    const xunKong = getXunKong(stemCn, branchCn);

    // 柱位专属神煞
    const pShenSha = calculatePillarShenSha(
      stemCn,
      branchCn,
      isDayPillar,
      dayStemCn,
      yearStemCn,
      yearBranchCn,
      dayBranchCn,
      monthBranchCn,
    );

    return {
      name,
      nameCn,
      stem: stemEn,
      stemCn,
      branch: branchEn,
      branchCn,
      stemWuxing: stemMeta.element,
      stemWuxingCn: stemMeta.elementCn,
      branchWuxing: branchMeta.element,
      branchWuxingCn: branchMeta.elementCn,
      stemTenGod,
      stemTenGodCn,
      stemTenGodEn,
      hiddenStems,
      naYin: naYinCn,
      naYinEn: NAYIN_EN[naYinCn] ?? naYinCn,
      changSheng: csCn,
      changShengEn: csEn,
      xunKong,
      pillarShenSha: pShenSha,
    };
  };

  const pillars = {
    year: makePillar('Year', '年柱', yearStemCn, yearBranchCn, ec.getYearNaYin()),
    month: makePillar('Month', '月柱', monthStemCn, monthBranchCn, ec.getMonthNaYin()),
    day: makePillar('Day', '日柱', dayStemCn, dayBranchCn, ec.getDayNaYin(), true),
    hour: makePillar('Hour', '时柱', timeStemCn, timeBranchCn, ec.getTimeNaYin()),
  };

  // 2. 日主灵魂原型画像
  const dayMaster = DAY_MASTER_ARCHETYPES[dayStemCn] ?? DAY_MASTER_ARCHETYPES['甲'];

  // 3. 量化五行力量（含月令支气司令乘旺权重 3.0）
  const elementRawScores: Record<WuxingElement, number> = {
    Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0
  };

  // 天干各贡献 1.0 基础分
  [pillars.year.stemWuxing, pillars.month.stemWuxing, pillars.day.stemWuxing, pillars.hour.stemWuxing].forEach(el => {
    elementRawScores[el] += 1.0;
  });

  // 地支藏干按权重加成，月令乘 3.0，其余支乘 1.5
  Object.values(pillars).forEach(p => {
    const multiplier = p.name === 'Month' ? 3.0 : 1.5;
    p.hiddenStems.forEach(hs => {
      elementRawScores[hs.wuxing] += hs.weight * multiplier;
    });
  });

  const totalRaw = Object.values(elementRawScores).reduce((a, b) => a + b, 0);
  const wuxingScores: Record<WuxingElement, WuxingScore> = {
    Wood: { element: 'Wood', elementCn: '木', score: 0, percentage: 0, status: 'Balanced', statusCn: '中和' },
    Fire: { element: 'Fire', elementCn: '火', score: 0, percentage: 0, status: 'Balanced', statusCn: '中和' },
    Earth: { element: 'Earth', elementCn: '土', score: 0, percentage: 0, status: 'Balanced', statusCn: '中和' },
    Metal: { element: 'Metal', elementCn: '金', score: 0, percentage: 0, status: 'Balanced', statusCn: '中和' },
    Water: { element: 'Water', elementCn: '水', score: 0, percentage: 0, status: 'Balanced', statusCn: '中和' },
  };

  (Object.keys(elementRawScores) as WuxingElement[]).forEach(el => {
    const raw = elementRawScores[el];
    const pct = totalRaw > 0 ? Math.round((raw / totalRaw) * 100) : 20;
    let status: WuxingScore['status'] = 'Balanced';
    let statusCn: WuxingScore['statusCn'] = '中和';

    if (pct >= 35) { status = 'Excessive'; statusCn = '太旺'; }
    else if (pct >= 25) { status = 'Strong'; statusCn = '偏旺'; }
    else if (pct <= 8) { status = 'Deficient'; statusCn = '极弱'; }
    else if (pct <= 14) { status = 'Weak'; statusCn = '偏弱'; }

    wuxingScores[el] = {
      element: el,
      elementCn: el === 'Wood' ? '木' : el === 'Fire' ? '火' : el === 'Earth' ? '土' : el === 'Metal' ? '金' : '水',
      score: Math.round(raw * 10) / 10,
      percentage: pct,
      status,
      statusCn,
    };
  });

  // 判定能量优势与平衡建议（喜用神）
  const sortedByPct = (Object.keys(wuxingScores) as WuxingElement[]).sort(
    (a, b) => wuxingScores[b].percentage - wuxingScores[a].percentage
  );
  const dominantElements = sortedByPct.slice(0, 2);
  const supportingElements = sortedByPct.slice(-2).reverse();
  const challengingElements = [dominantElements[0]];

  // 4. 十年大运推演
  const izGender = gender === 'male' ? 1 : 0;
  let dayunCycles: DaYunCycle[] = [];
  try {
    const yun = ec.getYun(izGender);
    const rawDaYun = yun.getDaYun();
    const currentYear = new Date().getFullYear();

    dayunCycles = rawDaYun.slice(1, 10).map((dy: any, idx: number) => {
      const ganzhi = dy.getGanZhi() as string;
      const stem = ganzhi[0] ?? '';
      const branch = ganzhi[1] ?? '';
      const tg = getTenGod(dayStemCn, stem);
      const startAge = dy.getStartAge() as number;
      const endAge = startAge + 9;
      const startYear = dy.getStartYear() as number;
      const endYear = startYear + 9;
      const isCurrent = currentYear >= startYear && currentYear <= endYear;

      return {
        step: idx + 1,
        startAge,
        endAge,
        startYear,
        endYear,
        ganzhi,
        stem,
        branch,
        stemTenGod: tg,
        stemTenGodCn: TEN_GOD_NAMES[tg].cn,
        stemTenGodEn: TEN_GOD_NAMES[tg].en,
        themeEn: `${TEN_GOD_NAMES[tg].archetypeEn} Epoch`,
        themeCn: `${TEN_GOD_NAMES[tg].archetypeCn}主导期`,
        isCurrent,
      };
    });
  } catch {
    // 回退兜底
  }

  const currentDaYun = dayunCycles.find(d => d.isCurrent);

  // 5. 神煞汇总列表
  const shenShaList: ShenShaMark[] = [];
  (['Year', 'Month', 'Day', 'Hour'] as const).forEach(pKey => {
    const p = pillars[pKey.toLowerCase() as keyof typeof pillars];
    p.pillarShenSha.forEach(ss => {
      shenShaList.push({
        name: ss.name,
        nameEn: ss.nameEn,
        pillar: pKey,
        type: ss.type === 'gold' ? 'Auspicious' : 'Neutral',
        descriptionEn: ss.descriptionEn ?? '',
        descriptionCn: ss.descriptionCn ?? '',
      });
    });
  });

  // 6. 原局刑冲克害合透视
  const clashes = analyzeClashes(gans, zhis);

  // 7. 四库古籍全息引证
  const dayGanzhiKey = `${dayStemCn}${dayBranchCn}`;
  const gzNote = GANZHI_EXPANDED_DB?.[dayGanzhiKey];

  const classics: BaZiClassicsCanon = {
    qiongtong: CANON_SEVEN_DB?.QIONGTONG?.[dayStemCn]?.[monthBranchCn] || `【穷通宝鉴】：${dayStemCn}日干生于${monthBranchCn}月，须辨阴阳寒暖，审五行生克之调候。`,
    ditiansui: CANON_SEVEN_DB?.DITIANSUI?.[dayStemCn] || `【滴天髓】：${dayStemCn}木至刚，各随节令乘令而发。`,
    sanming: gzNote?.sanming || `《三命通会》论${dayGanzhiKey}：干支一体，审视财官印食四正流通。`,
    tiyao: gzNote?.tiyao || CANON_SEVEN_DB?.TIYAO?.[`${dayStemCn}_${monthBranchCn}`] || `【八字提要】：${dayStemCn}生于${monthBranchCn}月，以月令提纲定其旺衰格局。`,
    ganzhiNotes: gzNote ? {
      nature: gzNote.nature,
      sanming: gzNote.sanming,
      yuanhai: gzNote.yuanhai,
      tiyao: gzNote.tiyao,
    } : undefined,
  };

  return {
    birthInfo: {
      solarDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      longitude: options.longitude,
      gender,
    },
    pillars,
    dayMaster,
    wuxingScores,
    dominantElements,
    supportingElements,
    challengingElements,
    dayunCycles,
    currentDaYun,
    shenShaList,
    clashes,
    classics,
  };
}
