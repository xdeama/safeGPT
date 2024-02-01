# JHipster generated Docker-Compose configuration

## Usage

Launch all your infrastructure by running: `docker compose up -d`.

## Configured Docker services

### Service registry and configuration server:

- [Consul](http://localhost:8500)

### Applications and dependencies:

- conversationService (microservice application)
- conversationService's postgresql database
- conversationService's elasticsearch search engine
- webApp (gateway application)
- webApp's postgresql database
- webApp's elasticsearch search engine

### Additional Services:

- Kafka
- Zookeeper
- [Keycloak server](http://localhost:9080)
