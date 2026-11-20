import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Layout, Typography, Input, InputNumber, Button, Tabs, Table, Alert, Space, Tag, Modal, Form, Select, Segmented, message,
} from 'antd';

const { Header, Content } = Layout;
const TOKEN_KEY = 'barin_admin_token';
const LANG_KEY = 'barin_admin_lang';

// ---- interface language (RU / IT). Dish names and descriptions are shown as entered.
const STRINGS = {
  ru: {
    password: 'Пароль',
    login: 'Войти',
    wrongPassword: 'Неверный пароль',
    tooMany: 'Слишком много попыток, попробуйте позже',
    unreachable: 'Сервер недоступен',
    loading: 'Загрузка…',
    loadError: 'Не удалось загрузить меню (сервер недоступен)',
    newItem: 'Новая позиция',
    dishName: 'Название блюда',
    dishNameReq: 'Введите название',
    ingredients: 'Описание состава',
    price: 'Цена, €',
    priceReq: 'Введите цену',
    subsection: 'Подраздел',
    add: 'Добавить',
    cancel: 'Отмена',
    sectionTitle: 'Заголовок раздела:',
    changedTag: 'изменено',
    newTag: 'новая',
    addTitle: 'Добавить позицию',
    remove: 'Убрать',
    notFound: 'Ничего не найдено в этом разделе',
    openMenu: 'Открыть меню',
    logout: 'Выйти',
    search: 'Поиск позиции…',
    noChanges: 'Нет изменений',
    changesN: (n) => `Изменений: ${n}`,
    undo: 'Отменить',
    save: 'Сохранить',
    saved: 'Сохранено. Меню обновлено.',
    added: 'Позиция добавлена. Нажмите «Сохранить», чтобы она появилась в меню.',
    sessionExpired: 'Сессия истекла, войдите снова',
    saveError: 'Ошибка сохранения',
    emptyTitles: 'Заголовки не могут быть пустыми',
  },
  it: {
    password: 'Password',
    login: 'Accedi',
    wrongPassword: 'Password errata',
    tooMany: 'Troppi tentativi, riprova più tardi',
    unreachable: 'Server non raggiungibile',
    loading: 'Caricamento…',
    loadError: 'Impossibile caricare il menu (server non raggiungibile)',
    newItem: 'Nuovo piatto',
    dishName: 'Nome del piatto',
    dishNameReq: 'Inserisci il nome',
    ingredients: 'Descrizione / ingredienti',
    price: 'Prezzo, €',
    priceReq: 'Inserisci il prezzo',
    subsection: 'Sottosezione',
    add: 'Aggiungi',
    cancel: 'Annulla',
    sectionTitle: 'Titolo della sezione:',
    changedTag: 'modificato',
    newTag: 'nuovo',
    addTitle: 'Aggiungi un piatto',
    remove: 'Rimuovi',
    notFound: 'Nessun risultato in questa sezione',
    openMenu: 'Apri il menu',
    logout: 'Esci',
    search: 'Cerca un piatto…',
    noChanges: 'Nessuna modifica',
    changesN: (n) => `Modifiche: ${n}`,
    undo: 'Annulla modifiche',
    save: 'Salva',
    saved: 'Salvato. Menu aggiornato.',
    added: 'Piatto aggiunto. Premi «Salva» per pubblicarlo nel menu.',
    sessionExpired: 'Sessione scaduta, accedi di nuovo',
    saveError: 'Errore di salvataggio',
    emptyTitles: 'I titoli non possono essere vuoti',
  },
};

const LangContext = createContext({ lang: 'ru', t: STRINGS.ru, setLang: () => {} });
const useT = () => useContext(LangContext).t;

const LangSwitch = () => {
  const { lang, setLang } = useContext(LangContext);
  return (
    <Segmented
      size="small"
      value={lang}
      onChange={setLang}
      options={[{ label: 'RU', value: 'ru' }, { label: 'IT', value: 'it' }]}
    />
  );
};

