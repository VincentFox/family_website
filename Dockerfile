# 使用官方Nginx镜像
FROM nginx:alpine

# 删除默认的Nginx配置文件
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义配置文件
COPY nginx.conf /etc/nginx/conf.d

# 将静态文件复制到Nginx的默认托管目录
COPY . /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动Nginx服务
CMD ["nginx", "-g", "daemon off;"]