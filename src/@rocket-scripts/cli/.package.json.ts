import { PackageJsonTransformFunction } from 'rocket-punch';

export default ((computedPackageJson) => ({
  ...computedPackageJson,
  bin: {
    'rocket-scripts': './bin/rocket-scripts.js',
  },
})) as PackageJsonTransformFunction;
