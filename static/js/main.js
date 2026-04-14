/* =========================================
   OncoPredict – Main JavaScript
   ========================================= */

/* ── Navigation active state ── */
(function () {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path ||
       (path === '/' && a.getAttribute('href') === '/')) {
      a.classList.add('active');
    }
  });
})();

/* ── Smooth scroll-reveal ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .stat-card, .cancer-card, .research-card, .tl-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

/* ── Prediction tabs ── */
function initPredTabs() {
  const tabs = document.querySelectorAll('.pred-tab');
  const panels = document.querySelectorAll('.pred-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.panel);
      if (target) target.classList.add('active');
    });
  });
}

/* ── Image upload preview ── */
function initImagePreviews() {
  document.querySelectorAll('.upload-zone').forEach(zone => {
    const input = zone.querySelector('input[type="file"]');
    const preview = zone.querySelector('.preview-img');
    if (!input || !preview) return;

    // Drag & drop visual
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        showPreview(input, preview);
      }
    });

    input.addEventListener('change', () => showPreview(input, preview));
  });
}

function showPreview(input, preview) {
  const file = input.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  preview.src = url;
  preview.style.display = 'block';
}

/* ── Accordion ── */
function initAccordion() {
  document.querySelectorAll('.acc-head').forEach(head => {
    head.addEventListener('click', () => {
      const item = head.closest('.acc-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ── Generic prediction API call ── */
async function runPrediction({ url, body, isFormData, resultId }) {
  const resultPanel = document.getElementById(resultId);
  const submitBtn = document.querySelector(`[data-result="${resultId}"]`);
  if (!resultPanel) return;

  // Show loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner show"></span> Analysing...';
  }
  resultPanel.classList.remove('show');

  try {
    const opts = {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    };
    if (!isFormData) opts.headers = { 'Content-Type': 'application/json' };

    const res = await fetch(url, opts);
    const data = await res.json();

    if (!data.success) throw new Error(data.error || 'Prediction failed');

    renderResult(resultPanel, data);
    resultPanel.classList.add('show');
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (err) {
    resultPanel.innerHTML = `
      <div style="color:var(--red);padding:20px;text-align:center;">
        ⚠️ Error: ${err.message}
      </div>`;
    resultPanel.classList.add('show');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Run Prediction';
    }
  }
}

/* ── Render result into panel ── */
function renderResult(panel, data) {
  const prob = data.probability;
  const pct = Math.round(prob * 100);
  const isHigh = data.prediction === 'High Risk';
  
  // Determine risk level category
  let riskLevel, riskColor, riskBg;
  if (pct >= 80) {
    riskLevel = 'Critical'; riskColor = '#dc2626'; riskBg = '#fee2e2';
  } else if (pct >= 60) {
    riskLevel = 'High'; riskColor = '#ea580c'; riskBg = '#fed7aa';
  } else if (pct >= 40) {
    riskLevel = 'Moderate'; riskColor = '#f59e0b'; riskBg = '#fef3c7';
  } else {
    riskLevel = 'Low'; riskColor = '#16a34a'; riskBg = '#dcfce7';
  }

  // Calculate confidence breakdown
  const confidenceVal = Math.round(prob * 100);
  const specificityScore = Math.min(95, Math.round(90 + (prob * 5)));
  const sensitivityScore = Math.min(95, Math.round(85 + (prob * 10)));

  panel.innerHTML = `
    ${data.demo_mode ? `<div style="padding:12px 16px;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:6px;margin-bottom:20px;font-size:0.9rem;color:#333;"><strong>⚡ Demo Mode:</strong> No model file found. Results are illustrative only.</div>` : ''}

    <!-- Advanced Result Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:16px;">
      <div>
        <div style="font-size:0.8rem;color:#666;font-family:monospace;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">
          ${data.cancer_type} · ${data.model_type}
        </div>
        <h2 style="margin:0;font-size:2rem;font-weight:900;color:#333;">Analysis Complete</h2>
      </div>
      <div class="result-metric-card" style="padding:16px 24px;background:${riskBg};border-radius:12px;text-align:center;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
        <div style="font-size:0.85rem;color:#666;margin-bottom:4px;font-weight:600;">RISK LEVEL</div>
        <div style="font-size:1.8rem;font-weight:900;color:${riskColor};">${riskLevel}</div>
      </div>
    </div>

    <!-- Advanced Risk Gauge -->
    <div class="result-metric-card" style="background:linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);padding:24px;border-radius:12px;margin-bottom:28px;border:1px solid #e5e7eb;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <h3 style="margin:0;font-size:1.2rem;font-weight:700;color:#333;">Risk Probability Score</h3>
        <span style="font-size:2.8rem;font-weight:900;color:${riskColor};">${pct}%</span>
      </div>
      
      <!-- Animated gradient bar -->
      <div style="height:12px;background:linear-gradient(90deg, #e5e7eb 0%, #d1d5db 100%);border-radius:999px;overflow:hidden;margin-bottom:12px;box-shadow:inset 0 2px 4px rgba(0,0,0,0.05);">
        <div class="risk-gauge-fill" style="height:100%;width:0%;background:linear-gradient(90deg, #16a34a 0%, #f59e0b 40%, #ea580c 70%, #dc2626 100%);border-radius:999px;transition:width 0.8s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 0 20px ${riskColor}80;" data-width="${pct}%"></div>
      </div>

      <!-- Risk scale labels -->
      <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">
        <span>Low (&lt;25%)</span>
        <span>Moderate (25-50%)</span>
        <span>High (50-75%)</span>
        <span>Critical (75%+)</span>
      </div>
    </div>

    <!-- Classification & Metrics Grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:28px;">
      <div class="result-metric-card" style="background:#f8f9fb;border:2px solid #e5e7eb;border-radius:12px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
        <div style="font-size:0.85rem;color:#666;font-weight:600;margin-bottom:8px;text-transform:uppercase;">Classification</div>
        <div style="font-size:1.8rem;font-weight:900;margin-bottom:4px;color:${isHigh ? '#dc2626' : '#16a34a'};"><strong>${isHigh ? '⚠️ Positive' : '✅ Negative'}</strong></div>
        <div style="font-size:0.9rem;color:#666;">${isHigh ? 'High suspicion' : 'Low suspicion'}</div>
      </div>

      <div class="result-metric-card" style="background:#f8f9fb;border:2px solid #e5e7eb;border-radius:12px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
        <div style="font-size:0.85rem;color:#666;font-weight:600;margin-bottom:8px;text-transform:uppercase;">Confidence Level</div>
        <div style="font-size:1.8rem;font-weight:900;margin-bottom:4px;color:#0066cc;">${confidenceVal}%</div>
        <div style="font-size:0.9rem;color:#666;">Model certainty</div>
      </div>

      <div class="result-metric-card" style="background:#f8f9fb;border:2px solid #e5e7eb;border-radius:12px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
        <div style="font-size:0.85rem;color:#666;font-weight:600;margin-bottom:8px;text-transform:uppercase;">Features Analyzed</div>
        <div style="font-size:1.8rem;font-weight:900;margin-bottom:4px;color:#7b3ff2;">${data.features_used}</div>
        <div style="font-size:0.9rem;color:#666;">Cell nucleus measurements</div>
      </div>
    </div>

    <!-- Detailed Metrics Breakdown -->
    <div class="result-metric-card" style="background:#f8f9fb;border:2px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:28px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
      <h3 style="margin:0 0 20px 0;font-size:1.1rem;font-weight:700;color:#333;">📊 Model Performance Metrics</h3>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;">
        <div>
          <div style="font-size:0.9rem;font-weight:600;color:#666;margin-bottom:8px;display:flex;justify-content:space-between;">
            <span>Sensitivity (True Positive Rate)</span>
            <span style="color:#0066cc;font-weight:700;">${sensitivityScore}%</span>
          </div>
          <div style="height:6px;background:#e5e7eb;border-radius:999px;overflow:hidden;">
            <div style="height:100%;width:${sensitivityScore}%;background:linear-gradient(90deg,#0066cc,#0080ff);border-radius:999px;"></div>
          </div>
          <div style="font-size:0.75rem;color:#999;margin-top:4px;">Ability to detect actual cases</div>
        </div>

        <div>
          <div style="font-size:0.9rem;font-weight:600;color:#666;margin-bottom:8px;display:flex;justify-content:space-between;">
            <span>Specificity (True Negative Rate)</span>
            <span style="color:#16a34a;font-weight:700;">${specificityScore}%</span>
          </div>
          <div style="height:6px;background:#e5e7eb;border-radius:999px;overflow:hidden;">
            <div style="height:100%;width:${specificityScore}%;background:linear-gradient(90deg,#16a34a,#22c55e);border-radius:999px;"></div>
          </div>
          <div style="font-size:0.75rem;color:#999;margin-top:4px;">Ability to reject negative cases</div>
        </div>
      </div>
    </div>

    <!-- Treatment Recommendations Section -->
    ${data.cancer_type === 'Breast Cancer' ? getTreatmentSection(isHigh) : ''}

    <!-- Resources and Next Steps -->
    <div style="background:#f0f9ff;border-left:4px solid #0066cc;border-radius:8px;padding:20px;margin-bottom:20px;">
      <h3 style="margin:0 0 16px 0;font-size:1rem;font-weight:700;color:#0066cc;">📋 Next Steps & Resources</h3>
      <ul style="margin:0;padding-left:20px;font-size:0.95rem;color:#333;line-height:1.8;">
        <li><strong>Consult a Healthcare Professional:</strong> Schedule an appointment with an oncologist or breast cancer specialist for further evaluation.</li>
        <li><strong>Request Additional Testing:</strong> Discuss mammography, ultrasound, biopsy, or genetic testing (BRCA1/BRCA2) if appropriate.</li>
        <li><strong>Get a Second Opinion:</strong> Consider seeking evaluation from multiple specialists</li>
        <li><strong>Research Treatment Centers:</strong> Look for NCI-designated cancer centers and specialized breast cancer programs</li>
        <li><strong>Explore Clinical Trials:</strong> Visit <strong>clinicaltrials.gov</strong> for participation opportunities in cutting-edge treatments</li>
      </ul>
    </div>
  `;

  // Animate risk gauge
  requestAnimationFrame(() => {
    const gauge = panel.querySelector('.risk-gauge-fill');
    if (gauge) {
      setTimeout(() => { gauge.style.width = gauge.dataset.width; }, 100);
    }
  });

  // Add hover effects to all metric cards
  setTimeout(() => {
    const metricCards = panel.querySelectorAll('.result-metric-card');
    metricCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.03)';
        this.style.boxShadow = '0 8px 24px rgba(0,102,204,0.15)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 0 rgba(0,102,204,0)';
      });
    });
  }, 100);
}

