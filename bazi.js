/**
 * 八字排盘核心算法
 * 基于传统八字命理学
 */

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 天干五行
const GAN_WUXING = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
};

// 地支五行
const ZHI_WUXING = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 地支藏干
const ZHI_CANG_GAN = {
    '子': ['癸'],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙'],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '庚', '戊'],
    '午': ['丁', '己'],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛'],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲']
};

// 年上起月表（年干对应正月月干）
const NIAN_SHANG_QI_YUE = {
    '甲': '丙', '乙': '戊', '丙': '庚', '丁': '壬', '戊': '甲',
    '己': '丙', '庚': '戊', '辛': '庚', '壬': '壬', '癸': '甲'
};

// 日上起时表（日干对应子时时干）
const RI_SHANG_QI_SHI = {
    '甲': '甲', '乙': '丙', '丙': '戊', '丁': '庚', '戊': '壬',
    '己': '甲', '庚': '丙', '辛': '戊', '壬': '庚', '癸': '壬'
};

// 日主性格分析
const DAY_MASTER_PERSONALITY = {
    '甲': {
        title: '甲木日主',
        traits: ['仁慈正直', '有领导才能', '积极向上', '独立自主'],
        desc: '如参天大树，性格刚直，有上进心，喜欢帮助别人，有领导气质。',
        career: '适合管理、教育、医疗、环保等行业。',
        love: '感情专一，但有时候过于固执，需要学会变通。'
    },
    '乙': {
        title: '乙木日主',
        traits: ['温柔细腻', '善于交际', '适应力强', '心思缜密'],
        desc: '如花草藤蔓，性格柔和，善于察言观色，适应环境能力强。',
        career: '适合艺术、设计、策划、销售、公关等行业。',
        love: '感情丰富细腻，容易多愁善感，需要安全感。'
    },
    '丙': {
        title: '丙火日主',
        traits: ['热情开朗', '光明磊落', '有感染力', '急躁冲动'],
        desc: '如太阳之火，性格热情，光明正大，有感染力，但容易急躁。',
        career: '适合演艺、传媒、能源、餐饮、照明等行业。',
        love: '热情主动，喜欢浪漫，但有时候脾气急躁。'
    },
    '丁': {
        title: '丁火日主',
        traits: ['温和内敛', '心思细腻', '有艺术天赋', '敏感多思'],
        desc: '如灯烛之火，性格温和，心思细腻，有艺术气质，敏感多思。',
        career: '适合艺术、文化、教育、心理咨询、电子等行业。',
        love: '感情细腻专一，但容易患得患失，需要被理解。'
    },
    '戊': {
        title: '戊土日主',
        traits: ['诚实守信', '稳重踏实', '包容大度', '固执保守'],
        desc: '如大地之土，性格稳重，诚实守信，包容大度，但有时候固执。',
        career: '适合房地产、建筑、农业、金融、矿产等行业。',
        love: '感情稳定专一，重视家庭，但不够浪漫。'
    },
    '己': {
        title: '己土日主',
        traits: ['心思细腻', '善于谋划', '多才多艺', '多疑犹豫'],
        desc: '如田园之土，性格细腻，善于谋划，多才多艺，但容易多疑。',
        career: '适合策划、咨询、教育、艺术、农业等行业。',
        love: '感情丰富但多变，需要学会信任和坚持。'
    },
    '庚': {
        title: '庚金日主',
        traits: ['刚毅果断', '讲义气', '有正义感', '好面子'],
        desc: '如刀剑之金，性格刚毅，讲义气，有正义感，但好面子。',
        career: '适合金融、法律、军警、机械、汽车等行业。',
        love: '感情直接坦率，但有时候过于强硬，需要学会温柔。'
    },
    '辛': {
        title: '辛金日主',
        traits: ['精致优雅', '追求完美', '善于表达', '虚荣心强'],
        desc: '如珠玉之金，性格精致，追求完美，善于表达，但虚荣心较强。',
        career: '适合珠宝、艺术、传媒、金融、美容等行业。',
        love: '注重外表和感觉，追求浪漫，但有时候过于挑剔。'
    },
    '壬': {
        title: '壬水日主',
        traits: ['聪明机智', '善于变通', '胸怀宽广', '善变不定'],
        desc: '如江河之水，性格聪明，善于变通，胸怀宽广，但容易善变。',
        career: '适合贸易、物流、旅游、传媒、水利等行业。',
        love: '感情丰富多变，喜欢新鲜感，需要学会专一。'
    },
    '癸': {
        title: '癸水日主',
        traits: ['聪明灵巧', '善于谋略', '有灵性', '多愁善感'],
        desc: '如雨露之水，性格聪明灵巧，善于谋略，有灵性，但多愁善感。',
        career: '适合策划、咨询、艺术、心理、玄学等行业。',
        love: '感情细腻敏感，容易陷入幻想，需要现实一点。'
    }
};

