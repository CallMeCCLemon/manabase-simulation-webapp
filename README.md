# ManaBase Simulation Webapp

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm install
npm run dev -- --open
# OR run against local dependencies
npm run dev-local -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

## Deploying

Currently, I am updating the k8s deployment manually by pushing the image to the image registry and then restarting the deployment.
This is currently scripted in the `deploy.sh` script and is run on the control-plane node in the cluster.

```bash
./deploy.sh
```
