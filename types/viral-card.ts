/**
 * KARMA-MATRIX: 星宿本命局 · 3:4 社交裂变卡片系统
 * 核心类型规范与数据接口定义
 */

// 1. 灵魂原型主星映射定义
export interface StarArchetype {
  starName: string;            // 如 "七杀"
  archetypeTitle: string;      // 爆款称谓，如 "断妄执剑者 / 绝境翻盘女主"
  auraKeywords: string[];      // 标签，如 ["杀伐果断", "拒绝精神内耗", "野蛮生长", "先打再说"]
  soulQuote: string;           // 刺痛又抚慰的金句
  fiveDimensions: {            // 五维能力雷达 (0-100)
    ambition: number;          // 搞钱与事业野心
    resilience: number;        // 逆商韧性
    intuition: number;         // 灵性直觉
    empathyCost: number;       // 精神内耗成本 (越高越内耗)
    freedomIndex: number;      // 自由不受控度
  };
}

// 2. 化忌通关剧本卡定义
export interface KarmaQuestCardData {
  userId?: string;
  userName?: string;
  birthFormatted: string;      // 如 "1998年农历冬月十三·申时"
  mainStarArchetype: StarArchetype;
  
  // 化忌主线
  karmaGong: string;           // 化忌所在宫位，如 "夫妻宫" | "财帛宫" | "官禄宫"
  karmaStar: string;           // 哪个星化忌，如 "文曲化忌" | "巨门化忌" | "贪狼化忌"
  questTitle: string;          // 副本代号，如 "情劫试炼场 · 破镜成刃副本"
  karmaPainPoint: string;      // 痛点共鸣 (刺痛文案)
  reframeInsight: string;      // 颠覆性反转解读 (抚慰释怀)
  clearingPassword: string;    // 通关锦囊 (具体落地行为指南)
  
  // 社交互动匹配
  destinedAlly: string;        // 灵魂契合天花板 (如 "天府坐命的稳健派")
  karmicNemesis: string;       // 本命防耗指南 (如 "空劫同宫的画饼达人")
}

// 3. 疾厄经方签定义 (紫微 × 经方联动)
export interface CelestialTonicScriptData {
  jiEGongStar: string;         // 疾厄宫主星，如 "天机" | "廉贞" | "天梁" | "武曲"
  elementPhase: '金' | '木' | '水' | '火' | '土';
  meridianTension: string;     // 经络脏腑失衡提示，如 "肝郁脾虚 · 心火亢盛"
  symptomVibe: string;         // 现代打工人症状共鸣，如 "白天脑雾失眠，深夜精神抖擞，偏头痛伴随颈项僵硬"
  
  // 关联的汉唐经典经方 (打通 fangji 库)
  prescriptions: {
    fangjiId: string;          // fangji.json 中的 id，如 "xiao-chai-hu-tang"
    formulaName: string;       // "小柴胡汤" | "甘麦大枣汤" | "酸枣仁汤"
    sourceBook: string;        // "《伤寒论》/《金匮要略》"
    modernTonicName: string;   // 赛博时尚称谓，如 "平肝降噪 · 情绪灭火茶"
    dailyHerbalTeaItems: {     // 年轻化轻养生茶饮平替清单
      herb: string;
      dose: string;
      role: string;            // 君/臣/佐/使
    }[];
    brewingMethod: string;     // 冲泡法：“焖烧杯热水闷泡20分钟代茶饮”
    mindsetState: string;      // 心法指引：“放下向外索求的执念，平熄胆火”
  };
  
  sealText: string;            // 药方印章文案，如 "汉唐古方 · 调神固本"
}
