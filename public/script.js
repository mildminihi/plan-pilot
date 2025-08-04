// script.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('travelForm');
    const resultSection = document.getElementById('result');
    const loadingOverlay = document.getElementById('loading');
    const aiPromptElement = document.getElementById('aiPrompt');
    const copyButton = document.getElementById('copyPrompt');
    const newPlanButton = document.getElementById('newPlan');

    // Form submission handler
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Show loading overlay
        showLoading();

        // Collect form data
        const formData = new FormData(form);
        const travelData = {};

        for (let [key, value] of formData.entries()) {
            travelData[key] = value.trim();
        }

        try {
            // Submit data to server
            const response = await fetch('/submit-travel-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(travelData)
            });

            const result = await response.json();

            if (result.success) {
                // Hide loading and show results
                hideLoading();
                showResults(result.aiPrompt);

                // Show success message
                showNotification('Travel plan generated successfully!', 'success');
            } else {
                throw new Error(result.message || 'Failed to generate travel plan');
            }

        } catch (error) {
            hideLoading();
            showNotification('Error: ' + error.message, 'error');
            console.error('Error:', error);
        }
    });

    // Copy prompt to clipboard
    copyButton.addEventListener('click', async function () {
        try {
            await navigator.clipboard.writeText(aiPromptElement.textContent);

            // Update button text temporarily
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyButton.style.background = 'var(--success-color)';

            setTimeout(() => {
                copyButton.innerHTML = originalText;
                copyButton.style.background = 'var(--primary-color)';
            }, 2000);

            showNotification('Prompt copied to clipboard!', 'success');
        } catch (error) {
            showNotification('Failed to copy to clipboard', 'error');
        }
    });

    // Create new plan button
    newPlanButton.addEventListener('click', function () {
        // Reset form
        form.reset();

        // Hide results
        resultSection.style.display = 'none';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Focus on first input
        document.getElementById('tripName').focus();
    });

    // Form validation
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        field.addEventListener('blur', function () {
            validateField(this);
        });

        field.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();

        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            field.classList.remove('success');
            return false;
        } else if (field.type === 'number' && (isNaN(value) || parseInt(value) < 1)) {
            field.classList.add('error');
            field.classList.remove('success');
            return false;
        } else {
            field.classList.remove('error');
            field.classList.add('success');
            return true;
        }
    }

    function showLoading() {
        loadingOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function hideLoading() {
        loadingOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showResults(prompt) {
        aiPromptElement.textContent = prompt;
        resultSection.style.display = 'block';

        // Smooth scroll to results
        setTimeout(() => {
            resultSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            fontSize: '0.9rem',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: '300px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            animation: 'slideInRight 0.3s ease-out',
            background: getNotificationColor(type)
        });

        // Add to document
        document.body.appendChild(notification);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    function getNotificationColor(type) {
        switch (type) {
            case 'success': return 'var(--success-color)';
            case 'error': return 'var(--error-color)';
            case 'warning': return 'var(--warning-color)';
            default: return 'var(--primary-color)';
        }
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });

    // Add some interactive enhancements
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});
