// Script pour les pages d'authentification (signup.php et signin.php)

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.auth-form');
    const inputs = document.querySelectorAll('input');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Validation en temps réel
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Validation du formulaire avant soumission
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        // Validation spéciale pour les mots de passe (page inscription)
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm_password');
        
        if (password && confirmPassword) {
            if (password.value !== confirmPassword.value) {
                showFieldError(confirmPassword, 'Les mots de passe ne correspondent pas');
                isValid = false;
            }
        }
        
        if (!isValid) {
            e.preventDefault();
            showAlert('Veuillez corriger les erreurs avant de continuer', 'error');
        } else {
            // Afficher un indicateur de chargement
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
            submitButton.disabled = true;
        }
    });
});

/**
 * Valide un champ de formulaire
 * @param {HTMLElement} field - Le champ à valider
 * @returns {boolean} - True si le champ est valide
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Supprimer les erreurs précédentes
    clearFieldError(field);
    
    // Validation selon le type de champ
    switch (fieldName) {
        case 'username':
            if (value.length < 3) {
                showFieldError(field, 'Le nom d\'utilisateur doit contenir au moins 3 caractères');
                return false;
            }
            if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                showFieldError(field, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et _');
                return false;
            }
            break;
            
        case 'email':
            if (!isValidEmail(value)) {
                showFieldError(field, 'Format d\'email invalide');
                return false;
            }
            break;
            
        case 'password':
            if (value.length < 6) {
                showFieldError(field, 'Le mot de passe doit contenir au moins 6 caractères');
                return false;
            }
            // Vérifier la complexité du mot de passe
            if (!isStrongPassword(value)) {
                showFieldError(field, 'Le mot de passe doit contenir au moins une lettre et un chiffre');
                return false;
            }
            break;
            
        case 'login':
            if (value.length < 3) {
                showFieldError(field, 'Veuillez saisir votre nom d\'utilisateur ou email');
                return false;
            }
            break;
            
        default:
            if (field.hasAttribute('required') && value === '') {
                showFieldError(field, 'Ce champ est obligatoire');
                return false;
            }
    }
    
    // Marquer le champ comme valide
    field.classList.add('valid');
    return true;
}

/**
 * Vérifie si un email est valide
 * @param {string} email - L'email à vérifier
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Vérifie si un mot de passe est suffisamment fort
 * @param {string} password - Le mot de passe à vérifier
 * @returns {boolean}
 */
function isStrongPassword(password) {
    // Au moins une lettre et un chiffre
    return /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

/**
 * Affiche une erreur pour un champ spécifique
 * @param {HTMLElement} field - Le champ concerné
 * @param {string} message - Le message d'erreur
 */
function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('valid');
    
    // Créer ou mettre à jour le message d'erreur
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('small');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error-color)';
    errorElement.style.fontSize = '0.75rem';
    errorElement.style.marginTop = '0.25rem';
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
 * Affiche une alerte générale
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type d'alerte (success, error, warning)
 */
function showAlert(message, type = 'info') {
    // Supprimer les alertes existantes
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Créer la nouvelle alerte
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    
    const icon = type === 'error' ? 'fa-exclamation-circle' : 
                 type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
    
    alertElement.innerHTML = `
        <i class="fas ${icon}"></i>
        ${message}
    `;
    
    // Insérer l'alerte au début du formulaire
    const form = document.querySelector('.auth-form');
    form.parentNode.insertBefore(alertElement, form);
    
    // Faire défiler vers l'alerte
    alertElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Supprimer l'alerte après 5 secondes
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.remove();
        }
    }, 5000);
}

/**
 * Affiche/masque le mot de passe
 * @param {string} inputId - L'ID du champ de mot de passe
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Ajouter des effets visuels
document.addEventListener('DOMContentLoaded', function() {
    // Animation d'entrée pour la carte d'authentification
    const authCard = document.querySelector('.auth-card');
    if (authCard) {
        authCard.style.opacity = '0';
        authCard.style.transform = 'translateY(2rem)';
        
        setTimeout(() => {
            authCard.style.transition = 'all 0.5s ease-out';
            authCard.style.opacity = '1';
            authCard.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Effet de focus sur les champs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.style.transform = 'scale(1.02)';
            this.parentNode.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.style.transform = 'scale(1)';
        });
    });
});
