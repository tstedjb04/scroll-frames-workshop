"use client";

import { useEffect, useRef, useState } from "react";

import { FRAME_COUNT, frameSrc } from "@/lib/frames";
import { getScrollProgress, progressToFrameIndex } from "@/lib/scrollFrames";

import * as styles from "./ScrollCanvas.style";

export function ScrollCanvas() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const images: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
    let settled = 0;

    const settle = (index: number, image?: HTMLImageElement) => {
      if (cancelled) {
        return;
      }

      if (image) {
        images[index] = image;
      }

      settled += 1;
      setLoadProgress(Math.round((settled / FRAME_COUNT) * 100));

      if (settled === FRAME_COUNT) {
        framesRef.current = images;
        setReady(true);
      }
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const image = new Image();

      image.onload = () => settle(i, image);
      image.onerror = () => settle(i);
      image.src = frameSrc(i);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const draw = () => {
      const section = sectionRef.current;
      const canvas = canvasRef.current;

      if (!section || !canvas) {
        return;
      }

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      const devicePixelRatio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      const scrollRange = section.offsetHeight - window.innerHeight;
      const progress = getScrollProgress(
        window.scrollY,
        section.offsetTop,
        scrollRange
      );
      const index = progressToFrameIndex(progress, framesRef.current.length);
      const image = framesRef.current[index];

      if (!image) {
        return;
      }

      const scale = Math.max(
        width / image.naturalWidth,
        height / image.naturalHeight
      );
      const drawnWidth = image.naturalWidth * scale;
      const drawnHeight = image.naturalHeight * scale;
      const offsetX = (width - drawnWidth) / 2;
      const offsetY = (height - drawnHeight) / 2;

      context.clearRect(0, 0, width, height);
      context.drawImage(image, offsetX, offsetY, drawnWidth, drawnHeight);
    };

    const onScroll = () => {
      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        draw();
      });
    };

    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [ready]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.sticky}>
        {!ready && (
          <div className={styles.loading}>Loading frames… {loadProgress}%</div>
        )}
        <canvas ref={canvasRef} className={styles.canvas} />
        <p className={styles.hint}>Scroll to scrub frames</p>
      </div>
    </section>
  );
}