// 五行旺衰分析
function analyzeWuxingStrength(counts) {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const result = {};
    
    for (let wx in counts) {
        const percentage = (counts[wx] / total * 100).toFixed(1);
        let status = '';
        if (counts[wx] >= 3) status = '旺';
        else if (counts[wx] === 2) status = '平';
        else if (counts[wx] === 1) status = '弱';
        else status = '缺';
        
        result[wx] = {
            count: counts[wx],
            percentage: percentage,
            status: status
        };
    }
    
    return result;
}

// 生成五行建议
function generateWuxingAdvice(wuxingAnalysis) {
    const strong = [];
    const weak = [];
    
    for (let wx in wuxingAnalysis) {
        if (wuxingAnalysis[wx].status === '旺') strong.push(wx);
        if (wuxingAnalysis[wx].status === '弱' || wuxingAnalysis[wx].status === '缺') weak.push(wx);
    }
    
    let advice = '';
    
    if (strong.length > 0) {
        advice += `您的八字${strong.join('、')}较旺，性格上可能表现出${getWuxingTraits(strong[0])}的特质。`;
    }
    
    if (weak.length > 0) {
        advice += `建议在生活中多补充${weak.join('、')}元素，如${getWuxingSuggestions(weak)}。`;
    }
    
    return advice;
}

function getWuxingTraits(wuxing) {
    const traits = {
        '木': '仁慈、有主见、积极向上',
        '火': '热情、开朗、有感染力',
        '土': '稳重、诚信、包容',
        '金': '果断、讲义气、有正义感',
        '水': '聪明、灵活、善于变通'
    };
    return traits[wuxing] || '';
}

function getWuxingSuggestions(wuxingList) {
    const suggestions = {
        '木': '多接触绿色植物、穿绿色衣服、去东方发展',
        '火': '多晒太阳、穿红色衣服、从事热情的行业',
        '土': '多接触大地、穿黄色衣服、从事稳定的行业',
        '金': '佩戴金属饰品、穿白色衣服、从事金融行业',
        '水': '多喝水、穿黑色衣服、从事流动性强的行业'
    };
    
    return wuxingList.map(wx => suggestions[wx]).join('；');
}

/**
 * 计算八字
 * @param {Date} date - 公历出生日期
 * @param {number} hour - 小时 (0-23)
 * @param {number} minute - 分钟
 * @returns {Object} 八字结果
 */
function calculateBaziFromDate(date, hour, minute) {
    // 转换为农历（简化算法，使用近似值）
    const lunar = solarToLunar(date);
    
    // 计算年柱
    const yearGan = TIAN_GAN[(lunar.year - 4) % 10];
    const yearZhi = DI_ZHI[(lunar.year - 4) % 12];
    
    // 计算月柱
    const monthGan = calculateMonthGan(yearGan, lunar.month);
    const monthZhi = DI_ZHI[(lunar.month + 1) % 12]; // 正月建寅
    
    // 计算日柱（使用简化算法）
    const dayPillar = calculateDayPillar(date);
    
    // 计算时柱
    const hourZhiIndex = getHourZhiIndex(hour);
    const hourGan = calculateHourGan(dayPillar.gan, hourZhiIndex);
    const hourZhi = DI_ZHI[hourZhiIndex];
    
    return {
        year: { gan: yearGan, zhi: yearZhi },
        month: { gan: monthGan, zhi: monthZhi },
        day: { gan: dayPillar.gan, zhi: dayPillar.zhi },
        hour: { gan: hourGan, zhi: hourZhi },
        lunar: lunar
    };
}

