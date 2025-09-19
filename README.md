# Tab Groups Saver (UI)

> This is a Chrome extension. It uses [Hot Reload Chrome Extension - Vite Plugin](https://github.com/isaurssaurav/hot-reload-extension-vite-plugin) (HRCE-VP) for rapid extension builds in development.

## 🔑 Getting Started

#### 1. Enable HTTPS for local development

- To get https working with a self-signed certificate, we'll use [mkcert](https://github.com/FiloSottile/mkcert):
```shell
# Install mkcert if needed (@link https://github.com/FiloSottile/mkcert)
brew install mkcert
brew install nss # if you use Firefox

# Create root CA (see in Keychain Access app: System > Certificates)
mkcert -install

# Create specific certs
mkcert \
-key-file docker/certs/tgs-ui-test-key.pem \
-cert-file docker/certs/tgs-ui-test-cert.pem \
tgs-ui.test
```

- Add the following to your `/etc/hosts` file:
```
127.0.0.1 tgs-ui.test
```
#### 2. Start Docker containers

See [Dev workflow](#-dev-workflow) below for more info about what happens behind the scenes.

```shell
docker compose up
```

#### 3. Visit dev URL and load the extension

The development environment is available at https://tgs-ui.test:5173. Vite’s hot module reloading is enabled here, so updates take effect instantly without needing a refresh. Additionally, every change automatically triggers the HRCE-VP plugin to rebuild the Chrome extension’s `dist` files.

To load the local Chrome extension into your browser:
- Open Chrome and go to **Manage Extensions** ([chrome://extensions](chrome://extensions))
- Click **Load unpacked** 
- Select the project’s **dist** directory and click **Open**

Once loaded, the extension functions according to the `manifest.json` configuration ([docs](https://developer.chrome.com/docs/extensions/reference/manifest)). You can refresh the page (if using `newtab`) or re-open the popup (if using `default_popup`) for updates to apply automatically. No need to re-run **Load unpacked**, it just works.

The URL will be relative to `src/pages/...`, so if you're working on a new tab for example, it'll be:
- https://tgs-ui.test:5173/src/pages/new-tab/index.html
  - For HRCE-VP to do its magic, ensure you don't forget to:
    - Uncomment the relevant line in `vite.config.ts`'s `build.rollupOptions.input` object
    - Include the relevant data in `manifest.json` 

## 👨🏻‍💻 Dev Workflow

The main command to start development is `docker compose up`. Running this kicks off the following processes inside the container:
1. Runs `npm run dev`
   - Executed via the `CMD` defined in the [Dockerfile](docker/node/Dockerfile)
   - Starts the HRCE-VP flow, which replaces the standard Vite dev server with its own extension-specific features
2. Runs `npm run dev-sidecar`
   - Executed via the `post_start` [Docker Compose lifecycle hook](https://docs.docker.com/compose/how-tos/lifecycle/)
   - Launches what is essentially the default Vite development server with hot module reloading (HMR). 
   - `NODE_ENV=dev` is set here to ensure it runs in a separate environment from HRCE-VP. Without this, an extra WebSocket would be started, which is not desired

This dual setup gives you the best of both worlds:
- The HRCE-VP process quickly generates Chrome extension–specific build outputs
- The sidecar Vite process provides HMR to the dev URL, so you can see changes instantly whilst you develop

## 🔁 Node Modules

The `node-service` mounts `node_modules` as a named volume. This mitigates the well‑known macOS file sync speed issues by keeping dependencies inside the container, enabling near‑native Linux filesystem performance for lookups and hot reloads.

Because this volume is isolated from the host, your host `node_modules` directory won't be hydrated, thus your IDE won't 'see' the installed packages, reporting missing dependencies. To fix this, 'sync' `node_modules` from the Docker container to your local filesystem with:

```shell
docker compose cp node-service:/var/www/html/node_modules .
```

## Tooling

Run the following commands inside the node-service container, or outside (from host), prefixed with `docker compose exec node-service`:
- `npm run test`
    - Run the `package.json`'s `scripts.test` (all tooling ran in parallel)
- `npm run test:types`
    - Runs TypeScript alone

Commands not prefixed with 'test' may mutate code
- `npm run lint`
    - Run ESLint with `--fix`
    - ⚠️ Where `npm run test` / `npm run test:lint` will not mutate files, this will
- `npm run format`
    - Run Prettier with `--write`
    - ⚠️ Where `npm run test`/ `npm run test:format` will not mutate files, this will

## 🎁 Build for Production

When you've finished development, the extension can be built with:
- `docker compose exec node-service npm run build`

Then zipped and uploaded, as per the [Publish in the Chrome Web Store](https://developer.chrome.com/docs/webstore/publish) docs.
