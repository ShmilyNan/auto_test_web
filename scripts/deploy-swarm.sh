#!/usr/bin/env bash
set -Eeuo pipefail

STACK_NAME="${STACK_NAME:-autotest-web}"
IMAGE_NAME="${IMAGE_NAME:-autotest-web:latest}"
API_PROXY_ORIGIN="${API_PROXY_ORIGIN:-http://api.autotest:5000}"
PUBLISHED_PORT="${PUBLISHED_PORT:-8080}"
NEXT_PUBLIC_API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL:-/api/v1}"

# 检查 Docker
if ! command -v docker >/dev/null 2>&1; then
  echo "[ERROR] docker 未安装。"
  exit 1
fi

# 检查 Swarm 状态
if ! docker info --format '{{.Swarm.LocalNodeState}}' | grep -qE 'active|pending'; then
  echo "[INFO] 初始化 Docker Swarm..."
  docker swarm init >/dev/null 2>&1 || true
fi

# 检查后端网络是否存在
if ! docker network inspect autotest-network >/dev/null 2>&1; then
  echo "[ERROR] 后端网络 autotest-network 不存在，请先部署后端栈。"
  exit 1
fi

echo "[INFO] 构建镜像: ${IMAGE_NAME}"
docker build \
  --build-arg API_PROXY_ORIGIN="${API_PROXY_ORIGIN}" \
  -t "${IMAGE_NAME}" .

echo "[INFO] 部署 Stack: ${STACK_NAME}"
STACK_NAME="${STACK_NAME}" \
IMAGE_NAME="${IMAGE_NAME}" \
API_PROXY_ORIGIN="${API_PROXY_ORIGIN}" \
PUBLISHED_PORT="${PUBLISHED_PORT}" \
NEXT_PUBLIC_API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL}" \
  docker stack deploy --compose-file deploy/swarm-stack.yaml "${STACK_NAME}" --resolve-image never

echo "[INFO] 当前服务状态"
docker stack services "${STACK_NAME}"

echo "[DONE] 部署完成。访问地址: http://localhost:${PUBLISHED_PORT}"
echo "[TIP] 请确保后端服务(http://api.autotest:5000)可从容器内访问，并且 API_PROXY_ORIGIN 指向后端根地址(不带 /api/v1)。"
