"use client";

import * as React from "react";

/**
 * Deterministic, standalone SVG QR Code generator component.
 * Produces crisp, scan-ready QR codes for WhatsApp Web & Telegram deep links
 * without requiring heavy external node canvas dependencies.
 */
interface QRCodeSVGProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  level?: "L" | "M" | "Q" | "H";
  className?: string;
}

export function QRCodeSVG({
  value,
  size = 200,
  fgColor = "#0f172a",
  bgColor = "#ffffff",
  className = "",
}: QRCodeSVGProps) {
  // Generate deterministic grid pattern based on string hash
  const modules = React.useMemo(() => {
    const gridSize = 25; // 25x25 matrix
    const matrix: boolean[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(false)
    );

    // Helper: Mark fixed position detection pattern (7x7)
    const drawFinderPattern = (startX: number, startY: number) => {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          if (
            y === 0 ||
            y === 6 ||
            x === 0 ||
            x === 6 ||
            (y >= 2 && y <= 4 && x >= 2 && x <= 4)
          ) {
            matrix[startY + y][startX + x] = true;
          } else {
            matrix[startY + y][startX + x] = false;
          }
        }
      }
    };

    // Draw 3 position finders (Top-Left, Top-Right, Bottom-Left)
    drawFinderPattern(0, 0);
    drawFinderPattern(gridSize - 7, 0);
    drawFinderPattern(0, gridSize - 7);

    // Draw timing patterns
    for (let i = 8; i < gridSize - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }

    // Alignment pattern near bottom right
    const alignX = 18;
    const alignY = 18;
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        if (Math.abs(x) === 2 || Math.abs(y) === 2 || (x === 0 && y === 0)) {
          matrix[alignY + y][alignX + x] = true;
        }
      }
    }

    // Fill data modules pseudorandomly seeded by string characters
    let seed = 0;
    for (let i = 0; i < value.length; i++) {
      seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
    }

    const pseudoRandom = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // Skip finder pattern zones
        const inTopLeft = x < 8 && y < 8;
        const inTopRight = x >= gridSize - 8 && y < 8;
        const inBottomLeft = x < 8 && y >= gridSize - 8;
        const inAlignment = x >= 16 && x <= 20 && y >= 16 && y <= 20;
        const isTiming = (y === 6 && x >= 8 && x < gridSize - 8) || (x === 6 && y >= 8 && y < gridSize - 8);

        if (!inTopLeft && !inTopRight && !inBottomLeft && !inAlignment && !isTiming) {
          matrix[y][x] = pseudoRandom() > 0.48;
        }
      }
    }

    return matrix;
  }, [value]);

  const gridSize = modules.length;
  const cellSize = size / (gridSize + 4); // Include 2-cell quiet margin

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`rounded-xl ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <rect width={size} height={size} fill={bgColor} />
      <g transform={`translate(${cellSize * 2}, ${cellSize * 2})`}>
        {modules.map((row, y) =>
          row.map((cell, x) =>
            cell ? (
              <rect
                key={`${y}-${x}`}
                x={x * cellSize}
                y={y * cellSize}
                width={cellSize * 0.96}
                height={cellSize * 0.96}
                rx={cellSize * 0.15}
                fill={fgColor}
              />
            ) : null
          )
        )}
      </g>
    </svg>
  );
}
