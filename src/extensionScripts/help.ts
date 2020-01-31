export default `
zeroconfig-extension-scripts watch app
zeroconfig-extension-scripts build app

--static-file-directories "public static ..."
--static-file-packages "package1 package2 ..."
--output /path/to
--vendor-file-name vendor
--style-file-name style`;