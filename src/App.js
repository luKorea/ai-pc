import React from 'react';
import {HashRouter, Switch, Route, Redirect} from "react-router-dom";
import routes from './router';
import './App.less';
import './common/index.less';


class App extends React.Component {

    constructor(props) {
        super(props);
    }


    resizeListener() {
        // 定义设计图的尺寸 1920
        let designSize = 1920;
        // 获取 html 元素
        let html = document.documentElement;
        // 定义窗口的宽度
        let clientW = html.clientWidth;
        let sizeNum = 100;
        if (clientW < 576) {
            sizeNum = 80
        } else if (clientW <= 576) {
            sizeNum = 90
        } else if (clientW <= 768) {
            sizeNum = 100
        } else if (clientW <= 992) {
            sizeNum = 100
        } else if (clientW <= 1200) {
            sizeNum = 100
        } else if (clientW <= 1360) {
            sizeNum = 100
        } else if (clientW <= 1400) {
            sizeNum = 100
        } else if (clientW <= 1600) {
            sizeNum = 100
        } else if (clientW <= 1547) {
            sizeNum = 110
        }
        // html 的fontsize 大小
        let htmlRem = clientW * sizeNum / designSize;
        html.style.fontSize = htmlRem + 'px';
        console.log(html.style.fontSize);
    }

    // 在第一次渲染后调用
    componentDidMount() {
        window.addEventListener('resize', this.resizeListener);
        this.resizeListener();
    }

    // 在组件从 DOM 中移除之前立刻被调用
    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
    }

    render() {
        return (
            <div className="app">
                <HashRouter>
                    <div className='content'>
                        <Switch>
                            {
                                routes.map((item, index) => {
                                    return (
                                        <Route
                                            key={index} path={item.path}
                                            exact={item.exact}
                                            render={props => {
                                                document.title = item.title;
                                                return <item.component {...props}/>
                                            }}/>
                                    );
                                })
                            }
                            <Redirect from='/' to='/login'/>
                        </Switch>
                    </div>
                </HashRouter>
            </div>
        );
    }
}


export default App;