const parsePrice = (s) => (s ? parseFloat(s) : null);
const formatPrice = (n) => (n === null || n === undefined ? '' : `${Number(n).toFixed(2)} €`);

// Client-side ids: let us tell saved items from new ones even after inserting in the middle of a list.
const withKeys = (menu) => ({
  categories: menu.categories.map((c, ci) => ({
    ...c,
    items: c.items.map((it, ii) => ({ ...it, _k: `${ci}-${ii}` })),
  })),
});
const stripKeys = (menu) => ({
  categories: menu.categories.map((c) => ({
    ...c,
    items: c.items.map(({ _k, isNew, ...rest }) => rest),
  })),
});

const Login = ({ onLogin }) => {
  const t = useT();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.status === 401) throw new Error(t.wrongPassword);
      if (r.status === 429) throw new Error(t.tooMany);
      if (!r.ok) throw new Error(data.error || t.unreachable);
      onLogin(data.token);
    } catch (e) {
      setError(e.message === 'Failed to fetch' ? t.unreachable : e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '60px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Admin</Typography.Title>
        <LangSwitch />
      </div>
      <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
        <Input.Password
          autoFocus
          placeholder={t.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onPressEnter={submit}
        />
        {error && <Alert type="error" message={error} showIcon />}
        <Button type="primary" block loading={loading} onClick={submit}>{t.login}</Button>
      </Space>
    </div>
  );
};

const AddItemModal = ({ category, onCancel, onAdd }) => {
  const t = useT();
  const [form] = Form.useForm();
  const open = !!category;

  const sections = useMemo(() => {
    if (!category) return [];
    const list = [{ value: -1, label: category.title }];
    category.items.forEach((it, i) => {
      if (it.type === 'subheader') list.push({ value: i, label: it.content });
    });
    return list;
  }, [category]);

  useEffect(() => {
    if (open) form.setFieldsValue({ name: '', ingredients: '', price: null, section: sections[sections.length - 1].value });
  }, [open, sections, form]);

  const ok = async () => {
    const values = await form.validateFields().catch(() => null);
    if (values) onAdd(values);
  };

  return (
    <Modal
      open={open}
      title={`${t.newItem} — ${category ? category.label : ''}`}
      okText={t.add}
      cancelText={t.cancel}
      onOk={ok}
      onCancel={onCancel}
      destroyOnClose
      forceRender
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="name"
          label={t.dishName}
          rules={[{ required: true, whitespace: true, message: t.dishNameReq }, { max: 100 }]}
        >
          <Input maxLength={100} autoFocus />
        </Form.Item>
        <Form.Item name="ingredients" label={t.ingredients} rules={[{ max: 300 }]}>
          <Input.TextArea rows={3} maxLength={300} />
        </Form.Item>
        <Form.Item name="price" label={t.price} rules={[{ required: true, message: t.priceReq }]}>
          <InputNumber min={0} max={999} step={0.1} precision={2} addonAfter="€" inputMode="decimal" style={{ width: 160 }} />
        </Form.Item>
        <Form.Item name="section" label={t.subsection}>
          <Select options={sections} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Editor = ({ token, onLogout }) => {
  const t = useT();
  const [saved, setSaved] = useState(null); // last version from the server
  const [draft, setDraft] = useState(null); // edited version
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(null); // index of the category being added to
  const [activeTab, setActiveTab] = useState(null);
  const newCounter = useRef(0);
  const [msg, ctx] = message.useMessage();

  const load = (m) => { const k = withKeys(m); setSaved(k); setDraft(k); };

  useEffect(() => {
    fetch('/api/menu')
      .then((r) => r.json())
      .then(load)
      .catch(() => setLoadError(true));
  }, []);

  // saved value per item: price for dishes, text for sub-headers
  const savedValues = useMemo(() => {
    const map = {};
    if (saved) saved.categories.forEach((c) => c.items.forEach((it) => {
      map[it._k] = it.type === 'subheader' ? it.content : it.price;
    }));
    return map;
  }, [saved]);

  const changes = useMemo(() => {
    if (!saved || !draft) return 0;
    let n = 0;
    draft.categories.forEach((c, ci) => {
      if (c.title !== saved.categories[ci].title) n++;
      c.items.forEach((it) => {
        if (it.type === 'subheader') { if (it.content !== savedValues[it._k]) n++; return; }
        if (it.isNew || it.price !== savedValues[it._k]) n++;
      });
    });
    return n;
  }, [saved, draft, savedValues]);

  const hasEmptyTitle = useMemo(
    () => !!draft && draft.categories.some((c) => !c.title.trim() || c.items.some((it) => it.type === 'subheader' && !it.content.trim())),
    [draft],
  );

  // warn before closing the tab with unsaved changes
  useEffect(() => {
    if (!changes) return undefined;
    const h = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [changes]);

  const update = useCallback((ci, fn) => {
    setDraft((d) => ({
      ...d,
      categories: d.categories.map((c, i) => (i === ci ? fn(c) : c)),
    }));
  }, []);

  const patchItem = (ci, ii, patch) =>
    update(ci, (c) => ({ ...c, items: c.items.map((it, i) => (i === ii ? { ...it, ...patch } : it)) }));

  const removeNew = (ci, ii) => update(ci, (c) => ({ ...c, items: c.items.filter((_, i) => i !== ii) }));

  const addItem = (values) => {
    const ci = adding;
    update(ci, (c) => {
      let at = c.items.length; // insert at the end of the chosen sub-section
      for (let i = values.section + 1; i < c.items.length; i++) {
        if (c.items[i].type === 'subheader') { at = i; break; }
      }
      newCounter.current += 1;
      const item = {
        type: 'item',
        name: values.name.trim(),
        ingredients: (values.ingredients || '').trim(),
        price: formatPrice(values.price),
        _k: `n${newCounter.current}`,
        isNew: true,
      };
      return { ...c, items: [...c.items.slice(0, at), item, ...c.items.slice(at)] };
    });
    setSearch('');
    setAdding(null);
    msg.success(t.added);
  };

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(stripKeys(draft)),
      });
      if (r.status === 401) { msg.error(t.sessionExpired); onLogout(); return; }
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || t.saveError);
      load(data);
      msg.success(t.saved);
    } catch (e) {
      msg.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <Alert type="error" message={t.loadError} style={{ margin: 16 }} />;
  if (!draft) return <div style={{ padding: 16 }}>{t.loading}</div>;

  const q = search.trim().toLowerCase();

  const tabs = draft.categories.map((cat, ci) => {
    const rows = cat.items
      .map((it, ii) => ({ ...it, key: it._k, ii }))
      .filter((it) => it.type === 'subheader' || !q || `${it.name} ${it.ingredients}`.toLowerCase().includes(q));
    const hasMatch = rows.some((r) => r.type === 'item');
    return {
      key: cat.id,
      label: cat.label,
      children: (
        <div>
          <Space style={{ marginBottom: 12 }} wrap>
            <span>{t.sectionTitle}</span>
            <Input
              style={{ width: 280 }}
              value={cat.title}
              maxLength={100}
              status={cat.title.trim() ? undefined : 'error'}
              onChange={(e) => update(ci, (c) => ({ ...c, title: e.target.value }))}
            />
            {cat.title !== saved.categories[ci].title && <Tag color="orange">{t.changedTag}</Tag>}
            <Button type="primary" shape="circle" size="large" title={t.addTitle} onClick={() => setAdding(ci)}>
              +
            </Button>
          </Space>
          {q && !hasMatch ? (
            <Typography.Text type="secondary">{t.notFound}</Typography.Text>
          ) : (
            <Table
              size="small"
              pagination={false}
              showHeader={false}
              dataSource={rows}
              columns={[
                {
                  dataIndex: 'name',
                  render: (_, r) => {
                    if (r.type === 'subheader') {
                      return (
                        <Space wrap>
                          <Input
                            value={r.content}
                            maxLength={100}
                            status={r.content.trim() ? undefined : 'error'}
                            onChange={(e) => patchItem(ci, r.ii, { content: e.target.value })}
                            style={{ fontSize: 16, fontWeight: 600, width: 260 }}
                          />
                          {r.content !== savedValues[r._k] && <Tag color="orange">{t.changedTag}</Tag>}
                        </Space>
                      );
                    }
                    return (
                      <div>
                        <strong>{r.name || r.ingredients}</strong>
                        {r.isNew && <Tag color="green" style={{ marginLeft: 8 }}>{t.newTag}</Tag>}
                        {r.name && r.ingredients && <div style={{ color: '#888', fontSize: 12 }}>{r.ingredients}</div>}
                      </div>
                    );
                  },
                },
                {
                  width: 210,
                  render: (_, r) => {
                    if (r.type === 'subheader') return null;
                    const changed = !r.isNew && r.price !== savedValues[r._k];
                    return (
                      <Space>
                        <InputNumber
                          min={0}
                          max={999}
                          step={0.1}
                          precision={2}
                          addonAfter="€"
                          inputMode="decimal"
                          placeholder="—"
                          status={changed || r.isNew ? 'warning' : undefined}
                          value={parsePrice(r.price)}
                          onChange={(v) => patchItem(ci, r.ii, { price: formatPrice(v) })}
                          style={{ width: 140 }}
                        />
                        {r.isNew && (
                          <Button size="small" danger title={t.remove} onClick={() => removeNew(ci, r.ii)}>×</Button>
                        )}
                      </Space>
                    );
                  },
                },
              ]}
            />
          )}
        </div>
      ),
    };
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {ctx}
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#3c2b1a' }}>
        <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
          BAR<span style={{ color: '#b58569' }}>IN</span> · Admin
        </Typography.Title>
        <Space size="middle">
          <LangSwitch />
          <a href="/" target="_blank" rel="noreferrer" style={{ color: '#fff' }}>{t.openMenu}</a>
          <Button size="small" onClick={onLogout}>{t.logout}</Button>
        </Space>
      </Header>
      <Content style={{ padding: 16, maxWidth: 800, width: '100%', margin: '0 auto', paddingBottom: 90 }}>
        <Input.Search
          allowClear
          placeholder={t.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Tabs items={tabs} activeKey={activeTab || draft.categories[0].id} onChange={setActiveTab} />
      </Content>
      <AddItemModal
        category={adding === null ? null : draft.categories[adding]}
        onCancel={() => setAdding(null)}
        onAdd={addItem}
      />
      <div
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, padding: '12px 16px', background: '#fff',
          borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center',
        }}
      >
        <span>{hasEmptyTitle ? t.emptyTitles : changes ? t.changesN(changes) : t.noChanges}</span>
        <Button onClick={() => setDraft(saved)} disabled={!changes || saving}>{t.undo}</Button>
        <Button type="primary" onClick={save} loading={saving} disabled={!changes || hasEmptyTitle}>{t.save}</Button>
      </div>
    </Layout>
  );
};

const Admin = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [lang, setLangState] = useState(() => (localStorage.getItem(LANG_KEY) === 'it' ? 'it' : 'ru'));
  const setLang = (l) => { localStorage.setItem(LANG_KEY, l); setLangState(l); };
  const ctx = useMemo(() => ({ lang, setLang, t: STRINGS[lang] }), [lang]);
  const login = (tk) => { sessionStorage.setItem(TOKEN_KEY, tk); setToken(tk); };
  const logout = () => { sessionStorage.removeItem(TOKEN_KEY); setToken(null); };
  return (
    <LangContext.Provider value={ctx}>
      {token ? <Editor token={token} onLogout={logout} /> : <Login onLogin={login} />}
    </LangContext.Provider>
  );
};

export default Admin;
