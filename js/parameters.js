// Script pour la page de saisie des paramètres (parameters.php)

document.addEventListener('DOMContentLoaded', function() {
    initializeParametersForm();
    setupFormValidation();
    setupFormInteractions();
    setupPreviewCalculation();
});

/**
 * Initialise le formulaire des paramètres
 */
function initializeParametersForm() {
    // Configuration des bandes passantes LTE avec leurs débits
    const lteConfig = {
        5: { throughput: 21.6, description: '5 MHz - Bande étroite' },
        10: { throughput: 50.7, description: '10 MHz - Bande standard' },
        15: { throughput: 74.5, description: '15 MHz - Bande large' },
        20: { throughput: 102.9, description: '20 MHz - Bande très large' }
    };
    
    // Stocker la configuration globalement
    window.lteConfig = lteConfig;
    
    // Mettre à jour les descriptions des options
    updateBandwidthDescriptions();
    
    // Initialiser les valeurs par défaut
    setDefaultValues();
    
    // Activer la prévisualisation en temps réel
    enableRealTimePreview();
}

/**
 * Met à jour les descriptions des bandes passantes
 */
function updateBandwidthDescriptions() {
    const bandwidthSelect = document.getElementById('bandwidth_mhz');
    if (bandwidthSelect) {
        const options = bandwidthSelect.querySelectorAll('option');
        options.forEach(option => {
            const value = parseFloat(option.value);
            if (window.lteConfig[value]) {
                const config = window.lteConfig[value];
                option.textContent = `${value} MHz (${config.throughput} Mbps)`;
                option.title = config.description;
            }
        });
    }
}

/**
 * Définit les valeurs par défaut du formulaire
 */
function setDefaultValues() {
    const transportEfficiency = document.getElementById('transport_efficiency');
    if (transportEfficiency && !transportEfficiency.value) {
        transportEfficiency.value = '0.95';
    }
}

/**
 * Active la prévisualisation en temps réel
 */
function enableRealTimePreview() {
    const form = document.querySelector('.parameters-form');
    if (!form) return;
    
    // Créer la section de prévisualisation
    createPreviewSection();
    
    // Écouter les changements sur tous les champs du formulaire
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });
    
    // Mise à jour initiale
    updatePreview();
}

/**
 * Crée la section de prévisualisation des résultats
 */
function createPreviewSection() {
    const form = document.querySelector('.parameters-form');
    const submitSection = form.querySelector('.form-actions');
    
    const previewSection = document.createElement('div');
    previewSection.className = 'form-section preview-section';
    previewSection.innerHTML = `
        <h3><i class="fas fa-eye"></i> Aperçu des résultats</h3>
        <div class="preview-results">
            <div class="preview-grid">
                <div class="preview-item">
                    <label>Radio MAC Throughput</label>
                    <span class="preview-value" id="preview-radio-mac">-- Mbps</span>
                </div>
                <div class="preview-item">
                    <label>Transport Throughput</label>
                    <span class="preview-value" id="preview-transport">-- Mbps</span>
                </div>
                <div class="preview-item">
                    <label>Control Plane</label>
                    <span class="preview-value" id="preview-control">-- Mbps</span>
                </div>
                <div class="preview-item highlight">
                    <label>SS Throughput</label>
                    <span class="preview-value" id="preview-ss">-- Mbps</span>
                </div>
            </div>
            <div class="preview-efficiency">
                <label>Efficacité globale</label>
                <span class="preview-value" id="preview-efficiency">-- %</span>
            </div>
        </div>
    `;
    
    form.insertBefore(previewSection, submitSection);
}

/**
 * Met à jour la prévisualisation des résultats
 */
function updatePreview() {
    const bandwidthMhz = parseFloat(document.getElementById('bandwidth_mhz')?.value);
    const transportEfficiency = parseFloat(document.getElementById('transport_efficiency')?.value) || 0.95;
    
    if (!bandwidthMhz || !window.lteConfig[bandwidthMhz]) {
        clearPreview();
        return;
    }
    
    // Calculs selon les formules
    const radioMacThroughput = window.lteConfig[bandwidthMhz].throughput;
    const radioPayloadThroughput = radioMacThroughput; // Radio Payload = Radio MAC
    const transportThroughput = radioPayloadThroughput * transportEfficiency;
    const controlPlane = transportThroughput * 0.02;
    const ssThroughput = transportThroughput * 1.02;
    const globalEfficiency = (ssThroughput / radioMacThroughput) * 100;
    
    // Mettre à jour l'affichage
    updatePreviewValue('preview-radio-mac', radioMacThroughput);
    updatePreviewValue('preview-transport', transportThroughput);
    updatePreviewValue('preview-control', controlPlane);
    updatePreviewValue('preview-ss', ssThroughput);
    updatePreviewValue('preview-efficiency', globalEfficiency, '%');
    
    // Animer les changements
    animatePreviewUpdate();
}

