FROM --platform=linux/amd64 node:20-alpine as base

# Add package file
COPY package.json ./
COPY yarn.lock ./
COPY ./prisma ./prisma

# Install deps
RUN yarn install

# Run prisma generate
RUN npx prisma generate

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.build.json ./tsconfig.build.json

# Build dist
RUN yarn build

# Start production image build
FROM --platform=linux/amd64 node:20-alpine

# Copy node modules and build directory
COPY --from=base ./node_modules ./node_modules
COPY --from=base /dist /dist
COPY --from=base /prisma /prisma
COPY package.json ./

# Expose port 5000
EXPOSE 5000

CMD yarn run start:migrate