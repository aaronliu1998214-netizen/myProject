import React, { useEffect, useRef } from 'react';
import { EarthLayer, LineLayer, Scene } from '@antv/l7';
import { Earth } from '@antv/l7-maps';

const EarthGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new Scene({
      id: containerRef.current,
      map: new Earth({}),
    });

    scene.setBgColor('#333');

    // ✅ 地球贴图（使用公开可用的地球贴图链接）
    const earthTexture = 'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ';

    const earthlayer = new EarthLayer()
      .source(earthTexture, {
        parser: { type: 'image' },
      })
      .color('#2E8AE6')
      .shape('fill')
      .style({
        globalOptions: {
          ambientRatio: 0.6,
          diffuseRatio: 0.4,
          specularRatio: 0.1,
        },
      })
      .animate(true);

    const atomLayer = new EarthLayer().color('#2E8AE6').shape('atomSphere');

    const bloomLayer = new EarthLayer().color('#fff').shape('bloomSphere').style({
      opacity: 0.7,
    });

    scene.on('loaded', () => {
      scene.addLayer(earthlayer);
      scene.addLayer(atomLayer);
      scene.addLayer(bloomLayer);

      fetch('https://gw.alipayobjects.com/os/bmw-prod/20a69b46-3d6d-4ab5-b8b5-150b6aa52c88.json')
        .then((res) => res.json())
        .then((flydata) => {
          const flyLine = new LineLayer({ blend: 'normal' })
            .source(flydata, {
              parser: {
                type: 'json',
                coordinates: 'coord',
              },
            })
            .color('#b97feb')
            .shape('arc3d')
            .size(0.5)
            .active(true)
            .animate({
              interval: 2,
              trailLength: 2,
              duration: 1,
            })
            .style({
              segmentNumber: 60,
              globalArcHeight: 20,
            });

          scene.addLayer(flyLine);
        });

      earthlayer.setEarthTime(4.0);
    });

    return () => {
      scene.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100vh', background: '#000' }}
    />
  );
};

export default EarthGlobe;