/**
 * Met à jour une valeur de prévisualisation
 * @param {string} elementId - L'ID de l'élément à mettre à jour
 * @param {number} value - La nouvelle valeur
 * @param {string} unit - L'unité (par défaut 'Mbps')
 */
function updatePreviewValue(elementId, value, unit = 'Mbps') {
    const element = document.getElementById(elementId);
    if (element) {
        const formattedValue = Number.isFinite(value) ? value.toFixed(2) : '--';
        element.textContent = `${formattedValue} ${unit}`;
        
        // Ajouter une classe pour l'animation
        element.classList.add('updated');
        setTimeout(() => {
            element.classList.remove('updated');
        }, 500);
    }
}

/**
 * Efface la prévisualisation
 */
function clearPreview() {
    const previewValues = document.querySelectorAll('.preview-value');
    previewValues.forEach(element => {
        if (element.id === 'preview-efficiency') {
            element.textContent = '-- %';
        } else {
            element.textContent = '-- Mbps';
        }
    });
}

/**
 * Anime la mise à jour de la prévisualisation
 */
function animatePreviewUpdate() {
    const previewSection = document.querySelector('.preview-section');
    if (previewSection) {
        previewSection.style.transform = 'scale(1.01)';
        setTimeout(() => {
            previewSection.style.transform = 'scale(1)';
        }, 200);
    }
}

/**
 * Configure la validation du formulaire
 */
function setupFormValidation() {
    const form = document.querySelector('.parameters-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            showFormError('Veuillez corriger les erreurs avant de continuer');
        } else {
            // Afficher un indicateur de chargement
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calcul en cours...';
                submitButton.disabled = true;
            }
        }
    });
    
    // Validation en temps réel
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

/**
 * Valide tout le formulaire
 * @returns {boolean} - True si le formulaire est valide
 */
function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validation spécifique pour l'efficacité de transport
    const transportEfficiency = document.getElementById('transport_efficiency');
    if (transportEfficiency) {
        const value = parseFloat(transportEfficiency.value);
        if (isNaN(value) || value < 0.1 || value > 1.0) {
            showFieldError(transportEfficiency, 'L\'efficacité doit être entre 0.1 et 1.0');
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Valide un champ spécifique
 * @param {HTMLElement} field - Le champ à valider
 * @returns {boolean} - True si le champ est valide
 */
function validateField(field) {
    const value = field.value.trim();
    
    // Vérifier si le champ est requis et vide
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Ce champ est obligatoire');
        return false;
    }
    
    // Validations spécifiques par champ
    switch (field.id) {
        case 'bandwidth_frequency':
            if (value && !['1800', '2100', '2600'].includes(value)) {
                showFieldError(field, 'Fréquence non supportée');
                return false;
            }
            break;
            
        case 'bandwidth_mhz':
            if (value && !window.lteConfig[parseFloat(value)]) {
                showFieldError(field, 'Bande passante non supportée');
                return false;
            }
            break;
            
        case 'transport_efficiency':
            const numValue = parseFloat(value);
            if (value && (isNaN(numValue) || numValue < 0.1 || numValue > 1.0)) {
                showFieldError(field, 'Valeur entre 0.1 et 1.0 requise');
                return false;
            }
            break;
    }
    
    // Si on arrive ici, le champ est valide
    clearFieldError(field);
    return true;
}

/**
 * Affiche une erreur pour un champ
 * @param {HTMLElement} field - Le champ concerné
 * @param {string} message - Le message d'erreur
 */
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorElement = document.createElement('small');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--error-color);
        font-size: 0.75rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorElement);
}

/**
 * Supprime l'erreur d'un champ
 * @param {HTMLElement} field - Le champ à nettoyer
 */
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Affiche une erreur générale du formulaire
 * @param {string} message - Le message d'erreur
 */
