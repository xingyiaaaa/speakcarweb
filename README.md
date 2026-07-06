# 智能巡检平台控制系统

基于 Vue3 + TypeScript + Element Plus 构建的智能巡检机器人平台控制系统前端应用，支持与 ROS2 Bridge 实时通信。

## 功能特性

### 🏠 主界面布局
- **顶部导航栏**：机器人状态监控（电池、电压、速度、运行模式）、连接配置（IP地址、端口）、连接状态指示
- **左侧工具栏**：地图浏览、建图、定位、导航、航点编辑、路径编辑、摄像头、日志、设置
- **中央地图区域**：基于 Canvas 的 2D SLAM 地图渲染，支持缩放、拖拽、激光雷达可视化、点云实时显示
- **右侧控制面板**：建图管理、导航控制、摄像头显示、3D点云、手动控制、系统设置
- **底部状态栏**：实时监控 FPS、ROS 状态、WebSocket 状态、系统资源占用（CPU、内存）
- **数据面板**：ROS话题列表、消息类型、实时数据预览

### 🗺️ 地图功能
- 地图加载与保存
- 建图模式（开始/停止建图）
- 重定位功能
- 地图缩放与拖拽
- 机器人位置标记与方向指示
- 激光雷达扫描可视化
- 2D点云实时显示（来自 `/lidar_points` 话题）
- 自动居中对齐点云数据

### 🧭 导航功能
- **航点绘制**：点击地图添加单个航点，或连续绘制航线
- **航点管理**：查看、删除单个航点，清除所有航点
- **路线管理**：保存、加载、删除路线
- **导航控制**：开始、暂停、继续、取消导航
- **进度显示**：实时显示导航进度和当前航点
- **绘制模式限制**：仅在导航模块且启用"添加航点"模式时可绘制，默认选择/拖拽模式

### 📷 摄像头功能
- 车载摄像头画面显示（`/camera/image_raw/compressed` 话题）
- Gazebo 视图切换
- 帧率统计
- 支持 JPEG/PNG 格式压缩图像

### ☁️ 3D点云
- Three.js 3D点云渲染
- 实时接收 `/lidar_points` 话题数据
- 交互式旋转（左键拖动）和缩放（滚轮）

- 网格辅助线和坐标轴显示
- 点云数量实时统计

### 🎮 手动控制
- 方向控制：前后左右移动、停止
- 急停按钮
- 速度调节：线速度、角速度滑块
- 巡航模式开关

### ⚙️ 系统设置
- 自动重连开关
- 轨迹显示开关
- 激光显示开关
- 地图透明度调节

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.x | 前端框架 |
| TypeScript | 6.0.x | 类型安全 |
| Vite | 8.1.x | 构建工具 |
| Element Plus | 2.14.x | UI组件库 |
| Pinia | 3.0.x | 状态管理 |
| Vue Router | 4.6.x | 路由管理 |
| SCSS | 1.101.x | CSS预处理器 |
| Three.js | 0.158.x | 3D点云渲染 |
| roslib | 1.x | ROS2 WebSocket通信 |
| Canvas | - | 2D地图渲染 |

## 快速开始

### 安装依赖

```bash
cd inspection-platform
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 生产构建

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 项目结构

```
inspection-platform/
├── src/
│   ├── components/          # 组件目录
│   │   ├── Header.vue       # 顶部导航栏
│   │   ├── LeftToolbar.vue  # 左侧工具栏
│   │   ├── MapCanvas.vue    # 地图画布（2D渲染）
│   │   ├── RightPanel.vue   # 右侧控制面板
│   │   ├── BottomBar.vue    # 底部状态栏
│   │   ├── DataPanel.vue    # 数据面板（ROS话题）
│   │   └── PointCloud3D.vue # 3D点云组件
│   ├── stores/              # Pinia状态管理
│   │   ├── robot.ts         # 机器人状态与ROS通信
│   │   ├── map.ts           # 地图状态与点云处理
│   │   └── navigation.ts    # 导航状态与航点管理
│   ├── types/               # TypeScript类型定义
│   │   └── index.ts         # 类型声明
│   ├── api/                 # API接口
│   │   └── ros.ts           # ROS接口（roslib实现）
│   ├── utils/               # 工具函数
│   │   └── pointCloudParser.ts # 点云解析器
│   ├── mock/                # Mock数据
│   │   └── data.ts          # 模拟数据
│   ├── styles/              # 全局样式
│   │   └── variables.scss   # 样式变量
│   ├── App.vue              # 根组件
│   ├── main.ts              # 入口文件
│   └── router/index.ts      # 路由配置
├── index.html               # HTML模板
├── package.json             # 项目配置
├── vite.config.ts           # Vite配置
├── tsconfig.json            # TypeScript配置
└── README.md                # 项目说明
```

## ROS2 通信配置

### 连接 ROS2 Bridge

1. 在顶部导航栏输入 ROS2 Bridge 的 IP 地址和端口（默认 9090）
2. 点击"连接"按钮建立 WebSocket 连接
3. 连接成功后自动订阅以下话题：
   - `/battery_state` - 电池状态
   - `/robot_mode` - 运行模式
   - `/map` - 2D栅格地图
   - `/lidar_points` - 激光雷达点云
   - `/terrain_points_downsampled` - 地形点云
   - `/camera/image_raw/compressed` - 摄像头图像

### 支持的消息类型

| 话题 | 消息类型 | 说明 |
|------|----------|------|
| `/map` | `nav_msgs/msg/OccupancyGrid` | 2D栅格地图 |
| `/lidar_points` | `sensor_msgs/msg/PointCloud2` | 激光雷达点云 |
| `/battery_state` | `sensor_msgs/msg/BatteryState` | 电池状态 |
| `/camera/image_raw/compressed` | `sensor_msgs/msg/CompressedImage` | 压缩图像 |

## 使用说明

### 绘制航点

1. 点击右侧面板"导航"Tab
2. 选择"添加航点"模式，点击地图添加单个航点
3. 或选择"绘制航线"模式，连续点击添加多个航点，双击结束

### 导航控制

1. 添加航点后，点击"保存路线"保存当前航线
2. 选择路线后点击"开始导航"启动导航
3. 可随时暂停、继续或取消导航

### 地图操作

- **缩放**：鼠标滚轮
- **拖拽**：选择模式下点击并拖动地图
- **绘制**：选择对应绘制模式后点击地图

### 3D点云操作

- **旋转**：左键拖动
- **缩放**：滚轮

## 注意事项

- 需要运行 ROS2 Bridge 后端服务才能接收真实数据
- 连接地址格式：`ws://<IP>:<PORT>`，默认端口 9090
- 建议使用 Chrome 浏览器以获得最佳体验
- 地图边界约束：绘制点和线必须在地图范围内
- 点云数据需要支持 sensor_msgs/msg/PointCloud2 格式
- 摄像头图像需要使用 compressed 压缩格式

## License

MIT License