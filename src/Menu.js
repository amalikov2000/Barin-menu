import React, { useState } from 'react';
import { Layout, Typography, List } from 'antd';

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
    <List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
        <div><strong>{item.name}</strong></div>
        <div>{item.ingredients}</div>
      </div>
      {item.price && (
        <div style={{ marginLeft: 'auto', flexShrink: 0, whiteSpace: 'nowrap' }}>
          <Typography.Text strong>{item.price}</Typography.Text>
        </div>
      )}
    </List.Item>
  );
};

// Tabs scroll sideways with a swipe instead of collapsing into a "…" menu on narrow screens.
const tabBarCss = `
.menu-tabbar { display: flex; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; background: #fff; border-bottom: 1px solid #f0f0f0; }
.menu-tabbar::-webkit-scrollbar { display: none; }
.menu-tab { flex: 0 0 auto; padding: 14px 18px; font: inherit; font-size: 15px; color: rgba(0,0,0,.88); background: none; border: 0; border-bottom: 2px solid transparent; cursor: pointer; white-space: nowrap; }
.menu-tab:hover { color: #1677ff; }
.menu-tab[aria-selected="true"] { color: #1677ff; border-bottom-color: #1677ff; }
`;

const PublicMenu = ({ menu }) => {
  const [activeTab, setActiveTab] = useState(menu.categories[0].id);
  const category = menu.categories.find((c) => c.id === activeTab) || menu.categories[0];

  return (
    <Layout>
      <style>{tabBarCss}</style>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#3c2b1a', padding: '0 clamp(16px, 5vw, 50px)' }}>
        <Title level={3} style={{ color: '#FFFFFF', margin: 0, whiteSpace: 'nowrap' }}>
          {<span>BAR</span>}<span style={{ color: '#b58569' }}>IN  </span>  Menu
        </Title>
      </Header>
      <Content style={{ padding: '0' }}>
        <div className="menu-tabbar" role="tablist">
          {menu.categories.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              className="menu-tab"
              aria-selected={c.id === category.id}
              onClick={(e) => {
                setActiveTab(c.id);
                e.currentTarget.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
              }}
            >
              {c.label}
            </button>
          ))}
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
