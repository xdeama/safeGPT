package gatling.simulations;

import static io.gatling.javaapi.core.CoreDsl.StringBody;
import static io.gatling.javaapi.core.CoreDsl.css;
import static io.gatling.javaapi.core.CoreDsl.exec;
import static io.gatling.javaapi.core.CoreDsl.rampUsers;
import static io.gatling.javaapi.core.CoreDsl.scenario;
import static io.gatling.javaapi.http.HttpDsl.header;
import static io.gatling.javaapi.http.HttpDsl.headerRegex;
import static io.gatling.javaapi.http.HttpDsl.http;
import static io.gatling.javaapi.http.HttpDsl.status;

import ch.qos.logback.classic.LoggerContext;
import io.gatling.javaapi.core.ChainBuilder;
import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;
import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import org.slf4j.LoggerFactory;

/**
 * Performance test for the Actor entity.
 */
public class ActorGatlingTest extends Simulation {

    LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();

    {
        // Log all HTTP requests
        //context.getLogger("io.gatling.http").setLevel(Level.valueOf("TRACE"));
        // Log failed HTTP requests
        //context.getLogger("io.gatling.http").setLevel(Level.valueOf("DEBUG"));
    }

    String baseURL = Optional.ofNullable(System.getProperty("baseURL")).orElse("http://localhost:8081");

    HttpProtocolBuilder httpConf = http
        .baseUrl(baseURL)
        .inferHtmlResources()
        .acceptHeader("*/*")
        .acceptEncodingHeader("gzip, deflate")
        .acceptLanguageHeader("fr,fr-fr;q=0.8,en-us;q=0.5,en;q=0.3")
        .connectionHeader("keep-alive")
        .userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:33.0) Gecko/20100101 Firefox/33.0")
        .silentResources() // Silence all resources like css or css so they don't clutter the results
        .disableFollowRedirect() // We must follow redirects manually to get the xsrf token from the keycloak redirect
        .disableAutoReferer();

    Map<String, String> headers_http = Map.of("Accept", "application/json");

    Map<String, String> headers_http_authenticated = Map.of("Accept", "application/json", "X-XSRF-TOKEN", "${xsrf_token}");

    Map<String, String> keycloakHeaders = Map.of(
        "Accept",
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Upgrade-Insecure-Requests",
        "1"
    );

    ChainBuilder scn = exec(
        http("First unauthenticated request")
            .get("/api/account")
            .headers(headers_http)
            .check(status().is(302))
            .check(headerRegex("Set-Cookie", "XSRF-TOKEN=(.*);[\\s]").saveAs("xsrf_token"))
    )
        .exitHereIfFailed()
        .pause(10)
        .exec(http("Authentication").get("/oauth2/authorization/oidc").check(status().is(302)).check(header("Location").saveAs("loginUrl")))
        .exitHereIfFailed()
        .pause(2)
        .exec(
            http("Login Redirect")
                .get("${loginUrl}")
                .silent()
                .headers(keycloakHeaders)
                .check(css("#kc-form-login", "action").saveAs("kc-form-login"))
        )
        .exitHereIfFailed()
        .pause(10)
        .exec(
            http("Authenticate")
                .post("${kc-form-login}")
                .silent()
                .headers(keycloakHeaders)
                .formParam("username", "admin")
                .formParam("password", "admin")
                .formParam("submit", "Login")
                .check(status().is(302))
                .check(header("Location").saveAs("afterLoginUrl"))
        )
        .exitHereIfFailed()
        .pause(2)
        .exec(
            http("After Login Redirect")
                .get("${afterLoginUrl}")
                .silent()
                .check(status().is(302))
                .check(header("Location").saveAs("finalRedirectUrl"))
                .check(headerRegex("Set-Cookie", "XSRF-TOKEN=(.*);[\\s]").saveAs("xsrf_token"))
        )
        .exec(http("Final Redirect").get("${finalRedirectUrl}").silent().check(status().is(200)))
        .exitHereIfFailed()
        .pause(2)
        .exec(http("Authenticated request").get("/api/account").headers(headers_http_authenticated).check(status().is(200)))
        .pause(10)
        .repeat(2)
        .on(
            exec(
                http("Get all actors")
                    .get("/services/conversationservice/api/actors")
                    .headers(headers_http_authenticated)
                    .check(status().is(200))
            )
                .pause(Duration.ofSeconds(10), Duration.ofSeconds(20))
                .exec(
                    http("Create new actor")
                        .post("/services/conversationservice/api/actors")
                        .headers(headers_http_authenticated)
                        .body(StringBody("{" + "\"name\": \"SAMPLE_TEXT\"" + "}"))
                        .asJson()
                        .check(status().is(201))
                        .check(headerRegex("Location", "(.*)").saveAs("new_actor_url"))
                )
                .exitHereIfFailed()
                .pause(10)
                .repeat(5)
                .on(
                    exec(http("Get created actor").get("/services/conversationservice${new_actor_url}").headers(headers_http_authenticated))
                        .pause(10)
                )
                .exec(
                    http("Delete created actor").delete("/services/conversationservice${new_actor_url}").headers(headers_http_authenticated)
                )
                .pause(10)
        );

    ScenarioBuilder users = scenario("Test the Actor entity").exec(scn);

    {
        setUp(users.injectOpen(rampUsers(Integer.getInteger("users", 100)).during(Duration.ofMinutes(Integer.getInteger("ramp", 1)))))
            .protocols(httpConf);
    }
}
