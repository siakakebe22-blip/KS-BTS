# KS BTP — Plan de vérification du stockage hors connexion

## Objectif
Vérifier séparément la disponibilité d'IndexedDB sur Android avant toute intégration dans l'application KS BTP.

## Périmètre de sécurité
- Les essais restent sur la branche `develop/phase-1-preparation`.
- La branche `main` et l'application publiée ne sont pas modifiées.
- Le module `offline-storage.js` n'est pas chargé par `index.html`.
- Aucune règle Firestore, aucun compte Firebase et aucun projet Supabase ne sont modifiés.
- La copie de `ks_btp_v1` vers IndexedDB est manuelle et ne supprime pas la donnée source.

## Vérifications à effectuer sur un environnement de prévisualisation isolé
1. Ouvrir la page de test depuis une URL HTTPS distincte de la production.
2. Appuyer sur **Tester IndexedDB** : le résultat attendu est « SUCCÈS ».
3. Appuyer sur **Lire la copie préparée** : avant migration, le résultat attendu peut être « Aucune copie préparée ».
4. Si l'appareil contient les données locales KS BTP, appuyer sur **Copier les données locales vers IndexedDB**, puis confirmer.
5. Vérifier les nombres de matériels, chantiers, mouvements et bons affichés.
6. Appuyer de nouveau sur **Lire la copie préparée** et vérifier que les données sont retrouvées.
7. Fermer puis rouvrir la page et refaire la lecture pour confirmer la persistance.

## Critères d'acceptation
- IndexedDB est accessible en HTTPS sur le navigateur Android.
- La copie est relisible après rechargement.
- Les données source dans localStorage restent intactes.
- Aucun changement n'apparaît dans l'application de production.

## Limite actuelle
La page de test est présente dans la branche de développement mais n'est pas encore publiée. Ne pas utiliser l'URL de production pour ce test. Il faut d'abord créer un hébergement de prévisualisation réellement indépendant, sans changer la configuration GitHub Pages de production.

## Étape suivante
Après validation sur téléphone, concevoir la sauvegarde automatique locale et les règles de synchronisation, puis seulement préparer une intégration contrôlée dans l'application.
