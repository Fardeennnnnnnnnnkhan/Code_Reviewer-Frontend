import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BlurReveal = ({ children, className = '', stagger = false, delay = 0 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const targets = stagger ? el.children : el;

    gsap.set(targets, {
      opacity: 0,
      y: 50,
      filter: 'blur(20px)',
    });

    const animation = gsap.to(targets, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      delay: delay,
      ease: 'power3.out',
      stagger: stagger ? 0.2 : 0,
    });

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      animation: animation,
      toggleActions: 'play none none reverse',
    });

    return () => {
      st.kill();
      animation.kill();
    };
  }, [stagger, delay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default BlurReveal;
