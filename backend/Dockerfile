# multi-stage build to compile and package the Spring Boot application

# STAGE 1: Build
# Use an image that contains Maven and the JDK
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy the pom.xml first and download dependencies. 
# This caches the downloads so future builds are faster
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the actual source code and compile
COPY src ./src
# We skip tests here because our tests use Testcontainers. 
# Running Docker-in-Docker during an image build is extremely complex.
# We will rely on Jenkins to run our tests before building the image.
RUN mvn clean package -DskipTests

# STAGE 2: Runtime
# Use a tiny Alpine Linux image that ONLY contains the Java Runtime (JRE), no source code.
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the compiled .jar file from Stage 1 into this final image
COPY --from=builder /app/target/*.jar app.jar

# Expose the port Spring Boot runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]