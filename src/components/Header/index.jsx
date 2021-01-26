import React, { useState } from 'react';
import { Image, Space } from 'antd';


import './header.less';

export default () => {

  const [info] = useState({
    name: '师大教育官网',
    tel: '020-12345678',
    qrCode: require('../../images/qrCode.jpg'),
    logo: require('../../images/logo.png')
  });

  return (
    <div className='header-container'>
      <div className="logo"><Image width={77} height={77} src={info.logo}/></div>
        <Space size={69} className='info'>
          <div>{info.name}</div>
          <div>联系电话：{info.tel}</div>
          <Image width={77} height={77} src={sessionStorage.getItem('qrCode') || info.qrCode}/>
        </Space>
    </div>
  );
}