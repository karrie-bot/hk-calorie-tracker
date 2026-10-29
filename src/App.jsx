import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Calendar, Flame, PieChart, Utensils, Search, 
  Settings, ChevronLeft, ChevronRight, Scale, Activity, Award,
  Sparkles, Check, RefreshCw, BarChart2, Info, Droplets, BookOpen,
  Compass, AlertCircle, ShieldCheck, HelpCircle
} from 'lucide-react';

// --- HK LOCAL PRESET FOOD DATABASE ---
const INITIAL_PRESET_FOODS = [
  // 早餐 & 面包 / Bakery
  { id: 'hk-1', name: '嘉頓低糖全麥吐司', category: '麵包/澱粉', calories: 75, protein: 3.5, carbs: 12.5, fat: 1.0, defaultUnit: '片 (1穀)' },
  { id: 'hk-2', name: '嘉頓低糖全麥芝麻包', category: '麵包/澱粉', calories: 120, protein: 4.5, carbs: 20.0, fat: 2.5, defaultUnit: '個 (1.5穀)' },
  { id: 'hk-3', name: '全麥 Bagel (貝果)', category: '麵包/澱粉', calories: 240, protein: 9.5, carbs: 46.0, fat: 1.5, defaultUnit: '個 (3穀)' },
  { id: 'hk-4', name: '蒸中型蕃薯', category: '麵包/澱粉', calories: 120, protein: 2.0, carbs: 27.0, fat: 0.2, defaultUnit: '條 (1.5穀)' },
  { id: 'hk-5', name: '綠香蕉粉 (抗性澱粉)', category: '麵包/澱粉', calories: 40, protein: 0.5, carbs: 9.0, fat: 0.1, defaultUnit: '湯匙 (0.5穀)' },
  { id: 'hk-6', name: '白飯 (中碗)', category: '麵包/澱粉', calories: 220, protein: 4.0, carbs: 48.0, fat: 0.5, defaultUnit: '碗 (3穀)' },
  
  // 蛋白質 / Protein
  { id: 'hk-7', name: '水浸吞拿魚罐頭 (瀝乾)', category: '優質蛋白質', calories: 70, protein: 16.0, carbs: 0.0, fat: 0.5, defaultUnit: '半罐 (1肉)' },
  { id: 'hk-8', name: '全熟/溏心烚蛋', category: '優質蛋白質', calories: 72, protein: 6.3, carbs: 0.5, fat: 5.0, defaultUnit: '隻 (1肉)' },
  { id: 'hk-9', name: '即食雞胸肉 (原味)', category: '優質蛋白質', calories: 120, protein: 24.0, carbs: 1.0, fat: 2.0, defaultUnit: '包 (1.5肉)' },
  { id: 'hk-10', name: '白灼鮮蝦仁', category: '優質蛋白質', calories: 85, protein: 18.0, carbs: 0.5, fat: 1.0, defaultUnit: '份/100g (1.5肉)' },
  { id: 'hk-11', name: '鮮牛肉片 (灼)', category: '優質蛋白質', calories: 175, protein: 22.0, carbs: 0.0, fat: 9.5, defaultUnit: '份/100g (1.5肉)' },
  
  // 乳酪與奶類 / Dairy
  { id: 'hk-12', name: '希臘乳酪 0% Fat', category: '乳酪/奶類', calories: 55, protein: 10.0, carbs: 3.8, fat: 0.0, defaultUnit: '杯/100g (1奶)' },
  { id: 'hk-13', name: '維他高鈣低脂純牛奶', category: '乳酪/奶類', calories: 115, protein: 8.0, carbs: 12.0, fat: 3.5, defaultUnit: '盒/250ml (1奶)' },
  { id: 'hk-14', name: '保利/安佳 UHT 低脂純牛奶', category: '乳酪/奶類', calories: 118, protein: 8.2, carbs: 11.8, fat: 3.8, defaultUnit: '盒/250ml (1奶)' },
  { id: 'hk-15', name: '無糖豆漿', category: '乳酪/奶類', calories: 85, protein: 8.5, carbs: 3.0, fat: 4.0, defaultUnit: '盒/250ml (1奶)' },
  
  // 外食/米線/茶餐廳 / Local Dining
  { id: 'hk-16', name: '清湯鮮牛肉米線 (少麵)', category: '港式外食', calories: 380, protein: 22.0, carbs: 52.0, fat: 8.0, defaultUnit: '碗' },
  { id: 'hk-17', name: '海南雞飯 (去皮+白飯半碗)', category: '港式外食', calories: 520, protein: 28.0, carbs: 45.0, fat: 18.0, defaultUnit: '碟' },
  { id: 'hk-18', name: '三文魚刺身壽司', category: '港式外食', calories: 50, protein: 3.0, carbs: 7.0, fat: 1.2, defaultUnit: '件' },
  { id: 'hk-19', name: '蒸肉餅飯 (傳統肥肉)', category: '港式外食', calories: 780, protein: 25.0, carbs: 88.0, fat: 35.0, defaultUnit: '碟 (高油)' },
  
  // 蔬菜與油脂 / Veggies & Healthy Fats
  { id: 'hk-20', name: '溫室小黃瓜 (青瓜)', category: '蔬菜/纖維', calories: 15, protein: 0.8, carbs: 3.0, fat: 0.1, defaultUnit: '條' },
  { id: 'hk-21', name: '水蒸玉米粒', category: '蔬菜/纖維', calories: 85, protein: 3.0, carbs: 18.0, fat: 1.0, defaultUnit: '碗/100g' },
  { id: 'hk-22', name: '牛油果 (果肉)', category: '油脂/堅果', calories: 80, protein: 1.0, carbs: 4.0, fat: 7.5, defaultUnit: '1/4 個 (1脂)' },
  { id: 'hk-23', name: '每日綜合原味堅果', category: '油脂/堅果', calories: 70, protein: 2.2, carbs: 2.5, fat: 6.0, defaultUnit: '小包/10g (1脂)' }
];

