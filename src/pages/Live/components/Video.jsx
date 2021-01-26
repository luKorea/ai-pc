import React, {useEffect, useState} from 'react';
import {deleteObject, getParam} from "../../../utils";

import {
    Tooltip,
    Space,
    Input,
    Button,
    Tabs,
    Badge,
    message, Image
} from 'antd';

import weixin from '../../../images/weixin.jpg';
import weiIcon from '../../../images/微信(1).png';
import phoneIcon from '../../../images/phone.png';
import shareIcon from '../../../images/share.png';
import tuIcon from '../../../images/tupian.png';
import flowBtn from '../../../images/huabtn.png';
import flow from '../../../images/hua.png';
import people from '../../../images/ren.png';

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart';

import './index.less';
const {TabPane} = Tabs;


// 实例化视频播放器
function MyVideo() {
    let vid = sessionStorage.getItem('vid'),
        code = sessionStorage.getItem('code'),
        type = sessionStorage.getItem('type');
    const [modal, setModal] = useState(true);

    let player = null;
    const loadPlayer = () => {
        player = window.polyvObject('#player').livePlayer({
            width: '13.23rem',
            height: '7rem',
            uid: 'e896da440d',
            vid: vid,
            'forceH5': true,
            autoplay: false,
            autoPlay: false
        });
        console.log(player);
        window.s2j_onApiStatus = e => {
            if (e === 'end') {
                console.log(e);
                setModal(false)
            } else {
                console.log(e);
                setModal(true)
            }
        }
    }
// 引入保立威视频组件
    const loadScript = (src) => {
        const headElement = document.head || document.getElementsByTagName('head')[0];
        const _importedScript = {};

        return new Promise((resolve, reject) => {
            if (src in _importedScript) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.onerror = err => {
                headElement.removeChild(script);
                reject(new URIError(`The Script ${src} is no accessible.`));
            }
            script.onload = () => {
                _importedScript[src] = true;
                resolve();
            }
            headElement.appendChild(script);
            script.src = src;
        })
    }

// TODO 发送请求，获取到VID
    useEffect(() => {
        if (vid === null && code === null) {
            setModal(false)
            console.log(vid, code);
        }
    }, [])

    useEffect(() => {
        loadScript('https://player.polyv.net/livescript/liveplayer.js')
            .then(() => {
                loadPlayer();
            })
        return () => {
            if (player) {
                player.destroy();
            }
        }
    }, [])

    useEffect(() => {
        console.log(modal);
    }, [modal])

    return (<div>
        {
            modal ? <div id='player'/> : <div className='demo'>直播未开始</div>
        }
    </div>)
}


