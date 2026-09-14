DEPLOYMENT — Pick&Brew Coffee Shop
==================================================

1. SUPABASE (once)
   SQL Editor → New query → paste all of setup.sql → Run.
   Expect: "Success. No rows returned."
   setup.sql does NOT go into the GitHub repo.

2. GITHUB REPO — upload everything except setup.sql
   and this readme, keeping the folders:

     index.html            (repo root — the POS)
     manifest.json         (repo root — makes it installable)
     icon-192.png          (repo root — home-screen icon)
     icon-512.png          (repo root — splash / store icon)
     version.json          (repo root — in-app updater)
     dashboard/index.html  (owner dashboard)
     selftest/index.html   (deployment self-test — delete after sign-off)

   Then add sw.js WITHOUT uploading a file:
     Add file → Create new file → name it sw.js → paste the
     contents copied from the deployer → Commit changes.
     Without sw.js the POS cannot be reopened offline.

3. GITHUB PAGES
   Settings → Pages → Branch: main, folder: / (root) → Save.
   Allow 1–2 minutes for the first build.

URLS
  POS:       https://pickbrew25.github.io/Pick-Brew/
  Dashboard: https://pickbrew25.github.io/Pick-Brew/dashboard/
  Self-test: https://pickbrew25.github.io/Pick-Brew/selftest/

SIGN-IN
  Owner email:    pickandbrewcoffee@gmail.com
  Admin password: Admin2026
  Business ID:    b34297ff-1279-4457-9ff9-5839c7bf5e84

Template version 7.4.6
