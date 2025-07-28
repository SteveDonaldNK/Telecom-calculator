/**
 * Exporte les résultats en PDF
 */
function exportToPDF() {
    // Afficher un indicateur de chargement
    showLoadingIndicator('Génération du PDF en cours...');
    
    // Simuler la génération du PDF (ici tu peux intégrer une vraie librairie PDF)
    setTimeout(() => {
        hideLoadingIndicator();
        
        // Créer un contenu PDF simple (tu peux remplacer par jsPDF ou similar)
        const printContent = generatePrintableContent();
        
        // Ouvrir la boîte de dialogue d'impression
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
        
        showNotification('PDF généré avec succès', 'success');
    }, 2000);
}

/**
 * Génère le contenu imprimable
 * @returns {string} - Le HTML pour l'impression
 */
function generatePrintableContent() {
    const title = document.querySelector('.results-header h1').textContent;
    const calculationSummary = document.querySelector('.calculation-summary');
    const resultsGrid = document.querySelector('.results-grid');
    const calculationFormulas = document.querySelector('.calculation-formulas');
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .summary { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                .results { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
                .result-item { border: 1px solid #dee2e6; padding: 15px; border-radius: 8px; }
                .result-value { font-size: 24px; font-weight: bold; color: #0066cc; }
                .formulas { margin-top: 20px; }
                .formula-step { margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${title}</h1>
                <p>Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            </div>
            ${calculationSummary ? calculationSummary.outerHTML : ''}
            <div class="results">
                ${Array.from(document.querySelectorAll('.result-card')).map(card => `
                    <div class="result-item">
                        <h3>${card.querySelector('h3').textContent}</h3>
                        <div class="result-value">${card.querySelector('.result-value').textContent}</div>
                        <p>${card.querySelector('.result-description').textContent}</p>
                    </div>
                `).join('')}
            </div>
            ${calculationFormulas ? calculationFormulas.outerHTML : ''}
        </body>
        </html>
    `;
}

/**
 * Configure l'export CSV pour l'historique
 */
function setupCSVExport() {
    // Ajouter un bouton d'export CSV s'il y a un tableau
    const tableContainer = document.querySelector('.calculations-history');
    if (tableContainer) {
        const exportButton = document.createElement('button');
        exportButton.className = 'btn btn-outline';
        exportButton.innerHTML = '<i class="fas fa-file-csv"></i> Exporter CSV';
        exportButton.addEventListener('click', exportToCSV);
        
        // Ajouter le bouton après le tableau
        tableContainer.appendChild(exportButton);
    }
}

/**
 * Exporte l'historique des calculs en CSV
 */
function exportToCSV() {
    const table = document.querySelector('.calculations-table');
    if (!table) {
        showNotification('Aucune donnée à exporter', 'warning');
        return;
    }
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    // Traiter chaque ligne
    rows.forEach(row => {
        const cols = row.querySelectorAll('th, td');
        const rowData = Array.from(cols).slice(0, -1).map(col => {
            return '"' + col.textContent.trim().replace(/"/g, '""') + '"';
        });
        csv.push(rowData.join(','));
    });
    
    // Créer et télécharger le fichier CSV
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'calculs_4g_' + new Date().toISOString().split('T')[0] + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Fichier CSV exporté avec succès', 'success');
    }
}

/**
 * Configure les fonctionnalités de partage
 */
function setupShareFeatures() {
    // Ajouter un bouton de partage
    const actionsSection = document.querySelector('.result-actions');
    if (actionsSection) {
        const shareButton = document.createElement('button');
        shareButton.className = 'btn btn-outline';
        shareButton.innerHTML = '<i class="fas fa-share-alt"></i> Partager';
        shareButton.addEventListener('click', showShareModal);
        
        actionsSection.appendChild(shareButton);
    }
}

/**
 * Affiche la modal de partage
 */
function showShareModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content share-modal">
            <div class="modal-header">
                <h3><i class="fas fa-share-alt"></i> Partager les résultats</h3>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="share-options">
                    <button class="share-option" data-type="link">
                        <i class="fas fa-link"></i>
                        <span>Copier le lien</span>
                    </button>
                    <button class="share-option" data-type="email">
                        <i class="fas fa-envelope"></i>
                        <span>Envoyer par email</span>
                    </button>
                    <button class="share-option" data-type="whatsapp">
                        <i class="fab fa-whatsapp"></i>
                        <span>WhatsApp</span>
                    </button>
                    <button class="share-option" data-type="linkedin">
                        <i class="fab fa-linkedin"></i>
                        <span>LinkedIn</span>
                    </button>
                </div>
                <div class="share-summary">
                    <h4>Résumé du calcul</h4>
                    <div id="share-text">${generateShareText()}</div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modal);
    
    // Gérer les options de partage
    const shareOptions = modal.querySelectorAll('.share-option');
    shareOptions.forEach(option => {
        option.addEventListener('click', function() {
            handleShare(this.dataset.type);
        });
    });
}

/**
 * Génère le texte de partage
 * @returns {string} - Le texte formaté pour le partage
 */
function generateShareText() {
    const results = Array.from(document.querySelectorAll('.result-card')).map(card => {
        const title = card.querySelector('h3').textContent;
        const value = card.querySelector('.result-value').textContent;
        return `${title}: ${value}`;
    });
    
    return `Résultats de calcul 4G LTE:\n${results.join('\n')}`;
}

/**
 * Gère le partage selon le type
 * @param {string} type - Le type de partage
 */
function handleShare(type) {
    const shareText = generateShareText();
    const currentUrl = window.location.href;
    
    switch (type) {
        case 'link':
            navigator.clipboard.writeText(currentUrl).then(() => {
                showNotification('Lien copié dans le presse-papiers', 'success');
            });
            break;
            
        case 'email':
            const emailSubject = 'Résultats de calcul 4G LTE';
            const emailBody = encodeURIComponent(shareText + '\n\nVoir plus: ' + currentUrl);
            window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
            break;
            
        case 'whatsapp':
            const whatsappText = encodeURIComponent(shareText + '\n' + currentUrl);
            window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
            break;
            
        case 'linkedin':
            const linkedinUrl = encodeURIComponent(currentUrl);
            const linkedinTitle = encodeURIComponent('Résultats de calcul 4G LTE');
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${linkedinUrl}&title=${linkedinTitle}`, '_blank');
            break;
    }
}

/**
 * Configure les fonctionnalités du tableau
 */
function setupTableFeatures() {
    const table = document.querySelector('.calculations-table');
    if (!table) return;
    
    // Tri des colonnes
    setupTableSorting(table);
    
    // Filtrage
    setupTableFiltering(table);
    
    // Pagination si nécessaire
    setupTablePagination(table);
}

/**
 * Configure le tri du tableau
 * @param {HTMLElement} table - Le tableau à trier
 */
function setupTableSorting(table) {
    const headers = table.querySelectorAll('th');
    
    headers.forEach((header, index) => {
        if (index < headers.length - 1) { // Exclure la colonne Actions
            header.style.cursor = 'pointer';
            header.innerHTML += ' <i class="fas fa-sort sort-icon"></i>';
            
            header.addEventListener('click', function() {
                sortTable(table, index, this);
            });
        }
    });
}

/**
 * Trie le tableau par colonne
 * @param {HTMLElement} table - Le tableau
 * @param {number} columnIndex - Index de la colonne
 * @param {HTMLElement} header - En-tête cliqué
 */
function sortTable(table, columnIndex, header) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Déterminer le sens du tri
    const isAscending = !header.classList.contains('sort-asc');
    
    // Nettoyer les autres en-têtes
    table.querySelectorAll('th').forEach(h => {
        h.classList.remove('sort-asc', 'sort-desc');
        const icon = h.querySelector('.sort-icon');
        if (icon) {
            icon.className = 'fas fa-sort sort-icon';
        }
    });
    
    // Marquer l'en-tête actuel
    header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
    const icon = header.querySelector('.sort-icon');
    if (icon) {
        icon.className = `fas fa-sort-${isAscending ? 'up' : 'down'} sort-icon`;
    }
    
    // Trier les lignes
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        
        // Tenter de convertir en nombre pour tri numérique
        const aNum = parseFloat(aText);
        const bNum = parseFloat(bText);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        } else {
            return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        }
    });
    
    // Réinsérer les lignes triées
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

