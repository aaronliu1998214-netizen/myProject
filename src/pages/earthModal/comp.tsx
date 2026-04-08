import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// @ts-ignore
import * as TWEEN from "tween";
import mapImg from "@/assets/images/map.jpg";
import mapWl from "@/assets/images/wl.png";
import { message } from "antd";

const R = 70;
const fovDefault = 100;

interface Item {
  lon: number;
  lat: number;
  name: string;
  color: string;
}

export default function useEarth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [rotationText, setRotationText] = useState("关闭旋转");

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const groupRef = useRef<THREE.Group>(new THREE.Group());
  const meshRef = useRef<THREE.Mesh | null>(null);

  const animationType = useRef(true);   // 入场动画
  const rotationY = useRef(true);       // 自动旋转
  const meshAnimType = useRef(false);   // 标记点动画
  const lonlat = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 200));

  const objList: Item[] = [
    { lon: 116.358976, lat: 39.803282, name: "中国", color: "#1FFBC6" },
    { lon: 139.812263, lat: 35.677294, name: "日本", color: "#A41FE8" },
    { lon: 77.198596, lat: 28.575136, name: "印度", color: "#E8BB1F" },
    { lon: -77.02238, lat: 38.900042, name: "美国", color: "#E81F56" },
    { lon: 31.266092, lat: 30.085626, name: "埃及", color: "#1FFBC6" },
    { lon: 103.813654, lat: 1.291125, name: "新加坡", color: "#E8BB1F" },
    { lon: -47.930912, lat: -15.781949, name: "巴西", color: "#A41FE8" },
    { lon: 149.130214, lat: -35.318235, name: "澳大利亚", color: "#E81F56" },
  ];

  const objList2: Item[] = objList.map((v) => ({ ...v, name: v.name + "column" }));

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

    controlsRef.current!.update();
    TWEEN.update();
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    requestAnimationFrame(renderLoop);
  };

    /* 显示提示框 */
  const showDiv = (pos: THREE.Vector3) => {
    if (!cameraRef.current || !containerRef.current) return;
    const vec = pos.clone().project(cameraRef.current);
    const dom = containerRef.current;
    const w = dom.offsetWidth;
    const h = dom.offsetHeight;
    const left = Math.round((vec.x * 0.5 + 0.5) * w - 150);
    const top = Math.round((-vec.y * 0.5 + 0.5) * h - 180);
    const layer = document.getElementById("layerMain")!;
    layer.style.display = "block";
    layer.style.left = left + "px";
    layer.style.top = top + "px";
  };

  /* 相机飞入 */
  const cameraPos = (item: Item) => {
    const obj = groupRef.current.getObjectByName(item.name);
    if (!obj) return message.error("图层数据已被删除，请刷新或重新初始化");
    rotationY.current = false;

    const endPos = obj.position.clone().multiplyScalar(2.8);
    new TWEEN.Tween(lonlat.current)
      .to({ x: endPos.x, y: endPos.y, z: endPos.z }, 1500)
      .onUpdate(() => {
        cameraRef.current!.position.copy(lonlat.current);
        cameraRef.current!.lookAt(0, 0, 0);
      })
      .onComplete(() => {
        showDiv(obj.position)
      })
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();
    setCountryName(item.name);
  };


  const hideDiv = () => {
    const layer = document.getElementById("layerMain");
    if (layer) layer.style.display = "none";
  };

  /* 点击事件 */
  const onMouseClick = (e: MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const dom = containerRef.current;
    const rect = dom.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / dom.offsetWidth) * 2 - 1;
    const y = -((e.clientY - rect.top) / dom.offsetHeight) * 2 + 1;
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

  return {
    containerRef,
    countryName,
    rotationText,
    cameraPos,
    rotationChange,
    columnChange,
    delAllChange,
    delMarkChange,
    reset: init,
  };
}