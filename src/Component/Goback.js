import React from 'react';
import {createBrowserHistory} from 'history';
import { Breadcrumb, Button } from 'antd';

const Goback = ({path}) => {
    const history = createBrowserHistory();
    return(
        <div style={{height:40}}>
            <Button  type={"primary"} style={{marginRight:10, float:'right',}} onClick={() => {
                history.goBack();
            }}>
                返回
            </Button>
            <Breadcrumb style={{ margin: '20px' }}>
                {path.map((item) => {
                    return (<Breadcrumb.Item>{item}</Breadcrumb.Item>)
                })}
            </Breadcrumb>
        </div>
    )
};

export default Goback;
