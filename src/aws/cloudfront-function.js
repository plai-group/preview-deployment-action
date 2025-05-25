// Version 1.4.0 - Enhanced CloudFront Function with better file detection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Handle different URI patterns
  if (uri.endsWith("/")) {
    // For root paths like "/" or "/some-path/"
    request.uri = `/${subDomain}${uri}index.html`
    console.log("Case: Directory - New URI:", request.uri)
  } else if (isActualFile(uri)) {
    // For actual files like "/script.js" or "/styles.css"
    request.uri = `/${subDomain}${uri}`
    console.log("Case: File - New URI:", request.uri)
  } else {
    // For SPA routes like "/dashboard", "/profile", or "/page?param=value"
    request.uri = `/${subDomain}/index.html`
    console.log("Case: SPA Route - New URI:", request.uri)
  }

  console.log("Final request.uri:", request.uri)
  console.log("=== End Debug ===")
  return request
}

// Helper function to determine if this is actually a file request
function isActualFile(uri) {
  // Common file extensions for web assets
  const fileExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.woff', '.woff2', '.ttf', '.eot', '.pdf', '.mp4', '.webm', '.webp',
    '.json', '.xml', '.txt', '.html', '.htm', '.map', '.gz', '.br'
  ]

  // Remove query parameters and hash fragments for extension checking
  const cleanUri = uri.split('?')[0].split('#')[0].toLowerCase()

  // Check if the URI ends with a known file extension
  return fileExtensions.some(ext => cleanUri.endsWith(ext))
}