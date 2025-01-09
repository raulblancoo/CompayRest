# Etapa de construcción
FROM node:18-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación al directorio de trabajo
COPY . .

# Construye la aplicación para producción, generando los archivos estáticos en /app/build
RUN npm run build

# Etapa de producción: utiliza una imagen ligera de Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copia los archivos construidos desde la etapa de construcción al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Opcional: Si tienes una configuración personalizada de Nginx, descomenta la línea siguiente y asegúrate de tener el archivo nginx.conf
# COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto 80 para acceder a la aplicación
EXPOSE 80

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
