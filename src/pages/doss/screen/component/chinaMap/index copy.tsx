import React, { useEffect, useRef } from 'react';
import { LineLayer, Marker, PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import 'district-data';
import * as District from 'district-data';

const Index: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let scene: Scene;

    const timeout = setTimeout(() => {
      const pointData = [
        {
          data: [113.177855, 23.068432],
          longitude: '113.177855',
          latitude: '23.068432',
          to_longitude: '108.484899',
          to_latitude: '22.826101',
          text: '广州',
          color: 'rgb(57,255,20)',
          value: '1',
          unit: '天',
        },
        {
          data: [108.484899, 22.826101],
          longitude: '108.484899',
          latitude: '22.826101',
          to_longitude: '106.467366',
          to_latitude: '26.64921',
          text: '南宁',
          color: 'rgb(57,255,20)',
          value: '6',
          unit: '小时',
        },
        {
          data: [106.467366, 26.64921],
          longitude: '106.467366',
          latitude: '26.64921',
          text: '贵阳',
          color: 'rgb(57,255,20)',
          value: '3',
          unit: '小时',
        },
        {
          data: [106.563516, 29.618267],
          longitude: '106.563516',
          latitude: '29.618267',
          text: '重庆',
          color: 'rgb(255,255,255)',
          value: '3',
          unit: '小时',
        },
        {
          data: [125.403053, 43.907546],
          longitude: '125.403053',
          latitude: '43.907546',
          text: '长春',
          color: 'rgb(255,255,255)',
          value: '3',
          unit: '小时',
        },
        {
          data: [113.607498, 34.794084],
          longitude: '113.607498',
          latitude: '34.794084',
          to_longitude: '125.403053',
          to_latitude: '43.907546',
          text: '郑州',
          color: 'rgb(57,255,20)',
          value: '1',
          unit: '天',
        },
      ];

      scene = new Scene({
        id: mapContainerRef.current!,
        map: new Map({
          center: [111.4453125, 32.84267363195431],
          pitch: 35,
          zoom: 3,
        }),
      });


      scene.on('loaded', () => {
        // ✅ 修复地图尺寸不匹配问题
        scene?.mapService?.map?.resize();

        // 添加城市圆形 Marker
        pointData.forEach((item) => {
          const el = document.createElement('label');
          el.textContent = item.value + item.unit;
          Object.assign(el.style, {
            background: '#e24c4c8c',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            lineHeight: '40px',
            textAlign: 'center',
            color: '#fff',
          });

          const marker = new Marker({ element: el, offsets: [50, 10] }).setLnglat({
            lng: Number(item.longitude),
            lat: Number(item.latitude),
          });

          scene.addMarker(marker);
        });

        // 省界线
        const source = new District.RDBSource({ version: 2023 });
        source.getData({ level: 'province', precision: 'low' }).then((data: any) => {
          const features = data.features.filter((item: any) => item.properties.name);
          const lineLayer = new LineLayer({ zIndex: 10 })
            .source({ type: 'FeatureCollection', features })
            .shape('line')
            .color('#5DDDFF')
            .size(0.9)
            .style({ raisingHeight: 800000, opacity: 0.8 });

          scene.addLayer(lineLayer);
        });

        // 国家边界线+面
        source.getData({ level: 'country', precision: 'low' }).then((data: any) => {
          const polygonLayer = new PolygonLayer({ autoFit: true })
            .source(data)
            .size(800000)
            .shape('extrude')
            .color('#243d6c')
            .style({ heightfixed: true, pickLight: true, opacity: 0.8 });

          const boundaryLine = new LineLayer({ zIndex: 10 })
            .source(data)
            .shape('line')
            .color('#5DDDFF')
            .size(1.5)
            .style({ raisingHeight: 800000 });

          scene.addLayer(boundaryLine);
          scene.addLayer(polygonLayer);
        });

        // 飞线
        const flyLineLayer = new LineLayer({ blend: 'normal' })
          .source(pointData, {
            parser: {
              type: 'json',
              x: 'longitude',
              y: 'latitude',
              x1: 'to_longitude',
              y1: 'to_latitude',
            },
          })
          .size(2)
          .shape('arc3d')
          .color('rgb(0, 191, 255)')
          .animate({ interval: 0.1, trailLength: 0.4, duration: 0.5 })
          .style({
            sourceColor: 'rgb(0, 191, 255)',
            targetColor: 'rgb(57,255,20)',
            thetaOffset: 1,
            opacity: 1,
          });

        // 柱状图
        const cylinderLayer = new PointLayer({ depth: false, zIndex: 11, heightFixed: true })
          .source(pointData, { parser: { type: 'json', x: 'longitude', y: 'latitude' } })
          .shape('cylinder')
          .size([4, 4, 90])
          .active(true)
          .color('color')
          .style({
            opacity: 1,
            opacityLinear: { enable: true, dir: 'up' },
            lightEnable: false,
          });

        // 波纹圆点
        const rippleLayer = new PointLayer({ zIndex: 10 })
          .source(pointData, { parser: { type: 'json', x: 'longitude', y: 'latitude' } })
          .shape('circle')
          .active(true)
          .animate(true)
          .size(40)
          .color('color');

        // 文字图层
        const textLayer = new PointLayer({ zIndex: 2 })
          .source(pointData, { parser: { type: 'json', x: 'longitude', y: 'latitude' } })
          .shape('text', 'text')
          .size(14)
          .color('#0ff')
          .style({
            textAnchor: 'center',
            spacing: 2,
            padding: [1, 1],
            stroke: '#0ff',
            strokeWidth: 0.2,
            raisingHeight: 2551000,
            textAllowOverlap: true,
            heightFixed: true,
          });

        scene.addLayer(textLayer);
        scene.addLayer(cylinderLayer);
        scene.addLayer(rippleLayer);
        scene.addLayer(flyLineLayer);
      });

      // ✅ 窗口大小变更时重新适配
      window.addEventListener('resize', handleResize);
    }, 0);

    const handleResize = () => {
      scene?.mapService?.map?.resize();
    };

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
      scene?.destroy();
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '90vh',
        position: 'relative',
      }}
    >
      <div
        ref={mapContainerRef}
        id="map"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      />
    </div>
  );
};

export default Index;
