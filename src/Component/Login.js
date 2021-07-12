import React from 'react';
import { Route } from 'react-router-dom';
import Log from './Log';
import Register from './Register';

const styles={
    logDiv:{
        width:'20%',
        margin:'0 auto',
        left: '40%',
        position: 'absolute',
        top: '20%',
    }
};

const Login = () => {
    return (
        <div style={styles.logDiv}>
            <Route exact path='/log' component={Log}/>
            <Route path='/log/register' component={Register}/>
        </div>
    );
};

export default Login;