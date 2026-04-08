import React, { useState, useEffect, useRef } from 'react';
import './index.less';
import { Card, Col, Row } from 'antd';
/* 
* 计时器功能
* 1. 创建一个计时器，按钮：开始， 结束，重置 功能
* 2. 可以自定义时间间隔
*/
const App: React.FC = () => {

    const SetTimeoutDemo = () => {
        const [state, setState] = useState<boolean>(false)
        const [count, setCount] = useState<number>(0)
        const [interval, setInterval] = useState<number>(300)
        const [time, setTime] = useState<number>(0)


        const onSatrt = () => {
            setState(true)
            setTime(time + 1)
        }
        const onEnd = () => {
            setState(false)
        }
        const onReset = () => {
            setState(false)
            setCount(0)
            setTime(0)
        }

        useEffect(() => {
            if (state) {
                setTimeout(() => {
                    setCount(count + 1)
                }, interval)
            }
        }, [state, count])


        return (
            <div>
                <h3>计时器功能</h3>
                <div>计时状态： <span style={{ color: 'red' }}>{state ? '开始' : '结束'}</span></div>
                <div>已计时： <span>{time}</span>次</div>
                <h3>计时： <span>{count}</span></h3>
                <div style={{ display: 'flex' }}>
                    <button className='btn' type='button' onClick={onSatrt}>开始</button>
                    <button className='btn' type='button' onClick={onEnd}>结束</button>
                    <button className='btn' type='button' onClick={onReset}>重置</button>
                </div>
            </div>
        );
    }

    const SetIntervalDemo = () => {
        const [state, setState] = useState<boolean>(false)
        const [count, setCount] = useState<number>(0);
        const [intervalTime, setIntervalTime] = useState<number>(1000); // 默认间隔 1000ms
        const [timer, setTimer] = useState<any>(null)

        // 开始计时
        const onStart = () => {
           if(timer) return;
           setState(true)
           setTimer(()=> setInterval(()=>{
            setCount(v => v + 1)
           },intervalTime))
        };

        // 结束计时
        const onEnd = () => {
          if(timer){
            clearInterval(timer)
            setTimer(null)
          }
            setState(false)
        };

        // 重置计时
        const onReset = () => {
            onEnd()
            setCount(0)
            setIntervalTime(1000)
        };


        return (
            <div>
                <h3>计时器功能</h3>
                <div>计时状态： <span style={{ color: 'red' }}>{state ? '开始' : '结束'}</span></div>
                <h3>计时： <span>{count}</span></h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input type='number' value={intervalTime} onChange={(e)=>{ setIntervalTime(Number(e.target.value)) }}/>
                    <button type='button' className='btn' onClick={onStart}>开始</button>
                    <button type='button' className='btn' onClick={onEnd}>结束</button>
                    <button type='button' className='btn' onClick={onReset}>重置</button>
                </div>
            </div>
        );
    };




    return (
        <div>
            <span>
                * 计时器功能
                * 1. 创建一个计时器，按钮：开始， 结束，重置 功能
                * 2. 可以自定义时间间隔
            </span>
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Card title='setTimeout 版本'>
                        <SetTimeoutDemo />

                    </Card>
                </Col>
                <Col span={12}>
                    <Card title='setInterval 版本'>
                        <SetIntervalDemo />
                    </Card>
                </Col>
            </Row>
        </div>
    );

};

export default App;
