# Local Patch Notes

This directory is a local snapshot of the currently installed Bird package from:

`/Users/erlinhoxha/.bun/install/global/node_modules/@steipete/bird`

Local ownership metadata has been updated to `@erlinhoxha/bird`.

It includes the local request/auth changes applied to make Bird behave closer to `twitter-cli` on the browser-mimic side.

## Included local changes

- Safari-first browser credential resolution remains unchanged.
- Browser cookie extraction was widened from only `auth_token` + `ct0` to the full X/Twitter cookie set available from the selected browser source.
- The request `Cookie` header is now built from that fuller browser cookie set.
- Cookie resolution now includes verification against X endpoints plus a small on-disk cache for re-use.
- Additional browser-style request headers were added:
  - `sec-ch-ua`
  - `sec-ch-ua-mobile`
  - `sec-ch-ua-platform`
  - `sec-fetch-dest`
  - `sec-fetch-mode`
  - `sec-fetch-site`
  - `priority`

## Main patched files

- `dist/lib/cookies.js`
- `dist/lib/twitter-client-base.js`

## Verification completed on 2026-03-10

Smoke tests passed:

- `bird check`
- `bird whoami`
- `bird home`

Programmatic checks passed:

- Credential source still resolves as Safari first.
- Resolved cookie header contains more than two cookies.
- Cookie verification and cached credential reuse did not break login flow.
- Browser-style request headers are present in the constructed request headers.

Additional parity work added later on 2026-03-10:

- Native JS request bridge added in `dist/lib/twitter-request-bridge.js`
- `cuimp` is used for curl-impersonate-backed request transport
- `x-client-transaction-id` is generated via the `x-client-transaction-id` package
- Multipart `FormData` upload requests are serialized and sent through the same native JS bridge path
- Cookie verification in `dist/lib/cookies.js` now uses the same request bridge first, so auth checks follow the browser-impersonated transport path before falling back to native `fetch`
- Default Chrome `User-Agent` and `sec-ch-ua` values now sync to the actual `cuimp` binary version resolved on the machine instead of staying pinned to a fixed version
- Bird now vendors the browser cookie reader slice it needs under `dist/lib/vendor/sweet-cookie/`, and the runtime dependency on `@erlinhoxha/sweet-cookie` has been removed from `package.json`

## Not fully verified

- Full upstream test suite was not run.
- Every Bird subcommand was not exercised.
- The local repo still contains an unused `.venv` directory from the earlier Python-bridge experiment because recursive deletion was blocked in this environment.
- Full upstream source tests still were not available in this packaged snapshot.