class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            infoWs: null,
            infoData: [],
            messageWs: null,
            messageData: [],
            message: '',
            key: 1,
            showImg: false

        }
    }

    // 计数
    callback = (key) => {
        console.log(key, 'key');
        this.setState({
            count: 0,
            key: key
        })
    }

    sendFlower = () => {
        const {key} = this.state;
        if (key == 1) {
            this.state.messageWs.send('送给老师鲜花 🌹')
            const user = [{
                message: `送给老师鲜花 🌹`,
            }];
            let newData = [...this.state.infoData, ...user]
            this.setState({
                infoData: newData
            })
        } else {
            this.state.messageWs.send(`送给老师鲜花 🌹`)
        }
    }
    ziwebsocketsend = () => {//数据发送
        const {key} = this.state;
        if (this.state.message === '') {
            message.error('请输入信息')
            return
        } else {
            console.log(key);
            if (key == 2) {
                this.state.messageWs.send(this.state.message)
                this.inputRef.state.value = '';
                this.setState({
                    message: ''
                })
            } else if (key == 1) {
                const user = [{
                    message: this.state.message,
                }];
                console.log(user);
                let newData = [...this.state.infoData, ...user]
                this.setState({
                    infoData: newData
                })
                this.state.messageWs.send(this.state.message)
                this.inputRef.state.value = '';
                this.setState({
                    message: ''
                })
            }
        }

    }
    //初始化咨询weosocket
    initMessageWebsocket = (wsurl) => { //初始化weosocket
        let ws = new WebSocket(wsurl);
        ws.onopen = this.ziwebsocketonopen;
        ws.onerror = this.ziwebsocketonerror;
        ws.onmessage = this.ziwebsocketonmessage;
        this.setState({
            messageWs: ws
        })
    }
    ziwebsocketonopen = (e) => { //连接建立之后执行send方法发送数据
        console.log('咨询websocket已经连接');
    }
    ziwebsocketonerror = (e) => {//连接建立失败重连
    }
    ziwebsocketonmessage = (e) => {
        if (e) {
            console.log(e);
            let res = JSON.parse(e.data);
            if (res.sendMethod !== '0') {
                message.info('老师给您发来消息啦，打开咨询查看', 5)
            } if (res.type == 2) {
                return;
            } if (res.type == 3) {
                let key = res.msg,
                    oldKey = sessionStorage.getItem('userKey');
                if (key == oldKey) {
                    message.error('您的账号已在其他设备登陆')
                    let oldVid = sessionStorage.getItem('vid'),
                        oldCode = sessionStorage.getItem('code'),
                        oldType = sessionStorage.getItem('type');
                    this.props.history.push(`/login?vid=${oldVid}&code=${oldCode}&type=${oldType}`)
                }
            } else {
                this.setState({
                    count: res.sendMethod
                })
                let result = [res];
                this.setState({
                    messageData: this.state.messageData.concat(result)
                })
            }
        }
    }

    //初始化聊天weosocket
    initInfoWebsocket = () => {
        // 192.168.1.11 8.129.64.22
        let ws = new WebSocket(`ws://8.129.64.22:2829/imserver/${sessionStorage.getItem('userPhone')}`);
        ws.onmessage = this.websocketonmessage;
        ws.onopen = this.websocketonopen;
        ws.onerror = this.websocketonerror;
        this.setState({
            infoWs: ws
        })
    }
    websocketonopen = () => { //连接建立之后执行send方法发送数据
        console.log('聊天websocket已经连接');
    }
    websocketonerror = (e) => {//连接建立失败重连
    }
    websocketonmessage = (e) => { //数据接收
        if (e) {
            let res = JSON.parse(e.data);
            let result = [res];
            let newData = deleteObject(result);
            this.setState({
                infoData: this.state.infoData.concat(newData)
            })
        }
    }

    componentDidMount() {
        let vid = getParam('vid'),
            code = getParam('code'),
            type = getParam('type'),
            oldVid = sessionStorage.getItem('vid'),
            oldCode = sessionStorage.getItem('code'),
            oldType = sessionStorage.getItem('type');
        if (oldCode !== null && oldCode !== null && oldType !== null) {
            if (oldVid != vid || oldCode != code || oldType != type) {
                this.props.history.push(`/login?vid=${oldVid}&code=${oldCode}&type=${oldType}`)
            }
        } else {
            this.props.history.push(`/login?vid=${vid}&code=${code}&type=${type}`)
        }
        sessionStorage.setItem('vid', vid);
        sessionStorage.setItem('code', code);
        sessionStorage.setItem('type', type);
        if (this.state.infoWs === null) {
            if (typeof sessionStorage.getItem('id') === 'string') {
                this.initInfoWebsocket()
                if (this.state.messageWs === null) {
                    let id = sessionStorage.getItem('id').toString();
                    this.initMessageWebsocket(`ws://8.129.64.22:2829/webSocket/chat/${id}/${sessionStorage.getItem('userPhone')}`)
                }
            }
        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        this.infoRef.scrollTop = this.infoRef.scrollHeight;
        if (this.messageRef) {
            this.messageRef.scrollTop = this.messageRef.scrollHeight;
        }
    }

    addEmoji = (value) => {
        const {native} = value;
        console.log(this.inputRef.state.value);
        if (this.inputRef.state.value !== undefined) {
            this.inputRef.state.value += native;
        } else {
            this.inputRef.state.value = native;
        }
        this.setState({
            showImg: false,
            message: this.inputRef.state.value
        })
    }

    onKeyDownchange = (e) => {
        if (e.keyCode === 13) {
            this.ziwebsocketsend();
        }
    }

    render() {
        const {messageData, infoData, count, showImg} = this.state;
        const qrCode = sessionStorage.getItem('qrCode'),
            phone = sessionStorage.getItem('phone'),
            random = sessionStorage.getItem('random');
        return (
            <div className='video-container'>
                <div className='video-wrap'>
                    <MyVideo/>
                    <div className='message-container'>
                        {/* 教师信息 */}
                        <div className='left'>
                            <Space size='large'>
                                <Tooltip color='#fff' placement="topRight"
                                         title={<img src={qrCode || weixin}
                                                     alt="" style={{
                                             width: '1.78rem',
                                             height: '1.78rem'
                                         }}/>}>
                                    <img src={qrCode || weixin} alt=""
                                         className='erweima'/>
                                </Tooltip>
                                <div className='weixin'>
                                    <img src={weiIcon} className='icon' alt=""/>
                                    <span>{phone}</span>
                                </div>
                                <div className='phone'>
                                    <img src={phoneIcon} className='phone-icon'
                                         alt=""/>
                                    <span>{phone}</span>
                                </div>
                                {/*<div className='share'>*/}
                                {/*    <img src={shareIcon} className='share-icon'*/}
                                {/*         alt=""/>*/}
                                {/*    <span>分享</span>*/}
                                {/*</div>*/}
                            </Space>
                        </div>
                    </div>
                </div>
                <div className='tim-container'>
                    {/* 显示人数*/}
                    <div className='number-container'>
                        <Space>
                            <img src={people} alt=""/>
                            <span>{random}</span>
                        </Space>
                    </div>
                    <Tabs defaultActiveKey="1" onChange={this.callback}>
                        <TabPane tab="聊天" key="1">
                            <div className='info-container' id='info'>
                                <div className="tim-content"
                                     ref={infoRef => this.infoRef = infoRef}>
                                    {
                                        infoData && infoData.length > 0 ? infoData.map((item, index) => (
                                            <div className='tim-wrap'
                                                 key={index}>
                                                <Space>
                                                    <span className='name'>{item.name || item.username || '我'}:</span>
                                                    {
                                                        item.type == 4 ? <Image src={item.message} height={100} width={100} alt=""/> :
                                                            <span className='message'>{item.message}</span>
                                                    }
                                                </Space>
                                            </div>
                                        )) : ''
                                    }
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab={<div>
                            <span style={{marginRight: 3}}>咨询</span>
                            <Badge count={count} size={"small"}/>
                        </div>} key="2">
                            <div className='message-container'>
                                <div className="tim-content"
                                     ref={messageRef => this.messageRef = messageRef}>
                                    {
                                        messageData && messageData.length > 0 ? messageData.map((item, index) => (
                                            <div className='tim-wrap'
                                                 key={index}>
                                                <Space>
                                                    <span
                                                        className='name'>{item.username}: </span>
                                                    {
                                                        item.type == 4 ? <Image src={item.msg} height={100} width={100} alt=""/> :
                                                            <span className='message'>{item.msg}</span>
                                                    }
                                                </Space>
                                            </div>
                                        )) : ''
                                    }
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    {/* 文字编辑 */}
                    <div className="text-edit">
                        <Input type='text'
                               className='input'
                               placeholder='大家来互动吧~'
                               ref={inputRef => this.inputRef = inputRef}
                               onKeyDown={e=> this.onKeyDownchange(e)}
                               onChange={(e) => this.setState({
                                   message: e.target.value
                               })}/>
                        <div className='picture'>
                            <img src={tuIcon} alt="" className='tu-icon' onClick={() => this.setState({showImg: true})}/>
                        </div>
                        {
                            showImg ? <Picker style={{width: '3.35rem'}} set='apple' onSelect={this.addEmoji} class='imgArray' /> : ''
                        }
                        <div className='flow' onClick={this.sendFlower}>
                            <img src={flowBtn} alt=""
                                 className='flow-icon'/>
                        </div>
                        <Button className='btn'
                                onClick={this.ziwebsocketsend}>发送</Button>
                    </div>
                </div>
            </div>
        );
    }

}

export default Video;
