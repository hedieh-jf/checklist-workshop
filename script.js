// ============================================================
// ۱. دیتای چک‌لیست
// ============================================================
const stagesData = [
    {
        name: "مرحله ۱: بررسی سخت‌افزار و فیزیکی",
        items: [
            "بررسی برق‌کشی، پریزها، مودم و UPS",
            "محکم کردن کابل‌های شبکه و برق",
            "گردگیری کیس، مانیتور و صفحه‌کلید",
            "روشن کردن همه سیستم‌ها (تست بوت)",
            "بررسی فن‌ها و تهویه",
            "چک پروژکتور یا وایت‌برد"
        ]
    },
    {
        name: "مرحله ۲: نرم‌افزار و سیستم‌عامل",
        items: [
            "نصب آخرین آپدیت‌های امنیتی",
            "آپدیت آنتی‌ویروس و اسکن سریع",
            "بررسی درایورها (Device Manager)",
            "نصب مرورگر (کروم/فایرفاکس)",
            "نصب آفیس یا LibreOffice",
            "نصب ویرایشگر کد (VS Code/Notepad++)",
            "تنظیم IP و تست اینترنت",
            "ایجاد پوشه اشتراکی"
        ]
    },
    {
        name: "مرحله ۳: شبکه و کاربران",
        items: [
            "اتصال همه سیستم‌ها به شبکه (تست پینگ)",
            "ساخت کاربر عمومی (Student)",
            "اعمال محدودیت اینترنت و نصب نرم‌افزار",
            "نصب و تست پرینتر شبکه"
        ]
    },
    {
        name: "مرحله ۴: پشتیبان‌گیری و ریست",
        items: [
            "گرفتن تصویر بک‌آپ از سیستم سالم",
            "آماده کردن فلش یا دیسک بازیابی",
            "یادداشت رمزهای Admin در دفترچه",
            "تهیه لیست مشخصات سخت‌افزاری"
        ]
    }
];

// ============================================================
// ۲. متغیرهای سراسری
// ============================================================
let checkState = [];
let totalItems = 0;
let stageItemIndices = [];

// ============================================================
// ۳. ساختار داده اولیه
// ============================================================
function buildState() {
    checkState = [];
    stageItemIndices = [];
    let idx = 0;
    
    stagesData.forEach(stage => {
        const start = idx;
        stage.items.forEach(() => {
            checkState.push(false);
            idx++;
        });
        stageItemIndices.push({ start, end: idx - 1, count: stage.items.length });
    });
    
    totalItems = checkState.length;
}
buildState();

// ============================================================
// ۴. رندر کردن مراحل
// ============================================================
function renderStages() {
    const container = document.getElementById('stagesContainer');
    if (!container) {
        console.error('❌ عنصر stagesContainer پیدا نشد!');
        return;
    }
    
    container.innerHTML = '';
    let globalIdx = 0;

    stagesData.forEach((stage, si) => {
        const stageDiv = document.createElement('div');
        stageDiv.className = 'stage';
        stageDiv.id = `stage-${si}`;

        // هدر مرحله
        const header = document.createElement('h2');
        const doneInStage = checkState.slice(stageItemIndices[si].start, stageItemIndices[si].end + 1).filter(Boolean).length;
        const totalInStage = stageItemIndices[si].count;
        header.innerHTML = `${stage.name} <span>${doneInStage}/${totalInStage}</span>`;
        stageDiv.appendChild(header);

        // آیتم‌ها با چک‌باکس
        stage.items.forEach((itemText) => {
            const globalIndex = globalIdx;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            if (checkState[globalIndex]) {
                itemDiv.classList.add('done');
            }

            // چک‌باکس
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.id = `check-${globalIndex}`;
            cb.checked = checkState[globalIndex] || false;
            
            cb.addEventListener('change', function(e) {
                checkState[globalIndex] = e.target.checked;
                updateAll();
                saveToLocal();
            });

            // لیبل
            const label = document.createElement('label');
            label.htmlFor = `check-${globalIndex}`;
            label.textContent = itemText;

            itemDiv.appendChild(cb);
            itemDiv.appendChild(label);
            stageDiv.appendChild(itemDiv);
            globalIdx++;
        });

        container.appendChild(stageDiv);
    });
    
    updateAll();
}

