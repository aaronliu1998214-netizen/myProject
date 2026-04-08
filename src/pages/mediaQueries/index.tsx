import React, { useRef } from "react";
import "./index.less";
import { Button } from "antd";

/* 
* Grid 栅格 自适应
* 使用媒体查询实现布局自适应：
* PC端：2列 * n
* 移动端：1列 * n
* 共9个卡片
*/
const App: React.FC = () => {
  const cards = Array.from({ length: 9 }, (_, i) => i + 1);

  // 绑定容器，用于全屏
  const containerRef = useRef<HTMLDivElement>(null);

  // 切换全屏
  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      // 进入全屏
      containerRef.current?.requestFullscreen();
    } else {
      // 退出全屏
      document.exitFullscreen();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleFullScreen}>
          全屏
        </Button>
      </div>
      <div ref={containerRef} className="flex-container">

        {cards.map((item) => (
          <div key={item} className="flex-item">
            卡片 {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