/**
 * Configure le filtrage du tableau
 * @param {HTMLElement} table - Le tableau à filtrer
 */
function setupTableFiltering(table) {
    // Ajouter un champ de recherche
    const searchContainer = document.createElement('div');
    searchContainer.className = 'table-search';
    searchContainer.innerHTML = `
        <div class="search-input-group">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Rechercher dans l'historique..." id="table-search">
            <button type="button" id="clear-search" style="display: none;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    table.parentNode.insertBefore(searchContainer, table);
    
    const searchInput = document.getElementById('table-search');
    const clearButton = document.getElementById('clear-search');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        filterTableRows(table, query);
        
        clearButton.style.display = query ? 'block' : 'none';
    });
    
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        filterTableRows(table, '');
        this.style.display = 'none';
        searchInput.focus();
    });
}

/**
 * Filtre les lignes du tableau
 * @param {HTMLElement} table - Le tableau
 * @param {string} query - La requête de recherche
 */
function filterTableRows(table, query) {
    const rows = table.querySelectorAll('tbody tr');
    let visibleRows = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
            row.style.display = '';
            visibleRows++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Afficher un message si aucun résultat
    showSearchResults(table, visibleRows, query);
}

/**
 * Affiche les résultats de recherche
 * @param {HTMLElement} table - Le tableau
 * @param {number} count - Nombre de résultats
 * @param {string} query - La requête
 */
function showSearchResults(table, count, query) {
    // Supprimer le message précédent
    const existingMessage = table.parentNode.querySelector('.search-results');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (query && count === 0) {
        const message = document.createElement('div');
        message.className = 'search-results empty-results';
        message.innerHTML = `
            <i class="fas fa-search"></i>
            <p>Aucun résultat trouvé pour "${query}"</p>
        `;
        table.parentNode.insertBefore(message, table.nextSibling);
    } else if (query && count > 0) {
        const message = document.createElement('div');
        message.className = 'search-results';
        message.innerHTML = `
            <p>${count} résultat${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''} pour "${query}"</p>
        `;
        table.parentNode.insertBefore(message, table.nextSibling);
    }
}

/**
 * Configure la pagination du tableau
 * @param {HTMLElement} table - Le tableau
 */
function setupTablePagination(table) {
    const rows = table.querySelectorAll('tbody tr');
    if (rows.length <= 10) return; // Pas besoin de pagination pour moins de 10 lignes
    
    const rowsPerPage = 10;
    let currentPage = 1;
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    
    // Créer les contrôles de pagination
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'table-pagination';
    
    function updatePagination() {
        paginationContainer.innerHTML = `
            <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
            <span>Page ${currentPage} sur ${totalPages}</span>
            <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        // Afficher/masquer les lignes
        rows.forEach((row, index) => {
            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            row.style.display = (index >= start && index < end) ? '' : 'none';
        });
    }
    
    window.changePage = function(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            updatePagination();
        }
    };
    
    table.parentNode.appendChild(paginationContainer);
    updatePagination();
}

