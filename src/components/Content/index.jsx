import React from 'react';

import './content.less';
import Students from './component/Students';
import MyVideo from './component/Video';
import TIM from './component/TIM';
export default  props => {

    return (
    <div className='content-container'>
      <div className="content-wrap">
        {/* 在线学生区域 */}
        <Students/>
        {/* 视频播放区域 */}
        <MyVideo/>
        {/* 互动直播区域 */}
        <TIM />
      </div>
    </div>
  );
}