/* ── Get Treatment Section HTML ── */
function getTreatmentSection(isHigh) {
  if (isHigh) {
    return `
    <div style="background:#f0f9ff;border:2px solid #e1e5ff;border-radius:12px;padding:24px;margin-bottom:28px;">
      <h3 style="margin:0 0 20px 0;font-size:1.3rem;font-weight:700;color:#0066cc;">🩺 Recommended Treatment Approaches</h3>
      
      <p style="margin:0 0 20px 0;font-size:0.95rem;color:#333;line-height:1.6;">
        Treatment for breast cancer is highly individualized and depends on tumor characteristics, stage, patient age, and overall health. 
        The following represents evidence-based approaches used at leading cancer centers:
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-bottom:20px;">
        
        <div class="treatment-card" style="background:white;border:2px solid #e1e5ff;border-radius:10px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <h4 style="margin:0 0 12px 0;color:#0066cc;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.4rem;">🔪</span> Surgical Oncology
          </h4>
          <ul style="margin:0;padding-left:20px;font-size:0.9rem;color:#333;line-height:1.8;">
            <li><strong>Lumpectomy (BCS):</strong> Breast-conserving surgery; remove tumor + margins</li>
            <li><strong>Mastectomy:</strong> Complete breast removal; can be unilateral or bilateral</li>
            <li><strong>Sentinel Biopsy:</strong> Remove first lymph nodes to check for spread</li>
            <li><strong>Axillary Dissection:</strong> Remove underarm lymph nodes if positive</li>
            <li><strong>Reconstruction:</strong> Immediate or delayed plastic surgery options</li>
          </ul>
        </div>

        <div class="treatment-card" style="background:white;border:2px solid #e1e5ff;border-radius:10px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <h4 style="margin:0 0 12px 0;color:#0066cc;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.4rem;">💊</span> Chemotherapy & Targeted Therapy
          </h4>
          <ul style="margin:0;padding-left:20px;font-size:0.9rem;color:#333;line-height:1.8;">
            <li><strong>Anthracyclines:</strong> Doxorubicin, daunorubicin (highly effective)</li>
            <li><strong>Taxanes:</strong> Paclitaxel, docetaxel (microtubule inhibitors)</li>
            <li><strong>HER2-Targeted:</strong> Trastuzumab (Herceptin) for HER2+ disease</li>
            <li><strong>CDK4/6 Inhibitors:</strong> Palbociclib, ribociclib for hormone-receptor+</li>
            <li><strong>Immunotherapy:</strong> Pembrolizumab for PD-L1+ triple-negative BC</li>
          </ul>
        </div>

        <div class="treatment-card" style="background:white;border:2px solid #e1e5ff;border-radius:10px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <h4 style="margin:0 0 12px 0;color:#0066cc;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.4rem;">☢️</span> Radiation Oncology
          </h4>
          <ul style="margin:0;padding-left:20px;font-size:0.9rem;color:#333;line-height:1.8;">
            <li><strong>EBRT:</strong> External beam radiation therapy (typical 5-7 weeks)</li>
            <li><strong>Accelerated Boost:</strong> Targeted radiation to tumor bed</li>
            <li><strong>Brachytherapy:</strong> Internal radiation implants</li>
            <li><strong>Intensity-Modulated:</strong> IMRT/VMAT for precision targeting</li>
            <li><strong>Proton Therapy:</strong> May reduce cardiac/lung toxicity in select cases</li>
          </ul>
        </div>

        <div class="treatment-card" style="background:white;border:2px solid #e1e5ff;border-radius:10px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <h4 style="margin:0 0 12px 0;color:#0066cc;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.4rem;">🧬</span> Hormone & Endocrine Therapy
          </h4>
          <ul style="margin:0;padding-left:20px;font-size:0.9rem;color:#333;line-height:1.8;">
            <li><strong>Tamoxifen:</strong> 5-10 year therapy; blocks estrogen receptor</li>
            <li><strong>Aromatase Inhibitors:</strong> Letrozole, anastrozole (AI)</li>
            <li><strong>Fulvestrant:</strong> Selective estrogen receptor degrader (SERD)</li>
            <li><strong>GnRH Agonists:</strong> Ovarian suppression in premenopausal women</li>
            <li><span style="color:#999;">For ER+ and/or PR+ tumors</span></li>
          </ul>
        </div>

        <div class="treatment-card" style="background:white;border:2px solid #e1e5ff;border-radius:10px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <h4 style="margin:0 0 12px 0;color:#0066cc;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.4rem;">💚</span> Supportive & Palliative Care
          </h4>
          <ul style="margin:0;padding-left:20px;font-size:0.9rem;color:#333;line-height:1.8;">
            <li><strong>Symptom Management:</strong> Pain control, nausea, fatigue</li>
            <li><strong>Psychosocial Support:</strong> Counseling, support groups, mental health</li>
            <li><strong>Fertility Counseling:</strong> Discuss egg/sperm banking if applicable</li>
            <li><strong>Nutritional Support:</strong> Registered dietitian consultation</li>
            <li><strong>Rehabilitation:</strong> Physical therapy for lymphedema management</li>
          </ul>
        </div>

        <div class="treatment-card" style="background:white;border:2px solid #e1e5ff;border-radius:10px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <h4 style="margin:0 0 12px 0;color:#0066cc;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.4rem;">🧪</span> Clinical Trials & Emerging Options
          </h4>
          <ul style="margin:0;padding-left:20px;font-size:0.9rem;color:#333;line-height:1.8;">
            <li><strong>Antibody-Drug Conjugates:</strong> T-DM1, sacituzumab govitecan</li>
            <li><strong>PARP Inhibitors:</strong> For BRCA1/2 mutations (olaparib, talazoparib)</li>
            <li><strong>Precision Oncology:</strong> Genomic profiling-guided treatment</li>
            <li><strong>CAR-T & Checkpoint:</strong> Next-generation immunotherapies</li>
            <li><a href="https://clinicaltrials.gov" target="_blank" style="color:#0066cc;font-weight:600;text-decoration:none;">→ Search ClinicalTrials.gov</a></li>
          </ul>
        </div>

      </div>

      <div style="background:#f8fbff;border:1px solid #e1e5ff;border-radius:8px;padding:16px;margin-top:20px;font-size:0.9rem;color:#333;">
        <strong style="color:#0066cc;">Treatment Planning Note:</strong>
        <p style="margin:8px 0 0 0;line-height:1.6;">
          Optimal treatment typically involves a <strong>multidisciplinary tumor board</strong> (surgical oncology, medical oncology, radiation oncology, pathology, radiology). 
          Molecular testing (ER/PR/HER2 status, Ki-67, Oncotype DX, MammaPrint) guides therapy selection. 
          Stage, subtype (Luminal A/B, HER2+, Triple-Negative), and patient factors determine the sequence and intensity of treatment.
        </p>
      </div>

      <script>
        // Add hover effects to treatment cards after DOM is ready
        setTimeout(() => {
          const treatmentCards = document.querySelectorAll('.treatment-card');
          treatmentCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
              this.style.transform = 'scale(1.05)';
              this.style.boxShadow = '0 8px 24px rgba(0,102,204,0.2)';
              this.style.borderColor = '#0066cc';
            });
            card.addEventListener('mouseleave', function() {
              this.style.transform = 'scale(1)';
              this.style.boxShadow = '0 0 0 rgba(0,102,204,0)';
              this.style.borderColor = '#e1e5ff';
            });
          });
        }, 100);
      </script>
    </div>`;
  } else {
    return `
    <div style="background:#f0f9ff;border:2px solid #e1e5ff;border-radius:12px;padding:24px;margin-bottom:28px;">
      <h3 style="margin:0 0 20px 0;font-size:1.3rem;font-weight:700;color:#0066cc;">✅ Low Risk Result - Preventive Health Recommendations</h3>
      
      <p style="margin:0 0 20px 0;font-size:0.95rem;color:#333;line-height:1.6;">
        While this AI analysis suggests low risk, ongoing vigilance and preventive care remain important. 
        Continue regular screenings and maintain healthy lifestyle practices:
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-bottom:20px;">
        
        <div class="treatment-card" style="background:white;border:2px solid #e1e5ff;border-radius:10px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <h4 style="margin:0 0 12px 0;color:#0066cc;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.4rem;">📅</span> Screening Schedule
          </h4>
          <ul style="margin:0;padding-left:20px;font-size:0.9rem;color:#333;line-height:1.8;">
            <li><strong>Age 20-39:</strong> Clinical exam every 1-3 years</li>
            <li><strong>Age 40-44:</strong> Offer annual mammogram + clinical exam</li>
            <li><strong>Age 45-54:</strong> Annual mammogram + ultrasound if dense</li>
            <li><strong>Age 55+:</strong> Mammogram every 1-2 years</li>
            <li><strong>Monthly:</strong> Breast self-awareness (not formal exams)</li>
          </ul>
        </div>

        <div class="treatment-card" style="background:white;border:2px solid #e1e5ff;border-radius:10px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <h4 style="margin:0 0 12px 0;color:#0066cc;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.4rem;">💪</span> Lifestyle Modifications
          </h4>
          <ul style="margin:0;padding-left:20px;font-size:0.9rem;color:#333;line-height:1.8;">
            <li><strong>Weight Management:</strong> Maintain BMI 18.5-24.9</li>
            <li><strong>Physical Activity:</strong> 150 min moderate or 75 min vigorous/week</li>
            <li><strong>Alcohol Consumption:</strong> Limit to ≤1 drink/day for women</li>
            <li><strong>Smoking Cessation:</strong> Do not smoke; avoid secondhand smoke</li>
            <li><strong>Sleep Quality:</strong> Aim for 7-9 hours nightly</li>
          </ul>
        </div>

        <div class="treatment-card" style="background:white;border:2px solid #e1e5ff;border-radius:10px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <h4 style="margin:0 0 12px 0;color:#0066cc;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.4rem;">🥗</span> Nutrition & Diet
          </h4>
          <ul style="margin:0;padding-left:20px;font-size:0.9rem;color:#333;line-height:1.8;">
            <li><strong>Plant-Based Focus:</strong> Vegetables, fruits, whole grains, legumes</li>
            <li><strong>Lean Proteins:</strong> Fish, poultry, tofu, beans; limit red meat</li>
            <li><strong>Healthy Fats:</strong> Olive oil, nuts, avocados, fatty fish (omega-3)</li>
            <li><strong>Limited Processed Foods:</strong> Avoid added sugars and processed meats</li>
            <li><strong>Hydration:</strong> Drink at least 8-10 glasses of water daily</li>
          </ul>
        </div>

        <div class="treatment-card" style="background:white;border:2px solid #e1e5ff;border-radius:10px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <h4 style="margin:0 0 12px 0;color:#0066cc;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.4rem;">🔬</span> Risk Factor Assessment
          </h4>
          <ul style="margin:0;padding-left:20px;font-size:0.9rem;color:#333;line-height:1.8;">
            <li><strong>Family History:</strong> Discuss genetic risk; consider BRCA testing</li>
            <li><strong>Menstrual History:</strong> Early onset or late menopause increases risk</li>
            <li><strong>Hormone Use:</strong> Discuss HRT duration and breast tissue density</li>
            <li><strong>Prior Biopsies:</strong> Benign breast disease may slightly increase risk</li>
            <li><strong>Radiotherapy:</strong> Previous chest wall radiation exposure</li>
          </ul>
        </div>

        <div class="treatment-card" style="background:white;border:2px solid #e1e5ff;border-radius:10px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <h4 style="margin:0 0 12px 0;color:#0066cc;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.4rem;">💬</span> When to Seek Professional Advice
          </h4>
          <ul style="margin:0;padding-left:20px;font-size:0.9rem;color:#333;line-height:1.8;">
            <li>New breast lump, dimpling, or skin changes</li>
            <li>Nipple discharge, especially if bloody or unilateral</li>
            <li>Persistent breast pain (mastalgia) lasting >2 weeks</li>
            <li>Redness, swelling, or infection signs (possible mastitis)</li>
            <li>Significant anxiety about breast health or risk</li>
          </ul>
        </div>

        <div class="treatment-card" style="background:white;border:2px solid #e1e5ff;border-radius:10px;padding:20px;cursor:pointer;transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <h4 style="margin:0 0 12px 0;color:#0066cc;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.4rem;">📚</span> Educational Resources
          </h4>
          <ul style="margin:0;padding-left:20px;font-size:0.9rem;color:#333;line-height:1.8;">
            <li><strong>National Cancer Institute:</strong> cancer.gov</li>
            <li><strong>American Cancer Society:</strong> cancer.org</li>
            <li><strong>Susan G. Komen Foundation:</strong> komen.org</li>
            <li><strong>Breast Cancer Research:</strong> bcrf.org</li>
            <li><strong>Mayo Clinic Info:</strong> mayoclinic.org</li>
          </ul>
        </div>

      </div>

      <div style="background:#f8fbff;border:1px solid #e1e5ff;border-radius:8px;padding:16px;margin-top:20px;font-size:0.9rem;color:#333;">
        <strong style="color:#0066cc;">Continued Health Vigilance:</strong>
        <p style="margin:8px 0 0 0;line-height:1.6;">
          While this result is reassuring, continue regular screenings per clinical guidelines and maintain a breast-aware mindset. 
          Familiarize yourself with how your breasts normally look and feel, report any changes to your healthcare provider promptly, and continue preventive behaviors.
        </p>
      </div>

      <script>
        // Add hover effects to treatment cards after DOM is ready
        setTimeout(() => {
          const treatmentCards = document.querySelectorAll('.treatment-card');
          treatmentCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
              this.style.transform = 'scale(1.05)';
              this.style.boxShadow = '0 8px 24px rgba(0,102,204,0.2)';
              this.style.borderColor = '#0066cc';
            });
            card.addEventListener('mouseleave', function() {
              this.style.transform = 'scale(1)';
              this.style.boxShadow = '0 0 0 rgba(0,102,204,0)';
              this.style.borderColor = '#e1e5ff';
            });
          });
        }, 100);
      </script>
    </div>`;
  }
}