/**
 * Initialise les tooltips
 */
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            showTooltip(e.target, e.target.title);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

/**
 * Affiche un tooltip
 * @param {HTMLElement} element - L'élément cible
 * @param {string} text - Le texte du tooltip
 */
function showTooltip(element, text) {
    if (!text) return;
    
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
        max-width: 250px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(tooltip);
    
    // Positionner le tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.bottom + 8) + 'px';
    
    // Animer l'apparition
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
    
    // Stocker la référence pour pouvoir le supprimer
    element._tooltip = tooltip;
}

/**
 * Cache le tooltip
 */
function hideTooltip() {
    const tooltips = document.querySelectorAll('.custom-tooltip');
    tooltips.forEach(tooltip => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(tooltip)) {
                document.body.removeChild(tooltip);
            }
        }, 200);
    });
}

/**
 * Configure les graphiques de résultats
 */
function setupResultCharts() {
    // Ici tu peux ajouter des graphiques avec Chart.js ou similaire
    createComparisonChart();
}

/**
 * Crée un graphique de comparaison simple
 */
function createComparisonChart() {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    chartContainer.innerHTML = `
        <h3><i class="fas fa-chart-bar"></i> Répartition des débits</h3>
        <div class="simple-chart" id="throughput-chart"></div>
    `;
    
    // Insérer le graphique après les résultats
    const resultsGrid = document.querySelector('.results-grid');
    if (resultsGrid) {
        resultsGrid.parentNode.insertBefore(chartContainer, resultsGrid.nextSibling);
        
        // Créer un graphique simple en barres
        createSimpleBarChart();
    }
}

