import * as path from 'path';
import { Reporter } from '@parcel/plugin';

export default new Reporter({
  async report({ event, options }) {
    if (event.type !== 'buildSuccess') {
      return;
    }

    let bundlesByTarget = new Map();
    for (let bundle of event.bundleGraph.getBundles()) {
      if (!bundle.isInline) {
        let bundles = bundlesByTarget.get(bundle.target.distDir);
        if (!bundles) {
          bundles = [];
          bundlesByTarget.set(bundle.target.distDir, bundles);
        }

        bundles.push(bundle);
      }
    }

    // TODO: add publicUrl in pluginOptions inside @parcel/core
    let publicUrl = process.env.PUBLIC_URL || '/';
    for (let [targetDir, bundles] of bundlesByTarget) {
      let manifest = {};

      for (let bundle of bundles) {
        const mainEntry = bundle.getMainEntry();
        if (mainEntry) {
          const assetPath = bundle.getMainEntry().filePath;
          const assetName = path.relative(options.rootDir, assetPath);
          const bundleUrl = publicUrl + bundle.name;
          manifest[assetName] = bundleUrl.replace(/[\\/]+/g, '/');
        }
      }

      const targetPath = `${targetDir}/parcel-manifest.json`;
      await options.outputFS.writeFile(targetPath, JSON.stringify(manifest));
      console.log(`📄 Wrote bundle manifest to: ${targetPath}`);
    }
  },
});
