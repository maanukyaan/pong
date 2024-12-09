import { useEffect, useRef } from "react";

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dpr = window.devicePixelRatio || 1;

  const platformHeight = 200;
  const platformSpeed = 8;

  let leftPlatformVerticalPosition = 0,
    rightPlatformVerticalPosition = 0;

  const initializePlatformPosition = (verticalCenter: number) => {
    return verticalCenter - platformHeight / 2;
  };

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
    leftPlatformVerticalPosition =
      leftPlatformVerticalPosition ||
      initializePlatformPosition(verticalCenter);
    rightPlatformVerticalPosition =
      rightPlatformVerticalPosition ||
      initializePlatformPosition(verticalCenter);

    leftPlatformVerticalPosition = Math.max(
      1,
      Math.min(leftPlatformVerticalPosition, height - platformHeight)
    );

    rightPlatformVerticalPosition = Math.max(
      1,
      Math.min(rightPlatformVerticalPosition, height - platformHeight)
    );

    ctx.roundRect(100, leftPlatformVerticalPosition, 10, platformHeight, [6]);
    ctx.fill();

    ctx.roundRect(
      width - 110,
      rightPlatformVerticalPosition,
      10,
      platformHeight,
      [6]
    );
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

    let isMovingUpLeft = false;
    let isMovingDownLeft = false;
    let isMovingUpRight = false;
    let isMovingDownRight = false;

    const update = () => {
      if (isMovingUpLeft) {
        leftPlatformVerticalPosition -= platformSpeed;
      } else if (isMovingDownLeft) {
        leftPlatformVerticalPosition += platformSpeed;
      }

      if (isMovingUpRight) {
        rightPlatformVerticalPosition -= platformSpeed;
      } else if (isMovingDownRight) {
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
        isMovingUpLeft = true;
      } else if (event.code === "KeyS") {
        isMovingDownLeft = true;
      }

      if (event.code === "ArrowUp") {
        isMovingUpRight = true;
      } else if (event.code === "ArrowDown") {
        isMovingDownRight = true;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.code === "KeyW") {
        isMovingUpLeft = false;
      } else if (event.code === "KeyS") {
        isMovingDownLeft = false;
      }

      if (event.code === "ArrowUp") {
        isMovingUpRight = false;
      } else if (event.code === "ArrowDown") {
        isMovingDownRight = false;
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
