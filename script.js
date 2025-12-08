// Age groups data with updated PR ranges
const ageGroups = [
    {
        id: 'newborn',
        name: 'Newborn',
        ageRange: 'แรกเกิด-1 เดือน',
        heartRate: { min: 80, max: 140 },
        respiratoryRate: { min: 35, max: 50 }
    },
    {
        id: 'infant',
        name: 'Infant',
        ageRange: '1-12 เดือน',
        heartRate: { min: 80, max: 140 },
        respiratoryRate: { min: 35, max: 50 }
    },
    {
        id: 'toddler',
        name: 'Toddler',
        ageRange: '13 เดือน - 3 ปี',
        heartRate: { min: 70, max: 130 },
        respiratoryRate: { min: 25, max: 40 }
    },
    {
        id: 'preschool',
        name: 'Preschool',
        ageRange: '4-6 ปี',
        heartRate: { min: 70, max: 120 },
        respiratoryRate: { min: 20, max: 30 }
    },
    {
        id: 'schoolage',
        name: 'School age',
        ageRange: '7-12 ปี',
        heartRate: { min: 70, max: 110 },
        respiratoryRate: { min: 20, max: 30 }
    },
    {
        id: 'adolescent',
        name: 'Adolescent',
        ageRange: '13-19 ปี',
        heartRate: { min: 60, max: 100 },
        respiratoryRate: { min: 20, max: 30 }
    }
];

// Behavior options
const behaviorOptions = [
    { score: 0, label: "เล่นเหมาะสม" },
    { score: 1, label: "หลับ" },
    { score: 2, label: "ร้องไห้งอแง พักไม่ได้" },
    { score: 3, label: "ซึม/สับสน หรือ ตอบสนองต่อการกระตุ้นความปวดลดลง" }
];

// State
let state = {
    ageGroup: null,
    temperatureValue: '',
    temperatureScore: null,
    behaviorScore: null,
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
    skinColor: '',
    crt: '',
    retraction: '',
    fio2: '',
    o2: '',
    bloodPressure: '',
    spo2: '',
    parentRecordId: null,
    isReassessment: false,
    chdType: '',
    palsEnabled: false,
    records: []
};

let isSavingRecord = false;
let lastSaveTime = 0;
const SAVE_COOLDOWN = 2000;
const submittedRecordIds = new Set();

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadRecords();
    renderAgeGrid();
    renderBehaviorGrid();
    updateTotalScore();
    renderRecords();

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

    // Temperature input
    const tempInput = document.getElementById('temp-input');
    if (tempInput) {
        tempInput.addEventListener('input', (e) => {
            state.temperatureValue = e.target.value;
            document.querySelectorAll('#temp-options .option-btn').forEach(btn => btn.classList.remove('selected'));
            calculateTemperatureScore();
        });
    }

    // Temperature option buttons
    document.querySelectorAll('#temp-options .option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#temp-options .option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            const tempValue = this.dataset.temp;
            state.temperatureValue = tempValue;
            if (tempInput) {
                tempInput.value = tempValue;
            }
            calculateTemperatureScore();
        });
    });

    // PR input
    const prInput = document.getElementById('pr-input');
    if (prInput) {
        prInput.addEventListener('input', (e) => {
            state.prValue = e.target.value;
            calculateCardiovascularScore();
        });
    }

    // Skin color buttons
    document.querySelectorAll('#skin-color-options .option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#skin-color-options .option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            state.skinColor = this.dataset.value;
            calculateCardiovascularScore();
        });
    });

    // CRT buttons
    document.querySelectorAll('#crt-options .option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#crt-options .option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            state.crt = this.dataset.value;
            calculateCardiovascularScore();
        });
    });

    // BP input
    const bpInput = document.getElementById('bp-input');
    if (bpInput) {
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
    }

    // RR input
    const rrInput = document.getElementById('rr-input');
    if (rrInput) {
        rrInput.addEventListener('input', (e) => {
            state.rrValue = e.target.value;
            calculateRespiratoryScore();
        });
    }

    // Retraction buttons
    document.querySelectorAll('#retraction-options .option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#retraction-options .option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            state.retraction = this.dataset.value;
            calculateRespiratoryScore();
        });
    });

    // FiO2 buttons
    document.querySelectorAll('#fio2-options .option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#fio2-options .option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            state.fio2 = this.dataset.value;
            calculateRespiratoryScore();
        });
    });

    // O2 buttons
    document.querySelectorAll('#o2-options .option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#o2-options .option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            state.o2 = this.dataset.value;
            calculateRespiratoryScore();
        });
    });

    // SpO2 input
    const spo2Input = document.getElementById('spo2-input');
    if (spo2Input) {
        spo2Input.addEventListener('input', (e) => {
            state.spo2 = e.target.value;
            calculateRespiratoryScore();
            checkCyanoticCHDCondition();
        });
    }

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
            checkCyanoticCHDCondition();
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
    checkCyanoticCHDCondition();
}

function calculateTemperatureScore() {
    const temp = parseFloat(state.temperatureValue);
    let score = null;

    if (!isNaN(temp)) {
        if (temp <= 37.9) {
            score = 0;
        } else if (temp >= 38.0 && temp <= 38.9) {
            score = 1;
        } else if (temp >= 39) {
            score = 2;
        }
    }

    state.temperatureScore = score;

    // Update visual feedback
    document.querySelectorAll('#temp-score-display .score-display-item').forEach(item => {
        item.classList.toggle('selected', parseInt(item.dataset.score) === score);
    });

    updateTotalScore();
}

