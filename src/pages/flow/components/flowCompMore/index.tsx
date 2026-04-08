import React, { useState } from "react";
import { Popover } from "antd";
import "./index.less";
import arrow2 from "@/assets/flow/arrow2.png";

interface FlowItem {
  pop: boolean;
  style: React.CSSProperties;
  text: string;
  imgclass?: string;
}

interface FlowInfo {
  data: string[][];
  list: FlowItem[];
}

const flowInfo: FlowInfo = {
  data: [],
  list: [
    { pop: false, style: { left: "13%", top: "20px" }, text: "咨询业务", imgclass: "jump" },
    { pop: false, style: { left: "13%", top: "160px" }, text: "司法业务办理", imgclass: "jump" },
    { pop: false, style: { left: "13%", top: "310px" }, text: "行政业务办理", imgclass: "jump" },
    { pop: false, style: { left: "38%", top: "160px" }, text: "子工单系统", imgclass: "jump" },
    { pop: false, style: { left: "60%", top: "10px" }, text: "公共资源池", imgclass: "jump" },
    { pop: false, style: { left: "60%", top: "115px" }, text: "流转中枢", imgclass: "jump" },
    { pop: false, style: { left: "60%", top: "225px" }, text: "预警列表", imgclass: "jump" },
    { pop: false, style: { left: "60%", top: "340px" }, text: "督办", imgclass: "jump" },
    { pop: false, style: { right: "10%", top: "160px" }, text: "工单完成", imgclass: "jump" },
  ],
};

const Index: React.FC = () => {
  const [popShow, setPopShow] = useState<number | null>(null);

  const isMobile = document.body.clientWidth < 900;

  const handleOpen = (index: number) => {
    setPopShow(index);
  };

  const handleClose = () => {
    setPopShow(null);
  };

  // 生成箭头序列
  const arrows = Array.from({ length: 11 }, (_, i) => i + 1);

  return (
    <div
      className="ssgdlct"
      style={{
        backgroundColor: "#ffffff",
        width: "100%",
        height: 440,
        position: "relative",
      }}
    >
      {/* 箭头 */}
      {arrows.map((item) => (
        <div className={`arrowBox arrow${item}`} key={item}>
          <img src={arrow2} alt="" />
        </div>
      ))}

      {/* 图标列表 */}
      {flowInfo.list.map((item, index) => {
        const popContent = (
          <div className="pop-content">
            <div>{item.text}</div>
          </div>
        );

        return (
          <div className="itemPng" style={item.style} key={item.text}>
            <Popover
              content={popContent}
              placement="right"
              overlayClassName="glass-pop"
              open={popShow === index}
              trigger={isMobile ? "click" : "hover"}
              onOpenChange={(visible) => {
                if (visible) {
                  handleOpen(index);
                } else {
                  handleClose();
                }
              }}
            >
              <img
                className={item.imgclass}
                src={require(`@/assets/flow/${item.text}.png`)}
                alt=""
              />
            </Popover>
            <span className="title">{item.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Index;