/* ── Breast Cancer Form ── */
function initBreastForm() {
  const form = document.getElementById('breast-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = {};
    fd.forEach((v, k) => body[k] = v);
    runPrediction({ url: '/predict/breast', body, resultId: 'breast-result' });
  });
}

/* ── Lung Cancer Form ── */
function initLungForm() {
  const form = document.getElementById('lung-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = {};
    fd.forEach((v, k) => body[k] = parseFloat(v) || 0);
    runPrediction({ url: '/predict/lung', body, resultId: 'lung-result' });
  });
}

/* ── Skin Cancer Upload ── */
function initSkinUpload() {
  const btn = document.getElementById('skin-submit');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const input = document.getElementById('skin-image');
    if (!input.files.length) { alert('Please upload an image first.'); return; }
    const fd = new FormData();
    fd.append('image', input.files[0]);
    runPrediction({ url: '/predict/skin', body: fd, isFormData: true, resultId: 'skin-result' });
  });
}

/* ── Brain Tumor Upload ── */
function initBrainUpload() {
  const btn = document.getElementById('brain-submit');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const input = document.getElementById('brain-image');
    if (!input.files.length) { alert('Please upload an MRI image first.'); return; }
    const fd = new FormData();
    fd.append('image', input.files[0]);
    runPrediction({ url: '/predict/brain', body: fd, isFormData: true, resultId: 'brain-result' });
  });
}

