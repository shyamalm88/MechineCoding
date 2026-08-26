# How to upload and download a file in the browser?

## Reading a selected file

```js
const file = event.target.files[0]     // a File, which is a Blob
await file.text()                      // string
await file.arrayBuffer()               // binary
URL.createObjectURL(file)              // a URL pointing at it
```

Modern `File` methods return promises, so `FileReader` with its `onload`
callbacks is no longer necessary — though interviewers may still ask for it.

## createObjectURL vs FileReader.readAsDataURL

| | Object URL | Data URL (base64) |
|---|---|---|
| Size | Pointer, ~40 chars | **~33% larger than the file** |
| Speed | Instant | Encodes the whole file |
| Cleanup | **Must revoke** | None |
| Persists | Until revoked/unload | Self-contained string |

For previewing a 10MB image, `createObjectURL` is the right call. Base64 is for
when the string must be embedded or transmitted inline.

**`URL.revokeObjectURL(url)` is mandatory** — an unrevoked object URL keeps the
entire file in memory for the lifetime of the document. This is a real leak in
image-heavy apps.

## Triggering a download

```js
const blob = new Blob([data], { type: 'application/json' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'data.json'      // the attribute that forces download over navigation
a.click()
URL.revokeObjectURL(url)
```

The `download` attribute is what makes the browser save rather than navigate.
It is **same-origin only** — pointing it at a cross-origin URL is ignored and
the browser navigates instead. For cross-origin, the server must send
`Content-Disposition: attachment`.

## Uploading

```js
const form = new FormData()
form.append('file', file)
await fetch('/upload', { method: 'POST', body: form })
```

Do **not** set `Content-Type` manually — the browser must generate it to include
the multipart boundary. Setting it yourself breaks the request.

For progress, `fetch` still cannot report upload progress; `XMLHttpRequest`'s
`upload.onprogress` remains the way.

## Traps

- `<input type="file">` is always **uncontrolled** — its value cannot be set
  programmatically, for security.
- `file.type` comes from the extension and is trivially spoofed. Never trust it
  for validation; check server-side.
- Selecting the same file twice fires no `change` event unless you reset
  `input.value = ''`.
