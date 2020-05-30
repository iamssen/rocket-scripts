import { TransformPackageJson } from '@react-zeroconfig/packages';

export default ((computedPackageJson) => {
  return {
    ...computedPackageJson,
    keywords: ['hello'],
  };
}) as TransformPackageJson;
