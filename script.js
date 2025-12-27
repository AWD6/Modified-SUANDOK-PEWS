// --- 1. ข้อมูลกลุ่มอายุ ---
const ageGroups = [
    { id: 'newborn', name: 'Newborn', ageRange: 'แรกเกิด-1 เดือน', heartRate: { min: 80, max: 140 }, respiratoryRate: { min: 35, max: 50 } },
    { id: 'infant', name: 'Infant', ageRange: '1-12 เดือน', heartRate: { min: 80, max: 140 }, respiratoryRate: { min: 35, max: 50 } },
    { id: 'toddler', name: 'Toddler', ageRange: '13 เดือน - 3 ปี', heartRate: { min: 70, max: 130 }, respiratoryRate: { min: 25, max: 40 } },
    { id: 'preschool', name: 'Preschool', ageRange: '4-6 ปี', heartRate: { min: 70, max: 120 }, respiratoryRate: { min: 20, max: 30 } },
    { id: 'schoolage', name: 'School age', ageRange: '7-12 ปี', heartRate: { min: 70, max: 110 }, respiratoryRate: { min: 20, max: 30 } },
    { id: 'adolescent', name: 'Adolescent', ageRange: '13-19 ปี', heartRate: { min: 60, max: 100 }, respiratoryRate: { min: 20, max: 30 } }
];

// --- 2. ตัวเลือกพฤติกรรม ---
const behaviorOptions = [
    { score: 0, label: "เล่นเหมาะสม" },
    { score: 1, label: "หลับ (ปลุกตื่น)" },
    { score: 2, label: "ร้องไห้งอแง พักไม่ได้" },
    { score: 3, label: "ซึม/สับสน หรือ ตอบสนองต่อการกระตุ้นความปวดลดลง" }
];

// --- 3. Google Form Config ---
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdNjCW8kkM3zOJfxL8aC5vWoS32_FIpf4yYusaujFOKbhxQrQ/formResponse';

// --- 4. State Management ---
let state = {
    ageGroup: null,
    temperatureValue: '',
    temperatureScore: 0,
    behaviorScore: null,
    cardiovascularScore: 0,
    respiratoryScore: 0,
    additionalRisk: false,
    hn: '',
    location: '',
    locationOther: '',
    nursingNotes: '',
    symptomsChanged: 'no',
    transferDestination: '',
    transferDestinationOther: '',
    prValue: '',
    rrValue: '',
    sbpValue: '',
    dbpValue: '',
    skinColor: '',
    crt: '',
    retraction: '',
    fio2: '',
    o2: '',
    spo2: '',
    chdType: '',
    chdAlertScore: 0, // ยกเลิกการใช้งาน (เป็น 0 เสมอ)
    palsEnabled: false,
    records: [],
    parentRecordId: null,
    isReassessment: false,
    details: { temp: '', cardio: '', resp: '' }
};

let isSavingRecord = false;
const submittedRecordIds = new Set();

