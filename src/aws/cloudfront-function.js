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

  // Always prefix with subdomain - let S3 and CloudFront error pages handle fallbacks
  if (uri.endsWith("/")) {
    // For root paths like "/" or "/some-path/"
    request.uri = `/${subDomain}${uri}index.html`
    console.log("Case: Directory - New URI:", request.uri)
  } else {
    // For everything else (files, routes, etc.) - try the direct path first
    // If it doesn't exist, CloudFront error pages will serve index.html
    request.uri = `/${subDomain}${uri}`
    console.log("Case: Direct path - New URI:", request.uri)
  }

  console.log("Final request.uri:", request.uri)
  console.log("=== End Debug ===")
  return request
}