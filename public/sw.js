// When version is changed, a new service worker will be created
let version = 1;
// Names of cache
let staticName = `staticCache-${version}`;

// What we would store into the cache
let assets = [
  // Best to put root in both ways
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/app.js",
  "/js/index.js",
  "/js/idb.js",
];

self.addEventListener("install", (e) => {
  // Service worker is installed
  console.log(`SW Version ${version} installed`);
  // Build a cache and make browser wait until all assets have been cached
  e.waitUntil(
    // Create cache
    caches.open(staticName).then((cache) => {
      cache.addAll(assets).then(
        () => {
          console.log(`${staticName} has been updated`);
        },
        (err) => {
          console.warn(`Failed to update ${staticName}`);
        }
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  // Service worker is activated
  console.log("activated");

  // Will delete all caches that don't match static name
  e.waitUntil(
    caches.keys().then((keys) => {
      // waitUntil() wants a promise returned
      return Promise.all(
        // Returns a new array which won't contain the current staticName then we call delete on all of them
        keys
          .filter((key) => key !== staticName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  // Check cache, fetch if missing, then add response to cache
  e.respondWith(
    // checks to see if request object is located in cache or not
    caches.match(e.request).then((cacheRes) => {
      return (
        cacheRes ||
        // if not located in cache make fetch
        fetch(e.request).then((fetchResponse) => {
          //save in cache
          return caches.open(staticName).then((cache) => {
            // clone is used so it can be sent back to the server and the cache
            //FIXME: Post requests are not allowed
            cache.put(e.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    })
  );
});

self.addEventListener("message", (e) => {
  // Message from webpage
});
