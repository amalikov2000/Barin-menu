import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Layout, Typography, Input, InputNumber, Button, Tabs, Alert, Space, Tag, Modal, Form, Select, Segmented, message,
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
    editItem: 'Изменить позицию',
    edit: 'Изменить',
    apply: 'Применить',
    dishName: 'Название блюда',
    dishNameReq: 'Введите название или описание',
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
    edited: 'Изменения применены. Нажмите «Сохранить», чтобы они появились в меню.',
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
    editItem: 'Modifica piatto',
    edit: 'Modifica',
    apply: 'Applica',
    dishName: 'Nome del piatto',
    dishNameReq: 'Inserisci il nome o la descrizione',
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
    edited: 'Modifiche applicate. Premi «Salva» per pubblicarle nel menu.',
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

// One dialog for both cases: `item` given -> edit that dish, otherwise add a new one to `category`.
const ItemModal = ({ open, category, item, onCancel, onSubmit }) => {
  const t = useT();
  const [form] = Form.useForm();
  const editing = !!item;

  const sections = useMemo(() => {
    if (!category) return [];
    const list = [{ value: -1, label: category.title }];
    category.items.forEach((it, i) => {
      if (it.type === 'subheader') list.push({ value: i, label: it.content });
    });
    return list;
  }, [category]);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      form.setFieldsValue({ name: item.name, ingredients: item.ingredients, price: parsePrice(item.price) });
    } else {
      form.setFieldsValue({ name: '', ingredients: '', price: null, section: sections[sections.length - 1].value });
    }
  }, [open, editing, item, sections, form]);

  const ok = async () => {
    const values = await form.validateFields().catch(() => null);
    if (values) onSubmit(values);
  };

  // some existing dishes (e.g. the cicchetti list) have no name, only a description
  const nameOrDescription = {
    validator: (_, v) =>
      (v && v.trim()) || (form.getFieldValue('ingredients') || '').trim()
        ? Promise.resolve()
        : Promise.reject(new Error(t.dishNameReq)),
  };

  return (
    <Modal
      open={open}
      title={`${editing ? t.editItem : t.newItem} — ${category ? category.label : ''}`}
      okText={editing ? t.apply : t.add}
      cancelText={t.cancel}
      onOk={ok}
      onCancel={onCancel}
      destroyOnClose
      forceRender
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item name="name" label={t.dishName} dependencies={['ingredients']} rules={[nameOrDescription, { max: 100 }]}>
          <Input maxLength={100} autoFocus />
        </Form.Item>
        <Form.Item name="ingredients" label={t.ingredients} rules={[{ max: 300 }]}>
          <Input.TextArea rows={3} maxLength={300} />
        </Form.Item>
        <Form.Item name="price" label={t.price} rules={editing ? [] : [{ required: true, message: t.priceReq }]}>
          <InputNumber min={0} max={999} step={0.1} precision={2} addonAfter="€" inputMode="decimal" style={{ width: 160 }} />
        </Form.Item>
        {!editing && (
          <Form.Item name="section" label={t.subsection}>
            <Select options={sections} />
          </Form.Item>
        )}
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
  const [dialog, setDialog] = useState(null); // { ci, ii? } — ii present when editing an existing dish
  const [activeTab, setActiveTab] = useState(null);
  const newCounter = useRef(0);
  const lastDialog = useRef(null);
  const [msg, ctx] = message.useMessage();

  const load = (m) => { const k = withKeys(m); setSaved(k); setDraft(k); };

  useEffect(() => {
    fetch('/api/menu')
      .then((r) => r.json())
      .then(load)
      .catch(() => setLoadError(true));
  }, []);

  // last saved version of every item, by client id
  const savedItems = useMemo(() => {
    const map = {};
    if (saved) saved.categories.forEach((c) => c.items.forEach((it) => { map[it._k] = it; }));
    return map;
  }, [saved]);

  const itemChanged = useCallback((it) => {
    const s = savedItems[it._k];
    if (it.isNew || !s) return true;
    if (it.type === 'subheader') return it.content !== s.content;
    return it.price !== s.price || it.name !== s.name || it.ingredients !== s.ingredients;
  }, [savedItems]);

  const changes = useMemo(() => {
    if (!saved || !draft) return 0;
    let n = 0;
    draft.categories.forEach((c, ci) => {
      if (c.title !== saved.categories[ci].title) n++;
      c.items.forEach((it) => { if (itemChanged(it)) n++; });
    });
    return n;
  }, [saved, draft, itemChanged]);

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

  const submitDialog = (values) => {
    const { ci, ii } = dialog;
    if (ii !== undefined) {
      patchItem(ci, ii, {
        name: (values.name || '').trim(),
        ingredients: (values.ingredients || '').trim(),
        price: formatPrice(values.price),
      });
      setDialog(null);
      msg.success(t.edited);
      return;
    }
    update(ci, (c) => {
      let at = c.items.length; // insert at the end of the chosen sub-section
      for (let i = values.section + 1; i < c.items.length; i++) {
        if (c.items[i].type === 'subheader') { at = i; break; }
      }
      newCounter.current += 1;
      const item = {
        type: 'item',
        name: (values.name || '').trim(),
        ingredients: (values.ingredients || '').trim(),
        price: formatPrice(values.price),
        _k: `n${newCounter.current}`,
        isNew: true,
      };
      return { ...c, items: [...c.items.slice(0, at), item, ...c.items.slice(at)] };
    });
    setSearch('');
    setDialog(null);
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

  // Rows wrap: on a phone the price controls drop below the dish name instead of overflowing.
  const rowStyle = {
    padding: '10px 12px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  };

  const renderRow = (r, ci) => {
    if (r.type === 'subheader') {
      return (
        <div key={r.key} style={rowStyle}>
          <Input
            value={r.content}
            maxLength={100}
            status={r.content.trim() ? undefined : 'error'}
            onChange={(e) => patchItem(ci, r.ii, { content: e.target.value })}
            style={{ fontSize: 16, fontWeight: 600, flex: '1 1 200px', maxWidth: 360 }}
          />
          {itemChanged(r) && <Tag color="orange" style={{ margin: 0 }}>{t.changedTag}</Tag>}
        </div>
      );
    }
    const priceChanged = !r.isNew && r.price !== (savedItems[r._k] || {}).price;
    return (
      <div key={r.key} style={rowStyle}>
        <div style={{ flex: '1 1 180px', minWidth: 0, overflowWrap: 'anywhere' }}>
          <strong>{r.name || r.ingredients}</strong>
          {r.isNew && <Tag color="green" style={{ marginLeft: 8 }}>{t.newTag}</Tag>}
          {!r.isNew && itemChanged(r) && <Tag color="orange" style={{ marginLeft: 8 }}>{t.changedTag}</Tag>}
          {r.name && r.ingredients && <div style={{ color: '#888', fontSize: 12 }}>{r.ingredients}</div>}
        </div>
        <Space size={6} style={{ flex: '0 0 auto' }}>
          <InputNumber
            min={0}
            max={999}
            step={0.1}
            precision={2}
            addonAfter="€"
            inputMode="decimal"
            placeholder="—"
            status={priceChanged || r.isNew ? 'warning' : undefined}
            value={parsePrice(r.price)}
            onChange={(v) => patchItem(ci, r.ii, { price: formatPrice(v) })}
            style={{ width: 128 }}
          />
          <Button title={t.edit} aria-label={t.edit} onClick={() => setDialog({ ci, ii: r.ii })}>✎</Button>
          {r.isNew && (
            <Button danger title={t.remove} aria-label={t.remove} onClick={() => removeNew(ci, r.ii)}>×</Button>
          )}
        </Space>
      </div>
    );
  };

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <span>{t.sectionTitle}</span>
            <Input
              style={{ flex: '1 1 200px', maxWidth: 320 }}
              value={cat.title}
              maxLength={100}
              status={cat.title.trim() ? undefined : 'error'}
              onChange={(e) => update(ci, (c) => ({ ...c, title: e.target.value }))}
            />
            {cat.title !== saved.categories[ci].title && <Tag color="orange" style={{ margin: 0 }}>{t.changedTag}</Tag>}
            <Button type="primary" shape="circle" size="large" title={t.addTitle} aria-label={t.addTitle} onClick={() => setDialog({ ci })}>
              +
            </Button>
          </div>
          {q && !hasMatch ? (
            <Typography.Text type="secondary">{t.notFound}</Typography.Text>
          ) : (
            <div style={{ background: '#fff', borderRadius: 8 }}>
              {rows.map((r) => renderRow(r, ci))}
            </div>
          )}
        </div>
      ),
    };
  });

  // keep showing the last dialog's content while the modal fades out
  if (dialog) lastDialog.current = dialog;
  const shown = dialog || lastDialog.current;
  const dialogCategory = shown ? draft.categories[shown.ci] : null;
  const dialogItem = shown && shown.ii !== undefined ? dialogCategory.items[shown.ii] || null : null;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {ctx}
      <Header
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          backgroundColor: '#3c2b1a', height: 'auto', lineHeight: 'normal', padding: '10px 12px',
        }}
      >
        <Typography.Title level={4} style={{ color: '#fff', margin: 0, whiteSpace: 'nowrap' }}>
          BAR<span style={{ color: '#b58569' }}>IN</span> · Admin
        </Typography.Title>
        <Space size="middle" wrap>
          <LangSwitch />
          <a href="/" target="_blank" rel="noreferrer" style={{ color: '#fff' }}>{t.openMenu}</a>
          <Button size="small" onClick={onLogout}>{t.logout}</Button>
        </Space>
      </Header>
      <Content style={{ padding: 12, maxWidth: 800, width: '100%', margin: '0 auto', paddingBottom: 110 }}>
        <Input.Search
          allowClear
          placeholder={t.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Tabs items={tabs} activeKey={activeTab || draft.categories[0].id} onChange={setActiveTab} />
      </Content>
      <ItemModal
        open={!!dialog}
        category={dialogCategory}
        item={dialogItem}
        onCancel={() => setDialog(null)}
        onSubmit={submitDialog}
      />
      <div
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, padding: '10px 12px calc(10px + env(safe-area-inset-bottom))', background: '#fff',
          borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center', flexWrap: 'wrap',
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