/**
 * 公历转农历（简化版）
 */
function solarToLunar(date) {
    // 这里使用简化算法，实际应该用更精确的农历库
    // 为了演示，使用近似值
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 简单的农历偏移（实际应该用农历库）
    const lunarYear = year;
    const lunarMonth = month;
    const lunarDay = day;
    
    return {
        year: lunarYear,
        month: lunarMonth,
        day: lunarDay
    };
}

/**
 * 计算月干
 */
function calculateMonthGan(yearGan, lunarMonth) {
    const startGan = NIAN_SHANG_QI_YUE[yearGan];
    const startIndex = TIAN_GAN.indexOf(startGan);
    // 正月是第1个月，索引从0开始
    const monthIndex = (lunarMonth - 1 + startIndex) % 10;
    return TIAN_GAN[monthIndex];
}

/**
 * 计算日柱（使用已知基准日推算）
 * 基准：1900年1月31日为甲辰日
 */
function calculateDayPillar(date) {
    const baseDate = new Date(1900, 0, 31); // 1900年1月31日
    const baseGanIndex = 0; // 甲
    const baseZhiIndex = 4; // 辰
    
    const diffTime = date.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const ganIndex = (baseGanIndex + diffDays) % 10;
    const zhiIndex = (baseZhiIndex + diffDays) % 12;
    
    return {
        gan: TIAN_GAN[ganIndex],
        zhi: DI_ZHI[zhiIndex]
    };
}

/**
 * 获取时辰地支索引
 */
function getHourZhiIndex(hour) {
    // 子时 23-1, 丑时 1-3, 寅时 3-5, ...
    if (hour >= 23 || hour < 1) return 0;  // 子
    if (hour >= 1 && hour < 3) return 1;   // 丑
    if (hour >= 3 && hour < 5) return 2;   // 寅
    if (hour >= 5 && hour < 7) return 3;   // 卯
    if (hour >= 7 && hour < 9) return 4;   // 辰
    if (hour >= 9 && hour < 11) return 5;  // 巳
    if (hour >= 11 && hour < 13) return 6; // 午
    if (hour >= 13 && hour < 15) return 7; // 未
    if (hour >= 15 && hour < 17) return 8; // 申
    if (hour >= 17 && hour < 19) return 9; // 酉
    if (hour >= 19 && hour < 21) return 10; // 戌
    return 11; // 亥
}

/**
 * 计算时干
 */
function calculateHourGan(dayGan, hourZhiIndex) {
    const startGan = RI_SHANG_QI_SHI[dayGan];
    const startIndex = TIAN_GAN.indexOf(startGan);
    const ganIndex = (startIndex + hourZhiIndex) % 10;
    return TIAN_GAN[ganIndex];
}

/**
 * 统计五行
 */
function countWuxing(bazi) {
    const counts = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    
    // 统计天干五行
    const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour];
    pillars.forEach(pillar => {
        counts[GAN_WUXING[pillar.gan]]++;
        counts[ZHI_WUXING[pillar.zhi]]++;
    });
    
    return counts;
}

/**
 * 主计算函数
 */
function calculateBazi() {
    const dateInput = document.getElementById('birthDate').value;
    const timeInput = document.getElementById('birthTime').value;
    
    if (!dateInput || !timeInput) {
        alert('请填写完整的出生日期和时间');
        return;
    }
    
    const date = new Date(dateInput);
    const [hour, minute] = timeInput.split(':').map(Number);
    
    // 只验证：不能是未来日期，且年份不能早于1900年（算法限制）
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (date > today) {
        alert('请检查出生日期是否正确');
        return;
    }
    
    if (date.getFullYear() < 1900) {
        alert('抱歉，暂不支持1900年以前的日期');
        return;
    }
    
    // 计算八字
    const bazi = calculateBaziFromDate(date, hour, minute);
    
    // 显示结果
    displayResult(bazi);
}

/**
 * 显示结果
 */
