/**
 * KARMA-MATRIX: 星宿本命局算法映射与解析引擎
 * 十四主星爆款原型字典、十二宫化忌通关密码库、疾厄宫×汉唐经方映射
 */

import type { ZiweiChart } from '@/lib/ziwei/types';
import type { StarArchetype, KarmaQuestCardData, CelestialTonicScriptData } from '@/types/viral-card';

// ── 十四主星爆款原型字典 + 命无正曜 ──
export const STAR_ARCHETYPES: Record<string, StarArchetype> = {
  '七杀': {
    starName: '七杀',
    archetypeTitle: '破阵执剑者 · 绝境翻盘大女主',
    auraKeywords: ['杀伐果断', '拒绝精神内耗', '野蛮生长', '先打再说'],
    soulQuote: '你不是来迎合这世界的规则的，你是来让这世界适应你的锋芒的。',
    fiveDimensions: { ambition: 96, resilience: 98, intuition: 75, empathyCost: 28, freedomIndex: 95 },
  },
  '破军': {
    starName: '破军',
    archetypeTitle: '星际开荒者 · 破旧立新的暴风眼',
    auraKeywords: ['敢破敢立', '反叛骨髓', '颠覆旧时代', '大开大合'],
    soulQuote: '不把旧的废墟彻底拆毁，怎么建起属于你的不朽帝国？摧毁是新生的序曲。',
    fiveDimensions: { ambition: 95, resilience: 94, intuition: 82, empathyCost: 40, freedomIndex: 98 },
  },
  '廉贞': {
    starName: '廉贞',
    archetypeTitle: '烈火朱雀 · 极致反骨的秩序重塑者',
    auraKeywords: ['爱憎分明', '气场全开', '反传统先锋', '绝不妥协'],
    soulQuote: '别用平庸世俗的尺子衡量你的野性。你骨子里的傲骨与执念，是重构秩序的火种。',
    fiveDimensions: { ambition: 92, resilience: 88, intuition: 89, empathyCost: 68, freedomIndex: 90 },
  },
  '贪狼': {
    starName: '贪狼',
    archetypeTitle: '欲望造梦机 · 凡人修仙界魅魔',
    auraKeywords: ['极致生命力', '八面玲珑', '财欲情欲两全', '玄学体质'],
    soulQuote: '世俗的野心与清高的修行并不冲突，你是能在红尘浊世里修成正果的奇葩。',
    fiveDimensions: { ambition: 94, resilience: 85, intuition: 95, empathyCost: 45, freedomIndex: 92 },
  },
  '紫微': {
    starName: '紫微',
    archetypeTitle: '隐秘权柄领主 · 天生破局领袖',
    auraKeywords: ['全局统筹', '不怒自威', '骨子里的贵气', '孤独掌舵者'],
    soulQuote: '欲戴王冠，必受其重。所有人都依赖你的决断，唯独你必须成为自己的避风港。',
    fiveDimensions: { ambition: 98, resilience: 90, intuition: 80, empathyCost: 55, freedomIndex: 65 },
  },
  '天府': {
    starName: '天府',
    archetypeTitle: '国库执印人 · 气定神闲的幕后庄家',
    auraKeywords: ['运筹帷幄', '包容博大', '享受生活', '底牌深厚'],
    soulQuote: '不显山不露水，才是真正的富贵气象。你不需要到处证明自己，时间会替你收割一切成果。',
    fiveDimensions: { ambition: 88, resilience: 92, intuition: 75, empathyCost: 40, freedomIndex: 85 },
  },
  '武曲': {
    starName: '武曲',
    archetypeTitle: '点石成金客 · 孤勇务实的搞钱战神',
    auraKeywords: ['硬核实力派', '冷酷务实', '数字敏感', '执行力天花板'],
    soulQuote: '情感会骗人，但账户余额和硬核技能永远忠诚。你生来就是靠真刀真枪杀出商业重围的。',
    fiveDimensions: { ambition: 98, resilience: 95, intuition: 70, empathyCost: 30, freedomIndex: 80 },
  },
  '天相': {
    starName: '天相',
    archetypeTitle: '正义宰执官 · 优雅得体的定海神针',
    auraKeywords: ['同理心天花板', '公信力背书', '协调大师', '衣品出众'],
    soulQuote: '你是最值得托付后背的同盟者，但别为了照顾所有人的体面，而委屈了自己最真实的渴望。',
    fiveDimensions: { ambition: 75, resilience: 85, intuition: 80, empathyCost: 72, freedomIndex: 70 },
  },
  '太阳': {
    starName: '太阳',
    archetypeTitle: '烈阳普照者 · 燃烧自我的破晓炬火',
    auraKeywords: ['天然聚光灯', '慷慨仗义', '利他奉献', '光明磊落'],
    soulQuote: '你习惯向整个世界散发光芒，但别忘了，烈日也有落山蓄力的时候。学会允许自己暗淡。',
    fiveDimensions: { ambition: 90, resilience: 82, intuition: 78, empathyCost: 85, freedomIndex: 75 },
  },
  '巨门': {
    starName: '巨门',
    archetypeTitle: '暗夜真理探寻者 · 降维打击的洞察者',
    auraKeywords: ['一眼看透本质', '批判性思维', '语言炼金术', '质疑权威'],
    soulQuote: '你的锋利语言是刺破谎言的刀锋。别害怕被孤立，世人恐惧真相，但世界终将借你的口发声。',
    fiveDimensions: { ambition: 82, resilience: 84, intuition: 91, empathyCost: 75, freedomIndex: 85 },
  },
  '天机': {
    starName: '天机',
    archetypeTitle: '高维算力体 · 算尽机巧的谋略家',
    auraKeywords: ['脑力超频', '多线程运行', '神准直觉', '神经敏锐'],
    soulQuote: '你的大脑是一台永远在跑仿真模拟的量子计算机，学会物理关机，才是最高阶的智慧。',
    fiveDimensions: { ambition: 78, resilience: 68, intuition: 96, empathyCost: 92, freedomIndex: 82 },
  },
  '太阴': {
    starName: '太阴',
    archetypeTitle: '清冷月中仙 · 润物无声的高维造物主',
    auraKeywords: ['内秀温婉', '审美天花板', '细腻谋划', '暗夜治愈'],
    soulQuote: '柔能克刚，暗夜中蓄积的力量往往比白昼更深邃。收敛锋芒，静水流深方能成大器。',
    fiveDimensions: { ambition: 76, resilience: 80, intuition: 95, empathyCost: 86, freedomIndex: 72 },
  },
  '天梁': {
    starName: '天梁',
    archetypeTitle: '玄境长生客 · 逢凶化吉的守护神',
    auraKeywords: ['老天爷赏饭', '福荫庇佑', '德高望重', '洞悉因果'],
    soulQuote: '你走过的每一步险棋都有暗中神助。所有的磨难都不是要惩罚你，而是为了让你成为众人的庇护所。',
    fiveDimensions: { ambition: 70, resilience: 96, intuition: 93, empathyCost: 65, freedomIndex: 75 },
  },
  '天同': {
    starName: '天同',
    archetypeTitle: '福泽白月光 · 灵气治愈系老灵魂',
    auraKeywords: ['感知力超群', '天然松弛感', '美学洁癖', '情绪海绵'],
    soulQuote: '你的敏感不是缺陷，而是灵魂与高维世界接通的天线。但记住，先渡己，再渡人。',
    fiveDimensions: { ambition: 55, resilience: 70, intuition: 92, empathyCost: 88, freedomIndex: 78 },
  },
  '命无正曜': {
    starName: '命无正曜',
    archetypeTitle: '因果容器 · 高自由度借力潜行者',
    auraKeywords: ['千人千面', '终极借势', '无上限进化', '莫测深潭'],
    soulQuote: '空无一物，故能容纳万物。无固定形态的你，才是这个剧本里最大的隐藏变数。',
    fiveDimensions: { ambition: 82, resilience: 88, intuition: 94, empathyCost: 60, freedomIndex: 99 },
  },
};

