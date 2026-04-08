import React, {  } from "react";
import "./index.less";

/* 
* Grid 栅格 自适应
* 使用媒体查询实现布局自适应：
* PC端：2列 * n
* 移动端：1列 * n
* 共9个卡片
*/
const App: React.FC = () => {
  const cards = Array.from({ length: 9 }, (_, i) => i + 1);


  return (
    <div>

      <div className="flex-container-grid">
        {cards.map((item) => (
          <div key={item} className="flex-item-grid">
            卡片 {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
