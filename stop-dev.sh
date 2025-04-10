#!/bin/bash

# 查找并杀死占用8099端口的进程
PORT_PID=$(lsof -ti:8099)
if [ ! -z "$PORT_PID" ]; then
  echo "正在停止前端服务，进程ID: $PORT_PID"
  kill -9 $PORT_PID
  echo "前端服务已停止"
else
  echo "前端服务未在运行"
fi 