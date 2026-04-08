import React, { useEffect, useState } from 'react';
import { Scene, PointLayer } from '@antv/l7-react';
import { GaodeMap } from '@antv/l7-maps';

const Map: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  return (
    <div style={{ height: '500px', position: 'relative' }}>
      <Scene
        style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}
        map={
          new GaodeMap({
            pitch: 20,
            style: 'light',
            center: [120, 20],
            zoom: 3,
          })
        }
      >
        {data && (
          <PointLayer
            source={data}
            shape="simple"
            size={15}
            color={{
              field: 'mag',
              values: (mag: number) => (mag > 4.5 ? '#5B8FF9' : '#5CCEA1'),
            }}
            active={true}
            style={{
              opacity: 0.6,
              strokeWidth: 3,
            }}
          />
        )}
      </Scene>
    </div>
  );
};

export default Map;
