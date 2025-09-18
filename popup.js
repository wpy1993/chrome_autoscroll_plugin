window.onload = function () {
  // 滚动速度控制
  const speedSlider = document.getElementById("speed-slider");
  const speedDisplay = document.getElementById("speed-display");
  const status = document.getElementById("status");

  console.log("Popup脚本开始执行");

  // 先设置事件监听器，避免阻塞
  speedSlider.addEventListener("input", (e) => {
    const speed = parseFloat(e.target.value);
    speedDisplay.textContent = speed;
    console.log("滑块值改变为:", speed);

    // 向当前页面发送速度更新消息
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: "updateSpeed",
            speed: speed,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.log("消息发送失败:", chrome.runtime.lastError.message);
            } else if (response && response.success) {
              console.log("速度更新成功");
            }
          }
        );
      }
    });
  });

  // 初始化函数，非阻塞执行
  function initializePopup() {
    console.log("开始初始化popup");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.log("查询标签页失败:", chrome.runtime.lastError.message);
        return;
      }

      if (!tabs || !tabs[0]) {
        console.log("没有找到活动标签页");
        return;
      }

      console.log("发送getStatus消息到标签页:", tabs[0].id);

      chrome.tabs.sendMessage(tabs[0].id, { action: "getStatus" }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("获取状态失败:", chrome.runtime.lastError.message);
          // 设置默认状态
          status.textContent = "点击悬浮球开始滚动";
          status.style.background = "rgba(255, 255, 255, 0.1)";
          return;
        }

        console.log("收到状态响应:", response);

        if (response) {
          // 更新滑块值
          if (response.scrollSpeed !== undefined) {
            speedSlider.value = response.scrollSpeed;
            speedDisplay.textContent = response.scrollSpeed;
            console.log("更新滑块值为:", response.scrollSpeed);
          }

          // 更新状态显示
          if (response.isScrolling) {
            status.textContent = "正在自动滚动中...";
            status.style.background = "rgba(255, 107, 107, 0.3)";
          } else {
            status.textContent = "点击悬浮球开始滚动";
            status.style.background = "rgba(255, 255, 255, 0.1)";
          }
        }
      });
    });
  }

  // 监听来自content script的状态更新
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Popup收到消息:", message);

    if (message.action === "statusUpdate") {
      if (message.isScrolling) {
        status.textContent = "正在自动滚动中...";
        status.style.background = "rgba(255, 107, 107, 0.3)";
      } else {
        status.textContent = "点击悬浮球开始滚动";
        status.style.background = "rgba(255, 255, 255, 0.1)";
      }

      // 更新速度显示
      if (message.scrollSpeed !== undefined && message.scrollSpeed !== parseFloat(speedSlider.value)) {
        speedSlider.value = message.scrollSpeed;
        speedDisplay.textContent = message.scrollSpeed;
      }
    }

    sendResponse({ received: true });
  });

  // DOM加载完成后执行初始化（非阻塞）
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM加载完成");
    // 延迟执行初始化，确保content script已经准备好
    setTimeout(initializePopup, 100);
  });

  // 如果DOM已经加载完成，直接执行初始化
  if (document.readyState === "loading") {
    // DOM还在加载中，等待DOMContentLoaded事件
  } else {
    // DOM已经加载完成，直接执行
    setTimeout(initializePopup, 100);
  }
};