function showFormError(message) {
    const form = document.querySelector('.parameters-form');
    const existingError = form.querySelector('.form-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error alert alert-error';
    errorElement.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        ${message}
    `;
    
    form.insertBefore(errorElement, form.firstChild);
    
    // Faire défiler vers l'erreur
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.remove();
        }
    }, 5000);
}

/**
 * Configure les interactions du formulaire
 */
function setupFormInteractions() {
    // Effets visuels sur les sections du formulaire
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        });
        
        section.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Tooltip pour l'efficacité de transport
    const transportEfficiencyField = document.getElementById('transport_efficiency');
    if (transportEfficiencyField) {
        addTooltip(transportEfficiencyField, 'L\'efficacité de transport représente le pourcentage du débit radio effectivement utilisé pour les données utilisateur');
    }
    
    // Auto-completion intelligente
    setupIntelligentDefaults();
}

/**
 * Ajoute un tooltip à un élément
 * @param {HTMLElement} element - L'élément cible
 * @param {string} text - Le texte du tooltip
 */
function addTooltip(element, text) {
    element.title = text;
    element.addEventListener('mouseenter', function() {
        // Créer un tooltip personnalisé si nécessaire
        showCustomTooltip(this, text);
    });
}

/**
 * Affiche un tooltip personnalisé
 * @param {HTMLElement} element - L'élément cible
 * @param {string} text - Le texte à afficher
 */
function showCustomTooltip(element, text) {
    // Supprimer les tooltips existants
    const existingTooltips = document.querySelectorAll('.custom-tooltip');
    existingTooltips.forEach(tooltip => tooltip.remove());
    
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--text-primary);
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        max-width: 200px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
    `;
    
    document.body.appendChild(tooltip);
    
    // Positionner le tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.bottom + 5) + 'px';
    
    // Animer l'apparition
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
    
    // Supprimer au bout de 3 secondes
    setTimeout(() => {
        if (document.body.contains(tooltip)) {
            tooltip.remove();
        }
    }, 3000);
}

/**
 * Configure les valeurs par défaut intelligentes
 */
function setupIntelligentDefaults() {
    const frequencySelect = document.getElementById('bandwidth_frequency');
    const bandwidthSelect = document.getElementById('bandwidth_mhz');
    
    if (frequencySelect && bandwidthSelect) {
        frequencySelect.addEventListener('change', function() {
            const frequency = parseInt(this.value);
            
            // Suggérer une bande passante appropriée selon la fréquence
            let suggestedBandwidth;
            switch (frequency) {
                case 1800:
                    suggestedBandwidth = '20'; // Fréquence basse, grande bande passante
                    break;
                case 2100:
                    suggestedBandwidth = '15'; // Fréquence moyenne
                    break;
                case 2600:
                    suggestedBandwidth = '10'; // Fréquence haute, bande plus étroite
                    break;
            }
            
            if (suggestedBandwidth && !bandwidthSelect.value) {
                bandwidthSelect.value = suggestedBandwidth;
                
                // Notifier l'utilisateur
                showSuggestionNotification(`Bande passante suggérée: ${suggestedBandwidth} MHz pour ${frequency} MHz`);
                
                // Mettre à jour la prévisualisation
                updatePreview();
            }
        });
    }
}

/**
 * Affiche une notification de suggestion
 * @param {string} message - Le message à afficher
 */
function showSuggestionNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'suggestion-notification';
    notification.innerHTML = `
        <i class="fas fa-lightbulb"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        color: var(--warning-color);
        border: 1px solid #f59e0b;
        border-radius: var(--radius-md);
        padding: 0.75rem 1rem;
        box-shadow: var(--shadow-md);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Animer l'entrée
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Supprimer après 4 secondes
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

/**
 * Configure la prévisualisation de calcul
 */
function setupPreviewCalculation() {
    // Ajouter un bouton de calcul rapide
    const previewSection = document.querySelector('.preview-section');
    if (previewSection) {
        const quickCalcButton = document.createElement('button');
        quickCalcButton.type = 'button';
        quickCalcButton.className = 'btn btn-outline btn-sm';
        quickCalcButton.innerHTML = '<i class="fas fa-calculator"></i> Calcul détaillé';
        quickCalcButton.style.marginTop = '1rem';
        
        quickCalcButton.addEventListener('click', showDetailedCalculation);
        
        previewSection.appendChild(quickCalcButton);
    }
}

/**
 * Affiche le calcul détaillé dans une modal
 */
function showDetailedCalculation() {
    const bandwidthMhz = parseFloat(document.getElementById('bandwidth_mhz')?.value);
    const transportEfficiency = parseFloat(document.getElementById('transport_efficiency')?.value) || 0.95;
    const frequency = document.getElementById('bandwidth_frequency')?.value;
    
    if (!bandwidthMhz || !window.lteConfig[bandwidthMhz]) {
        alert('Veuillez sélectionner une bande passante valide');
        return;
    }
    
    // Effectuer les calculs
    const radioMacThroughput = window.lteConfig[bandwidthMhz].throughput;
    const radioPayloadThroughput = radioMacThroughput;
    const transportThroughput = radioPayloadThroughput * transportEfficiency;
    const controlPlane = transportThroughput * 0.02;
    const ssThroughput = transportThroughput * 1.02;
    
    // Créer la modal avec les détails
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content detailed-calc-modal">
            <div class="modal-header">
                <h3><i class="fas fa-calculator"></i> Calcul détaillé 4G LTE</h3>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="calc-parameters">
                    <h4>Paramètres d'entrée</h4>
                    <div class="param-grid">
                        <div class="param-item">
                            <label>Fréquence:</label>
                            <span>${frequency} MHz</span>
                        </div>
                        <div class="param-item">
                            <label>Bande passante:</label>
                            <span>${bandwidthMhz} MHz</span>
                        </div>
                        <div class="param-item">
                            <label>Efficacité transport:</label>
                            <span>${(transportEfficiency * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="calc-steps">
                    <h4>Étapes de calcul</h4>
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <strong>Radio MAC Throughput</strong>
                            <div class="step-formula">Valeur de référence LTE</div>
                            <div class="step-result">${radioMacThroughput.toFixed(2)} Mbps</div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <strong>Radio Payload Throughput</strong>
                            <div class="step-formula">= Radio MAC Throughput</div>
                            <div class="step-result">${radioPayloadThroughput.toFixed(2)} Mbps</div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <strong>Transport Throughput</strong>
                            <div class="step-formula">= ${radioPayloadThroughput.toFixed(2)} × ${transportEfficiency}</div>
                            <div class="step-result">${transportThroughput.toFixed(2)} Mbps</div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <strong>Control Plane</strong>
                            <div class="step-formula">= ${transportThroughput.toFixed(2)} × 0.02</div>
                            <div class="step-result">${controlPlane.toFixed(2)} Mbps</div>
                        </div>
                    </div>
                    
                    <div class="step highlight">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <strong>SS Throughput</strong>
                            <div class="step-formula">= ${transportThroughput.toFixed(2)} × 1.02</div>
                            <div class="step-result">${ssThroughput.toFixed(2)} Mbps</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary modal-close">
                    <i class="fas fa-check"></i>
                    Continuer avec ces valeurs
                </button>
            </div>
        </div>
    `;
    
    // Ajouter les styles pour la modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // Animer l'ouverture
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // Gestion de la fermeture
    const closeButtons = modal.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            }, 300);
        });
    });
    
    // Fermer en cliquant sur l'overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.querySelector('.modal-close').click();
        }
    });
}

