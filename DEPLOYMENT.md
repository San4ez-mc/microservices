# Deployment Guide

## Git Repository

Use one repository for all microservices (monorepo):

- image-processor
- slide-builder
- video-processor
- remotion-renderer

Repository URL:

- https://github.com/San4ez-mc/microservices.git

## Server Layout

Deploy each service into a separate folder near /var/www/flows.fineko.space:

- /var/www/img.flows.fineko.space
- /var/www/slides.flows.fineko.space
- /var/www/video.flows.fineko.space
- /var/www/render.flows.fineko.space

## Suggested Subdomains

- img.flows.fineko.space -> image-processor (port 3001)
- slides.flows.fineko.space -> slide-builder (port 3002)
- video.flows.fineko.space -> video-processor (port 3003)
- render.flows.fineko.space -> remotion-renderer (port 3004)

## API Response Format (MCP / JSON-RPC)

All services return JSON-RPC-like envelope:

```json
{
  "jsonrpc": "2.0",
  "id": "optional-request-id",
  "result": {}
}
```

On errors:

```json
{
  "jsonrpc": "2.0",
  "id": "optional-request-id",
  "error": {
    "code": 400,
    "message": "Human readable message",
    "data": {
      "code": "INVALID_INPUT"
    }
  }
}
```

## Server Bootstrap

```bash
chmod +x scripts/*.sh
./scripts/setup_server.sh https://github.com/San4ez-mc/microservices.git main
```

## Deploy All Services

```bash
./scripts/deploy_all.sh main
```

## Deploy One Service

```bash
./scripts/deploy_service.sh img.flows.fineko.space main
```

## Process Manager

From monorepo root clone on server, you can also run PM2:

```bash
pm2 start ecosystem.config.cjs
pm2 save
```