document.addEventListener('DOMContentLoaded', function() {
    loadRecords();
    renderAgeGrid();
    renderBehaviorGrid();
    renderRecords();
    updateTotalScore();

    // Event Listeners
    document.getElementById('hn-input-top').addEventListener('input', (e) => state.hn = e.target.value);
    
    document.getElementById('location-select').addEventListener('change', (e) => {
        state.location = e.target.value;
        const other = document.getElementById('location-other');
        other.style.display = e.target.value === 'อื่นๆ' ? 'block' : 'none';
        if (e.target.value !== 'อื่นๆ') { state.locationOther = ''; other.value = ''; }
    });
    document.getElementById('location-other').addEventListener('input', (e) => state.locationOther = e.target.value);

    document.getElementById('temp-input').addEventListener('input', (e) => {
        state.temperatureValue = e.target.value;
        calculateTemperatureScore();
    });

    document.getElementById('pr-input').addEventListener('input', (e) => {
        state.prValue = e.target.value;
        calculateCardiovascularScore();
    });
    document.getElementById('sbp-input').addEventListener('input', (e) => state.sbpValue = e.target.value);
    document.getElementById('dbp-input').addEventListener('input', (e) => state.dbpValue = e.target.value);

    setupOptionButtons('skin-color-options', (val) => { state.skinColor = val; calculateCardiovascularScore(); });
    setupOptionButtons('crt-options', (val) => { state.crt = val; calculateCardiovascularScore(); });

    document.getElementById('rr-input').addEventListener('input', (e) => {
        state.rrValue = e.target.value;
        calculateRespiratoryScore();
    });
    document.getElementById('spo2-input').addEventListener('input', (e) => {
        state.spo2 = e.target.value;
        calculateRespiratoryScore();
    });

    setupOptionButtons('retraction-options', (val) => { state.retraction = val; calculateRespiratoryScore(); });
    setupOptionButtons('fio2-options', (val) => { state.fio2 = val; calculateRespiratoryScore(); });
    setupOptionButtons('o2-options', (val) => { state.o2 = val; calculateRespiratoryScore(); });

    document.getElementById('additional-risk').addEventListener('change', (e) => {
        state.additionalRisk = e.target.checked;
        updateTotalScore();
    });

    document.getElementById('pals-button').addEventListener('click', (e) => {
        state.palsEnabled = !state.palsEnabled;
        e.target.classList.toggle('active', state.palsEnabled);
    });

    document.getElementById('chd-btn').addEventListener('click', () => { document.getElementById('chd-modal').style.display = 'flex'; });
    document.getElementById('modal-close').addEventListener('click', () => { document.getElementById('chd-modal').style.display = 'none'; });
    
    document.querySelectorAll('.chd-option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.chd;
            state.chdType = type;
            const display = document.getElementById('chd-selected');
            display.style.display = 'block';
            display.innerHTML = `
                <div style="display:flex; align-items:center; justify-content:space-between; background:#f5f3ff; padding:0.75rem; border-radius:0.5rem; border:1px solid #8b5cf6;">
                    <span style="color:#7c3aed; font-weight:bold;">${type === 'acyanotic' ? '○ Acyanotic CHD' : '● Cyanotic CHD'}</span> 
                    <button class="chd-cancel-btn" onclick="clearCHD()">ยกเลิก</button>
                </div>`;
            document.getElementById('chd-modal').style.display = 'none';
            calculateRespiratoryScore(); 
        });
    });

    document.getElementById('nursing-notes').addEventListener('input', (e) => state.nursingNotes = e.target.value);

    document.getElementById('transfer-destination-select').addEventListener('change', (e) => {
        state.transferDestination = e.target.value;
        const otherInput = document.getElementById('transfer-destination-other');
        otherInput.style.display = e.target.value === 'อื่นๆ' ? 'block' : 'none';
    });
    document.getElementById('transfer-destination-other').addEventListener('input', (e) => state.transferDestinationOther = e.target.value);

    document.querySelector('.btn-transfer').addEventListener('click', () => {
        if (!state.transferDestination) { alert('กรุณาเลือกสถานที่ส่งต่อ'); return; }
        saveRecord('Transfer');
    });

    document.querySelector('.btn-reset').addEventListener('click', () => window.location.reload());

    document.querySelectorAll('.symptom-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.symptom-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            state.symptomsChanged = this.dataset.value;
        });
    });
});

function setupOptionButtons(containerId, callback) {
    document.querySelectorAll(`#${containerId} .option-btn`).forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll(`#${containerId} .option-btn`).forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            callback(this.dataset.value);
        });
    });
}

function clearCHD() {
    state.chdType = '';
    document.getElementById('chd-selected').style.display = 'none';
    calculateRespiratoryScore();
}

// --- Scoring Logic ---

function calculateTemperatureScore() {
    const temp = parseFloat(state.temperatureValue);
    let score = 0;
    if (!isNaN(temp)) {
        if (temp >= 39.0) score = 2;
        else if (temp >= 38.0 && temp <= 38.9) score = 1;
    }
    state.temperatureScore = score;
    document.getElementById('temp-score-val').innerText = score;
    
    state.details.temp = `
        <p><strong>ค่าที่ระบุ:</strong> ${state.temperatureValue || '-'} °C</p>
        <hr>
        <ul style="list-style:none; padding:0;">
            <li class="${score === 0 ? 'highlight-score-0' : ''}">0 คะแนน: ≤ 37.9 °C</li>
            <li class="${score === 1 ? 'highlight-score-1' : ''}">1 คะแนน: 38.0 - 38.9 °C</li>
            <li class="${score === 2 ? 'highlight-score-2' : ''}">2 คะแนน: ≥ 39.0 °C</li>
        </ul>
    `;
    updateTotalScore();
}

