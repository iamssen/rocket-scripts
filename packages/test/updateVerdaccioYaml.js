const yaml = require('js-yaml');
const fs = require('fs-extra');
const path = require('path');

const ssen = fs
  .readdirSync(path.join(__dirname, '../src/@ssen'))
  .filter((item) =>
    fs.statSync(path.join(__dirname, '../src/@ssen', item)).isDirectory(),
  );

const prev = yaml.load(
  fs.readFileSync(path.join(__dirname, 'verdaccio.yaml'), 'utf8'),
);
const next = {
  ...prev,
  packages: {
    'rocket-scripts': { access: '$anonymous', publish: '$anonymous' },
    '@rocket-scripts/*': { access: '$anonymous', publish: '$anonymous' },
    ...ssen.reduce((pkgs, dir) => {
      pkgs[`@ssen/${dir}`] = { access: '$anonymous', publish: '$anonymous' };
      return pkgs;
    }, {}),
    '**': { access: '$anonymous', publish: '$anonymous', proxy: 'npmjs' },
  },
};

const yamlString = yaml.dump(next);

fs.writeFileSync(path.join(__dirname, 'verdaccio.yaml'), yamlString, {
  encoding: 'utf8',
});
