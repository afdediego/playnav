'use client';

/**
 * Mobile touch controls - Arkanoid style (drag to move, auto-shoot)
 */

import { useEffect, useState, useRef } from 'react';

interface MobileControlsProps {
  onPositionChange: (x: number) => void; // Nueva función para posición directa
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export default function MobileControls({
  onPositionChange,
  canvasRef,
}: MobileControlsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const touchAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTouchMove = (clientX: number) => {
    // Obtener el canvas dinámicamente cada vez
    const canvas = canvasRef.current || document.querySelector('canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    // Convertir coordenadas de pantalla a coordenadas del canvas
    const x = clientX - rect.left;
    const relativeX = (x / rect.width) * canvas.width;
    
    // Enviar posición al juego
    onPositionChange(relativeX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    if (e.touches[0]) {
      handleTouchMove(e.touches[0].clientX);
    }
  };

  const handleTouchMoveEvent = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isDragging && e.touches[0]) {
      handleTouchMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  if (!isMobile) return null;

  return (
    <div
      ref={touchAreaRef}
      className="fixed inset-0 z-10 pointer-events-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMoveEvent}
      onTouchEnd={handleTouchEnd}
      onMouseDown={(e) => {
        e.preventDefault();
        setIsDragging(true);
        handleTouchMove(e.clientX);
      }}
      onMouseMove={(e) => {
        e.preventDefault();
        if (isDragging) {
          handleTouchMove(e.clientX);
        }
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onMouseLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      style={{
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      {/* Mensaje "ARRASTRA" eliminado - control táctil invisible */}
    </div>
  );
}


