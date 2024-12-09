import { useEffect, useRef } from "react";

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dpr = window.devicePixelRatio || 1;

  const render = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const width = canvas.width / dpr;
    const horizontalCenter = width / 2;
    const height = canvas.height / dpr;
    const verticalCenter = height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#f1f1f1";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 40px Unbounded";
    ctx.fillText("PONG: та самая классика", horizontalCenter, 70);

    // Circle
    ctx.beginPath();
    ctx.arc(horizontalCenter, verticalCenter, 10, 0, 2 * Math.PI);
    ctx.fill();

    // Platforms
    const platformHeight = 200;
    const platformCenter = verticalCenter - platformHeight / 2;

    // First player platform
    ctx.roundRect(100, platformCenter, 10, 200, [6]);
    ctx.fill();

    // Second player platform
    ctx.roundRect(width - 110, platformCenter, 10, 200, [6]);
    ctx.fill();
  };

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          canvas.width = window.innerWidth * dpr;
          canvas.height = window.innerHeight * dpr;
          canvas.style.width = `${window.innerWidth}px`;
          canvas.style.height = `${window.innerHeight}px`;

          ctx.scale(dpr, dpr);
          render(canvas, ctx);
        }
      }
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [dpr]);

  return (
    <canvas ref={canvasRef}>
      Your browser does not support the HTML canvas tag.
    </canvas>
  );
}
