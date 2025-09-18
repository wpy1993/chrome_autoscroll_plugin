// 自动滚动扩展主要逻辑
class AutoScroller {
  constructor() {
    this.isScrolling = false;
    this.scrollInterval = null;
    this.floatingBall = null;
    this.scrollSpeed = 1; // 像素/次
    this.scrollDelay = 16; // 毫秒 (约60fps)
    this.maxHeight = 0;
    this.currentPosition = 0;

    this.init();
  }

  init() {
    // 创建悬浮球
    this.createFloatingBall();
    // 监听页面变化
    this.observePageChanges();
  }

  createFloatingBall() {
    // 避免重复创建
    if (document.getElementById("auto-scroll-ball")) return;

    this.floatingBall = document.createElement("div");
    this.floatingBall.id = "auto-scroll-ball";
    this.floatingBall.className = "auto-scroll-floating-ball";
    this.floatingBall.innerHTML = `
      <div class="ball-content">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 2L12 22M5 15L12 22L19 15"/>
        </svg>
      </div>
    `;

    // 添加点击事件
    this.floatingBall.addEventListener("click", () => {
      this.toggleScroll();
    });

    // 添加拖拽功能
    this.addDragFunctionality();

    document.body.appendChild(this.floatingBall);
  }

  addDragFunctionality() {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    this.floatingBall.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = this.floatingBall.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      this.floatingBall.style.transition = "none";
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newLeft = startLeft + deltaX;
      let newTop = startTop + deltaY;

      // 边界检查
      const ballRect = this.floatingBall.getBoundingClientRect();
      newLeft = Math.max(0, Math.min(window.innerWidth - ballRect.width, newLeft));
      newTop = Math.max(0, Math.min(window.innerHeight - ballRect.height, newTop));

      this.floatingBall.style.left = newLeft + "px";
      this.floatingBall.style.top = newTop + "px";
      this.floatingBall.style.right = "auto";
      this.floatingBall.style.bottom = "auto";
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        this.floatingBall.style.transition = "all 0.3s ease";
      }
    });
  }

  calculateMaxScrollHeight() {
    // 获取页面最大高度的多种方法
    const body = document.body;
    const documentElement = document.documentElement;

    this.maxHeight = Math.max(body.scrollHeight, body.offsetHeight, documentElement.clientHeight, documentElement.scrollHeight, documentElement.offsetHeight);

    // 减去视窗高度，得到实际可滚动的高度
    this.maxHeight = this.maxHeight - window.innerHeight;

    return this.maxHeight;
  }

  toggleScroll() {
    if (this.isScrolling) {
      this.stopScroll();
    } else {
      this.startScroll();
    }
  }

  startScroll() {
    this.calculateMaxScrollHeight();

    if (this.maxHeight <= 0) {
      this.showMessage("页面高度不足，无需滚动");
      return;
    }

    this.isScrolling = true;
    this.currentPosition = window.pageYOffset;
    this.updateBallState();

    this.scrollInterval = setInterval(() => {
      this.currentPosition += this.scrollSpeed;

      // 检查是否到达底部
      if (this.currentPosition >= this.maxHeight) {
        this.currentPosition = this.maxHeight;
        window.scrollTo(0, this.currentPosition);
        this.stopScroll();
        this.showMessage("已滚动到页面底部");
        return;
      }

      // 平滑滚动
      window.scrollTo(0, this.currentPosition);
    }, this.scrollDelay);

    this.showMessage("开始自动滚动");
  }

  stopScroll() {
    this.isScrolling = false;
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
    this.updateBallState();
    this.showMessage("停止滚动");
  }

  updateBallState() {
    if (this.isScrolling) {
      this.floatingBall.classList.add("scrolling");
      this.floatingBall.innerHTML = `
        <div class="ball-content">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="6" width="12" height="12" rx="2"/>
          </svg>
        </div>
      `;
    } else {
      this.floatingBall.classList.remove("scrolling");
      this.floatingBall.innerHTML = `
        <div class="ball-content">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L12 22M5 15L12 22L19 15"/>
          </svg>
        </div>
      `;
    }
  }

  showMessage(text) {
    // 创建临时消息提示
    const message = document.createElement("div");
    message.className = "auto-scroll-message";
    message.textContent = text;
    document.body.appendChild(message);

    // 3秒后移除消息
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 3000);
  }

  observePageChanges() {
    // 监听页面内容变化，重新计算最大高度
    const observer = new MutationObserver(() => {
      if (this.isScrolling) {
        this.calculateMaxScrollHeight();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  // 键盘快捷键支持
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Ctrl + Shift + S 启动/停止滚动
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        this.toggleScroll();
      }
    });
  }
}

// 页面加载完成后初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new AutoScroller();
  });
} else {
  new AutoScroller();
}
