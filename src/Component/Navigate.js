import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import icon from '../img/logo.png';

const { SubMenu } = Menu;

const Navigate = () => {
    const [openKeys, setOpenKeys] = React.useState(["sub1"]);
    const onOpenChange = keys => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        setOpenKeys(latestOpenKey ? [ latestOpenKey] : []);
    };


    return (
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['0']} openKeys={openKeys} onOpenChange={onOpenChange} style={{ width: 200 }}>
            <div style={{margin:'3px', height:'50px'}}>
                <img src={icon} height="100%" width="100%"/>
            </div>
            <Menu.Item key="0"><Link to='/home'>首页</Link></Menu.Item>
            <SubMenu key="sub2" title="系统设置">
                <Menu.Item key="1"><Link to='/home/role'>角色管理</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" title="信息管理">
                <Menu.Item key="2"><Link to='/home/users'>人员管理</Link></Menu.Item>
                <Menu.Item key="3">人员审核</Menu.Item>
                <Menu.Item key="4">单位管理</Menu.Item>
                <Menu.Item key="5">部门管理</Menu.Item>
                <Menu.Item key="6">资料管理</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title="设备管理">
                <Menu.Item key="7">采集设备库</Menu.Item>
                <Menu.Item key="8">传感器库</Menu.Item>
                <Menu.Item key="9">采集设备预警组</Menu.Item>
                <Menu.Item key="10">采集设备状态管理</Menu.Item>
            </SubMenu>
            <SubMenu key="sub5" title="项目中心">
                <Menu.Item key="11">项目中心</Menu.Item>
                <Menu.Item key="12">标段管理</Menu.Item>
                <Menu.Item key="13">测项测点</Menu.Item>
                <Menu.Item key="14">团队列表</Menu.Item>
                <Menu.Item key="15">项目审核</Menu.Item>
            </SubMenu>
            <SubMenu key="sub6" title="数据中心">
                <Menu.Item key="16">数据处理设置</Menu.Item>
                <Menu.Item key="17">原始数据</Menu.Item>
                <Menu.Item key="18">数据分析</Menu.Item>
                <Menu.Item key="19">数据超限预警监测</Menu.Item>
            </SubMenu>
            <SubMenu key="sub7" title="文档库">
                <Menu.Item key="20">机构文档</Menu.Item>
                <Menu.Item key="21">帮助文档</Menu.Item>
            </SubMenu>
            <SubMenu key="sub8" title="报表中心">
                <Menu.Item key="22">报表管理</Menu.Item>
                <Menu.Item key="23">模板管理</Menu.Item>
            </SubMenu>
        </Menu>
    )
};

export default Navigate;

