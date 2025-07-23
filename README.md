# Telecom Calculator - Application de Calcul de Débit 4G/5G

Une application web moderne développée en PHP, MySQL et JavaScript pour calculer les débits et paramètres de performance des réseaux de télécommunications 4G LTE et 5G NR.

## 🚀 Fonctionnalités

### ✅ Fonctionnalités disponibles
- **Authentification complète** : Inscription, connexion, déconnexion sécurisées
- **Dashboard interactif** : Vue d'ensemble des calculs et statistiques
- **Calculs 4G LTE** : Calcul complet des débits selon les formules standards
- **Interface moderne** : Design responsive et animations fluides
- **Historique des calculs** : Sauvegarde et consultation des calculs précédents
- **Export des résultats** : PDF et CSV
- **Validation en temps réel** : Feedback immédiat sur les formulaires

### 🔄 À venir
- **Calculs 5G NR** : Support complet de la technologie 5G
- **API REST** : Accès programmatique aux fonctionnalités
- **Graphiques avancés** : Visualisation des performances
- **Rapports personnalisés** : Génération de rapports détaillés

## 🏗️ Architecture

### Structure des fichiers
```
telecom_calculator/
├── config.php              # Configuration base de données et sessions
├── signup.php              # Page d'inscription
├── signin.php              # Page de connexion
├── dashboard.php           # Tableau de bord principal
├── parameters.php          # Saisie des paramètres de calcul
├── results.php             # Affichage des résultats
├── logout.php              # Déconnexion
├── css/
│   └── style.css           # Styles CSS modernes
├── js/
│   ├── auth.js            # JavaScript pour l'authentification
│   ├── dashboard.js       # JavaScript pour le dashboard
│   ├── parameters.js      # JavaScript pour les paramètres
│   └── results.js         # JavaScript pour les résultats
└── database/
    └── schema.sql         # Structure de la base de données
```

### Technologies utilisées
- **Backend** : PHP 7.4+ avec PDO
- **Base de données** : MySQL 5.7+
- **Frontend** : HTML5, CSS3 (Variables CSS), JavaScript ES6+
- **Design** : Responsive design, animations CSS
- **Icons** : Font Awesome 6.0
- **Fonts** : Inter (Google Fonts)

## 📊 Formules de Calcul 4G LTE

L'application implémente les formules standards pour le calcul des débits 4G :

### Paramètres d'entrée
- **Fréquence de bande** : 1800, 2100, 2600 MHz
- **Bande passante LTE** : 5, 10, 15, 20 MHz
- **Efficacité transport (TE)** : 0.1 à 1.0 (défaut: 0.95)

### Configuration des bandes passantes
| Bande passante | Radio MAC Throughput |
|----------------|---------------------|
| 5 MHz          | 21.6 Mbps          |
| 10 MHz         | 50.7 Mbps          |
| 15 MHz         | 74.5 Mbps          |
| 20 MHz         | 102.9 Mbps         |

### Formules de calcul
1. **Radio Payload Throughput** = Radio MAC Throughput
2. **Transport Throughput** = Radio Payload Throughput × Transport Efficiency (TE)
3. **Control Plane** = Transport Throughput × 0.02
4. **SS Throughput** = Transport Throughput × 1.02

## ⚙️ Installation

### Prérequis
- Serveur web (Apache/Nginx)
- PHP 7.4 ou supérieur
- MySQL 5.7 ou supérieur
- Extensions PHP : PDO, PDO_MySQL

### Étapes d'installation

1. **Cloner/télécharger les fichiers**
   ```bash
   git clone [repository-url] telecom_calculator
   cd telecom_calculator
   ```

2. **Créer la base de données**
   ```sql
   -- Exécuter le script SQL fourni
   mysql -u root -p < database/schema.sql
   ```

3. **Configurer la connexion**
   ```php
   // Modifier config.php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'telecom_calculator');
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   ```

4. **Configurer le serveur web**
   - Pointer le document root vers le dossier de l'application
   - S'assurer que les réécritures d'URL sont activées
   - Vérifier les permissions des fichiers

5. **Tester l'installation**
   - Accéder à l'application via votre navigateur
   - Créer un compte utilisateur
   - Effectuer un test de calcul 4G

## 💻 Utilisation

### 1. Inscription/Connexion
- Créer un compte avec username, email et mot de passe
- Se connecter avec les identifiants
- Validation en temps réel des formulaires

### 2. Calcul 4G LTE
1. Accéder au dashboard
2. Cliquer sur "Calcul 4G"
3. Sélectionner la fréquence (1800/2100/2600 MHz)
4. Choisir la bande passante (5/10/15/20 MHz)
5. Ajuster l'efficacité transport si nécessaire
6. Visualiser la prévisualisation en temps réel
7. Lancer le calcul

### 3. Consultation des résultats
- Affichage détaillé des résultats
- Explication des formules appliquées
- Export PDF pour impression
- Historique des calculs précédents

## 🔧 Personnalisation

### Thème et couleurs
Les couleurs peuvent être modifiées dans `css/style.css` :
```css
:root {
    --primary-color: #2563eb;    /* Couleur principale */
    --success-color: #10b981;    /* Couleur de succès */
    --error-color: #ef4444;      /* Couleur d'erreur */
    /* ... autres variables */
}
```

### Formules de calcul
Les formules peuvent être ajustées dans `parameters.php` :
```php
// Configuration des bandes passantes LTE
$lte_config = [
    5.0 => 21.6,   // Modifier les valeurs si nécessaire
    10.0 => 50.7,
    15.0 => 74.5,
    20.0 => 102.9
];
```

### Validation des données
Modifier les règles de validation dans `js/parameters.js` et `parameters.php`.

## 🛡️ Sécurité

### Mesures implémentées
- **Hashage des mots de passe** : bcrypt avec salt
- **Requêtes préparées** : Protection contre l'injection SQL
- **Validation côté serveur** : Vérification de toutes les entrées
- **Sessions sécurisées** : Gestion appropriée des sessions PHP
- **Sanitization** : Nettoyage des données d'entrée

### Recommandations supplémentaires
- Utiliser HTTPS en production
- Configurer les headers de sécurité
- Implémenter un système de rate limiting
- Sauvegarder régulièrement la base de données

## 📱 Compatibilité

### Navigateurs supportés
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

### Appareils
- Desktop (1920x1080 et plus)
- Tablette (768px - 1024px)
- Mobile (320px - 767px)

## 🐛 Dépannage

### Problèmes courants

**Erreur de connexion à la base de données**
- Vérifier les paramètres dans `config.php`
- S'assurer que MySQL est démarré
- Vérifier les permissions utilisateur

**Page blanche après connexion**
- Vérifier les erreurs PHP dans les logs
- S'assurer que les sessions sont activées
- Vérifier les permissions des fichiers

**Calculs incorrects**
- Vérifier la configuration des bandes passantes
- Contrôler les formules dans le code
- Tester avec des valeurs connues

## 🤝 Contribution

### Pour contribuer
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de code
- Indentation : 4 espaces
- Commentaires en français
- Nommage des variables en anglais
- Documentation des fonctions

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation technique

## 🔄 Changelog

### Version 1.0.0 (Actuelle)
- ✅ Authentification complète
- ✅ Calculs 4G LTE
- ✅ Interface moderne responsive
- ✅ Export PDF/CSV
- ✅ Historique des calculs

### Version 1.1.0 (Planifiée)
- 🔄 Calculs 5G NR
- 🔄 API REST
- 🔄 Graphiques avancés
- 🔄 Mode sombre

---

**Développé avec ❤️ pour la communauté télécoms**