// PORTION EXCHANGES DATA (FROM MANUAL)
const PORTION_EXCHANGES = [
  {
    category: '五穀類 (1份 = 1/3碗飯 / 1片方包)',
    items: [
      { name: '麥/白方包 (生命麵包大小)', portion: '1 片' },
      { name: '酸種麵包 (Sourdough)', portion: '1/2 片' },
      { name: '比高包 (Bagel)', portion: '1/3 個' },
      { name: '熟白飯 / 紅米飯 / 糙米飯', portion: '1/3 碗 (250ml碗)' },
      { name: '熟米粉 / 米線 / 粉絲 / 烏冬 / 意粉', portion: '1/3 碗' },
      { name: '麥皮 (未煮)', portion: '18克 (約3平湯匙)' },
      { name: '蕃薯 / 薯仔', portion: '70克 / 100克 (中型雞蛋大小)' },
      { name: '粟米粒', portion: '1/2 碗或 1/2 條' },
      { name: '餃子皮', portion: '5 片' }
    ]
  },
  {
    category: '蛋白質類 (1份 = 1麻雀牌大小肉類)',
    items: [
      { name: '瘦豬肉 (豬腿/柳梅) / 瘦牛肉 (牛柳/西冷)', portion: '熟肉1麻雀牌大小 / 生肉40g' },
      { name: '雞肉 (雞柳/雞胸/去皮雞髀)', portion: '熟肉1麻雀牌大小' },
      { name: '魚肉 (魚背/魚尾)', portion: '2 平湯匙' },
      { name: '雞蛋', portion: '1 隻' },
      { name: '中蝦 / 花甲 / 帶子', portion: '蝦6隻 / 花甲7隻 / 帶子4隻' },
      { name: '水浸吞拿魚', portion: '2 平湯匙 (30g) 或 1/2 細罐' },
      { name: '白魚蛋 / 牛丸', portion: '3 粒' },
      { name: '低脂芝士 / 火腿', portion: '1 片' },
      { name: '豆腐 (正方形)', portion: '1/2 磚 (約90g)' },
      { name: '無糖豆漿', portion: '1 杯 (250ml)' }
    ]
  },
  {
    category: '蔬菜類 (甲類熟菜2碗 = 1份，乙類熟菜1碗 = 1份)',
    items: [
      { name: '甲類高纖菜 (菜心/芥蘭/菠菜/椰菜/茄子/苦瓜/黑木耳)', portion: '2 平碗 (熟)' },
      { name: '甲類其他菜 (娃娃菜/白菜/生菜/青瓜/節瓜/冬瓜/菇類)', portion: '2 平碗 (熟)' },
      { name: '乙類蔬菜 (西蘭花/四季豆/蘆筍/洋蔥/紅蘿蔔/南瓜)', portion: '1 平碗 (熟)' },
      { name: '丙類蔬菜 (蕃茄 2個 / 車厘茄 15粒 / 金菇 1/2包 / 秋葵 11條)', portion: '按指定數量' }
    ]
  },
  {
    category: '水果類 (1份 = 1個細水果)',
    items: [
      { name: '細蘋果 / 細橙 / 柑', portion: '1 個' },
      { name: '香蕉', portion: '1/2 條' },
      { name: '藍莓 / 士多啤梨 / 提子', portion: '1/2 碗' },
      { name: '西瓜 / 木瓜 / 哈密瓜', portion: '1 碗 (切塊)' },
      { name: '牛油果', portion: '1/4 個 (= 1份水果 + 1份脂肪)' }
    ]
  },
  {
    category: '奶類及脂肪類',
    items: [
      { name: '脫脂奶 / 加鈣無糖豆漿', portion: '1 杯 (250ml) [1奶]' },
      { name: '脫脂無添加糖乳酪', portion: '1 杯 (150g) [1奶]' },
      { name: '植物油 (橄欖油/花生油) / 麻油', portion: '1 茶匙 [1脂]' },
      { name: '花生肉 10粒 / 杏仁 6粒 / 腰果 4粒 / 合桃 4粒', portion: '指定顆粒數 [1脂]' },
      { name: '花生醬 1茶匙 / 奇亞籽 2茶匙 / 芝麻 2茶匙', portion: '指定匙數 [1脂]' }
    ]
  }
];

