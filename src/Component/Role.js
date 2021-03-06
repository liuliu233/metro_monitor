import React, { useState, useEffect } from 'react';
import { Table, Space, Tooltip, Input, Button, Drawer, Select, Checkbox, Form, Popconfirm, message, Spin } from 'antd';
import { SettingFilled, DeleteFilled, EditFilled, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
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
        clear:'right'
    },

};



const Role = () => {

    useEffect(() => {
        async function onLoad(){
            await reloadData();
             setIsLoad(true);
        }onLoad();
    },[]);
    const [isLoad,setIsLoad] = useState(false);
    const [dataSource,setDataSource] = useState([]);
    const [showData,setShowData] = useState([]);
    const [search,setSearch] = useState('');
    const [visible,setVisible] = useState(false);
    const [showEdit,setShowEdit] = useState(false);
    const [updateData,setUpdateData] = useState({roleName:'',roleType:'',roleNote:'',roleOperation:[]});
    const reloadData= () => {
        const urlencoded = new URLSearchParams();
        const requestOptions = {
            method: 'POST',
            body: urlencoded,
            redirect: 'follow'
        };
        return fetch("http://localhost:3001/users/getRole", requestOptions)
            .then(response => response.json())
            .then(result => {
                let newData=[];
                for(let i=0;i<result.data.length;i++){
                    let item={};
                    item.key=i.toString();
                    item.roleName=result.data[i].roleName;
                    item.roleType=result.data[i].roleType;
                    item.roleOperation=result.data[i].roleOperation;
                    item.roleNote=result.data[i].roleNote;
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

        fetch("http://localhost:3001/users/addRole", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if(result.status===0){
                    reloadData();
                    setVisible(false);
                    message.success('????????????');
                }else
                {
                    message.error('????????????');
                }
            })
            .catch(() => {
                message.error('????????????');
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
                message.success('????????????');
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
            title: '????????????',
            dataIndex: 'roleName',
            key: 'roleName',
            fontWeight:'600',
        },
        {
            title: '????????????',
            dataIndex: 'roleType',
            key: 'roleType',
        },
        {
            title: '??????',
            dataIndex: 'roleNote',
            key: 'roleNote',
            editable:true,
            onCell:(record) => ({
                record,
                editable:true,
                dataIndex:'roleNote',
                title:'??????',
                handleSave:handleSave
            })
        },
        {
            title: '??????',
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
                                        <Tooltip title={'??????'}>
                                            <SettingFilled style={{...styles.icons, color:'#ADADAD'}}/>
                                        </Tooltip>
                                    );
                                case 'delete':
                                    return (
                                        <Tooltip title={'??????'}>
                                            <Popconfirm title="??????????????????????" onConfirm={() => handleDelete(record.key)}  okText="??????" cancelText="??????">
                                                <DeleteFilled style={{...styles.icons, color:'#CE0000'}}/>
                                            </Popconfirm>
                                        </Tooltip>
                                    );
                                case 'update':{
                                    return (
                                        <Tooltip title={'??????'}>
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


    const table=(
        <>
        <Space style={styles.search}>
            <Input onChange={onSearchChange}/>
            <Button
                type="primary"
                icon={<SearchOutlined />}
                style={{ width: 90 }}
                onClick={onSearch}
            >
                ??????
            </Button>
            <Button
                onClick={onReset}
            >
                ??????
            </Button>
        </Space>
        <div style={styles.add}>
            <Tooltip title={'????????????'}>
                <PlusCircleOutlined style={{...styles.icons, color:'#4169E1'}} onClick={onShow}/>
            </Tooltip>
        </div>
        <Table columns={columns} dataSource={showData}/>
        <Drawer
            title="????????????"
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
                    label="????????????"
                    rules={[{ required: true, message: '?????????????????????' }]}
                >
                    <Input placeholder="?????????????????????" />
                </Form.Item>
                <Form.Item
                    name="roleType"
                    label="????????????"
                    rules={[
                        {
                            required: true, message: '?????????????????????'
                        },
                    ]}
                >
                    <Select
                        placeholder="?????????????????????"
                        allowClear
                    >
                        <Option value="????????????">????????????</Option>
                        <Option value="????????????">????????????</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="roleNote" label="??????">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="roleOperation" label="??????">
                    <Checkbox.Group>
                        <Checkbox value="update">??????</Checkbox>
                        <Checkbox value="set">??????</Checkbox>
                        <Checkbox value="delete">??????</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item style={{
                    textAlign: 'right',
                }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>
                        ??????
                    </Button>
                    <Button type="primary" htmlType="submit">
                        ??????
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
        <Drawer
            title="????????????"
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
                    label="????????????"
                >
                    <Input disabled={true}
                           defaultValue={updateData.roleName}
                           value={updateData.roleName}
                    />
                </Form.Item>
                <Form.Item
                    name="roleType"
                    label="????????????"
                >
                    <Select
                        placeholder="?????????????????????"
                        allowClear
                        defaultValue={updateData.roleType}
                    >
                        <Option value="????????????">????????????</Option>
                        <Option value="????????????">????????????</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="roleNote" label="??????">
                    <Input.TextArea defaultValue={updateData.roleNote}/>
                </Form.Item>
                <Form.Item name="roleOperation" label="??????">
                    <Select
                        mode='multiple'
                        allowClear
                        defaultValue={updateData.roleOperation}
                        value={updateData.roleOperation}
                    >
                        <Option value="delete">??????</Option>
                        <Option value="update">??????</Option>
                        <Option value="set">??????</Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{
                    textAlign: 'right',
                }}>
                    <Button onClick={onCloseEdit} style={{ marginRight: 8 }}>
                        ??????
                    </Button>
                    <Button type="primary" htmlType="submit">
                        ??????
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
        </>
    );

    const load=(
        <div className="example" style={{textAlign:'center'}}>
            <Spin />
        </div>
    );


    return (
        <React.Fragment>
            <Goback path={['????????????','????????????']}/>
            {
                isLoad?table:load
            }
        </React.Fragment>
    )
};

export default Role;
