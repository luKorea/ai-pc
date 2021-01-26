import React, {Component} from 'react';
import {Button, Input, List, message, Skeleton, Space} from 'antd';
import flower from '../../../../images/花(4).png';
import {deleteObject, getParam} from "../../../../utils";


class TimMessage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            data: [],
            code: getParam('code'),
            message: '',
            websock: null,
            ziWeb: null,
        }
    }

    _that = this;


    sendFlower = () => {
        this.state.ziWeb.send('🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸')
        const user = [{
            time: new Date().toLocaleTimeString(),
            message: '🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸',
        }];
        let newData = [...this.state.data, ...user]
        this.setState({
            data: newData
        })
    };

    //初始化weosocket
    initziSocket(wsurl){ //初始化weosocket
        let ws = new WebSocket(wsurl);
        ws.onopen = this.ziwebsocketonopen();
        ws.onerror = this.ziwebsocketonerror();
        this.setState({
            ziWeb: ws
        }, () => {
        })
    }
    ziwebsocketonopen(){ //连接建立之后执行send方法发送数据
        // console.log('咨询聊天打开');
    }
    ziwebsocketonerror(e){//连接建立失败重连
        // console.log('重新连接websocket');
        // this.initWebSocket()
    }
    ziwebsocketsend = () => {//数据发送
        if (this.state.message === '') {
            message.error('请输入信息')
        } else {
            const user = [{
                time: new Date().toLocaleTimeString(),
                message: this.state.message,
            }];
            let newData = [...this.state.data, ...user]
            this.setState({
                data: newData
            })
            this.state.ziWeb.send(this.state.message)
            this.myInput.state.value = '';
            this.setState({
                message: ''
            })
        }
    }



    //初始化weosocket
    initWebSocket() { //初始化weosocket
        // 192.168.1.4:2829
        // 8.129.64.22:2829
        let ws = new WebSocket(`ws://8.129.64.22:2829/imserver/${sessionStorage.getItem('userPhone')}`);
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

    websocketonopen() { //连接建立之后执行send方法发送数据
        console.log('聊天websocket已经连接');
    }

    websocketonerror(e) {//连接建立失败重连
    }

    websocketonmessage = (e) => { //数据接收
        console.log('数据接收', e);
        let res = JSON.parse(e.data);
        res.time = res.time ? new Date(res.time).toLocaleTimeString() : ''
        let result = [res];
        let newData = deleteObject(result);
        console.log(newData);
        this.setState({
            data: this.state.data.concat(newData)
        })
    }
    websocketsend = () => {//数据发送
        if (this.state.message === '') {
            message.error('请输入消息')
            return
        } else {
            const user = [{
                time: new Date().toLocaleTimeString(),
                message: this.state.message,
            }];
            let newData = [...this.state.data, ...user]
            this.setState({
                data: newData
            })
            this.myInput.state.value = '';
            this.setState({
                message: ''
            })
        }
    }

    websocketclose(e) {  //关闭
        // console.log('断开连接', e);
    }


    componentWillReceiveProps(nextProps, nextContext) {
        if(this.state.websock === null) {
            if (typeof sessionStorage.getItem('id') === 'string') {
                this.initWebSocket()
                if (this.state.ziWeb === null) {
                    let id = sessionStorage.getItem('id').toString();
                    this.initziSocket(`ws://8.129.64.22:2829/webSocket/chat/${id}/${sessionStorage.getItem('userPhone')}`)
                }
            }
        }
    }



    componentDidUpdate() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight
    }

    render() {
        return (
            <div className="tim-wrap">
                <div className="tim-content"
                     ref={chatContainer => this.chatContainer = chatContainer}>
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
                                                <span style={{color: '#0096DA'}}>{item.username || '我'}</span>
                                                {/*    <span style={{color: '#9A9A9A'}}>{item.phone}</span>*/}
                                                <span
                                                    style={{color: '#9A9A9A'}}>{item.time || ''}</span>
                                            </Space>
                                        }
                                        description={<div
                                            style={{color: '#343434'}}>{item.message || ''}</div>}
                                    />
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                </div>
                <div className="send-message">
                    <Button
                        icon={<img src={flower}
                                   style={{
                                       width: 21,
                                       height: 21,
                                       marginRight: 2
                                   }}
                                   alt=""/>}
                        style={{
                            backgroundColor: '#F86E0D',
                            color: '#fff',
                            height: 40,
                        }}
                        onClick={this.sendFlower}
                    >送花</Button>
                    <Input type='text'
                           ref={myInput => this.myInput = myInput}
                           onChange={(e) => this.setState({
                               message: e.target.value
                           })}/>
                    <Button type='primary'
                            style={{height: 40}}
                            onClick={this.ziwebsocketsend}
                    >发送</Button>
                </div>
            </div>
        );
    }
}

export default TimMessage;