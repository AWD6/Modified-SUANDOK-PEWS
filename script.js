
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Sarabun', 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg, #eff6ff 0%, #f9fafb 50%, #fef3c7 100%);
    min-height: 100vh;
    padding: 2rem 1rem;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
}

/* Header */
.header {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    padding: 2.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
    border-top: 4px solid #3b82f6;
}

.header h1 {
    font-size: 2.5rem;
    font-weight: bold;
    color: #1e3a8a;
    margin-bottom: 0.5rem;
}

.header p {
    color: #2563eb;
    font-weight: 500;
    font-size: 1.25rem;
}

/* Main Card */
.main-card {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    padding: 2.5rem;
}

/* Form Section */
.form-section {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid #e5e7eb;
}

.form-section label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
}

.form-section input,
.form-section textarea,
.form-section select {
    width: 100%;
    font-size: 1rem;
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.875rem;
    transition: all 0.2s;
}

.form-section input:focus,
.form-section textarea:focus,
.form-section select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-section textarea {
    resize: vertical;
}

/* Scoring Section */
.scoring-section {
    margin-bottom: 2.5rem;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.section-header h2 {
    font-size: 1.375rem;
    font-weight: bold;
    color: #1f2937;
}

.required {
    color: #ef4444;
}

.badge {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 0.875rem;
    flex-shrink: 0;
}

.badge-purple {
    background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
}

.badge-blue {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.badge-red {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.badge-purple-2 {
    background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
}

.badge-orange {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

/* Error & Warning Messages */
.error-message {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: #fee2e2;
    border: 2px solid #fca5a5;
    border-radius: 0.5rem;
    color: #991b1b;
    font-size: 0.875rem;
    font-weight: 600;
}

.warning-message {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: #f5f3ff;
    border: 2px solid #c4b5fd;
    border-radius: 0.5rem;
    color: #6b7280;
    font-size: 0.875rem;
    font-weight: 500;
}

/* Age Grid */
.age-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.age-button {
    min-height: 80px;
    border-radius: 0.75rem;
    border: 2px solid #e5e7eb;
    background: white;
    padding: 1.25rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
}

.age-button:hover {
    border-color: #a855f7;
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);
    transform: translateY(-2px);
}

.age-button.selected {
    border-color: #a855f7;
    background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}

.age-button.selected::after {
    content: '✓';
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
    animation: checkmarkBounce 0.5s ease-out;
}

@keyframes checkmarkBounce {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.age-name {
    font-weight: bold;
    font-size: 0.95rem;
    color: #1f2937;
    margin-bottom: 0.25rem;
}

.age-range {
    font-size: 0.8rem;
    color: #6b7280;
}

/* Score Grid for Behavior */
.score-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
}

.score-button {
    min-height: 120px;
    border-radius: 0.75rem;
    border: 2px solid #e5e7eb;
    background: white;
    padding: 1.25rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
}

.score-button:hover {
    border-color: #3b82f6;
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
    transform: translateY(-4px);
}

.score-button.selected {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.score-button.selected::after {
    content: '✓';
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 24px;
    height: 24px;
    color: #3b82f6;
    font-size: 1.25rem;
    font-weight: bold;
    animation: checkmarkPop 0.3s ease-out;
}

@keyframes checkmarkPop {
    0% {
        transform: scale(0) rotate(-45deg);
        opacity: 0;
    }
    50% {
        transform: scale(1.3) rotate(5deg);
    }
    100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}

.score-label {
    font-weight: 600;
    font-size: 0.95rem;
    color: #1f2937;
    margin-bottom: 0.75rem;
    padding-right: 1.5rem;
}

.score-value {
    font-size: 1.75rem;
    font-weight: bold;
    color: #2563eb;
}

/* Input Section Styling */
.input-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* Cardio Inputs Grid - สำหรับ Cardiovascular และ Respiratory */
.cardio-inputs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25rem;
    margin-bottom: 1.5rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-group label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
}

.input-with-unit {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.input-group input[type="number"],
.input-group input[type="text"] {
    flex: 1;
    font-size: 1rem;
    font-weight: 600;
    border: 2px solid #3b82f6;
    border-radius: 0.5rem;
    padding: 0.75rem;
    text-align: center;
    transition: all 0.2s;
}

.input-group input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
    transform: scale(1.02);
}

.unit-text {
    font-size: 0.875rem;
    color: #475569;
    font-weight: 500;
    white-space: nowrap;
}

/* Option Buttons Compact */
.option-buttons-compact {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.option-btn-compact {
    flex: 1;
    min-width: 60px;
    padding: 0.625rem 1rem;
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    background: white;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    text-align: center;
}

.option-btn-compact:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    transform: translateY(-1px);
}

.option-btn-compact.selected {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

/* Score Selection Row */
.score-selection-row {
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 2px solid #cbd5e1;
    border-radius: 0.75rem;
}

.score-selection-row > label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 1rem;
}

.score-buttons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.75rem;
}

.score-select-btn {
    min-height: 90px;
    border-radius: 0.75rem;
    border: 2px solid #e5e7eb;
    background: white;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.score-select-btn:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.score-select-btn.selected {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.score-select-btn.selected::after {
    content: '✓';
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    color: #3b82f6;
    font-size: 1.25rem;
    font-weight: bold;
}

.score-select-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #475569;
    text-align: center;
    line-height: 1.3;
}

.score-select-btn.selected .score-select-label {
    color: #1e40af;
    font-weight: 600;
}

.score-select-value {
    font-size: 1.75rem;
    font-weight: bold;
    color: #2563eb;
}

/* Checkbox */
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.25rem;
    background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
    border: 2px solid #fdba74;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    flex-wrap: wrap;
}

.checkbox-label:hover {
    background: #fef3c7;
    border-color: #fb923c;
}

.checkbox-label input[type="checkbox"] {
    width: 24px;
    height: 24px;
    cursor: pointer;
    flex-shrink: 0;
}

.score-badge {
    font-size: 1.5rem;
    font-weight: bold;
    color: #f97316;
}

/* Total Score - Minimal Elegant Design */
.total-score {
    padding: 2.5rem;
    border-radius: 1rem;
    border: 2px solid;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
}

.total-score.low {
    background: linear-gradient(135deg, rgba(220, 252, 231, 0.95) 0%, rgba(187, 247, 208, 0.95) 100%);
    border-color: #86efac;
    color: #14532d;
}

.total-score.medium {
    background: linear-gradient(135deg, rgba(254, 249, 195, 0.95) 0%, rgba(254, 240, 138, 0.95) 100%);
    border-color: #fde047;
    color: #713f12;
}

.total-score.orange {
    background: linear-gradient(135deg, rgba(254, 215, 170, 0.95) 0%, rgba(253, 186, 116, 0.95) 100%);
    border-color: #fb923c;
    color: #7c2d12;
}

.total-score.high {
    background: linear-gradient(135deg, rgba(254, 226, 226, 0.95) 0%, rgba(254, 202, 202, 0.95) 100%);
    border-color: #fca5a5;
    color: #7f1d1d;
}

.total-score-wrapper {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.total-score-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.total-score-content {
    width: 100%;
}

.total-score-label {
    font-size: 0.75rem;
    font-weight: 600;
    opacity: 0.7;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
}

.total-score-number {
    font-size: 5rem;
    font-weight: 300;
    line-height: 1;
    letter-spacing: -0.02em;
}

.total-score-breakdown {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 0.75rem;
    margin-bottom: 2rem;
    width: 100%;
}

.breakdown-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0.5rem;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.2s;
}

.breakdown-item:hover {
    background: rgba(255, 255, 255, 0.6);
    transform: translateY(-2px);
}

.breakdown-item.additional {
    grid-column: span 2;
}

.breakdown-label {
    font-size: 0.7rem;
    font-weight: 500;
    opacity: 0.6;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.breakdown-value {
    font-size: 1.5rem;
    font-weight: 300;
    letter-spacing: -0.01em;
}

.total-score-recommendation {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
}

.recommendation-text {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
    text-align: center;
}

/* Transfer Section */
.transfer-section {
    margin-bottom: 2rem;
    padding: 2rem;
    background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fed7aa 100%);
    border: 3px solid #fb923c;
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(251, 146, 60, 0.2),
                0 4px 10px rgba(251, 146, 60, 0.1),
                inset 0 -2px 10px rgba(255, 255, 255, 0.5);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.transfer-section::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 70%);
    animation: pulse 3s ease-in-out infinite;
    pointer-events: none;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 0.5;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
}

.transfer-section:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(251, 146, 60, 0.3),
                0 6px 15px rgba(251, 146, 60, 0.15),
                inset 0 -2px 10px rgba(255, 255, 255, 0.6);
}