function calculateCardiovascularScore() {
    if (!state.ageGroup) return;

    const ageDetails = ageGroups.find(a => a.id === state.ageGroup);
    const pr = parseInt(state.prValue);
    const skinColor = state.skinColor;
    const crt = state.crt;

    let prScore = null;
    let skinCrtScore = null;

    // Calculate PR score based on age group
    if (!isNaN(pr)) {
        if (state.ageGroup === 'newborn' || state.ageGroup === 'infant') {
            if (pr <= 140) prScore = 0;
            else if (pr >= 141 && pr <= 149) prScore = 1;
            else if (pr >= 150 && pr <= 159) prScore = 2;
            else if (pr >= 160 || pr <= 79) prScore = 3;
        } else if (state.ageGroup === 'toddler') {
            if (pr <= 130) prScore = 0;
            else if (pr >= 131 && pr <= 139) prScore = 1;
            else if (pr >= 140 && pr <= 149) prScore = 2;
            else if (pr >= 150 || pr <= 69) prScore = 3;
        } else if (state.ageGroup === 'preschool') {
            if (pr <= 120) prScore = 0;
            else if (pr >= 121 && pr <= 129) prScore = 1;
            else if (pr >= 130 && pr <= 139) prScore = 2;
            else if (pr >= 140 || pr <= 69) prScore = 3;
        } else if (state.ageGroup === 'schoolage') {
            if (pr <= 110) prScore = 0;
            else if (pr >= 111 && pr <= 119) prScore = 1;
            else if (pr >= 120 && pr <= 129) prScore = 2;
            else if (pr >= 130 || pr <= 69) prScore = 3;
        } else if (state.ageGroup === 'adolescent') {
            if (pr <= 100) prScore = 0;
            else if (pr >= 111 && pr <= 119) prScore = 1;
            else if (pr >= 120 && pr <= 129) prScore = 2;
            else if (pr >= 130 || pr <= 59) prScore = 3;
        }
    }

    // Calculate skin color and CRT score
    if (skinColor === 'pink' && crt === '1-2') {
        skinCrtScore = 0;
    } else if (skinColor === 'pale' || crt === '3') {
        skinCrtScore = 1;
    } else if (skinColor === 'gray' || crt === '4+') {
        skinCrtScore = 2;
    } else if (skinColor === 'mottled') {
        skinCrtScore = 3;
    }

    // Final score is the maximum of PR score and skin/CRT score
    let finalScore = null;
    if (prScore !== null && skinCrtScore !== null) {
        finalScore = Math.max(prScore, skinCrtScore);
    } else if (prScore !== null) {
        finalScore = prScore;
    } else if (skinCrtScore !== null) {
        finalScore = skinCrtScore;
    }

    state.cardiovascularScore = finalScore;

    // Update visual feedback with age-specific descriptions
    const scoreDisplayContainer = document.getElementById('cardiovascular-score-display');
    if (scoreDisplayContainer) {
        let scoreDescriptions = [];

        if (state.ageGroup === 'newborn' || state.ageGroup === 'infant') {
            scoreDescriptions = [
                { score: 0, label: 'PR ≤ 140 bpm ผิวสีชมพูดี หรือ CRT 1-2 วินาที' },
                { score: 1, label: 'PR 141-149 bpm ผิวสีซีด หรือ CRT 3 วินาที' },
                { score: 2, label: 'PR 150-159 bpm ผิวสีเทา หรือ CRT 4 วินาที' },
                { score: 3, label: 'PR ≥ 160 bpm หรือ PR ≤ 79 bpm ผิวสีเทาและตัวลาย หรือ CRT ≥ 5 วินาที' }
            ];
        } else if (state.ageGroup === 'toddler') {
            scoreDescriptions = [
                { score: 0, label: 'PR ≤ 130 bpm ผิวสีชมพูดี หรือ CRT 1-2 วินาที' },
                { score: 1, label: 'PR 131-139 bpm ผิวสีซีด หรือ CRT 3 วินาที' },
                { score: 2, label: 'PR 140-149 bpm ผิวสีเทา หรือ CRT 4 วินาที' },
                { score: 3, label: 'PR ≥ 150 bpm หรือ PR ≤ 69 bpm ผิวสีเทาและตัวลาย หรือ CRT ≥ 5 วินาที' }
            ];
        } else if (state.ageGroup === 'preschool') {
            scoreDescriptions = [
                { score: 0, label: 'PR ≤ 120 bpm ผิวสีชมพูดี หรือ CRT 1-2 วินาที' },
                { score: 1, label: 'PR 121-129 bpm ผิวสีซีด หรือ CRT 3 วินาที' },
                { score: 2, label: 'PR 130-139 bpm ผิวสีเทา หรือ CRT 4 วินาที' },
                { score: 3, label: 'PR ≥ 140 bpm หรือ PR ≤ 69 bpm ผิวสีเทาและตัวลาย หรือ CRT ≥ 5 วินาที' }
            ];
        } else if (state.ageGroup === 'schoolage') {
            scoreDescriptions = [
                { score: 0, label: 'PR ≤ 110 bpm ผิวสีชมพูดี หรือ CRT 1-2 วินาที' },
                { score: 1, label: 'PR 111-119 bpm ผิวสีซีด หรือ CRT 3 วินาที' },
                { score: 2, label: 'PR 120-129 bpm ผิวสีเทา หรือ CRT 4 วินาที' },
                { score: 3, label: 'PR ≥ 130 bpm หรือ PR ≤ 69 bpm ผิวสีเทาและตัวลาย หรือ CRT ≥ 5 วินาที' }
            ];
        } else if (state.ageGroup === 'adolescent') {
            scoreDescriptions = [
                { score: 0, label: 'PR ≤ 100 bpm ผิวสีชมพูดี หรือ CRT 1-2 วินาที' },
                { score: 1, label: 'PR 111-119 bpm ผิวสีซีด หรือ CRT 3 วินาที' },
                { score: 2, label: 'PR 120-129 bpm ผิวสีเทา หรือ CRT 4 วินาที' },
                { score: 3, label: 'PR ≥ 130 bpm หรือ PR ≤ 59 bpm ผิวสีเทาและตัวลาย หรือ CRT ≥ 5 วินาที' }
            ];
        }

        if (scoreDescriptions.length > 0) {
            scoreDisplayContainer.innerHTML = scoreDescriptions.map(desc => `
                <div class="score-display-item ${finalScore === desc.score ? 'selected' : ''}" data-score="${desc.score}">
                    <div class="score-display-label">${desc.label}</div>
                    <div class="score-display-value">${desc.score}</div>
                </div>
            `).join('');
        }
    }

    updateTotalScore();
}

