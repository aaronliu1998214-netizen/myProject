import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// @ts-ignore
import * as TWEEN from "tween";
import { message } from "antd";
import "./index.less";
import mapImg from "@/assets/images/map.jpg"; // 地球模型贴图，根据实际情况替换或让UI提供180尺寸贴图
import mapWl from "@/assets/images/wl.png";

const R = 70;
const fovDefault = 100;

interface Item {
  lon: number;
  lat: number;
  name: string;
  color: string;
}

/* 
   three.js 自定封装地球可视化模型，
*/

const Earth: React.FC = () => {
  const layerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [rotationText, setRotationText] = useState("关闭旋转");

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const groupRef = useRef<THREE.Group>(new THREE.Group());
  const meshRef = useRef<THREE.Mesh | null>(null);
  const flyLinesRef = useRef<THREE.Group>(new THREE.Group());

  const animationType = useRef(true);   // 入场动画
  const rotationY = useRef(true);       // 自动旋转
  const meshAnimType = useRef(false);   // 标记点动画
  const lonlat = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 200));

  // lon经度 lat纬度
  const objList: Item[] = [
    { lon: 116.358976, lat: 39.803282, name: "中国", color: "#1FFBC6" },
    { lon: 139.812263, lat: 35.677294, name: "日本", color: "#A41FE8" },
    { lon: 77.198596, lat: 28.575136, name: "印度", color: "#E8BB1F" },
    { lon: -77.02238, lat: 38.900042, name: "美国", color: "#E81F56" },
    { lon: 31.266092, lat: 30.085626, name: "埃及", color: "#1FFBC6" },
    { lon: 103.813654, lat: 1.291125, name: "新加坡", color: "#E8BB1F" },
    { lon: -47.930912, lat: -15.781949, name: "巴西", color: "#A41FE8" },
    { lon: 149.130214, lat: -35.318235, name: "澳大利亚", color: "#E81F56" },
    { lon: 2.35225, lat: 48.8566, name: "法国", color: "#2f16e8ff" },
    { lon: 105.8542, lat: 21.0278, name: "越南", color: "#90eb07ff" },
  ];

  const objList2: Item[] = objList.map((v) => ({ ...v, name: v.name }));

  /* 经纬度 -> 三维坐标 */
  const lon2xyz = (radius: number, lon: number, lat: number) => {
    const lo = (lon + 90) * (Math.PI / 180);
    const la = lat * (Math.PI / 180);
    return new THREE.Vector3(
      radius * Math.cos(la) * Math.sin(lo),
      radius * Math.sin(la),
      radius * Math.cos(lo) * Math.cos(la)
    );
  };

  /* 初始化 Three 环境 */
  const initThree = () => {
    if (!containerRef.current) return;
    const dom = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      fovDefault,
      dom.clientWidth / dom.clientHeight,
      1,
      1000
    );
    camera.position.copy(lonlat.current);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    renderer.setClearColor(0x000000, 0);
    dom.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 2;
    controls.enablePan = true;

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;
  };

  /* 地球球体 */
  const initBall = () => {
    const loader = new THREE.TextureLoader();
    loader.load(mapImg, (texture) => {
      const geo = new THREE.SphereGeometry(R, 100, 100);
      const mat = new THREE.MeshBasicMaterial({ map: texture });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = "ballMain";
      sceneRef.current!.add(mesh);
      meshRef.current = mesh;
    });
  };

  /* 添加标记点 */
  const addMark = (item: Item) => {
    const geo = new THREE.PlaneGeometry(1, 1);
    const tex = new THREE.TextureLoader().load(mapWl);
    const mat = new THREE.MeshBasicMaterial({
      color: item.color,
      map: tex,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.set(2, 2, 2);
    mesh.name = item.name;
    mesh.userData.privateType = "mark";
    const pos = lon2xyz(R * 1.01, item.lon, item.lat);
    mesh.position.copy(pos);
    const normal = pos.clone().normalize();
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    groupRef.current.add(mesh);
    sceneRef.current!.add(groupRef.current);
    meshAnimType.current = true;
  };

  /* 创建飞线 */
  const createFlyLine = (start: THREE.Vector3, end: THREE.Vector3, color: string) => {
    // 创建曲线路径
    const curve = new THREE.QuadraticBezierCurve3(
      start,
      new THREE.Vector3().lerpVectors(start, end, 0.5).normalize().multiplyScalar(R * 1.5),
      end
    );

    // 创建几何体
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // 创建材质
    const material = new THREE.LineBasicMaterial({ 
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8
    });

    // 创建线
    const line = new THREE.Line(geometry, material);
    line.userData.privateType = "flyLine";
    flyLinesRef.current.add(line);

    // 创建动画点
    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
    const dotMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 4,
      transparent: true
    });
    const dot = new THREE.Points(dotGeometry, dotMaterial);
    dot.userData = {
      privateType: "flyDot",
      progress: 0,
      speed: 0.005 + Math.random() * 0.005
    };
    flyLinesRef.current.add(dot);

    sceneRef.current!.add(flyLinesRef.current);
  };

  /* 飞线动画 */
  const flyLineAnimate = () => {
    flyLinesRef.current.children.forEach((child: any) => {
      if (child.userData.privateType === "flyDot") {
        child.userData.progress += child.userData.speed;
        if (child.userData.progress > 1) child.userData.progress = 0;
        
        const curve = child.parent.children.find((c: any) => 
          c.userData.privateType === "flyLine" && 
          c.geometry.attributes.position.array === child.geometry.attributes.position.array
        );
        
        if (curve) {
          const points = curve.geometry.attributes.position.array;
          const index = Math.floor(child.userData.progress * (points.length / 3 - 1)) * 3;
          child.position.set(
            points[index],
            points[index + 1],
            points[index + 2]
          );
        }
      }
    });
  };

  /* 添加所有飞线 */
  const addAllFlyLines = () => {
    const china = objList.find(v => v.name === "中国");
    if (!china) return;
    
    const chinaPos = lon2xyz(R * 1.01, china.lon, china.lat);
    
    objList.forEach(item => {
      if (item.name !== "中国") {
        const endPos = lon2xyz(R * 1.01, item.lon, item.lat);
        createFlyLine(chinaPos, endPos, item.color);
      }
    });
  };

  /* 删除所有飞线 */
  const removeAllFlyLines = () => {
    flyLinesRef.current.traverse((child: any) => {
      if (child.isLine || child.isPoints) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
    flyLinesRef.current.clear();
    sceneRef.current!.remove(flyLinesRef.current);
  };

  /* 标记点动画 */
  const meshAnimate = () => {
    groupRef.current.children.forEach((child: any) => {
      if (child.userData.privateType === "mark") {
        child.material.opacity += Math.random() * 0.05;
        child.scale.set(
          child.material.opacity + 7,
          child.material.opacity + 7,
          child.material.opacity + 7
        );
        if (child.scale.x >= 9) child.material.opacity = 0;
      }
    });
  };

  /* 入场动画 */
  const ballAnimation = () => {
    let fov = cameraRef.current!.fov;
    fov -= 0.6;
    if (fov <= 45) {
      animationType.current = false;
      cameraRef.current!.position.set(0, 0, 200);
      cameraRef.current!.lookAt(0, 0, 0);
    } else {
      cameraRef.current!.fov = fov;
      cameraRef.current!.updateProjectionMatrix();
    }
  };

  /* 渲染循环 */
  const renderLoop = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.clear();

    if (animationType.current) ballAnimation();
    if (rotationY.current) sceneRef.current.rotation.y += 0.001;
    if (meshAnimType.current) meshAnimate();
    flyLineAnimate();

    controlsRef.current!.update();
    TWEEN.update();
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    requestAnimationFrame(renderLoop);
  };

  /* 显示提示框 */
/* 显示提示框 */
const showDiv = (pos: THREE.Vector3) => {
  if (!layerRef.current || !cameraRef.current || !containerRef.current) return;
  
  // 将3D坐标投影到2D屏幕坐标
  const vec = pos.clone().project(cameraRef.current);
  
  // 获取容器尺寸
  const halfWidth = containerRef.current.offsetWidth / 2;
  const halfHeight = containerRef.current.offsetHeight / 2;
  
  // 计算提示框位置
  const left = Math.round(vec.x * halfWidth + halfWidth - 90); // 提示框宽度的一半
  const top = Math.round(-vec.y * halfHeight + halfHeight - 100); //提示框高度的一半
  
  // 设置提示框样式
  layerRef.current.style.display = "block";
  layerRef.current.style.left = `${left}px`;
  layerRef.current.style.top = `${top}px`;
};

  const hideDiv = () => {
    if (layerRef.current) layerRef.current.style.display = "none";
  };


const cameraPos = (item: Item) => {
    hideDiv();
    // 1. 获取对应国家的标记点对象
    if (!sceneRef.current || !cameraRef.current) return;
    const obj = groupRef.current.getObjectByName(item.name);
    // 如果找不到对象，显示错误信息并返回
    if (!obj) return message.error("图层数据已被删除，请刷新或重新初始化");
    
    // 2. 关闭地球的自动旋转
    rotationY.current = false;
    sceneRef.current.rotation.y = 0;

    // 3. 计算相机最终位置：将标记点位置乘以2.8倍作为相机目标位置
    const endPos = obj.position.clone().multiplyScalar(2.8);
    console.log("endPos",endPos);
    
    
    // 4. 使用TWEEN创建动画补间
    new TWEEN.Tween(lonlat.current)
      // 设置动画目标值和持续时间(1500ms)
      .to({ x: endPos.x, y: endPos.y, z: endPos.z }, 1500)
      // 动画更新时的回调：更新相机位置并使其始终看向场景中心
      .onUpdate(() => {
        cameraRef.current!.position.copy(lonlat.current);
        cameraRef.current!.lookAt(0, 0, 0);
      })
      // 动画完成时的回调：显示国家名称提示框
      .onComplete(() => {
        showDiv(obj.position)
      })
      // 设置缓动函数为Sinusoidal.InOut，使动画有平滑的加速减速效果
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      // 启动动画
      .start();
      // 更新当前位置
      lonlat.current.copy(cameraRef.current.position);
    // 5. 更新当前选中的国家名称状态
    setCountryName(item.name);
};

  /* 点击事件 */
  const onMouseClick = (e: MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const dom = containerRef.current;
    const rect = dom.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / dom.offsetWidth) * 2 - 1;
    const y = -((e.clientY - rect.top) / dom.offsetHeight) * 2 + 1;
    console.log("click:",x, y);
    
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    const list = ray.intersectObjects(sceneRef.current.children, true);
    for (let i = 0; i < list.length; i++) {
      const name = list[i].object.name;
      if (name && name !== "ballMain") {
        cameraPos(objList.find((v) => v.name === name)!);
        return;
      }
    }
    rotationY.current = true;
    setRotationText("关闭旋转");
    hideDiv();
  };

  /* 旋转开关 */
  const rotationChange = () => {
    rotationY.current = !rotationY.current;
    setRotationText(rotationY.current ? "关闭旋转" : "开启旋转");
    hideDiv();
  };

  /* 添加光柱 */
  const addColumn = (item: Item) => {
    const mat = new THREE.MeshBasicMaterial({
      color: item.color,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const geo = new THREE.CylinderGeometry(0.2, 2.8, 30);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = item.name;
    mesh.userData.privateType = "column";
    const pos = lon2xyz(R * 1.01, item.lon, item.lat);
    mesh.position.copy(pos);
    const normal = pos.clone().normalize();
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    groupRef.current.add(mesh);
    sceneRef.current!.add(groupRef.current);
  };
  const columnChange = () => objList2.forEach(addColumn);

  /* 删除所有 */
  const delAllChange = () => {
    groupRef.current.traverse((child: any) => {
      if (child.isMesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
    sceneRef.current!.remove(groupRef.current);
    groupRef.current.clear();
    removeAllFlyLines();
    hideDiv();
  };

  /* 删除美国标记点 */
  const delMarkChange = () => {
    const us = groupRef.current.getObjectByName("美国");
    if (us) groupRef.current.remove(us);
  };

  /* 重置 / 初始化 */
  const init = () => {
    if (containerRef.current) containerRef.current.innerHTML = "";
    animationType.current = true;
    rotationY.current = true;
    meshAnimType.current = false;
    lonlat.current.set(0, 0, 200);
    groupRef.current = new THREE.Group();
    flyLinesRef.current = new THREE.Group();
    initThree();
    initBall();
    objList.forEach(addMark);
    renderLoop();
    const dom = rendererRef.current!.domElement;
    dom.addEventListener("click", onMouseClick);
    return () => dom.removeEventListener("click", onMouseClick);
  };

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, []);

  return (
    <div className="earth">
      <div className="rightMain">
        <div className="title">跳转操作</div>
        <div className="cont">
          <ul>
            {objList.map((v) => (
              <li key={v.name} onClick={() => cameraPos(v)}>
                {v.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="title">其他操作</div>
        <div className="cont">
          <ul>
            <li onClick={rotationChange}>{rotationText}</li>
            <li onClick={columnChange}>添加光柱</li>
            <li onClick={addAllFlyLines}>添加飞线</li>
            <li onClick={removeAllFlyLines}>删除飞线</li>
            <li onClick={delAllChange}>删除所有</li>
            <li onClick={delMarkChange}>删除美国标记</li>
          </ul>
        </div>

        <div className="title">重置操作</div>
        <div className="cont">
          <ul>
            <li onClick={init}>初始化数据</li>
          </ul>
        </div>
      </div>

      <div className="mapBox" ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <div id="layerMain" ref={layerRef} style={{ display: 'none' }}>
        <div>{countryName}</div>
        <div className="shape"></div>
      </div>
    </div>
  );
};

export default Earth;