// ── 十二宫化忌通关剧本库 ──
export const KARMA_PALACE_QUESTS: Record<string, {
  questTitle: string;
  karmaPainPoint: string;
  reframeInsight: string;
  clearingPassword: string;
  destinedAlly: string;
  karmicNemesis: string;
}> = {
  '命宫': {
    questTitle: '我执熔炉 · 觉醒涅槃副本',
    karmaPainPoint: '一生总是跟自己较劲，容易自责自省过甚，觉得所有不如意都是自己不够好。',
    reframeInsight: '化忌在命，说明宇宙把最大的进化筹码压在你本人身上。每一次内省都是向内扎根，你注定要活成自己的避风港与神明。',
    clearingPassword: '停止自我审判。每天对自己说“我已经做得很棒了”，将严苛的自省转化为对外创造的硬核实力。',
    destinedAlly: '天府坐命的稳健定海神针',
    karmicNemesis: '空劫同宫的极度内耗画饼客',
  },
  '兄弟宫': {
    questTitle: '边界试炼 · 独行侠断舍离副本',
    karmaPainPoint: '对朋友推心置腹却常遭遇背刺或借钱不还；合伙共事极易产生利益与情感龃龉。',
    reframeInsight: '这不是你人缘差，而是命运在帮你做“低质社交物理除杂”。你天生适合独善其身，不需要庞大的酒肉朋友圈。',
    clearingPassword: '亲兄弟明算账，绝不进行无抵押借贷与含糊合伙。设立冰冷的社交边界，把精力留给极少数真知己。',
    destinedAlly: '武曲天相的契约精神派',
    karmicNemesis: '贪狼化忌的情感道德绑架者',
  },
  '夫妻宫': {
    questTitle: '情劫炼金炉 · 断舍离剧本',
    karmaPainPoint: '每次真心交付都被辜负，对方总带来无尽消耗与匮乏感，爱得越深伤得越痛。',
    reframeInsight: '你的爱不是廉价的消耗品，而是淬火的试炼。夫妻宫化忌代表情缘是来“渡你破情执”的，教你建立金刚不坏的独立人格。',
    clearingPassword: '绝不在亲密关系中寻找自我价值。把恋爱当成锦上添花，永远保持经济与精神的绝对底牌。',
    destinedAlly: '天府/紫微坐命的稳健担当派',
    karmicNemesis: '红鸾咸池同缠的海王画饼怪',
  },
  '子女宫': {
    questTitle: '传承羁绊 · 课题分离副本',
    karmaPainPoint: '对晚辈、下属或孩子操碎了心，倾注全力却难得理解，为带团队和培养新人倍感心力交瘁。',
    reframeInsight: '你在培育他人上付出的福德绝不落空，但命运在告诫你：每个人都有自己的因果轨迹，过度背负只会透支自己。',
    clearingPassword: '课题分离。把“掌控与期待”降到最低，只做引路人不当保姆，允许团队与晚辈在犯错中独立成熟。',
    destinedAlly: '太阳天梁的无私布道者',
    karmicNemesis: '巨门陀罗的牢骚抱怨精',
  },
  '财帛宫': {
    questTitle: '过路财神 · 现金流重构副本',
    karmaPainPoint: '赚钱辛苦，存钱极难；每当有一笔积蓄，总会突发意外开支让口袋迅速归零。',
    reframeInsight: '这不是穷命，是宇宙在强迫你学会“资产重构”。财帛化忌最忌死存死守，但你拥有极强的逆境变现翻盘嗅觉。',
    clearingPassword: '赚到钱立刻置换为保值硬通货或自我认知投资（买设备/考硬证/黄金），主动把钱“花在刀刃上”来应破耗。',
    destinedAlly: '武曲化禄的搞钱领航员',
    karmicNemesis: '廉贞破军的冲动投机赌徒',
  },
  '疾厄宫': {
    questTitle: '肉身神殿 · 赛博回血副本',
    karmaPainPoint: '体质敏感易疲劳，稍有压力身体就亮红灯，经常小毛病不断或气血亏虚。',
    reframeInsight: '你的肉身是你灵魂最忠诚的雷达。化忌在疾厄，是在强制你学会“身心合一”，不让你为了外物糟蹋生命。',
    clearingPassword: '规律作息，拒绝熬夜与情绪性暴饮暴食。学习经方食疗调理，把养护身体当成最重要的日常修行。',
    destinedAlly: '天梁坐命的长生养生达人',
    karmicNemesis: '火星铃星同宫的狂暴透支者',
  },
  '迁移宫': {
    questTitle: '客居异乡 · 破浪远行副本',
    karmaPainPoint: '在外漂泊总觉漂浮无依，出门在外易遇波折小人，容易对外部不确定性产生强烈不安。',
    reframeInsight: '化忌在迁移直接冲命，逼你走出舒适圈。正是因为外在环境充满挑战，你才被锻造出极强的生存本能与独立开疆拓土的能力。',
    clearingPassword: '出门做事提前预备 Plan B，谨言慎行；在外保持低调，将每一次远行都视作一次降妖除魔的经验值升级。',
    destinedAlly: '七杀破军的开拓先锋',
    karmicNemesis: '文昌化忌的合同暴雷制造者',
  },
  '交友宫': {
    questTitle: '识人断妄 · 圈层洗牌副本',
    karmaPainPoint: '容易被小人嫉妒或利用，团队协作容易遇到拖后腿或抢功劳的猪队友。',
    reframeInsight: '老天在帮你筛选真正能同频的知己。那些消耗你的人离开，是宇宙在为你清理能量场，迎接高阶贵人。',
    clearingPassword: '不交浅言深，在职场和社群中就事论事。学会“钝感力”，不把无关紧要者的评价放在心上。',
    destinedAlly: '天相同宫的信义挚友',
    karmicNemesis: '巨门化忌的口舌是非挑拨者',
  },
  '官禄宫': {
    questTitle: '西西弗斯 · 职场重塑副本',
    karmaPainPoint: '工作拼尽全力却总替人背锅，渴望认可却总遭遇管理混乱或变动打压。',
    reframeInsight: '你天生就不属于平庸的螺丝钉轨道。官禄化忌是在逼你跳出依附体制的幻觉，逼你练就哪怕单打独斗也能立足的硬核护城河。',
    clearingPassword: '不与傻逼领导争对错。积累作品集与个人IP，在主业摸鱼积蓄力量，开启垂直细分副业。',
    destinedAlly: '太阳化权的破局贵人',
    karmicNemesis: '天机陀罗的内斗甩锅专员',
  },
  '田宅宫': {
    questTitle: '后方重整 · 归宿构筑副本',
    karmaPainPoint: '原生家庭带来沉重负担，或是房产居住总有烦心琐事，内心缺乏安全感和归属感。',
    reframeInsight: '你注定是家族因果的“破局终结者”。原生家庭的枷锁不是来困死你的，而是逼你亲手缔造属于自己的新家园。',
    clearingPassword: '在物理空间和经济上尽早独立。用心打理自己的居所，营造干净安定的磁场作为蓄能港湾。',
    destinedAlly: '太阴天府的安家筑巢能手',
    karmicNemesis: '破军擎羊的挥霍祖产败家子',
  },
  '福德宫': {
    questTitle: '精神熔炉 · 终极内耗破壁人',
    karmaPainPoint: '停不下来的脑内小剧场，自我怀疑与焦虑像背景噪音一样挥之不去，很难真正快乐。',
    reframeInsight: '你是全宇宙最敏锐的情绪雷达与艺术家体质。福德化忌的灵魂是高维下凡，必须经历精神暗夜，才能觉醒通透的洞察力。',
    clearingPassword: '物理切断信息茧房。接触大自然、做重体力运动、学习玄学/心理学，将内耗能量引导为创作输出。',
    destinedAlly: '天同天梁的释然智者',
    karmicNemesis: '贪狼铃星的焦虑贩卖机',
  },
  '父母宫': {
    questTitle: '威权破局 · 独立成人副本',
    karmaPainPoint: '与父母长辈观念鸿沟巨大，沟通易起冲突，或总承受长辈无形的沉重期待与精神压力。',
    reframeInsight: '化忌在父母宫，代表你的灵魂已经超越了上一代的认知维度。你不需要通过服从他们来证明孝顺与价值。',
    clearingPassword: '客气、尊重但绝不妥协人生重大决策权。在精神上与父母“完成断乳”，走出完全自主的道路。',
    destinedAlly: '紫微天相的体面长辈',
    karmicNemesis: '巨门擎羊的挑剔苛责老古董',
  },
};

