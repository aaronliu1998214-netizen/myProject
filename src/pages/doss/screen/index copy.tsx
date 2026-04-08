import React, { useState, useEffect, useCallback, useMemo, memo, Suspense, lazy } from 'react';
import './index.less';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useLocation } from 'umi';
import { history } from '@umijs/max';
import cq_bg from '@/assets/screen/cq_bg.png';
import bg from '@/assets/screen/bg.png';
import Header from '@/pages/screen/component/header';
import ItemCard from '@/pages/screen/component/itemCard';
import CenterComp from '@/pages/screen/component/center';
import SelectRadio from '@/pages/screen/component/select';
import { getSummaryData } from '../screen/service';
import { enterFullScreen, exitFullScreen, isFullScreenNow } from '@/utils/fullscreen';

// 懒加载组件 - 只有在需要时才加载
const AttackAnalysis = lazy(() => import('@/pages/screen/component/attackAnalysis'));
const Coprocessing = lazy(() => import('@/pages/screen/component/coprocessing'));
const OverViewProtectedAssets = lazy(() => import('@/pages/screen/component/overViewProtectedAssets'));
const ResourcesMonitor = lazy(() => import('@/pages/screen/component/resourcesMonitor'));
const TreatIntell = lazy(() => import('@/pages/screen/component/treatIntell'));
const Replay = lazy(() => import('@/pages/screen/component/replay'));
const RealTimeAttack = lazy(() => import('@/pages/screen/component/realTimeAttack'));
const EarthIndex = lazy(() => import('@/pages/screen/component/earthIndex'));
const EarthModal = lazy(() => import('@/pages/screen/component/earth'));
const MapModal = lazy(() => import('@/pages/screen/component/chinaMap'));

// 使用memo优化组件，只有props变化时才重新渲染
const MemoizedAttackAnalysis = memo(AttackAnalysis);
const MemoizedCoprocessing = memo(Coprocessing);
const MemoizedOverViewProtectedAssets = memo(OverViewProtectedAssets);
const MemoizedResourcesMonitor = memo(ResourcesMonitor);
const MemoizedTreatIntell = memo(TreatIntell);
const MemoizedReplay = memo(Replay);
const MemoizedRealTimeAttack = memo(RealTimeAttack);
const MemoizedEarthIndex = memo(EarthIndex);
const MemoizedEarthModal = memo(EarthModal);
const MemoizedMapModal = memo(MapModal);

// 加载状态组件
const LoadingFallback: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: '#ffffff',
    fontSize: '14px'
  }}>
    加载中...
  </div>
);

