// scripts/deploy/cli.ts
import { createConfigTemplate, loadConfig } from "./config";
import { buildFrontend } from "./frontend";
import { uploadFrontend } from "./upload";
import { setRenderEnvAndDeploy } from "./render";
import { verifyAll } from "./verify";

async function main() {
  const cmd = process.argv[2];

  switch (cmd) {
    case "init":
      const p = createConfigTemplate();
      console.log(`Created ${p}. Fill in your values and re-run deploy.`);
      break;

    case "build:frontend": {
      buildFrontend();
      break;
    }

    case "upload:frontend": {
      const { distDir } = buildFrontend();
      await uploadFrontend(distDir);
      break;
    }

    case "render:deploy": {
      await setRenderEnvAndDeploy();
      break;
    }

    case "verify": {
      await verifyAll();
      break;
    }

    case "all": {
      // Full flow: build+upload frontend, set render env + trigger deploy, then verify
      const cfg = loadConfig();
      const built = buildFrontend();
      await uploadFrontend(built.distDir);
      await setRenderEnvAndDeploy();
      await verifyAll();
      break;
    }

    default:
      console.log(`Usage:
  npm run deploy:init
  npm run deploy:build:frontend
  npm run deploy:upload:frontend
  npm run deploy:render
  npm run deploy:verify
  npm run deploy:all`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
