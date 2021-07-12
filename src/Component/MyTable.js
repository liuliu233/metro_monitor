import React, { useEffect, useState } from 'react';
import { Table, Space, Tooltip, Input, Button, Drawer, Select, Checkbox, Form, Popconfirm, message, Spin } from 'antd';
import { SettingFilled, DeleteFilled, EditFilled, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';



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
        clear:'right'
    },

};

/*
props.getUrl: 获取数据url
props.dataMode: 数据模型 {}
props.postUrl: 提交数据url

*/
const MyTable = ({ getUrl, dataMode, postUrl }) => {
    useEffect(() => {
        async function onLoad(){
            await reloadData();
            setIsLoad(true);
        }onLoad();
    },[]);
    const [dataSource,setDataSource] = useState([]);
    const [showData,setShowData] = useState([]);
    const [search,setSearch] = useState('');
    const [visible,setVisible] = useState(false);
    const [showEdit,setShowEdit] = useState(false);
    const [updateData,setUpdateData] = useState(dataMode);
    const reloadData= () => {
        const urlencoded = new URLSearchParams();
        const requestOptions = {
            method: 'POST',
            body: urlencoded,
            redirect: 'follow'
        };
        return fetch(getUrl, requestOptions)
            .then(response => response.json())
            .then(result => {
                let newData=[];
                for(let i=0;i<result.data.length;i++){
                    let item={};
                    item.key=i.toString();
                    for(let key in dataMode){
                        item[key]=result.data[i][key];
                    }
                    newData.push(item);
                }
                setDataSource(newData);
                setShowData(newData);
            })
            .catch(error => console.log('error', error));
    };
    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const onFinish = (values) => {
        let addRole={ ...values };
        if(addRole.roleNote===undefined){
            addRole.roleNote='--';
        }
        if(addRole.roleOperation===undefined){
            addRole.roleOperation=[];
        }
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(addRole);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(postUrl, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if(result.status===0){
                    reloadData();
                    setVisible(false);
                    message.success('更新成功');
                }else
                {
                    message.error('更新失败');
                }
            })
            .catch(() => {
                message.error('更新失败');
            });


    };
    const onSearch = () => {
        const res=[];
        for(let i=0; i<dataSource.length; i++){
            for(let key in dataSource[i]){
                if(dataSource[i][key].toString().indexOf(search)!==-1){
                    res.push(dataSource[i]);
                    break;
                }
            }
        }
        setShowData(res);
    };
    const onReset = () => {
        setShowData(dataSource);
    };
    const onShow = () => {
        setVisible(true);
    };
    const onClose = () =>{
        setVisible(false);
    };
    const handleDelete = (key) => {
        console.log(updateData);
        const index=dataSource.findIndex((item) => {
            return item.key===key;
        });
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        const urlencoded = new URLSearchParams();
        urlencoded.append("roleName", dataSource[index].roleName);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("http://localhost:3001/users/deleteRole", requestOptions)
            .then(() => {
                reloadData();
            })
            .catch(error => console.log('error', error));
    };
    const handleSave = (row) => {
        const index = dataSource.findIndex((item) => row.key === item.key);
        const item = dataSource[index];
        dataSource.splice(index, 1, { ...item, ...row });
        const newData = [...dataSource];
        setDataSource(newData);
        setShowData(dataSource);
    };
    const onCloseEdit = () => {
        setShowEdit(false);
    };
    const onFinishEdit = (values) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const bodyObj={};

        for(let key in values){
            if(values[key]!==undefined){
                Object.assign(bodyObj,{[key]:values[key]});
            }
        }
        Object.assign(bodyObj,{'roleName':updateData.roleName});
        console.log(bodyObj);
        const row = JSON.stringify(bodyObj);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: row,
            redirect: 'follow'
        };

        fetch("http://localhost:3001/users/updateRole", requestOptions)
            .then(() => {
                setShowEdit(false);
                reloadData();
                message.success('更新成功');
            })
            .catch(error => console.log('error', error));

    };
    const handleEdit = (key) => {
        const index=dataSource.findIndex((item) => {
            return item.key===key;
        });
        setShowEdit(true);
        setUpdateData(dataSource[index]);
    };
    const columns = [
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
            fontWeight:'600',
        },
        {
            title: '角色类型',
            dataIndex: 'roleType',
            key: 'roleType',
        },
        {
            title: '备注',
            dataIndex: 'roleNote',
            key: 'roleNote',
            editable:true,
            onCell:(record) => ({
                record,
                editable:true,
                dataIndex:'roleNote',
                title:'备注',
                handleSave:handleSave
            })
        },
        {
            title: '操作',
            key: 'roleOperation',
            dataIndex: 'roleOperation',
            render: (actions, record) =>{
                return (
                    <>
                    {
                        actions.map(op => {
                            switch (op) {
                                case 'set':
                                    return (
                                        <Tooltip title={'设置'}>
                                            <SettingFilled style={{...styles.icons, color:'#ADADAD'}}/>
                                        </Tooltip>
                                    );
                                case 'delete':
                                    return (
                                        <Tooltip title={'删除'}>
                                            <Popconfirm title="确定删除该角色?" onConfirm={() => handleDelete(record.key)}  okText="确定" cancelText="取消">
                                                <DeleteFilled style={{...styles.icons, color:'#CE0000'}}/>
                                            </Popconfirm>
                                        </Tooltip>
                                    );
                                case 'update':{
                                    return (
                                        <Tooltip title={'编辑'}>
                                            <EditFilled style={{...styles.icons, color:'#46A3FF'}} onClick={() => handleEdit(record.key)}/>
                                        </Tooltip>
                                    );
                                }
                            }
                        })}
                    </>
                )
            }

        },
    ];
    return (
        <>
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
        <div style={styles.add}>
            <Tooltip title={'添加角色'}>
                <PlusCircleOutlined style={{...styles.icons, color:'#4169E1'}} onClick={onShow}/>
            </Tooltip>
        </div>
        <Table columns={columns} dataSource={showData}/>
        <Drawer
            title="添加角色"
            width={400}
            onClose={onClose}
            visible={visible}
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Form
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="roleName"
                    label="角色名称"
                    rules={[{ required: true, message: '请输入角色名称' }]}
                >
                    <Input placeholder="请输入角色名称" />
                </Form.Item>
                <Form.Item
                    name="roleType"
                    label="角色类型"
                    rules={[
                        {
                            required: true, message: '请选择角色类型'
                        },
                    ]}
                >
                    <Select
                        placeholder="请选择角色类型"
                        allowClear
                    >
                        <Option value="机构角色">机构角色</Option>
                        <Option value="项目角色">项目角色</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="roleNote" label="备注">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="roleOperation" label="操作">
                    <Checkbox.Group>
                        <Checkbox value="update">修改</Checkbox>
                        <Checkbox value="set">设置</Checkbox>
                        <Checkbox value="delete">删除</Checkbox>
                    </Checkbox.Group>
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
        <Drawer
            title="编辑角色"
            width={400}
            onClose={onCloseEdit}
            visible={showEdit}
            bodyStyle={{ paddingBottom: 80 }}
            destroyOnClose={true}
        >
            <Form
                layout="vertical"
                onFinish={onFinishEdit}
            >
                <Form.Item
                    name="roleName"
                    label="角色名称"
                >
                    <Input disabled={true}
                           defaultValue={updateData.roleName}
                           value={updateData.roleName}
                    />
                </Form.Item>
                <Form.Item
                    name="roleType"
                    label="角色类型"
                >
                    <Select
                        placeholder="请选择角色类型"
                        allowClear
                        defaultValue={updateData.roleType}
                    >
                        <Option value="机构角色">机构角色</Option>
                        <Option value="项目角色">项目角色</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="roleNote" label="备注">
                    <Input.TextArea defaultValue={updateData.roleNote}/>
                </Form.Item>
                <Form.Item name="roleOperation" label="操作">
                    <Select
                        mode='multiple'
                        allowClear
                        defaultValue={updateData.roleOperation}
                        value={updateData.roleOperation}
                    >
                        <Option value="delete">删除</Option>
                        <Option value="update">编辑</Option>
                        <Option value="set">设置</Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{
                    textAlign: 'right',
                }}>
                    <Button onClick={onCloseEdit} style={{ marginRight: 8 }}>
                        取消
                    </Button>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
        </>
    )
};

export default MyTable;