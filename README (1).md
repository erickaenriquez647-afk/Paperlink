# PaperLink prototype (static site + Firebase)

One sign-in page (`index.html`). The account type chosen at registration sends each person to their own screen:
customer, shop, rider or affiliate. Admin accounts are made by you (see step 5). Data lives in Firebase Firestore.

## Set up Firebase (once)
1. console.firebase.google.com > Add project > Build > Firestore Database > Create (production mode, asia-southeast1).
2. Build > Authentication > Get started > Sign-in method > enable **Email/Password**.
3. Firestore > Rules: paste `firestore.rules` > Publish.
4. Project settings > Your apps > Web (</>) > register app > copy the config into `firebase-config.js`.
5. Make yourself admin: open `index.html`, create a normal account, then in Firestore > `users` > your document,
   change `role` to `admin`. Log out and in.

## Publish on GitHub Pages
1. Push this folder to a GitHub repo (`main` branch).
2. Repo Settings > Pages > Deploy from a branch > `main` / root.
3. Firebase > Authentication > Settings > Authorized domains > add `YOUR-USERNAME.github.io`.
4. Open `https://YOUR-USERNAME.github.io/YOUR-REPO/` on any phone or laptop.

## Prototype limits
File names only (no upload), no email verification or password reset yet, queue slots are assigned when the shop
first opens its page, admin commission edits stay in one browser. Production path: the FastAPI/PostgreSQL backend.
