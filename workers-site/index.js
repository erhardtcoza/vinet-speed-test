// workers-site/index.js
import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG variable will be replaced at build time by the value of the
 * DEBUG environment variable, if defined.
 */
const DEBUG = false

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

async function handleEvent(event) {
  const url = new URL(event.request.url)
  let options = {}

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function mapRequestToAsset. Doing so allows
   * you to serve assets based on url paths, host names, or request headers.
   * https://developers.cloudflare.com/workers/sites/functions/map-request-to-asset
   */
  options.mapRequestToAsset = handlePrefix

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    }

    const page = await getAssetFromKV(event, options);

    // allow headers to be altered
    const response = new Response(page.body, page);

    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "unsafe-url");
    response.headers.set("Feature-Policy", "none");

    return response;

  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
        })

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 })
  }
}

/**
 * Here's a helper function that if your site is running at a sub-domain path, modifies the request to
 * fetch the asset from the correct path.
 */
function handlePrefix(request) {
  // compute the default asset path for that request
  let defaultAssetKey = mapRequestToAsset(request)
  let url = new URL(defaultAssetKey.url)

  // strip the trailing slash if present
  url.pathname = url.pathname.replace(/\/$/, "")

  //
  // YOUR SPA STUFF SHOULD GO HERE.
  //
  // For a SPA, you’ll want to map all requests that are not for assets to /index.html.
  // https://developers.cloudflare.com/workers/sites/spa-and-client-side-routing
  //
  const assetpath = "/assets/"
  if (url.pathname.startsWith(assetpath) === false && url.pathname.match(/\.[a-zA-Z]+$/) === null) {
      url.pathname = "/index.html"
  }

  // re-create the request again
  return new Request(url.toString(), defaultAssetKey)
}
