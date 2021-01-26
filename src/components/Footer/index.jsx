import React, {useState} from 'react';
import {Button, Modal} from "antd";
export default (props) => {

    let data = {};
    if (sessionStorage.getItem('data')) {
        data = JSON.parse(sessionStorage.getItem('data'))
    }

  // 直播开始与否显示的幕布
  const [startState, setStartState] = useState(false);
  const [title] = useState('亲爱的同学，您暂时未预约课程，请联系老师进行约课！');


  return (
    <div className='footer-container'>
        {
           data.firstImage ? data.firstImage.map((item, index) => (
            <div className="content" key={index}>
              <div className="img" onClick={() => {
                setStartState(true)
              }}>
                <img src={item} alt=""/>
              </div>
              <div className='title'>{data.courseTitle}</div>
            </div>
          )) : <div></div>
        }

      <Modal
          title={title}
          visible={startState}
          maskClosable={false}
          style={{borderRadius: 10}}
          labelAlign='left'
          centered
          closable={false}
          footer={null}
          maskStyle={{
            backgroundColor: 'rgba(0,0,0,.45)'
          }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: "column"
        }}>
          <img
              src={sessionStorage.getItem('qrCode')}
              alt=""
              style={{
                width: 118,
                height: 116
              }}
          />
          <div style={{marginBottom: 20}}>
            <span style={{marginRight: 20}}>{sessionStorage.getItem('title')}</span>
            <span>{sessionStorage.getItem('phone')}</span>
          </div>
          <div style={{width: 300}}><Button type='primary'
                                            onClick={() => setStartState(false)}
                                            style={{width: '100%'}}>确认</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}