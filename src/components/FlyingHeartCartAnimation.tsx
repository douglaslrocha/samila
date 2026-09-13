import React, { useEffect, useRef } from 'react';

export interface FlyHeartDetail {
  startX: number;
  startY: number;
}

/**
 * Helper global para acionar o voo do coração de qualquer botão ou clique até o carrinho no topo
 */
export const triggerFlyHeartToCart = (
  e?: React.MouseEvent | HTMLElement | { clientX: number; clientY: number }
) => {
  let startX = window.innerWidth / 2;
  let startY = window.innerHeight / 2;

  if (e) {
    if ('currentTarget' in e && e.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    } else if (
      'getBoundingClientRect' in e &&
      typeof (e as HTMLElement).getBoundingClientRect === 'function'
    ) {
      const rect = (e as HTMLElement).getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    } else if ('clientX' in e && typeof e.clientX === 'number') {
      startX = e.clientX;
      startY = e.clientY;
    }
  }

  window.dispatchEvent(
    new CustomEvent<FlyHeartDetail>('fly-heart-to-cart', {
      detail: { startX, startY }
    })
  );
};

interface ActiveHeart {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  cpX: number;
  cpY: number;
  startTime: number;
  duration: number;
  el: HTMLDivElement;
}

export const FlyingHeartCartAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heartsRef = useRef<ActiveHeart[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleFlyEvent = (e: CustomEvent<FlyHeartDetail>) => {
      if (!containerRef.current) return;

      const { startX, startY } = e.detail;

      // Localizar o carrinho no cabeçalho
      const cartButton = document.getElementById('header-cart-button');
      let targetX = window.innerWidth - 36;
      let targetY = 32;

      if (cartButton) {
        const rect = cartButton.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
      }

      // Ponto de controle para arco parabólico nobre e fluido
      const midX = (startX + targetX) / 2;
      const cpX = midX + (startX > targetX ? 35 : -35);
      const cpY = Math.min(startY, targetY) - Math.max(90, Math.abs(startY - targetY) * 0.28);

      // Criar elemento do coração voador
      const heartEl = document.createElement('div');
      heartEl.className =
        'absolute top-0 left-0 pointer-events-none will-change-transform z-[9999] select-none';
      heartEl.innerHTML = `
        <div class="relative flex items-center justify-center">
          <!-- Brilho dourado atrás do coração -->
          <div class="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#FFA07A]/40 to-[#FFD29D]/60 blur-[6px] pointer-events-none"></div>
          
          <!-- Coração Artesanal Maison -->
          <svg width="34" height="34" viewBox="0 0 24 24" class="drop-shadow-[0_4px_14px_rgba(184,87,40,0.6)]">
            <defs>
              <radialGradient id="heartGrad-${Date.now()}" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stop-color="#FFBE8A" />
                <stop offset="35%" stop-color="#C8522A" />
                <stop offset="100%" stop-color="#7A2D12" />
              </radialGradient>
            </defs>
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="url(#heartGrad-${Date.now()})"
              stroke="#FFF2E5"
              stroke-width="1.3"
            />
          </svg>

          <!-- Partícula de rastro suave -->
          <span class="absolute -bottom-1 -right-1 text-[#FFDF9E] text-[10px] animate-pulse">✦</span>
        </div>
      `;

      containerRef.current.appendChild(heartEl);

      const newHeart: ActiveHeart = {
        id: Date.now() + Math.random(),
        startX,
        startY,
        targetX,
        targetY,
        cpX,
        cpY,
        startTime: performance.now(),
        duration: 820,
        el: heartEl
      };

      heartsRef.current.push(newHeart);

      // Iniciar animação se não estiver rodando
      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(animateHearts);
      }
    };

    const animateHearts = (now: number) => {
      const remaining: ActiveHeart[] = [];

      heartsRef.current.forEach((heart) => {
        const elapsed = now - heart.startTime;
        const rawT = Math.min(1, elapsed / heart.duration);

        // Easing cúbico fluido
        const t = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

        // Equação da curva Bézier quadrática
        const curX =
          (1 - t) * (1 - t) * heart.startX +
          2 * (1 - t) * t * heart.cpX +
          t * t * heart.targetX;
        const curY =
          (1 - t) * (1 - t) * heart.startY +
          2 * (1 - t) * t * heart.cpY +
          t * t * heart.targetY;

        // Escala: pulsa no início, mantém e encolhe ao entrar na sacola
        let scale = 1;
        if (rawT < 0.2) {
          scale = 0.5 + (rawT / 0.2) * 0.85; // 0.5 -> 1.35
        } else if (rawT > 0.8) {
          scale = 1.35 - ((rawT - 0.8) / 0.2) * 0.95; // 1.35 -> 0.4
        } else {
          scale = 1.25 + Math.sin(rawT * Math.PI * 4) * 0.1;
        }

        // Rotação poética
        const rot = Math.sin(rawT * Math.PI * 3) * 16;

        // Opacidade suave no final
        const opacity = rawT > 0.88 ? (1 - rawT) / 0.12 : 1;

        heart.el.style.transform = `translate3d(${curX - 17}px, ${curY - 17}px, 0) scale(${scale}) rotate(${rot}deg)`;
        heart.el.style.opacity = `${opacity}`;

        if (rawT < 1) {
          remaining.push(heart);
        } else {
          // Chegou ao carrinho!
          // Remove elemento
          heart.el.remove();

          // Dispara evento de chegada no carrinho para animar o ícone
          window.dispatchEvent(
            new CustomEvent('cart-item-arrived', {
              detail: { targetX: heart.targetX, targetY: heart.targetY }
            })
          );

          // Efeito de partículas de faíscas douradas na chegada
          if (containerRef.current) {
            spawnArrivalSparkles(containerRef.current, heart.targetX, heart.targetY);
          }
        }
      });

      heartsRef.current = remaining;

      if (remaining.length > 0) {
        animFrameRef.current = requestAnimationFrame(animateHearts);
      } else {
        animFrameRef.current = null;
      }
    };

    const spawnArrivalSparkles = (container: HTMLDivElement, x: number, y: number) => {
      const sparkleContainer = document.createElement('div');
      sparkleContainer.className =
        'absolute top-0 left-0 pointer-events-none z-[9999] select-none';
      sparkleContainer.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      sparkleContainer.innerHTML = `
        <div class="relative flex items-center justify-center">
          <span class="absolute text-[#FFDF9E] text-xs font-bold animate-ping">✨</span>
          <span class="absolute w-6 h-6 rounded-full bg-[#FFA500]/30 animate-ping"></span>
        </div>
      `;

      container.appendChild(sparkleContainer);

      setTimeout(() => {
        sparkleContainer.remove();
      }, 650);
    };

    window.addEventListener('fly-heart-to-cart', handleFlyEvent as EventListener);

    return () => {
      window.removeEventListener('fly-heart-to-cart', handleFlyEvent as EventListener);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      heartsRef.current.forEach((h) => h.el.remove());
      heartsRef.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      aria-hidden="true"
    />
  );
};
