import { useState } from "react";
import GltfModelLoader from "./components/GltfModelLoader"; // 导入新组件
import { getDate } from "./utils/getDate";
import { resourcePaths } from "./utils/route";
import w from "./assets/w.jpg";
import n from "./assets/n.jpg";
import RightAngle from "./assets/RightAngle.png";
import "./App.css";

function App() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // 用于跟踪选中的项
  const getDateUtils = () => {
    const date = getDate(new Date());
    return date;
  };

  // 获取 public 目录下的文件
  const modelFile = () => {
    return (
      <>
        <div className="width98 mg-0-A">
          {resourcePaths.map((path: string, index: number) => (
            <div key={index} onClick={() => setSelectedIndex(index)}>
              <div
                className={`pd-8 fontSize20 cursor ${
                  selectedIndex === index
                    ? "border-b-000 color000"
                    : "colorCCC border-b-ccc"
                }`}
              >
                <span>{index.toString().padStart(3, "0")}</span>
                <span className="mg-l-8">{path.replace(/^\//, "")}</span>
              </div>
              {selectedIndex === index && selectedIndex !== null && (
                <GltfModelLoader modelPath={resourcePaths[selectedIndex]} /> // 使用新组件
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="d-flex alignItemC justBetween">
        <div className="d-flex alignItemC pd-4">
          <div>
            <div>{getDateUtils() || ""}</div>
            <div> Seattle, WA</div>
            <div> DWK:AZ:OZ:RMS:BEB</div>
          </div>
          <div>
            <img className="w mg-l-8" src={w} alt="" />
            <img className="n mg-l-8" src={n} alt="" />
          </div>
        </div>
        <div>
          <div> VIEW ARCHIVE</div>
          <div className="textRight">
            <img className="width16 positionR top-5" src={RightAngle} alt="" />
            000
          </div>
        </div>
      </div>
      <div className="d-flex alignItemC justBetween background000 pd-8">
        <div className="colorFFF fontSize24"> YCB OBJECTS</div>
        <div></div>
      </div>
      {modelFile()}
    </div>
  );
}

export default App;
