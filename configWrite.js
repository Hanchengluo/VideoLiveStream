'use strict'

// 配置写入模块  
// 写入项目所有配置

const configuration = require('./configuration.js')
const fs = require('fs')
const os = require('os')


// Nginx配置
exports.nginx = function(){
    fs.writeFile(INDEXPATH + '/etc/nginx/conf/nginx.conf', `
    # user adminstrator adminstrators;    
    worker_processes  auto;
    error_log  ${INDEXPATH}/etc/nginx/logs/error.log;


    events {
        #use   epoll;
        worker_connections  1024;
        multi_accept on; 
    }


    http {
        include       mime.types;
        default_type  application/octet-stream;
        charset UTF-8;
        access_log   off;
        server_tokens off;
        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 10;
        client_header_timeout 10;
        client_body_timeout 10;
        reset_timedout_connection on;
        send_timeout 10;
        gzip  on;
        gzip_disable "MSIE [1-6]\.(?!.*SV1)";
        gzip_proxied any;
        gzip_min_length 1000;
        gzip_comp_level 4;
        gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript image/png image/jpg;
        client_header_buffer_size    1k;
        large_client_header_buffers  4 4k;
        limit_conn_zone $binary_remote_addr zone=addr:5m;
        limit_conn addr 100;
        open_file_cache max=100000 inactive=20s;
        open_file_cache_valid 30s;
        open_file_cache_min_uses 2;
        open_file_cache_errors on;
        log_format log_access  '$remote_addr - $remote_user [$time_local] "$request" "$request_time" "$upstream_response_time"'
                  '$status $body_bytes_sent "$http_referer" '
                  '"$http_user_agent" $http_x_forwarded_for $host $hostname' ;
        map $http_upgrade $connection_upgrade {
            default upgrade;
            ''      close;
        }

        server {
            listen       80;
            server_name  ${configuration.hostname};

            location / {
                proxy_pass  http://localhost:88;
                proxy_redirect     off;
                proxy_set_header   Host             $host;
                proxy_set_header   X-Real-IP        $remote_addr;
                proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
                proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
                proxy_max_temp_file_size 0;
                proxy_connect_timeout      90;
                proxy_send_timeout         90;
                proxy_read_timeout         90;
                proxy_buffer_size          4k;
                proxy_buffers              4 32k;
                proxy_busy_buffers_size    64k;
                proxy_temp_file_write_size 64k;
            }

            location /socket.io/ {
                proxy_pass http://localhost:86;
                proxy_redirect    off;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header Host $host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
            }

            location /LiveStream/ {
                types {
                    application/vnd.apple.mpegusr m3u8;
                    video/mp2t ts;
                }
                root ${INDEXPATH}/stream;
                add_header Cache-Control no-cache;
            }

            location ~ /\.ht {
                deny all;
            }

         }
    }
    `, 'utf8', (Error)=> (Error && console.log(Error)))
}


// HTML应用缓存配置
exports.appcache = function(){
    fs.readFile(INDEXPATH + '/appcache.json', function(Error, data){
        Error && console.log(Error)
        let config = JSON.parse(data.toString())
        let appcache = new String()
        appcache += `CACHE MANIFEST${os.EOL}# ${config.TIME}  ${config.AUTHO}${os.EOL}` // 维护信息
        if(configuration.project == true){
            appcache += `# ${Date.now()}${os.EOL}`
        }
        for(let i of config.CACHEMANIFEST){
            appcache += i + os.EOL
        }
        appcache += `${os.EOL}NETWORK:${os.EOL}`
        if(config.NETWORK.length == 0){
            appcache += `*${os.EOL}`
        }else{
            for(let i of config.NETWORK){
                appcache += `${i}${os.EOL}`
            }
        }
        appcache += `${os.EOL}FALLBACK:${os.EOL}`
        let FALLBACK = Object.keys(config.FALLBACK)
        if(FALLBACK.length != 0){
            for(let i of FALLBACK){
                appcache += `${FALLBACK} ${config.FALLBACK[FALLBACK]}${os.EOL}`
            }
        }
        fs.writeFile(INDEXPATH + '/page/appcache/package.appcache', appcache, 'utf8', (Error) => (Error && console.log(Error)))
    })
}