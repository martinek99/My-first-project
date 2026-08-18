self.addEventListener("install", function(e){
  self.skipWaiting();
});
self.addEventListener("activate", function(e){
  e.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", function(event){
  if(event.request.method!=="GET") return;
  event.respondWith(
    fetch(event.request, {cache:"no-store"}).catch(function(){
      return fetch(event.request);
    })
  );
});
