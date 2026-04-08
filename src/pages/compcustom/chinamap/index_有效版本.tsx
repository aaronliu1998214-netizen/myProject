import React, { useEffect, useRef } from 'react';
import { LineLayer, Marker, PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7';
import 'district-data';
import * as District from 'district-data';

const Index: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 点位数据
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
      {
        data: [114.63332, 38.174659],
        longitude: '114.63332',
        latitude: ' 38.174659',
        text: '石家庄',
        color: 'rgb(255,255,255)',
        value: '3',
        unit: '小时',
      },
      {
        data: [101.740747, 36.558335],
        longitude: '101.740747',
        latitude: '36.558335',
        text: '西宁',
        color: 'rgb(255,255,255)',
        value: '3',
        unit: '小时',
      },
      {
        data: [111.677604, 40.853815],
        longitude: '111.677604',
        latitude: '40.853815',
        to_longitude: '106.563516',
        to_latitude: '29.618267',
        text: '呼和浩特',
        color: 'rgb(255,255,255)',
        value: '1',
        unit: '天',
      },
      {
        data: [120.152667, 30.195612],
        longitude: '120.152667',
        latitude: '30.195612',
        text: '杭州',
        color: 'rgb(255,255,255)',
        value: '3',
        unit: '小时',
      },
      {
        data: [115.804205, 28.766485],
        longitude: '115.804205',
        latitude: '28.766485',
        to_longitude: '120.152667',
        to_latitude: '30.195612',
        text: '南昌',
        color: 'rgb(255,255,255)',
        value: '1',
        unit: '天',
      },
      {
        data: [126.520858, 45.842367],
        longitude: '126.520858',
        latitude: '45.842367',
        text: '哈尔滨',
        color: 'rgb(255,255,255)',
        value: '3',
        unit: '小时',
      },
      {
        data: [123.459186, 41.711976],
        longitude: '123.459186',
        latitude: '41.711976',
        to_longitude: '126.520858',
        to_latitude: '45.842367',
        text: '沈阳',
        color: 'rgb(255,255,255)',
        value: '3',
        unit: '小时',
      },
      {
        data: [117.113981, 36.624459],
        longitude: '117.113981',
        latitude: '36.624459',
        to_longitude: '114.63332',
        to_latitude: '38.174659',
        text: '济南',
        color: 'rgb(255,255,255)',
        value: '3',
        unit: '小时',
      },
    ];


  const scene = new Scene({
    id: mapContainerRef.current,
    map: new Map({
      center: [111.4453125, 32.84267363195431],
      pitch: 35,
      zoom: 3,
    }),
  });

    scene.setBgColor('#131722');

    scene.on('loaded', () => {
      mapContainerRef.current!.style.background = '#131722';

      // 添加 Marker
      pointData.forEach((item) => {
        const el = document.createElement('label');
        el.className = 'labelclass';
        el.textContent = item.value + item.unit;
        el.style.background = '#e24c4c8c';
        el.style.borderRadius = '50%';
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.lineHeight = '40px';
        el.style.textAlign = 'center';
        el.style.color = '#fff';
        const marker = new Marker({ element: el, offsets: [50, 10] }).setLnglat({
          lng: Number(item.longitude),
          lat: Number(item.latitude),
        });
        scene.addMarker(marker);
      });

      // 加载行政区划数据
     const source = new District.RDBSource({
       version: 2023,
     });

      source
        .getData({ level: 'province', precision: 'low' })
        .then((data: any) => {
          const newFeatures = data.features.filter((item: any) => item.properties.name);
          const lineDown = new LineLayer({ zIndex: 10 })
            .source({ type: 'FeatureCollection', features: newFeatures })
            .shape('line')
            .color('#989494')
            .size(0.6)
            .style({ raisingHeight: 650000, opacity: 0.8 });
          scene.addLayer(lineDown);
        });

      source
        .getData({ level: 'country', precision: 'low' })
        .then((data: any) => {
          const provincelayer = new PolygonLayer({ autoFit: true })
            .source(data)
            .size(650000)
            .shape('extrude')
            .color('#5886CF')
            .style({ heightfixed: true, pickLight: true, opacity: 0.8 });

          const boundaryLine = new LineLayer({ zIndex: 10 })
            .source(data)
            .shape('line')
            .color('#5DDDFF')
            .size(1)
            .style({ raisingHeight: 650000 });

          scene.addLayer(boundaryLine);
          scene.addLayer(provincelayer);
        });

      // 飞线
      const flyLine3 = new LineLayer({ blend: 'normal' })
        .source(pointData, {
          parser: { type: 'json', x: 'longitude', y: 'latitude', x1: 'to_longitude', y1: 'to_latitude' },
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

      const pointLayer = new PointLayer({ depth: false, zIndex: 11, heightFixed: true })
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

      const pointLayer2 = new PointLayer({ zIndex: 10 })
        .source(pointData, { parser: { type: 'json', x: 'longitude', y: 'latitude' } })
        .shape('circle')
        .active(true)
        .animate(true)
        .size(40)
        .color('color');

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

      // ⚠️ 图片因网络原因加载失败，已移除 imageLayer
      // 如需使用，请替换为有效图片链接并重新添加

      scene.addLayer(textLayer);
      scene.addLayer(pointLayer);
      scene.addLayer(pointLayer2);
      scene.addLayer(flyLine3);
    });

    return () => {
      scene.destroy();
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      style={{ width: '100%', height: '100vh' }}
    />
  );
};

export default Index;