// ── 疾厄宫×汉唐经方茶饮映射矩阵 ──
export const CELESTIAL_TONIC_PRESETS = [
  {
    stars: ['天机', '贪狼', '太阳'],
    elementPhase: '木' as const,
    meridianTension: '肝郁化火 · 胆经郁滞',
    symptomVibe: '白天脑雾失眠，深夜精神抖擞，偏头痛伴随颈项僵硬，情绪易燥易郁。',
    prescriptions: {
      fangjiId: 'xiao-chai-hu-tang',
      formulaName: '小柴胡汤 / 丹栀逍遥散',
      sourceBook: '医圣张仲景《伤寒杂病论》',
      modernTonicName: '平肝降噪 · 绿金消郁饮',
      dailyHerbalTeaItems: [
        { herb: '柴胡', dose: '3g', role: '君' },
        { herb: '杭白菊', dose: '5朵', role: '臣' },
        { herb: '薄荷', dose: '2g', role: '佐' },
        { herb: '决明子', dose: '5g', role: '使' },
      ],
      brewingMethod: '焖烧杯沸水闷泡20分钟，代茶频饮，午后加温水续杯。',
      mindsetState: '放下向外索求与自证的执念，平熄胆火，神气自清。',
    },
    sealText: '汉唐经方 · 平肝调神',
  },
  {
    stars: ['廉贞', '天府', '天相'],
    elementPhase: '火' as const,
    meridianTension: '心脾两虚 · 神不守舍',
    symptomVibe: '神经衰弱、梦多易醒、无端心慌胸闷，无名烦躁想哭，气血不足。',
    prescriptions: {
      fangjiId: 'gan-mai-da-zao-tang',
      formulaName: '甘麦大枣汤 / 酸枣仁汤',
      sourceBook: '医圣张仲景《金匮要略》',
      modernTonicName: '救心回魂 · 安神定志饮',
      dailyHerbalTeaItems: [
        { herb: '酸枣仁(捣碎)', dose: '6g', role: '君' },
        { herb: '浮小麦', dose: '10g', role: '臣' },
        { herb: '炙甘草', dose: '3g', role: '使' },
        { herb: '金丝红枣', dose: '2枚', role: '佐' },
      ],
      brewingMethod: '养生壶慢煮15分钟，晚饭后温服，安心定悸。',
      mindsetState: '形神相合，允许自己脆弱，让漂浮的心神安居本位。',
    },
    sealText: '仲景心法 · 安神固本',
  },
  {
    stars: ['太阴', '巨门'],
    elementPhase: '土' as const,
    meridianTension: '脾虚湿盛 · 中焦气滞',
    symptomVibe: '晨起面部浮肿、大便溏黏马桶、舌苔厚白、饭后昏沉困倦四肢乏力。',
    prescriptions: {
      fangjiId: 'ling-gui-zhu-gan-tang',
      formulaName: '苓桂术甘汤 / 理中汤',
      sourceBook: '医圣张仲景《金匮要略》',
      modernTonicName: '祛湿刮脂 · 金匮轻盈茶',
      dailyHerbalTeaItems: [
        { herb: '茯苓', dose: '6g', role: '君' },
        { herb: '炒白术', dose: '5g', role: '臣' },
        { herb: '桂枝', dose: '3g', role: '佐' },
        { herb: '炙甘草', dose: '3g', role: '使' },
      ],
      brewingMethod: '养生壶煎煮10分钟代茶饮，脾胃温热，阳气升发。',
      mindsetState: '振奋中焦阳气，化开一身浊湿阴霾，身体自然轻快。',
    },
    sealText: '汉唐方典 · 健脾化湿',
  },
  {
    stars: ['天同', '天梁', '武曲'],
    elementPhase: '水' as const,
    meridianTension: '肾水不足 · 心肾不交',
    symptomVibe: '深夜盗汗、腰膝酸软、下巴反复爆痘、脱发早白、精力断崖式下滑。',
    prescriptions: {
      fangjiId: 'liu-wei-di-huang-wan',
      formulaName: '六味地黄汤 / 黄连阿胶汤',
      sourceBook: '医圣张仲景《金匮要略》/ 钱乙《小儿药证直诀》',
      modernTonicName: '滋水涵木 · 黑曜固元茶',
      dailyHerbalTeaItems: [
        { herb: '黑豆', dose: '8g', role: '君' },
        { herb: '熟地黄', dose: '5g', role: '臣' },
        { herb: '枸杞子', dose: '5g', role: '佐' },
        { herb: '桑葚', dose: '5g', role: '使' },
      ],
      brewingMethod: '保温杯沸水闷泡30分钟，代茶饮并嚼食枸杞黑豆。',
      mindsetState: '闭藏肾精，收摄神思，蓄积生生不息之元气。',
    },
    sealText: '倪师正宗 · 滋补固元',
  },
  {
    stars: ['七杀', '破军', '紫微'],
    elementPhase: '金' as const,
    meridianTension: '肺经宣肃失调 · 气滞血瘀',
    symptomVibe: '咽喉异物感、皮肤干燥暗沉、手脚冰凉易抽筋、容易悲秋心绪不宁。',
    prescriptions: {
      fangjiId: 'dang-gui-si-ni-tang',
      formulaName: '当归四逆汤 / 百合知母汤',
      sourceBook: '医圣张仲景《伤寒杂病论》',
      modernTonicName: '温阳通络 · 暖宫活血饮',
      dailyHerbalTeaItems: [
        { herb: '当归', dose: '4g', role: '君' },
        { herb: '桂枝', dose: '3g', role: '臣' },
        { herb: '白芍', dose: '4g', role: '佐' },
        { herb: '大枣', dose: '2枚', role: '使' },
      ],
      brewingMethod: '加入生姜两片，养生壶温煮15分钟热饮，通畅四肢经脉。',
      mindsetState: '温通一身经脉，散尽陈年阴寒，气定神闲万物明朗。',
    },
    sealText: '汉唐秘传 · 温阳通脉',
  },
];

