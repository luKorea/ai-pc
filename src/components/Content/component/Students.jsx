import React, {useEffect, useState} from 'react';
import { Avatar, List, Skeleton, Space } from 'antd';
import {getMember} from "../../../request/api/home";

export default (props) => {

  console.log('props', props);

  const [data, setData] = useState([])


  useEffect(() => {
    getMember()
        .then(res => {
          if (res.data.code === 200) {
            setData(res.data.data)
          }
        }).catch(err => console.log(err))
  }, [])


  return (
    <div className='left-side'>
      <div className="left-title">在线学生</div>
      <div className="left-content">
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Skeleton avatar title={false}
                        loading={item.loading} active>
                <List.Item.Meta
                  // avatar={
                  //   <Avatar className='pointer'
                  //           shape="circle"
                  //           size={41}
                  //           src={item.img}/>
                  // }
                  title={
                    <Space size={30}>
                      <span className='list-item-title'>{item.name}</span>
                      <span>{item.phone}</span>
                    </Space>
                  }
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
      <div className="left-footer">我要购买课程</div>
    </div>
  );
}