/**
 * Crée un graphique en barres simple
 */
function createSimpleBarChart() {
    const chartElement = document.getElementById('throughput-chart');
    if (!chartElement) return;
    
    // Récupérer les valeurs des résultats
    const values = Array.from(document.querySelectorAll('.result-card')).map(card => {
        const title = card.querySelector('h3').textContent;
        const valueText = card.querySelector('.result-value').textContent;
        const value = parseFloat(valueText.match(/(\d+\.?\d*)/)?.[1] || 0);
        return { title, value };
    }).filter(item => item.title.includes('Throughput'));
    
    if (values.length === 0) return;
    
    const maxValue = Math.max(...values.map(v => v.value));
    
    chartElement.innerHTML = values.map(item => `
        <div class="chart-bar">
            <div class="bar-label">${item.title}</div>
            <div class="bar-container">
                <div class="bar-fill" style="width: ${(item.value / maxValue) * 100}%"></div>
                <span class="bar-value">${item.value.toFixed(2)} Mbps</span>
            </div>
        </div>
    `).join('');
}

/**
 * Vérifie s'il y a de nouveaux résultats
 */
function checkForNewResults() {
    // Vérifier les paramètres URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('new') === '1') {
        showNotification('Nouveaux résultats calculés avec succès!', 'success');
        
        // Nettoyer l'URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        // Mettre en évidence les nouveaux résultats
        highlightNewResults();
    }
}

/**
 * Met en évidence les nouveaux résultats
 */
function highlightNewResults() {
    const resultCards = document.querySelectorAll('.result-card');
    
    resultCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.background = 'linear-gradient(135deg, #f0f9ff, #e0f2fe)';
            card.style.borderColor = 'var(--primary-color)';
            card.style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 500);
        }, index * 200);
    });
}

/**
 * Affiche un indicateur de chargement
 * @param {string} message - Le message à afficher
 */
function showLoadingIndicator(message) {
    const indicator = document.createElement('div');
    indicator.id = 'loading-indicator';
    indicator.innerHTML = `
        <div class="loading-content">
            <i class="fas fa-spinner fa-spin"></i>
            <p>${message}</p>
        </div>
    `;
    
    indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    document.body.appendChild(indicator);
}

/**
 * Cache l'indicateur de chargement
 */
function hideLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.remove();
    }
}

