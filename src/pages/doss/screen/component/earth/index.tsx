import { EarthLayer, LineLayer, Scene } from "@antv/l7";
import { Earth } from "@antv/l7-maps";
import React, { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { points } from "./data";

interface IPprop {
  params?: any;
}

const EarthGlobe: React.FC<IPprop> = ({ params }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const animationRef = useRef<number | null>(null);
  const earthLayerRef = useRef<EarthLayer | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // 优化：减少飞线数据量，只保留前20条重要路线
  const optimizedPoints = useMemo(() => {
    return points.slice(0, 20); // 从48条减少到20条，减少约60%的渲染负担
  }, []);

  // 清理动画的函数
  const cleanupAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // 暂停/恢复动画的函数
  const pauseAnimation = useCallback(() => {
    cleanupAnimation();
  }, [cleanupAnimation]);

  const resumeAnimation = useCallback(() => {
    if (!earthLayerRef.current || animationRef.current) return;

    let rotation = 0;
    const rotateSpeed = 2;
    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        rotation += rotateSpeed;
        if (earthLayerRef.current) {
          earthLayerRef.current.style({
            rotation: rotation,
          });
        }
        lastTime = currentTime;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // 可见性检测：当组件不可见时暂停动画
  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const visible = entry.isIntersecting;
        setIsVisible(visible);

        if (visible) {
          resumeAnimation();
        } else {
          pauseAnimation();
        }
      },
      {
        threshold: 0.1, // 当10%可见时认为是可见的
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pauseAnimation, resumeAnimation]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new Scene({
      id: containerRef.current,
      map: new Earth({
        zoom: 3,
        minZoom: 3,
        maxZoom: 3,
        scrollZoom: false,
        doubleClickZoom: false,
        touchZoomRotate: false,
      }),
      logoVisible: false,
      // 添加性能优化选项
      preserveDrawingBuffer: false, // 不保留绘制缓冲区，减少内存使用
      antialias: false, // 关闭抗锯齿，提升性能
    });

    sceneRef.current = scene;
    scene.setBgColor("#666");

    const earthTexture =
      "https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ";

    const earthlayer = new EarthLayer()
      .source(earthTexture, {
        parser: { type: "image" },
      })
      .color("#2E8AE6")
      .shape("fill")
      .style({
        globalOptions: {
          ambientRatio: 1.0,
          diffuseRatio: 0.0,
          specularRatio: 0.0,
        },
      })
      .animate(false);

    earthLayerRef.current = earthlayer;

    const atomLayer = new EarthLayer().color("#2E8AE6").shape("atomSphere");

    const bloomLayer = new EarthLayer()
      .color("#fff")
      .shape("bloomSphere")
      .style({
        opacity: 0.7,
      });

    scene.on("loaded", () => {
      scene.addLayer(earthlayer);
      scene.addLayer(atomLayer);
      scene.addLayer(bloomLayer);

      // 使用优化后的数据
      const flyLine = new LineLayer({ blend: "normal" })
        .source(optimizedPoints, {
          parser: {
            type: "json",
            coordinates: "coord",
          },
        })
        .color("#4bbfde")
        .shape("arc3d")
        .size(0.2)
        .active(true)
        .animate({
          interval: 2,
          trailLength: 2,
          duration: 1,
        })
        .style({
          segmentNumber: 20, // 从30减少到20，降低渲染复杂度
          globalArcHeight: 3,
        });

      scene.addLayer(flyLine);

      // 只有当组件可见时才启动动画
      if (isVisible) {
        resumeAnimation();
      }
    });

    return () => {
      cleanupAnimation();
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      scene.destroy();
      sceneRef.current = null;
      earthLayerRef.current = null;
    };
  }, [cleanupAnimation, optimizedPoints, resumeAnimation, isVisible]);

  // 页面失焦时暂停动画，获得焦点时恢复
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAnimation();
      } else if (isVisible) {
        resumeAnimation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseAnimation, resumeAnimation, isVisible]);

  // 优化：缓存样式对象
  const containerStyle = useMemo(() => ({
    width: "100%",
    height: "80vh",
    marginTop: "5vh",
    position: "relative" as const,
  }), []);

  const mapStyle = useMemo(() => ({
    width: "100%",
    height: "100%",
    position: "absolute" as const,
  }), []);

  return (
    <div style={containerStyle}>
      <div
        ref={containerRef}
        id="map"
        style={mapStyle}
      />
    </div>
  );
};

export default React.memo(EarthGlobe);
