(() => {
  const auth = window.ksFirebase.auth;
  const store = window.ksFirebase.db;
  const $ = (selector) => document.querySelector(selector);
  const loginScreen = $("#loginScreen");
  const appShell = $("#appShell");
  const form = $("#loginForm");
  const message = $("#loginMessage");
  const button = $("#loginButton");
  const roleNames = {
    admin: "Administrateur",
    director: "Chef / Directeur",
    storekeeper: "Magasinier",
    site_manager: "Chef de chantier"
  };

  function showLogin(text = "") {
    appShell.hidden = true;
    loginScreen.hidden = false;
    message.textContent = text;
    button.disabled = false;
    button.textContent = "Se connecter";
  }

  function showApp(profile, user) {
    loginScreen.hidden = true;
    appShell.hidden = false;
    $("#currentUserName").textContent =
      (profile.displayName || user.email || "Utilisateur") +
      " · " + (roleNames[profile.role] || "Compte KS BTP");
    window.ksCurrentUser = { uid: user.uid, email: user.email, ...profile };
    window.dispatchEvent(new CustomEvent("ks-auth-ready", { detail: window.ksCurrentUser }));
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";
    button.disabled = true;
    button.textContent = "Connexion…";
    try {
      await auth.signInWithEmailAndPassword(
        $("#loginEmail").value.trim(),
        $("#loginPassword").value
      );
    } catch (error) {
      const messages = {
        "auth/invalid-credential": "Adresse e-mail ou mot de passe incorrect.",
        "auth/user-disabled": "Ce compte a été désactivé.",
        "auth/too-many-requests": "Trop de tentatives. Réessayez plus tard."
      };
      showLogin(messages[error.code] || "Connexion impossible. Vérifiez vos informations et réessayez.");
    }
  });

  $("#logoutButton").addEventListener("click", () => auth.signOut());

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      showLogin();
      return;
    }
    try {
      const snapshot = await store.collection("users").doc(user.uid).get();
      if (!snapshot.exists) {
        await auth.signOut();
        showLogin("Compte non configuré : demandez à l’administrateur d’activer votre profil KS BTP.");
        return;
      }
      const profile = snapshot.data();
      if (profile.active !== true || !roleNames[profile.role]) {
        await auth.signOut();
        showLogin("Votre compte n’est pas encore activé ou son rôle n’est pas défini.");
        return;
      }
      showApp(profile, user);
    } catch (error) {
      showLogin("Impossible de vérifier votre profil. Vérifiez votre connexion Internet.");
    }
  });
})();