yarn run build;
node test/updateVerdaccioYaml.js;
bash test/e2e.sh;
rm -rf out;