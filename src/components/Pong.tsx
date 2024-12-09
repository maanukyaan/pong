import { useEffect, useRef } from "react";

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dpr = window.devicePixelRatio || 1;

  let leftPlatformVerticalPosition = 0,
    rightPlatformVerticalPosition = 0;
  const platformSpeed = 7;

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
    leftPlatformVerticalPosition =
      leftPlatformVerticalPosition === 0
        ? platformCenter
        : leftPlatformVerticalPosition;
    rightPlatformVerticalPosition =
      rightPlatformVerticalPosition === 0
        ? platformCenter
        : rightPlatformVerticalPosition;

    // First player platform
    ctx.roundRect(100, leftPlatformVerticalPosition, 10, 200, [6]);
    ctx.fill();

    // Second player platform
    ctx.roundRect(width - 110, rightPlatformVerticalPosition, 10, 200, [6]);
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

    let isMovingUpLeftPlatform = false;
    let isMovingDownLeftPlatform = false;
    let isMovingUpRightPlatform = false;
    let isMovingDownRightPlatform = false;

    const update = () => {
      if (isMovingUpLeftPlatform) {
        leftPlatformVerticalPosition -= platformSpeed;
      } else if (isMovingDownLeftPlatform) {
        leftPlatformVerticalPosition += platformSpeed;
      }

      if (isMovingUpRightPlatform) {
        rightPlatformVerticalPosition -= platformSpeed;
      } else if (isMovingDownRightPlatform) {
        rightPlatformVerticalPosition += platformSpeed;
      }

      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          render(canvas, ctx);
        }
      }

      requestAnimationFrame(update);
    };

    window.addEventListener("keydown", (event) => {
      if (event.code === "KeyW") {
        isMovingUpLeftPlatform = true;
      } else if (event.code === "KeyS") {
        isMovingDownLeftPlatform = true;
      }

      if (event.code === "ArrowUp") {
        isMovingUpRightPlatform = true;
      } else if (event.code === "ArrowDown") {
        isMovingDownRightPlatform = true;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.code === "KeyW") {
        isMovingUpLeftPlatform = false;
      } else if (event.code === "KeyS") {
        isMovingDownLeftPlatform = false;
      }

      if (event.code === "ArrowUp") {
        isMovingUpRightPlatform = false;
      } else if (event.code === "ArrowDown") {
        isMovingDownRightPlatform = false;
      }
    });

    requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", () => {});
      window.removeEventListener("keyup", () => {});
    };
  }, [dpr]);

  return (
    <canvas ref={canvasRef}>
      Ваш браузер не поддерживает тег HTML canvas.
    </canvas>
  );
}