function calculateRespiratoryScore() {
    if (!state.ageGroup) return;

    const ageDetails = ageGroups.find(a => a.id === state.ageGroup);
    const rr = parseInt(state.rrValue);
    const spo2 = parseFloat(state.spo2);

    let rrScore = null;
    let oxygenScore = null;
    let spo2Score = null;

    // Calculate RR score based on age group
    if (!isNaN(rr)) {
        if (state.ageGroup === 'newborn' || state.ageGroup === 'infant') {
            if (rr >= 35 && rr <= 50) rrScore = 0;
            else if (rr >= 51 && rr <= 59) rrScore = 1;
            else if (rr >= 60 && rr <= 69) rrScore = 2;
            else if (rr <= 30) rrScore = 3;
        } else if (state.ageGroup === 'toddler') {
            if (rr >= 25 && rr <= 40) rrScore = 0;
            else if (rr >= 41 && rr <= 49) rrScore = 1;
            else if (rr >= 50 && rr <= 59) rrScore = 2;
            else if (rr <= 20) rrScore = 3;
        } else if (state.ageGroup === 'preschool' || state.ageGroup === 'schoolage' || state.ageGroup === 'adolescent') {
            if (rr >= 20 && rr <= 30) rrScore = 0;
            else if (rr >= 31 && rr <= 39) rrScore = 1;
            else if (rr >= 40 && rr <= 49) rrScore = 2;
            else if (rr <= 16) rrScore = 3;
        }
    }

    // Add retraction modifier
    if (state.retraction === 'yes' && rrScore !== null && rrScore < 3) {
        rrScore = Math.min(rrScore + 1, 3);
    }

    // Calculate oxygen support score (FiO2 or O2)
    if (state.fio2 === '30' || state.o2 === '4') {
        oxygenScore = 1;
    } else if (state.fio2 === '40' || state.o2 === '6') {
        oxygenScore = 2;
    } else if (state.fio2 === '50' || state.o2 === '8') {
        oxygenScore = 3;
    }

    // Calculate SpO2 score
    if (!isNaN(spo2)) {
        if (spo2 < 95) {
            spo2Score = 3;
        }
        // Check for Cyanotic CHD condition
        if (state.chdType === 'cyanotic' && spo2 < 75) {
            spo2Score = 3;
        }
    }

    // Final score is the maximum of all scores
    let finalScore = 0;
    if (rrScore !== null) finalScore = Math.max(finalScore, rrScore);
    if (oxygenScore !== null) finalScore = Math.max(finalScore, oxygenScore);
    if (spo2Score !== null) finalScore = Math.max(finalScore, spo2Score);

    state.respiratoryScore = finalScore;

    // Update visual feedback with age-specific descriptions
    const scoreDisplayContainer = document.getElementById('respiratory-score-display');
    if (scoreDisplayContainer) {
        let scoreDescriptions = [];

        if (state.ageGroup === 'newborn' || state.ageGroup === 'infant') {
            scoreDescriptions = [
                { score: 0, label: 'RR ≤ 50 tpm/ไม่มี Retraction' },
                { score: 1, label: 'RR 51-59 tpm หรือมี Retraction หรือ FiO₂ ≥ 30% หรือ O₂ ≥ 4 LPM' },
                { score: 2, label: 'RR 60-69 tpm หรือมี Retraction หรือ FiO₂ ≥ 40% หรือ O₂ ≥ 6 LPM' },
                { score: 3, label: 'RR ≤ 30 tpm หรือมี Retraction/Grunting หรือ FiO₂ ≥ 50% หรือ O₂ ≥ 8 LPM หรือ SpO₂ < 95%' }
            ];
        } else if (state.ageGroup === 'toddler') {
            scoreDescriptions = [
                { score: 0, label: 'RR ≤ 40 tpm/ไม่มี Retraction' },
                { score: 1, label: 'RR 41-49 tpm หรือมี Retraction หรือ FiO₂ ≥ 30% หรือ O₂ ≥ 4 LPM' },
                { score: 2, label: 'RR 50-59 tpm หรือมี Retraction หรือ FiO₂ ≥ 40% หรือ O₂ ≥ 6 LPM' },
                { score: 3, label: 'RR ≤ 20 tpm หรือมี Retraction/Grunting หรือ FiO₂ ≥ 50% หรือ O₂ ≥ 8 LPM หรือ SpO₂ < 95%' }
            ];
        } else if (state.ageGroup === 'preschool' || state.ageGroup === 'schoolage' || state.ageGroup === 'adolescent') {
            scoreDescriptions = [
                { score: 0, label: 'RR ≤ 30 tpm/ไม่มี Retraction' },
                { score: 1, label: 'RR 31-39 tpm หรือมี Retraction หรือ FiO₂ ≥ 30% หรือ O₂ ≥ 4 LPM' },
                { score: 2, label: 'RR 40-49 tpm หรือมี Retraction หรือ FiO₂ ≥ 40% หรือ O₂ ≥ 6 LPM' },
                { score: 3, label: 'RR ≤ 16 tpm หรือมี Retraction/Grunting หรือ FiO₂ ≥ 50% หรือ O₂ ≥ 8 LPM หรือ SpO₂ < 95%' }
            ];
        }

        if (scoreDescriptions.length > 0) {
            scoreDisplayContainer.innerHTML = scoreDescriptions.map(desc => `
                <div class="score-display-item ${finalScore === desc.score ? 'selected' : ''}" data-score="${desc.score}">
                    <div class="score-display-label">${desc.label}</div>
                    <div class="score-display-value">${desc.score}</div>
                </div>
            `).join('');
        }
    }

    updateTotalScore();
}

