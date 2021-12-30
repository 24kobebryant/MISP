import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { DatabaseOutlined, FileSearchOutlined } from '@ant-design/icons'
import './App.less';

const { Content, Footer } = Layout;

function App() {
  let navigate = useNavigate();

  return (
    <Layout className="layout">
        
      <div className='header'>
        <div className="logo" />
        <div className='misp' />
        <Menu 
          mode="horizontal" 
          defaultSelectedKeys={['data-manage']}
          onClick={(e) => {
            navigate(e.key);
          }}>
          <Menu.Item key='data-manage' icon={<DatabaseOutlined />}>
            数据管理
          </Menu.Item>
          <Menu.Item key='policy-manage' icon={<FileSearchOutlined />}>
            政策管理
          </Menu.Item>
        </Menu>
      </div>

      <Content style={{ padding: '65px 50px 0 50px' }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        BUPT DSSC ©2021 Created by ZiThreeBro
      </Footer>
    </Layout>
  );
}

export default App;
