self.addEventListener("install", (e) => {
  // Service worker is installed
  console.log("installed");
});

self.addEventListener("activate", (e) => {
  // Service worker is activated
  console.log("activated");
});

self.addEventListener("fetch", (e) => {
  // Service worker intercepted a fetch call
  console.log("intercepted http request", e.request);
});

self.addEventListener("message", (e) => {
  // Message from webpage
});
