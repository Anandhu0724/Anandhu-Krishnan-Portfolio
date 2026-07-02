/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface CyberSpaceCanvasProps {
  scrollProgress: number;
}

export default function CyberSpaceCanvas({ scrollProgress }: CyberSpaceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Keep refs of values to avoid re-running effect on every tick
  const scrollProgressRef = useRef(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to [-0.5, 0.5]
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      targetMouseRef.current = { x, y };
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      // Map gamma (left/right tilt, normally -90 to 90) and beta (front/back tilt, normally -180 to 180) to target coordinates.
      // In portrait: holding device naturally is around beta: 60, gamma: 0.
      // We normalize so that a +/- 30 degree tilt maps to +/- 0.5 range.
      const x = Math.max(-0.5, Math.min(0.5, e.gamma / 30));
      const y = Math.max(-0.5, Math.min(0.5, (e.beta - 60) / 30));
      targetMouseRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const startDeviceOrientation = async () => {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        // @ts-ignore
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        try {
          // @ts-ignore
          const state = await DeviceOrientationEvent.requestPermission();
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        } catch (err) {
          console.warn('DeviceOrientation permission request failed:', err);
        }
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    };

    // Listen to orientation changes on mobile, setting up permission query if needed
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      // @ts-ignore
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      const requestOnGesture = async () => {
        await startDeviceOrientation();
        window.removeEventListener('click', requestOnGesture);
        window.removeEventListener('touchstart', requestOnGesture);
      };
      window.addEventListener('click', requestOnGesture);
      window.addEventListener('touchstart', requestOnGesture);
    } else {
      startDeviceOrientation();
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Space parameters
    const fov = 400;
    const baseRadius = 320;
    const numRings = 14;
    const spacing = 180;
    const maxZ = numRings * spacing;

    // Smooth movement values
    let cameraZ = 0;
    let ambientOffset = 0;
    let lerpedProgress = 0;

    // Star/Dust particles (Z, X, Y, speed, size, color)
    const stars: Array<{ x: number; y: number; z: number; size: number; alpha: number; hue: number }> = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 1500,
        z: Math.random() * maxZ,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.3,
        hue: Math.random() > 0.5 ? 180 : 145, // Blue or Emerald
      });
    }

    // Data packets sliding along the 8 ribs of the tunnel
    const packets: Array<{ rib: number; z: number; speed: number; length: number; color: string }> = [];
    for (let i = 0; i < 15; i++) {
      packets.push({
        rib: Math.floor(Math.random() * 8),
        z: Math.random() * maxZ,
        speed: Math.random() * 8 + 6,
        length: Math.random() * 40 + 20,
        color: Math.random() > 0.4 ? '#00f0ff' : '#00ff88',
      });
    }

    // Main animation loop
    const tick = () => {
      // 1. Clear with deep space canvas background
      ctx.fillStyle = '#07090e';
      ctx.fillRect(0, 0, width, height);

      // Draw custom background grid pattern (very faint static grid lines)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
      ctx.lineWidth = 1;
      const staticGridSize = 60;
      for (let x = 0; x < width; x += staticGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += staticGridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Smoothly interpolate mouse and scroll values
      const mouse = mouseRef.current;
      const targetMouse = targetMouseRef.current;
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      lerpedProgress += (scrollProgressRef.current - lerpedProgress) * 0.06;

      // camera Z moves forward: maps progress (0 to 1) to distance in space, plus a gentle ambient drift
      ambientOffset += 0.25;
      cameraZ = lerpedProgress * 3000 + ambientOffset;

      // Define central camera node with mouse-look parallax
      const cx = width / 2 - mouse.x * 120;
      const cy = height / 2 - mouse.y * 120;

      // 3. Render Stars
      stars.forEach((star) => {
        let relativeZ = star.z - (cameraZ * 0.8);
        // Warp star Z
        relativeZ = ((relativeZ % maxZ) + maxZ) % maxZ;
        if (relativeZ < 5) return;

        const scale = fov / relativeZ;
        const sx = cx + star.x * scale;
        const sy = cy + star.y * scale;

        // Fades when too close or too far
        let fade = 1.0;
        if (relativeZ < 200) fade = relativeZ / 200;
        if (relativeZ > maxZ - 300) fade = (maxZ - relativeZ) / 300;

        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          ctx.beginPath();
          ctx.arc(sx, sy, star.size * scale * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = star.hue === 180 
            ? `rgba(0, 240, 255, ${star.alpha * fade})` 
            : `rgba(0, 255, 136, ${star.alpha * fade})`;
          ctx.fill();
        }
      });

      // 4. Render 3D Octagonal Circuit Tunnel
      // We will first compute the projected 2D coordinates for all rings.
      const projectedRings: Array<Array<{ x: number; y: number; active: boolean }>> = [];

      for (let i = 0; i < numRings; i++) {
        const ringZOriginal = i * spacing;
        let relativeZ = ringZOriginal - (cameraZ % maxZ);
        if (relativeZ < 0) relativeZ += maxZ;

        // Skip if too close to screen
        if (relativeZ < 10) {
          projectedRings.push([]);
          continue;
        }

        const scale = fov / relativeZ;
        const radius = baseRadius * scale;

        // Deeper rings are darker
        const depthAlpha = Math.max(0, 1 - relativeZ / maxZ);
        let fadeAlpha = depthAlpha * 0.45;

        // Additional fading near camera
        if (relativeZ < 300) {
          fadeAlpha *= (relativeZ - 10) / 290;
        }

        const vertices: Array<{ x: number; y: number; active: boolean }> = [];
        const isSpacedSpecial = i % 3 === 0;

        for (let j = 0; j < 8; j++) {
          const angle = (j / 8) * 2 * Math.PI;
          
          // Add a subtle wave distortion to make the circuit organic
          const wave = Math.sin(angle * 4 + ambientOffset * 0.05) * 10 * scale;
          const r = radius + wave;

          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;

          vertices.push({ x, y, active: isSpacedSpecial });
        }

        projectedRings.push(vertices);

        // Draw Octagon Ring
        if (vertices.length > 0) {
          ctx.beginPath();
          ctx.moveTo(vertices[0].x, vertices[0].y);
          for (let j = 1; j < 8; j++) {
            ctx.lineTo(vertices[j].x, vertices[j].y);
          }
          ctx.closePath();

          // Highlight some rings in blue or green
          if (i % 4 === 0) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${fadeAlpha * 1.5})`;
            ctx.lineWidth = 1.5;
          } else if (i % 4 === 2) {
            ctx.strokeStyle = `rgba(0, 255, 136, ${fadeAlpha * 1.5})`;
            ctx.lineWidth = 1.5;
          } else {
            ctx.strokeStyle = `rgba(148, 163, 184, ${fadeAlpha * 0.45})`;
            ctx.lineWidth = 1;
          }
          ctx.stroke();

          // Draw small glow points at vertices
          vertices.forEach((v, idx) => {
            if (i % 2 === 0 && idx % 2 === 0) {
              ctx.beginPath();
              ctx.arc(v.x, v.y, Math.max(1, 2 * scale), 0, Math.PI * 2);
              ctx.fillStyle = idx % 4 === 0 ? '#00f0ff' : '#00ff88';
              ctx.shadowColor = idx % 4 === 0 ? '#00f0ff' : '#00ff88';
              ctx.shadowBlur = 10;
              ctx.fill();
              ctx.shadowBlur = 0; // reset
            }
          });
        }
      }

      // Draw longitudinal ribs (lines connecting ring vertices)
      for (let i = 0; i < numRings - 1; i++) {
        const ringA = projectedRings[i];
        const ringB = projectedRings[i + 1];

        if (!ringA || ringA.length === 0 || !ringB || ringB.length === 0) continue;

        for (let j = 0; j < 8; j++) {
          const ptA = ringA[j];
          const ptB = ringB[j];

          ctx.beginPath();
          ctx.moveTo(ptA.x, ptA.y);
          ctx.lineTo(ptB.x, ptB.y);

          // Alternating colors for different ribs to make it circuit-like
          const isBlueRib = j % 4 === 0 || j === 1;
          const isGreenRib = j % 4 === 2 || j === 5;

          // Estimate distance / depth of this segment for fading
          const segmentZ = i * spacing - (cameraZ % maxZ);
          const alphaFactor = Math.max(0, 1 - segmentZ / maxZ) * 0.35;

          if (isBlueRib) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${alphaFactor})`;
            ctx.lineWidth = 1.2;
          } else if (isGreenRib) {
            ctx.strokeStyle = `rgba(0, 255, 136, ${alphaFactor})`;
            ctx.lineWidth = 1.2;
          } else {
            ctx.strokeStyle = `rgba(148, 163, 184, ${alphaFactor * 0.35})`;
            ctx.lineWidth = 0.8;
          }
          ctx.stroke();
        }
      }

      // 5. Render Data Packets zooming along ribs
      packets.forEach((p) => {
        // Move packet
        p.z -= p.speed;
        if (p.z < 0) {
          p.z = maxZ;
          p.rib = Math.floor(Math.random() * 8);
          p.color = Math.random() > 0.4 ? '#00f0ff' : '#00ff88';
        }

        // Project packet position
        let relativeZ = p.z - (cameraZ % maxZ);
        if (relativeZ < 0) relativeZ += maxZ;
        if (relativeZ < 10 || relativeZ > maxZ - 100) return;

        const scale = fov / relativeZ;
        const radius = baseRadius * scale;

        // Angle for this rib
        const angle = (p.rib / 8) * 2 * Math.PI;
        const wave = Math.sin(angle * 4 + ambientOffset * 0.05) * 10 * scale;
        const r = radius + wave;

        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;

        const alpha = Math.max(0, 1 - relativeZ / maxZ);

        // Draw packet as a bright streak or dot with glow
        ctx.beginPath();
        ctx.arc(px, py, Math.max(2, 4 * scale), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12 * scale;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // 6. Draw central grid / network core (faint portal effect)
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.05)';
      ctx.fill();

      // Loop
      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="cyber-canvas"
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
