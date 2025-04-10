#!/bin/bash

# 显示说明
echo "正在准备启动前端服务 (端口: 8099)..."

# 查找并杀死占用8099端口的进程
PORT_PID=$(lsof -ti:8099)
if [ ! -z "$PORT_PID" ]; then
  echo "发现端口8099已被进程 $PORT_PID 占用，正在结束该进程..."
  kill -9 $PORT_PID
  echo "已关闭原有进程"
  sleep 1
fi

# 启动前端服务
echo "正在启动前端服务..."
npm run serve 