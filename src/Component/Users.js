import React, { useState, useEffect } from 'react';
import { Table, Tag, Radio, Space, Tooltip, Input, Button, Drawer, Select, Form, Popconfirm } from 'antd';
import { DeleteFilled, EditFilled, SearchOutlined } from '@ant-design/icons';
import Goback from './Goback';

const { Option } = Select;

const styles={
    icons:{
        fontSize: 25,
        marginLeft: 10,
        display:'inline-block',
        verticalAlign:'middle'
    },
    search:{
        margin:10,
    },
    add:{
        margin:10,
        float:'right',
    },
    tag:{
        float:'left',
        clear:'left',
        marginTop:10
    },
};

const data=[
    {
        key:'1',
        username: '123',
        userPhone: '123456',
        department: '工程技术部',
        role: ['机构普通用户', '机构管理员'],
        state: 'on'
    },
    {
        key:'2',
        username: '234',
        userPhone: '252452',
        department: '工程技术部',
        role: ['机构普通用户'],
        state: 'off'
    }
];

const Users = () => {
    useEffect(() => {
        reloadData();
    },[]);
    const [editUsername, setEditUsername] = useState('');
    const [dataSource,setDataSource] = useState(data);
    const [search,setSearch] = useState('');
    const [visible,setVisible] = useState(false);
    const [updateData, setUpdateData] = useState({username:'',userPhone:'',department:'',role:[],state:'on'});
    const columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '手机号码',
            dataIndex: 'userPhone',
            key: 'userPhone',
        },
        {
            title: '部门',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: '角色',
            key: 'role',
            dataIndex: 'role',
            render: role => (
                <>
                {role.map((item) => {
                    return (
                        <Tag color={'blue'} key={item} style={styles.tag}>
                            {item}
                        </Tag>
                    )
                })}

                </>
            )
        },
        {
            title: '启用状态',
            key: 'state',
            dataIndex: 'state',
            render: state => {
                let color='#32CD32';
                let content='启用';
                if(state!=='on'){
                    color='red';
                    content='禁用';
                }
                return(
                    <div style={{color:color}}>
                        {content}
                    </div>
                )
            }
        },
        {
            title: '操作',
            width:200,
            render:(record) => (
                <div>
                    <Tooltip title={'编辑'}>
                        <EditFilled style={{...styles.icons, color:'#46A3FF'}} onClick={() => showUpdate(record.key)}/>
                    </Tooltip>
                    <Tooltip title={'删除'}>
                        <Popconfirm title="确定删除该角色?" onConfirm={() => handleDelete(record.key)}  okText="确定" cancelText="取消">
                            <DeleteFilled style={{...styles.icons, color:'#CE0000'}}/>
                        </Popconfirm>
                    </Tooltip>
                </div>
            )

        }
    ];
    const reloadData= () => {
        const urlencoded = new URLSearchParams();
        const requestOptions = {
            method: 'POST',
            body: urlencoded,
            redirect: 'follow'
        };
        fetch("http://localhost:3001/users/get", requestOptions)
            .then(response => response.json())
            .then(result => {
                let newData=[];
                for(let i=0;i<result.data.length;i++){
                    let item={};
                    item.key=i.toString();
                    item.username=result.data[i].username;
                    item.userPhone=result.data[i].userPhone;
                    item.department=result.data[i].department;
                    item.role=result.data[i].role;
                    item.state=result.data[i].state;
                    newData.push(item);
                }
                setDataSource(newData);
            })
            .catch(error => console.log('error', error));
    };
    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const onSearch = () => {
        const res=[];
        for(let i=0; i<data.length; i++){
            if(data[i].username.indexOf(search)!==-1||data[i].userPhone.indexOf(search)!==-1||data[i].department.indexOf(search)!==-1){
                res.push(data[i]);
            }
        }
        setDataSource(res)
    };
    const onReset = () => {
        setDataSource(data);
    };
    const onClose = () =>{
        setVisible(false);
    };
    const onFinish = (values) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const bodyObj={};

        for(let key in values){
            if(values[key]!==undefined){
                Object.assign(bodyObj,{[key]:values[key]});
            }
        }
        Object.assign(bodyObj,{'username':editUsername});
        const row = JSON.stringify(bodyObj);
        console.log(row);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: row,
            redirect: 'follow'
        };

        fetch("http://localhost:3001/users/update", requestOptions)
            .then(() => {
                setVisible(false);
                reloadData();
            })
            .catch(error => console.log('error', error));

    };
    const showUpdate = (key) => {
        const index=dataSource.findIndex((item) => {
            return item.key===key;
        });
        const newData={
            username:dataSource[index].username,
            userPhone:dataSource[index].userPhone,
            department:dataSource[index].department,
            role:dataSource[index].role,
            state:dataSource[index].state
        };
        setEditUsername(dataSource[index].username);
        setUpdateData(Object.assign({},updateData,newData));
        setVisible(true);
    };
    const handleDelete = (key) => {
        const index=dataSource.findIndex((item) => {
            return item.key===key;
        });
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        const urlencoded = new URLSearchParams();
        urlencoded.append("username", dataSource[index].username);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("http://localhost:3001/users/delete", requestOptions)
            .then(() => {
                reloadData();
            })
            .catch(error => console.log('error', error));
    };
    return (
        <React.Fragment>
            <Goback path={['信息管理','人员管理']}/>
            <Space style={styles.search}>
                <Input onChange={onSearchChange}/>
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    style={{ width: 90 }}
                    onClick={onSearch}
                >
                    搜索
                </Button>
                <Button
                    onClick={onReset}
                >
                    重置
                </Button>
            </Space>
            <Table columns={columns} dataSource={dataSource}/>
            <Drawer
                title="修改"
                width={400}
                onClose={onClose}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
                destroyOnClose={true}
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                    >
                        <Input
                            disabled={true}
                            initValue={updateData.username}
                        />
                    </Form.Item>
                    <Form.Item
                        name="userPhone"
                        label="电话号码"
                    >
                        <Input
                            defaultValue={updateData.userPhone}
                            value={updateData.userPhone}
                        />
                    </Form.Item>
                    <Form.Item
                        name="state"
                        label="是否启用"
                    >
                        <Radio.Group  defaultValue={updateData.state} value={updateData.state}>
                            <Radio value={'on'}>是</Radio>
                            <Radio value={'off'}>否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        name="department"
                        label="部门"
                    >
                        <Select
                            allowClear
                            defaultValue={updateData.department}
                            value={updateData.department}
                        >
                            <Option value="工程技术部">工程技术部</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="机构角色"
                    >
                        <Select
                            mode='multiple'
                            allowClear
                            defaultValue={updateData.role}
                            value={updateData.role}
                        >
                            <Option value="机构管理员">机构管理员</Option>
                            <Option value="机构普通用户">机构普通用户</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{
                        textAlign: 'right',
                    }}>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            取消
                        </Button>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </React.Fragment>
    )
};

export default Users;