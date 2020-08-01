import { PackageJsonTransformFunction } from 'rocket-punch';
import { PackageJson } from 'type-fest';
import rootPackageJson from '../../../package.json';

export const transformPackageJson: PackageJsonTransformFunction = (computedPackageJson) => {
  const dependencies: PackageJson.Dependency = computedPackageJson.dependencies || {};

  const rootDependencies: PackageJson.Dependency = {
    ...rootPackageJson['dependencies'],
    ...rootPackageJson['devDependencies'],
  };

  const optional: Set<string> = new Set<string>([
    // find "try {" in IDE
    'less-loader',
    'sass-loader',
    '@handbook/babel-plugin',
    'eslint-loader',
    'eslint',
  ]);

  const optionalDependencies: PackageJson.Dependency = {};

  for (const packageName of optional) {
    if (dependencies[packageName]) {
      delete dependencies[packageName];
    }

    if (rootDependencies[packageName]) {
      optionalDependencies[packageName] = rootDependencies[packageName];
    }
  }

  return {
    ...computedPackageJson,

    dependencies,
    optionalDependencies,
  };
};
