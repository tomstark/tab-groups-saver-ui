FROM node:24-alpine

WORKDIR /var/www/html

COPY package*.json ./

# Install dependencies depending on lockfile presence
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

CMD ["npm", "run", "dev"]
