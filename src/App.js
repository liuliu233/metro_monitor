import { Input, Button, Form, Modal, Layout, Typography, Avatar, Menu, Dropdown, message } from 'antd';
import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserOutlined, MoreOutlined } from '@ant-design/icons';
import Navigate from './Component/Navigate';
import Role from './Component/Role';
import Users from './Component/Users'
import { connect } from 'react-redux';
import * as Actions from './Store/Actions';


const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

function App({ userInfo, history, onLogout }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const showModal = () => {
        setIsModalVisible(true);
    };
    const onFinish = (values) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        const urlencoded = new URLSearchParams();
        urlencoded.append("username", userInfo.username);
        urlencoded.append("password", values.password);
        urlencoded.append("newPassword", values.newPassword);
        console.log(values.password);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("http://localhost:3001/users/updatePassword", requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.status===0){
                    message.success('更新成功！');
                }else{
                    message.error('更新失败！')
                }
            })
            .catch(error => console.log('error', error));

        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={() => {showModal()}}>
                    修改密码
                </a>
            </Menu.Item>
            <Menu.Item>
                <a onClick={() => {onLogout()}}>
                    退出登录
                </a>
            </Menu.Item>

        </Menu>
    );
    const userIcon=(
        <>
            <div style={{color:'#FFF', display:'inline', marginLeft:10}}>
                {userInfo.username}
            </div>
            <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <MoreOutlined style={{fontSize:15, color:"#FFF"}}/>
                </a>
            </Dropdown>
        </>
    );
    const NoUser=(
        <div style={{ display:'inline', marginLeft:20}}>
            <a style={{color:'#fff'}} onClick={() => {
                history.push('/log');
            }}>
                未登录
            </a>
        </div>
    );
    return (
        <>
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width='200'>
                <Navigate/>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0, alignItems: 'center', background:"#1E90FF" }} >
                    <div>
                        <div  style={{float:'right', marginRight:15}}>
                            <Avatar icon={<UserOutlined />} />
                            {Object.keys(userInfo).length!==0?userIcon:NoUser}
                        </div>
                    </div>
                    <Title level={3} style={{color:'#fff', margin:15}}>深圳地建自动化监测系统平台</Title>
                </Header>
                <Content style={{ margin: '20px' }}>
                    <Route path='/home/role' render={()=>{
                        if(Object.keys(userInfo).length!==0){
                            return <Role/>
                        }else{
                            return <Redirect to="/log" />
                        }
                    }}/>
                    <Route path='/home/users' render={()=>{
                        if(Object.keys(userInfo).length!==0){
                            return <Users/>
                        }else{
                            return <Redirect to="/log" />
                        }
                    }}/>
                </Content>
                <Footer style={{ textAlign: 'center' }}>深圳市地质建设工程公司 版权所有</Footer>
            </Layout>
        </Layout>
        <Modal
            title="修改密码"
            visible={isModalVisible}
            onCancel={() => {handleCancel()}}
            footer={null}
            maskClosable={false}
            destroyOnClose={true}
        >
            <Form
                form={form}
                name="register"
                scrollToFirstError
                style={{margin:"10px 30px"}}
                onFinish={onFinish}
            >
                <Form.Item
                    name="password"
                    label="原始密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入原始密码!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="新密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入新密码!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="确认新密码"
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: '请确认新密码!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject('两次输入的密码不一致!');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" style={{marginLeft:-20}}>
                        确认
                    </Button>
                    <Button onClick={() => {handleCancel()}} style={{marginLeft:70}}>
                        取消
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
        </>
    );
}

function mapState(state) {
    return {
        userInfo: state.userInfo
    }
}

function mapDispatch(dispatch) {
    return {
        onLogout:() => {
            dispatch(Actions.logout());
        }
    }
}


export default connect(mapState, mapDispatch)(App);
