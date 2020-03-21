export default `
zeroconfig-webapp-scripts build app
zeroconfig-webapp-scripts start app

--static-file-directories "public static ..."
--static-file-packages "package1 package2 ..."
--size-report true | false
--mode production | development
--output /path/to
--vendor-file-name vendor
--style-file-name style
--chunk-path path/to
--public-path /path/to
--port 3100
--server-port 4100
--https true | false
--https-key path-to-custom.key
--https-cert path-to-custom.crt`;
