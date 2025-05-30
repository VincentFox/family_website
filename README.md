# 家庭网站聚合中心

![示例截图](https://raw.githubusercontent.com/VincentFox/blog_img/main/images/CleanShot%202025-05-30%20at%2020.17.49@2x.png)

现代化的家庭导航网站，集成常用网站管理与快速访问功能，支持多设备访问和个性化配置。

## 功能特性 ✨
- 🗂️ 动态分类管理（添加/删除）
- 🌐 网站收藏（支持自定义图标）
- 🔍 即时搜索（名称/URL关键词）
- 🎨 毛玻璃效果 + 动态渐变背景
- 📱 响应式布局（适配移动端）

## 技术栈 💻
- **前端三件套**：HTML5 + CSS3 + ES6
- **持久化存储**：LocalStorage
- **容器化部署**：Docker + Nginx
- **UI框架**：Font Awesome 6

## 部署指南 🚀
```bash
# 构建镜像
docker build -t family-website .

# 运行容器（端口可自定义）
docker run -d -p 8080:80 --name website family-website