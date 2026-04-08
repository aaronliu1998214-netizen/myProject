import React, { useEffect, useState } from 'react';
import fs from 'fs';
import * as turf from '@turf/turf';
import { PageLoading } from '@ant-design/pro-components';
import { HeatmapLayer, MapboxScene, PointLayer } from '@antv/l7-react';
import chongqing from './chongqing_points.json'

const Map: React.FC = () => {
  // 保存地图点数据
  const [data, setData] = useState<any>(null);
  // 保存热力图网格数据
  const [grid, setGrid] = useState<any>(null);
  // 控制加载状态
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 异步加载两个数据源（地理点数据和热力图网格数据）
    const fetchData = async () => {
      setGrid(chongqing);
      setLoading(true); // 数据加载完成，切换状态

      
    };

    fetchData(); // 初始执行一次
  }, []);


  useEffect(()=>{


  },[])



  // 数据未加载完成，显示加载中页面
  if (!loading) {
    return <PageLoading />;
  }

  return (
    // 地图容器，使用 Mapbox 地图引擎
    <MapboxScene
      map={{
        center: [106.56288,29.556742], // 初始中心点
        pitch: 0, // 俯仰角
        style: 'blank', // 地图底图样式为空白
        zoom: 6, // 初始缩放等级
      }}
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
      }}
    >
      {/* 热力图图层（六边形网格聚合） */}
      {grid && (
        <HeatmapLayer
          key="heatmap"
          source={{
            data: grid,
            transforms: [
              {
                type: 'grid', // 使用方块边形聚合
                size: 20000, // 聚合单元的大小（单位：米）
                field: 'capacity', // 聚合字段
                method: 'sum', // 聚合方法为求和
              },
            ],
          }}
          color={{
            values: 'red', // 所有热力单元为灰色
          }}
          shape={{
            values: 'square', // 显示为六边形
          }}
          style={{
            coverage: 0.7, // 六边形覆盖率
            opacity: 0.8, // 图层透明度
          }}
        />
      )}
    </MapboxScene>
  );
};

export default Map;