.transfer-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 1;
    flex-wrap: wrap;
}

.transfer-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4),
                inset 0 2px 4px rgba(255, 255, 255, 0.3);
    animation: iconBounce 2s ease-in-out infinite;
    flex-shrink: 0;
}

@keyframes iconBounce {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-5px) rotate(5deg);
    }
}

.transfer-header h4 {
    font-size: 1.25rem;
    font-weight: bold;
    color: #7c2d12;
    margin: 0;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.transfer-header p {
    font-size: 0.875rem;
    color: #9a3412;
    margin: 0.25rem 0 0 0;
}

.transfer-select {
    width: 100%;
    font-size: 1.125rem;
    font-weight: 600;
    border: 3px solid #fb923c;
    border-radius: 0.75rem;
    padding: 1.25rem;
    background: white;
    color: #7c2d12;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    box-shadow: 0 4px 10px rgba(251, 146, 60, 0.2),
                inset 0 2px 4px rgba(255, 255, 255, 0.5);
}

.transfer-select:hover {
    border-color: #f97316;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(251, 146, 60, 0.3),
                inset 0 2px 4px rgba(255, 255, 255, 0.6);
}

.transfer-select:focus {
    outline: none;
    border-color: #ea580c;
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.2),
                0 6px 15px rgba(251, 146, 60, 0.3);
    transform: translateY(-2px) scale(1.01);
}

