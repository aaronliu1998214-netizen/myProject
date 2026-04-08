import React, { } from 'react';
import { Card } from 'antd';
import FlowCompMore from './components/flowCompMore'
import FlowCompOne from './components/flowCompOne'

const Index: React.FC = () => {


    return (
        <div
        style={{
            height: '100vh', 
            overflowY: 'auto',
            boxSizing: 'border-box'
        }}>
            <Card title="单个流程流转">
                <FlowCompOne />
            </Card>
            <div style={{ height: '10px' }}></div>
            <Card title="多个流程流转" style={{ width: '50%'}}>
                <FlowCompMore />
            </Card>
        </div>
    );
};

export default Index;
