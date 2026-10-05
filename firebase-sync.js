import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, setDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const here = location.pathname.split("/").pop().replace(".html", "");
const COLS = ["shops", "jobs", "affs"];
const keyOf = (c, x) => (c === "affs" ? x.code : String(x.id));
const last = {};
let ready = false;

function banner(msg) {
  const d = document.createElement("div");
  d.style.cssText = "background:#c4195f;color:#fff;padding:8px 16px;font:14px sans-serif";
  d.textContent = msg;
  document.body.prepend(d);
}
function refresh() {
  const a = document.activeElement;
  if (a && /INPUT|SELECT|TEXTAREA/.test(a.tagName)) return; // do not interrupt typing
  draw();
}
if (firebaseConfig.apiKey === "PASTE_HERE") {
  banner("Firebase is not set up yet: paste your config into firebase-config.js. Showing offline demo data.");
} else {
  const app = initializeApp(firebaseConfig), db = getFirestore(app), auth = getAuth(app);
  window.logout = () => signOut(auth).then(() => location.replace("index.html"));
  window.cloudSave = () => { // save only documents that changed since the last sync
    if (!ready) return;
    for (const c of COLS) for (const x of S[c]) {
      const k = c + "/" + keyOf(c, x), j = JSON.stringify(x);
      if (last[k] !== j) { last[k] = j; setDoc(doc(db, c, keyOf(c, x)), JSON.parse(j)).catch((e) => banner("Save blocked: " + e.message)); }
    }
  };
  onAuthStateChanged(auth, async (user) => {
    if (!user) { location.replace("index.html"); return; }
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) { await signOut(auth); return; }
    const me = { uid: user.uid, ...snap.data() };
    if (me.role !== here) { location.replace(me.role + ".html"); return; } // each account only sees its own interface
    S.me = me;
    if (me.role === "shop") S.shopId = me.shopId;
    if (me.role === "affiliate") S.aff = me.aff;
    if (me.role === "customer" && S.pre.nick === "Maria") S.pre.nick = me.name;
    ready = true;
    const filters = { customer: ["uid", me.uid], shop: ["shop", me.shopId], affiliate: ["ref", me.aff] }; // admin and rider read all jobs
    for (const c of COLS) {
      const ref = c === "jobs" && filters[me.role] ? query(collection(db, c), where(...[filters[me.role][0], "==", filters[me.role][1]])) : collection(db, c);
      onSnapshot(ref, (s) => {
        const arr = [];
        s.forEach((d) => { const x = d.data(); last[c + "/" + d.id] = JSON.stringify(x); arr.push(x); });
        if (c !== "affs") arr.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
        S[c] = arr;
        if (c === "shops" && arr.length && !arr.find((x) => x.id === S.pre.shop)) S.pre.shop = arr[0].id;
        refresh();
      }, (e) => banner("Database error: " + e.message));
    }
    draw();
  });
}
