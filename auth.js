/* ============================================================================
   admin/auth.js
   ----------------------------------------------------------------------------
   Firebase Authentication (Email/Password) for the admin dashboard.

   Security model (fully client-side, no custom backend required):
   - Firebase Auth verifies the login (email + password).
   - Firestore security rules only allow writes to songs/artists/news/config
     if the signed-in user's UID exists as a document in the /admins
     collection. Being able to log in is NOT enough on its own — a UID must
     also be added to /admins (done once via Firebase Console — see
     /admin/README.md). This means even if someone signs up a new account,
     they cannot write data unless you've explicitly allow-listed their UID.
   ============================================================================ */

window.HVC = window.HVC || {};

window.HVC.Auth = (() => {

  /**
   * Attempt to sign in with email + password.
   * Returns the Firebase user on success, throws a friendly error on failure.
   */
  async function login(email, password) {
    try {
      const credential = await window.HVC.auth.signInWithEmailAndPassword(email, password);
      return credential.user;
    } catch (error) {
      throw { message: friendlyAuthError(error.code) };
    }
  }

  /**
   * Send a password reset email via Firebase Auth.
   */
  async function sendPasswordReset(email) {
    try {
      await window.HVC.auth.sendPasswordResetEmail(email);
    } catch (error) {
      throw { message: friendlyAuthError(error.code) };
    }
  }

  /**
   * Sign the current admin out and redirect to the login page.
   */
  async function logout() {
    await window.HVC.auth.signOut();
    window.location.href = "login.html";
  }

  /**
   * Check whether the signed-in user is an allow-listed admin
   * (has a matching document in the /admins Firestore collection).
   */
  async function isAdmin(uid) {
    if (!uid) return false;
    const doc = await window.HVC.db.collection("admins").doc(uid).get();
    return doc.exists;
  }

  /**
   * Route guard: call this at the top of every protected admin page.
   * Redirects to login.html if not authenticated or not allow-listed.
   * Calls onReady(user) once confirmed.
   */
  function requireAdmin(onReady) {
    window.HVC.auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = "login.html";
        return;
      }

      const admin = await isAdmin(user.uid);
      if (!admin) {
        await window.HVC.auth.signOut();
        alert("This account is not authorized as an admin. Contact the site owner to be added to the /admins collection in Firestore.");
        window.location.href = "login.html";
        return;
      }

      onReady(user);
    });
  }

  /**
   * Convert Firebase Auth error codes into readable messages.
   */
  function friendlyAuthError(code) {
    const map = {
      "auth/invalid-email": "That email address looks invalid.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/user-not-found": "No account found with that email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/invalid-credential": "Incorrect email or password.",
      "auth/too-many-requests": "Too many failed attempts. Try again later.",
      "auth/network-request-failed": "Network error. Check your connection.",
    };
    return map[code] || "Login failed. Please try again.";
  }

  return { login, logout, isAdmin, requireAdmin, sendPasswordReset };
})();
