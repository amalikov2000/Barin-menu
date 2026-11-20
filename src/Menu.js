import React, { useState } from 'react';
import { Layout, Menu, Typography, List } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

const subheaderStyle = { width: '100%', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' };

const renderItem = (item) => {
  if (item.type === 'subheader') {
    return (
      <List.Item>
        <div style={subheaderStyle}>{item.content}</div>
      </List.Item>
    );
  }
  return (
    <List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <div><strong>{item.name}</strong></div>
        <div>{item.ingredients}</div>
      </div>
      {item.price && (
        <div style={{ marginLeft: 'auto' }}>
          <Typography.Text strong>{item.price}</Typography.Text>
        </div>
      )}
    </List.Item>
  );
};

const PublicMenu = ({ menu }) => {
  const [activeTab, setActiveTab] = useState(menu.categories[0].id);
  const category = menu.categories.find((c) => c.id === activeTab) || menu.categories[0];

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#3c2b1a' }}>
        <Title level={3} style={{ color: '#FFFFFF', margin: 0 }}>
          {<span>BAR</span>}<span style={{ color: '#b58569' }}>IN  </span>  Menu
        </Title>
      </Header>
      <Content style={{ padding: '0' }}>
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <Menu
            mode="horizontal"
            selectedKeys={[category.id]}
            onClick={(e) => setActiveTab(e.key)}
            style={{ border: 'none' }}
            items={menu.categories.map((c) => ({ key: c.id, label: c.label }))}
          />
        </div>
      </Content>
      <Content style={{ padding: '5px 10px', flex: 1 }}>
        <div className="site-layout-content" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ maxWidth: '100%', width: '100%' }}>
            <List
              style={{ backgroundColor: '#f2ebe4' }}
              header={<div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>{category.title}</div>}
              bordered
              dataSource={category.items}
              renderItem={renderItem}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default PublicMenu;