// Styles CSS supplémentaires pour les nouvelles fonctionnalités
const additionalStyles = `
    .preview-section {
        background: linear-gradient(135deg, #f0f9ff, #e0f2fe) !important;
        border-color: var(--primary-color) !important;
    }
    
    .preview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .preview-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: var(--surface-color);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-color);
    }
    
    .preview-item.highlight {
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        border-color: var(--warning-color);
    }
    
    .preview-item label {
        font-weight: 500;
        color: var(--text-secondary);
        font-size: 0.875rem;
    }
    
    .preview-value {
        font-weight: 600;
        color: var(--text-primary);
        font-family: 'Monaco', 'Menlo', monospace;
        transition: all 0.3s ease;
    }
    
    .preview-value.updated {
        color: var(--primary-color);
        transform: scale(1.1);
    }
    
    .preview-efficiency {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
        border-radius: var(--radius-md);
        border: 2px solid var(--success-color);
        font-size: 1.125rem;
    }
    
    .preview-efficiency label {
        font-weight: 600;
        color: var(--success-color);
    }
    
    .preview-efficiency .preview-value {
        font-size: 1.25rem;
        color: var(--success-color);
    }
    
    .field-error {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    input.error, select.error {
        border-color: var(--error-color) !important;
        box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1) !important;
    }
    
    .detailed-calc-modal {
        max-width: 600px;
        max-height: 80vh;
    }
    
    .param-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 0.75rem;
        margin: 1rem 0;
    }
    
    .param-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        background: var(--background-color);
        border-radius: var(--radius-sm);
    }
    
    .param-item label {
        font-weight: 500;
        color: var(--text-secondary);
    }
    
    .param-item span {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .calc-steps {
        margin-top: 1.5rem;
    }
    
    .calc-steps h4 {
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .step {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: var(--background-color);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
    }
    
    .step.highlight {
        background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
        border-color: var(--primary-color);
    }
    
    .step-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        background: var(--primary-color);
        color: white;
        border-radius: 50%;
        font-weight: 600;
        font-size: 0.875rem;
        flex-shrink: 0;
    }
    
    .step-content strong {
        display: block;
        margin-bottom: 0.25rem;
        color: var(--text-primary);
    }
    
    .step-formula {
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-bottom: 0.25rem;
    }
    
    .step-result {
        font-weight: 700;
        color: var(--primary-color);
        font-size: 1.125rem;
    }
    
    @media (max-width: 768px) {
        .preview-grid {
            grid-template-columns: 1fr;
        }
        
        .param-grid {
            grid-template-columns: 1fr;
        }
        
        .detailed-calc-modal {
            margin: 1rem;
            max-width: calc(100% - 2rem);
        }
    }
`;

// Injecter les styles supplémentaires
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);