import * as path from 'path';
import { Reporter } from '@parcel/plugin';

const normalisePath = (p: string) => {
  return p.replace(/[\\/]+/g, '/');
};

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

    for (let [targetDir, bundles] of bundlesByTarget) {
      let manifest = {};

      for (let bundle of bundles) {
        const mainEntry = bundle.getMainEntry();
        const publicUrl = bundle.target.publicUrl || '';
        if (mainEntry) {
          const assetPath = mainEntry.filePath;
          const assetName = normalisePath(path.relative(options.rootDir, assetPath));
          const bundleUrl = normalisePath(`${bundle.target.publicUrl}/${bundle.name}`);

          manifest[assetName] = bundleUrl;
        }
      }

      const targetPath = `${targetDir}/parcel-manifest.json`;
      await options.outputFS.writeFile(targetPath, JSON.stringify(manifest));
      console.log(`📄 Wrote bundle manifest to: ${targetPath}`);
    }
  },
});