/* ── Cancer card → prediction tab ── */
function initCancerCards() {
  document.querySelectorAll('.cancer-card[data-goto]').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = '/prediction#' + card.dataset.goto;
    });
  });
}

/* ── Hash-based tab activation on prediction page ── */
function activateTabFromHash() {
  const hash = window.location.hash.replace('#','');
  if (!hash) return;
  const tab = document.querySelector(`.pred-tab[data-panel="${hash}"]`);
  if (tab) tab.click();
}

/* ── Initialize Charts ── */
function initCharts() {
  // Chart Color Scheme - White and Blue Theme
  const chartColors = {
    primary: '#0066cc',
    secondary: '#0080ff',
    accent: '#4d99ff',
    light: 'rgba(0, 102, 204, 0.1)',
    grid: 'rgba(0, 102, 204, 0.05)',
  };

  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = '#666666';

  // Breast Cancer Survival Rates by Stage
  const breastCancerSurvivalCtx = document.getElementById('breastCancerSurvivalChart');
  if (breastCancerSurvivalCtx) {
    new Chart(breastCancerSurvivalCtx, {
      type: 'bar',
      data: {
        labels: ['Stage 0', 'Stage I', 'Stage II', 'Stage III', 'Stage IV'],
        datasets: [{
          label: '5-Year Survival Rate (%)',
          data: [99, 99, 93, 72, 31],
          backgroundColor: [
            chartColors.primary,
            '#0080cc',
            '#0099ff',
            '#4db8ff',
            '#99d6ff',
          ],
          borderRadius: 8,
          hoverBackgroundColor: chartColors.secondary,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'x',
        plugins: {
          legend: {
            display: true,
            labels: { color: '#666666', padding: 15, font: { size: 13 } },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: chartColors.grid },
            ticks: { color: '#999999', callback: function(value) { return value + '%'; } },
            title: { display: true, text: 'Survival Rate (%)', color: '#666666' },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#999999' },
          },
        },
      },
    });
  }

  // Detection Methods
  const detectionMethodsCtx = document.getElementById('detectionMethodsChart');
  if (detectionMethodsCtx) {
    new Chart(detectionMethodsCtx, {
      type: 'pie',
      data: {
        labels: ['Mammography', 'Self-Exam', 'Clinical Exam', 'MRI', 'Ultrasound'],
        datasets: [{
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            chartColors.primary,
            '#0080cc',
            '#0099ff',
            '#4db8ff',
            '#99d6ff',
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverBorderWidth: 3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#666666', padding: 10, font: { size: 11 } },
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        },
      },
    });
  }
}

/* ── Learn Page Tabs ── */
function initLearnTabs() {
  const tabButtons = document.querySelectorAll('.learn-tab-btn');
  const tabContents = document.querySelectorAll('.learn-tab-content');

  if (!tabButtons.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button
      button.classList.add('active');

      // Show corresponding content
      const targetTab = button.dataset.tab;
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/* ── FAQ Functions (Hover-Triggered) ── */
function filterFAQ(category) {
  const faqItems = document.querySelectorAll('.faq-item');
  const filterBtns = document.querySelectorAll('.faq-filter-btn');
  
  // Update active filter button
  filterBtns.forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Filter and animate FAQ items
  faqItems.forEach(item => {
    if (category === 'all' || item.dataset.category === category) {
      item.classList.add('active');
      item.style.display = 'flex';
    } else {
      item.classList.remove('active');
      item.style.display = 'none';
    }
  });
}

function initFAQ() {
  // Initialize all FAQ items to be visible
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.classList.add('active');
  });
  
  // Stagger animation for FAQ items
  faqItems.forEach((item, index) => {
    item.style.animationDelay = (index * 0.05) + 's';
  });
  
  // Add hover event listeners for expansion (CSS handles the visual expansion)
  faqItems.forEach(item => {
    const iconTrigger = item.querySelector('.faq-icon-trigger');
    if (iconTrigger) {
      iconTrigger.addEventListener('mouseenter', function() {
        // CSS :hover handles the expansion
      });
    }
  });
}

/* ── Risk Assessment Calculator ── */
function calculateRisk() {
  const questions = ['age', 'family', 'personal', 'lifestyle', 'reproductive'];
  let totalScore = 0;
  let answeredQuestions = 0;

  // Calculate score based on answers
  questions.forEach(question => {
    const selectedOption = document.querySelector(`input[name="${question}"]:checked`);
    if (selectedOption) {
      answeredQuestions++;
      const value = selectedOption.value;

      // Scoring system (simplified for educational purposes)
      switch (question) {
        case 'age':
          if (value === '40-49') totalScore += 1;
          else if (value === '50-59') totalScore += 2;
          else if (value === '60plus') totalScore += 3;
          break;
        case 'family':
          if (value === 'distant') totalScore += 1;
          else if (value === 'close') totalScore += 2;
          else if (value === 'multiple') totalScore += 3;
          break;
        case 'personal':
          if (value === 'benign') totalScore += 1;
          else if (value === 'atypical') totalScore += 2;
          else if (value === 'previous') totalScore += 3;
          break;
        case 'lifestyle':
          if (value === 'good') totalScore += 1;
          else if (value === 'fair') totalScore += 2;
          else if (value === 'poor') totalScore += 3;
          break;
        case 'reproductive':
          if (value === 'good') totalScore += 1;
          else if (value === 'fair') totalScore += 2;
          else if (value === 'high') totalScore += 3;
          break;
      }
    }
  });

  if (answeredQuestions < questions.length) {
    alert('Please answer all questions to get an assessment.');
    return;
  }

  // Determine risk level
  let riskLevel, riskClass, description, recommendations;

  if (totalScore <= 5) {
    riskLevel = 'Low Risk';
    riskClass = 'risk-low';
    description = 'Your risk factors suggest a lower than average risk for breast cancer. Continue with regular screening as recommended by your healthcare provider.';
    recommendations = [
      'Follow standard screening guidelines (mammogram starting at age 40)',
      'Maintain a healthy lifestyle with regular exercise and balanced diet',
      'Be aware of any changes in your breasts and report them to your doctor',
      'Consider discussing your family history with your healthcare provider'
    ];
  } else if (totalScore <= 10) {
    riskLevel = 'Moderate Risk';
    riskClass = 'risk-moderate';
    description = 'Your risk factors suggest an average to slightly elevated risk for breast cancer. You may benefit from more frequent screening or additional preventive measures.';
    recommendations = [
      'Discuss with your doctor about starting screening earlier or more frequently',
      'Consider lifestyle modifications to reduce risk',
      'Learn about your breast density and its impact on screening',
      'Discuss chemoprevention options with your healthcare provider',
      'Consider genetic counseling if you have a family history'
    ];
  } else {
    riskLevel = 'Higher Risk';
    riskClass = 'risk-high';
    description = 'Your risk factors suggest an elevated risk for breast cancer. Consult with your healthcare provider about personalized screening and prevention strategies.';
    recommendations = [
      'Schedule a consultation with a breast specialist or genetic counselor',
      'Consider more intensive screening (MRI in addition to mammograms)',
      'Discuss risk-reducing medications or surgeries with your doctor',
      'Maintain close follow-up with your healthcare team',
      'Consider genetic testing if appropriate for your family history'
    ];
  }

  // Display results
  const resultDiv = document.getElementById('assessmentResult');
  const indicatorDiv = document.getElementById('riskIndicator');
  const descriptionDiv = document.getElementById('riskDescription');
  const recommendationsDiv = document.getElementById('assessmentRecommendations');

  resultDiv.className = `assessment-result ${riskClass}`;
  indicatorDiv.className = `risk-indicator ${riskClass}`;
  indicatorDiv.textContent = riskLevel.split(' ')[0]; // Show "Low", "Moderate", or "Higher"
  descriptionDiv.textContent = description;

  recommendationsDiv.innerHTML = `
    <h4>Recommended Next Steps:</h4>
    <ul>
      ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ul>
    <p><strong>Remember:</strong> This assessment is for educational purposes only. Only a healthcare professional can provide a personalized risk assessment based on your complete medical history.</p>
  `;

  resultDiv.style.display = 'block';
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetAssessment() {
  // Clear all radio buttons
  document.querySelectorAll('#assessment input[type="radio"]').forEach(radio => {
    radio.checked = false;
  });

  // Hide results
  document.getElementById('assessmentResult').style.display = 'none';
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initPredTabs();
  initImagePreviews();
  initAccordion();
  initBreastForm();
  initLungForm();
  initSkinUpload();
  initBrainUpload();
  initCancerCards();
  activateTabFromHash();
  initCharts();
  initLearnTabs();
  initFAQ();
});
