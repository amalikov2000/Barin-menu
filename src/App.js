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
          style={{backgroundColor: '#f2ebe4'}}
            header={
              <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                Primi Piatti
              </div>
            }
            bordered
            dataSource={[
              { item: 'Penne con salsa al pomodoro', ingredients: '', price: '7.50 €' },
              { item: 'Penne all`arrabbiata', ingredients: '', price: '7.50 €' },
              { item: 'Rigatoni con pesto alla genovese', ingredients: '', price: '8.50 €' },
              { item: 'Rigatoni alla cacio e pepe e bacon croccante ', ingredients: '', price: '8.50 €' },
              { item: 'Pasta fredda', ingredients: '', price: '8.50 €' },
              { subheader: true, content: 'Secondi' },
              { item: 'Proposta della settimana', ingredients: '', price: '10.00 €' },
              { item: 'Tagliere di affettati misti', ingredients: 'crudo, serrano, bresaola, punta d`anca, soppressa nostrana, pancetta', price: '12.00 €' },
              { subheader: true, content: 'Insalate' },
              { item: 'CAPRESE', ingredients: 'pomodoro cuore di bue, mozzarella fior di latte, pesto e basilico', price: '8.50 €' },
              { item: 'VASILISA', ingredients: 'insalata misticanza, finocchio, ceci, cetrioli, pomodori secchi e scaglie di grana', price: '8.50 €' },
              { item: 'VERDUROSA', ingredients: 'insalata misticanza, pomodorini, zucchine, melanzane, peperoni, avocado, broccoli e grana', price: '8.50 €' },
              { item: 'POCAHONTAS', ingredients: 'insalata misticanza, bresaola, pomodorini, riccioli di finocchio, philadelphia e noci ', price: '10.00 €' },
              { item: 'CLASSICA', ingredients: 'insalata misticanza, carote, pomodoro, tonno e mozzarella', price: '9.00 €' },
              { item: 'CAESAR', ingredients: 'insalata misticanza, pomodorini, straccetti di pollo, bacon croccante, salsa caesar, grana a scaglie e crostini', price: '10.00 €' },
              { item: 'FRESCA', ingredients: 'insalata misticanza, sfilacci, uova, zucchine grigliate, grana e olive', price: '9.00 €' },
              { item: 'DELICATA', ingredients: 'insalata misticanza, cetrioli, arancia, gamberetti, avocado e mais', price: '9.00 €' },
              { item: 'DARIA', ingredients: ' insalata misticanza, carote, pomodorini, philadelphia, fesa di tacchino e semi di zucca', price: '9.00 €' },
              { subheader: true, content: 'Snack' },
              { item: 'Tramezzini ', ingredients: '', price: '2.50 €' },
              { item: 'Piadina 1', ingredients: 'crudo serrano e mozzarella filante', price: '5.00 €' },
              { item: 'Piadina 2', ingredients: 'prosciutto cotto, pomodoro e mozzarella', price: '5.00 €' },
              { item: 'Piadina integrale', ingredients: 'mozzarella, pomodoro, melanzane grigliate e grana', price: '5.00 €' },
              { item: 'Piadina integrale', ingredients: 'tacchino arrosto, philadelphia, pomodoro ramato e insalatina', price: '5.00 €' },
              { item: 'Focaccia genovese', ingredients: 'soppressa e fontina', price: '5.00 €' },
              { item: 'Focaccia genovese', ingredients: 'mozzarella, zucchine grigliate e pomodoro', price: '5.00 €' },
              { item: 'Panino alla curcuma', ingredients: ' spianata calabra, rucola e formaggio', price: '5.00 €' },
              { item: 'Tostone classico', ingredients: 'prosciutto cotto e fontina', price: '5.00 €' },
              { item: 'Tostone ai cereali', ingredients: 'zucchine e melanzane grigliate, spinaci e formaggio', price: '5.00 €' },
              { item: 'Toast alla curcuma', ingredients: 'uovo sodo, avocado, bacon, pomodoro e insalata', price: '5.00 €' },
              { subheader: true, content: 'Aggiunte' },
              { item: 'Crudo/ Bresaola/ Tacchino', ingredients: '', price: '2.00 €' },
              { item: 'Sfilacci', ingredients: '', price: '2.00 €' },
              { item: 'Mozzarella', ingredients: '', price: '2.00 €' },
              { item: 'Tonno', ingredients: '', price: '1.00 €' },
              { item: 'Pollo', ingredients: '', price: '1.00 €' },
              { item: 'Uovo', ingredients: '', price: '1.00 €' },
              { item: 'Verdure', ingredients: '', price: '1.00 €' },
              { item: 'Grana', ingredients: '', price: '1.00 €' },
              { item: 'Salsa rosa/ Avocado/ Yoghurt', ingredients: '', price: '0.50 €' },
              
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
                  <List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
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
                    <div style={{ marginLeft: 'auto' }}><Typography.Text strong>{item.price}</Typography.Text></div>
                  </List.Item>
                );
              } else {
                return (
                  <List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <Typography.Text strong>{item.item}</Typography.Text>
                      <div>{item.ingredients}</div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}><Typography.Text strong>{item.price}</Typography.Text></div>
                  </List.Item>
                );
              }
            }}                        
          />
        );
      case '2':
        return (
          <List
          style={{backgroundColor: '#f2ebe4'}}
            header={
              <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                Cicchetti - 1.80 €
              </div>
            }
            bordered
            dataSource={[
              { item: '', ingredients: '- Baccalà mantecato e insalatina', price: '' },
              { item: '', ingredients: '- Pomodoro secco e soppressa veneta', price: '' },
              { item: '', ingredients: '- Polpetta di carne e cetrioli', price: '' },
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
              { item: 'Limoncello', ingredients: 'limoncello, succo di limone, sciroppo di zucchero, prosecco, seltz', price: '4.50 €' },
              { item: 'Maracuja', ingredients: 'sciroppo maracuja, prosecco, seltz, Passoa ', price: '4.50 €' },
              { item: 'Curaçao', ingredients: 'blue curaçao, lemonsoda, vodka ', price: '4.50 €' },
              { item: 'Lemon', ingredients: 'Campari, lemonsoda, gin ', price: '4.50 €' },
              { item: 'Havana ', ingredients: 'Campari, succo d’arancia, rum ', price: '4.50 €' },
              { item: 'Montenegro ', ingredients: 'Aperol, Montenegro, prosecco, seltz ', price: '4.50 €' },
              { item: 'Pumpkin', ingredients: 'liquore di zucca, Aperol, prosecco, seltz ', price: '4.50 €' },
              { item: 'Esmerald ', ingredients: 'P31, ginger beer, vodka', price: '4.50 €' },
              { subheader: true, content: 'Cocktails'},
              { item: 'Bellini', ingredients: '', price: '5.00 €' },
              { item: 'Black Russian', ingredients: '', price: '7.00 €' },
              { item: 'Gin Tonic', ingredients: '', price: '7.00 €' },
              { item: 'Gin Lemon', ingredients: '', price: '7.00 €' },
              { item: 'Gin Fizz', ingredients: '', price: '7.50 €' },
              { item: 'Vodka Lemon', ingredients: '', price: '7.00 €' },
              { item: 'Vodka Sour', ingredients: '', price: '7.50 €' },
              { item: 'Cuba Libre', ingredients: '', price: '7.00 €' },
              { item: 'Americano', ingredients: '', price: '7.00 €' },
              { item: 'Negroni', ingredients: '', price: '8.00 €' },
              { item: 'Quattro Bianchi', ingredients: '', price: '8.00 €' },
              { item: 'Moscow Mule', ingredients: '', price: '8.00 €' },
              { item: 'London Mule', ingredients: '', price: '8.00 €' },
              { item: 'Espresso Martini', ingredients: '', price: '8.00 €' },
              { item: 'Whiskey Sour', ingredients: '', price: '8.00 €' },
              { item: 'Boulevardier', ingredients: '', price: '8.00 €' },
              { item: 'Old Fashioned', ingredients: '', price: '8.00 €' },
              { item: 'Paloma', ingredients: '', price: '8.00 €' },
              { item: 'Caipirinha', ingredients: '', price: '8.00 €' },
              { subheader: true, content: 'Birre'},
              { item: 'Birra Heineken', ingredients: '', price: '3.50 €' },
              { item: 'Birra Leffe rouge', ingredients: '', price: '5.00 €' },
              { item: 'Birra Leffe blonde', ingredients: '', price: '5.00 €' },
              { subheader: true, content: 'Vino'},
              { item: 'Vino rosso calice', ingredients: '', price: '4.00 €' },
              { item: 'Vino bianco calice', ingredients: '', price: '4.00 €' },
              { item: 'Prosecco calice', ingredients: '', price: '4.00 €' },
              { item: 'Valpolicella bottiglia', ingredients: '', price: '25.00 €' },
              { item: 'Lugana bottiglia', ingredients: '', price: '25.00 €' },
              { item: 'Prosecco bottiglia', ingredients: '', price: '23.00 €' },
              { subheader: true, content: 'Shot'},
              { item: 'Amaro', ingredients: '', price: '3.50 €' },
              { item: 'Limoncello', ingredients: '', price: '3.50 €' },
              { item: 'Grappa', ingredients: '', price: '4.00 €' },
              { item: 'Tequila', ingredients: '', price: '4.00 €' },
              { item: 'Vodka', ingredients: '', price: '3.50 €' },
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
                  <List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div><strong>{item.item}</strong></div>
                      <div>{item.ingredients}</div>
                    </div>
                    {item.price && (
                      <div style={{ marginLeft: 'auto' }}>
                        <Typography.Text strong>{item.price}</Typography.Text>
                      </div>
                    )}
                  </List.Item>
                );
              }
            }}
          />
        );
      case '3':
        return (
          <List
          style={{backgroundColor: '#f2ebe4'}}
            header={
              <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                Centrifughe
              </div>
            }
            bordered
            dataSource={[
              { item: 'Arancia, carota, sedano, zenzero', ingredients: '', price: '5.00 €' },
              { item: 'Mela, arancia, carota ', ingredients: '', price: '5.00 €' },
              { item: 'Arancia, limone, zenzero ', ingredients: '', price: '5.00 €' },
              { item: 'Mela, carota', ingredients: '', price: '5.00 €' },
              { item: 'Spremuta di arancia', ingredients: '', price: '4.00 €' },
              { subheader: true, content: 'Bevande analcoliche'},
              { item: 'Acqua bottiglia 0,5 l', ingredients: '', price: '1.20 €' },
              { item: 'Acqua bottiglia 1 l', ingredients: '', price: '2.00 €' },
              { item: 'Acqua bicchiere', ingredients: '', price: '0.50 €' },
              { item: 'Acqua tonica', ingredients: '', price: '3.50 €' },
              { item: 'Tè freddo lattina', ingredients: '', price: '3.00 €' },
              { item: 'Tè freddo bottiglia', ingredients: '', price: '3.50 €' },
              { item: 'Fanta / Coca / Lemon Soda', ingredients: '', price: '3.00 €' },
              { item: 'Aperitivo analcolico', ingredients: '', price: '3.00 €' },
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
                  <List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div><strong>{item.item}</strong></div>
                      <div>{item.ingredients}</div>
                    </div>
                    {item.price && (
                      <div style={{ marginLeft: 'auto' }}>
                        <Typography.Text strong>{item.price}</Typography.Text>
                      </div>
                    )}
                  </List.Item>
                );
              }
            }}
          />
        );
      case '4':
        return (
          <List
          style={{backgroundColor: '#f2ebe4'}}
            header={
              <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
               Caffè
              </div>
            }
            bordered
            dataSource={[
              { item: 'Caffè', ingredients: '', price: '1.30 €' },
              { item: 'Caffè decaffeinato', ingredients: '', price: '1.50 €' },
              { item: 'Caffè macchiato', ingredients: '', price: '1.40 €' },
              { item: 'Caffè deca macchiato', ingredients: '', price: '1.50 €' },
              { item: 'Cappuccino', ingredients: '', price: '1.60 €' },
              { item: 'Cappuccino deca', ingredients: '', price: '1.70 €' },
              { item: 'Cappuccino grande', ingredients: '', price: '2.40 €' },
              { item: 'Macchiatone', ingredients: '', price: '1.50 €' },
              { item: 'Macchiatone deca', ingredients: '', price: '1.60 €' },
              { item: 'Latte macchiato', ingredients: '', price: '1.80 €' },
              { item: 'Caffè corretto', ingredients: '', price: '2.00 €' },
              { item: 'Caffè shakerato', ingredients: '', price: '2.50 €' },
              { item: 'Orzo', ingredients: '', price: '1.40 €' },
              { item: 'Orzo macchiato', ingredients: '', price: '1.50 €' },
              { item: 'Cappuccino d`orzo', ingredients: '', price: '1.70 €' },
              { item: 'Macchiatone d`orzo', ingredients: '', price: '1.60 €' },
              { item: 'Ginseng', ingredients: '', price: '1.50 €' },
              { item: 'Ginseng macchiato', ingredients: '', price: '1.60 €' },
              { item: 'Cappuccino di ginseng', ingredients: '', price: '1.80 €' },
              { item: 'Macchiatone di ginseng', ingredients: '', price: '1.70 €' },
              { subheader: true, content: 'Tè'},
              { item: 'Tè caldo', ingredients: 'nero/ verde/ mora e lampone', price: '2.00 €' },
              { item: 'Rooibos al cioccolato', ingredients: '', price: '3.50 €' },
              { item: 'Tisana malva', ingredients: '', price: '3.50 €' },
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
                  <List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div><strong>{item.item}</strong></div>
                      <div>{item.ingredients}</div>
                    </div>
                    {item.price && (
                      <div style={{ marginLeft: 'auto' }}>
                        <Typography.Text strong>{item.price}</Typography.Text>
                      </div>
                    )}
                  </List.Item>
                );
              }
            }}
          />
        );
      case '5':
        return (
          <List
          style={{backgroundColor: '#f2ebe4'}}
            header={
              <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
               Gelato
              </div>
            }
            bordered
            dataSource={[
              { item: 'Coppetta / Cono piccola', ingredients: '', price: '2.50 €' },
              { item: 'Coppetta / Cono media', ingredients: '', price: '3.50 €' },
              { subheader: true, content: 'Pasticceria'},
              { item: 'Brioche', ingredients: '', price: '1.30 €' },
              { item: 'Biscotto grande', ingredients: '', price: '1.60 €' },
              { item: 'Biscotto piccolo', ingredients: '', price: '1.20 €' },
              { item: 'Muffin senza glutine', ingredients: '', price: '3.00 €' },
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
                  <List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div><strong>{item.item}</strong></div>
                      <div>{item.ingredients}</div>
                    </div>
                    {item.price && (
                      <div style={{ marginLeft: 'auto' }}>
                        <Typography.Text strong>{item.price}</Typography.Text>
                      </div>
                    )}
                  </List.Item>
                );
              }
            }}
          />
        );
      default:
        return null;
    }
  };

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
            defaultSelectedKeys={['1']}
            selectedKeys={[activeTab]}
            onClick={handleMenuClick}
            style={{ border: 'none' }}
          >
            <Menu.Item key="1">
              Lunch
            </Menu.Item>
            <Menu.Item key="2">
            Aperitivi
            </Menu.Item>
            <Menu.Item key="3">
              Bibite
            </Menu.Item>
            <Menu.Item key="4">
              Caffetteria
            </Menu.Item>
            <Menu.Item key="5">
              Dolci
            </Menu.Item>
          </Menu>
        </div>
        </Content>
      <Content style={{ padding: '5px 10px', flex: 1 }}>
        <div className="site-layout-content" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ maxWidth: '100%', width: '100%' }}>
            {getMenuContent()}
          </div>
        </div>
        </Content>
    </Layout>
  );
};

export default App;
