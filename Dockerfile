FROM mcr.microsoft.com/devcontainers/typescript-node:0-18

RUN npm install -g @nestjs/cli@10

USER node

WORKDIR /home/node/nest

CMD [ "tail", "-f", "/dev/null" ]
