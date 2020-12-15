'use strict';

let status
var query_params = [
  /^utm_.+$/,         // UTM
  /^(g|fb|y)clid$/,   // Google|FB|Yandex
  /^_hs.+$/,          // HubSpot
  /^icid$/,           // Adobe
  /^igshid$/,         // Instagram
  /^mc_[ce]id$/,      // Google
  /^mkt_tok$/,        // Google
  /^_openstat$/       // Yandex
]
var cookie_params = [
  /^utm_.+$/,         // UTM
  /^__qca$/,          // QuantCast
  /^_{1,2}(utm.+|ga.*)$/,     // Google
  /^_*fb[a-z]$/,      // Facebook
  /^SS_ANALYTICS.+$/, // Squarespace
  /^__chartbeat.+$/,  // Chartbeat
  /^kameleoonExperiment.+$/,  // Kameleoon
  /^(__cfduid|cfapp_caddi)$/, // Cloudfront
  /^GeoIP$/           // Wikipedia
]

/**
 * Delete query params related to tracking
 * if no query params just return normal URL
 */
function match_query_params(k) {
  for (let rex of query_params)
    if (rex.test(k))
      return true
  return false
}


chrome.webRequest.onBeforeRequest.addListener(function(d){
  var url = new URL(d.url)
  var params = []

  if (url.search.indexOf('?') != 0 || !status)
    return {}

  /* search for banned query params */
  for (let k of url.searchParams.keys())
    if (match_query_params(k))
      params.push(k)

  /* remove them */
  for (let p of params) url.searchParams.delete(p)

  //console.log(`Redirecting: ${url.href}`)
  return {redirectUrl: url.href}
}, { urls: ["<all_urls>"], types: ['main_frame'] }, ["blocking"])

/**
 * Look for cookies that could be related to tracking
 * search for them in either request (Cookie) or response (Set-Cookie)
 */

function delete_cookie_params(headers) {
  for (let h of headers) {
    if (/^(?:set-)*cookie$/i.test(h.name)) {
      // nom nom!
      let cookies = h.value.split(/;/)
      let result = cookies.map(c => {
        let name = c.split('=')[0]

        for (let rex of cookie_params)
          if (rex.test(name.replace(/ /g, ''))) // remove any invasive space
            return null // delete if matches
        return c
      })

      h.value = result.filter(function(i){ // skip deleted
                  return ((i === null || i === undefined) ? false : true)
                }).join(';')
    }
  }

  //console.log(`Headers:`, headers)
  return headers
}

let filter  = { urls: ["<all_urls>"] }
chrome.webRequest.onBeforeSendHeaders.addListener(function(d){
  return {
    requestHeaders: (status) ? delete_cookie_params(d.requestHeaders)
      : d.requestHeaders
  }
}, filter, ["requestHeaders", "blocking", "extraHeaders"])
chrome.webRequest.onHeadersReceived.addListener(function(d){
  return {
    responseHeaders: (status) ? delete_cookie_params(d.responseHeaders)
      : d.responseHeaders
  }
}, filter, ["responseHeaders", "blocking", "extraHeaders"])


/**
 * Deal with enabling/disabling of extension
 */
chrome.runtime.onInstalled.addListener(function(){
  status = true
  chrome.storage.sync.set({enabled: status}, null)
})
chrome.browserAction.onClicked.addListener(function(){
  chrome.storage.sync.get('enabled', function(i) {
    chrome.storage.sync.set({enabled: !i['enabled']}, null);
    status = !i['enabled']
    if (status) {
      chrome.browserAction.setIcon({path:"icon.png"})
      chrome.browserAction.setTitle({title:"oko (enabled)"})
    } else {
      chrome.browserAction.setIcon({path:"disabled.png"})
      chrome.browserAction.setTitle({title:"oko (disabled)"})
    }
  })
})
