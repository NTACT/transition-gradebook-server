"use strict";var precacheConfig=[["/index.html","5dcdcb67935423b62ee524db7bbd236f"],["/static/css/main.d7784ecb.css","f366bff6528ffbc4c8c0ca08643d2078"],["/static/media/expand_arrow.50927093.svg","5092709309bc8789095b7fab7393b71f"],["/static/media/gear_icon.13bdf671.svg","13bdf671667c70644044eccbbfe63b89"],["/static/media/logo.cef7a7db.png","cef7a7db4a2ea508e682946c9177288b"],["/static/media/ntact_logo.dea7c31d.png","dea7c31defa10055cf2d696297e07848"],["/static/media/open-sans-v15-latin-300.521d17bc.woff","521d17bc9f3526c690e8ada6eee55bec"],["/static/media/open-sans-v15-latin-300.60c86674.woff2","60c866748ff15f5b347fdba64596b1b1"],["/static/media/open-sans-v15-latin-600.1cd5320f.woff","1cd5320f8937d337b61d5117cf9d7b28"],["/static/media/open-sans-v15-latin-600.223a277b.woff2","223a277bd88d8a90c8cdf24cda0ad5f5"],["/static/media/open-sans-v15-latin-700.623e3205.woff","623e3205570002af47fc2b88f9335d19"],["/static/media/open-sans-v15-latin-700.d08c09f2.woff2","d08c09f2f169f4a6edbcf8b8d1636cb4"],["/static/media/open-sans-v15-latin-800.aaeffaf2.woff2","aaeffaf205b9bbb09920089a14dbe9e8"],["/static/media/open-sans-v15-latin-800.c6aa0c4a.woff","c6aa0c4a601fb6ac66f8253fa594dff5"],["/static/media/open-sans-v15-latin-italic.987032ea.woff2","987032ea5d57c93d8da215678eae3b86"],["/static/media/open-sans-v15-latin-italic.db70d0b9.woff","db70d0b9cb27ada1a260a2b35e756b8b"],["/static/media/open-sans-v15-latin-regular.bf2d0783.woff","bf2d0783515b7d75c35bde69e01b3135"],["/static/media/open-sans-v15-latin-regular.cffb686d.woff2","cffb686d7d2f4682df8342bd4d276e09"],["/static/media/orange_plus_icon.bbfa33d4.svg","bbfa33d42d286140daa6b98909f67502"],["/static/media/oswald-v16-latin-300.d2c191b2.woff","d2c191b2e46f060bf90b34e6b3f73d83"],["/static/media/oswald-v16-latin-300.dc15f3b0.woff2","dc15f3b07cb711e818ecb48de992992c"],["/static/media/oswald-v16-latin-500.541a8639.woff2","541a863959122f29c9961095cdcbb5c2"],["/static/media/oswald-v16-latin-500.deebf8fc.woff","deebf8fc5d31111f3144d0c6373143cc"],["/static/media/oswald-v16-latin-600.452513e2.woff","452513e2767e99884b1c084dad03126b"],["/static/media/oswald-v16-latin-600.b81a3735.woff2","b81a3735849bb304ae25ae10c748d5ab"],["/static/media/oswald-v16-latin-700.3e941c0d.woff2","3e941c0d10bcb614ac1442884055d2bf"],["/static/media/oswald-v16-latin-700.7eb521f1.woff","7eb521f12cd966b030825fa662677353"],["/static/media/oswald-v16-latin-regular.ca70f49a.woff","ca70f49a133f08485bd05d5cb28ef8b7"],["/static/media/oswald-v16-latin-regular.f15aa285.woff2","f15aa285863274b4f6ed578caa76565e"],["/static/media/red_circle_x.a368b656.svg","a368b6565c468409c47cb8800995e889"],["/static/media/select_icon_light.27d61838.svg","27d61838e1ccc199fedfa505b90bdc7e"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=a),t.toString()},cleanResponse=function(a){return a.redirected?("body"in a?Promise.resolve(a.body):a.blob()).then(function(e){return new Response(e,{headers:a.headers,status:a.status,statusText:a.statusText})}):Promise.resolve(a)},createCacheKey=function(e,a,t,n){var c=new URL(e);return n&&c.pathname.match(n)||(c.search+=(c.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(t)),c.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var t=new URL(a).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(a){return t.every(function(e){return!e.test(a[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],t=e[1],n=new URL(a,self.location),c=createCacheKey(n,hashParamName,t,/\.\w{8}\./);return[n.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(n){return setOfCachedUrls(n).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var e=new Request(a,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+a+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return n.put(a,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(a){return a.keys().then(function(e){return Promise.all(e.map(function(e){if(!t.has(e.url))return a.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(a){if("GET"===a.request.method){var e,t=stripIgnoredUrlParameters(a.request.url,ignoreUrlParametersMatching),n="index.html";(e=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,n),e=urlsToCacheKeys.has(t));var c="/index.html";!e&&"navigate"===a.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],a.request.url)&&(t=new URL(c,self.location).toString(),e=urlsToCacheKeys.has(t)),e&&a.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',a.request.url,e),fetch(a.request)}))}});