// ============================================================
// ۵. به‌روزرسانی پیشرفت و آمار
// ============================================================
function updateAll() {
    const done = checkState.filter(v => v).length;
    const percent = totalItems === 0 ? 0 : Math.round((done / totalItems) * 100);

    const progressBar = document.getElementById('progressBar');
    const doneCount = document.getElementById('doneCount');
    const totalCount = document.getElementById('totalCount');
    const percentDisplay = document.getElementById('percentDisplay');

    if (progressBar) progressBar.style.width = percent + '%';
    if (doneCount) doneCount.textContent = done;
    if (totalCount) totalCount.textContent = totalItems;
    if (percentDisplay) percentDisplay.textContent = percent;

    // به‌روزرسانی هر مرحله
    stagesData.forEach((stage, si) => {
        const { start, end } = stageItemIndices[si];
        const doneInStage = checkState.slice(start, end + 1).filter(Boolean).length;
        const totalInStage = end - start + 1;
        
        const headerSpan = document.querySelector(`#stage-${si} h2 span`);
        if (headerSpan) {
            headerSpan.textContent = `${doneInStage}/${totalInStage}`;
        }
        
        const stageDiv = document.getElementById(`stage-${si}`);
        if (stageDiv) {
            if (doneInStage === totalInStage && totalInStage > 0) {
                stageDiv.classList.add('done');
            } else {
                stageDiv.classList.remove('done');
            }
        }
    });

    // به‌روزرسانی کلاس done روی آیتم‌ها
    document.querySelectorAll('.stage .item').forEach((itemDiv) => {
        const cb = itemDiv.querySelector('input[type="checkbox"]');
        if (cb) {
            if (cb.checked) {
                itemDiv.classList.add('done');
            } else {
                itemDiv.classList.remove('done');
            }
        }
    });
}

// ============================================================
// ۶. ریست / تیک همه
// ============================================================
function resetAll(tickAll) {
    for (let i = 0; i < checkState.length; i++) {
        checkState[i] = tickAll;
    }
    renderStages();
    saveToLocal();
}

// ============================================================
// ۷. ذخیره و بازیابی محلی (LocalStorage)
// ============================================================
function saveToLocal() {
    try {
        localStorage.setItem('checkState', JSON.stringify(checkState));
        saveHardware();
    } catch (e) {
        console.error('❌ خطا در ذخیره:', e);
    }
}

function loadFromLocal() {
    try {
        const saved = localStorage.getItem('checkState');
        if (saved) {
            const arr = JSON.parse(saved);
            if (arr.length === checkState.length) {
                checkState = arr;
            }
        }
    } catch (e) {
        console.error('❌ خطا در بارگذاری:', e);
    }
    renderStages();
    loadHardware();
}

// ============================================================
// ۸. جدول سخت‌افزار
// ============================================================
function renderHardwareTable() {
    const tbody = document.getElementById('hwBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    let rows = [];
    try {
        const saved = localStorage.getItem('hwRows');
        if (saved) {
            rows = JSON.parse(saved);
        }
    } catch (e) {
        console.error('❌ خطا در خواندن جدول:', e);
    }

    if (rows.length === 0) {
        rows = [
            { model: 'سیستم ۱', ram: '۴', hdd: '۲۵۶', os: 'Win 10', status: 'سالم' },
            { model: 'سیستم ۲', ram: '۸', hdd: '۵۱۲', os: 'Win 11', status: 'سالم' },
            { model: 'سیستم ۳', ram: '۴', hdd: '۲۵۶', os: 'Linux', status: 'نیاز به بررسی' },
            { model: 'سیستم ۴', ram: '۸', hdd: '۱TB', os: 'Win 10', status: 'سالم' },
            { model: 'سیستم ۵', ram: '۱۶', hdd: '۵۱۲', os: 'Win 11', status: 'سالم' }
        ];
    }

    rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><input type="text" value="${row.model || ''}" data-field="model" data-row="${index}"></td>
            <td><input type="text" value="${row.ram || ''}" data-field="ram" data-row="${index}"></td>
            <td><input type="text" value="${row.hdd || ''}" data-field="hdd" data-row="${index}"></td>
            <td><input type="text" value="${row.os || ''}" data-field="os" data-row="${index}"></td>
            <td><input type="text" value="${row.status || ''}" data-field="status" data-row="${index}"></td>
        `;
        tbody.appendChild(tr);
    });
}

function saveHardware() {
    try {
        const rows = [];
        document.querySelectorAll('#hwBody tr').forEach(tr => {
            const inputs = tr.querySelectorAll('input');
            if (inputs.length === 5) {
                rows.push({
                    model: inputs[0].value,
                    ram: inputs[1].value,
                    hdd: inputs[2].value,
                    os: inputs[3].value,
                    status: inputs[4].value
                });
            }
        });
        localStorage.setItem('hwRows', JSON.stringify(rows));
    } catch (e) {
        console.error('❌ خطا در ذخیره جدول:', e);
    }
}

function loadHardware() {
    renderHardwareTable();
}

function addRow() {
    try {
        const rows = JSON.parse(localStorage.getItem('hwRows')) || [];
        rows.push({ model: 'جدید', ram: '۴', hdd: '۲۵۶', os: 'Win 10', status: '---' });
        localStorage.setItem('hwRows', JSON.stringify(rows));
        renderHardwareTable();
    } catch (e) {
        console.error('❌ خطا در افزودن ردیف:', e);
    }
}

// ============================================================
// ۹. رویدادها (ذخیره خودکار جدول هنگام تایپ)
// ============================================================
document.addEventListener('input', function(e) {
    if (e.target.closest('#hwBody input')) {
        saveHardware();
    }
});

// ============================================================
// ۱۰. بارگذاری اولیه
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocal();
});

// اگر DOM قبلاً بارگذاری شده بود
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadFromLocal();
}
