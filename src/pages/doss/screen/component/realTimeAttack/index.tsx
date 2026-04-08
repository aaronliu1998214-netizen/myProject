import React, { useRef, useEffect, useState } from 'react';
import styles from './index.less';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import './table.less'
import { getDdosAttackList } from '../../service';

type IPprops = { params?: any };


interface DataType {
    beginTime: string;
}

const Index: React.FC<IPprops> = ({ params }) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [show, setShow] = useState<boolean>(false)
    const [dataSource, setDataSource] = useState<any[]>([])
    const [total, setTotal] = useState<number>(0)
    const [pagination, setPagination] = useState<any>({
        current: 1,
        pageSize: 20,
        total: 0,
    });
    const [loading, setLoading] = useState<boolean>(false)
    const queryPage = async (p: any) => {
        setLoading(true)
        const res: any = await getDdosAttackList(p)
        if (res) {
            setDataSource(res?.records)
            setTotal(res.total)
            setPagination({
                ...pagination,
                total: res.total,
                current: res.current,
                pageSize: res.size
            })
            setLoading(false)
        }
    }

    useEffect(() => {
        if (params) {
            if (show) {
                queryPage({ query:{ ...params }, pageNo: 1, pageSize: 20 })
            } else {
                queryPage({ query:{ ...params }, pageNo: 1, pageSize: 9999 })
            }
        }
    }, [show, params]);

    useEffect(() => {
        if (!show && dataSource?.length > 0) {
            const interval = 50; // 每次滚动间隔
            const step = 1; // 每次滚动距离（px）

            const scrollContainer = () =>
                scrollRef.current?.querySelector('.ant-table-body') as HTMLDivElement;

            const timer = setInterval(() => {
                const body = scrollContainer();
                if (body) {
                    // 当前是否到底
                    if (body.scrollTop + body.clientHeight >= body.scrollHeight) {
                        body.scrollTop = 0; // 回到顶部
                    } else {
                        body.scrollTop += step; // 继续向下滚动
                    }
                }
            }, interval);

            return () => clearInterval(timer);
        }
    }, [show, dataSource]);

    const handleTableChange = (page: number, pageSize: number) => {
        setPagination({
            current: page,
            pageSize: pageSize,
        });
        queryPage({ ...params, pageNo: page, pageSize });
    };

    const columns: TableProps<DataType>['columns'] = [
        {
            title: '开始攻击时间',
            dataIndex: 'startTime',
            ellipsis: true,
            width: '14%',
            render(value, record, index) {
                return <span style={{ fontSize: '1.3vh' }}>{value || '-'}</span>
            },
        },
        {
            title: '事件等级',
            dataIndex: 'eventLevel',
            width: '7%',
            ellipsis: true,
            render: (text) => {
                const levelMap = {
                    '高风险': { label: '高风险', color: 'red' },
                    '中风险': { label: '中风险', color: '#F5A445' },
                    '低风险': { label: '低风险', color: '#00C18E' },
                }
                // @ts-ignore
                return <span style={{ color: levelMap[text]?.color, fontSize: '1.3vh' }}>{levelMap[text]?.label || '-'}</span>
            }
        },
        {
            title: '处理状态',
            dataIndex: 'state',
            ellipsis: true,
            render: (text) => {
                const colorMap: Record<string, string> = {
                    '处置中': 'rgba(255,0,0,0.5)',
                    '已处置': 'rgba(255,165,0,0.5)',
                    '待处置': 'green'
                }
                return <>
                    <Tag color={colorMap[text]} key={text}>
                        {text}
                    </Tag>
                </>
            },
        },
        {
            title: '被攻击资产',
            dataIndex: 'attackedAsset',
            ellipsis: true,
            width: '15%',
            render(value, record, index) {
                return <span style={{ fontSize: '1.3vh' }}>{value || '-'}</span>
            },
        },
        {
            title: '所属区县',
            dataIndex: 'region',
            ellipsis: true,
            width: '10%',
            render(value, record, index) {
                return <span style={{ fontSize: '1.3vh' }}>{value || '-'}</span>
            },
        },
        {
            title: '带宽(Gbps)',
            dataIndex: 'bandwidthPeak',
            ellipsis: true,
            render(value, record, index) {
                return <span style={{ fontSize: '1.3vh' }}>{value || '-'}</span>
            },
        },
        {
            title: '攻击类型',
            dataIndex: 'attackType',
            ellipsis: true,
            render(value, record, index) {
                return <span style={{ fontSize: '1.3vh' }}>{value || '-'}</span>
            },
        },
        {
            title: '流量所属运营商',
            dataIndex: 'isp',
            ellipsis: true,
            render(value, record, index) {
                return <span style={{ fontSize: '1.3vh' }}>{value || '-'}</span>
            },
        },
        {
            title: '攻击IP所属地',
            dataIndex: 'attackSource',
            ellipsis: true,
            render(value, record, index) {
                return <span style={{ fontSize: '1.3vh' }}>{value || '-'}</span>
            },
        },
        {
            title: '处置时长',
            dataIndex: 'dealTime',
            ellipsis: true,
            render(value, record, index) {
                return <span style={{ fontSize: '1.3vh' }}>{value || '-'}</span>
            },
        },
    ];



    return (
        <div className={styles.realTimeAttack} style={{ height: show ? '50vh' : '20vh' }}>
            <div className={styles.real_title}>
                <div>实时DDOS攻击情况</div>
                <div className={styles.more}>
                    {!show && <span>共 {total} 条</span>}
                    <span
                        className={styles.btn}
                        onClick={() => {
                            if (show) {
                                setPagination({
                                    ...pagination,
                                    pageSize: 20,
                                })
                            }
                            setShow(!show)
                        }}
                    >
                        {show ? '关闭' : '查看全部'}
                    </span>
                </div>
            </div>
            <div ref={scrollRef} style={{ width: '100%' }}>
                <Table<DataType>
                    bordered={false}
                    columns={columns}
                    // loading={loading}
                    dataSource={dataSource}
                    size="small"
                    className='screen_table'
                    scroll={{ y: show ? '34vh' : '13vh' }}
                    // @ts-ignore
                    pagination={!show ? false :
                        {
                            ...pagination,
                            size: "small",
                            showQuickJumper: false,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50", "100"],
                            onChange: handleTableChange,
                            style: { padding: "12px 16px" },
                        }}
                />


            </div>
        </div>
    );
};

export default Index;
