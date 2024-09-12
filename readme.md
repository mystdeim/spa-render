# SPA RENDER

## Tech stack
- https://github.com/prerender/prerender
- https://github.com/prerender/prerender-memory-cache
- https://github.com/freeletics/prerender-chrome/tree/master

## Docker
```shell
docker build -t spa-render .
docker compose -f examples/docker-compose.yaml up
```

## Example
```shell
curl --location 'http://localhost:3000/render' \
--header 'Content-Type: application/json' \
--data '{
    "url": "https://google.com"
}'
```