function checkCyanoticCHDCondition() {
    calculateRespiratoryScore();
    updateTotalScore();
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
    if (state.ageGroup === ageId) {
        state.ageGroup = null;
        document.querySelectorAll('.age-button').forEach(btn => btn.classList.remove('selected'));
        document.getElementById('temp-input-container').style.display = 'none';
        document.getElementById('cardiovascular-input-container').style.display = 'none';
        document.getElementById('respiratory-input-container').style.display = 'none';
        document.getElementById('temperature-warning').style.display = 'block';
        document.getElementById('cardiovascular-warning').style.display = 'block';
        document.getElementById('respiratory-warning').style.display = 'block';
        return;
    }

    state.ageGroup = ageId;
    document.getElementById('age-error').style.display = 'none';
    document.querySelectorAll('.age-button').forEach((btn, index) => {
        btn.classList.toggle('selected', ageGroups[index].id === ageId);
    });

    const ageGroup = ageGroups.find(a => a.id === ageId);
    if (ageGroup) {
        // Show temperature input
        document.getElementById('temp-input-container').style.display = 'block';
        document.getElementById('temperature-warning').style.display = 'none';

        // Show cardiovascular inputs
        const cardioHeader = document.querySelector('#cardiovascular-section .section-header h2');
        if (cardioHeader) {
            cardioHeader.innerHTML = `ระบบไหลเวียนโลหิต (Cardiovascular) <span style="color: #2563eb; font-weight: 600; font-size: 0.9rem; margin-left: 0.5rem;">PR ปกติ : ${ageGroup.heartRate.min} - ${ageGroup.heartRate.max} ครั้ง/นาที</span>`;
        }
        document.getElementById('cardiovascular-input-container').style.display = 'block';
        document.getElementById('cardiovascular-warning').style.display = 'none';

        // Show respiratory inputs
        const respHeader = document.querySelector('#respiratory-section .section-header h2');
        if (respHeader) {
            respHeader.innerHTML = `ระบบทางเดินหายใจ (Respiratory) <span style="color: #2563eb; font-weight: 600; font-size: 0.9rem; margin-left: 0.5rem;">RR ปกติ : ${ageGroup.respiratoryRate.min} - ${ageGroup.respiratoryRate.max} ครั้ง/นาที</span>`;
        }
        document.getElementById('respiratory-input-container').style.display = 'block';
        document.getElementById('respiratory-warning').style.display = 'none';

        // Recalculate scores to update displays with age-specific descriptions
        calculateCardiovascularScore();
        calculateRespiratoryScore();
    }
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
    if (state.behaviorScore === score) {
        state.behaviorScore = null;
    } else {
        state.behaviorScore = score;
    }
    document.querySelectorAll('#behavior-grid .score-button').forEach((btn, index) => {
        btn.classList.toggle('selected', behaviorOptions[index].score === state.behaviorScore);
    });
    updateTotalScore();
}

