import React, {useEffect, useState} from 'react';
import weixin from '../../../images/微信(1).png';
import {Button} from "antd";
import {getParam} from "../../../utils";

export default () => {
    let vid = getParam('vid'),
        code = getParam('code');
    const [modal, setModal] = useState(true);

    let player = null;
    const loadPlayer = () => {
        player = window.polyvObject('#player').livePlayer({
            width: '100%',
            height: 540,
            uid: 'e896da440d',
            vid: vid,
            'forceH5': true,
            autoplay: false,
            // autoPlay: false
            // autoPlay: false,
            // useAudio: true,
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


    return (
        <div className='center'>
            <div className='title'>
                <span
                    className="left-name">{sessionStorage.getItem('title')}</span>
                <div className='left-teacher'>
                    <img src={weixin} alt="" className='img'/>
                    <span>老师微信号：{sessionStorage.getItem('phone')}</span>
                </div>
            </div>
            {
                modal ? <div id='player'/> : <div className='demo'>直播未开始</div>
            }
        </div>
    );
}

// <div style={{fontSize: 20, marginBottom: 10}}>直播未开始</div>
// <img
//     src={sessionStorage.getItem('qrCode')}
//     alt=""
//     style={{
//         width: 118,
//         height: 116
//     }}
// />
// <div style={{marginBottom: 20}}>
//                                         <span
//                                             style={{marginRight: 20}}>{sessionStorage.getItem('name')}</span>
//     <span>{sessionStorage.getItem('phone')}</span>
// </div>
// <div style={{width: 300}}><Button type='primary'
//                                   style={{width: '100%'}}>确认</Button>
// </div>