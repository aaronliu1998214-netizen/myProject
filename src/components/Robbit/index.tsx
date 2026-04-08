// DraggableButton.jsx
import { useState, useRef, useCallback,  } from 'react';
import ImgPic from '@/assets/robbit.png';
import ChatWindow from '@/components/Draggable';
import './index.less';
import loop from '@/assets/images/wl.png';

// import loop from '@/assets/screen/bar_bg.png';

const DraggableButton: React.FC<{
  open?: boolean;
  openTurp?: (val: boolean) => void;
  source?: string;
}> = () => {
  const [position, setPosition] = useState({
    x: window.innerWidth * 0.83,
    y: window.innerHeight * 0.8,
  });
  const buttonRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    dragStartTime: 0,
  });
  const [show, setShow] = useState(false);



  // 边界检测函数
  const getBoundaryPosition = (x: number, y: number) => {
    if (!buttonRef.current) return { x, y };

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const maxX = window.innerWidth - buttonRect.width;
    const maxY = window.innerHeight - buttonRect.height;

    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(63, Math.min(y, maxY)),
    };
  };

  // 通用开始拖拽/触摸处理
  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      dragState.current = {
        isDragging: false,
        startX: clientX,
        startY: clientY,
        initialX: position.x,
        initialY: position.y,
        dragStartTime: Date.now(),
      };
    },
    [position],
  );

  // 通用移动处理
  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      const { startX, startY, initialX, initialY } = dragState.current;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      // 移动距离超过5px才认为是拖拽
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        dragState.current.isDragging = true;

        const newPosition = {
          x: initialX + deltaX,
          y: initialY + deltaY,
        };

        // 应用边界检查
        const boundedPosition = getBoundaryPosition(newPosition.x, newPosition.y);
        setPosition(boundedPosition);
      }
    },
    [getBoundaryPosition],
  );

  // 通用结束处理
  const handleEnd = useCallback((clientX: number, clientY: number) => {
    const { isDragging, startX, startY, dragStartTime } = dragState.current;

    // 判断是否为点击事件（移动距离小且时间短）
    const isClick =
      !isDragging &&
      Math.abs(clientX - startX) <= 5 &&
      Math.abs(clientY - startY) <= 5 &&
      Date.now() - dragStartTime < 300;

    if (isClick) {
      // 处理点击事件
      setShow(true);
    }

    dragState.current.isDragging = false;
  }, []);

  // 鼠标事件处理
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      handleStart(e.clientX, e.clientY);

      const handleMouseMoveWrapper = (e: globalThis.MouseEvent) => {
        handleMove(e.clientX, e.clientY);
      };

      const handleMouseUpWrapper = (e: globalThis.MouseEvent) => {
        handleEnd(e.clientX, e.clientY);
        document.removeEventListener('mousemove', handleMouseMoveWrapper);
        document.removeEventListener('mouseup', handleMouseUpWrapper);
      };

      document.addEventListener('mousemove', handleMouseMoveWrapper);
      document.addEventListener('mouseup', handleMouseUpWrapper);
    },
    [handleStart, handleMove, handleEnd],
  );

  // 触摸事件处理
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);

      const handleTouchMoveWrapper = (e: globalThis.TouchEvent) => {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      };

      const handleTouchEndWrapper = (e: globalThis.TouchEvent) => {
        const touch = e.changedTouches[0];
        handleEnd(touch.clientX, touch.clientY);
        document.removeEventListener('touchmove', handleTouchMoveWrapper);
        document.removeEventListener('touchend', handleTouchEndWrapper);
      };

      document.addEventListener('touchmove', handleTouchMoveWrapper, { passive: false });
      document.addEventListener('touchend', handleTouchEndWrapper);
    },
    [handleStart, handleMove, handleEnd],
  );



  const chatButton = (
      <div
        ref={buttonRef}
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          // right: position.x,
          cursor: 'grab',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          zIndex: 9999,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className='robit'
          style={{ color: '#272727', display: 'grid', fontSize: '12px', textAlign: 'center' }}
          onClick={() => {
            // 点击事件现在在handleMouseUp中处理
          }}
        >
          <div className='bg' />
          <img src={ImgPic} alt="" style={{ width: '6rem' }} />
        </div>
      </div>
  );


  return (
    <div className='main'>
      {chatButton}
      <ChatWindow show={show} onClose={() => setShow(false)} />
    </div>
  );
};

export default DraggableButton;