// DINE OUT GUIDE DATA (FROM MANUAL)
const DINE_OUT_GUIDE = [
  {
    type: '茶餐廳 / 燒味',
    green: ['瘦叉燒/切雞/豉油雞/燒肉 (去皮去肥走汁走蔥油)', '湯飯類 (冬瓜肉片/蕃茄牛肉/鮮魚片豆腐，飯另上)', '常餐 (叉燒/蕃茄鮮牛肉/火腿配通粉/米粉，多士走牛油)', '三文魚/蛋/火腿三文治 (走牛油)'],
    yellow: ['燒鵝/燒鸭飯 (去皮去肥)', '蠔仔肉碎湯飯 (飯另上)', '雪菜肉絲/炸菜肉絲通粉'],
    red: ['所有焗或炒粉麵飯 (乾炒牛河/星洲炒米/焗豬扒飯)', '煎/炸豬扒牛扒雞扒', '蒸肉餅飯/盅頭飯', '牛腩/牛筋/餐肉/腸仔/沙嗲牛肉/公仔麵', '西多士/奶醬多/丹麥多士']
  },
  {
    type: '車仔麵 / 米線',
    green: ['湯底：清湯 / 蕃茄湯', '粉麵：米粉 / 米線 / 粗幼麵 / 烏冬 / 刀削麵', '優質配料：鮮牛肉 / 雞肉 / 溏心蛋 / 豬潤 / 豬紅 / 牛栢葉 / 鮮魚片 / 墨魚', '加工配料：白魚蛋 / 牛丸 / 龍蝦丸 / 蟹柳', '油菜 (全走)'],
    yellow: ['魚片 / 魚片頭', '扎肉 / 雪菜肉絲'],
    red: ['湯底：酸辣 / 麻辣 / 沙嗲 / 咖喱 / 濃腩汁', '高脂配料：肉碎 / 牛腩 / 牛筋 / 炸醬 / 腩肉 / 雞翼 / 豬大腸 / 貢丸 / 午餐肉 / 芝士腸', '炸物/豆製品：腐皮 / 枝竹 / 豆卜 / 炸魚皮 / 炸響鈴']
  },
  {
    type: '日本菜 / 壽司',
    green: ['赤身吞拿魚 / 三文魚 / 八爪魚 / 墨魚 / 帶子 / 甜蝦刺身', '壽司 (3件 = 1份五穀 + 1份蛋白質)', '冷/熱蕎麥麵 / 烏冬 / 茶漬飯', '燒鯖魚/一夜干 (去皮避開腩位)', '枝豆 / 茶碗蒸 / 清酒煮花甲'],
    yellow: ['蟹籽 / 海膽 / 鯖魚壽司', '照燒雞扒'],
    red: ['魚腩部位 (三文魚腩/吞拿魚腩)', '左口魚裙邊 / 鰻魚 / 腐皮 / 沙律醬壽司 (花之戀)', '拉麵 / 日式炒麵 / 炒飯 / 咖喱菜式 / 天婦羅炸物']
  },
  {
    type: '泰國 / 越南菜 / 韓式',
    green: ['海南雞飯 (去皮，油飯轉白飯)', '雞絲/海鮮湯/撈檬粉 (走花生炸蒜)', '大蝦米紙卷 / 生蝦刺身 / 明爐烏頭魚', '韓式：泡菜 / 水冷麵 / 雞肉石頭鍋飯 (走油) / 辣豆腐鍋 / 蒸魚'],
    yellow: ['生牛肉/熟牛肉/扎肉檬粉', '韓式醃製小菜 (蘿蔔/薯仔/黑豆)'],
    red: ['炒飯 / 炒粉麵 / 炒河粉 / 冬陰功 / 喇沙', '香茅豬扒/雞扒/豬頸肉/沙嗲串燒/炸蝦餅/春卷', '韓式：炒年糕 / 部隊鍋 / 炸雞 / 醃肉 (牛肋骨/五花腩)']
  }
];

