// DraggableButton.jsx
import { useState, useEffect, useRef } from 'react';
import ImgPic from '@/assets/robbit.png';
import Chat from '@/components/Draggable';

const DraggableButton = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<any>({ x: '83vw', y: '80vh' }); // 初始位置
  const buttonRef = useRef(null);
  const [show,setShow] = useState<boolean>(false);

  const handleMouseDown = (event: any) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const updatePosition = (x: any, y: any) => {
    const button: any = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const offsetX = x - rect.width / 2;
    const offsetY = y - rect.height / 2;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const constrainedX = Math.min(Math.max(offsetX, 0), viewportWidth - rect.width);
    const constrainedY = Math.min(Math.max(offsetY, 0), viewportHeight - rect.height);

    setPosition({ x: constrainedX, y: constrainedY });
  };



  useEffect(() => {
    const handleMouseMove = (event: any) => {
      if (!isDragging) return;

      const newX = event.clientX || event.touches[0].clientX;
      const newY = event.clientY || event.touches[0].clientY;

      updatePosition(newX, newY);
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
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
            zIndex:9999999
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown} // 支持触摸事件
        >
        <div
            style={{ color: '#272727', display: 'grid', fontSize: '12px', textAlign: 'center' }}
            onClick={() => { setShow(true) }}
        >
            <img src={ImgPic} alt="" style={{ width: '6rem' }} />
        </div>
        </div>
        <Chat show={show} onClose={() => setShow(false)} />
    </>
  );
};

export default DraggableButton;