/**
 * Affiche une notification
 * @param {string} message - Le message
 * @param {string} type - Le type (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type] || 'fa-info-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.querySelector('.notification-close').click();
        }
    }, 5000);
}

// Styles CSS supplémentaires
const additionalStyles = `
    .result-detail-modal {
        max-width: 500px;
    }
    
    .detail-value {
        font-size: 2rem;
        font-weight: bold;
        color: var(--primary-color);
        text-align: center;
        margin-bottom: 1rem;
    }
    
    .detail-description {
        text-align: center;
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
    }
    
    .detail-info p {
        margin-bottom: 1rem;
        line-height: 1.6;
    }
    
    .detail-info ul {
        padding-left: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .detail-info li {
        margin-bottom: 0.5rem;
    }
    
    .share-modal {
        max-width: 450px;
    }
    
    .share-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .share-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        background: var(--surface-color);
        cursor: pointer;
        transition: var(--transition);
    }
    
    .share-option:hover {
        background: var(--background-color);
        border-color: var(--primary-color);
        transform: translateY(-2px);
    }
    
    .share-option i {
        font-size: 1.5rem;
        color: var(--primary-color);
    }
    
    .share-summary {
        background: var(--background-color);
        padding: 1rem;
        border-radius: var(--radius-md);
    }
    
    .share-summary h4 {
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }
    
    #share-text {
        font-family: monospace;
        font-size: 0.875rem;
        white-space: pre-line;
        color: var(--text-secondary);
    }
    
    .table-search {
        margin-bottom: 1rem;
    }
    
    .search-input-group button {
        position: absolute;
        right: 0.5rem;
        background: none;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        color: var(--text-muted);
        border-radius: var(--radius-sm);
    }
    
    .search-input-group button:hover {
        color: var(--text-primary);
        background: var(--background-color);
    }
    
    .search-results {
        text-align: center;
        padding: 1rem;
        color: var(--text-secondary);
        font-size: 0.875rem;
    }
    
    .empty-results {
        color: var(--text-muted);
    }
    
    .empty-results i {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        display: block;
    }
    
    .table-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
        padding: 1rem;
    }
    
    .table-pagination button {
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--border-color);
        background: var(--surface-color);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: var(--transition);
    }
    
    .table-pagination button:hover:not(:disabled) {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
    
    .table-pagination button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .sort-icon {
        margin-left: 0.5rem;
        opacity: 0.5;
        transition: var(--transition);
    }
    
    th:hover .sort-icon {
        opacity: 1;
    }
    
    th.sort-asc .sort-icon,
    th.sort-desc .sort-icon {
        opacity: 1;
        color: var(--primary-color);
    }
    
    .chart-container {
        background: var(--surface-color);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--border-color);
    }
    
    .chart-container h3 {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .simple-chart {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .chart-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .bar-label {
        min-width: 150px;
        font-weight: 500;
        color: var(--text-secondary);
        font-size: 0.875rem;
    }
    
    .bar-container {
        flex: 1;
        position: relative;
        height: 2rem;
        background: var(--background-color);
        border-radius: var(--radius-sm);
        overflow: hidden;
    }
    
    .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
        border-radius: var(--radius-sm);
        transition: width 1s ease-out;
    }
    
    .bar-value {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-primary);
    }
    
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
    
    .loading-content {
        text-align: center;
        color: white;
    }
    
    .loading-content i {
        font-size: 2rem;
        margin-bottom: 1rem;
    }
    
    .loading-content p {
        font-size: 1.125rem;
        margin: 0;
    }
    
    @media (max-width: 768px) {
        .share-options {
            grid-template-columns: 1fr;
        }
        
        .chart-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
        
        .bar-label {
            min-width: auto;
        }
        
        .table-search {
            overflow-x: auto;
        }
        
        .search-input-group {
            max-width: 100%;
        }
    }
`;

// Injecter les styles supplémentaires
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);-group {
        position: relative;
        display: flex;
        align-items: center;
        max-width: 400px;
    }
    
    .search-input-group i {
        position: absolute;
        left: 1rem;
        color: var(--text-muted);
        z-index: 1;
    }
    
    .search-input-group input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 3rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        font-size: 1rem;
    }
    
    .search-input-group button {
        position: absolute;
        right: 0.5rem;
        background: none;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        color: var(--text-muted);
        border-radius: var(--radius-sm);
    }
    
    .search-input// Script pour la page des résultats (results.php)

document.addEventListener('DOMContentLoaded', function() {
    initializeResultsPage();
    setupResultsInteractions();
    setupExportFeatures();
    setupTableFeatures();
    animateResults();
});

/**
 * Initialise la page des résultats
 */
