const CACHE_NAME='pos-7-4-7';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>null))))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(ks=>Promise.all(ks.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.pathname.includes('/dashboard'))return;
  if(u.pathname.includes('/queue'))return;

  /* Allow cross-origin requests (Google Fonts, CDNs, APIs) to pass through
     unmodified — caching them caused opaque response size bloat and broke
     the installability check on some Chrome versions. */
  if(u.hostname!==self.location.hostname)return;

  /* version.json must always come from the network so update prompts fire. */
  if(u.pathname.endsWith('/version.json')){
    e.respondWith(
      fetch(e.request,{cache:'no-store'})
        .catch(()=>new Response('{}',{headers:{'Content-Type':'application/json'}}))
    );
    return;
  }

  /* App shell: network-first so redeployed index.html reaches clients,
     cache is the offline fallback. */
  const isDoc=e.request.mode==='navigate'
    ||u.pathname.endsWith('/')
    ||u.pathname.endsWith('/index.html');

  if(isDoc){
    e.respondWith(
      fetch(e.request)
        .then(r=>{
          if(r&&r.status===200){
            const cl=r.clone();
            caches.open(CACHE_NAME).then(c=>c.put(e.request,cl));
          }
          return r;
        })
        .catch(()=>
          caches.match(e.request)
            .then(c=>c||caches.match('./index.html'))
        )
    );
    return;
  }

  /* Everything else: cache-first, update cache in background. */
  e.respondWith(
    caches.match(e.request).then(cached=>{
      const fetchAndCache=fetch(e.request).then(r=>{
        if(r&&r.status===200){
          const cl=r.clone();
          caches.open(CACHE_NAME).then(ch=>ch.put(e.request,cl));
        }
        return r;
      }).catch(()=>cached||caches.match('./index.html'));

      /* Return cache immediately, refresh in background (stale-while-revalidate) */
      return cached||fetchAndCache;
    })
  );
});
