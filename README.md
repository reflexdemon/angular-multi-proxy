# AngularMultiProxy

This project is a demo to show what needs to be done to set multiple proxy configurations for various environments. This project is only a demo project. If you are looking for any UI tips then it is a wrong project. The objective of this project is show how to setup proxy.

## Background

If you are looking into this then you are intrested in proxying your application to an external API. For our demo let us try
to proxy our API calls to below public APIs.

1) International Chuck Norris Database - http://www.icndb.com/
2) HTTP Bin - https://httpbin.org/

## Setup

For our demo let us consider `/api` proxies to one of the backend based on configuration. This means when we run an applicatin using one configuratin `/api` is expected to hit ICNDB and with other configuration it will hit HTTP Bin.

With this being said let us get our code in place.

## Code Changes

### Step 1

Add a `proxyConfig` entry to your `angular.json`

```
...
"architect": {
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-application-name:build",
      "proxyConfig": "src/proxy.conf.js"
    },
...

```

### Step 2

Add `src/proxy.conf.js` to your repository with below configuration.

```js
const TARGET = process.env.TARGET || 'ICNDB';


const configuration = {
  'ICNDB' : {
    target : 'https://api.icndb.com',
    host: 'api.icndb.com'
  },
  'HTTPBIN' : {
    target : 'https://httpbin.org',
    host: 'httpbin.org'
  }
};


const PROXY_CONFIG = [
    {
        context: ["/api/**"],
        target: configuration[TARGET].target,
        headers: {
          host: configuration[TARGET].host
        },
        secure: false,
        pathRewrite: {
          '^/api': ''
        }
    }
];

module.exports = PROXY_CONFIG;

```

### Step 3

Add the `cross-env` Dev dependency to be able to have a seamless experience of passing environment variables between Windoes, Linux or Mac users. I strongly recommend you do that.

```bash
$ npm i -D cross-env
```

### Step 4

Now add the below to your `scripts` part of your main `package.json`.

```
...
  "scripts": {
      "proxy:icndb": "cross-env TARGET=ICNDB ng serve",
      "proxy:httpbin": "cross-env TARGET=HTTPBIN ng serve",
...

}
```

### Step 5

It is time to test the setup.

To start the ICNDB proxying start with below command.

```bash
$ npm run proxy:icndb  

> angular-multi-proxy@0.0.0 proxy:icndb /home/venkatvp/Development/github/reflexdemon/angular-multi-proxy
> cross-env TARGET=ICNDB ng serve

10% building 3/3 modules 0 active[HPM] Proxy created: [ '/api/**' ]  ->  https://api.icndb.com
[HPM] Proxy rewrite rule created: "^/api" ~> ""

chunk {main} main.js, main.js.map (main) 57.8 kB [initial] [rendered]
chunk {polyfills} polyfills.js, polyfills.js.map (polyfills) 141 kB [initial] [rendered]
chunk {runtime} runtime.js, runtime.js.map (runtime) 6.15 kB [entry] [rendered]
chunk {styles} styles.js, styles.js.map (styles) 12.4 kB [initial] [rendered]
chunk {vendor} vendor.js, vendor.js.map (vendor) 2.41 MB [initial] [rendered]
Date: 2020-07-24T10:08:11.318Z - Hash: 0d0b991d4a90fb86406a - Time: 6242ms
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
: Compiled successfully.


```

If you paid close attention to the output see where the routs `/api/**` is pointing to. In this case it is proxuing to ICNDB.

```bash
$ curl -v "http://localhost:4200/api/jokes/random?limitTo=[nerdy]"
*   Trying 127.0.0.1:4200...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 4200 (#0)
> GET /api/jokes/random?limitTo=[nerdy] HTTP/1.1
> Host: localhost:4200
> User-Agent: curl/7.68.0
> Accept: */*
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< X-Powered-By: Express
< access-control-allow-origin: *
< date: Fri, 24 Jul 2020 10:11:28 GMT
< content-type: application/json
< transfer-encoding: chunked
< connection: close
< set-cookie: __cfduid=da6fb142879c06d040e1bbcc43fd9a54c1595585488; expires=Sun, 23-Aug-20 10:11:28 GMT; path=/; domain=.icndb.com; HttpOnly; SameSite=Lax
< access-control-allow-methods: GET
< cache-control: no-cache, must-revalidate
< expires: Sat, 26 Jul 1997 05:00:00 GMT
< vary: User-Agent
< cf-cache-status: DYNAMIC
< cf-request-id: 0421e77dfa00000d061d3bb200000001
< expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
< server: cloudflare
< cf-ray: 5b7cdb7659090d06-ATL
< 
* Closing connection 0
{ "type": "success", "value": { "id": 513, "joke": "Chuck Norris does not code in cycles, he codes in strikes.", "categories": ["nerdy"] } }
```

Congragulations! You are now proxying the `ICNDB`. Now let us test proxying to my other endpoint, `HTTPBIN`.

To start proxying to `HTTPBIN`, you issue the below command.

```bash
$ npm run proxy:httpbin

> angular-multi-proxy@0.0.0 proxy:httpbin /home/venkatvp/Development/github/reflexdemon/angular-multi-proxy
> cross-env TARGET=HTTPBIN ng serve

10% building 3/3 modules 0 active[HPM] Proxy created: [ '/api/**' ]  ->  https://httpbin.org
[HPM] Proxy rewrite rule created: "^/api" ~> ""

chunk {main} main.js, main.js.map (main) 57.8 kB [initial] [rendered]
chunk {polyfills} polyfills.js, polyfills.js.map (polyfills) 141 kB [initial] [rendered]
chunk {runtime} runtime.js, runtime.js.map (runtime) 6.15 kB [entry] [rendered]
chunk {styles} styles.js, styles.js.map (styles) 12.4 kB [initial] [rendered]
chunk {vendor} vendor.js, vendor.js.map (vendor) 2.41 MB [initial] [rendered]
Date: 2020-07-24T10:14:45.963Z - Hash: 0d0b991d4a90fb86406a - Time: 6396ms
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
: Compiled successfully.

```

Now pay attention to `/api/**`, this time it is pointing to `https://httpbin.org` and let us start testing them.

```bash
$ curl -v "http://localhost:4200/api/get"
*   Trying 127.0.0.1:4200...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 4200 (#0)
> GET /api/get HTTP/1.1
> Host: localhost:4200
> User-Agent: curl/7.68.0
> Accept: */*
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< X-Powered-By: Express
< access-control-allow-origin: *
< date: Fri, 24 Jul 2020 10:14:47 GMT
< content-type: application/json
< content-length: 254
< connection: close
< server: gunicorn/19.9.0
< access-control-allow-credentials: true
< 
{
  "args": {}, 
  "headers": {
    "Accept": "*/*", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.68.0", 
    "X-Amzn-Trace-Id": "Root=1-5f1ab497-c6dec943364c39xxxxxxxxxx"
  }, 
  "origin": "XXX.XXX.XXX.XXX", 
  "url": "https://httpbin.org/get"
}
* Closing connection 0

```

Now you see it is returning a completly different response.

## Conclusion

In a real world nobody will be having configurations to completly different type of services. Since this was a demo and wanted to show that is very poosible to setup configuration to completly different services, I had used this. For a realworld problem when we want to have different configuration for different evnironments like, `DEV`, `QA`, `UAT`, `STAGE`, etc, it is very easy to add such configurations and use them in your projects.

If you have any feedback on this please open a issue and I will get back to you.

Happy Coding!
