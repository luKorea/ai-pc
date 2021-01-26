import React, {useEffect, useState} from 'react';
import poster from '../../../images/图层20.png';
import weixin from '../../../images/微信(1).png';
import {getParam} from "../../../utils";
import {Button, Modal} from "antd";
import {getLocalItem} from "../../../utils/localStorage";

export default () => {


    const [modal, setModal] = useState(true);
    const [startState, setStartState] = useState(false);

    let player = null;
    // TODO 发送请求，获取到VID
    const loadPlayer = () => {
        let vid = null;
        if (localStorage.getItem('vid')) {
            vid = localStorage.getItem('vid')
        }
        player = window.polyvPlayer({
            wrap: '.player',
            width: '100%',
            height: '100%',
            // 视频唯一ID
            vid,
            // vid: 'e896da440daabbfb51145b58f44b2f31_e',
            // 显示画中画
            pictureInPicture: true,
            // 是否隐藏播放器控制栏的进度条
            ban_skin_progress: true,
            // ban_bar_keep_play_btn: 'off',
            // skinLocation: 0,
            // 是否隐藏播放结束后的重播按钮。
            hideRepeat: true,
            ban_seek: 'on',
            autoplay: false,
            speed: false,
            // 是否禁用续播功能，取值：{on,off}。
            ban_history_time: 'on'
        })
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

    useEffect(() => {
        let vid = localStorage.getItem('vid'),
            code = localStorage.getItem('code');
        if (vid === null && code === null) {
            setModal(false)
            console.log(vid, code);
        }
    }, [])

    useEffect(() => {
        if (!window.polyvPlayer) {
            loadScript('https://player.polyv.net/script/player.js')
                .then(() => {
                    loadPlayer()
                    // 设置播放时长，服务器返回的开播时间，用当前视频的总时长，减去开播时间过去的时长，获取到视频播放时间
                    player.on('s2j_onPlayerInitOver', function (e) {
                        const time = player.j2s_getDuration();
                        let date = 0;
                        if (localStorage.getItem('time')) {
                            date = localStorage.getItem('time')
                        }
                        // player.j2s_seekVideo(time - date);
                        // player.j2s_seekVideo(time);
                        player.on('s2j_onPlayOver', function (e) {
                            setModal(false)
                            // setStartState(true)
                        })
                    });
                    console.log(player);
                    // 视频播放结束
                })
        }
        return () => {
            if (player) {
                player.destroy();
            }
        }
    }, [])

    return (
        <div className='center'>
            <div className='title'>
                <span
                    className="left-name">{localStorage.getItem('title')}</span>
                <div className='left-teacher'>
                    <img src={weixin} alt="" className='img'/>
                    <span>老师微信号：{localStorage.getItem('phone')}</span>
                </div>
            </div>
            {
                modal ?
                    <div className="wrap" style={{height: 540}}>
                        <div className="player" style={{height: 540}}/>
                    </div>
                    : <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "column",
                        width: '100%',
                        height: '100%',
                        color: '#fff',
                        fontSize: 24,
                        backgroundColor: 'rgba(0,0,0,.45)'
                    }}>
                        <img
                            src={localStorage.getItem('qrCode')}
                            alt=""
                            style={{
                                width: 118,
                                height: 116
                            }}
                        />
                        <div style={{marginBottom: 20}}>
                            <span style={{marginRight: 20}}>{localStorage.getItem('name')}</span>
                            <span>{localStorage.getItem('phone')}</span>
                        </div>
                        <div style={{width: 300}}><Button type='primary'
                                                          style={{width: '100%'}}>确认</Button>
                        </div>
                    </div>
            }
            {/*<Modal*/}
            {/*    title='直播已结束'*/}
            {/*    visible={startState}*/}
            {/*    maskClosable={false}*/}
            {/*    style={{borderRadius: 10}}*/}
            {/*    labelAlign='left'*/}
            {/*    centered*/}
            {/*    closable={false}*/}
            {/*    footer={null}*/}
            {/*    maskStyle={{*/}
            {/*        backgroundColor: 'rgba(0,0,0,.45)'*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <div style={{*/}
            {/*        display: 'flex',*/}
            {/*        justifyContent: 'center',*/}
            {/*        alignItems: 'center',*/}
            {/*        flexDirection: "column"*/}
            {/*    }}>*/}
            {/*        <img*/}
            {/*            src={getLocalItem('qrCode')}*/}
            {/*            alt=""*/}
            {/*            style={{*/}
            {/*                width: 118,*/}
            {/*                height: 116*/}
            {/*            }}*/}
            {/*        />*/}
            {/*        <div style={{marginBottom: 20}}>*/}
            {/*            <span style={{marginRight: 20}}>{getLocalItem('name')}</span>*/}
            {/*            <span>{getLocalItem('phone')}</span>*/}
            {/*        </div>*/}
            {/*        <div style={{width: 300}}><Button type='primary'*/}
            {/*                                          style={{width: '100%'}}>确认</Button>*/}
            {/*        </div>*/}
            {/*        /!*onClick={() => setStartState(false)}*!/*/}
            {/*    </div>*/}
            {/*</Modal>*/}
        </div>
    );
}