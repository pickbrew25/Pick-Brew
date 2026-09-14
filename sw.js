const CACHE_NAME='pos-7-4-6';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>null)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.pathname.includes('/dashboard'))return;
  if(u.pathname.includes('/queue'))return;
  if(u.hostname!==self.location.hostname)return;
  /* version.json drives the in-app update prompt. It must never be
     served or stored from cache, or a new release can never be seen. */
  if(u.pathname.endsWith('/version.json')){
    e.respondWith(fetch(e.request,{cache:'no-store'})
      .catch(()=>new Response('{}',{headers:{'Content-Type':'application/json'}})));
    return;
  }
  /* The app shell is network-first so a redeployed index.html actually
     reaches installed clients; cache is the offline fallback. */
  const isDoc=e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html');
  if(isDoc){
    e.respondWith(fetch(e.request).then(r=>{
      if(r&&r.status===200){const cl=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,cl));}
      return r;
    }).catch(()=>caches.match(e.request).then(c=>c||caches.match('./index.html'))));
    return;
  }
  /* Everything else stays cache-first. */
  e.respondWith(caches.match(e.request).then(c=>{if(c)return c;return fetch(e.request).then(r=>{if(!r||r.status!==200)return r;const cl=r.clone();caches.open(CACHE_NAME).then(ch=>ch.put(e.request,cl));return r;}).catch(()=>caches.match('./index.html'));}));
});
