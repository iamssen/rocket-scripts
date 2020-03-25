module.exports = (computedPackageJson, rootPackageJson) => {
  const dependencies = {
    ...rootPackageJson.dependencies,
    ...rootPackageJson.devDependencies,
  };

  return {
    ...computedPackageJson,
    dependencies: {
      ...computedPackageJson.dependencies,
      
      // jest preset files
      'babel-jest': dependencies['babel-jest'],
      crypto: dependencies['crypto'],
      'js-yaml': dependencies['js-yaml'],
    },
  };
};