export default function App() {
  const [currentDate, setCurrentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'presets' | 'exchanges' | 'dineout' | 'calculator' | 'history'
  
  // User Profile
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('hk_cal_profile');
    return saved ? JSON.parse(saved) : {
      gender: 'female',
      age: 28,
      height: 162,
      weight: 58,
      activityLevel: '1.375',
      goal: 'lose',
      targetCalories: 1500,
      targetCarbs: 168,
      targetProtein: 90,
      targetFat: 50,
      waterGoalMl: 2000
    };
  });

  // Food logs
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('hk_cal_logs');
    return saved ? JSON.parse(saved) : {};
  });

  // Water logs
  const [waterLogs, setWaterLogs] = useState(() => {
    const saved = localStorage.getItem('hk_water_logs');
    return saved ? JSON.parse(saved) : {};
  });

  // Custom presets
  const [presets, setPresets] = useState(() => {
    const saved = localStorage.getItem('hk_cal_presets');
    return saved ? JSON.parse(saved) : INITIAL_PRESET_FOODS;
  });

  // Modals & UI State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('早餐');
  const [isCustomFoodModalOpen, setIsCustomFoodModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [portionMultiplier, setPortionMultiplier] = useState(1);

  // Custom Food Form
  const [customFood, setCustomFood] = useState({
    name: '', calories: '', protein: '', carbs: '', fat: '', defaultUnit: '份'
  });

  useEffect(() => {
    localStorage.setItem('hk_cal_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('hk_cal_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('hk_water_logs', JSON.stringify(waterLogs));
  }, [waterLogs]);

  useEffect(() => {
    localStorage.setItem('hk_cal_presets', JSON.stringify(presets));
  }, [presets]);

  const todayLogs = useMemo(() => logs[currentDate] || [], [logs, currentDate]);
  const todayWater = waterLogs[currentDate] || 0;

  const summary = useMemo(() => {
    return todayLogs.reduce((acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [todayLogs]);

  const handleAddLog = (foodItem, portion) => {
    const mult = parseFloat(portion) || 1;
    const newEntry = {
      id: Date.now().toString(),
      meal: selectedMealType,
      name: foodItem.name,
      calories: Math.round(foodItem.calories * mult),
      protein: parseFloat((foodItem.protein * mult).toFixed(1)),
      carbs: parseFloat((foodItem.carbs * mult).toFixed(1)),
      fat: parseFloat((foodItem.fat * mult).toFixed(1)),
      portion: `${mult} ${foodItem.defaultUnit || '份'}`
    };

    setLogs(prev => ({
      ...prev,
      [currentDate]: [...(prev[currentDate] || []), newEntry]
    }));

    setIsLogModalOpen(false);
    setSelectedPreset(null);
    setPortionMultiplier(1);
  };

  const handleDeleteLog = (id) => {
    setLogs(prev => ({
      ...prev,
      [currentDate]: (prev[currentDate] || []).filter(item => item.id !== id)
    }));
  };

  const handleWaterAdd = (amountMl) => {
    setWaterLogs(prev => ({
      ...prev,
      [currentDate]: Math.max(0, (prev[currentDate] || 0) + amountMl)
    }));
  };

  const handleQuickAddBreakfastRatio = () => {
    const combo = [
      { name: '嘉頓低糖全麥吐司 (2.5片)', calories: 185, protein: 8.8, carbs: 31.0, fat: 2.5, portion: '2.5 片 (3穀)' },
      { name: '水浸吞拿魚 (半罐)', calories: 70, protein: 16.0, carbs: 0.0, fat: 0.5, portion: '0.5 罐 (1肉)' },
      { name: '自製希臘乳酪 (150ml)', calories: 80, protein: 12.0, carbs: 5.0, fat: 0.0, portion: '1 碗 (1奶)' },
      { name: '牛油果 (1/4個 / 堅果10g)', calories: 75, protein: 1.0, carbs: 3.5, fat: 7.0, portion: '1 份 (1脂)' }
    ];

    const newEntries = combo.map((item, idx) => ({
      id: `${Date.now()}-${idx}`,
      meal: '早餐',
      ...item
    }));

    setLogs(prev => ({
      ...prev,
      [currentDate]: [...(prev[currentDate] || []), ...newEntries]
    }));
  };

  const handleCreateCustomFood = (e) => {
    e.preventDefault();
    if (!customFood.name || !customFood.calories) return;

    const newFood = {
      id: 'custom-' + Date.now(),
      name: customFood.name,
      category: '自訂食物',
      calories: parseFloat(customFood.calories) || 0,
      protein: parseFloat(customFood.protein) || 0,
      carbs: parseFloat(customFood.carbs) || 0,
      fat: parseFloat(customFood.fat) || 0,
      defaultUnit: customFood.defaultUnit || '份'
    };

    setPresets(prev => [newFood, ...prev]);
    setCustomFood({ name: '', calories: '', protein: '', carbs: '', fat: '', defaultUnit: '份' });
    setIsCustomFoodModalOpen(false);
  };

  const calculateTDEE = (p) => {
    let bmr = (10 * p.weight) + (6.25 * p.height) - (5 * p.age);
    bmr += (p.gender === 'male' ? 5 : -161);

    const tdee = bmr * parseFloat(p.activityLevel);
    let targetCal = tdee;

    if (p.goal === 'lose') targetCal -= 400;
    else if (p.goal === 'gain') targetCal += 300;

    targetCal = Math.round(targetCal);

    const targetProt = Math.round(p.weight * 1.8);
    const targetFatGrams = Math.round((targetCal * 0.25) / 9);
    const remainingCalForCarbs = targetCal - (targetProt * 4) - (targetFatGrams * 9);
    const targetCarbsGrams = Math.round(Math.max(50, remainingCalForCarbs / 4));

    return {
      targetCalories: targetCal,
      targetProtein: targetProt,
      targetFat: targetFatGrams,
      targetCarbs: targetCarbsGrams
    };
  };

  const handleUpdateProfile = (updatedFields) => {
    const newProfile = { ...profile, ...updatedFields };
    const calculated = calculateTDEE(newProfile);
    setProfile({ ...newProfile, ...calculated });
  };

  const categories = ['全部', '優質蛋白質', '麵包/澱粉', '乳酪/奶類', '港式外食', '蔬菜/纖維', '油脂/堅果', '自訂食物'];

  const filteredPresets = useMemo(() => {
    return presets.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [presets, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 md:pb-8">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Flame className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">港式卡路里 & 營養管家</h1>
              <p className="text-xs text-emerald-100">HK Calorie & Macro Tracker</p>
            </div>
          </div>

          {/* DATE SELECTOR */}
          <div className="flex items-center gap-1 bg-teal-800/50 backdrop-blur-md rounded-lg p-1 text-sm">
            <button 
              onClick={() => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() - 1);
                setCurrentDate(d.toISOString().split('T')[0]);
              }}
              className="p-1 hover:bg-white/10 rounded transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input 
              type="date" 
              value={currentDate} 
              onChange={(e) => setCurrentDate(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs sm:text-sm"
            />
            <button 
              onClick={() => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() + 1);
                setCurrentDate(d.toISOString().split('T')[0]);
              }}
              className="p-1 hover:bg-white/10 rounded transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 pt-4">

        {/* TAB NAVIGATION */}
        <div className="flex bg-white rounded-xl shadow-sm p-1 border border-slate-200 mb-6 gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 min-w-[80px] py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PieChart className="w-4 h-4" /> 今日概覽
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 min-w-[80px] py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition whitespace-nowrap ${
              activeTab === 'presets' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Utensils className="w-4 h-4" /> 食物庫
          </button>
          <button
            onClick={() => setActiveTab('exchanges')}
            className={`flex-1 min-w-[80px] py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition whitespace-nowrap ${
              activeTab === 'exchanges' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" /> 份量換算
          </button>
          <button
            onClick={() => setActiveTab('dineout')}
            className={`flex-1 min-w-[80px] py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition whitespace-nowrap ${
              activeTab === 'dineout' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" /> 外食指南
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 min-w-[80px] py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition whitespace-nowrap ${
              activeTab === 'calculator' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-4 h-4" /> 目標設定
          </button>
        </div>

        {/* ----------------- TAB 1: DASHBOARD ----------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">

            {/* QUICK PRESET BUTTON FOR BREAKFAST RATIO */}
            <div className="bg-gradient-to-r from-amber-500/10 to-teal-500/10 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block mb-1">
                  黃金早餐比例框架
                </span>
                <h3 className="text-sm font-bold text-slate-800">一鍵帶入「1奶、3穀、1肉、1脂」標準減脂早餐</h3>
                <p className="text-xs text-slate-500">含 2.5片嘉頓全麥吐司 + 水浸吞拿魚 + 希臘乳酪 + 優質油脂</p>
              </div>
              <button
                onClick={handleQuickAddBreakfastRatio}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" /> 一鍵紀錄黃金早餐
              </button>
            </div>

            {/* CALORIE PROGRESS CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                    <Activity className="w-5 h-5 text-teal-600" /> 今日卡路里進度
                  </h2>
                  <p className="text-xs text-slate-500">目標：{profile.targetCalories} kcal</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-teal-600">{summary.calories}</span>
                  <span className="text-xs text-slate-400 font-medium"> / {profile.targetCalories} kcal</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden mb-3">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    summary.calories > profile.targetCalories ? 'bg-rose-500' : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, (summary.calories / profile.targetCalories) * 100)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <p className="text-[11px] text-slate-400 font-medium">已攝入</p>
                  <p className="text-sm font-bold text-slate-700">{summary.calories} kcal</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <p className="text-[11px] text-slate-400 font-medium">剩餘配額</p>
                  <p className={`text-sm font-bold ${profile.targetCalories - summary.calories < 0 ? 'text-rose-500' : 'text-teal-600'}`}>
                    {profile.targetCalories - summary.calories} kcal
                  </p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <p className="text-[11px] text-slate-400 font-medium">達成率</p>
                  <p className="text-sm font-bold text-slate-700">
                    {Math.round((summary.calories / profile.targetCalories) * 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* MACRONUTRIENT BREAKDOWN CARDS */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-amber-600">碳水化合物</span>
                  <span className="text-[10px] text-slate-400">{summary.carbs}g / {profile.targetCarbs}g</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div 
                    className="bg-amber-400 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (summary.carbs / profile.targetCarbs) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs font-semibold text-slate-700 text-right">{Math.round((summary.carbs / profile.targetCarbs) * 100)}%</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-teal-600">蛋白質</span>
                  <span className="text-[10px] text-slate-400">{summary.protein}g / {profile.targetProtein}g</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div 
                    className="bg-teal-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (summary.protein / profile.targetProtein) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs font-semibold text-slate-700 text-right">{Math.round((summary.protein / profile.targetProtein) * 100)}%</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-rose-500">優質脂肪</span>
                  <span className="text-[10px] text-slate-400">{summary.fat}g / {profile.targetFat}g</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div 
                    className="bg-rose-400 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (summary.fat / profile.targetFat) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs font-semibold text-slate-700 text-right">{Math.round((summary.fat / profile.targetFat) * 100)}%</p>
              </div>
            </div>

            {/* WATER INTAKE TRACKER */}
            <div className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-200/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-500 text-white rounded-2xl shadow-sm">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">純水飲用追蹤器 (暢通腸道)</h3>
                  <p className="text-xs text-slate-500">已喝：{todayWater} ml / 目標 {profile.waterGoalMl} ml (請勿用咖啡或濃茶代替)</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleWaterAdd(250)}
                  className="flex-1 sm:flex-none bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition"
                >
                  +250ml (1杯)
                </button>
                <button
                  onClick={() => handleWaterAdd(500)}
                  className="flex-1 sm:flex-none bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition"
                >
                  +500ml (1支)
                </button>
                <button
                  onClick={() => handleWaterAdd(-250)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-bold px-2.5 py-2 rounded-xl transition"
                >
                  -250
                </button>
              </div>
            </div>

            {/* MEAL LOGGING SECTIONS */}
            {['早餐', '午餐', '晚餐', '小食'].map((meal) => {
              const mealLogs = todayLogs.filter(item => item.meal === meal);
              const mealCal = mealLogs.reduce((sum, item) => sum + item.calories, 0);

              return (
                <div key={meal} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50/80 px-4 py-3 flex justify-between items-center border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{meal}</span>
                      <span className="text-xs bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {mealCal} kcal
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMealType(meal);
                        setIsLogModalOpen(true);
                      }}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> 記錄食物
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {mealLogs.length === 0 ? (
                      <p className="text-xs text-slate-400 p-4 text-center">尚未記錄食物</p>
                    ) : (
                      mealLogs.map(item => (
                        <div key={item.id} className="p-3.5 flex justify-between items-center hover:bg-slate-50 transition">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <h4 className="font-medium text-sm text-slate-800">{item.name}</h4>
                              <span className="text-xs text-slate-400">({item.portion})</span>
                            </div>
                            <div className="flex gap-3 text-[11px] text-slate-500 mt-1">
                              <span>P: <strong className="text-slate-700">{item.protein}g</strong></span>
                              <span>C: <strong className="text-slate-700">{item.carbs}g</strong></span>
                              <span>F: <strong className="text-slate-700">{item.fat}g</strong></span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-teal-600">{item.calories} kcal</span>
                            <button
                              onClick={() => handleDeleteLog(item.id)}
                              className="text-slate-300 hover:text-rose-500 transition p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ----------------- TAB 2: PRESET FOOD DATABASE ----------------- */}
        {activeTab === 'presets' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> 港式常見食物資料庫
                </h2>
                <p className="text-xs text-slate-500">快速查找並一鍵登錄常用的港式外食與家常食材</p>
              </div>
              <button
                onClick={() => setIsCustomFoodModalOpen(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> 自訂新食物
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  placeholder="搜尋食物，例如：嘉頓全麥吐司、米線、希臘乳酪..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                      selectedCategory === cat 
                        ? 'bg-slate-800 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPresets.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-teal-300 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">標準份量：1 {item.defaultUnit}</p>
                    <div className="flex gap-3 text-xs text-slate-600 pt-1">
                      <span>卡路里: <strong className="text-teal-600">{item.calories}</strong></span>
                      <span>P: <strong>{item.protein}g</strong></span>
                      <span>C: <strong>{item.carbs}g</strong></span>
                      <span>F: <strong>{item.fat}g</strong></span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPreset(item);
                      setIsLogModalOpen(true);
                    }}
                    className="bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white p-2.5 rounded-xl transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: PORTION EXCHANGES GUIDE ----------------- */}
        {activeTab === 'exchanges' && (
          <div className="space-y-4">
            <div className="bg-teal-700 text-white p-5 rounded-2xl shadow-sm">
              <h2 className="text-base font-bold flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 text-amber-300" /> 食物份量對換對照表
              </h2>
              <p className="text-xs text-teal-100">
                減脂期間無需捱餓！只需根據以下「1 份」標準靈活對換食材，就能精準掌控五穀、蛋白質與脂肪配額。
              </p>
            </div>

            <div className="space-y-4">
              {PORTION_EXCHANGES.map((group, index) => (
                <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200">
                    <h3 className="font-bold text-sm text-teal-800">{group.category}</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {group.items.map((item, idx) => (
                      <div key={idx} className="p-3 flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <span className="bg-teal-50 text-teal-700 font-bold px-2.5 py-1 rounded-lg border border-teal-100">
                          {item.portion}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: DINE-OUT SMART GUIDE ----------------- */}
        {activeTab === 'dineout' && (
          <div className="space-y-4">
            <div className="bg-emerald-800 text-white p-5 rounded-2xl shadow-sm">
              <h2 className="text-base font-bold flex items-center gap-2 mb-1">
                <Compass className="w-5 h-5 text-amber-300" /> 外出飲食紅黃綠燈精明點餐指南
              </h2>
              <p className="text-xs text-emerald-100">
                香港外食族必備：綠燈放心食，黃金期選黃燈，減重期堅決避免紅燈高油醬汁！
              </p>
            </div>

            <div className="space-y-4">
              {DINE_OUT_GUIDE.map((guide, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                  <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-teal-600" /> {guide.type}
                  </h3>

                  {/* GREEN */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> 🟢 綠燈 (減重期推薦高優先首選)
                    </div>
                    <ul className="text-xs text-emerald-900 space-y-0.5 list-disc list-inside pt-1">
                      {guide.green.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>

                  {/* YELLOW */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600" /> 🟡 黃燈 (保持期可間中選擇)
                    </div>
                    <ul className="text-xs text-amber-900 space-y-0.5 list-disc list-inside pt-1">
                      {guide.yellow.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>

                  {/* RED */}
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-600" /> 🔴 紅燈 (高脂高糖陷阱，減重期宜避免)
                    </div>
                    <ul className="text-xs text-rose-900 space-y-0.5 list-disc list-inside pt-1">
                      {guide.red.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 5: BMR / TDEE CALCULATOR ----------------- */}
        {activeTab === 'calculator' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Scale className="w-5 h-5 text-teal-600" /> 個人目標與 TDEE 計算器
              </h2>
              <p className="text-xs text-slate-500">根據身高、體重與運動量自動計算每日卡路里及三大營養素配額。</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">性別</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateProfile({ gender: 'female' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      profile.gender === 'female' ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    女性 (Female)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateProfile({ gender: 'male' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      profile.gender === 'male' ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    男性 (Male)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">年齡</label>
                <input 
                  type="number" 
                  value={profile.age} 
                  onChange={(e) => handleUpdateProfile({ age: parseInt(e.target.value) || 25 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">身高 (cm)</label>
                <input 
                  type="number" 
                  value={profile.height} 
                  onChange={(e) => handleUpdateProfile({ height: parseInt(e.target.value) || 160 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">體重 (kg)</label>
                <input 
                  type="number" 
                  value={profile.weight} 
                  onChange={(e) => handleUpdateProfile({ weight: parseFloat(e.target.value) || 50 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">日常活動量</label>
                <select
                  value={profile.activityLevel}
                  onChange={(e) => handleUpdateProfile({ activityLevel: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                >
                  <option value="1.2">久坐 / 文職缺乏運動 (BMR × 1.2)</option>
                  <option value="1.375">輕度活動 (每週運動 1-3 天) (BMR × 1.375)</option>
                  <option value="1.55">中度活動 (每週運動 3-5 天) (BMR × 1.55)</option>
                  <option value="1.725">高度活動 (每週運動 6-7 天) (BMR × 1.725)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">減重 / 健康目標</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateProfile({ goal: 'lose' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      profile.goal === 'lose' ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    減脂瘦身 (-400 kcal)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateProfile({ goal: 'maintain' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      profile.goal === 'maintain' ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    維持體重 (Maintain)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateProfile({ goal: 'gain' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      profile.goal === 'gain' ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    增肌塑形 (+300 kcal)
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-teal-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-teal-600" /> 計算出的每日建議營養目標
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                  <p className="text-[10px] text-slate-400 font-medium">每日總卡路里</p>
                  <p className="text-lg font-black text-teal-600">{profile.targetCalories} kcal</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                  <p className="text-[10px] text-slate-400 font-medium">蛋白質 (1.8g/kg)</p>
                  <p className="text-lg font-black text-slate-700">{profile.targetProtein} g</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                  <p className="text-[10px] text-slate-400 font-medium">碳水化合物</p>
                  <p className="text-lg font-black text-slate-700">{profile.targetCarbs} g</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                  <p className="text-[10px] text-slate-400 font-medium">優質脂肪</p>
                  <p className="text-lg font-black text-slate-700">{profile.targetFat} g</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ----------------- LOG FOOD MODAL ----------------- */}
      {isLogModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">
                新增食物至【{selectedMealType}】
              </h3>
              <button 
                onClick={() => {
                  setIsLogModalOpen(false);
                  setSelectedPreset(null);
                }} 
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {!selectedPreset ? (
              <div className="space-y-3">
                <input 
                  type="text"
                  placeholder="搜尋食物名稱..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl">
                  {filteredPresets.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedPreset(item)}
                      className="p-3 hover:bg-teal-50 cursor-pointer flex justify-between items-center transition"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-400">標準 1 {item.defaultUnit} = {item.calories} kcal</p>
                      </div>
                      <span className="text-xs font-semibold text-teal-600">選擇</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-100 space-y-1">
                  <h4 className="font-bold text-slate-800 text-base">{selectedPreset.name}</h4>
                  <p className="text-xs text-slate-500">
                    單份營養：{selectedPreset.calories} kcal | P: {selectedPreset.protein}g | C: {selectedPreset.carbs}g | F: {selectedPreset.fat}g
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    食用份量數量 (單位: {selectedPreset.defaultUnit})
                  </label>
                  <input 
                    type="number"
                    step="0.25"
                    min="0.1"
                    value={portionMultiplier}
                    onChange={(e) => setPortionMultiplier(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-center"
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <span>預計總卡路里：</span>
                  <span className="text-base font-black text-teal-600">
                    {Math.round(selectedPreset.calories * (parseFloat(portionMultiplier) || 1))} kcal
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPreset(null)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition"
                  >
                    重選食物
                  </button>
                  <button
                    onClick={() => handleAddLog(selectedPreset, portionMultiplier)}
                    className="flex-2 py-3 bg-teal-600 text-white rounded-xl font-bold text-xs hover:bg-teal-700 transition"
                  >
                    確認加入 {selectedMealType}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- CREATE CUSTOM FOOD MODAL ----------------- */}
      {isCustomFoodModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">自訂新食物營養數據</h3>
              <button 
                onClick={() => setIsCustomFoodModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomFood} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">食物名稱</label>
                <input 
                  type="text" 
                  required
                  placeholder="例如：自製燕麥碗"
                  value={customFood.name}
                  onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">卡路里 (kcal)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="250"
                    value={customFood.calories}
                    onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">單位 (例如：碗/片/克)</label>
                  <input 
                    type="text" 
                    placeholder="碗"
                    value={customFood.defaultUnit}
                    onChange={(e) => setCustomFood({ ...customFood, defaultUnit: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">蛋白質 (g)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="10"
                    value={customFood.protein}
                    onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">碳水 (g)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="30"
                    value={customFood.carbs}
                    onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">脂肪 (g)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="5"
                    value={customFood.fat}
                    onChange={(e) => setCustomFood({ ...customFood, fat: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold text-xs hover:bg-teal-700 transition mt-2"
              >
                儲存至我的食物資料庫
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 sm:hidden flex justify-around p-2">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 ${activeTab === 'dashboard' ? 'text-teal-600 font-bold' : 'text-slate-400'}`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">概覽</span>
        </button>
        <button 
          onClick={() => setActiveTab('presets')}
          className={`flex flex-col items-center py-1 px-2 ${activeTab === 'presets' ? 'text-teal-600 font-bold' : 'text-slate-400'}`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">食物庫</span>
        </button>
        <button 
          onClick={() => setActiveTab('exchanges')}
          className={`flex flex-col items-center py-1 px-2 ${activeTab === 'exchanges' ? 'text-teal-600 font-bold' : 'text-slate-400'}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">換算</span>
        </button>
        <button 
          onClick={() => setActiveTab('dineout')}
          className={`flex flex-col items-center py-1 px-2 ${activeTab === 'dineout' ? 'text-teal-600 font-bold' : 'text-slate-400'}`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">外食</span>
        </button>
        <button 
          onClick={() => setActiveTab('calculator')}
          className={`flex flex-col items-center py-1 px-2 ${activeTab === 'calculator' ? 'text-teal-600 font-bold' : 'text-slate-400'}`}
        >
          <Scale className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">目標</span>
        </button>
      </nav>
    </div>
  );
}