.transfer-other-input {
    width: 100%;
    font-size: 1rem;
    font-weight: 600;
    border: 3px solid #fb923c;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-top: 1rem;
    background: white;
    color: #7c2d12;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(251, 146, 60, 0.2),
                inset 0 2px 4px rgba(255, 255, 255, 0.5);
    animation: slideDown 0.3s ease-out;
    position: relative;
    z-index: 10;
}

.transfer-other-input:focus {
    outline: none;
    border-color: #ea580c;
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.2),
                0 6px 15px rgba(251, 146, 60, 0.3);
    transform: scale(1.01);
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Patient Form */
.patient-form h3 {
    font-size: 1.25rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.symptoms-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.symptom-btn {
    flex: 1;
    min-width: 100px;
    padding: 1.25rem;
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    background: white;
    font-weight: 600;
    font-size: 1.125rem;
    cursor: pointer;
    transition: all 0.3s;
}

.symptom-btn:hover {
    border-color: #9ca3af;
}

.symptom-btn.active[data-value="yes"] {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border-color: #dc2626;
    color: white;
}

.symptom-btn.active[data-value="no"] {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-color: #059669;
    color: white;
}

.action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.action-btn {
    flex: 1;
    min-width: 150px;
    padding: 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s;
    color: white;
}

.btn-transfer {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

.btn-transfer:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
}

.btn-reset {
    background: white;
    color: #1f2937;
    border: 2px solid #d1d5db;
}

.btn-reset:hover {
    border-color: #9ca3af;
    transform: translateY(-2px);
}

/* Records History */
.records-history {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid #e5e7eb;
}

.records-history h3 {
    font-size: 1.25rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 1.5rem;
}

.record-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.record-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f3f4f6;
    font-weight: 600;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.record-date {
    font-size: 0.875rem;
    color: #6b7280;
}

.record-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.75rem;
}

.detail-row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.detail-label {
    font-weight: 600;
    color: #374151;
}

/* Vital Signs Summary */
.vital-signs-summary {
    margin-top: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 2px solid #7dd3fc;
    border-radius: 0.5rem;
}

.vital-signs-summary h4 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #0c4a6e;
    margin-bottom: 0.75rem;
}

.vital-signs-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
}

.vital-summary-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem;
    background: white;
    border-radius: 0.375rem;
    border: 1px solid #bae6fd;
}

.vital-summary-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #475569;
}

.vital-summary-value {
    font-size: 0.875rem;
    font-weight: 700;
    color: #0c4a6e;
}

/* Score Color Badges */
.total-score-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    font-weight: 600;
}

.total-score-badge.score-green {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
}

.total-score-badge.score-yellow {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: white;
}

.total-score-badge.score-orange {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: white;
}

.total-score-badge.score-red {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
}

.transfer-badge {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    font-weight: 600;
}

/* CHD Button */
.chd-button {
    padding: 0.75rem 1.25rem;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.chd-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.chd-selected {
    padding: 1rem;
    background: #f5f3ff;
    border: 2px solid #c4b5fd;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
}

.chd-badge {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.875rem;
}

/* PALS Button */
.pals-button {
    padding: 0.625rem 1.5rem;
    background: #c0c0c0;
    color: white;
    border: 2px solid #9ca3af;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    margin-left: 0.5rem;
    transition: all 0.3s;
}

.pals-button.active {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border-color: #1d4ed8;
}

.pals-badge {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.875rem;
}

/* Modal */
.modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal-content {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 100%;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 2px solid #e5e7eb;
}

.modal-header h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
}

