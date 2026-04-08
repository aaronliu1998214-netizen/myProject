import './index.less'
import React, { } from 'react';



const ViewComp: React.FC<any> = () => {

    return (
        <section className='mainbox'>
            <div className="column">
                {/*left*/}
                <div className="panel bar">
                    <h2>柱形图-01</h2>
                    <div className="chart">图标</div>
                    <div className="panel-footer"></div>
                </div>
                <div className="panel line">
                    <h2>线形图-01</h2>
                    <div className="chart">线图</div>
                    <div className="panel-footer"></div>
                </div>
                <div className="panel pie">
                    <h2>饼形图-01</h2>
                    <div className="chart">饼图</div>
                    <div className="panel-footer"></div>
                </div>
            </div>
            <div className="column">
                {/*midd*/}
                <div className="no">
                    <div className="no-hd">
                        <ul>
                            <li>125811</li>
                            <li>104563</li>
                        </ul>
                    </div>
                    <div className="no-bd">
                        <ul>
                            <li>前端需求人数</li>
                            <li>市场供应人数</li>
                        </ul>
                    </div>
                </div>
                <div className="map">
                    <div className="chart"></div>
                    <div className="map1"></div>
                    <div className="map2"></div>
                    <div className="map3"></div>
                </div>
            </div>
            <div className="column">
                {/*right*/}
                <div className="panel bar">
                    <h2>柱形图-01</h2>
                    <div className="chart">图标</div>
                    <div className="panel-footer"></div>
                </div>
                <div className="panel line">
                    <h2>线形图-01</h2>
                    <div className="chart">线图</div>
                    <div className="panel-footer"></div>
                </div>
                <div className="panel pie">
                    <h2>饼形图-01</h2>
                    <div className="chart">饼图</div>
                    <div className="panel-footer"></div>
                </div>
            </div>
        </section>
    );
};

export default ViewComp;
