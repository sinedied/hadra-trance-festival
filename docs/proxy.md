# Working behind a corporate proxy

## Environment

Most tools (including npm, bower and git) use the `HTTP_PROXY` and `HTTPS_PROXY` environment variables to work with a
corporate proxy.

### Windows

In Windows environments, add the `HTTP_PROXY` and `HTTPS_PROXY` system environment variable, with these values:

- HTTP_PROXY: `http://<username>:<password>@<proxy_server>:<proxy_port>`
- HTTPS_PROXY: `%HTTP_PROXY%`

### Unix

Add these lines to your `~/.bash_profile` or `~/.profile`:
```sh
export HTTP_PROXY="http://<username>:<password>@<proxy_server>:<proxy_port>"
export HTTPS_PROXY="$HTTP_PROXY"
```

## Proxy with SSL custom certificate

Some proxy like **zscaler** use a custom SSL certificate to inspect request, which may cause npm/bower commands to
fail.

To solve this problem, you can disable the `strict-ssl` option in both npm and bower.

Also, if you have trouble building your Cordova app for Android, see the related section in the
[Cordova documentation](cordova.md).

## Proxy exceptions

If you need to access repositories on your local network that should bypass proxy, set the `NO_PROXY` environment
variable, in the same way as `HTTP_PROXY`:

### Windows

- NO_PROXY: `127.0.0.1, localhost, <your_local_server_ip_or_hostname>`

### Unix

```sh
export NO_PROXY="127.0.0.1, localhost, <your_local_server_ip_or_hostname>"
```

### Bower

Add this line to the `.bowerrc` file:
```json
"strict-ssl": false
```

### Npm

Run this command in your project directory:
```sh
npm set strict-ssl false
```
