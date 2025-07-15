import React, { useEffect, useRef, useState } from 'react';
import '../styles/cursor.css';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ring = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [clicking, setClicking] = useState(false);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px';
        dotRef.current.style.top = e.clientY + 'px';
      }
    };
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px';
        ringRef.current.style.top = ring.current.y + 'px';
      }
      requestAnimationFrame(animate);
    };
    document.body.style.cursor = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    animate();
    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleMouseDown = () => setClicking(true);
    const handleMouseUp = () => setClicking(false);
    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, .btn, input, select, textarea')) setHover(true);
    };
    const handleMouseOut = (e) => {
      if (e.target.closest('button, a, .btn, input, select, textarea')) setHover(false);
    };
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div
        ref={ringRef}
        className={`custom-cursor-ring${clicking ? ' clicking' : ''}${hover ? ' hover' : ''}`}
      />
      <div
        ref={dotRef}
        className={`custom-cursor-dot${clicking ? ' clicking' : ''}${hover ? ' hover' : ''}`}
      />
    </>
  );
};

export default CustomCursor; 