const SHICHEN_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 格式化排盘出生时间
 */
export function formatBirthLabel(chart: ZiweiChart): string {
  const b = chart.birthInfo;
  const l = chart.lunarInfo;
  const hourName = SHICHEN_NAMES[b.hour] || '子';
  if (l) {
    const leapStr = l.isLeapMonth ? '闰' : '';
    return `${l.lunarYear}年${leapStr}农历${l.lunarMonth}月${l.lunarDay}日 · ${hourName}时`;
  }
  return `${b.year}年${b.month}月${b.day}日 · ${hourName}时`;
}

/**
 * 解析用户命盘的化忌通关令与灵魂原型
 */
export function resolveKarmaQuest(chart: ZiweiChart): KarmaQuestCardData {
  // 1. 定位命宫
  const mingPalace = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const mingMajorStars = mingPalace?.stars.filter(s => s.type === 'major').map(s => s.name) || [];
  
  // 确定主星原型
  let archetype = STAR_ARCHETYPES['命无正曜'];
  if (mingMajorStars.length > 0) {
    const firstStar = mingMajorStars[0];
    if (STAR_ARCHETYPES[firstStar]) {
      archetype = STAR_ARCHETYPES[firstStar];
    } else {
      // 检查第二主星
      const secondStar = mingMajorStars[1];
      if (secondStar && STAR_ARCHETYPES[secondStar]) {
        archetype = STAR_ARCHETYPES[secondStar];
      }
    }
  }

  // 2. 定位生年化忌星曜与宫位
  let karmaGongName = '官禄宫';
  let karmaStarName = '化忌星';

  for (const palace of chart.palaces) {
    const jiStar = palace.stars.find(s => s.siHua === '忌');
    if (jiStar) {
      karmaStarName = `${jiStar.name}化忌`;
      karmaGongName = palace.name;
      break;
    }
  }

  // 规范化宫名匹配
  let normalizedGong = karmaGongName;
  if (normalizedGong.includes('命')) normalizedGong = '命宫';
  else if (normalizedGong.includes('兄')) normalizedGong = '兄弟宫';
  else if (normalizedGong.includes('夫')) normalizedGong = '夫妻宫';
  else if (normalizedGong.includes('子')) normalizedGong = '子女宫';
  else if (normalizedGong.includes('财')) normalizedGong = '财帛宫';
  else if (normalizedGong.includes('疾')) normalizedGong = '疾厄宫';
  else if (normalizedGong.includes('迁')) normalizedGong = '迁移宫';
  else if (normalizedGong.includes('友') || normalizedGong.includes('奴')) normalizedGong = '交友宫';
  else if (normalizedGong.includes('官') || normalizedGong.includes('事')) normalizedGong = '官禄宫';
  else if (normalizedGong.includes('田')) normalizedGong = '田宅宫';
  else if (normalizedGong.includes('福')) normalizedGong = '福德宫';
  else if (normalizedGong.includes('父')) normalizedGong = '父母宫';

  const quest = KARMA_PALACE_QUESTS[normalizedGong] || KARMA_PALACE_QUESTS['官禄宫'];

  return {
    userName: chart.birthInfo.name || '天命主星',
    birthFormatted: formatBirthLabel(chart),
    mainStarArchetype: archetype,
    karmaGong: normalizedGong,
    karmaStar: karmaStarName,
    questTitle: quest.questTitle,
    karmaPainPoint: quest.karmaPainPoint,
    reframeInsight: quest.reframeInsight,
    clearingPassword: quest.clearingPassword,
    destinedAlly: quest.destinedAlly,
    karmicNemesis: quest.karmicNemesis,
  };
}

/**
 * 解析用户命盘的疾厄宫经方签
 */
export function resolveCelestialTonic(chart: ZiweiChart): CelestialTonicScriptData {
  // 定位疾厄宫
  const jiePalace = chart.palaces.find(p => p.name.includes('疾厄')) || chart.palaces[0];
  const majorStars = jiePalace.stars.filter(s => s.type === 'major').map(s => s.name);
  const primaryStar = majorStars[0] || (jiePalace.stars[0]?.name ?? '天机');

  // 匹配经方预设
  let matchedPreset = CELESTIAL_TONIC_PRESETS[0];
  for (const preset of CELESTIAL_TONIC_PRESETS) {
    if (preset.stars.some(s => majorStars.includes(s) || primaryStar.includes(s))) {
      matchedPreset = preset;
      break;
    }
  }

  return {
    jiEGongStar: primaryStar,
    elementPhase: matchedPreset.elementPhase,
    meridianTension: matchedPreset.meridianTension,
    symptomVibe: matchedPreset.symptomVibe,
    prescriptions: matchedPreset.prescriptions,
    sealText: matchedPreset.sealText,
  };
}
