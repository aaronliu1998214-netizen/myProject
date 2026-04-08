import Safety from '@/pages/screen/safety';
import ProDispatching from '@/pages/screen/proDispatching';
import VideoMonitor from '@/pages/screen/videoMonitor';
import Emergency from '@/pages/screen/emergency';
import btn1 from '@/assets/screen/btn1.png';
import btn2 from '@/assets/screen/btn2.png';
import btn3 from '@/assets/screen/btn3.png';
import btn4 from '@/assets/screen/btn4.png';


export const btn = [
    { 
        label: '安全管理', 
        key: 1 , 
        icon: btn1,
        title: '安全管理调控中心',
        comp: <Safety />
    },
    {   
        label: '应急处理', 
        key: 2 , 
        icon: btn2,
        title: '应急处置调度中心',
        comp: <Emergency />
    },
    { 
        label: '视频管理', 
        key: 3 , 
        icon: btn3,
        title: '视频管理中心',
        comp: <VideoMonitor />
    },
    {  
        label: '生产调度', 
        key: 4 , 
        icon: btn4,
        title: '生产经营调度中心',
        comp: <ProDispatching />
    },
  ];