function updateTotalScore() {
    const temperature = state.temperatureScore || 0;
    const behavior = state.behaviorScore || 0;
    const cardiovascular = state.cardiovascularScore || 0;
    const respiratory = state.respiratoryScore || 0;
    const additional = state.additionalRisk ? 2 : 0;
    const total = temperature + behavior + cardiovascular + respiratory + additional;

    const display = document.getElementById('total-score-display');
    const recommendation = getRecommendation(total);
    const riskLevel = getRiskLevel(total);

    display.className = `total-score ${riskLevel}`;
    display.innerHTML = `
        <div class="total-score-wrapper">
            <div class="total-score-main">
                <div class="total-score-content">
                    <div class="total-score-label">คะแนนรวม PEWS</div>
                    <div class="total-score-number">${total}</div>
                </div>
            </div>
            <div class="total-score-breakdown">
                <div class="breakdown-item">
                    <span class="breakdown-label">Temp</span>
                    <span class="breakdown-value">${temperature}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">พฤติกรรม</span>
                    <span class="breakdown-value">${behavior}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">ไหลเวียน</span>
                    <span class="breakdown-value">${cardiovascular}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">หายใจ</span>
                    <span class="breakdown-value">${respiratory}</span>
                </div>
                ${additional > 0 ? `
                <div class="breakdown-item additional">
                    <span class="breakdown-label">เสี่ยง</span>
                    <span class="breakdown-value">${additional}</span>
                </div>
                ` : ''}
            </div>
            <div class="total-score-recommendation">
                <div class="recommendation-text">${recommendation}</div>
            </div>
        </div>
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

async function submitToGoogleForm(record) {
    if (submittedRecordIds.has(record.id)) {
        return;
    }

    // Google Form URL ของคุณ
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdNjCW8kkM3zOJfxL8aC5vWoS32_FIpf4yYusaujFOKbhxQrQ/formResponse';
    const formData = new FormData();

    const safeText = (val) => {
        if (val === undefined || val === null || String(val).trim() === '') {
            return '-';
        }
        return String(val);
    };

    // แปลงชื่อช่วงอายุเป็นภาษาไทย
    const ageGroupMapping = {
        'newborn': 'Newborn (แรกเกิด-1 เดือน)',
        'infant': 'Infant (1-12 เดือน)',
        'toddler': 'Toddler (13 เดือน - 3 ปี)',
        'preschool': 'Preschool (4-6 ปี)',
        'schoolage': 'School age (7-12 ปี)',
        'adolescent': 'Adolescent (13-19 ปี)'
    };

    // แปลง CHD Type
    const chdTypeMapping = {
        'acyanotic': 'Acyanotic CHD',
        'cyanotic': 'Cyanotic CHD',
        '': 'ไม่มี CHD'
    };

    // สร้าง Vital Signs รวม
    const vitalSigns = `Temp: ${safeText(record.temperatureValue)} °C | PR: ${safeText(record.prValue)} bpm | RR: ${safeText(record.rrValue)} tpm | BP: ${safeText(record.bloodPressure)} mmHg | SpO₂: ${safeText(record.spo2)}%`;

    // สร้างรายละเอียดคะแนน
    const scoreDetails = `Temp Score: ${safeText(record.temperatureScore)} | Behavior: ${safeText(record.behaviorScore)} | Cardiovascular: ${safeText(record.cardiovascularScore)} | Respiratory: ${safeText(record.respiratoryScore)} | Additional Risk: ${record.additionalRisk ? 'มี' : 'ไม่มี'} | Skin: ${safeText(record.skinColor)} | CRT: ${safeText(record.crt)} | Retraction: ${safeText(record.retraction)} | FiO₂: ${safeText(record.fio2)} | O₂: ${safeText(record.o2)}`;

    // Note การพยาบาล
    let notesToSend = safeText(record.nursingNotes);
    if (record.isReassessment && record.parentRecordId) {
        const parent = state.records.find(r => r.id === record.parentRecordId);
        if (parent) {
            const scoreComparison = `คะแนน: ${parent.totalScore} ➜ ${record.totalScore}`;
            const symptomComparison = `อาการเปลี่ยน: ${parent.symptomsChanged === 'yes' ? 'มี' : 'ไม่มี'} ➜ ${record.symptomsChanged === 'yes' ? 'มี' : 'ไม่มี'}`;
            const comparisonInfo = `[ประเมินซ้ำ] ${scoreComparison} | ${symptomComparison}`;
            if (notesToSend === '-') {
                notesToSend = comparisonInfo;
            } else {
                notesToSend = `${comparisonInfo} | Note: ${notesToSend}`;
            }
        }
    }

    // ส่งข้อมูลไปยัง Google Form ตาม entry IDs ที่ถูกต้อง
    formData.append('entry.548024940', safeText(record.hn)); // HN
    formData.append('entry.1691416727', safeText(record.location)); // สถานที่
    formData.append('entry.1308705625', ageGroupMapping[record.ageGroup] || safeText(record.ageGroup)); // ช่วงอายุ
    formData.append('entry.54134142', safeText(record.temperatureValue)); // Temp (°C)
    formData.append('entry.968429810', safeText(record.totalScore)); // คะแนนรวม PEWS
    formData.append('entry.385871425', vitalSigns); // Vital Signs
    formData.append('entry.381918120', scoreDetails); // รายละเอียดคะแนน
    formData.append('entry.2139857838', chdTypeMapping[record.chdType] || 'ไม่ระบุ'); // CHD
    formData.append('entry.1652284044', record.palsEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'); // PALS
    formData.append('entry.1322870299', notesToSend); // การพยาบาล
    formData.append('entry.565363340', safeText(record.transferDestination)); // ส่งต่อไปที่
    formData.append('entry.396417988', new Date(record.createdAt).toLocaleString('th-TH')); // เวลาบันทึก
    formData.append('entry.913159674', record.isReassessment ? 'ใช่' : 'ไม่ใช่'); // ประเมินซ้ำ

    console.log(`📤 กำลังส่งข้อมูล ID: ${record.id} ไป Google Form...`);
    console.log('📝 ข้อมูลที่ส่ง:', {
        HN: record.hn,
        Location: record.location,
        AgeGroup: ageGroupMapping[record.ageGroup],
        TotalScore: record.totalScore,
        CreatedAt: new Date(record.createdAt).toLocaleString('th-TH')
    });

    submittedRecordIds.add(record.id);

    try {
        await fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
        console.log(`✅ ส่งข้อมูล ID: ${record.id} สำเร็จ`);
    } catch (error) {
        console.error('❌ Error sending to Google Form:', error);
        submittedRecordIds.delete(record.id);
    }
}

async function saveRecord(action) {
    const now = Date.now();
    if (now - lastSaveTime < SAVE_COOLDOWN) return;
    if (isSavingRecord) return;

    if (!state.ageGroup) {
        document.getElementById('age-error').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        alert('กรุณาเลือกช่วงอายุผู้ป่วยก่อนทำการบันทึก');
        return;
    }

    isSavingRecord = true;
    lastSaveTime = now;

    const transferBtn = document.querySelector('.btn-transfer');
    const originalBtnText = transferBtn ? transferBtn.innerHTML : '';

    if (transferBtn) {
        transferBtn.disabled = true;
        transferBtn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite">⏳</span> กำลังส่ง...';
        transferBtn.style.opacity = '0.7';
        transferBtn.style.cursor = 'not-allowed';

        if (!document.getElementById('temp-spin-style')) {
            const style = document.createElement('style');
            style.id = 'temp-spin-style';
            style.innerHTML = '@keyframes spin { 100% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }
    }

    try {
        const temperature = state.temperatureScore || 0;
        const behavior = state.behaviorScore || 0;
        const cardiovascular = state.cardiovascularScore || 0;
        const respiratory = state.respiratoryScore || 0;
        const additional = state.additionalRisk ? 2 : 0;
        const total = temperature + behavior + cardiovascular + respiratory + additional;

        const locationValue = state.location === 'อื่นๆ' ? `อื่นๆ: ${state.locationOther}` : state.location;
        const transferValue = state.transferDestination === 'อื่นๆ' ? `อื่นๆ: ${state.transferDestinationOther}` : state.transferDestination;

        const recordId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const record = {
            id: recordId,
            hn: state.hn.trim() || 'ไม่ระบุ',
            location: locationValue || 'ไม่ระบุ',
            ageGroup: state.ageGroup,
            temperatureValue: state.temperatureValue || 'ไม่ระบุ',
            temperatureScore: temperature,
            behaviorScore: behavior,
            cardiovascularScore: cardiovascular,
            respiratoryScore: respiratory,
            additionalRisk: state.additionalRisk,
            totalScore: total,
            nursingNotes: state.nursingNotes,
            symptomsChanged: state.symptomsChanged,
            action: action,
            transferDestination: transferValue || '',
            prValue: state.prValue || 'ไม่ระบุ',
            rrValue: state.rrValue || 'ไม่ระบุ',
            skinColor: state.skinColor || 'ไม่ระบุ',
            crt: state.crt || 'ไม่ระบุ',
            retraction: state.retraction || 'ไม่ระบุ',
            fio2: state.fio2 || 'ไม่ระบุ',
            o2: state.o2 || 'ไม่ระบุ',
            bloodPressure: state.bloodPressure || 'ไม่ระบุ',
            spo2: state.spo2 || 'ไม่ระบุ',
            chdType: state.chdType || '',
            palsEnabled: state.palsEnabled,
            parentRecordId: state.parentRecordId,
            isReassessment: state.isReassessment,
            createdAt: new Date().toISOString()
        };

        state.records.unshift(record);
        saveRecords();
        renderRecords();

        await submitToGoogleForm(record);

        alert(`บันทึกสำเร็จ\nบันทึกข้อมูลผู้ป่วย HN: ${record.hn} เรียบร้อยแล้ว`);
        resetForm();

    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการบันทึก:', error);
        alert('เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง');
    } finally {
        if (transferBtn) {
            transferBtn.disabled = false;
            transferBtn.innerHTML = originalBtnText;
            transferBtn.style.opacity = '1';
            transferBtn.style.cursor = 'pointer';
        }

        setTimeout(() => {
            isSavingRecord = false;
        }, 1500);
    }
}

function formatDateTime(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function renderRecords() {
    const container = document.getElementById('records-list');
    if (!state.records || state.records.length === 0) {
        container.innerHTML = `
            <div class="empty-records">
                <div class="empty-icon">📋</div>
                <p class="empty-title">ยังไม่มีประวัติการบันทึก</p>
                <p class="empty-description">เมื่อคุณบันทึกข้อมูลผู้ป่วย ประวัติจะแสดงที่นี่</p>
            </div>
        `;
        return;
    }

    container.innerHTML = state.records.map((record) => {
        const ageGroup = ageGroups.find(a => a.id === record.ageGroup);
        const ageText = ageGroup ? `${ageGroup.name} (${ageGroup.ageRange})` : 'ไม่ระบุ';
        const isReassessment = record.isReassessment;
        const parentRecord = isReassessment ? state.records.find(r => r.id === record.parentRecordId) : null;

        let comparisonHTML = '';
        if (isReassessment && parentRecord) {
            comparisonHTML = `
                <div class="comparison-container">
                    <h4>📊 เปรียบเทียบผลการประเมิน</h4>
                    <div class="comparison-grid">
                        <div class="comparison-column">
                            <div class="comparison-header">
                                <span class="comparison-badge">1</span>
                                <div>
                                    <div class="comparison-title">ครั้งที่ 1</div>
                                    <div class="comparison-time">${formatDateTime(parentRecord.createdAt)}</div>
                                </div>
                            </div>
                            <div class="comparison-data">
                                <div class="data-item">
                                    <span class="data-label">คะแนนรวม</span>
                                    <span class="data-value score-value">${parentRecord.totalScore}</span>
                                </div>
                                <div class="data-item">
                                    <span class="data-label">Temp</span>
                                    <span class="data-value">${parentRecord.temperatureValue} °C</span>
                                </div>
                                <div class="data-item">
                                    <span class="data-label">PR</span>
                                    <span class="data-value">${parentRecord.prValue} bpm</span>
                                </div>
                                <div class="data-item">
                                    <span class="data-label">RR</span>
                                    <span class="data-value">${parentRecord.rrValue} tpm</span>
                                </div>
                                <div class="data-item">
                                    <span class="data-label">BP</span>
                                    <span class="data-value">${parentRecord.bloodPressure}</span>
                                </div>
                                <div class="data-item">
                                    <span class="data-label">SpO₂</span>
                                    <span class="data-value">${parentRecord.spo2}%</span>
                                </div>
                            </div>
                        </div>

                        <div class="comparison-arrow">→</div>

                        <div class="comparison-column highlight">
                            <div class="comparison-header">
                                <span class="comparison-badge">2</span>
                                <div>
                                    <div class="comparison-title">ครั้งที่ 2 (ประเมินซ้ำ)</div>
                                    <div class="comparison-time">${formatDateTime(record.createdAt)}</div>
                                </div>
                            </div>
                            <div class="comparison-data">
                                <div class="data-item ${record.totalScore !== parentRecord.totalScore ? 'changed' : ''}">
                                    <span class="data-label">คะแนนรวม</span>
                                    <span class="data-value score-value">${record.totalScore}</span>
                                </div>
                                <div class="data-item ${record.temperatureValue !== parentRecord.temperatureValue ? 'changed' : ''}">
                                    <span class="data-label">Temp</span>
                                    <span class="data-value">${record.temperatureValue} °C</span>
                                </div>
                                <div class="data-item ${record.prValue !== parentRecord.prValue ? 'changed' : ''}">
                                    <span class="data-label">PR</span>
                                    <span class="data-value">${record.prValue} bpm</span>
                                </div>
                                <div class="data-item ${record.rrValue !== parentRecord.rrValue ? 'changed' : ''}">
                                    <span class="data-label">RR</span>
                                    <span class="data-value">${record.rrValue} tpm</span>
                                </div>
                                <div class="data-item ${record.bloodPressure !== parentRecord.bloodPressure ? 'changed' : ''}">
                                    <span class="data-label">BP</span>
                                    <span class="data-value">${record.bloodPressure}</span>
                                </div>
                                <div class="data-item ${record.spo2 !== parentRecord.spo2 ? 'changed' : ''}">
                                    <span class="data-label">SpO₂</span>
                                    <span class="data-value">${record.spo2}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        const riskLevel = getRiskLevel(record.totalScore);
        const scoreColorClass = riskLevel === 'low' ? 'score-green' :
                                riskLevel === 'medium' ? 'score-yellow' :
                                riskLevel === 'orange' ? 'score-orange' : 'score-red';

        return `
            <div class="record-card">
                <div class="record-header">
                    <div>
                        <strong>HN:</strong> ${record.hn}
                        ${isReassessment ? '<span class="reassessment-badge">ประเมินซ้ำ</span>' : ''}
                    </div>
                    <div class="record-date">${formatDateTime(record.createdAt)}</div>
                </div>

                <div class="record-details">
                    <div class="detail-row">
                        <span class="detail-label">สถานที่:</span>
                        <span>${record.location}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">ช่วงอายุ:</span>
                        <span>${ageText}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">คะแนนรวม:</span>
                        <span class="total-score-badge ${scoreColorClass}">${record.totalScore}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">การดำเนินการ:</span>
                        <span class="action-badge">${record.action}</span>
                    </div>
                    ${record.nursingNotes ? `
                    <div class="detail-row">
                        <span class="detail-label">การพยาบาล:</span>
                        <span>${record.nursingNotes}</span>
                    </div>
                    ` : ''}
                    ${record.transferDestination ? `
                    <div class="detail-row">
                        <span class="detail-label">ส่งต่อไปที่:</span>
                        <span class="transfer-badge">${record.transferDestination}</span>
                    </div>
                    ` : ''}
                    ${record.chdType ? `
                    <div class="detail-row">
                        <span class="detail-label">CHD:</span>
                        <span class="chd-badge">${record.chdType === 'acyanotic' ? '○ Acyanotic CHD' : '● Cyanotic CHD'}</span>
                    </div>
                    ` : ''}
                    ${record.palsEnabled ? `
                    <div class="detail-row">
                        <span class="detail-label">PALS:</span>
                        <span class="pals-badge">PALS</span>
                    </div>
                    ` : ''}
                </div>

                <div class="vital-signs-summary">
                    <h4>📊 สัญญาณชีพที่ประเมิน</h4>
                    <div class="vital-signs-summary-grid">
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">Temp:</span>
                            <span class="vital-summary-value">${record.temperatureValue} °C</span>
                        </div>
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">PR:</span>
                            <span class="vital-summary-value">${record.prValue} bpm</span>
                        </div>
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">RR:</span>
                            <span class="vital-summary-value">${record.rrValue} tpm</span>
                        </div>
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">BP:</span>
                            <span class="vital-summary-value">${record.bloodPressure} mmHg</span>
                        </div>
                        <div class="vital-summary-item">
                            <span class="vital-summary-label">SpO₂:</span>
                            <span class="vital-summary-value">${record.spo2}%</span>
                        </div>
                    </div>
                </div>

                ${comparisonHTML}

                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                    ${!isReassessment ? `
                        <button class="reassess-btn" onclick="startReassessment('${record.id}')">
                            🔄 ประเมินซ้ำ
                        </button>
                    ` : ''}
                    <button class="delete-btn" onclick="deleteRecord('${record.id}')">
                        🗑️ ลบ
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function startReassessment(recordId) {
    const record = state.records.find(r => r.id === recordId);
    if (!record) {
        alert('ไม่พบข้อมูลการบันทึก');
        return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    state.parentRecordId = recordId;
    state.isReassessment = true;
    state.hn = record.hn;
    state.location = record.location;
    state.ageGroup = record.ageGroup;

    document.getElementById('hn-input-top').value = record.hn;
    document.getElementById('location-select').value = record.location.includes('อื่นๆ') ? 'อื่นๆ' : record.location;

    selectAge(record.ageGroup);

    const formTitle = document.querySelector('h1');
    if (formTitle && !formTitle.innerHTML.includes('ประเมินซ้ำ')) {
        formTitle.innerHTML = formTitle.innerHTML + ' <span style="background: #fbbf24; color: white; padding: 0.25rem 0.75rem; border-radius: 0.5rem; margin-left: 0.5rem; font-size: 1rem;">กำลังประเมินซ้ำ</span>';
    }

    alert(`กำลังประเมินซ้ำสำหรับ HN: ${record.hn}\nกรุณากรอกข้อมูลใหม่และบันทึก`);
}

function resetForm() {
    state.ageGroup = null;
    state.temperatureValue = '';
    state.temperatureScore = null;
    state.behaviorScore = null;
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
    state.skinColor = '';
    state.crt = '';
    state.retraction = '';
    state.fio2 = '';
    state.o2 = '';
    state.bloodPressure = '';
    state.spo2 = '';
    state.chdType = '';
    state.palsEnabled = false;
    state.parentRecordId = null;
    state.isReassessment = false;

    document.getElementById('hn-input-top').value = '';
    document.getElementById('location-select').value = '';
    document.getElementById('location-other').value = '';
    document.getElementById('location-other').style.display = 'none';
    document.getElementById('nursing-notes').value = '';
    document.getElementById('transfer-destination-select').value = '';
    document.getElementById('transfer-destination-other').value = '';
    document.getElementById('transfer-destination-other').style.display = 'none';
    document.getElementById('additional-risk').checked = false;
    document.getElementById('age-error').style.display = 'none';

    const formTitle = document.querySelector('h1');
    if (formTitle) {
        formTitle.innerHTML = formTitle.innerHTML.replace(/<span style="background: #fbbf24.*?<\/span>/, '');
    }

    const tempInput = document.getElementById('temp-input');
    const prInput = document.getElementById('pr-input');
    const rrInput = document.getElementById('rr-input');
    const spo2Input = document.getElementById('spo2-input');
    const bpInput = document.getElementById('bp-input');

    if (tempInput) tempInput.value = '';
    if (prInput) prInput.value = '';
    if (rrInput) rrInput.value = '';
    if (spo2Input) spo2Input.value = '';
    if (bpInput) bpInput.value = '';

    document.getElementById('chd-selected').style.display = 'none';

    const palsBtn = document.getElementById('pals-button');
    if (palsBtn) {
        palsBtn.classList.remove('active');
    }

    document.getElementById('temp-input-container').style.display = 'none';
    document.getElementById('cardiovascular-input-container').style.display = 'none';
    document.getElementById('respiratory-input-container').style.display = 'none';
    document.getElementById('temperature-warning').style.display = 'block';
    document.getElementById('cardiovascular-warning').style.display = 'block';
    document.getElementById('respiratory-warning').style.display = 'block';

    const cardioHeader = document.querySelector('#cardiovascular-section .section-header h2');
    if (cardioHeader) {
        cardioHeader.innerHTML = 'ระบบไหลเวียนโลหิต (Cardiovascular)';
    }

    const respHeader = document.querySelector('#respiratory-section .section-header h2');
    if (respHeader) {
        respHeader.innerHTML = 'ระบบทางเดินหายใจ (Respiratory)';
    }

    document.querySelectorAll('.symptom-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.value === 'no');
    });

    document.querySelectorAll('.age-button').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.score-button').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.score-display-item').forEach(item => item.classList.remove('selected'));

    updateTotalScore();
}

function deleteRecord(id) {
    if (confirm('ต้องการลบรายการนี้หรือไม่?')) {
        state.records = state.records.filter(r => r.id !== id);
        saveRecords();
        renderRecords();
        alert('ลบสำเร็จ');
    }
}

function loadRecords() {
    const saved = localStorage.getItem('pewsRecords');
    if (saved) {
        try {
            state.records = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading records:', e);
        }
    }
}

function saveRecords() {
    localStorage.setItem('pewsRecords', JSON.stringify(state.records));
}
