// Configuration publique de l'application Firebase KS BTP.
// Ces paramètres identifient le projet web ; les règles Firestore protègent les données.
firebase.initializeApp({
  apiKey: "AIzaSyDXtH9kk_mqM25Pd1bESZz-fi-uM0xUzeI",
  authDomain: "ks-bts.firebaseapp.com",
  projectId: "ks-bts",
  storageBucket: "ks-bts.firebasestorage.app",
  messagingSenderId: "647141501929",
  appId: "1:647141501929:web:6dab0370995d15a0477978"
});
window.ksFirebase = {
  auth: firebase.auth(),
  db: firebase.firestore()
};