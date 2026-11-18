# Publier l'environnement de test KS BTP sans toucher à la production

## Règle impérative
Ne pas modifier la source GitHub Pages du dépôt de production `KS-BTS`. Elle doit continuer à publier la branche actuellement utilisée (`main`).

## Pourquoi un dépôt séparé
GitHub Pages publie un site par configuration de dépôt. Basculer la source du dépôt principal vers `develop/phase-1-preparation` risquerait de remplacer le site utilisé actuellement. Le test doit donc avoir son propre dépôt et son propre site HTTPS.

## Préparation déjà disponible
Dans le dépôt principal, branche `develop/phase-1-preparation` :
- `offline-storage.js`
- `offline-storage-test.html`
- `docs/TEST-STOCKAGE-HORS-LIGNE.md`

La page de test ne charge pas `index.html`, `auth.js`, Firebase ni l'application principale. Elle vérifie uniquement IndexedDB et la copie manuelle de la clé locale `ks_btp_v1`.

## Étapes de publication séparée
1. Dans GitHub, créer un nouveau dépôt nommé `KS-BTS-PREVIEW` (public si GitHub Pages gratuit doit le publier).
2. Ne pas choisir de modèle ni importer l'application de production.
3. Dans ce nouveau dépôt, ajouter uniquement les deux fichiers `offline-storage-test.html` et `offline-storage.js) depuis la branche de préparation.
4. Dans le nouveau dépôt uniquement, ouvrir Settings → Pages.
5. Choisir Deploy from a branch, puis la branche `main` et le dossier `/(root)), et enregistrer.
6. Attendre que GitHub Pages affiche l'adresse publiée. L'adresse attendue aura la forme `https://<compte>.github.io/KS-BTS-PREVIEW/`; ne pas la considérer active avant confirmation par GitHub.
7. Ouvrir la page `offline-storage-test.html` à cette adresse sur Android.

## Test Android
- Appuyer sur « Tester IndexedDB ».
- Ne lancer la copie que si l'appareil contient bien les données locales KS BTP à préserver.
- La page de prévisualisation hébergée sur un autre dépôt a une origine de stockage différente : elle ne peut pas lire automatiquement le localStorage du site de production. Pour cette raison, le test IndexedDB doit d'abord être effectué sans copier les données de production.
- Pour tester une migration réelle, il faudra concevoir une procédure d'export/import JSON explicite et contrôlée. Ne pas essayer de contourner l'isolation des origines.

## Important sur les données locales
Le stockage local d'un site est isolé par origine (domaine). La page de prévisualisation séparée ne verra donc pas la clé `ks_btp_v1` créée sur le site de production. Le bouton de copie ne doit être utilisé sur la prévisualisation que si des données de test existent sur cette même origine.

## Critères de sécurité
- Le dépôt et l'URL de prévisualisation sont indépendants.
- Le dépôt principal garde sa configuration Pages et sa branche de production.
- Aucune donnée de production n'est migrée pendant ce test technique.
- Aucun changement à Firebase Auth, Firestore ou Supabase.
