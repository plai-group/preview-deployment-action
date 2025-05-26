// CloudFront Function for subdomain-based routing
function handler(event) {
  const request = event.request
  const host = request.headers.host.value
  const subDomain = host.split(".")[0]
  const uri = request.uri

  console.log("=== CloudFront Function Debug ===")
  console.log("Original host:", host)
  console.log("Extracted subDomain:", subDomain)
  console.log("Original uri:", uri)
  console.log("Query string:", request.querystring)

  // Skip processing for health checks or monitoring requests
  if (uri === "/health" || uri === "/status") {
    console.log("Case: Health check - No change needed")
    console.log("Final request.uri:", request.uri)
    console.log("=== End Debug ===")
    return request
  }

  // Check if this is already a subdomain-prefixed path
  // This handles both direct requests and error page redirects
  if (uri.startsWith(`/${subDomain}/`)) {
    console.log("Case: Already prefixed - No change needed")
    console.log("Final request.uri:", request.uri)
    console.log("=== End Debug ===")
    return request
  }

  // Handle root path "/"
  if (uri === "/") {
    request.uri = `/${subDomain}/index.html`
    console.log("Case: Root path - New URI:", request.uri)
  }
  // For root index.html requests (from error pages), prefix with subdomain
  else if (uri === "/index.html") {
    request.uri = `/${subDomain}/index.html`
    console.log("Case: Error page index.html - New URI:", request.uri)
  }
  // For paths ending with "/" (directory requests)
  else if (uri.endsWith("/")) {
    request.uri = `/${subDomain}${uri}index.html`
    console.log("Case: Directory - New URI:", request.uri)
  }
  // Handle asset requests - these can come from nested routes like /session/assets/file.js
  else if (
    uri.includes("/assets/") ||
    uri.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/)
  ) {
    let assetPath = uri

    // If the URI contains /assets/ anywhere (like /session/assets/file.js), extract just the /assets/... part
    if (uri.includes("/assets/")) {
      assetPath = uri.substring(uri.indexOf("/assets/"))
      console.log("Extracted asset path from nested route:", assetPath)
    }

    request.uri = `/${subDomain}${assetPath}`
    console.log("Case: Asset request - New URI:", request.uri)
  }
  // Handle SPA routes (paths without file extensions that aren't assets)
  else if (!uri.includes(".") && !uri.endsWith("/")) {
    // This is likely a SPA route, serve index.html for client-side routing
    request.uri = `/${subDomain}/index.html`
    console.log("Case: SPA route - New URI:", request.uri)
  }
  // For everything else, apply subdomain prefix
  else {
    request.uri = `/${subDomain}${uri}`
    console.log("Case: Other file - New URI:", request.uri)
  }

  console.log("Final request.uri:", request.uri)
  console.log("=== End Debug ===")
  return request
}
