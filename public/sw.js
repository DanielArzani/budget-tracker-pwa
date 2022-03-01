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
  //! Do I need these cached?
  // "/icons/icon-72x72.png",
  // "/icons/icon-96x96.png",
  // "/icons/icon-128x128.png",
  // "/icons/icon-144x144.png",
  // "/icons/icon-152x152.png",
  // "/icons/icon-192x192.png",
  // "/icons/icon-384x384.png",
  // "/icons/icon-512x512.png",
];

self.addEventListener("install", (e) => {
  // Service worker is installed
  console.log(`SW Version ${version} installed`);
  // Build a cache and make browser wait until all assets have been cached
  //TODO: Does this need an if statement (in the case where no updates to cache have been made) so this doesn't throw an error?
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
  version = version + 1;
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
    // .then(() => {
    //   // Even with self.skipWaiting, we still have to reload the page, this should allow us to skip that part
    //   clients.claim();
    // })
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