function calculateCardiovascularScore() {
    if (!state.ageGroup) return;
    const pr = parseInt(state.prValue);
    const skinColor = state.skinColor;
    const crt = state.crt;
    const group = ageGroups.find(g => g.id === state.ageGroup);
    
    let prScore = 0;
    if (!isNaN(pr)) {
        if (state.ageGroup === 'newborn' || state.ageGroup === 'infant') {
            if (pr >= 160 || pr <= 79) prScore = 3;
            else if (pr >= 150) prScore = 2;
            else if (pr >= 141) prScore = 1;
        } else if (state.ageGroup === 'toddler') {
            if (pr >= 150 || pr <= 69) prScore = 3;
            else if (pr >= 140) prScore = 2;
            else if (pr >= 131) prScore = 1;
        } else if (state.ageGroup === 'preschool' || state.ageGroup === 'schoolage') {
            if (pr >= 140 || pr <= 69) prScore = 3;
            else if (pr >= 130) prScore = 2;
            else if (pr >= 121) prScore = 1;
        } else if (state.ageGroup === 'adolescent') {
            if (pr >= 130 || pr <= 59) prScore = 3;
            else if (pr >= 120) prScore = 2;
            else if (pr >= 111) prScore = 1;
        }
    }

    let skinScore = 0;
    if (skinColor === 'mottled') skinScore = 3;
    else if (skinColor === 'gray' || crt === '4+') skinScore = 2;
    else if (skinColor === 'pale' || crt === '3') skinScore = 1;

    const finalScore = Math.max(prScore, skinScore);
    state.cardiovascularScore = finalScore;
    document.getElementById('cardio-score-val').innerText = finalScore;
    
    state.details.cardio = `<p><strong>PR:</strong> ${pr||'-'}, <strong>Skin:</strong> ${skinColor||'-'}, <strong>CRT:</strong> ${crt||'-'}</p><p>คะแนนที่ได้: ${finalScore}</p>`;
    updateTotalScore();
}

function calculateRespiratoryScore() {
    if (!state.ageGroup) return;
    const rr = parseInt(state.rrValue);
    const spo2 = parseFloat(state.spo2);
    let rrScore = 0, oxyScore = 0, spo2Score = 0;
    let spo2Label = "";

    // 1. RR Score
    if (!isNaN(rr)) {
        if (state.ageGroup === 'newborn' || state.ageGroup === 'infant') {
            if (rr <= 20 || rr >= 70) rrScore = 3; else if (rr >= 60) rrScore = 2; else if (rr >= 51) rrScore = 1;
        } else if (state.ageGroup === 'toddler') {
            if (rr <= 20 || rr >= 60) rrScore = 3; else if (rr >= 50) rrScore = 2; else if (rr >= 41) rrScore = 1;
        } else {
            if (rr <= 16 || rr >= 50) rrScore = 3; else if (rr >= 40) rrScore = 2; else if (rr >= 31) rrScore = 1;
        }
    }
    if (state.retraction === 'yes' && rrScore < 3) rrScore = Math.max(rrScore, 1);

    // 2. Oxygen Score
    if (state.fio2 >= 50 || state.o2 >= 8) oxyScore = 3;
    else if (state.fio2 >= 40 || state.o2 >= 6) oxyScore = 2;
    else if (state.fio2 >= 30 || state.o2 >= 4) oxyScore = 1;

    // 3. SpO2 Score (ปรับตามเงื่อนไขใหม่)
    if (!isNaN(spo2)) {
        if (spo2 < 75) {
            spo2Score = 3;
            if (state.chdType === 'cyanotic') {
                spo2Label = " (Cyanotic CHD + SpO₂ < 75%)";
            }
        } else if (spo2 < 95) {
            // กรณีทั่วไป/Acyanotic ที่ SpO2 ต่ำกว่า 95 (แต่ยังไม่ถึง 75) มักให้ 3 คะแนนตามเกณฑ์ PEWS มาตรฐาน
            spo2Score = 3;
        }
    }

    const finalScore = Math.max(rrScore, oxyScore, spo2Score);
    state.respiratoryScore = finalScore;
    document.getElementById('resp-score-val').innerText = finalScore;

    state.details.resp = `
        <p><strong>ข้อมูล:</strong> RR: ${rr||'-'}, SpO2: ${spo2||'-'}% ${spo2Label}</p>
        <hr>
        <p>เกณฑ์คะแนนระบบหายใจ: ${finalScore}</p>
        ${spo2Label ? `<p style="color:#ef4444; font-weight:bold;">* ${spo2Label}</p>` : ''}
    `;
    updateTotalScore();
}

