# Etapa de ejecución: utiliza una imagen ligera de OpenJDK 17
#FROM openjdk:17-jdk-alpine
FROM openjdk:22-jdk

# Establece el directorio de trabajo
WORKDIR /app

# Copia el JAR construido desde la etapa de construcción
#COPY --from=build /app/target/*.jar app.jar
COPY target/CompayRest-0.0.1-SNAPSHOT.jar app.jar

# Expone el puerto que utiliza la aplicación Spring Boot
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
