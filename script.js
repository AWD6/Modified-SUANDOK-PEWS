// Age groups data with updated scoring criteria
const ageGroups = [
    {
        id: 'newborn',
        name: 'Newborn',
        ageRange: 'แรกเกิด-1 เดือน',
        heartRate: { min: 80, max: 140, normal: '80 - 140' },
        respiratoryRate: { min: 35, max: 50, normal: '35 - 50' }
    },
    {
        id: 'infant',
        name: 'Infant',
        ageRange: '1-12 เดือน',
        heartRate: { min: 80, max: 140, normal: '80 - 140' },
        respiratoryRate: { min: 35, max: 50, normal: '35 - 50' }
    },
    {
        id: 'toddler',
        name: 'Toddler',
        ageRange: '13 เดือน - 3 ปี',
        heartRate: { min: 70, max: 130, normal: '70 - 130' },
        respiratoryRate: { min: 25, max: 40, normal: '25 - 40' }
    },
    {
        id: 'preschool',
        name: 'Preschool',
        ageRange: '4-6 ปี',
        heartRate: { min: 70, max: 120, normal: '70 - 120' },
        respiratoryRate: { min: 20, max: 30, normal: '20 - 30' }
    },
    {
        id: 'schoolage',
        name: 'School age',
        ageRange: '7-12 ปี',
        heartRate: { min: 70, max: 110, normal: '70 - 110' },
        respiratoryRate: { min: 20, max: 30, normal: '20 - 30' }
    },
    {
        id: 'adolescent',
        name: 'Adolescent',
        ageRange: '13-19 ปี',
        heartRate: { min: 60, max: 100, normal: '60 - 100' },
        respiratoryRate: { min: 20, max: 30, normal: '20 - 30' }
    }
];

// Behavior options
const behaviorOptions = [
    { score: 0, label: "เล่นเหมาะสม" },
    { score: 1, label: "หลับ" },
    { score: 2, label: "ร้องไห้งอแง พักไม่ได้" },
    { score: 3, label: "ซึม/สับสน หรือ ตอบสนองต่อการกระตุ้นความปวดลดลง" }
];

// Temperature options (same for all ages)
const temperatureOptions = [
    { score: 0, label: "≤ 37.9 °C", minTemp: 0, maxTemp: 37.9 },
    { score: 1, label: "38.0 - 38.9 °C", minTemp: 38.0, maxTemp: 38.9 },
    { score: 2, label: "≥ 39.0 °C", minTemp: 39.0, maxTemp: 100 }
];

// Skin color options
const skinColorOptions = [
    { value: 'pink', label: 'ผิวสีชมพูดี', score: 0 },
    { value: 'pale', label: 'ผิวสีซีด', score: 1 },
    { value: 'gray', label: 'ผิวสีเทา', score: 2 },
    { value: 'mottled', label: 'ผิวสีเทาและตัวลาย', score: 3 }
];

// CRT options
const crtOptions = [
    { value: 'normal', label: 'CRT 1 - 2 วินาที', score: 0 },
    { value: 'delayed', label: 'CRT 3 วินาที', score: 1 },
    { value: 'prolonged', label: 'CRT ≥ 4 วินาที', score: 2 }
];

// Retraction options
const retractionOptions = [
    { value: 'no', label: 'ไม่มี Retraction', score: 0 },
    { value: 'yes', label: 'มี Retraction', score: 1 }
];

// FiO2 options
const fio2Options = [
    { value: 'none', label: 'ไม่ได้รับ FiO₂', score: 0 },
    { value: '30', label: 'FiO₂ ≥ 30%', score: 1 },
    { value: '40', label: 'FiO₂ ≥ 40%', score: 2 },
    { value: '50', label: 'FiO₂ ≥ 50%', score: 3 }
];

// O2 LPM options
const o2Options = [
    { value: 'none', label: 'ไม่ได้รับ O₂', score: 0 },
    { value: '4', label: 'O₂ ≥ 4 LPM', score: 1 },
    { value: '6', label: 'O₂ ≥ 6 LPM', score: 2 },
    { value: '8', label: 'O₂ ≥ 8 LPM', score: 3 }
];

// State
let state = {
    ageGroup: null,
    behaviorScore: null,
    temperatureScore: null,
    cardiovascularScore: null,
    respiratoryScore: null,
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
    temperature: '',
    pulse: '',
    rrVitalSign: '',
    bloodPressure: '',
    spo2: '',
    parentRecordId: null,
    isReassessment: false,
    chdType: '',
    palsEnabled: false,
    skinColor: '',
    crt: '',
    retraction: 'no',
    fio2: 'none',
    o2Lpm: 'none',
    prScore: null,
    skinColorScore: null,
    crtScore: null,
    rrScore: null,
    retractionScore: null,
    fio2Score: null,
    o2Score: null,
    spo2Score: null,
    records: []
};