const App: React.FC = () => {
  const location = useLocation();
  const isBig = location.pathname.includes('screen_big');
  const [type, setType] = useState<number>(1);
  const [confluence, setConfluence] = useState<any>({
    totalAttackEvents: 0,
    totalAttackedEvents: 0,
    impactHours: 0,
    averageResponseEfficiency: 0,
    list: []
  });
  const [params, setParams] = useState<any>(null);

  /** 类型切换 - 使用useCallback缓存函数 */
  const onTypeSelect = useCallback((val: number) => {
    if (val && val !== type) setType(val);
  }, [type]);

  /** 请求数据 - 使用useCallback缓存函数 */
  const querySummaryData = useCallback(async (p: any) => {
    try {
      const res = await getSummaryData(p);
      if (res) setConfluence(res);
    } catch (err) {
      console.error('获取数据失败:', err);
    }
  }, []);

  // 使用useMemo缓存请求参数，避免不必要的API调用
  const queryParams = useMemo(() => {
    if (!params) return null;
    return { type, ...params };
  }, [type, params]);

  useEffect(() => {
    if (queryParams) querySummaryData(queryParams);
  }, [queryParams, querySummaryData]);

  /** 获取头部参数 - 使用useCallback缓存函数 */
  const getParams = useCallback((val: any) => {
    const newParams = {
      ...val,
      beginTime: val.beginTime.slice(0, 10),
      endTime: val.endTime.slice(0, 10),
      refresh: false,
    };
    setParams(newParams);
  }, []);

  /** ✅ 优化刷新机制：增加刷新间隔，添加防抖 */
  useEffect(() => {
    if (!params) return;

    // 将刷新间隔从3分钟增加到5分钟，减少服务器压力
    const timer = setInterval(() => {
      setParams((prev:any) => ({
        ...prev,
        refresh: !prev?.refresh
      }));
    }, 60 * 5 * 1000); // 改为5分钟刷新一次

    return () => clearInterval(timer);
  }, [params]);

  /** 背景图计算 - 使用useMemo缓存计算结果 */
  const bgStyle = useMemo(
    () => ({
      backgroundImage: `url(${type === 2 ? cq_bg : bg})`,
      backgroundSize: type === 2 ? '90% 80%' : '100% 100%'
    }),
    [type]
  );

  /** 缓存全屏状态 */
  const isFullscreen = useMemo(() => isFullScreenNow(), [isBig]);

  /** 路由切换时自动进入/退出全屏 */
  useEffect(() => {
    if (isBig) {
      enterFullScreen();
    } else {
      exitFullScreen();
    }
  }, [isBig]);

  /** 全屏切换处理函数 - 使用useCallback缓存 */
  const handleFullscreenToggle = useCallback(() => {
    if (isBig) {
      history.push('/screen');
    } else {
      history.push('/screen_big');
    }
  }, [isBig]);

  /** 监听 ESC 退出全屏，自动跳回 /screen */
  useEffect(() => {
    const handler = () => {
      if (!isFullScreenNow() && isBig) {
        history.push('/screen');
      }
    };
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    document.addEventListener('mozfullscreenchange', handler);
    document.addEventListener('MSFullscreenChange', handler);

    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
      document.removeEventListener('mozfullscreenchange', handler);
      document.removeEventListener('MSFullscreenChange', handler);
    };
  }, [isBig]);

  // 缓存confluence.list避免每次渲染都传入新的引用
  const confluenceList = useMemo(() => confluence?.list || [], [confluence?.list]);

  return (
    <div className="screen_main">
      <div className="map" style={bgStyle}>
        <div className="map_center">
          <Suspense fallback={<LoadingFallback />}>
            {type === 1 ?
              <MemoizedEarthModal params={params} /> :
              <MemoizedMapModal params={params} />
            }
          </Suspense>
        </div>
      </div>

      <div className="main_top">
        <Header getParams={getParams} ifFullScreen={isFullscreen} />
        <div className="container">
          <div className="column">
            <ItemCard title="防护资产概况" height="26vh">
              <Suspense fallback={<LoadingFallback />}>
                <MemoizedOverViewProtectedAssets params={params} />
              </Suspense>
            </ItemCard>
            <ItemCard title="防护资源监控" height="37vh">
              <Suspense fallback={<LoadingFallback />}>
                <MemoizedResourcesMonitor params={params} ifFullScreen={isFullscreen} />
              </Suspense>
            </ItemCard>
            <ItemCard title="威胁情报" height="22vh">
              <Suspense fallback={<LoadingFallback />}>
                <MemoizedTreatIntell params={params} />
              </Suspense>
            </ItemCard>
          </div>

          <div className="column" />

          <div className="column">
            <ItemCard title="攻击事件分析" height="27vh">
              <Suspense fallback={<LoadingFallback />}>
                <MemoizedAttackAnalysis params={params} />
              </Suspense>
            </ItemCard>
            <ItemCard title="协同处置分析" height="27vh">
              <Suspense fallback={<LoadingFallback />}>
                <MemoizedCoprocessing params={params} />
              </Suspense>
            </ItemCard>
            <ItemCard title="复盘溯源" height="31vh">
              <Suspense fallback={<LoadingFallback />}>
                <MemoizedReplay params={params} />
              </Suspense>
            </ItemCard>
          </div>
        </div>
      </div>

      <div className="center_table">
        <Suspense fallback={<LoadingFallback />}>
          <MemoizedRealTimeAttack params={params} />
        </Suspense>
      </div>

      <div className="center_title2">
        <CenterComp data={confluence} />
      </div>

      <div className="earth_index">
        <Suspense fallback={<LoadingFallback />}>
          <MemoizedEarthIndex list={confluenceList} type={type} />
        </Suspense>
      </div>

      <div className="select_radio">
        <SelectRadio onTypeSelect={onTypeSelect} />
      </div>

      <div className="fullscreen">
        <div
          className="fullscreen_icon"
          style={{ marginTop: isBig ? '3.5vh' : '3.2vh' }}
          onClick={handleFullscreenToggle}
        >
          {isBig ? (
            <FullscreenExitOutlined style={{ color: '#ffffff' }} />
          ) : (
            <FullscreenOutlined style={{ color: '#ffffff' }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
