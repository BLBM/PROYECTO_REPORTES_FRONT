# Usa una imagen base de Node.js
FROM node:18.16-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código del proyecto
COPY . .

# Exponer el puerto 7008
EXPOSE 7008

# Comando para correr la aplicación en modo desarrollo
CMD ["npm", "start"]
