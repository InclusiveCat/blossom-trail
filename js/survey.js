/**
 * Survey form logic, validation, and auto-save
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('blossom-survey');
    if (!form) return;

    const steps = document.querySelectorAll('.step');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnSubmit = document.getElementById('btn-submit');
    const progressText = document.getElementById('progress-text');
    const errorNotice = document.getElementById('inline-error');
    
    let currentStep = 0;

    // Load Draft
    const draft = JSON.parse(localStorage.getItem('blossom_survey_draft')) || {};
    Object.keys(draft).forEach(name => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input) {
            if (input.type === 'radio' || input.type === 'checkbox') {
                const checkEl = form.querySelector(`[name="${name}"][value="${draft[name]}"]`);
                if (checkEl) checkEl.checked = true;
            } else {
                input.value = draft[name];
            }
        }
    });

    // Auto-save logic
    form.addEventListener('change', (e) => {
        if (e.target.name) {
            draft[e.target.name] = e.target.value;
            localStorage.setItem('blossom_survey_draft', JSON.stringify(draft));
        }
    });

    function updateNav() {
        errorNotice.style.display = 'none';
        steps.forEach((el, index) => {
            if (index === currentStep) {
                el.classList.add('active');
                el.removeAttribute('hidden');
            } else {
                el.classList.remove('active');
                el.setAttribute('hidden', 'true');
            }
        });
        
        if (progressText) {
            progressText.innerText = `Step ${currentStep + 1} of ${steps.length}`;
        }

        if (btnPrev) btnPrev.style.display = currentStep > 0 ? 'inline-flex' : 'none';
        
        if (currentStep === steps.length - 1) {
            if (btnNext) btnNext.style.display = 'none';
            if (btnSubmit) btnSubmit.style.display = 'inline-flex';
        } else {
            if (btnNext) btnNext.style.display = 'inline-flex';
            if (btnSubmit) btnSubmit.style.display = 'none';
        }
        
        // Focus management: move focus to the first active input
        const firstInput = steps[currentStep].querySelector('input, select, textarea');
        if (firstInput) {
            firstInput.focus();
        }
    }

    function validateStep() {
        const currentStepEl = steps[currentStep];
        const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
        let valid = true;

        // Custom Honeypot check
        const honeypot = document.getElementById('bot-check');
        if (honeypot && honeypot.value) {
            return false; // Silently fail for bots
        }

        inputs.forEach(input => {
            if (input.type === 'radio') {
                const name = input.getAttribute('name');
                if (!currentStepEl.querySelector(`input[name="${name}"]:checked`)) valid = false;
            } else if (!input.value.trim()) {
                valid = false;
            }
        });

        // Validate checkbox groups: at least one must be checked
        const checkboxGroups = new Set();
        currentStepEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            checkboxGroups.add(cb.getAttribute('name'));
        });
        checkboxGroups.forEach(name => {
            if (!currentStepEl.querySelector(`input[type="checkbox"][name="${name}"]:checked`)) {
                valid = false;
            }
        });

        if (!valid) {
            errorNotice.style.display = 'block';
            errorNotice.setAttribute('aria-live', 'assertive');
            // Ensure focus goes to error so screen readers read it
            errorNotice.focus();
        }
        return valid;
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (validateStep()) {
                currentStep++;
                updateNav();
            }
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            currentStep--;
            updateNav();
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateStep()) return;

        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Submitting...';

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            mode: 'no-cors'
        }).then(() => {
            // Clear draft
            localStorage.removeItem('blossom_survey_draft');
            window.location.href = 'success.html';
        }).catch(err => {
            console.error("Submission failed", err);
            errorNotice.innerText = 'An error occurred while submitting. Please check your connection and try again.';
            errorNotice.style.display = 'block';
            btnSubmit.disabled = false;
            btnSubmit.innerText = 'Submit Survey';
        });
    });

    const uuidInput = document.getElementById("uuid");
    if (uuidInput) {
        uuidInput.value = window.SESSION_GUID || localStorage.getItem('blossom_guid');
    }

    // Init
    updateNav();
});
