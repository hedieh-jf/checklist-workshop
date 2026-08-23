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
// ۳. ساختار داده چک‌لیست
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
// ۴. مدیریت منو و نمایش صفحات
// ============================================================
function showPage(pageName) {
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.textContent.includes(pageName === 'checklist' ? 'چک‌لیست' : 'سیستم')) {
            btn.classList.add('active');
        }
    });
}

// ============================================================
// ۵. رندر چک‌لیست
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

        const header = document.createElement('h2');
        const doneInStage = checkState.slice(stageItemIndices[si].start, stageItemIndices[si].end + 1).filter(Boolean).length;
        const totalInStage = stageItemIndices[si].count;
        header.innerHTML = `${stage.name} <span>${doneInStage}/${totalInStage}</span>`;
        stageDiv.appendChild(header);

        stage.items.forEach((itemText) => {
            const globalIndex = globalIdx;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            if (checkState[globalIndex]) {
                itemDiv.classList.add('done');
            }

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.id = `check-${globalIndex}`;
            cb.checked = checkState[globalIndex] || false;
            
            cb.addEventListener('change', function(e) {
                checkState[globalIndex] = e.target.checked;
                updateAll();
                saveChecklist();
            });

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
// ۶. به‌روزرسانی پیشرفت چک‌لیست
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
// ۷. عملیات چک‌لیست
// ============================================================
function resetAll(tickAll) {
    for (let i = 0; i < checkState.length; i++) {
        checkState[i] = tickAll;
    }
    renderStages();
    saveChecklist();
}

function saveChecklist() {
    try {
        localStorage.setItem('checkState', JSON.stringify(checkState));
    } catch (e) {
        console.error('❌ خطا در ذخیره چک‌لیست:', e);
    }
}

function loadChecklist() {
    try {
        const saved = localStorage.getItem('checkState');
        if (saved) {
            const arr = JSON.parse(saved);
            if (arr.length === checkState.length) {
                checkState = arr;
            }
        }
    } catch (e) {
        console.error('❌ خطا در بارگذاری چک‌لیست:', e);
    }
    renderStages();
}

// ============================================================
// ۸. مدیریت سیستم‌ها
// ============================================================
const defaultSystems = [
    { name: 'سیستم ۱', os: 'windows10', ram: '4', gpu: 'Intel HD', hdd: '256', arch: '64bit', status: 'healthy', mouse: 'دارد', keyboard: 'دارد', monitor: 'دارد' },
    { name: 'سیستم ۲', os: 'windows11', ram: '8', gpu: 'NVIDIA GTX', hdd: '512', arch: '64bit', status: 'healthy', mouse: 'دارد', keyboard: 'دارد', monitor: 'دارد' },
    { name: 'سیستم ۳', os: 'windows10', ram: '4', gpu: 'Intel HD', hdd: '256', arch: '32bit', status: 'check', mouse: 'ندارد', keyboard: 'دارد', monitor: 'دارد' },
    { name: 'سیستم ۴', os: 'windows11', ram: '16', gpu: 'AMD Radeon', hdd: '1000', arch: '64bit', status: 'healthy', mouse: 'دارد', keyboard: 'دارد', monitor: 'دارد' },
    { name: 'سیستم ۵', os: 'windows7', ram: '2', gpu: 'Intel', hdd: '160', arch: '32bit', status: 'check', mouse: 'ندارد', keyboard: 'ندارد', monitor: 'دارد' }
];

function renderSystemsTable() {
    const tbody = document.getElementById('systemsBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    let systems = [];
    try {
        const saved = localStorage.getItem('systemsData');
        if (saved) {
            systems = JSON.parse(saved);
        }
    } catch (e) {
        console.error('❌ خطا در خواندن سیستم‌ها:', e);
    }

    if (systems.length === 0) {
        systems = defaultSystems;
        localStorage.setItem('systemsData', JSON.stringify(systems));
    }

    systems.forEach((system, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><input type="text" value="${system.name || ''}" data-field="name" data-row="${index}"></td>
            <td>
                <select data-field="os" data-row="${index}">
                    <option value="windows7" ${system.os === 'windows7' ? 'selected' : ''}>Windows 7</option>
                    <option value="windows10" ${system.os === 'windows10' ? 'selected' : ''}>Windows 10</option>
                    <option value="windows11" ${system.os === 'windows11' ? 'selected' : ''}>Windows 11</option>
                </select>
            </td>
            <td><input type="number" value="${system.ram || ''}" data-field="ram" data-row="${index}" min="0" step="1"></td>
            <td><input type="text" value="${system.gpu || ''}" data-field="gpu" data-row="${index}"></td>
            <td><input type="number" value="${system.hdd || ''}" data-field="hdd" data-row="${index}" min="0" step="1"></td>
            <td>
                <select data-field="arch" data-row="${index}">
                    <option value="32bit" ${system.arch === '32bit' ? 'selected' : ''}>۳۲ بیتی</option>
                    <option value="64bit" ${system.arch === '64bit' ? 'selected' : ''}>۶۴ بیتی</option>
                </select>
            </td>
            <td>
                <select data-field="status" data-row="${index}">
                    <option value="healthy" ${system.status === 'healthy' ? 'selected' : ''}>✅ سالم</option>
                    <option value="check" ${system.status === 'check' ? 'selected' : ''}>⚠️ نیاز به بررسی</option>
                </select>
            </td>
            <td>
                <select data-field="mouse" data-row="${index}">
                    <option value="دارد" ${system.mouse === 'دارد' ? 'selected' : ''}>✅ دارد</option>
                    <option value="ندارد" ${system.mouse === 'ندارد' ? 'selected' : ''}>❌ ندارد</option>
                </select>
            </td>
            <td>
                <select data-field="keyboard" data-row="${index}">
                    <option value="دارد" ${system.keyboard === 'دارد' ? 'selected' : ''}>✅ دارد</option>
                    <option value="ندارد" ${system.keyboard === 'ندارد' ? 'selected' : ''}>❌ ندارد</option>
                </select>
            </td>
            <td>
                <select data-field="monitor" data-row="${index}">
                    <option value="دارد" ${system.monitor === 'دارد' ? 'selected' : ''}>✅ دارد</option>
                    <option value="ندارد" ${system.monitor === 'ندارد' ? 'selected' : ''}>❌ ندارد</option>
                </select>
            </td>
            <td>
                <button class="delete-btn" onclick="deleteSystem(${index})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================================
// ۹. عملیات سیستم‌ها
// ============================================================
function getSystemsData() {
    const systems = [];
    document.querySelectorAll('#systemsBody tr').forEach(tr => {
        const inputs = tr.querySelectorAll('input');
        const selects = tr.querySelectorAll('select');
        if (inputs.length >= 4 && selects.length >= 5) {
            systems.push({
                name: inputs[0].value,
                os: selects[0].value,
                ram: inputs[1].value,
                gpu: inputs[2].value,
                hdd: inputs[3].value,
                arch: selects[1].value,
                status: selects[2].value,
                mouse: selects[3].value,
                keyboard: selects[4].value,
                monitor: selects[5].value
            });
        }
    });
    return systems;
}

function saveSystems() {
    try {
        const systems = getSystemsData();
        localStorage.setItem('systemsData', JSON.stringify(systems));
        alert('✅ اطلاعات سیستم‌ها با موفقیت ذخیره شد!');
    } catch (e) {
        console.error('❌ خطا در ذخیره سیستم‌ها:', e);
        alert('❌ خطا در ذخیره اطلاعات!');
    }
}

function loadSystems() {
    renderSystemsTable();
}

function addSystemRow() {
    try {
        const systems = getSystemsData();
        systems.push({ 
            name: 'سیستم جدید', 
            os: 'windows10', 
            ram: '4', 
            gpu: '---', 
            hdd: '256', 
            arch: '64bit', 
            status: 'healthy',
            mouse: 'دارد',
            keyboard: 'دارد',
            monitor: 'دارد'
        });
        localStorage.setItem('systemsData', JSON.stringify(systems));
        renderSystemsTable();
        alert('✅ سیستم جدید اضافه شد!');
    } catch (e) {
        console.error('❌ خطا در افزودن سیستم:', e);
        alert('❌ خطا در افزودن سیستم!');
    }
}

function deleteSystem(index) {
    if (!confirm(`آیا از حذف سیستم شماره ${index + 1} مطمئن هستید؟`)) return;
    
    try {
        const systems = getSystemsData();
        systems.splice(index, 1);
        localStorage.setItem('systemsData', JSON.stringify(systems));
        renderSystemsTable();
        alert('✅ سیستم با موفقیت حذف شد!');
    } catch (e) {
        console.error('❌ خطا در حذف سیستم:', e);
        alert('❌ خطا در حذف سیستم!');
    }
}

function exportSystems() {
    try {
        const systems = getSystemsData();
        const json = JSON.stringify(systems, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `systems_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert('✅ خروجی با موفقیت ایجاد شد!');
    } catch (e) {
        console.error('❌ خطا در خروجی:', e);
        alert('❌ خطا در ایجاد خروجی!');
    }
}

function importSystems() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(ev) {
            try {
                const systems = JSON.parse(ev.target.result);
                if (Array.isArray(systems) && systems.length > 0) {
                    localStorage.setItem('systemsData', JSON.stringify(systems));
                    renderSystemsTable();
                    alert('✅ اطلاعات با موفقیت وارد شد!');
                } else {
                    alert('❌ فرمت فایل نامعتبر است!');
                }
            } catch (err) {
                alert('❌ خطا در خواندن فایل!');
                console.error(err);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// ============================================================
// ۱۰. چاپ گزارش کامل سیستم‌ها
// ============================================================
function printReport() {
    const systems = getSystemsData();
    
    if (systems.length === 0) {
        alert('❌ هیچ سیستمی برای چاپ وجود ندارد!');
        return;
    }
    
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
            <meta charset="UTF-8">
            <title>گزارش اطلاعات سیستم‌های کارگاه</title>
            <style>
                * { margin: 0; padding: 0
