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

  // Check if this is already a subdomain-prefixed path
  // This handles both direct requests and error page redirects
  if (uri.startsWith(`/${subDomain}/`)) {
    console.log("Case: Already prefixed - No change needed")
    console.log("Final request.uri:", request.uri)
    console.log("=== End Debug ===")
    return request
  }

  // For root index.html requests (from error pages), prefix with subdomain
  if (uri === "/index.html") {
    request.uri = `/${subDomain}/index.html`
    console.log("Case: Error page index.html - New URI:", request.uri)
  }
  // For root paths like "/" or "/some-path/"
  else if (uri.endsWith("/")) {
    request.uri = `/${subDomain}${uri}index.html`
    console.log("Case: Directory - New URI:", request.uri)
  }
  // For everything else (files, routes, etc.)
  else {
    request.uri = `/${subDomain}${uri}`
    console.log("Case: Direct path - New URI:", request.uri)
  }

  console.log("Final request.uri:", request.uri)
  console.log("=== End Debug ===")
  return request
}