function updateTotalScore() {
    const temp = state.temperatureScore || 0;
    const behav = state.behaviorScore !== null ? state.behaviorScore : 0;
    const cardio = state.cardiovascularScore || 0;
    const resp = state.respiratoryScore || 0;
    const add = state.additionalRisk ? 2 : 0;
    
    // คำนวณคะแนนรวม (ไม่มีการบวก chdAlertScore แล้ว)
    let total = temp + behav + cardio + resp + add;

    let riskLevel = 'low';
    let rec = "รับบริการตามปกติ";
    if (total >= 4) { riskLevel = 'high'; rec = "ส่งต่อ ER"; }
    else if (total === 3) { riskLevel = 'orange'; rec = "พบแพทย์ภายใน 30 นาที"; }
    else if (total === 2) { riskLevel = 'medium'; rec = "ติดตามประเมินอาการทุก 1-2 ชั่วโมง"; }

    const display = document.getElementById('total-score-display');
    display.className = `total-score ${riskLevel}`;
    display.innerHTML = `
        <div class="total-score-label">คะแนนรวม Modified SUANDOK PEWS</div>
        <div class="score-main-area">
            <div class="total-score-number">${total}</div>
            <div class="recommendation-box"><div class="recommendation-text"><p>${rec}</p></div></div>
        </div>
        <div class="total-score-breakdown">
             <div class="breakdown-item"><span>Temp</span><span>${temp}</span></div>
             <div class="breakdown-item"><span>พฤติกรรม</span><span>${behav}</span></div>
             <div class="breakdown-item"><span>ไหลเวียน</span><span>${cardio}</span></div>
             <div class="breakdown-item"><span>หายใจ</span><span>${resp}</span></div>
             ${add ? `<div class="breakdown-item"><span>Risk</span><span>+2</span></div>` : ''}
        </div>
    `;
    state.nursingNotes = rec;
}

// --- Render & UI Helpers ---

function renderAgeGrid() {
    const grid = document.getElementById('age-grid');
    grid.innerHTML = '';
    ageGroups.forEach(age => {
        const btn = document.createElement('button');
        btn.className = 'age-button';
        btn.innerHTML = `<div class="age-name">${age.name}</div><div class="age-range">${age.ageRange}</div>`;
        btn.onclick = () => selectAge(age.id);
        grid.appendChild(btn);
    });
}

function selectAge(id) {
    state.ageGroup = (state.ageGroup === id) ? null : id;
    document.querySelectorAll('.age-button').forEach((b, i) => b.classList.toggle('selected', ageGroups[i].id === state.ageGroup));
    const isSelected = state.ageGroup !== null;
    ['temp-input-container','cardiovascular-input-container','respiratory-input-container'].forEach(cid => document.getElementById(cid).style.display = isSelected ? 'block' : 'none');
    ['temperature-warning','cardiovascular-warning','respiratory-warning'].forEach(cid => document.getElementById(cid).style.display = isSelected ? 'none' : 'block');
    calculateTemperatureScore(); calculateCardiovascularScore(); calculateRespiratoryScore();
}

function renderBehaviorGrid() {
    const grid = document.getElementById('behavior-grid');
    grid.innerHTML = '';
    behaviorOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'score-button';
        btn.innerHTML = `<div class="score-label">${opt.label}</div><div class="score-value">${opt.score}</div>`;
        btn.onclick = () => {
            state.behaviorScore = (state.behaviorScore === opt.score) ? null : opt.score;
            document.querySelectorAll('#behavior-grid .score-button').forEach(b => b.classList.remove('selected'));
            if (state.behaviorScore !== null) btn.classList.add('selected');
            document.getElementById('behav-score-val').innerText = state.behaviorScore ?? 0;
            updateTotalScore();
        };
        grid.appendChild(btn);
    });
}

window.showDetail = function(type) {
    document.getElementById('detail-title').innerText = "รายละเอียดคะแนน";
    document.getElementById('detail-content').innerHTML = state.details[type] || "กรุณากรอกข้อมูล";
    document.getElementById('detail-modal').style.display = 'flex';
};

window.closeDetailModal = () => document.getElementById('detail-modal').style.display = 'none';

// --- Save & History ---

async function saveRecord() {
    if (isSavingRecord || !state.ageGroup) return;
    isSavingRecord = true;
    const record = { ...state, id: Date.now().toString(), createdAt: new Date().toISOString() };
    state.records.unshift(record);
    localStorage.setItem('pewsRecords', JSON.stringify(state.records));
    renderRecords();
    alert('บันทึกสำเร็จ');
    isSavingRecord = false;
    resetForm();
}

function resetForm() {
    window.location.reload();
}

function loadRecords() {
    const saved = localStorage.getItem('pewsRecords');
    if (saved) state.records = JSON.parse(saved);
}

function renderRecords() {
    const container = document.getElementById('records-list');
    if (!state.records.length) { container.innerHTML = '<p style="text-align:center; padding:2rem; color:#9ca3af;">ไม่มีประวัติการบันทึก</p>'; return; }
    container.innerHTML = state.records.map(r => `
        <div class="record-card">
            <div class="record-header"><strong>HN: ${r.hn || '-'}</strong> <span>${new Date(r.createdAt).toLocaleString()}</span></div>
            <div style="margin-top:0.5rem">คะแนนรวม: <span class="total-score-badge">${r.totalScore}</span></div>
            <div style="font-size:0.9rem; color:#6b7280; margin-top:0.5rem;">${r.nursingNotes}</div>
        </div>
    `).join('');
}
