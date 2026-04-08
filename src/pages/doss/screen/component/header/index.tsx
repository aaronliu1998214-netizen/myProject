import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { DatePicker, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import styles from './index.less';
import moment from 'moment';
import type { RangePickerProps } from 'antd/es/date-picker';
// @ts-ignore
import { District_List } from "@/utils/common";
const { RangePicker } = DatePicker;

/**
* 获取最近 N 天的起止日期时间
* @param {number} days 最近天数（1、7、30…）
* @returns {[string, string]} [begin, end] 格式均为 YYYY-MM-DD HH:mm:ss
*/
const getRecentRange = (days: number) => {
  const pad = (n: any) => n.toString().padStart(2, '0');

  // 当前时间
  const now = new Date();
  const end = new Date();

  // 开始时间：days 天前的 00:00:00
  const begin = new Date(now);
  begin.setDate(now.getDate() - days + 1);
  begin.setHours(0, 0, 0, 0);

  // 结束时间：今天的 23:59:59
  end.setHours(23, 59, 59, 999);

  // 格式化为 'YYYY-MM-DD HH:mm:ss'
  const format = (d: any) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

  return [format(begin), format(end)];
}

interface IPprop {
   getParams: (val:any) => void;
   ifFullScreen: boolean;
}


const btn = [
  { label: '24小时', value: 1 },
  { label: '近7天', value: 7 },
  { label: '近30天', value: 30 },
];

const Header: React.FC<IPprop> = ({ getParams, ifFullScreen }) => {
  const defaultTime = getRecentRange(30)
  const [datePart, setDatePart] = useState('');
  const [timePart, setTimePart] = useState('');
  const location = useLocation();
  const [isBig, setIsBig] = useState<boolean>(
    location.pathname.includes('screen_big'),
  );
  const [activekey, setActivekey] = useState<number>(30);
  const [params, setParams] = useState<any>({   /* 默认近30天时间 */
    district: '', //全市"" 
    beginTime: defaultTime[0], // 开始时间
    endTime: defaultTime[1]  // 结束时间
  })
  const [rangeValue, setRangeValue] = useState<[moment.Moment, moment.Moment]>(() => {
    const [start, end] = defaultTime;
    return [moment(start), moment(end)];
  });


  useEffect(() => {
    getParams && getParams(params)
  }, [params])


  useEffect(() => {
    /* 时间显示 */
    const updateTime = () => {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      setDatePart(`${year}/${month}/${date}`);
      setTimePart(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);


  // 把 moment 数组转成字符串数组
  const formatToString = (moments: [moment.Moment, moment.Moment] | null) => {
    if (!moments || moments.some(m => !m)) return ['', ''];
    return [
      moments[0].format('YYYY-MM-DD HH:mm:ss'),
      moments[1].format('YYYY-MM-DD 23:59:59')
    ];
  };

  /* 时间范围 */
  const onChange: RangePickerProps['onChange'] = (moments, strings) => {
    const [startStr, endStr] = formatToString(moments as [moment.Moment, moment.Moment]);
    setParams({
      ...params,
      beginTime: startStr,
      endTime: endStr,
    });
    if (moments) {
      setRangeValue(moments as [moment.Moment, moment.Moment]);
    }
  };

  /* 区县选择 */
  const onSelect = (value: string) => {
    setParams({
      ...params,
      district: value
    })
  };

  return (
    <div className={styles.header_main}>
      {/*  */}
      <div className={`${styles.flex} ${styles.header_left}`}>
        <div style={{ fontSize: '1.5vh', marginLeft: '4vh' }}>{datePart}</div>
        <div className={styles.timepart}>{timePart}</div>
        <div className={styles.selected}>
          <span>所属区县 | </span>
          <Select
            showSearch
            allowClear={false}
            defaultValue={''}
            variant="borderless"
            placeholder="请选择"
            optionFilterProp="label"
            onSelect={onSelect}
            options={District_List?.map((i:any)=>({ label: i.label, value: i.label === '全市' ? '' : i.label }))}
            style={{ maxWidth: '12vh', minWidth: '10vh' }}
            className="custom_select"
            popupClassName="popupClassName_select"
            popupMatchSelectWidth={false}
          />
        </div>
      </div>
      {/*  */}
      <div className={styles.title}>&nbsp;</div>
      {/* 24h,7days, 30days */}
      <div className={`${styles.flex} ${styles.header_right}`}>
        <div className={styles.radio}>
          {btn?.map((item: any) => {
            return (
              <div
                className={`${styles.btn} ${activekey === item.value ? styles.active : ''}`}
                key={item.label}
                onClick={() => {
                  setActivekey(item.value);
                  const [startStr, endStr] = getRecentRange(item.value);
                  setParams({
                    ...params,
                    beginTime: startStr,
                    endTime: endStr,
                  });
                  setRangeValue([moment(startStr), moment(endStr)]);
                }}
              >
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
        <div className={styles.selected}>
          <RangePicker
            onChange={onChange}
            // @ts-ignore
            value={rangeValue}
            allowClear={false}
            className="custom_picker"
            popupClassName="popupClassName_picker"
            popupStyle={{
              // backgroundColor: '#ffffff1a',
            }}
            style={{ width: ifFullScreen ? '13vw' : '' }}
            variant="borderless"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
