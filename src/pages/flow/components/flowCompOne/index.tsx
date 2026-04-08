import React, { useState } from "react";
import { Popover, Card } from "antd";
import "./index.less";
import arrow2 from "@/assets/flow/arrow2.png";
import icon1 from '@/assets/flow/司法业务办理.png';
import icon2 from '@/assets/flow/子工单系统.png';
import icon3 from '@/assets/flow/咨询业务.png';
import icon4 from '@/assets/flow/工单完成.png';
import icon5 from '@/assets/flow/督办.png';
import icon6 from '@/assets/flow/预警列表.png';
import icon7 from '@/assets/flow/流转中枢.png';

interface FlowItem {
  pop: boolean;
  style: React.CSSProperties;
  text: string;
  imgclass?: string;
  icon: any;
}

interface FlowInfo {
  data: string[][];
  list: FlowItem[];
}

const flowInfo: FlowInfo = {
  data: [],
  list: [
    { pop: false, style: { left: "0%", top: "10px" }, text: "方案申请", imgclass: "jump", icon: icon1 },
    { pop: false, style: { left: "25%", top: "10px" }, text: "方案审批",  imgclass: "jump", icon: icon2 },
    { pop: false, style: { left: "50%", top: "10px" }, text: "拟聘对象申请",  imgclass: "jump", icon: icon3 },
    { pop: false, style: { left: "75%", top: "10px" }, text: "拟聘对象申请",  imgclass: "jump", icon: icon4 },
    { pop: false, style: { right: "0%", top: "10px" }, text: "反馈聘任名单",  imgclass: "jump", icon: icon5 },
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
  const arrows = Array.from({ length: 4 }, (_, i) => i + 1);

  return (
    <Card title='流程'>
    <div
      className="main"
      style={{
        backgroundColor: "#ffffff",
        width: "100%",
        height: 80,
        position: "relative",
      }}
    >
      {/* 箭头 */}
      {arrows.map((item) => (
        <div className={`arrowsBox arrows${item}`} key={item}>
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
                // src={require(`@/assets/flow/${item.text}.png`)}
                src={item.icon}
                alt=""
              />
            </Popover>
            <span className="title">{item.text}</span>
          </div>
        );
      })}
    </div>
    </Card>
  );
};

export default Index;
