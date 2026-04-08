import React, { useState, useRef, useEffect, CSSProperties, useCallback } from 'react';
import COMPSS from '@/pages/Welcome';
import { ArrowsAltOutline, ShrinkOutline } from 'antd-mobile-icons';

interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging: boolean;
  isResizing: boolean;
  isMinimized: boolean;
  isFullscreen: boolean;
  originalState?: { x: number; y: number; width: number; height: number };
}

interface Props {
  onClose?: () => void;
}

// 移动端适配：增大最小尺寸和边缘阈值
const MIN_WIDTH = 200;
const MIN_HEIGHT = 100;

interface Props {
  show: boolean;
  onClose?: () => void;
}
const ChatWindow: React.FC<Props> = ({ show, onClose }) => {
  const [windowState, setWindowState] = useState<WindowState>({
    x: 100,
    y: 200,
    width: 200,
    height: 300,
    isDragging: false,
    isResizing: false,
    isMinimized: false,
    isFullscreen: false,
  });

  const windowRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const resizeStartData = useRef<any>({ width: 0, height: 0, x: 0, y: 0 });

  // 统一处理鼠标和触摸事件开始
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent, type: 'drag' | 'resize') => {
    e.preventDefault();

    // 获取坐标（支持触摸事件）
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (type === 'drag') {
      dragStartPos.current = {
        startX: clientX,
        startY: clientY,
        initialX: windowState.x,
        initialY: windowState.y,
      };
      setWindowState(prev => ({
        ...prev,
        isDragging: true,
      }));
    } else if (type === 'resize') {
      setWindowState(prev => ({
        ...prev,
        isResizing: true,
      }));
      resizeStartData.current = {
        width: windowState.width,
        height: windowState.height,
        x: windowState.x,
        y: windowState.y,
        startX: clientX,
        startY: clientY,
      };
    }
  };

  // 统一处理移动事件（鼠标和触摸）- 调整大小
  const handleResize = useCallback((e: MouseEvent | TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - resizeStartData.current.startX;
    const deltaY = clientY - resizeStartData.current.startY;

    setWindowState(prev => {
      // 计算新的宽度和高度，确保不小于最小尺寸
      let newWidth = Math.max(MIN_WIDTH, resizeStartData.current.width + deltaX);
      let newHeight = Math.max(MIN_HEIGHT, resizeStartData.current.height + deltaY);

      // 限制窗口大小不超过页面边界
      newWidth = Math.min(newWidth, window.innerWidth - prev.x);
      newHeight = Math.min(newHeight, window.innerHeight - prev.y);

      return {
        ...prev,
        width: newWidth,
        height: newHeight,
      };
    });
  }, []);

  // 统一处理移动事件（鼠标和触摸）
  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (windowState.isDragging) {
        const deltaX = clientX - dragStartPos.current.startX;
        const deltaY = clientY - dragStartPos.current.startY;

        let newX = dragStartPos.current.initialX + deltaX;
        let newY = dragStartPos.current.initialY + deltaY;

        // 限制窗口不超出页面边界
        newX = Math.max(0, Math.min(newX, window.innerWidth - 4 - windowState.width));
        newY = Math.max(0, Math.min(newY, window.innerHeight - 4 - windowState.height));

        setWindowState(prev => ({
          ...prev,
          x: newX,
          y: newY,
        }));
      } else if (windowState.isResizing) {
        handleResize(e);
      }
    },
    [
      windowState.isDragging,
      windowState.isResizing,
      handleResize,
      windowState.width,
      windowState.height,
    ],
  );

  // 统一处理结束事件
  const handlePointerUp = useCallback(() => {
    setWindowState(prev => ({
      ...prev,
      isDragging: false,
      isResizing: false,
    }));
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  useEffect(() => {
    if (!windowState.isDragging && !windowState.isResizing) {
      return;
    }

    // 防止页面滚动和选择文本
    document.body.style.overflow = 'hidden';
    document.body.style.userSelect = 'none';

    const handleMove = (e: MouseEvent | TouchEvent) => {
      handlePointerMove(e);
    };

    // 添加事件监听器
    document.addEventListener('mousemove', handleMove as EventListener);
    document.addEventListener('touchmove', handleMove as EventListener, { passive: false });
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchend', handlePointerUp);

    return () => {
      document.removeEventListener('mousemove', handleMove as EventListener);
      document.removeEventListener('touchmove', handleMove as EventListener);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchend', handlePointerUp);
      document.body.style.overflow = '';
      document.body.style.userSelect = '';
    };
  }, [windowState.isDragging, windowState.isResizing, handlePointerMove, handlePointerUp]);

  const windowStyle: CSSProperties = {
    position: 'fixed',
    left: windowState.x,
    top: windowState.y,
    width: windowState.width,
    height: windowState.height,
    border: '2px solid #744CFF',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    zIndex: 9999999,
    overflow: 'hidden',
    cursor: windowState.isDragging ? 'grabbing' : 'default',
  };

  const handleMaximize = () => {
    if (windowState.isFullscreen) {
      // 退出全屏，恢复原始状态
      setWindowState(prev => ({
        ...prev,
        isFullscreen: false,
        x: prev.originalState?.x || 100,
        y: prev.originalState?.y || 100,
        width: prev.originalState?.width || 200,
        height: prev.originalState?.height || 300,
        originalState: undefined,
      }));
    } else {
      // 进入全屏
      setWindowState(prev => ({
        ...prev,
        isFullscreen: true,
        originalState: {
          x: prev.x,
          y: prev.y,
          width: prev.width,
          height: prev.height,
        },
        x: 0,
        y: 0,
        width: window.innerWidth - 4,
        height: window.innerHeight - 4,
      }));
    }
  };

  const headerStyle: CSSProperties = {
    height: '44px',
    background: 'linear-gradient( 94deg, #C476FE 0%, #744CFF 50%, #405FFF 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    userSelect: 'none',
    cursor: windowState.isDragging ? 'grabbing' : 'grab',
    touchAction: 'none', // 防止触摸默认行为
  };

  const closeButtonStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '26px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    touchAction: 'manipulation', // 优化触摸响应
  };

  if (!show) {
    return null;
  }

  return (
    <div ref={windowRef} style={windowStyle}>
      <div style={headerStyle}>
        {/* 标题区域 - 可拖拽 */}
        <span
          style={{
            flex: 1,
            cursor: windowState.isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            padding: '0 16px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold',
            zIndex: 9999999,
          }}
          onMouseDown={e => handlePointerDown(e, 'drag')}
          onTouchStart={e => handlePointerDown(e, 'drag')}
        >
          AI搜
        </span>

        {/* 按钮区域 - 不可拖拽 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 全屏按钮 */}
          <button
            type='button'
            style={{
              ...closeButtonStyle,
              fontSize: '17px',
              width: '32px',
            }}
            onClick={handleMaximize}
            onTouchStart={e => e.stopPropagation()}
          >
            {windowState.isFullscreen ? <ShrinkOutline /> : '⛶'}
          </button>

          {/* 关闭按钮 */}
          <button
            type='button'
            style={closeButtonStyle}
            onClick={onClose}
            onTouchStart={e => e.stopPropagation()} // 防止触发拖拽
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onTouchEnd={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>
      </div>

      <div
        style={{
          height: 'calc(100% - 44px)',
          width: '100%',
          overflow: 'auto', // 改为auto支持滚动
          position: 'relative',
        }}
      >
        <COMPSS />
        {/* 调整大小的手柄（非最小化且非全屏时显示） */}
        {!windowState.isMinimized && !windowState.isFullscreen && (
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '20px',
              height: '20px',
              backgroundColor: '#744CFF',
              cursor: 'nwse-resize',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              borderTopLeftRadius: '4px',
              touchAction: 'none',
              zIndex: 9999999, // 确保在手柄在最上层
            }}
            onMouseDown={e => handlePointerDown(e, 'resize')}
            onTouchStart={e => handlePointerDown(e, 'resize')}
            title="拖拽调整大小"
          >
            <ArrowsAltOutline />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
