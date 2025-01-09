import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTF, GLTFLoader, OrbitControls } from "three-stdlib";
import { Flex, Progress, Segmented } from "antd";
import "./GltfModelLoader.css";

interface GltfModelLoaderProps {
  modelPath: string; // 模型路径
}
const GltfModelLoader: React.FC<GltfModelLoaderProps> = ({ modelPath }) => {
  const [time, setTime] = useState<number>(0.0);
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    // 创建场景
    const scene = new THREE.Scene();
    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // 创建渲染器并设置背景颜色为白色
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(500, 300);
    renderer.setClearColor(0xffffff, 1); // 设置背景颜色为白色
    const root = document.getElementById("threeCavas");
    root!.appendChild(renderer.domElement);

    // 创建 OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true; // 确保启用缩放功能

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 3); // 白色环境光，强度为 3
    scene.add(ambientLight);
    const basePath = 'https://dataset-ycb.s3.us-west-004.backblazeb2.com/';
    // 使用 GLTFLoader 加载模型
    const loader = new GLTFLoader();
    let mixer: THREE.AnimationMixer; // 声明动画混合器

    loader.load(
      basePath + modelPath,
      (gltf: GLTF) => {
        // 计算模型的边界框
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        setModel(gltf.scene);
        // 调整相机位置
        camera.position.set(center.x, center.y, size.length() * 2); // 根据模型大小设置相机位置
        controls.target.copy(center); // 设置控制器的目标为模型中心
        controls.update(); // 更新控制器
        // 旋转模型 90 度（以弧度为单位）
        gltf.scene.rotation.x = -(Math.PI / 2);
        scene.add(gltf.scene);

        // 创建动画混合器并添加动画
        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip: any) => {
          mixer.clipAction(clip).play(); // 播放每个动画
        });
      },
      undefined,
      (error: ErrorEvent) => {
        console.error(error);
      }
    );

    // 动画循环
    const animate = function () {
      requestAnimationFrame(animate);
      controls.update(); // 更新控制器

      // 更新动画混合器
      if (mixer) {
        mixer.update(0.01); // 更新动画，参数为时间增量
      }
      renderer.render(scene, camera);
    };

    animate();
    // 清理函数
    return () => {
      root!.removeChild(renderer.domElement);
    };
  }, [modelPath]);

  // 定义旋转模型的函数
  const rotateModel = (index: number) => {
    console.log(model);
    
    if (model) {
      const position = model?.position;
      const currentRotation = model.rotation;
      // 如果 position 的某个分量为 0，则整体加值旋转
      if (position.x === 0 && position.y === 0 && position.z === 0) {
        const angle = index; // 假设 index 是旋转角度
        model.rotation.x += angle;
        model.rotation.y += angle;
        model.rotation.z += angle;
        model.updateMatrix();
      } else {
        // 否则，按当前旋转逻辑进行旋转
        const angle = currentRotation.x * index; // 这里假设使用 x 分量作为示例
        model.rotation.x = angle;
        model.updateMatrix();
      }
      model.updateMatrix();
    }
  };
  const setTimeUpdate = () => {
    const intervalId = setTimeout(() => {
      setTime((prevTime) => {
        if (prevTime == 4.0) {
          return 0.0;
        }
        clearTimeout(intervalId);
        // 保留小数点后一位
        return Number((prevTime + 0.1).toFixed(1));
      });
    }, 150);
  };
  setTimeUpdate();
  return (
    <>
      <div className="d-flex pd-tb-16">
        <div className="positionR mg-r-16">
          <div id="threeCavas"></div>
          <div className="d-flex ">
            <div className="positionA bottom-0 backgroundFFF operationBar d-flex gap alignItemC pd-12 ">
              <div className="d-flex alignItemC">
                <svg
                  className="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4034"
                  width="32"
                  height="32"
                >
                  <path
                    d="M320 864c-17.67 0-32-14.31-32-32V192c0-17.67 14.33-32 32-32s32 14.33 32 32v640c0 17.69-14.33 32-32 32zM704 864c-17.69 0-32-14.31-32-32V192c0-17.67 14.31-32 32-32s32 14.33 32 32v640c0 17.69-14.31 32-32 32z"
                    fill="#333333"
                    p-id="4035"
                  ></path>
                </svg>
              </div>
              <div className="border-1-ccc pd-4 fontSize12 width20 textCenter">
                {time}
              </div>
              <div className="width150">
                <Flex gap="small" vertical>
                  <Progress percent={(time / 4) * 100} showInfo={false} />
                </Flex>
              </div>
              <div className="pd-4 pd-r-16 border-r-ccc">
                <div className="border-1-ccc pd-4 fontSize12 width20 textCenter ">
                  1x
                </div>
              </div>
              <div className="mg-l-8">
                <Segmented<string>
                  options={["RGB", "Parts"]}
                  onChange={(value) => {
                    console.log(value); // string
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flexColumn justBetween mg-l-16">
          <div>
            <div
              className="mg-b-8 cursor"
              onClick={() => {
                rotateModel(0.5);
              }}
            >
              Uniform Sampler
            </div>
            <div
              className="mg-b-8 cursor"
              onClick={() => {
                rotateModel(0.8);
              }}
            >
              Stability Sampler
            </div>
            <div
              className="mg-b-8 cursor"
              onClick={() => {
                rotateModel(1.1);
              }}
            >
              Goal Sampler
            </div>
            <div
              className="mg-b-8 cursor"
              onClick={() => {
                rotateModel(1.3);
              }}
            >
              Reward Model
            </div>
          </div>
          <div>
            <span className="cursor">Download .USD</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default GltfModelLoader;
