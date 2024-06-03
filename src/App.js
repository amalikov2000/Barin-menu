import React, { useState } from 'react';
import { Layout, Menu, Typography, List } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [activeTab, setActiveTab] = useState('1');

  const handleMenuClick = (e) => {
    setActiveTab(e.key);
  };
  
  const getMenuContent = () => {
    switch (activeTab) {
      case '1':
        return (
          <List
            header={
              <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                Primi Piatti
              </div>
            }
            bordered
            dataSource={[
              { item: 'Piatto della Settimana', ingredients: '', price: '10.00 €' },
              { item: 'PASTA FREDDA', ingredients: 'Lunedi - Farfalle al pesto, zucchine e pomodorini, Martedi - Penne sfilaci, pomodorini e grana, Mercoledi - Farfalle con tonno, pomodorini, capperi, Giovedi - Insalata di riso rosso con verdure alla curcuma zucchine, carote,olive ', price: '8.50 €' },
              { subheader: true, content: 'Insalate' },
              { item: 'CAPRESE', ingredients: 'pomodoro cuore di bue, mozzarella fior di latte, pesto e basilico', price: '8,50 €' },
              { item: 'VASILISA', ingredients: 'insalata misticanza, finocchio, ceci, cetrioli, pomodori secchi e scaglie di grana', price: '8,50 €' },
              { item: 'VERDUROSA', ingredients: 'insalata misticanza, pomodorini, zucchine, melanzane, peperoni, avocado, broccoli, e grana', price: '8,50 €' },
              { item: 'PHOCAONTAS', ingredients: 'insalata misticanza, bresaola, pomodorini, riccioli di finocchio, philadelphia e noci ', price: '10,00 €' },
              { item: 'CLASSICA', ingredients: 'insalata misticanza, carote, pomodoro, tonno e mozzarella', price: '9,00 €' },
              { item: 'CAESAR', ingredients: 'insalata misticanza,pomodorini, stracetti di pollo, bacon croccante,salsa cesar, grana a scaglie e crostini', price: '10,00 €' },
              { item: 'FRESCA', ingredients: 'insalata misticanza, sfilaci, uova, zucchine grigliate, grana e olive', price: '9,00 €' },
              { item: 'DELICATA', ingredients: 'insalata misticanza, cetriolo, arancia, gamberetti, avocado, e mais', price: '9,00 €' },
              { item: 'DARIA', ingredients: ' insalata misticanza, carote, pomodorini, philadelphia, fesa di tacchino e semi di zucca', price: '9,00 €' },
              { subheader: true, content: 'Snack' },
              { item: 'Tramezzini ', ingredients: 'Vari gusti', price: '2,50 €' },
              { item: 'Piadina', ingredients: 'crudo serrano e mozzarella filante', price: '5.00 €' },
              { item: 'Piadina', ingredients: 'Prosciutto cotto, pomodoro e mozarella', price: '5.00 €' },
              { item: 'Piadina Integrale', ingredients: 'mozzarella, pomodoro, melanzane grigliate e grana', price: '5.00 €' },
              { item: 'Piadina Integrale', ingredients: 'tacchino arrosto, philadelphia, pomodoro ramato e insalatina', price: '5.00 €' },
              { item: 'Focaccia Genovese', ingredients: 'soppressa e fontina', price: '5.00 €' },
              { item: 'Focaccia Genovese', ingredients: 'mozzarella, zucchine grigliate e pomodoro', price: '5.00 €' },
              { item: 'Panino alla curcuma', ingredients: ' spianata calabra, rucola e formaggio', price: '5.00 €' },
              { item: 'Tostone Classico', ingredients: 'Prosciutto cotto e fontina', price: '5.00 €' },
              { item: 'Tostone ai Cereali', ingredients: 'zucchine e melanzane grligliati, spinaci e formaggio', price: '5.00 €' },
              { item: 'Toast alla Curcuma', ingredients: 'Uovo sodo, avocado, bacon, pomodoro e insalata', price: '5.00 €' },
            ]}
            renderItem={item => {
              if (item.subheader) {
                return (
                  <List.Item>
                    <div style={{ width: '100%', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                      {item.content}
                    </div>
                  </List.Item>
                );
              } else if (item.item === 'PASTA FREDDA') {
                // Splitting the ingredients by comma
                const ingredientsList = item.ingredients.split(',');
                return (
                  <List.Item style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                      <Typography.Text strong>{item.item}</Typography.Text>
                      {ingredientsList.map((ingredient, index) => {
                        // Separating day and dish
                        const [day, dish] = ingredient.split(' - ');
                        if (dish) {
                          return (
                            <div key={index}>
                              <Typography.Text strong>{day}</Typography.Text> - {dish.trim()}
                            </div>
                          );
                        } else {
                          return null; // If dish is undefined, return null
                        }
                      })}
                    </div>
                    <div><Typography.Text strong>{item.price}</Typography.Text></div>
                  </List.Item>
                );
              } else {
                return (
                  <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Typography.Text strong>{item.item}</Typography.Text>
                      <div>{item.ingredients}</div>
                    </div>
                    <div><Typography.Text strong>{item.price}</Typography.Text></div>
                  </List.Item>
                );
              }
            }}                        
          />
        );
      case '2':
        return (
          <List
            header={
              <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                Cichetti - 2€
              </div>
            }
            bordered
            dataSource={[
              { item: '', ingredients: '- Bacalà mantecato e insalatina', price: '' },
              { item: '', ingredients: '- Pomodoro secco e soppressa veneta', price: '' },
              { item: '', ingredients: '- Polpetta di carne e cetriolo', price: '' },
              { item: '', ingredients: '- Polpettine di verdure e salsa piccante', price: '' },
              { subheader: true, content: 'Aperitivo classico'},
              { item: 'Bianco', ingredients: '', price: '3.50 €' },
              { item: 'Aperol', ingredients: '', price: '4.00 €' },
              { item: 'Campari', ingredients: '', price: '4.00 €' },
              { item: 'Select', ingredients: '', price: '4.00 €' },
              { item: 'Misto', ingredients: '', price: '4.00 €' },
              { item: 'P31', ingredients: '', price: '4.00 €' },
              { item: 'Hugo', ingredients: '', price: '4.50 €' },
              { item: 'Campari gin', ingredients: '', price: '4.50 €' },
              { subheader: true, content: 'Spritz Speciali '},
              { item: 'Limoncello', ingredients: 'Limoncello, succo di limone, sciroppo di zucchero, prosecco, seltz', price: '4.50 €' },
              { item: 'Maracuja', ingredients: 'Sciroppo maracuja, prosecco, seltz, passoa ', price: '4.50 €' },
              { item: 'Curaçao', ingredients: 'Blue curaçao, lemonsoda, vodka ', price: '4.50 €' },
              { item: 'Lemon', ingredients: 'Campari, lemonsoda, gin ', price: '4.50 €' },
              { item: 'Havana ', ingredients: 'Campari, succo d’arancia, rum ', price: '4.50 €' },
              { item: 'Montenegro ', ingredients: 'Aperol, Montenegro, prosecco, seltz ', price: '4.50 €' },
              { item: 'Pumpkin', ingredients: 'Liquore di Zucca, Aperol, prosecco, seltz ', price: '4.50 €' },
              { item: 'Esmerald ', ingredients: 'P31, ginger beer, vodka', price: '4.50 €' },
            ]} 

            renderItem={item => {
              if (item.subheader) {
                return (
                  <List.Item>
                    <div style={{ width: '100%', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                      {item.content}
                    </div>
                  </List.Item>
                );
              } else {
                return (
                  <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Typography.Text strong>{item.item}</Typography.Text>
                      <div>{item.ingredients}</div>
                    </div>
                    <div><Typography.Text strong>{item.price}</Typography.Text></div>
                  </List.Item>
                );
              }
            }}
          />
        );
      case '3':
        return (
          <List
            header={
              <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                Centrifughe
              </div>
            }
            bordered
            dataSource={[
              { item: 'Arancia, carota, sedano, zenzero', ingredients: '', price: '5.00 €' },
              { item: 'Mela, arancia e carota ', ingredients: '', price: '5.00 €' },
              { item: 'Arancia, limone zenzero ', ingredients: '', price: '5.00 €' },
              { item: 'Mela, carota', ingredients: '', price: '5.00 €' },
              { item: 'Spremuta, arancia', ingredients: '', price: '5.00 €' },
            ]}
            renderItem={item => {
              if (item.subheader) {
                return (
                  <List.Item>
                    <div style={{ width: '100%', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                      {item.content}
                    </div>
                  </List.Item>
                );
              } else {
                return (
                  <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Typography.Text strong>{item.item}</Typography.Text>
                      <div>{item.ingredients}</div>
                    </div>
                    <div><Typography.Text strong>{item.price}</Typography.Text></div>
                  </List.Item>
                );
              }
            }}
          />
        );
      case '4':
        return <div>Coming Soon</div>;
      case '5':
        return <div> Coming Soon </div>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Header className="header" style={{ background: '#3c2b1a', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="logo">
          <Title level={3} style={{ color: 'white', margin: 0 }}>BARIN Menu</Title>
        </div>
      </Header>
      <Content style={{ padding: '0' }}>
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['1']}
            selectedKeys={[activeTab]}
            onClick={handleMenuClick}
            style={{ border: 'none' }}
          >
            <Menu.Item key="1">
              Lunch
            </Menu.Item>
            <Menu.Item key="2">
            Aperetivi
            </Menu.Item>
            <Menu.Item key="3">
              Bibite
            </Menu.Item>
            <Menu.Item key="4">
              Caffeteria
            </Menu.Item>
            <Menu.Item key="5">
              Dolce
            </Menu.Item>
          </Menu>
        </div>
        </Content>
      <Content style={{ padding: '5px 10px', flex: 1 }}>
        <div className="site-layout-content" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {/* Content for each tab */}
          <div style={{ maxWidth: '100%', width: '100%' }}>
            {getMenuContent()}
          </div>
        </div>
        </Content>
    </Layout>
  );
};

export default App;