function initializeResultsPage() {
    // Animer les cartes de résultats
    animateResultCards();
    
    // Configurer les graphiques si nécessaire
    setupResultCharts();
    
    // Initialiser les tooltips
    initializeTooltips();
    
    // Vérifier s'il y a des nouveaux résultats
    checkForNewResults();
}

/**
 * Anime les cartes de résultats au chargement
 */
function animateResultCards() {
    const resultCards = document.querySelectorAll('.result-card');
    
    resultCards.forEach((card, index) => {
        // Délai progressif pour chaque carte
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(2rem)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Déclencher l'animation
            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, index * 100);
    });
}

/**
 * Anime les résultats de calcul avec des compteurs
 */
function animateResults() {
    const resultValues = document.querySelectorAll('.result-value');
    
    resultValues.forEach(valueElement => {
        const text = valueElement.textContent;
        const match = text.match(/(\d+\.?\d*)/);
        
        if (match) {
            const finalValue = parseFloat(match[1]);
            const unit = text.replace(match[1], '').trim();
            
            animateCounter(valueElement, 0, finalValue, 1500, unit);
        }
    });
}

/**
 * Anime un compteur de valeur
 * @param {HTMLElement} element - L'élément à animer
 * @param {number} start - Valeur de départ
 * @param {number} end - Valeur finale
 * @param {number} duration - Durée en millisecondes
 * @param {string} unit - Unité à afficher
 */
function animateCounter(element, start, end, duration, unit = '') {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Fonction d'easing
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = start + (end - start) * easeOutCubic;
        
        // Formater la valeur selon le type
        let formattedValue;
        if (unit.includes('%')) {
            formattedValue = currentValue.toFixed(1);
        } else {
            formattedValue = currentValue.toFixed(2);
        }
        
        element.innerHTML = `${formattedValue} <span>${unit}</span>`;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/**
 * Configure les interactions de la page des résultats
 */
function setupResultsInteractions() {
    // Effets hover sur les cartes de résultats
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
            this.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
        
        // Effet de clic
        card.addEventListener('click', function() {
            showResultDetail(this);
        });
    });
    
    // Animation sur les étapes de formules
    const formulaSteps = document.querySelectorAll('.formula-step');
    formulaSteps.forEach((step, index) => {
        step.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--primary-color)';
            this.style.color = 'white';
            this.style.transform = 'scale(1.02)';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.color = '';
            this.style.transform = 'scale(1)';
        });
    });
}

/**
 * Affiche le détail d'un résultat dans une modal
 * @param {HTMLElement} card - La carte de résultat cliquée
 */
