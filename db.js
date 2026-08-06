/* ============================================================================
   admin/db.js
   ----------------------------------------------------------------------------
   All Firestore read/write operations for the admin dashboard, in one place.
   Collections used:
     /songs/{id}    — title, artistId, artistName, label, thumbnail,
                       youtubeUrl, youtubeVideoId, views, likes, comments,
                       duration, uploadedAt, weeklyRank, addedAt, updatedAt
     /artists/{id}  — name, avatar, bio, channelUrl, addedAt, updatedAt
     /news/{id}     — title, content, thumbnail, author, publishedAt
     /admins/{uid}  — { email } — allow-list, managed via Firebase Console
   ============================================================================ */

window.HVC = window.HVC || {};

window.HVC.DB = (() => {
  const db = () => window.HVC.db;
  const ts = () => firebase.firestore.FieldValue.serverTimestamp();

  /* ------------------------------- SONGS -------------------------------- */

  async function getSongs() {
    const snap = await db().collection("songs").orderBy("addedAt", "desc").get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function getSong(id) {
    const doc = await db().collection("songs").doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  async function addSong(data) {
    const ref = await db().collection("songs").add({
      ...data,
      addedAt: ts(),
      updatedAt: ts(),
    });
    return ref.id;
  }

  async function updateSong(id, data) {
    await db().collection("songs").doc(id).update({
      ...data,
      updatedAt: ts(),
    });
  }

  async function deleteSong(id) {
    await db().collection("songs").doc(id).delete();
  }

  /**
   * Batch-save weekly rank order (used by the Top 100 drag-and-drop manager).
   * `orderedIds` is an array of song IDs in rank order (index 0 = rank 1).
   */
  async function saveWeeklyRanks(orderedIds) {
    const batch = db().batch();
    orderedIds.forEach((id, index) => {
      const ref = db().collection("songs").doc(id);
      batch.update(ref, { weeklyRank: index + 1, updatedAt: ts() });
    });
    await batch.commit();
  }

  /**
   * Remove a song from the Weekly Top 100 (clears its rank).
   */
  async function clearWeeklyRank(id) {
    await db().collection("songs").doc(id).update({
      weeklyRank: firebase.firestore.FieldValue.delete(),
      updatedAt: ts(),
    });
  }

  /* ------------------------------ ARTISTS ------------------------------- */

  async function getArtists() {
    const snap = await db().collection("artists").orderBy("addedAt", "desc").get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function addArtist(data) {
    const ref = await db().collection("artists").add({
      ...data,
      addedAt: ts(),
      updatedAt: ts(),
    });
    return ref.id;
  }

  async function updateArtist(id, data) {
    await db().collection("artists").doc(id).update({
      ...data,
      updatedAt: ts(),
    });
  }

  async function deleteArtist(id) {
    await db().collection("artists").doc(id).delete();
  }

  /* -------------------------------- NEWS --------------------------------- */

  async function getNews() {
    const snap = await db().collection("news").orderBy("publishedAt", "desc").get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function addNews(data) {
    const ref = await db().collection("news").add({
      ...data,
      publishedAt: data.publishedAt || ts(),
      addedAt: ts(),
      updatedAt: ts(),
    });
    return ref.id;
  }

  async function updateNews(id, data) {
    await db().collection("news").doc(id).update({
      ...data,
      updatedAt: ts(),
    });
  }

  async function deleteNews(id) {
    await db().collection("news").doc(id).delete();
  }

  /* ------------------------------- LABELS -------------------------------- */

  async function getLabels() {
    const snap = await db().collection("labels").orderBy("addedAt", "desc").get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function addLabel(data) {
    const ref = await db().collection("labels").add({ ...data, addedAt: ts(), updatedAt: ts() });
    return ref.id;
  }

  async function updateLabel(id, data) {
    await db().collection("labels").doc(id).update({ ...data, updatedAt: ts() });
  }

  async function deleteLabel(id) {
    await db().collection("labels").doc(id).delete();
  }

  /* ------------------------------ SETTINGS -------------------------------- */
  // Single document at /config/site holds all site-wide settings.

  async function getSettings() {
    const doc = await db().collection("config").doc("site").get();
    return doc.exists ? doc.data() : {};
  }

  async function saveSettings(data) {
    await db().collection("config").doc("site").set({ ...data, updatedAt: ts() }, { merge: true });
  }

  /* ------------------------ TOP 100 LOCK & ARCHIVE ------------------------ */
  // /config/top100 holds { locked: boolean }. Locking disables editing in
  // the dashboard UI (admin-app.js enforces this) so a published weekly
  // chart isn't accidentally reshuffled.

  async function getTop100Meta() {
    const doc = await db().collection("config").doc("top100").get();
    return doc.exists ? doc.data() : { locked: false };
  }

  async function setTop100Locked(locked) {
    await db().collection("config").doc("top100").set({ locked, updatedAt: ts() }, { merge: true });
  }

  /**
   * Snapshot the current Weekly Top 100 into /archives/{weekId} for
   * historical record-keeping, then optionally clear this week's ranks.
   */
  async function archiveCurrentTop100(songs) {
    const weekId = getWeekId();
    const entries = songs
      .filter(s => s.weeklyRank)
      .sort((a, b) => a.weeklyRank - b.weeklyRank)
      .map(s => ({ id: s.id, title: s.title, artistName: s.artistName || "", rank: s.weeklyRank }));

    await db().collection("archives").doc(weekId).set({
      weekId,
      songs: entries,
      archivedAt: ts(),
    });
    return weekId;
  }

  async function getArchives() {
    const snap = await db().collection("archives").orderBy("weekId", "desc").limit(26).get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  /**
   * ISO week identifier like "2026-W32", used as the archive document ID.
   */
  function getWeekId(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  }

  /* ------------------------------- SEARCH -------------------------------- */

  /**
   * Client-side search across an already-loaded songs array.
   * (Firestore has no native full-text search; for a dashboard-sized
   * dataset, filtering an in-memory array is simpler and free.)
   */
  function searchSongs(songs, query) {
    if (!query || !query.trim()) return songs;
    const q = query.toLowerCase().trim();
    return songs.filter(s =>
      (s.title || "").toLowerCase().includes(q) ||
      (s.artistName || "").toLowerCase().includes(q) ||
      (s.label || "").toLowerCase().includes(q)
    );
  }

  return {
    getSongs, getSong, addSong, updateSong, deleteSong,
    saveWeeklyRanks, clearWeeklyRank,
    getArtists, addArtist, updateArtist, deleteArtist,
    getLabels, addLabel, updateLabel, deleteLabel,
    getNews, addNews, updateNews, deleteNews,
    getSettings, saveSettings,
    getTop100Meta, setTop100Locked, archiveCurrentTop100, getArchives,
    searchSongs,
  };
})();
