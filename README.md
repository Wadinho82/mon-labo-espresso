
# Mon Labo Espresso : Guide d'Installation Locale (Windows / Visual Studio Code)

Ce guide vous expliquera, pas à pas et simplement, comment configurer et exécuter l'application "Mon Labo Espresso" sur votre ordinateur Windows, en utilisant Visual Studio Code (VS Code) comme votre outil principal.

## Table des Matières

1.  [Prérequis](#1-prérequis)
2.  [Étape 1 : Téléchargement et Organisation des Fichiers](#2-étape-1--téléchargement-et-organisation-des-fichiers)
3.  [Étape 2 : Initialisation du Projet et Installation des Dépendances](#3-étape-2--initialisation-du-projet-et-installation-des-dépendances)
4.  [Étape 3 : Configuration de TypeScript (`tsconfig.json`)](#4-étape-3--configuration-de-typescript-tsconfigjson)
5.  [Étape 4 : Compilation du Code (`npx tsc`)](#5-étape-4--compilation-du-code-npx-tsc)
6.  [Étape 5 : Démarrage du Serveur Local (`npx serve`)](#6-étape-5--démarrage-du-serveur-local-npx-serve)
7.  [Étape 6 : Accès à l'Application](#7-étape-6--accès-à-lapplication)
8.  [Notes Importantes et Dépannage](#8-notes-importantes-et-dépannage)

---

## 1. Prérequis

Avant de commencer, assurez-vous d'avoir ces deux choses installées sur votre ordinateur :

*   **Node.js** (qui inclut `npm`, un outil pour gérer les programmes JavaScript) :
    *   **Comment l'obtenir ?** Allez sur le site officiel : [https://nodejs.org/](https://nodejs.org/).
    *   Téléchargez et installez la version "LTS" (Recommandée pour la plupart des utilisateurs). Suivez les étapes d'installation, c'est généralement juste "Suivant", "Suivant", "Installer".
*   **Visual Studio Code (VS Code)** : C'est un excellent programme pour écrire du code.
    *   **Comment l'obtenir ?** Allez sur le site officiel : [https://code.visualstudio.com/](https://code.visualstudio.com/).
    *   Téléchargez et installez-le.

## 2. Étape 1 : Téléchargement et Organisation des Fichiers

C'est comme ranger vos affaires dans des dossiers pour que tout soit bien organisé.

1.  **Créez un dossier principal pour votre projet.**
    *   Sur votre bureau ou dans vos "Documents", créez un nouveau dossier.
    *   Nommez-le, par exemple, `mon-labo-espresso`. C'est là que tous les fichiers de l'application vont vivre.

2.  **Organisez les fichiers.**
    *   Copiez-collez **tous les fichiers** que je vous ai fournis (ceux du début de cette conversation : `index.tsx`, `metadata.json`, `index.html`, `types.ts`, `services/localStorageService.ts`, `components/Button.tsx`, `components/ExtractionForm.tsx`, `components/ExtractionList.tsx`, `App.tsx`, `components/EspressoChart.tsx`, et ce `README.md` mis à jour) dans ce nouveau dossier `mon-labo-espresso` comme ceci :
        *   Placez `index.html`, `metadata.json`, `package.json` (si déjà créé), `tsconfig.json` (si déjà créé) et ce `README.md` **directement dans le dossier `mon-labo-espresso`**.
        *   Créez un **nouveau sous-dossier** à l'intérieur de `mon-labo-espresso` et nommez-le `src`.
        *   Déplacez **tous les autres fichiers et dossiers** ( `App.tsx`, `index.tsx`, `types.ts`, le dossier `components/`, et le dossier `services/`) **dans ce nouveau dossier `src`**.
        *   **TRÈS IMPORTANT :** Si vous trouvez un fichier nommé `vite.config.ts` quelque part (dans `src` ou à la racine de `mon-labo-espresso`), **SUPPRIMEZ-LE**. Il n'est pas nécessaire pour notre méthode et peut créer des erreurs.

    Votre dossier devrait maintenant ressembler à ceci :

    ```
    mon-labo-espresso/  <-- Votre dossier principal
    ├── index.html
    ├── metadata.json
    ├── package.json    <-- Sera créé à l'étape 3
    ├── tsconfig.json   <-- Sera créé à l'étape 4
    ├── README.md
    ├── src/            <-- Le dossier "source"
    │   ├── App.tsx
    │   ├── index.tsx
    │   ├── types.ts
    │   ├── components/
    │   │   ├── Button.tsx
    │   │   ├── EspressoChart.tsx
    │   │   ├── ExtractionForm.tsx
    │   │   └── ExtractionList.tsx
    │   └── services/
    │       └── localStorageService.ts
    ```

## 3. Étape 2 : Initialisation du Projet et Installation des Dépendances

Ici, nous allons dire à votre ordinateur que ce dossier est un "projet" et installer les petits programmes (dépendances) dont l'application a besoin pour fonctionner.

1.  **Ouvrez Visual Studio Code.**
    *   Lancez VS Code.

2.  **Ouvrez votre dossier de projet dans VS Code.**
    *   Dans VS Code, allez dans le menu en haut : `Fichier` > `Ouvrir un dossier...`.
    *   Sélectionnez votre dossier `mon-labo-espresso` et cliquez sur "Sélectionner le dossier".
    *   Vous verrez maintenant tous vos fichiers dans la colonne de gauche de VS Code.

3.  **Ouvrez le terminal intégré de VS Code.**
    *   Allez dans le menu en haut : `Terminal` > `Nouveau Terminal`.
    *   Un panneau noir s'ouvrira en bas de votre fenêtre VS Code. C'est votre ligne de commande, mais directement dans votre projet.
    *   **Vérification :** Vous devriez voir une ligne qui ressemble à `PS C:\chemin\vers\mon-labo-espresso>` ou juste `mon-labo-espresso>`. Cela signifie que le terminal est déjà dans le bon dossier !

4.  **Initialisez un projet Node.js/npm.**
    *   **Qu'est-ce que cela fait ?** Cela crée un fichier `package.json`. C'est un peu comme une "carte d'identité" pour votre projet qui liste son nom, sa version, et surtout, les programmes supplémentaires dont il a besoin.
    *   **Dans le terminal de VS Code**, tapez cette commande et appuyez sur `Entrée` :
        ```bash
        npm init -y
        ```
    *   **Résultat :** Un nouveau fichier nommé `package.json` apparaîtra dans votre dossier `mon-labo-espresso`.

5.  **Installez les programmes nécessaires (dépendances).**
    *   **Qu'est-ce que cela fait ?** L'application est écrite en "TypeScript" (fichiers `.tsx`). Les navigateurs ne comprennent que le "JavaScript". Nous avons besoin de programmes pour traduire le TypeScript en JavaScript, pour faire fonctionner React (la technologie de l'interface), et pour créer un petit serveur web temporaire.
    *   **Dans le MÊME terminal de VS Code**, tapez cette commande **complète** et appuyez sur `Entrée` :
        ```bash
        npm install react react-dom typescript @types/react @types/react-dom serve @types/node recharts --save-dev
        ```
    *   **Soyez patient !** Cette commande télécharge et installe de nombreux fichiers. Cela peut prendre quelques instants.
    *   **Résultat :** Un nouveau dossier appelé `node_modules` (qui contient beaucoup de petits programmes) apparaîtra. Le fichier `package.json` sera aussi mis à jour pour lister tous ces programmes.

## 4. Étape 3 : Configuration de TypeScript (`tsconfig.json`)

TypeScript a besoin de savoir comment il doit travailler. On va lui donner des instructions.

1.  **Créez le fichier `tsconfig.json`.**
    *   Dans VS Code, dans la colonne de gauche où vous voyez vos fichiers, faites un clic droit sur le dossier `mon-labo-espresso` (pas `src`, mais le dossier racine).
    *   Sélectionnez `Nouveau fichier`.
    *   Nommez le nouveau fichier `tsconfig.json` et appuyez sur `Entrée`.

2.  **Copiez-collez le contenu suivant** **EN ENTIER** dans ce nouveau fichier `tsconfig.json` :

    ```json
    {
      "compilerOptions": {
        "target": "es2020",
        "module": "es2020",
        "jsx": "react",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "outDir": "./dist",
        "rootDir": "./src",
        "allowSyntheticDefaultImports": true,
        "moduleResolution": "node"
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules", "dist"]
    }
    ```
    *   **Sauvegardez le fichier** : Appuyez sur `Ctrl + S` (ou `Fichier` > `Enregistrer`).

## 5. Étape 4 : Compilation du Code (`npx tsc`)

Maintenant, nous allons traduire le code TypeScript en JavaScript, pour que le navigateur puisse le comprendre.

1.  **Dans votre terminal VS Code** (celui qui est ouvert en bas), tapez cette commande et appuyez sur `Entrée` :
    ```bash
    npx tsc
    ```
    *   **Qu'est-ce que cela fait ?** `tsc` est le compilateur TypeScript. Il va lire vos fichiers `src/*.tsx` et, en suivant les instructions de `tsconfig.json`, il va créer des fichiers `*.js` équivalents.
    *   **Résultat :** Un nouveau dossier nommé `dist` (pour "distribution") apparaîtra dans votre dossier `mon-labo-espresso`. Ce dossier `dist` contient la version de votre application prête à être lancée.
    *   **Si vous voyez des erreurs :** Relisez bien les étapes précédentes, surtout l'installation des dépendances (`npm install`) et le contenu du fichier `tsconfig.json`.

## 6. Étape 5 : Démarrage du Serveur Local (`npx serve`)

Tout est prêt ! Nous allons maintenant lancer le petit serveur qui va afficher l'application.

1.  **Dans votre terminal VS Code** (celui qui est ouvert en bas), tapez cette commande et appuyez sur `Entrée` :
    ```bash
    npx serve
    ```
    *   **Qu'est-ce que cela fait ?** `serve` est le petit programme qui va créer un serveur web temporaire sur votre ordinateur. Il va chercher les fichiers de l'application (dans le dossier `dist` et `index.html`) et les rendre disponibles pour votre navigateur.
    *   **Résultat attendu :** Le terminal affichera un message qui ressemblera à ceci :
        ```
        INFO  Accepting connections at:
        - Local:   http://localhost:5000
        - Network: http://192.168.1.XX:5000 (votre adresse IP locale)
        ```
        L'adresse qui nous intéresse est la ligne **`http://localhost:5000`** (le numéro après le `:` peut être 3000, 8000 ou autre, c'est normal).
    *   **Laissez ce terminal ouvert !** Le serveur tourne dans ce terminal. Si vous le fermez, l'application s'arrêtera.

## 7. Étape 6 : Accès à l'Application

La dernière ligne droite !

1.  **Ouvrez votre navigateur web préféré** (Chrome, Firefox, Edge).
2.  **Ouvrez une nouvelle fenêtre de navigation privée/incognito** (c'est le meilleur moyen de s'assurer qu'aucun ancien cache ne pose problème).
3.  **Dans la barre d'adresse de votre navigateur**, tapez ou copiez-collez l'adresse locale que le terminal de VS Code vous a donnée (par exemple, **`http://localhost:5000`**).
4.  Appuyez sur `Entrée`.

Votre application "Mon Labo Espresso" devrait maintenant apparaître dans votre navigateur !

## 8. Notes Importantes et Dépannage

*   **Vos données sont locales** : Toutes les extractions que vous ajoutez sont sauvegardées **uniquement sur votre ordinateur, dans ce navigateur**. Si vous ouvrez l'application sur un autre navigateur ou un autre ordinateur, les données ne seront pas là.
*   **Les photos/vidéos peuvent être lourdes** : Si vous ajoutez des photos ou vidéos, elles sont sauvegardées dans votre navigateur. Cela a des limites de taille (souvent 5-10 Mo). Les vidéos, surtout, peuvent vite dépasser cette limite et empêcher la sauvegarde. L'application essaie de vous prévenir.
*   **Si vous modifiez le code** : Si un jour vous voulez changer quelque chose dans les fichiers `.tsx`, vous devrez :
    1.  Sauvegarder vos changements dans VS Code (`Ctrl + S`).
    2.  Retourner dans le terminal VS Code et relancer la compilation : `npx tsc`.
    3.  Retourner dans votre navigateur et rafraîchir la page (`F5` ou `Ctrl + R`).
*   **Dépannage pour les erreurs de compilation** : Si, après avoir tout suivi, vous avez encore des erreurs `TS` lors de `npx tsc`, c'est souvent un problème d'installation ou de configuration.
    1.  **Relancez l'installation des dépendances** (cela ne fait jamais de mal) : Dans votre terminal VS Code, tapez et appuyez sur `Entrée` :
        ```bash
        npm install react react-dom typescript @types/react @types/react-dom serve @types/node recharts --save-dev
        ```
    2.  **Relancez la compilation** après l'installation : `npx tsc`.
    3.  **Vérifiez `tsconfig.json`** : Ouvrez-le et assurez-vous qu'il contient **exactement** le contenu de l'étape 4, sans aucune erreur de frappe.

Félicitations ! Vous avez réussi à lancer votre application web localement. Profitez bien de vos extractions optimisées !
