import getPackageJson, { AbbreviatedMetadata, AbbreviatedVersion } from 'package-json';

describe('createPublishOptions', () => {
  it('Should be got versions', () => {
    return getPackageJson('react-zeroconfig').then((value: AbbreviatedMetadata) => {
      expect(typeof value.version).toEqual('string');
    });
  });
});