### Certbot configuration

```bash
sudo ~/.certbot-env/bin/certbot certonly \
  --authenticator dns-namecheap \
  --dns-namecheap-credentials /etc/letsencrypt/namecheap.ini \
  --dns-namecheap-propagation-seconds 120 \
  -d "*.torqbit.com" \
  --agree-tos --no-eff-email --email super@torqbit.com
```

certbot certonly \
 --dns-namecheap \
 --dns-namecheap-credentials /etc/letsencrypt/namecheap.ini \
 --dns-namecheap-propagation-seconds 60 \
 -d torqbit.com \
 -d \*.torqbit.com

### Point Nginx to the Wildcard SSL Cert

```bash
ssl_certificate     /etc/letsencrypt/live/torqbit.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/torqbit.com/privkey.pem;
```

### Run the redis and qdrant services

#### Start the Qdrant service in the background

```bash
docker run -p 6333:6333 -p 6334:6334 -d --restart unless-stopped \
  -v /opt/torqbit/services/qdrant_storage:/qdrant/storage \
  qdrant/qdrant:v1.14.1
```

#### Start the redis service in the background

```bash
docker run -p 6379:6379 -d --restart unless-stopped \
  -v /opt/torqbit/services/redis_data:/data \
  redis:7.0.10
```
