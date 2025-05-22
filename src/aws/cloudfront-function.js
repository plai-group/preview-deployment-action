// Version 1.2.0 cloudfront-function.js
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handler(event) {
  const request = event.request
  const host = request.headers.host.value
  console.log("host")
  console.log(host)
  const subDomain = host.split(".")[0]
  console.log("subDomain")
  console.log(subDomain)
  const uri = request.uri
  console.log("uri")
  console.log(uri)
  
  // Check whether the URI is missing a file name.
  if (uri.endsWith("/")) {
    // For root paths like "/" or "/some-path/"
    request.uri = `/${subDomain}${uri}index.html`
  } else if (uri.includes(".")) {
    // For actual files like "/script.js" or "/styles.css"
    request.uri = `/${subDomain}${uri}`
  } else {
    // For SPA routes like "/dashboard" or "/profile" - serve index.html
    request.uri = `/${subDomain}/index.html`
  }
  
  console.log("request.uri")
  console.log(request.uri)
  return request
}