.modal-close {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #6b7280;
    line-height: 1;
}

.modal-close:hover {
    color: #1f2937;
}

.modal-body {
    padding: 1.5rem;
}

.chd-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.chd-option-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    background: white;
    cursor: pointer;
    transition: all 0.3s;
}

.chd-option-btn:hover {
    border-color: #8b5cf6;
    background: #f5f3ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

.chd-icon {
    font-size: 2rem;
    color: #8b5cf6;
}

.chd-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
}

/* Record Action Buttons */
.reassess-btn {
    padding: 0.75rem 1.25rem;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.reassess-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.delete-btn {
    padding: 0.75rem 1.25rem;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.delete-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Reassessment Badge */
.reassessment-badge {
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.75rem;
    margin-left: 0.5rem;
}

/* Empty Records */
.empty-records {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.empty-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
}

.empty-description {
    font-size: 0.875rem;
    color: #6b7280;
}

/* Comparison Container */
.comparison-container {
    margin-top: 1.5rem;
    padding: 2rem;
    border-radius: 1rem;
    background: white;
    border: 3px solid #e5e7eb;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.comparison-container.score-green {
    background: linear-gradient(135deg, rgba(220, 252, 231, 0.3) 0%, rgba(187, 247, 208, 0.3) 100%);
    border-color: #86efac;
}

.comparison-container.score-yellow {
    background: linear-gradient(135deg, rgba(254, 249, 195, 0.3) 0%, rgba(254, 240, 138, 0.3) 100%);
    border-color: #fde047;
}

.comparison-container.score-orange {
    background: linear-gradient(135deg, rgba(254, 215, 170, 0.3) 0%, rgba(253, 186, 116, 0.3) 100%);
    border-color: #fb923c;
}

.comparison-container.score-red {
    background: linear-gradient(135deg, rgba(254, 226, 226, 0.3) 0%, rgba(254, 202, 202, 0.3) 100%);
    border-color: #fca5a5;
}

.comparison-container h4 {
    font-size: 1.125rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 1.5rem;
    text-align: center;
}

.comparison-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1.5rem;
    align-items: center;
}

.comparison-column {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.comparison-column.highlight {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
}

.comparison-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f3f4f6;
}

.comparison-badge {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.875rem;
    flex-shrink: 0;
}

.comparison-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1f2937;
}

.comparison-time {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
}

.comparison-arrow {
    font-size: 2rem;
    color: #3b82f6;
    font-weight: bold;
    text-align: center;
}

.comparison-data {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.data-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    transition: all 0.2s;
}

.data-item.changed {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 2px solid #fbbf24;
    font-weight: 600;
    animation: highlight-pulse 2s ease-in-out infinite;
}

@keyframes highlight-pulse {
    0%, 100% {
        box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4);
    }
    50% {
        box-shadow: 0 0 0 8px rgba(251, 191, 36, 0);
    }
}

.data-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
}

.data-item.changed .data-label {
    color: #92400e;
}

.data-value {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
}

.data-item.changed .data-value {
    color: #92400e;
}

.data-value.score-value {
    font-size: 1.25rem;
    color: #2563eb;
}

.data-item.changed .data-value.score-value {
    color: #ea580c;
}

/* Responsive */
@media (max-width: 768px) {
    body {
        padding: 1rem 0.5rem;
    }

    .header {
        padding: 1.5rem;
    }

    .header h1 {
        font-size: 1.75rem;
    }

    .main-card {
        padding: 1.5rem;
    }

    .age-grid {
        grid-template-columns: 1fr;
    }

    .score-grid {
        grid-template-columns: 1fr;
    }

    .cardio-inputs-grid {
        grid-template-columns: 1fr;
    }

    .score-buttons-grid {
        grid-template-columns: 1fr;
    }

    .action-buttons {
        flex-direction: column;
    }

    .symptoms-buttons {
        flex-direction: column;
    }

    .symptom-btn {
        min-width: auto;
    }

    .transfer-section {
        padding: 1.5rem;
    }

    .transfer-icon {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
    }

    .total-score-number {
        font-size: 3rem;
    }

    .total-score-breakdown {
        grid-template-columns: repeat(2, 1fr);
    }

    .breakdown-item.additional {
        grid-column: span 2;
    }

    .comparison-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .comparison-arrow {
        transform: rotate(90deg);
    }
}

@media (max-width: 480px) {
    .record-details {
        grid-template-columns: 1fr;
    }

    .vital-signs-summary-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
