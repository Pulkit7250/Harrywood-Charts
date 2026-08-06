/* ============================================================================
   admin/storage.js
   ----------------------------------------------------------------------------
   Handles uploading thumbnail images to Firebase Storage and returns a
   public download URL to save on the Firestore document.
   ============================================================================ */

window.HVC = window.HVC || {};

window.HVC.Storage = (() => {

  /**
   * Upload a file to Firebase Storage under a given folder.
   * Returns the public download URL.
   *
   * @param {File} file - the file selected by <input type="file">
   * @param {string} folder - "songs" | "artists" | "news"
   * @param {function} onProgress - optional callback(percent)
   */
  function uploadImage(file, folder, onProgress) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error("No file provided"));
      if (!file.type.startsWith("image/")) return reject(new Error("File must be an image"));
      if (file.size > 5 * 1024 * 1024) return reject(new Error("Image must be under 5MB"));

      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const path = `${folder}/${Date.now()}_${safeName}`;
      const ref = window.HVC.storage.ref().child(path);
      const task = ref.put(file);

      task.on(
        "state_changed",
        (snapshot) => {
          if (onProgress) {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            onProgress(pct);
          }
        },
        (error) => reject(error),
        async () => {
          const url = await task.snapshot.ref.getDownloadURL();
          resolve(url);
        }
      );
    });
  }

  return { uploadImage };
})();
