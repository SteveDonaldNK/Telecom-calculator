// Script pour le tableau de bord (dashboard.php)

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupAnimations();
    setupInteractions();
});

/**
 * Initialise le tableau de bord
 */
function initializeDashboard() {
    // Animer les statistiques au chargement
    animateStats();
    
    // Vérifier s'il y a des messages à afficher
    checkForMessages();
    
    // Mettre à jour les données si nécessaire
    updateDashboardData();
}

/**
 * Anime les cartes de statistiques
 */
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(statNumber => {
        const finalValue = parseInt(statNumber.textContent) || 0;
        animateNumber(statNumber, 0, finalValue, 1000);
    });
}

/**
 * Anime un nombre de 0 à sa valeur finale
 * @param {HTMLElement} element - L'élément contenant le nombre
 * @param {number} start - Valeur de départ
 * @param {number} end - Valeur finale
 * @param {number} duration - Durée de l'animation en ms
 */
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Fonction d'easing pour une animation plus fluide
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(start + (end - start) * easeOutCubic);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = end; // S'assurer que la valeur finale est exacte
        }
    }
    
    requestAnimationFrame(updateNumber);
}

/**
 * Configure les animations d'entrée
 */
function setupAnimations() {
    // Observer pour les animations au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observer les sections du dashboard
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Configure les interactions
 */
function setupInteractions() {
    // Effets hover sur les cartes de calcul
    const calcCards = document.querySelectorAll('.calc-card');
    calcCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('disabled')) {
                this.style.transform = 'translateY(-4px) scale(1.02)';
                this.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Gestion du clic sur les cartes 5G
    const calc5gCard = document.querySelector('.calc-card.calc-5g');
    if (calc5gCard) {
        calc5gCard.addEventListener('click', function(e) {
            e.preventDefault();
            showComingSoonModal();
        });
    }
    
    // Tooltips pour les statistiques
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Interaction avec le tableau des calculs récents
    const tableRows = document.querySelectorAll('.calculations-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            this.style.backgroundColor = 'var(--primary-color)';
            this.style.color = 'white';
            
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 200);
        });
    });
}

/**
 * Vérifie s'il y a des messages à afficher
 */
function checkForMessages() {
    // Vérifier les paramètres URL pour des messages
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const type = urlParams.get('type') || 'info';
    
    if (message) {
        showNotification(decodeURIComponent(message), type);
        
        // Nettoyer l'URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
}

/**
 * Met à jour les données du dashboard
 */
function updateDashboardData() {
    // Mettre à jour l'heure de dernière connexion
    updateLastLoginTime();
    
    // Rafraîchir les statistiques périodiquement
    setInterval(() => {
        refreshStats();
    }, 300000); // 5 minutes
}

/**
 * Met à jour l'heure de dernière connexion
 */
function updateLastLoginTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Ajouter l'info quelque part sur la page si nécessaire
    const userInfo = document.querySelector('.nav-user span');
    if (userInfo && !userInfo.dataset.updated) {
        userInfo.title = `Dernière connexion: ${timeString}`;
        userInfo.dataset.updated = 'true';
    }
}

/**
 * Rafraîchit les statistiques
 */
function refreshStats() {
    // Faire un appel AJAX pour récupérer les nouvelles stats
    fetch('api/get_stats.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateStatValues(data.stats);
            }
        })
        .catch(error => {
            console.log('Impossible de rafraîchir les statistiques:', error);
        });
}

/**
 * Met à jour les valeurs des statistiques
 * @param {Object} stats - Les nouvelles statistiques
 */
function updateStatValues(stats) {
    const totalCalculations = document.querySelector('.stat-card .stat-number');
    if (totalCalculations && stats.total_calculations !== undefined) {
        const currentValue = parseInt(totalCalculations.textContent);
        const newValue = stats.total_calculations;
        
        if (newValue !== currentValue) {
            animateNumber(totalCalculations, currentValue, newValue, 500);
        }
    }
}

/**
 * Affiche une notification
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de notification (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = getNotificationIcon(type);
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Styles CSS pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: 1rem;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease-out;
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animer l'entrée
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Gestion de la fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Auto-fermeture après 5 secondes
    setTimeout(() => {
        if (document.body.contains(notification)) {
            hideNotification(notification);
        }
    }, 5000);
}

/**
 * Cache une notification
 * @param {HTMLElement} notification - L'élément notification à cacher
 */
function hideNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 300);
}

/**
 * Retourne l'icône appropriée pour le type de notification
 * @param {string} type - Le type de notification
 * @returns {string} - La classe CSS de l'icône
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    return icons[type] || icons.info;
}

/**
 * Affiche la modal "À venir" pour la 5G
 */
function showComingSoonModal() {
    // Créer la modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-wifi"></i> Calculs 5G NR</h3>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="coming-soon-content">
                    <i class="fas fa-rocket"></i>
                    <h4>Fonctionnalités à venir</h4>
                    <p>Les calculs pour la technologie 5G New Radio seront bientôt disponibles. Cette fonctionnalité inclura:</p>
                    <ul>
                        <li>Calcul des débits 5G NR</li>
                        <li>Support des différentes bandes de fréquences</li>
                        <li>Gestion des configurations MIMO</li>
                        <li>Analyse des performances en temps réel</li>
                    </ul>
                    <p>Restez connecté pour les prochaines mises à jour!</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary modal-close">
                    <i class="fas fa-bell"></i>
                    Me notifier lors de la sortie
                </button>
            </div>
        </div>
    `;
    
    // Styles pour la modal
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

/**
 * Recherche dans les calculs récents
 * @param {string} query - La requête de recherche
 */
function searchCalculations(query) {
    const rows = document.querySelectorAll('.calculations-table tbody tr');
    const searchTerm = query.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            row.classList.add('search-highlight');
        } else {
            row.style.display = 'none';
            row.classList.remove('search-highlight');
        }
    });
}

/**
 * Exporte les données du dashboard en PDF
 */
function exportDashboard() {
    showNotification('Fonctionnalité d\'export en développement', 'info');
}

// Ajout des styles CSS nécessaires pour les nouvelles fonctionnalités
const additionalStyles = `
    .notification {
        font-family: inherit;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: 1rem;
        color: var(--text-muted);
        transition: color 0.2s ease;
    }
    
    .notification-close:hover {
        color: var(--text-primary);
    }
    
    .modal-content {
        background: var(--surface-color);
        border-radius: var(--radius-lg);
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: var(--shadow-lg);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .modal-header h3 {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: 0;
        color: var(--text-primary);
    }
    
    .modal-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        color: var(--text-muted);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
    }
    
    .modal-close:hover {
        background: var(--background-color);
        color: var(--text-primary);
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .coming-soon-content {
        text-align: center;
    }
    
    .coming-soon-content i {
        font-size: 3rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .coming-soon-content h4 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .coming-soon-content ul {
        text-align: left;
        margin: 1rem 0;
        padding-left: 1.5rem;
    }
    
    .coming-soon-content li {
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
    }
    
    .modal-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--border-color);
        text-align: center;
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(2rem);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .search-highlight {
        background-color: var(--primary-color) !important;
        color: white !important;
    }
`;

// Injecter les styles supplémentaires
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