function displayResult(bazi) {
    // 显示四柱
    document.getElementById('yearGan').textContent = bazi.year.gan;
    document.getElementById('yearGan').setAttribute('data-wuxing', GAN_WUXING[bazi.year.gan]);
    document.getElementById('yearZhi').textContent = bazi.year.zhi;
    document.getElementById('yearZhi').setAttribute('data-wuxing', ZHI_WUXING[bazi.year.zhi]);
    
    document.getElementById('monthGan').textContent = bazi.month.gan;
    document.getElementById('monthGan').setAttribute('data-wuxing', GAN_WUXING[bazi.month.gan]);
    document.getElementById('monthZhi').textContent = bazi.month.zhi;
    document.getElementById('monthZhi').setAttribute('data-wuxing', ZHI_WUXING[bazi.month.zhi]);
    
    document.getElementById('dayGan').textContent = bazi.day.gan;
    document.getElementById('dayGan').setAttribute('data-wuxing', GAN_WUXING[bazi.day.gan]);
    document.getElementById('dayZhi').textContent = bazi.day.zhi;
    document.getElementById('dayZhi').setAttribute('data-wuxing', ZHI_WUXING[bazi.day.zhi]);
    
    document.getElementById('hourGan').textContent = bazi.hour.gan;
    document.getElementById('hourGan').setAttribute('data-wuxing', GAN_WUXING[bazi.hour.gan]);
    document.getElementById('hourZhi').textContent = bazi.hour.zhi;
    document.getElementById('hourZhi').setAttribute('data-wuxing', ZHI_WUXING[bazi.hour.zhi]);
    
    // 统计并显示五行
    const wuxingCounts = countWuxing(bazi);
    displayWuxing(wuxingCounts);
    
    // 显示性格分析
    displayPersonality(bazi.day.gan, wuxingCounts);
    
    // 显示结果区域
    document.getElementById('resultSection').style.display = 'block';
    
    // 滚动到结果
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

/**
 * 显示性格分析
 */
function displayPersonality(dayGan, wuxingCounts) {
    const personality = DAY_MASTER_PERSONALITY[dayGan];
    const wuxingAnalysis = analyzeWuxingStrength(wuxingCounts);
    
    let html = `
        <div class="personality-card">
            <h3>性格分析</h3>
            <div class="personality-header">
                <span class="day-master">${personality.title}</span>
                <div class="traits-tags">
                    ${personality.traits.map(t => `<span class="trait-tag">${t}</span>`).join('')}
                </div>
            </div>
            <div class="personality-content">
                <p class="personality-desc">${personality.desc}</p>
                <div class="personality-sections">
                    <div class="section">
                        <h4>事业方向</h4>
                        <p>${personality.career}</p>
                    </div>
                    <div class="section">
                        <h4>感情特点</h4>
                        <p>${personality.love}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="wuxing-advice-card">
            <h3>五行建议</h3>
            <p>${generateWuxingAdvice(wuxingAnalysis)}</p>
        </div>
    `;
    
    // 插入到五行分析之后
    const wuxingSection = document.querySelector('.wuxing-section');
    const existingPersonality = document.querySelector('.personality-section');
    
    if (existingPersonality) {
        existingPersonality.innerHTML = html;
    } else {
        const personalityDiv = document.createElement('div');
        personalityDiv.className = 'personality-section';
        personalityDiv.innerHTML = html;
        wuxingSection.parentNode.insertBefore(personalityDiv, wuxingSection.nextSibling);
    }
}

/**
 * 显示五行分析
 */
function displayWuxing(counts) {
    const wuxingNames = { '木': 'mu', '火': 'huo', '土': 'tu', '金': 'jin', '水': 'shui' };
    const wuxingOrder = ['木', '火', '土', '金', '水'];
    
    let html = '';
    wuxingOrder.forEach(wx => {
        const className = wuxingNames[wx];
        html += `
            <div class="wuxing-item ${className}">
                <span class="count">${counts[wx]}</span>
                <span class="name">${wx}</span>
            </div>
        `;
    });
    
    document.getElementById('wuxingChart').innerHTML = html;
}

// 页面加载时设置默认日期为今天
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('birthDate').value = today;
    document.getElementById('birthTime').value = '12:00';
});
