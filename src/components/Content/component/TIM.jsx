import React, {Component, useState} from 'react';
import {Tabs, Badge, List, Skeleton, Space, Button, Input, message} from 'antd';
import TimInfo from './comment/TimInfo';
// import TimMessage from './comment/TimMessage';
import {getParam} from "../../../utils";
import flower from "../../../images/花(4).png";


const { TabPane } = Tabs;


class TimMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      code: getParam('code'),
      msg: '',
      websock: null
    }
  }

  _that = this;

  sendFlower = () => {
    this.state.websock.send('🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸')
  };

  //初始化weosocket
  initWebSocket(wsurl){ //初始化weosocket
    let ws = new WebSocket(wsurl);
    ws.onopen = this.websocketonopen;
    ws.onmessage = this.websocketonmessage;
    ws.onerror = this.websocketonerror;
    ws.onclose = this.websocketclose;
    this.setState({
      websock: ws
    }, () => {
    })
  }
  websocketonopen(){ //连接建立之后执行send方法发送数据
    console.log('咨询聊天打开');
  }
  websocketonerror(e){//连接建立失败重连
    console.log('重新连接websocket');
    // this.initWebSocket()
  }
  websocketonmessage = (e) => { //数据接收
    let res = JSON.parse(e.data);
    console.log(res);
    this.props.childrenSetCount(res.sendMethod);
    console.log(this.props);
    let result = [res];
    this.setState({
      data: this.state.data.concat(result)
    })
  }




  websocketsend = () => {//数据发送
    if (this.state.websock.readyState === WebSocket.OPEN) {
      if (this.state.msg === '') {
        message.error('请输入信息')
      } else {
        this.state.websock.send(this.state.msg)
        this.myInput.state.value = '';
        this.setState({
          msg: ''
        })
      }
    }
  }
  websocketclose(e){  //关闭
    console.log('断开连接',e);
  }
  componentDidMount() {
    if(this.state.websock === null) {
      if (typeof sessionStorage.getItem('id') === 'string') {
        let id = sessionStorage.getItem('id').toString();
        console.log('链接');
        this.initWebSocket(`ws://8.129.64.22:2829/webSocket/chat/${id}/${sessionStorage.getItem('userPhone')}`)
      }
    }
  }

  componentDidUpdate() {
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }

  render() {
    return (
        <div className="tim-wrap">
          <div className="tim-content" ref={chatContainer => this.chatContainer = chatContainer}>
            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={this.state.data}
                renderItem={item => (
                    <List.Item>
                      <Skeleton avatar title={false}
                                loading={item.loading} active>
                        <List.Item.Meta
                            title={
                              <Space size={20}>
                                <span style={{color: '#0096DA'}}>{item.username || ''}</span>
                                    <span style={{color: '#9A9A9A'}}>{item.phone || ''}</span>
                                <span style={{color: '#9A9A9A'}}>{item.sendTime}</span>
                              </Space>
                            }
                            description={<div
                                style={{color: '#343434'}}>{item.msg}</div>}
                        />
                      </Skeleton>
                    </List.Item>
                )}
            />
          </div>
          <div className="send-message">
            <Button
                icon={<img src={flower}
                           style={{width: 21, height: 21, marginRight: 2}}
                           alt=""/>}
                style={{
                  backgroundColor: '#F86E0D',
                  color: '#fff',
                  height: 40,
                }}
                onClick={this.sendFlower}
            >送花</Button>
            <Input type='text'
                   ref={myInput=> this.myInput=myInput}
                   onChange={(e) => this.setState({
                     msg: e.target.value
                   })}/>
            <Button type='primary'
                    style={{height: 40}}
                    onClick={this.websocketsend}
            >发送</Button>
          </div>
        </div>
    );
  }
}

export default () => {

  const [count, setCount] = useState(0);

  function callback(key) {
    setCount(0)
  }

  return (
    <div className='right-side'>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="聊天" key="1">
          <TimInfo />
        </TabPane>
        <TabPane tab={<div>
          <span style={{marginRight: 3}}>咨询</span>
          <Badge count={count} size={"small"} />
        </div>} key="2">
          <TimMessage childrenSetCount={setCount} />
        </TabPane>
      </Tabs>
    </div>
  );
}



