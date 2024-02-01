# safeGPT
A ChatGPT Gateway that applies custom filters before sending requests and keeps chats in a searchable web app with RBAC. 

# Disclaimer
This is a development preview without any kind of warranty. If you are using this in production, it's YOUR responsibility to thoroughly test and harden all services and infrastructure components.

## Generate Services with jHipster
jhipster jdl jhipster-config.jdl

### Build and run
To generate the service Docker image(s), run:
./mvnw -ntp -Pprod verify jib:dockerBuild -Djib-maven-plugin.architecture=arm64 in safeGPT/conversationService
./mvnw -ntp -Pprod verify jib:dockerBuild -Djib-maven-plugin.architecture=arm64 in safeGPT/webApp

Launch all your infrastructure by running:

```bash
cd docker-compose
docker compose -p safegpt up -d
```

## Dev setup
webApp: http://localhost:8081


Important: before you can use Keycloak, you have to add an entry in your etc/hosts:
```
127.0.0.1 keycloak
```
or else the redirection will not work for you. The reason for this is that Docker will use service names to reach services internally.

Alternatively, use browser options like:
```
chromium --host-resolver-rules="MAP keycloak localhost"
```
