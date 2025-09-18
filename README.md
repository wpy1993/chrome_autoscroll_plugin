# Chrome页面自动滚动扩展

一个智能的Chrome浏览器扩展，提供页面自动滚动功能，支持悬浮球控制和自动识别页面高度。

## 功能特性

- ✨ **智能悬浮球**: 美观的悬浮控制球，可拖拽调整位置
- 🎯 **智能识别**: 自动识别当前页面的最大滚动高度
- 🚀 **匀速滚动**: 提供平滑的匀速滚动体验
- ⚙️ **可调速度**: 支持调整滚动速度（0.5-5像素/帧）
- ⌨️ **键盘快捷键**: Ctrl+Shift+S 快速启动/停止
- 📱 **响应式设计**: 适配不同屏幕尺寸和主题
- 🌙 **主题适配**: 支持暗色主题和高对比度模式

## 安装方法

### 方法一：开发者模式安装（推荐）

1. 创建扩展文件夹并保存以下文件：
   - `manifest.json`
   - `content.js`
   - `styles.css`
   - `popup.html`

2. 打开Chrome浏览器，进入扩展管理页面：
   - 地址栏输入 `chrome://extensions/`
   - 或者：菜单 → 更多工具 → 扩展程序

3. 开启"开发者模式"（右上角开关）

4. 点击"加载已解压的扩展程序"

5. 选择包含扩展文件的文件夹

6. 扩展安装完成！

### 方法二：打包安装

1. 在开发者模式下点击"打包扩展程序"
2. 选择扩展文件夹，生成 `.crx` 文件
3. 将 `.crx` 文件拖拽到扩展管理页面安装

## 使用方法

### 基本操作

1. **启动扩展**：安装后，每个网页右侧会出现悬浮球
2. **开始滚动**：点击悬浮球启动自动滚动
3. **停止滚动**：再次点击悬浮球停止滚动
4. **调整位置**：拖拽悬浮球到任意位置

### 高级功能

- **调整速度**：点击扩展图标打开设置面板，调整滚动速度
- **键盘快捷键**：使用 `Ctrl+Shift+S` 快速启动/停止
- **状态指示**：
  - 蓝色渐变：待机状态
  - 红色闪烁：滚动中

### 智能识别说明

扩展会自动识别页面的最大可滚动高度，包括：
- 动态加载的内容
- iframe内容
- 复杂布局页面
- SPA单页应用

## 技术特点

### 核心算法
```javascript
// 智能计算页面最大高度
calculateMaxScrollHeight() {
  const body = document.body;
  const documentElement = document.documentElement;
  
  this.maxHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    documentElement.clientHeight,
    documentElement.scrollHeight,
    documentElement.offsetHeight
  ) - window.innerHeight;
}
```

### 性能优化
- 使用 `requestAnimationFrame` 确保60fps流畅滚动
- 智能边界检测，避免过度滚动
- 内存优化，及时清理定时器和事件监听

### 兼容性
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ 支持所有网站（包括HTTPS）
- ✅ 响应式设计适配移动设备

## 文件结构

```
chrome-extension/
├── manifest.json      # 扩展配置文件
├── content.js         # 核心滚动逻辑
├── styles.css         # 悬浮球样式
├── popup.html         # 设置面板
├── icons/            # 图标文件夹
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md         # 说明文档
```

## 自定义配置

可以在 `content.js` 中调整以下参数：

```javascript
class AutoScroller {
  constructor() {
    this.scrollSpeed = 1;      // 滚动速度 (像素/帧)
    this.scrollDelay = 16;     // 滚动间隔 (毫秒)
    // 可根据需要调整更多参数
  }
}
```

## 常见问题

**Q: 悬浮球不显示怎么办？**
A: 检查是否启用了扩展，尝试刷新页面。

**Q: 滚动速度太快或太慢？**
A: 点击扩展图标，在弹出面板中调整滚动速度。

**Q: 某些网站无法滚动？**
A: 部分网站可能有特殊的滚动拦截，可以尝试使用键盘快捷键。

**Q: 如何卸载扩展？**
A: 在 `chrome://extensions/` 页面找到扩展，点击"移除"。

## 更新日志

### v1.0 (2024-09-18)
- ✨ 初始版本发布
- 🎯 智能页面高度识别
- 🎨 美观悬浮球设计
- ⚙️ 可调滚动速度
- ⌨️ 键盘快捷键支持

## 开发计划

- [ ] 添加滚动到指定位置功能
- [ ] 支持更多滚动模式（加速、减速等）
- [ ] 添加滚动进度指示器
- [ ] 支持保存个人偏好设置
- [ ] 多语言国际化支持

## 贡献指南

欢迎提交Issue和Pull Request来改进这个扩展！

## 许可证

MIT License


## extra
thanks to claude for the implementation