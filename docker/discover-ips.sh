

echo "Discovering container IPs..."
PROD_CLIENT_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{if eq .NetworkID "'$(docker network inspect -f '{{.Id}}' team77-prod-network 2>/dev/null || echo "none")'"}}.IPAddress{{end}}{{end}}' team77-prd-client 2>/dev/null || echo "not-found")
PROD_SERVER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{if eq .NetworkID "'$(docker network inspect -f '{{.Id}}' team77-prod-network 2>/dev/null || echo "none")'"}}.IPAddress{{end}}{{end}}' team77-prd-server 2>/dev/null || echo "not-found")
DEV_CLIENT_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{if eq .NetworkID "'$(docker network inspect -f '{{.Id}}' team77-dev-network 2>/dev/null || echo "none")'"}}.IPAddress{{end}}{{end}}' team77-dev-client 2>/dev/null || echo "not-found")
DEV_SERVER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{if eq .NetworkID "'$(docker network inspect -f '{{.Id}}' team77-dev-network 2>/dev/null || echo "none")'"}}.IPAddress{{end}}{{end}}' team77-dev-server 2>/dev/null || echo "not-found")

echo "Container IPs on their respective networks:"
echo "PROD_CLIENT_IP: $PROD_CLIENT_IP (team77-prod-network)"
echo "PROD_SERVER_IP: $PROD_SERVER_IP (team77-prod-network)"
echo "DEV_CLIENT_IP: $DEV_CLIENT_IP (team77-dev-network)"
echo "DEV_SERVER_IP: $DEV_SERVER_IP (team77-dev-network)"


cat > ~/nginx.conf << EOL
server {
    listen 80;
    server_name team77.dev.bham.team team77.bham.team unihub.bham.team;
    return 301 https://\$host\$request_uri;

    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
        try_files \$uri =404;
    }
}

# Development Environment (team77.dev.bham.team)
server {
    listen 443 ssl;
    server_name team77.dev.bham.team;

    ssl_certificate /etc/nginx/ssl/dev/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/dev/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
        try_files \$uri =404;
    }

    client_max_body_size 10M;

    location /uploads/ {
        proxy_pass http://$DEV_SERVER_IP:8080/uploads/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/ {
        proxy_pass http://$DEV_SERVER_IP:8080/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    location / {
        proxy_pass http://$DEV_CLIENT_IP:3000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Production Environment (team77.bham.team & unihub.bham.team)
server {
    listen 443 ssl;
    server_name team77.bham.team unihub.bham.team;

    ssl_certificate /etc/nginx/ssl/prod/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/prod/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
        try_files \$uri =404;
    }

    client_max_body_size 10M;

    location /uploads/ {
        proxy_pass http://$PROD_SERVER_IP:8080/uploads/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/ {
        proxy_pass http://$PROD_SERVER_IP:8080/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    location / {
        proxy_pass http://$PROD_CLIENT_IP:8080/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOL

if [ -d ~/team-project-dev ]; then
  cp ~/nginx.conf ~/team-project-dev/nginx.conf
fi

if [ -d ~/team-project-prod ]; then
  cp ~/nginx.conf ~/team-project-prod/nginx.conf
fi

echo "NGINX configuration generated successfully."