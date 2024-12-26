git pull
docker build --platform=linux/amd64 -t 10.0.0.108:32000/manabase-simulation-webapp:thomas-latest -f dockerfile .
docker push 10.0.0.108:32000/manabase-simulation-webapp:thomas-latest
kubectl rollout restart deployment -n mtg-mana-sim-app manabase-simulation-webapp-deployment