// Flag สำหรับป้องกันการบันทึกซ้ำ
let isSavingRecord = false;
let lastSaveTime = 0;
const SAVE_COOLDOWN = 2000;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadRecords();
    renderAgeGrid();
    renderBehaviorGrid();
    updateTotalScore();
    renderRecords();

    // Hide containers initially
    document.getElementById('temperature-section').style.display = 'none';
    document.getElementById('cardiovascular-section').style.display = 'none';
    document.getElementById('respiratory-section').style.display = 'none';

    const transferOtherInput = document.getElementById('transfer-destination-other');
    if (transferOtherInput) {
        transferOtherInput.style.display = 'none';
    }

    // Event listeners
    document.getElementById('hn-input-top').addEventListener('input', (e) => {
        state.hn = e.target.value;
    });

    document.getElementById('location-select').addEventListener('change', (e) => {
        state.location = e.target.value;
        const otherInput = document.getElementById('location-other');
        if (e.target.value === 'อื่นๆ') {
            otherInput.style.display = 'block';
        } else {
            otherInput.style.display = 'none';
            state.locationOther = '';
            otherInput.value = '';
        }
    });

    document.getElementById('location-other').addEventListener('input', (e) => {
        state.locationOther = e.target.value;
    });

    document.getElementById('nursing-notes').addEventListener('input', (e) => {
        state.nursingNotes = e.target.value;
    });

    document.getElementById('transfer-destination-select').addEventListener('change', (e) => {
        state.transferDestination = e.target.value;
        const otherInput = document.getElementById('transfer-destination-other');
        if (e.target.value === 'อื่นๆ') {
            otherInput.style.display = 'block';
        } else {
            otherInput.style.display = 'none';
            state.transferDestinationOther = '';
            otherInput.value = '';
        }
    });

    document.getElementById('transfer-destination-other').addEventListener('input', (e) => {
        state.transferDestinationOther = e.target.value;
    });

    // BP input with auto-formatting
    const bpInput = document.getElementById('bp-input');
    bpInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^\d]/g, '');
        if (value.length >= 4) {
            let formatted = '';
            if (value.length === 4) {
                formatted = value.slice(0, 2) + '/' + value.slice(2, 4);
            } else if (value.length === 5) {
                formatted = value.slice(0, 3) + '/' + value.slice(3, 5);
            } else if (value.length >= 6) {
                formatted = value.slice(0, 3) + '/' + value.slice(3, 6);
            } else {
                formatted = value;
            }
            e.target.value = formatted;
            state.bloodPressure = formatted;
        } else {
            e.target.value = value;
            state.bloodPressure = value;
        }
    });

    document.getElementById('additional-risk').addEventListener('change', (e) => {
        state.additionalRisk = e.target.checked;
        updateTotalScore();
    });

    document.querySelectorAll('.symptom-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.symptom-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            state.symptomsChanged = this.dataset.value;
        });
    });

    document.querySelector('.btn-transfer').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isSavingRecord) return;
        if (!state.transferDestination) {
            alert('กรุณาเลือกสถานที่ส่งต่อ');
        } else {
            saveRecord('Transfer');
        }
    });

    document.querySelector('.btn-reset').addEventListener('click', resetForm);

    const palsBtn = document.getElementById('pals-button');
    if (palsBtn) {
        palsBtn.addEventListener('click', () => {
            state.palsEnabled = !state.palsEnabled;
            palsBtn.classList.toggle('active', state.palsEnabled);
        });
    }

    // CHD Modal handlers
    document.getElementById('chd-btn').addEventListener('click', () => {
        document.getElementById('chd-modal').style.display = 'flex';
    });

    document.getElementById('modal-close').addEventListener('click', () => {
        document.getElementById('chd-modal').style.display = 'none';
    });

    document.querySelectorAll('.chd-option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const chdType = this.dataset.chd;
            state.chdType = chdType;
            const chdSelected = document.getElementById('chd-selected');
            const displayText = chdType === 'acyanotic' ? 'Acyanotic CHD' : 'Cyanotic CHD';
            const icon = chdType === 'acyanotic' ? '○' : '●';
            chdSelected.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.25rem;">${icon}</span>
                    <span style="font-weight: 600;">${displayText}</span>
                    <button onclick="clearCHD()" style="margin-left: auto; padding: 0.25rem 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem;">ยกเลิก</button>
                </div>
            `;
            chdSelected.style.display = 'block';
            document.getElementById('chd-modal').style.display = 'none';
            calculateRespiratoryScore();
        });
    });

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('chd-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function clearCHD() {
    state.chdType = '';
    document.getElementById('chd-selected').style.display = 'none';
    calculateRespiratoryScore();
}

function renderAgeGrid() {
    const grid = document.getElementById('age-grid');
    grid.innerHTML = '';
    ageGroups.forEach(age => {
        const button = document.createElement('button');
        button.className = 'age-button';
        button.innerHTML = `
            <div class="age-name">${age.name}</div>
            <div class="age-range">${age.ageRange}</div>
        `;
        button.addEventListener('click', () => selectAge(age.id));
        grid.appendChild(button);
    });
}

function selectAge(ageId) {
    state.ageGroup = ageId;
    document.getElementById('age-error').style.display = 'none';
    document.querySelectorAll('.age-button').forEach((btn, index) => {
        btn.classList.toggle('selected', ageGroups[index].id === ageId);
    });

    // Show all sections after age selection
    document.getElementById('temperature-section').style.display = 'block';
    document.getElementById('cardiovascular-section').style.display = 'block';
    document.getElementById('respiratory-section').style.display = 'block';

    const ageGroup = ageGroups.find(a => a.id === ageId);
    if (ageGroup) {
        // Update headers with normal ranges
        const cardioHeader = document.querySelector('#cardiovascular-section .section-header h2');
        if (cardioHeader) {
            cardioHeader.innerHTML = `ระบบไหลเวียนโลหิต <span style="color: #2563eb; font-weight: 600; font-size: 0.9rem; margin-left: 0.5rem;">PR ปกติ : ${ageGroup.heartRate.normal} ครั้ง/นาที</span>`;
        }

        const respHeader = document.querySelector('#respiratory-section .section-header h2');
        if (respHeader) {
            respHeader.innerHTML = `ระบบทางเดินหายใจ <span style="color: #2563eb; font-weight: 600; font-size: 0.9rem; margin-left: 0.5rem;">RR ปกติ : ${ageGroup.respiratoryRate.normal} ครั้ง/นาที</span>`;
        }
    }

    renderTemperatureSection();
    renderCardiovascularSection();
    renderRespiratorySection();
    
    // Recalculate scores if values exist
    if (state.temperature) calculateTemperatureScore();
    if (state.prValue) calculatePRScore();
    if (state.rrValue) calculateRRScore();
}

function renderBehaviorGrid() {
    const grid = document.getElementById('behavior-grid');
    grid.innerHTML = '';
    behaviorOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'score-button';
        button.innerHTML = `
            <div class="score-label">${option.label}</div>
            <div class="score-value">${option.score}</div>
        `;
        button.addEventListener('click', () => selectBehavior(option.score));
        grid.appendChild(button);
    });
}

function selectBehavior(score) {
    state.behaviorScore = state.behaviorScore === score ? null : score;
    document.querySelectorAll('#behavior-grid .score-button').forEach((btn, index) => {
        btn.classList.toggle('selected', behaviorOptions[index].score === state.behaviorScore);
    });
    updateTotalScore();
}

// Temperature Section
function renderTemperatureSection() {
    const container = document.getElementById('temperature-inputs');
    container.innerHTML = `
        <div class="input-row">
            <label for="temp-scoring-input">กรอกอุณหภูมิ (°C):</label>
            <input type="number" id="temp-scoring-input" placeholder="°C" step="0.1" min="30" max="45" value="${state.temperature}" />
        </div>
        <div class="score-grid" id="temperature-grid"></div>
    `;

    // Render temperature score buttons
    const grid = document.getElementById('temperature-grid');
    temperatureOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'score-button';
        if (state.temperatureScore === option.score) button.classList.add('selected');
        button.innerHTML = `
            <div class="score-label">${option.label}</div>
            <div class="score-value">${option.score}</div>
        `;
        button.addEventListener('click', () => {
            state.temperatureScore = option.score;
            renderTemperatureSection();
            updateTotalScore();
        });
        grid.appendChild(button);
    });

    // Add input listener
    const tempInput = document.getElementById('temp-scoring-input');
    tempInput.addEventListener('input', (e) => {
        state.temperature = e.target.value;
        calculateTemperatureScore();
    });
}

function calculateTemperatureScore() {
    const temp = parseFloat(state.temperature);
    if (isNaN(temp)) {
        state.temperatureScore = null;
    } else if (temp <= 37.9) {
        state.temperatureScore = 0;
    } else if (temp >= 38.0 && temp <= 38.9) {
        state.temperatureScore = 1;
    } else if (temp >= 39.0) {
        state.temperatureScore = 2;
    }

    // Update UI
    document.querySelectorAll('#temperature-grid .score-button').forEach((btn, index) => {
        btn.classList.toggle('selected', temperatureOptions[index].score === state.temperatureScore);
    });
    updateTotalScore();
}

// Cardiovascular Section
function renderCardiovascularSection() {
    if (!state.ageGroup) return;

    const container = document.getElementById('cardiovascular-inputs');
    const ageGroup = ageGroups.find(a => a.id === state.ageGroup);

    container.innerHTML = `
        <div class="input-row">
            <label for="pr-scoring-input">กรอก PR (ชีพจร):</label>
            <input type="number" id="pr-scoring-input" placeholder="ครั้ง/นาที" min="0" max="300" value="${state.prValue}" />
            <span class="unit-text">ครั้ง/นาที</span>
        </div>
        <div class="selector-row">
            <label>สีผิว:</label>
            <div class="option-buttons" id="skin-color-options"></div>
        </div>
        <div class="selector-row">
            <label>CRT:</label>
            <div class="option-buttons" id="crt-options"></div>
        </div>
        <div class="score-grid" id="cardiovascular-grid"></div>
    `;

    // Render skin color options
    const skinContainer = document.getElementById('skin-color-options');
    skinColorOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        if (state.skinColor === option.value) button.classList.add('selected');
        button.textContent = option.label;
        button.addEventListener('click', () => {
            state.skinColor = option.value;
            state.skinColorScore = option.score;
            renderCardiovascularSection();
            calculateCardiovascularScore();
        });
        skinContainer.appendChild(button);
    });

    // Render CRT options
    const crtContainer = document.getElementById('crt-options');
    crtOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        if (state.crt === option.value) button.classList.add('selected');
        button.textContent = option.label;
        button.addEventListener('click', () => {
            state.crt = option.value;
            state.crtScore = option.score;
            renderCardiovascularSection();
            calculateCardiovascularScore();
        });
        crtContainer.appendChild(button);
    });

    // Render cardiovascular score buttons (0-3)
    const grid = document.getElementById('cardiovascular-grid');
    for (let score = 0; score <= 3; score++) {
        const button = document.createElement('button');
        button.className = 'score-button';
        if (state.cardiovascularScore === score) button.classList.add('selected');
        button.innerHTML = `
            <div class="score-label">คะแนน ${score}</div>
            <div class="score-value">${score}</div>
        `;
        button.addEventListener('click', () => {
            state.cardiovascularScore = score;
            renderCardiovascularSection();
            updateTotalScore();
        });
        grid.appendChild(button);
    }

    // Add PR input listener
    const prInput = document.getElementById('pr-scoring-input');
    prInput.addEventListener('input', (e) => {
        state.prValue = e.target.value;
        state.pulse = e.target.value;
        calculatePRScore();
        calculateCardiovascularScore();
    });
}

function calculatePRScore() {
    const pr = parseInt(state.prValue);
    const ageId = state.ageGroup;
    
    if (isNaN(pr) || !ageId) {
        state.prScore = null;
        return;
    }

    // PR scoring based on age group
    if (ageId === 'newborn' || ageId === 'infant') {
        if (pr <= 140) state.prScore = 0;
        else if (pr >= 141 && pr <= 149) state.prScore = 1;
        else if (pr >= 150 && pr <= 159) state.prScore = 2;
        else if (pr >= 160 || pr <= 79) state.prScore = 3;
    } else if (ageId === 'toddler') {
        if (pr <= 130) state.prScore = 0;
        else if (pr >= 131 && pr <= 139) state.prScore = 1;
        else if (pr >= 140 && pr <= 149) state.prScore = 2;
        else if (pr >= 150 || pr <= 69) state.prScore = 3;
    } else if (ageId === 'preschool') {
        if (pr <= 120) state.prScore = 0;
        else if (pr >= 121 && pr <= 129) state.prScore = 1;
        else if (pr >= 130 && pr <= 139) state.prScore = 2;
        else if (pr >= 140 || pr <= 69) state.prScore = 3;
    } else if (ageId === 'schoolage') {
        if (pr <= 110) state.prScore = 0;
        else if (pr >= 111 && pr <= 119) state.prScore = 1;
        else if (pr >= 120 && pr <= 129) state.prScore = 2;
        else if (pr >= 130 || pr <= 69) state.prScore = 3;
    } else if (ageId === 'adolescent') {
        if (pr <= 100) state.prScore = 0;
        else if (pr >= 111 && pr <= 119) state.prScore = 1;
        else if (pr >= 120 && pr <= 129) state.prScore = 2;
        else if (pr >= 130 || pr <= 59) state.prScore = 3;
    }
}

function calculateCardiovascularScore() {
    // Get max score from PR, skin color, and CRT
    const scores = [
        state.prScore || 0,
        state.skinColorScore || 0,
        state.crtScore || 0
    ];
    state.cardiovascularScore = Math.max(...scores);

    // Update UI
    document.querySelectorAll('#cardiovascular-grid .score-button').forEach((btn, index) => {
        btn.classList.toggle('selected', index === state.cardiovascularScore);
    });
    updateTotalScore();
}

// Respiratory Section
function renderRespiratorySection() {
    if (!state.ageGroup) return;

    const container = document.getElementById('respiratory-inputs');
    const ageGroup = ageGroups.find(a => a.id === state.ageGroup);

    container.innerHTML = `
        <div class="input-row">
            <label for="rr-scoring-input">กรอก RR (อัตราการหายใจ):</label>
            <input type="number" id="rr-scoring-input" placeholder="ครั้ง/นาที" min="0" max="200" value="${state.rrValue}" />
            <span class="unit-text">ครั้ง/นาที</span>
        </div>
        <div class="input-row">
            <label for="spo2-scoring-input">กรอก SpO₂ (%):</label>
            <input type="number" id="spo2-scoring-input" placeholder="%" min="0" max="100" value="${state.spo2}" />
            <span class="unit-text">%</span>
        </div>
        <div class="selector-row">
            <label>Retraction:</label>
            <div class="option-buttons" id="retraction-options"></div>
        </div>
        <div class="selector-row">
            <label>FiO₂:</label>
            <div class="option-buttons" id="fio2-options"></div>
        </div>
        <div class="selector-row">
            <label>O₂ (LPM):</label>
            <div class="option-buttons" id="o2-options"></div>
        </div>
        <div class="score-grid" id="respiratory-grid"></div>
    `;

    // Render retraction options
    const retractionContainer = document.getElementById('retraction-options');
    retractionOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        if (state.retraction === option.value) button.classList.add('selected');
        button.textContent = option.label;
        button.addEventListener('click', () => {
            state.retraction = option.value;
            state.retractionScore = option.score;
            renderRespiratorySection();
            calculateRespiratoryScore();
        });
        retractionContainer.appendChild(button);
    });

    // Render FiO2 options
    const fio2Container = document.getElementById('fio2-options');
    fio2Options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        if (state.fio2 === option.value) button.classList.add('selected');
        button.textContent = option.label;
        button.addEventListener('click', () => {
            state.fio2 = option.value;
            state.fio2Score = option.score;
            renderRespiratorySection();
            calculateRespiratoryScore();
        });
        fio2Container.appendChild(button);
    });

    // Render O2 options
    const o2Container = document.getElementById('o2-options');
    o2Options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        if (state.o2Lpm === option.value) button.classList.add('selected');
        button.textContent = option.label;
        button.addEventListener('click', () => {
            state.o2Lpm = option.value;
            state.o2Score = option.score;
            renderRespiratorySection();
            calculateRespiratoryScore();
        });
        o2Container.appendChild(button);
    });

    // Render respiratory score buttons (0-3)
    const grid = document.getElementById('respiratory-grid');
    for (let score = 0; score <= 3; score++) {
        const button = document.createElement('button');
        button.className = 'score-button';
        if (state.respiratoryScore === score) button.classList.add('selected');
        button.innerHTML = `
            <div class="score-label">คะแนน ${score}</div>
            <div class="score-value">${score}</div>
        `;
        button.addEventListener('click', () => {
            state.respiratoryScore = score;
            renderRespiratorySection();
            updateTotalScore();
        });
        grid.appendChild(button);
    }

    // Add RR input listener
    const rrInput = document.getElementById('rr-scoring-input');
    rrInput.addEventListener('input', (e) => {
        state.rrValue = e.target.value;
        state.rrVitalSign = e.target.value;
        calculateRRScore();
        calculateRespiratoryScore();
    });

    // Add SpO2 input listener
    const spo2Input = document.getElementById('spo2-scoring-input');
    spo2Input.addEventListener('input', (e) => {
        state.spo2 = e.target.value;
        calculateSpO2Score();
        calculateRespiratoryScore();
    });
}

function calculateRRScore() {
    const rr = parseInt(state.rrValue);
    const ageId = state.ageGroup;
    
    if (isNaN(rr) || !ageId) {
        state.rrScore = null;
        return;
    }

    // RR scoring based on age group
    if (ageId === 'newborn' || ageId === 'infant') {
        // Normal: 35-50
        if (rr >= 35 && rr <= 50) state.rrScore = 0;
        else if (rr >= 51 && rr <= 59) state.rrScore = 1;
        else if (rr >= 60 && rr <= 69) state.rrScore = 2;
        else if (rr <= 30 || rr >= 70) state.rrScore = 3;
    } else if (ageId === 'toddler') {
        // Normal: 25-40
        if (rr >= 25 && rr <= 40) state.rrScore = 0;
        else if (rr >= 41 && rr <= 49) state.rrScore = 1;
        else if (rr >= 50 && rr <= 59) state.rrScore = 2;
        else if (rr <= 20 || rr >= 60) state.rrScore = 3;
    } else {
        // Preschool, School age, Adolescent - Normal: 20-30
        if (rr >= 20 && rr <= 30) state.rrScore = 0;
        else if (rr >= 31 && rr <= 39) state.rrScore = 1;
        else if (rr >= 40 && rr <= 49) state.rrScore = 2;
        else if (rr <= 16 || rr >= 50) state.rrScore = 3;
    }
}

function calculateSpO2Score() {
    const spo2 = parseInt(state.spo2);
    
    if (isNaN(spo2)) {
        state.spo2Score = null;
        return;
    }

    // SpO2 < 95% = score 3
    // Cyanotic CHD + SpO2 < 75% = score 3
    if (state.chdType === 'cyanotic' && spo2 < 75) {
        state.spo2Score = 3;
    } else if (spo2 < 95) {
        state.spo2Score = 3;
    } else {
        state.spo2Score = 0;
    }
}

function calculateRespiratoryScore() {
    // Get max score from RR, retraction, FiO2, O2, SpO2
    const scores = [
        state.rrScore || 0,
        state.retractionScore || 0,
        state.fio2Score || 0,
        state.o2Score || 0,
        state.spo2Score || 0
    ];
    state.respiratoryScore = Math.max(...scores);

    // Update UI
    document.querySelectorAll('#respiratory-grid .score-button').forEach((btn, index) => {
        btn.classList.toggle('selected', index === state.respiratoryScore);
    });
    updateTotalScore();
}

function updateTotalScore() {
    const behavior = state.behaviorScore || 0;
    const temperature = state.temperatureScore || 0;
    const cardiovascular = state.cardiovascularScore || 0;
    const respiratory = state.respiratoryScore || 0;
    const additional = state.additionalRisk ? 2 : 0;
    
    const total = behavior + temperature + cardiovascular + respiratory + additional;

    const display = document.getElementById('total-score-display');
    const recommendation = getRecommendation(total);
    const riskLevel = getRiskLevel(total);

    display.className = `total-score ${riskLevel}`;
    display.innerHTML = `
        <div class="total-score-header">
            คะแนนรวม: <span class="total-score-number">${total}</span>
        </div>
        <div class="total-score-breakdown">
            พฤติกรรม: ${behavior} | Temp: ${temperature} | ไหลเวียน: ${cardiovascular} | หายใจ: ${respiratory}${additional > 0 ? ` | +${additional}` : ''}
        </div>
        <div class="total-score-recommendation">${recommendation}</div>
    `;
    
    document.getElementById('nursing-notes').value = recommendation;
    state.nursingNotes = recommendation;
}

function getRiskLevel(score) {
    if (score <= 1) return 'low';
    if (score === 2) return 'medium';
    if (score === 3) return 'orange';
    return 'high';
}

function getRecommendation(score) {
    if (score <= 1) return 'รับบริการตามปกติ';
    if (score === 2) return 'ติดตาม และ ประเมินอาการ ทุก 1-2 ชั่วโมง';
    if (score === 3) return 'ให้ผู้ป่วยได้รับการประเมินโดยแพทย์ ภายใน 30 นาที';
    if (score >= 4) return 'ส่งต่อ ER';
    return 'รับบริการตามปกติ';
}

function saveRecord(actionType) {
    const now = Date.now();
    if (isSavingRecord || (now - lastSaveTime < SAVE_COOLDOWN)) {
        return;
    }

    if (!state.ageGroup) {
        document.getElementById('age-error').style.display = 'block';
        return;
    }

    isSavingRecord = true;
    lastSaveTime = now;

    const behavior = state.behaviorScore || 0;
    const temperature = state.temperatureScore || 0;
    const cardiovascular = state.cardiovascularScore || 0;
    const respiratory = state.respiratoryScore || 0;
    const additional = state.additionalRisk ? 2 : 0;
    const total = behavior + temperature + cardiovascular + respiratory + additional;

    const record = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        hn: state.hn,
        location: state.location === 'อื่นๆ' ? state.locationOther : state.location,
        ageGroup: ageGroups.find(a => a.id === state.ageGroup)?.name || '',
        behaviorScore: behavior,
        temperatureScore: temperature,
        cardiovascularScore: cardiovascular,
        respiratoryScore: respiratory,
        additionalRisk: state.additionalRisk,
        totalScore: total,
        nursingNotes: state.nursingNotes,
        symptomsChanged: state.symptomsChanged,
        transferDestination: state.transferDestination === 'อื่นๆ' ? state.transferDestinationOther : state.transferDestination,
        actionType: actionType,
        temperature: state.temperature,
        pulse: state.pulse,
        prValue: state.prValue,
        rrVitalSign: state.rrVitalSign,
        bloodPressure: state.bloodPressure,
        spo2: state.spo2,
        chdType: state.chdType,
        palsEnabled: state.palsEnabled,
        isReassessment: state.isReassessment,
        parentRecordId: state.parentRecordId,
        skinColor: state.skinColor,
        crt: state.crt,
        retraction: state.retraction,
        fio2: state.fio2,
        o2Lpm: state.o2Lpm,
        prScore: state.prScore,
        skinColorScore: state.skinColorScore,
        crtScore: state.crtScore,
        rrScore: state.rrScore,
        retractionScore: state.retractionScore,
        fio2Score: state.fio2Score,
        o2Score: state.o2Score,
        spo2Score: state.spo2Score
    };

    state.records.unshift(record);
    saveRecordsToStorage();
    renderRecords();
    
    alert('บันทึกข้อมูลสำเร็จ!');
    
    setTimeout(() => {
        isSavingRecord = false;
    }, SAVE_COOLDOWN);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function loadRecords() {
    try {
        const saved = localStorage.getItem('pewsRecords');
        if (saved) {
            state.records = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Error loading records:', e);
        state.records = [];
    }
}

function saveRecordsToStorage() {
    try {
        localStorage.setItem('pewsRecords', JSON.stringify(state.records));
    } catch (e) {
        console.error('Error saving records:', e);
    }
}

function renderRecords() {
    const container = document.getElementById('records-list');
    
    if (state.records.length === 0) {
        container.innerHTML = '<div class="empty-records">ยังไม่มีประวัติการบันทึก</div>';
        return;
    }

    container.innerHTML = state.records.map(record => {
        const date = new Date(record.timestamp);
        const formattedDate = date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const scoreClass = getScoreClass(record.totalScore);
        const actionBadge = record.actionType === 'Transfer' 
            ? '<span class="transfer-badge">ส่งต่อ</span>'
            : '<span class="action-badge">บันทึก</span>';

        const reassessmentBadge = record.isReassessment 
            ? '<span class="reassessment-badge">ประเมินซ้ำ</span>'
            : '';

        const skinColorLabel = skinColorOptions.find(o => o.value === record.skinColor)?.label || '-';
        const crtLabel = crtOptions.find(o => o.value === record.crt)?.label || '-';
        const retractionLabel = retractionOptions.find(o => o.value === record.retraction)?.label || '-';
        const fio2Label = fio2Options.find(o => o.value === record.fio2)?.label || '-';
        const o2Label = o2Options.find(o => o.value === record.o2Lpm)?.label || '-';

        return `
            <div class="record-card">
                <div class="record-header">
                    <div>
                        <span class="total-score-badge ${scoreClass}">คะแนน: ${record.totalScore}</span>
                        ${actionBadge}
                        ${reassessmentBadge}
                        ${record.chdType ? `<span class="chd-badge">${record.chdType === 'acyanotic' ? 'Acyanotic' : 'Cyanotic'} CHD</span>` : ''}
                        ${record.palsEnabled ? '<span class="pals-badge">PALS</span>' : ''}
                    </div>
                    <span class="record-date">${formattedDate}</span>
                </div>
                <div class="record-details">
                    <div class="detail-row">
                        <span class="detail-label">HN:</span>
                        <span>${record.hn || '-'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">สถานที่:</span>
                        <span>${record.location || '-'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">ช่วงอายุ:</span>
                        <span>${record.ageGroup || '-'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">คะแนน:</span>
                        <span>พฤติกรรม: ${record.behaviorScore}, Temp: ${record.temperatureScore || 0}, ไหลเวียน: ${record.cardiovascularScore}, หายใจ: ${record.respiratoryScore}</span>
                    </div>
                    ${record.transferDestination ? `
                    <div class="detail-row">
                        <span class="detail-label">ส่งต่อไป:</span>
                        <span>${record.transferDestination}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="vital-signs-summary">
                    <h4>ข้อมูลการประเมิน</h4>
                    <div class="vital-signs-summary-grid">
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">Temp</span>
                            <span class="vital-summary-value">${record.temperature || '-'} °C</span>
                        </div>
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">PR</span>
                            <span class="vital-summary-value">${record.prValue || record.pulse || '-'} bpm</span>
                        </div>
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">RR</span>
                            <span class="vital-summary-value">${record.rrVitalSign || '-'} tpm</span>
                        </div>
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">SpO2</span>
                            <span class="vital-summary-value">${record.spo2 || '-'} %</span>
                        </div>
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">BP</span>
                            <span class="vital-summary-value">${record.bloodPressure || '-'}</span>
                        </div>
                    </div>
                    <div class="vital-signs-summary-grid" style="margin-top: 0.75rem;">
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">สีผิว</span>
                            <span class="vital-summary-value">${skinColorLabel}</span>
                        </div>
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">CRT</span>
                            <span class="vital-summary-value">${crtLabel}</span>
                        </div>
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">Retraction</span>
                            <span class="vital-summary-value">${retractionLabel}</span>
                        </div>
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">FiO₂</span>
                            <span class="vital-summary-value">${fio2Label}</span>
                        </div>
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">O₂</span>
                            <span class="vital-summary-value">${o2Label}</span>
                        </div>
                    </div>
                </div>
                <div class="detail-row" style="margin-top: 0.75rem;">
                    <span class="detail-label">การพยาบาล:</span>
                    <span>${record.nursingNotes || '-'}</span>
                </div>
                <div class="record-actions">
                    <button class="reassess-btn" onclick="startReassessment('${record.id}')">ประเมินซ้ำ</button>
                    <button class="delete-btn" onclick="deleteRecord('${record.id}')">ลบ</button>
                </div>
            </div>
        `;
    }).join('');
}

function getScoreClass(score) {
    if (score <= 1) return 'score-green';
    if (score === 2) return 'score-yellow';
    if (score === 3) return 'score-orange';
    return 'score-red';
}

function startReassessment(recordId) {
    const record = state.records.find(r => r.id === recordId);
    if (!record) return;

    state.parentRecordId = recordId;
    state.isReassessment = true;
    state.hn = record.hn;

    document.getElementById('hn-input-top').value = record.hn;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    alert('โหมดประเมินซ้ำ - กรุณากรอกข้อมูลการประเมินใหม่');
}

function deleteRecord(recordId) {
    if (!confirm('คุณต้องการลบบันทึกนี้หรือไม่?')) return;
    state.records = state.records.filter(r => r.id !== recordId);
    saveRecordsToStorage();
    renderRecords();
}

function resetForm() {
    state.ageGroup = null;
    state.behaviorScore = null;
    state.temperatureScore = null;
    state.cardiovascularScore = null;
    state.respiratoryScore = null;
    state.additionalRisk = false;
    state.hn = '';
    state.location = '';
    state.locationOther = '';
    state.nursingNotes = '';
    state.symptomsChanged = 'no';
    state.transferDestination = '';
    state.transferDestinationOther = '';
    state.prValue = '';
    state.rrValue = '';
    state.temperature = '';
    state.pulse = '';
    state.rrVitalSign = '';
    state.bloodPressure = '';
    state.spo2 = '';
    state.parentRecordId = null;
    state.isReassessment = false;
    state.chdType = '';
    state.palsEnabled = false;
    state.skinColor = '';
    state.crt = '';
    state.retraction = 'no';
    state.fio2 = 'none';
    state.o2Lpm = 'none';
    state.prScore = null;
    state.skinColorScore = null;
    state.crtScore = null;
    state.rrScore = null;
    state.retractionScore = null;
    state.fio2Score = null;
    state.o2Score = null;
    state.spo2Score = null;

    // Reset form inputs
    document.getElementById('hn-input-top').value = '';
    document.getElementById('location-select').value = '';
    document.getElementById('location-other').value = '';
    document.getElementById('location-other').style.display = 'none';
    document.getElementById('nursing-notes').value = '';
    document.getElementById('transfer-destination-select').value = '';
    document.getElementById('transfer-destination-other').value = '';
    document.getElementById('transfer-destination-other').style.display = 'none';
    document.getElementById('additional-risk').checked = false;
    document.getElementById('bp-input').value = '';

    // Hide sections
    document.getElementById('temperature-section').style.display = 'none';
    document.getElementById('cardiovascular-section').style.display = 'none';
    document.getElementById('respiratory-section').style.display = 'none';

    document.getElementById('chd-selected').style.display = 'none';
    document.getElementById('pals-button').classList.remove('active');

    document.querySelectorAll('.symptom-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.value === 'no') {
            btn.classList.add('active');
        }
    });

    document.querySelectorAll('.age-button').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.score-button').forEach(btn => btn.classList.remove('selected'));

    // Reset section headers
    const cardioHeader = document.querySelector('#cardiovascular-section .section-header h2');
    if (cardioHeader) {
        cardioHeader.innerHTML = 'ระบบไหลเวียนโลหิต';
    }

    const respHeader = document.querySelector('#respiratory-section .section-header h2');
    if (respHeader) {
        respHeader.innerHTML = 'ระบบทางเดินหายใจ';
    }

    renderAgeGrid();
    renderBehaviorGrid();
    updateTotalScore();
}
