import React, {Component} from 'react';
import {Button, Input, List, Skeleton, Space} from 'antd';
import flower from '../../../../images/花(4).png';
import {getParam} from "../../../../utils";



class TimMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            code: getParam('code'),
            message: '',
            websock: null
        }
    }

     _that = this;

    sendFlower = () => {
        const user = [{
            id: 0,
            name: '韩国',
            time: new Date().toLocaleTimeString(),
            message: '🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸',
            phone: "138*******0000",
        }];
        let newData = [...this.state.data, ...user]
        this.setState({
            data: newData
        })
    };

    //初始化weosocket
    initWebSocket(wsuri){ //初始化weosocket
        let ws = new WebSocket(wsuri);
        ws.onmessage = this.websocketonmessage;
        ws.onopen = this.websocketonopen;
        ws.onerror = this.websocketonerror;
        ws.onclose = this.websocketclose;
        this.setState({
            websock: ws
        }, () => {
            console.log(this.state.websock);
        })
    }
    websocketonopen(){ //连接建立之后执行send方法发送数据
        console.log(1);
        // let actions = {"test":"12345"};
        // this.websocketsend(JSON.stringify(actions));
    }
    websocketonerror(e){//连接建立失败重连
        console.log(e);
        // this.initWebSocket(`ws://192.168.1.5:2829//chat/${this.state.code}/${localStorage.getItem('userPhone')}`);
    }
    websocketonmessage = (e) => { //数据接收
        let res = JSON.parse(e.data);
        res.time = new Date(res.time).toLocaleTimeString()
        let result = [res];
        this.setState({
            data: this.state.data.concat(result)
        })
    }
    websocketsend = () => {//数据发送
        this.state.websock.send(JSON.stringify({
            message: this.state.message,
            time: new Date().toLocaleTimeString()
        }))
        this.myInput.state.value = '';
    }
    websocketclose(e){  //关闭
        console.log('断开连接',e);
    }

    // componentWillReceiveProps(nextProps, nextContext) {
    //     if (typeof localStorage.getItem('userPhone') === 'string') {
    //         this.initWebSocket(`ws://192.168.1.5:2829//webSocket/chat/${this.state.code}/${localStorage.getItem('userPhone')}`)
    //     }
    // }


    componentDidMount() {
        if (typeof localStorage.getItem('userPhone') === 'string') {
            this.initWebSocket(`ws://192.168.1.5:2829//webSocket/chat/${this.state.code}/${localStorage.getItem('userPhone')}`)
        }
    }

    componentDidUpdate() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight
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
                                            {/*<span style={{color: '#0096DA'}}>{item.name}</span>*/}
                                            {/*    <span style={{color: '#9A9A9A'}}>{item.phone}</span>*/}
                                                <span style={{color: '#9A9A9A'}}>{item.time}</span>
                                            </Space>
                                        }
                                        description={<div
                                            style={{color: '#343434'}}>{item.message}</div>}
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
                               message: e.target.value
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

export default TimMessage;