/*
Enhancements for Modified SUANDOK PEWS
- Updated temperature scoring rules
- Updated behavior label for 0 score
- Adjusted Newborn PR & RR criteria and CRT handling
- Added Term / Preterm buttons (toggle) which affect SpO2 threshold
- Override resetForm to clear Term/Preterm selection
This file should be loaded after the original script.js
*/
(function() {
    // Ensure original state exists
    if (!window.state) window.state = {};

    // Add termStatus to state (term | preterm | '')
    window.state.termStatus = window.state.termStatus || '';

    // 1) Update behavior label (0 score) if behavior grid already rendered
    function updateBehaviorZeroLabel() {
        try {
            const behaviorGrid = document.getElementById('behavior-grid');
            if (!behaviorGrid) return;
            const btn = behaviorGrid.querySelector('.score-button');
            if (!btn) return;
            const labelEl = btn.querySelector('.score-label');
            if (labelEl) labelEl.innerText = 'Alert, Reactive to Stimuli';
        } catch (e) {
            console.warn('updateBehaviorZeroLabel error', e);
        }
    }

    // 2) Create Term / Preterm buttons next to the additional-risk checkbox
    function createTermPretermButtons() {
        try {
            const checkbox = document.getElementById('additional-risk');
            if (!checkbox) return;
            // Find the label wrapper (.checkbox-label)
            const wrapper = checkbox.closest('.checkbox-label') || checkbox.parentElement;

            // Create container
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.gap = '0.5rem';
            container.style.marginLeft = '1rem';
            container.style.alignItems = 'center';
            container.style.marginTop = '0.5rem';

            // Buttons (styled using existing .option-btn)
            const termBtn = document.createElement('button');
            termBtn.type = 'button';
            termBtn.id = 'term-btn';
            termBtn.className = 'option-btn';
            termBtn.innerText = 'Term';

            const pretermBtn = document.createElement('button');
            pretermBtn.type = 'button';
            pretermBtn.id = 'preterm-btn';
            pretermBtn.className = 'option-btn';
            pretermBtn.innerText = 'Preterm';

            container.appendChild(termBtn);
            container.appendChild(pretermBtn);
            // Append to wrapper (after checkbox label)
            wrapper.appendChild(container);

            // Event handlers
            termBtn.addEventListener('click', function() {
                if (window.state.termStatus === 'term') {
                    // toggle off
                    window.state.termStatus = '';
                    termBtn.classList.remove('selected');
                } else {
                    window.state.termStatus = 'term';
                    termBtn.classList.add('selected');
                    pretermBtn.classList.remove('selected');
                }
                // Recompute respiratory scoring when this changes
                if (typeof calculateRespiratoryScore === 'function') calculateRespiratoryScore();
                if (typeof updateTotalScore === 'function') updateTotalScore();
            });

            pretermBtn.addEventListener('click', function() {
                if (window.state.termStatus === 'preterm') {
                    window.state.termStatus = '';
                    pretermBtn.classList.remove('selected');
                } else {
                    window.state.termStatus = 'preterm';
                    pretermBtn.classList.add('selected');
                    termBtn.classList.remove('selected');
                }
                if (typeof calculateRespiratoryScore === 'function') calculateRespiratoryScore();
                if (typeof updateTotalScore === 'function') updateTotalScore();
            });

            // If state already had a selection, reflect it
            if (window.state.termStatus === 'term') termBtn.classList.add('selected');
            if (window.state.termStatus === 'preterm') pretermBtn.classList.add('selected');

        } catch (e) {
            console.warn('createTermPretermButtons error', e);
        }
    }

    // 3) Override temperature scoring per new rules:
    // - temp < 36.0 => 1 point
    // - 36.5 - 37.5 => 0 points
    // - 37.6 - 38.9 => 1 point
    // - >= 39.0 => 2 points
    // Note: values not covered fall back to 0
    window.calculateTemperatureScore = function() {
        const temp = parseFloat(window.state.temperatureValue);
        let score = 0;
        if (!isNaN(temp)) {
            if (temp < 36.0) {
                score = 1;
            } else if (temp >= 39.0) {
                score = 2;
            } else if (temp >= 37.6 && temp <= 38.9) {
                score = 1;
            } else if (temp >= 36.5 && temp <= 37.5) {
                score = 0;
            } else {
                // temperatures like 36.0 - 36.4 or 37.5 - 37.6 default to 0
                score = 0;
            }
        }
        window.state.details = window.state.details || {};
        window.state.details.temp = `
            <p><strong>ค่าที่ระบุ:</strong> ${window.state.temperatureValue || '-'} °C</p>
            <hr style="margin:0.5rem 0;">
            <p><strong>เกณฑ์การให้คะแนนอุณหภูมิ (ปรับปรุง):</strong></p>
            <ul style="list-style:none; padding:0;">
                <li class="${getDetailClass(score, 1)}">1 คะแนน: < 36.0 °C</li>
                <li class="${getDetailClass(score, 0)}">0 คะแนน: 36.5 - 37.5 °C</li>
                <li class="${getDetailClass(score, 1)}">1 คะแนน: 37.6 - 38.9 °C</li>
                <li class="${getDetailClass(score, 2)}">2 คะแนน: ≥ 39.0 °C</li>
            </ul>
            <p style="margin-top:0.5rem; font-size:1.2rem; font-weight:bold;">คะแนนที่ได้: ${score}</p>
        `;
        window.state.temperatureScore = score;
        const el = document.getElementById('temp-score-val');
        if (el) el.innerText = score;
        if (typeof updateTotalScore === 'function') updateTotalScore();
    };

    // 4) Override cardiovascular scoring for Newborn PR and CRT adjustments
    // - Newborn PR 120 - 160 => 0 คะแนน
    // - CRT <=2 => 0 คะแนน (handled via '1-2' option)
    window.calculateCardiovascularScore = function() {
        if (!window.state.ageGroup) return;
        const pr = parseInt(window.state.prValue);
        const skinColor = window.state.skinColor;
        const crt = window.state.crt;
        let prScore = 0, skinCrtScore = 0;

        const id = window.state.ageGroup;
        let criteria = { s0: '', s1: '', s2: '', s3: '' };

        // Define skin/CRT criteria text (used in details)
        const skinCrtCriteria = {
            s0: 'ผิวสีชมพูดี, CRT ≤ 2 วินาที',
            s1: 'ผิวสีซีด, CRT 3 วินาที',
            s2: 'ผิวสีเทา, CRT ≥ 4 วินาที',
            s3: 'ตัวลาย'
        };

        if (id === 'newborn') {
            // New newborn ranges: 120-160 => 0
            if (!isNaN(pr)) {
                if (pr >= 120 && pr <= 160) prScore = 0;
                else if (pr >= 161 && pr <= 169) prScore = 1;
                else if (pr >= 170 && pr <= 179) prScore = 2;
                else if (pr >= 180 || pr <= 119) prScore = 3;
            }
            criteria = { s0: 'PR 120-160', s1: 'PR 161-169', s2: 'PR 170-179', s3: 'PR ≥ 180 หรือ ≤ 119' };
        } else if (id === 'infant') {
            if (pr <= 140) prScore = 0;
            else if (pr >= 141 && pr <= 149) prScore = 1;
            else if (pr >= 150 && pr <= 159) prScore = 2;
            else if (pr >= 160 || pr <= 79) prScore = 3;
            criteria = { s0:'PR ≤ 140', s1:'PR 141-149', s2:'PR 150-159', s3:'PR ≥ 160 หรือ ≤ 79' };
        } else if (id === 'toddler') {
            if (pr <= 130) prScore = 0;
            else if (pr >= 131 && pr <= 139) prScore = 1;
            else if (pr >= 140 && pr <= 149) prScore = 2;
            else if (pr >= 150 || pr <= 69) prScore = 3;
            criteria = { s0:'PR ≤ 130', s1:'PR 131-139', s2:'PR 140-149', s3:'PR ≥ 150 หรือ ≤ 69' };
        } else if (id === 'preschool') {
            if (pr <= 120) prScore = 0;
            else if (pr >= 121 && pr <= 129) prScore = 1;
            else if (pr >= 130 && pr <= 139) prScore = 2;
            else if (pr >= 140 || pr <= 69) prScore = 3;
            criteria = { s0:'PR ≤ 120', s1:'PR 121-129', s2:'PR 130-139', s3:'PR ≥ 140 หรือ ≤ 69' };
        } else if (id === 'schoolage') {
            if (pr <= 110) prScore = 0;
            else if (pr >= 111 && pr <= 119) prScore = 1;
            else if (pr >= 120 && pr <= 129) prScore = 2;
            else if (pr >= 130 || pr <= 69) prScore = 3;
            criteria = { s0:'PR ≤ 110', s1:'PR 111-119', s2:'PR 120-129', s3:'PR ≥ 130 หรือ ≤ 69' };
        } else if (id === 'adolescent') {
            if (pr <= 100) prScore = 0;
            else if (pr >= 111 && pr <= 119) prScore = 1;
            else if (pr >= 120 && pr <= 129) prScore = 2;
            else if (pr >= 130 || pr <= 59) prScore = 3;
            criteria = { s0:'PR ≤ 100', s1:'PR 111-119', s2:'PR 120-129', s3:'PR ≥ 130 หรือ ≤ 59' };
        }

        // Skin color + CRT scoring
        if (skinColor === 'pink' && crt === '1-2') { skinCrtScore = 0; }
        else if (skinColor === 'pale' || crt === '3') { skinCrtScore = 1; }
        else if (skinColor === 'gray' || crt === '4+') { skinCrtScore = 2; }
        else if (skinColor === 'mottled') { skinCrtScore = 3; }

        // Ensure minimums based on selection
        if (skinColor === 'pink') skinCrtScore = Math.max(skinCrtScore, 0);
        if (skinColor === 'pale') skinCrtScore = Math.max(skinCrtScore, 1);
        if (skinColor === 'gray') skinCrtScore = Math.max(skinCrtScore, 2);
        if (skinColor === 'mottled') skinCrtScore = Math.max(skinCrtScore, 3);

        if (crt === '1-2') skinCrtScore = Math.max(skinCrtScore, 0);
        if (crt === '3') skinCrtScore = Math.max(skinCrtScore, 1);
        if (crt === '4+') skinCrtScore = Math.max(skinCrtScore, 2);

        const finalScore = Math.max(prScore, skinCrtScore);
        window.state.cardiovascularScore = finalScore;
        const el = document.getElementById('cardio-score-val');
        if (el) el.innerText = finalScore;

        window.state.details = window.state.details || {};
        const ageRangeText = (window.ageGroups && window.state.ageGroup) ? (window.ageGroups.find(g=>g.id===window.state.ageGroup).ageRange) : '';
        window.state.details.cardio = `
            <p><strong>ข้อมูลที่ระบุ:</strong> PR: ${pr||'-'}, Skin: ${skinColor||'-'}, CRT: ${crt||'-'}</p>
            <hr style="margin:0.5rem 0;">
            <p><strong>เกณฑ์การประเมินคะแนน (${ageRangeText}):</strong></p>
            <ul style="list-style:none; padding:0;">
                <li class="${getDetailClass(finalScore, 0)}">0 คะแนน: PR: ${criteria.s0} / ${skinCrtCriteria.s0}</li>
                <li class="${getDetailClass(finalScore, 1)}">1 คะแนน: PR: ${criteria.s1} / ${skinCrtCriteria.s1}</li>
                <li class="${getDetailClass(finalScore, 2)}">2 คะแนน: PR: ${criteria.s2} / ${skinCrtCriteria.s2}</li>
                <li class="${getDetailClass(finalScore, 3)}">3 คะแนน: PR: ${criteria.s3} / ${skinCrtCriteria.s3}</li>
            </ul>
            <p style="margin-top:0.5rem; font-size:1.2rem; font-weight:bold;">คะแนนที่ได้: ${finalScore}</p>
        `;
        if (typeof updateTotalScore === 'function') updateTotalScore();
    };

    // 5) Override respiratory scoring for Newborn RR and add Term/Preterm SpO2 thresholds
    window.calculateRespiratoryScore = function() {
        if (!window.state.ageGroup) return;
        const rr = parseInt(window.state.rrValue);
        const spo2 = parseFloat(window.state.spo2);
        let rrScore = 0, oxygenScore = 0, spo2Score = 0;

        const id = window.state.ageGroup;
        let criteria = { s0:'', s1:'', s2:'', s3:'' };

        if (id === 'newborn' || id === 'infant') {
            // Newborn RR normal changed: 30 - 60 tpm => 0 (user requested)
            if (id === 'newborn') {
                if (rr >= 30 && rr <= 60) rrScore = 0;
                else if (rr >= 61 && rr <= 69) rrScore = 1;
                else if (rr >= 70 && rr <= 79) rrScore = 2;
                else if (rr <= 20 || rr >= 80) rrScore = 3;
                criteria = { s0:'RR 30-60 tpm', s1:'RR 61-69 tpm', s2:'RR 70-79 tpm', s3:'RR ≤ 20 หรือ ≥ 80 tpm' };
            } else {
                // infant uses previous ranges (kept as before)
                if (rr >= 35 && rr <= 50) rrScore = 0;
                else if (rr >= 51 && rr <= 59) rrScore = 1;
                else if (rr >= 60 && rr <= 69) rrScore = 2;
                else if (rr <= 20 || rr >= 70) rrScore = 3;
                criteria = { s0:'RR 35-50 tpm', s1:'RR 51-59 tpm', s2:'RR 60-69 tpm', s3:'RR ≤ 20 หรือ ≥ 70 tpm' };
            }
        } else if (id === 'toddler') {
            if (rr >= 25 && rr <= 40) rrScore = 0;
            else if (rr >= 41 && rr <= 49) rrScore = 1;
            else if (rr >= 50 && rr <= 59) rrScore = 2;
            else if (rr <= 20 || rr >= 60) rrScore = 3;
            criteria = { s0:'RR 25-40 tpm', s1:'RR 41-49 tpm', s2:'RR 50-59 tpm', s3:'RR ≤ 20 หรือ ≥ 60 tpm' };
        } else if (['preschool', 'schoolage', 'adolescent'].includes(id)) {
            if (rr >= 20 && rr <= 30) rrScore = 0;
            else if (rr >= 31 && rr <= 39) rrScore = 1;
            else if (rr >= 40 && rr <= 49) rrScore = 2;
            else if (rr <= 16 || rr >= 50) rrScore = 3;
            criteria = { s0:'RR 20-30 tpm', s1:'RR 31-39 tpm', s2:'RR 40-49 tpm', s3:'RR ≤ 16 หรือ ≥ 50 tpm' };
        }

        if (window.state.retraction === 'yes' && rrScore < 3) rrScore = Math.max(rrScore, 1);
        if (window.state.fio2 === '30' || window.state.o2 === '4') oxygenScore = Math.max(oxygenScore, 1);
        if (window.state.fio2 === '40' || window.state.o2 === '6') oxygenScore = Math.max(oxygenScore, 2);
        if (window.state.fio2 === '50' || window.state.o2 === '8') oxygenScore = Math.max(oxygenScore, 3);

        // SpO2 scoring: consider CHD & Term/Preterm thresholds
        if (!isNaN(spo2)) {
            if (window.state.chdType === 'cyanotic') {
                if (spo2 < 75) {
                    spo2Score = 3;
                } else {
                    spo2Score = 0;
                }
            } else {
                // Use term/preterm thresholds
                const threshold = (window.state.termStatus === 'preterm') ? 90 : 95;
                if (spo2 < threshold) spo2Score = 3;
                else spo2Score = 0;
            }
        }

        const finalScore = Math.max(rrScore, oxygenScore, spo2Score);
        window.state.respiratoryScore = finalScore;
        const el = document.getElementById('resp-score-val');
        if (el) el.innerText = finalScore;

        const isCyanoticSevere = (window.state.chdType === 'cyanotic' && !isNaN(spo2) && spo2 < 75);
        let spo2CriteriaText = window.state.chdType === 'cyanotic' ? 'SpO₂ < 75%' : `SpO₂ < ${(window.state.termStatus === 'preterm')?90:95}%`;
        const cyanoticNote = isCyanoticSevere ? ' <span style="color:#d97706; font-weight:bold;">(Cyanotic CHD + SpO₂ < 75%)</span>' : '';

        window.state.details = window.state.details || {};
        window.state.details.resp = `
            <p><strong>ข้อมูลที่ระบุ:</strong> RR: ${rr||'-'}, SpO2: ${spo2||'-'}%, CHD: ${window.state.chdType||'ไม่มี'}, Term/Preterm: ${window.state.termStatus || '-'}</p>
            <hr style="margin:0.5rem 0;">
            <p><strong>เกณฑ์คะแนนระบบหายใจ (ปรับปรุง):</strong></p>
            <ul style="list-style:none; padding:0;">
                <li class="${getDetailClass(finalScore, 0)}">0 คะแนน: ${criteria.s0}, Room air</li>
                <li class="${getDetailClass(finalScore, 1)}">1 คะแนน: ${criteria.s1} หรือ มี Retraction หรือ FiO₂ ≥ 30% หรือ O₂ ≥ 4 LPM</li>
                <li class="${getDetailClass(finalScore, 2)}">2 คะแนน: ${criteria.s2} หรือ FiO₂ ≥ 40% หรือ O₂ ≥ 6 LPM</li>
                <li class="${getDetailClass(finalScore, 3)}">3 คะแนน: ${criteria.s3} หรือ FiO₂ ≥ 50% หรือ O₂ ≥ 8 LPM หรือ ${spo2CriteriaText}${cyanoticNote}</li>
            </ul>
            <p style="margin-top:0.5rem; font-size:1.2rem; font-weight:bold;">คะแนนที่ได้: ${finalScore}</p>
        `;
        if (typeof updateTotalScore === 'function') updateTotalScore();
    };

    // 6) Override resetForm to clear term/preterm selection (wrap original)
    if (typeof window.resetForm === 'function') {
        const originalReset = window.resetForm;
        window.resetForm = function() {
            originalReset();
            window.state.termStatus = '';
            const termBtn = document.getElementById('term-btn');
            const pretermBtn = document.getElementById('preterm-btn');
            if (termBtn) termBtn.classList.remove('selected');
            if (pretermBtn) pretermBtn.classList.remove('selected');
            // Ensure nursing notes / UI updated
            if (typeof updateTotalScore === 'function') updateTotalScore();
        };
    }

    // 7) After DOM ready, create buttons and update labels; attempt to re-run calculations so UI updates
    document.addEventListener('DOMContentLoaded', function() {
        updateBehaviorZeroLabel();
        createTermPretermButtons();
        // Recompute scores with new logic
        try {
            if (typeof calculateTemperatureScore === 'function') calculateTemperatureScore();
            if (typeof calculateCardiovascularScore === 'function') calculateCardiovascularScore();
            if (typeof calculateRespiratoryScore === 'function') calculateRespiratoryScore();
            if (typeof updateTotalScore === 'function') updateTotalScore();
        } catch (e) {
            console.warn('Error running recalculations:', e);
        }
    });

})();
