import { Col, Row, Divider, Statistic, message } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import Radar from './radar';
import Dash from './dash';
import up from '@/assets/screen/up.png';
import down from '@/assets/screen/down.png';
import { getIncidentReview } from '../../service';

interface IPprop {
    params?: number;
}

const Index: React.FC<IPprop> = ({ params }) => {
    const [data, setData] = useState<any>({})

    const queryIncidentReview = async (p: any) => {
        const res: any = await getIncidentReview(p)
        if (res) {
            setData(res)
        }
    }

    useEffect(() => {
        if (params) {
            queryIncidentReview(params)
        }
    }, [params])

    const list = [
        { name: '恶意组织数' },
        { name: '攻击IP数' },
        { name: '新式攻击方式' },
    ]

    const listquert = [
        { label: '一季度', color: '#3FA1FB' },
        { label: '二季度', color: '#FFBE4E' },
        { label: '三季度', color: '#1DC788' },
        { label: '四季度', color: '#D161C2' },
    ]

    const listUPorDown = [
        { label: '较上次', status: 1 },
        { label: '较上季度', status: 0 },
    ]

    return (
        <div className={styles.replay}>
            <div className={styles.rep_top}>
                <div className={styles.chartTitle}>
                    <div className={styles.title} style={{ width: '8vh' }}>溯源发现</div>
                </div>
                <Divider type="vertical" style={{ height: '4vh', backgroundColor: '#45ABE9', opacity: '0.3', margin: '0 2vh 0 2vh' }} />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    width: '100%'
                }}>
                    {
                        list?.map((item: any, index: number) => {
                            return <div key={index} className={styles.rep_item}>
                                <span style={{ fontSize: '1.25vh' }}>{item.name}</span>
                                <Statistic
                                    value={
                                        index === 0 ? data?.maliciousOrganizationsCount :
                                            index === 1 ? data.attackIpCount
                                                : data.newAttackWayCount
                                    }
                                    valueStyle={{
                                        backgroundImage: 'linear-gradient(to bottom, #1197EA, #AAD1FF)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontSize: '2.7vh',
                                        fontWeight: 550,
                                    }}
                                />
                            </div>
                        })
                    }
                </div>
            </div>
            <div className={styles.rep_bottom}>
                <div className={styles.btt}>
                    <div className={styles.chartTitle}>
                        <div className={styles.title}>应急演练得分</div>
                    </div>
                    <div className={styles.radar}>
                        <Dash count={data.highestScore} />
                    </div>
                    <div className={styles.list}>
                        <Row>
                            {
                                listUPorDown?.map((item: any, index: number) => {
                                    return <Col span={12} key={index}>
                                        <div className={styles.compare}>
                                            <div
                                                className={styles.compare_icon}
                                                style={{
                                                    backgroundImage: `url(${item.status === 0 ? down : up})`
                                                }}
                                            />
                                            <div>
                                                <span style={{ fontSize: '2vh' }}>
                                                    {
                                                        index === 0 ? data.changePercentageFromLastTime
                                                            : data.changePercentageFromLastQuarter
                                                    }
                                                    <span style={{ fontSize: '1.2vh' }}>%</span></span><br />
                                                <span style={{ opacity: 0.6 }}>{item.label}</span>
                                            </div>
                                        </div>
                                    </Col>
                                })
                            }
                        </Row>
                    </div>
                </div>
                <Divider type="vertical" style={{ height: '13vh', backgroundColor: '#45ABE9', marginTop: '5vh', opacity: 0.5 }} />
                <div className={styles.btt}>
                    <div className={styles.chartTitle}>
                        <div className={styles.title}>复盘防护能力</div>
                    </div>
                    <div className={styles.radar}>
                        <Radar />
                    </div>
                    <div className={styles.list} style={{ marginTop: '0.5vh' }}>
                        <Row>
                            {
                                listquert?.map((item: any, index: number) => {
                                    return <Col span={12} key={index}>
                                        <div className={styles.quert_item}>
                                            <div className={styles.point_} style={{ backgroundColor: item.color }} />
                                            <span style={{ opacity: 0.6 }}>
                                                {item.label}
                                                &nbsp; | &nbsp;
                                                {
                                                    index === 0 ? data?.firstQuarter
                                                        : index === 1 ? data?.secondQuarter
                                                            : index === 2 ? data?.thirdQuarter
                                                                : data?.fourthQuarter
                                                }
                                            </span>
                                        </div>
                                    </Col>
                                })
                            }
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
