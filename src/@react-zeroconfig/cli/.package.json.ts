import { PackageJsonFactoryFunction } from 'trism';

export default ((computedPackageJson) => ({
  ...computedPackageJson,
  bin: {
    zeroconfig: './bin/zeroconfig.js',
  },
})) as PackageJsonFactoryFunction;