function showResultDetail(card) {
    const title = card.querySelector('h3').textContent;
    const value = card.querySelector('.result-value').textContent;
    const description = card.querySelector('.result-description').textContent;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content result-detail-modal">
            <div class="modal-header">
                <h3><i class="fas fa-info-circle"></i> ${title}</h3>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="result-detail">
                    <div class="detail-value">${value}</div>
                    <div class="detail-description">${description}</div>
                    <div class="detail-info">
                        ${getResultExplanation(title)}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary modal-close">
                    <i class="fas fa-check"></i>
                    Compris
                </button>
            </div>
        </div>
    `;
    
    showModal(modal);
}

/**
 * Retourne l'explication détaillée d'un résultat
 * @param {string} title - Le titre du résultat
 * @returns {string} - L'explication HTML
 */
function getResultExplanation(title) {
    const explanations = {
        'Radio MAC Throughput': `
            <p>Le <strong>Radio MAC Throughput</strong> représente le débit théorique maximum au niveau MAC (Medium Access Control) de l'interface radio LTE.</p>
            <p>Cette valeur dépend directement de la bande passante allouée et des conditions de propagation idéales.</p>
            <ul>
                <li>5 MHz → 21.6 Mbps</li>
                <li>10 MHz → 50.7 Mbps</li>
                <li>15 MHz → 74.5 Mbps</li>
                <li>20 MHz → 102.9 Mbps</li>
            </ul>
        `,
        'Radio Payload Throughput': `
            <p>Le <strong>Radio Payload Throughput</strong> correspond au débit de données utiles transmises par l'interface radio.</p>
            <p>Dans notre modèle simplifié, cette valeur est égale au Radio MAC Throughput car nous considérons un scenario optimal.</p>
        `,
        'Transport Throughput': `
            <p>Le <strong>Transport Throughput</strong> représente le débit effectif après application de l'efficacité de transport.</p>
            <p>Il tient compte des pertes liées à:</p>
            <ul>
                <li>La gestion des erreurs</li>
                <li>La retransmission des paquets</li>
                <li>L'overhead de protocole</li>
                <li>Les conditions réelles de propagation</li>
            </ul>
            <p><strong>Formule:</strong> Transport = Radio Payload × Efficacité Transport</p>
        `,
        'Control Plane': `
            <p>Le <strong>Control Plane</strong> représente la bande passante dédiée à la signalisation et au contrôle du réseau.</p>
            <p>Cette valeur correspond à 2% du Transport Throughput et inclut:</p>
            <ul>
                <li>Messages de handover</li>
                <li>Signalisation RRC</li>
                <li>Gestion de la mobilité</li>
                <li>Contrôle de puissance</li>
            </ul>
        `,
        'SS Throughput': `
            <p>Le <strong>SS Throughput</strong> (Subscriber Station) représente le débit final disponible pour l'utilisateur.</p>
            <p>Il inclut le Transport Throughput plus 2% supplémentaires pour l'overhead de session.</p>
            <p><strong>Formule:</strong> SS = Transport × 1.02</p>
            <p>C'est la valeur la plus représentative du débit réel perçu par l'utilisateur final.</p>
        `,
        'Efficacité globale': `
            <p>L'<strong>Efficacité globale</strong> indique le pourcentage du débit radio théorique effectivement disponible pour l'utilisateur.</p>
            <p><strong>Formule:</strong> (SS Throughput / Radio MAC Throughput) × 100</p>
            <p>Une efficacité élevée indique une bonne optimisation du réseau.</p>
        `
    };
    
    return explanations[title] || '<p>Information détaillée non disponible pour ce paramètre.</p>';
}

/**
 * Affiche une modal
 * @param {HTMLElement} modal - L'élément modal à afficher
 */
function showModal(modal) {
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
 * Configure les fonctionnalités d'export
 */
function setupExportFeatures() {
    // Export PDF
    const pdfButton = document.querySelector('button[onclick="exportToPDF()"]');
    if (pdfButton) {
        pdfButton.removeAttribute('onclick');
        pdfButton.addEventListener('click', exportToPDF);
    }
    
    // Export CSV
    setupCSVExport();
    
    // Partage des résultats
    setupShareFeatures();
}

/**
 * Exporte les résultats en PDF
 */
function exportToPDF() {
    // Afficher un indicateur de chargement
    showLoadingIndicator('Génération du PDF en cours...');
    
    // Simuler la génération du PDF
    setTimeout(() => {
        hideLoadingIndicator();
        showNotification('PDF généré avec succès!', 'success');
        
        // Ici tu peux ajouter la logique réelle de génération de PDF
        // Par exemple, utiliser jsPDF ou html2canvas pour capturer le contenu
    }, 2000);
}