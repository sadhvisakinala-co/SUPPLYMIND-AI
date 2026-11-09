"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, type Variants } from "framer-motion";

/**
 * PageEntrance — Standardized luxury entrance transition:
 * Opacity: 0 to 1, Y: 12px, Duration: 380ms, Ease: [0.16, 1, 0.3, 1]
 */
export function PageEntrance({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer & StaggerItem — Cascading group entrances
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export function StaggerContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * SpotlightCard — Obsidian Luxe container with interactive cursor ambient lighting
 * Smoothly traces cursor position with a subtle mint radiance without any distracting custom cursor.
 */
export function SpotlightCard({
  children,
  className = "",
  onClick,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative rounded-2xl bg-[#0B191B] border border-[rgba(154,231,207,0.12)] overflow-hidden transition-all duration-300 ${
        isHovered ? "border-[#79E7C7]/30 shadow-mint-subtle" : ""
      } ${interactive ? "cursor-pointer hover:bg-[#102326]/60" : ""} ${className}`}
    >
      {/* Subtle ambient cursor spotlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(121, 231, 199, 0.08), transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * MagneticCTA — Subtle pointer attraction for marketing buttons (max 5px movement)
 */
export function MagneticCTA({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 200, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    // Constrain to max 5px movement
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDist = 5;
    if (distance > 0) {
      const clampedDist = Math.min(distance, maxDist);
      const ratio = clampedDist / distance;
      x.set(deltaX * ratio * 0.25);
      y.set(deltaY * ratio * 0.25);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: smoothX, y: smoothY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
