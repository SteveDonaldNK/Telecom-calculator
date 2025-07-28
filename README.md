# OptiLink - Application d'Optimisation des Liaisons Télécoms

Une application web moderne développée en PHP, MySQL et JavaScript pour dimensionner et optimiser les liaisons de télécommunications S1 et NG (Next Generation).

## 🚀 Fonctionnalités

### ✅ Fonctionnalités disponibles
- **Authentification complète** : Inscription, connexion, déconnexion sécurisées
- **Dashboard interactif** : Vue d'ensemble des dimensionnements et interface moderne
- **Dimensionnement S1** : Calcul complet des débits avec Extension Ratio
- **Interface moderne** : Design responsive avec animations et fonds attractifs
- **Historique des traitements** : Sauvegarde et consultation des dimensionnements précédents
- **Export des résultats** : PDF et CSV
- **Écran de démarrage** : Splash screen avec logo OptiLink

### 🔄 À venir
- **Dimensionnement NG** : Support complet de la technologie Next Generation
- **API REST** : Accès programmatique aux fonctionnalités
- **Graphiques avancés** : Visualisation des performances
- **Rapports personnalisés** : Génération de rapports détaillés

## 🏗️ Architecture

### Structure des fichiers
```
optilink/
├── index.php              # Page d'accueil
├── splash.php             # Écran de démarrage
├── about.php              # Page à propos
├── check_session.php       # Vérification de session
├── config.php              # Configuration base de données et sessions
├── signup.php              # Page d'inscription
├── signin.php              # Page de connexion
├── dashboard.php           # Tableau de bord principal
├── parameters.php          # Saisie des paramètres de dimensionnement
├── results.php             # Affichage des résultats
├── logout.php              # Déconnexion
├── css/
│   └── style.css           # Styles CSS modernes avec thème OptiLink
├── js/
│   ├── auth.js            # JavaScript pour l'authentification
│   ├── dashboard.js       # JavaScript pour le dashboard
│   ├── parameters.js      # JavaScript pour les paramètres
│   └── results.js         # JavaScript pour les résultats
└── database/
    └── schema.sql         # Structure de la base de données
```

## 📊 Formules de Dimensionnement S1

L'application implémente les formules standards pour le dimensionnement S1 :

### Paramètres d'entrée
- **Bande de fréquence** : 1800, 2100, 2600 MHz
- **Largeur de spectre** : 5, 10, 15, 20 MHz
- **Extension Ratio (ER)** : 1.16 (valeur fixe)

### Configuration des largeurs de spectre (valeurs corrigées)
| Largeur de spectre | Radio MAC Throughput |
|-------------------|---------------------|
| 5 MHz             | 24.6 Mbps          |
| 10 MHz            | 50.7 Mbps          |
| 15 MHz            | 76.5 Mbps          |
| 20 MHz            | 102.9 Mbps         |

### Formules de calcul
1. **Radio Payload Throughput** = Radio MAC Throughput
2. **Transport Throughput** = Radio Payload Throughput × Extension Ratio (1.16)
3. **Control Plane** = Transport Throughput × 0.02
4. **S1 Throughput** = Transport Throughput × 1.02

## ⚙️ Installation

### Prérequis
- Serveur web (Apache/Nginx)
- PHP 7.4 ou supérieur
- MySQL 5.7 ou supérieur
- Extensions PHP : PDO, PDO_MySQL

### Étapes d'installation

1. **Cloner/télécharger les fichiers**
   ```bash
   git clone [repository-url] optilink
   cd optilink
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
   define('DB_NAME', 'optilink');
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   ```

4. **Configurer le serveur web**
   - Pointer le document root vers le dossier de l'application
   - S'assurer que les réécritures d'URL sont activées
   - Vérifier les permissions des fichiers

5. **Tester l'installation**
   - Accéder à l'application via votre navigateur
   - Voir l'écran de démarrage OptiLink
   - Créer un compte utilisateur
   - Effectuer un test de dimensionnement S1

## 💻 Utilisation

### 1. Démarrage
- Accéder à `index.php` pour l'écran d'accueil
- Cliquer sur "Démarrer l'application" pour voir le splash screen
- Redirection automatique vers connexion ou dashboard

### 2. Inscription/Connexion
- Créer un compte avec username, email et mot de passe
- Se connecter avec les identifiants
- Validation en temps réel des formulaires

### 3. Dimensionnement S1
1. Accéder au dashboard
2. Cliquer sur "Dimensionnement S1"
3. Sélectionner la bande de fréquence (1800/2100/2600 MHz)
4. Choisir la largeur de spectre (5/10/15/20 MHz)
5. Extension Ratio fixé à 1.16
6. Lancer le dimensionnement

### 4. Consultation des résultats
- Affichage détaillé des résultats
- Export PDF pour impression
- Historique des dimensionnements précédents

## 🎨 Design et Interface

### Nouveau thème OptiLink
- **Nom de l'application** : OptiLink (au lieu de Telecom Calculator)
- **Écran de démarrage** : Splash screen avec logo et animation
- **Interface moderne** : Fonds attractifs avec motifs télécoms
- **Terminologie mise à jour** :
  - "Dimensionnement S1" au lieu de "Calcul 4G"
  - "Dimensionnement NG" au lieu de "Calcul 5G"
  - "Bande de fréquence" au lieu de "Fréquence de bande"
  - "Largeur de spectre" au lieu de "Bande passante LTE"
  - "Extension Ratio (ER)" au lieu de "Efficacité de transport"
  - "S1 Throughput" au lieu de "SS Throughput"
  - "Traitements récents" au lieu de "Calculs récents"

### Améliorations visuelles
- Suppression des sections Statistiques et Technologies
- Suppression des débits entre parenthèses
- Suppression des formules détaillées et aperçus
- Fond bleu remplacé par des images attractives
- Icônes flottantes télécoms
- Animations et effets visuels modernes

## 🔧 Personnalisation

### Configuration des valeurs corrigées
```php
// Configuration mise à jour dans parameters.php
$lte_config = [
    5.0 => 24.6,   // Corrigé de 21.6 à 24.6
    10.0 => 50.7,
    15.0 => 76.5,  // Corrigé de 74.5 à 76.5
    20.0 => 102.9
];
```

### Extension Ratio fixe
```php
$extension_ratio = 1.16; // Valeur fixe remplaçant l'efficacité de transport variable
```

## 🚀 Nouvelles fonctionnalités

### Écran de démarrage
- Animation du logo OptiLink
- Icônes télécoms flottantes
- Redirection automatique selon l'état de connexion
- Design moderne avec effets visuels

### Dashboard amélioré
- Interface plus attractive avec images de fond
- Terminologie mise à jour
- Suppression des sections non demandées
- Focus sur les dimensionnements S1/NG

### Page d'accueil
- Présentation professionnelle d'OptiLink
- Navigation vers l'application et page à propos
- Design cohérent avec le thème général

## 📄 Changelog

### Version 2.0.0 (OptiLink)
- ✅ Rebranding complet vers OptiLink
- ✅ Écran de démarrage avec logo
- ✅ Terminologie mise à jour (S1/NG)
- ✅ Valeurs corrigées (24.6 et 76.5 Mbps)
- ✅ Extension Ratio fixe (1.16)
- ✅ Interface redessinée avec fonds attractifs
- ✅ Suppression des sections non demandées
- ✅ Page d'accueil et à propos

### Version 1.0.0 (Telecom Calculator)
- ✅ Version initiale avec calculs 4G/5G

---

**OptiLink - Optimisation des liaisons télécoms** < database/schema.sql
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