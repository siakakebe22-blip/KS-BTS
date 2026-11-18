# KS BTP — Phase 1 : préparation technique

## Objectif
Préparer l'évolution de KS BTP vers une application multi-entreprises, utilisable en ligne et hors connexion, sans modifier la version de production.

## Périmètre et sécurité
- Branche de travail : `develop/phase-1-preparation`.
- Branche de production : `main` — ne pas modifier pendant cette phase.
- Application publiée : GitHub Pages depuis `main`.
- Ne pas modifier ni supprimer les projets Supabase existants.
- Ne pas remplacer les règles Firestore par des règles ouvertes.
- Toute évolution doit être testée sur la branche de développement avant proposition de fusion.

## État technique constaté
- Authentification : Firebase Authentication (email/mot de passe).
- Profils : collection Firestore `users/{uid}`, avec rôle et statut actif.
- Données métier actuelles : stockage navigateur via localStorage, clé `ks_btp_v1`.
- Données locales : matériels, chantiers, mouvements, bons, maintenance et paramètres.
- Service worker : met en cache les fichiers de l'application ; il ne synchronise pas les données métier.
- La connexion et la vérification du profil exigent actuellement un accès réseau.
- Les règles Firestore actuelles bloquent les collections métier : ne pas écrire dans celles-ci avant la conception et la validation des règles multi-entreprises.

## Architecture cible proposée
1. **Identité et entreprise** : Firebase Auth pour l'identité ; profil utilisateur lié à un `companyId`.
2. **Données métier cloud** : collections cloisonnées par entreprise, par exemple `companies/{companyId}/materials`, `sites`, `movements`, `documents` et `maintenance`.
3. **Stockage hors connexion** : IndexedDB comme base locale structurée. Ne pas utiliser localStorage comme moteur de synchronisation.
4. **File d'attente de synchronisation** : journal local des opérations avec identifiant unique, utilisateur, entreprise, date et statut de synchronisation.
5. **Synchronisation** : envoi idempotent, reprise après coupure, détection des conflits et journal d'audit.
6. **Sécurité** : règles Firestore vérifiant l'identité, l'entreprise, le rôle et les droits sur chaque document. Les contrôles d'interface seuls ne sont jamais suffisants.

## Migration des données existantes
- Conserver la clé locale `ks_btp_v1` et lire les données existantes sans les effacer.
- Prévoir une migration contrôlée de localStorage vers IndexedDB.
- Faire une copie de sauvegarde avant toute migration.
- Ne jamais vider les données locales après un échec de migration ou de synchronisation.
- Prévoir un mécanisme d'export et de restauration vérifié.

## Essai commercial de 14 jours
La durée d'essai devra être calculée et validée côté serveur ou via une source de confiance, et non à partir de l'horloge du téléphone. Les dates de début, de fin, le statut et l'entreprise devront être conservés dans les données commerciales protégées. Aucun blocage commercial ne doit être activé dans cette phase préparatoire.

## Ordre de réalisation
1. Valider le modèle entreprise/utilisateur et les rôles.
2. Définir le schéma Firestore et les règles de sécurité multi-entreprises.
3. Développer le stockage IndexedDB en lecture/écriture locale.
4. Ajouter une file de synchronisation et les mécanismes de reprise.
5. Tester hors connexion, reconnexion, doublons, conflits et isolation entre entreprises.
6. Migrer progressivement les données existantes avec sauvegarde et retour arrière.

## Critères avant toute mise en production
- Tests de non-régression de toutes les pages actuelles.
- Test de sauvegarde et de restauration JSON.
- Test hors connexion après une première connexion en ligne.
- Test de synchronisation sans doublons après plusieurs coupures réseau.
- Test prouvant qu'un utilisateur d'une entreprise ne peut lire ni modifier les données d'une autre.
- Relecture des règles Firestore avant publication.
- Validation explicite avant fusion vers `main`.
