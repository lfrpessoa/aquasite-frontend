import { useEffect } from 'react';
import './Bubbles.css';

const Bubbles = () => {
  useEffect(() => {
    const container = document.createElement('div');
    container.className = 'bubbles-container';
    document.body.appendChild(container);

    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
      const size = Math.random() * 60 + 15;
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = Math.random() * 100 + '%';
      
      const duration = Math.random() * 10 + 6;
      bubble.style.animationDuration = duration + 's';
      
      container.appendChild(bubble);
      
      setTimeout(() => {
        if (bubble.parentNode) {
          bubble.remove();
        }
      }, duration * 1000);
    };

    const generateBubbles = () => {
      createBubble();
      setTimeout(generateBubbles, Math.random() * 1000 + 300);
    };

    generateBubbles();

    return () => {
      if (container.parentNode) {
        container.remove();
      }
    };
  }, []);

  return null;
};

export default Bubbles;