FROM node:latest

RUN echo "设置工作区间"
WORKDIR /

RUN echo "开始安装依赖"
COPY package.json ./

RUN echo "设置npm的镜像源为华为源"
RUN npm config set registry https://mirrors.huaweicloud.com/repository/npm

RUN npm install -g pnpm
RUN pnpm install
RUN echo "依赖已安装"

RUN echo "开始构建产物"
RUN pnpm run docs:build
RUN echo "产物构建完成"

RUN  pnpm run docs:preview