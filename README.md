# safeGPT
A ChatGPT Gateway that applies custom filters before sending requests and keeps chats in a searchable web app with RBAC. 

# Disclaimer
This is a development preview without any kind of warranty. If you are using this in production, it's YOUR responsibility to thoroughly test and harden all services and infrastructure components.

## Generate Services with jHipster
Design services and entities: https://start.jhipster.tech/design-entities
Generate code:
```zsh
jhipster jdl jhipster-config.jdl
```

## Build and run locally

### Restore jHipster npm dependencies
```zsh
npm install
```

### MacOS Apple Silicon

#### Maven Docker Build
To generate the service Docker image(s), run:
```zsh
cd conversationService
./mvnw -ntp -Pprod verify jib:dockerBuild -Djib-maven-plugin.architecture=arm64
```

```zsh
cd webApp
./mvnw -ntp -Pprod verify jib:dockerBuild -Djib-maven-plugin.architecture=arm64
```

#### Docker Infrastructure
Launch all your infrastructure by running:

```zsh
cd docker-compose
docker compose -p safegpt up -d
```
#### Open Web App
Open webApp: http://localhost:8081

Important: before you can use Keycloak, you have to add an entry in your etc/hosts:
```
127.0.0.1 keycloak
```
or else the redirection will not work for you. The reason for this is that Docker will use service names to reach services internally.

Alternatively, use browser options like:
```zsh
chromium --host-resolver-rules="MAP keycloak localhost" http://localhost:8081
```

### Run spring
https://www.jhipster.tech/development/#working-with-angular
```zsh
./mvnw
```
runs default task: spring-boot:run

### Run Angular with live reload (without webpack tasks)
https://www.jhipster.tech/development/#working-with-angular
```zsh
./mvnw -P-webapp
```
executes npm start


### Configure IDE
https://www.jhipster.tech/configuring-ide-idea/
