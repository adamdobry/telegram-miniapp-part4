import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('trade');
  const [currencies] = useState([
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 62000, change: '+2.5%' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3100, change: '-1.2%' },
    { id: 3, name: 'Tether', symbol: 'USDT', price: 1, change: '0.0%' },
    { id: 4, name: 'Solana', symbol: 'SOL', price: 135, change: '+3.8%' },
    { id: 5, name: 'Cardano', symbol: 'ADA', price: 0.45, change: '-0.5%' },
    { id: 6, name: 'Dogecoin', symbol: 'DOGE', price: 0.08, change: '+5.1%' },
    { id: 7, name: 'Polkadot', symbol: 'DOT', price: 7.2, change: '-2.3%' },
    { id: 8, name: 'Chainlink', symbol: 'LINK', price: 14.5, change: '+1.7%' },
    { id: 9, name: 'Litecoin', symbol: 'LTC', price: 72, change: '-0.8%' },
    { id: 10, name: 'Avalanche', symbol: 'AVAX', price: 31, change: '+4.4%' },
  ]);
  const [tradeForm, setTradeForm] = useState({
    currency: '',
    amount: '',
    type: 'buy',
    exchangeType: 'cex',
    walletOrExchange: '',
    paymentMethod: '',
    rate: '',
  });
  const [trades, setTrades] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [language, setLanguage] = useState('ru');
  const [notifications, setNotifications] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Локализация
  const translations = {
    ru: {
      title: 'Scam of Market',
      tabs: { trade: 'Торговля', portfolio: 'Портфель', history: 'История' },
      form: {
        title: 'Совершить сделку',
        currency: 'Валюта',
        amount: 'Количество',
        exchangeType: 'Тип биржи / кошелька',
        selectWallet: 'Выберите кошелёк',
        selectExchange: 'Выберите биржу',
        tradeType: 'Тип сделки',
        buy: 'Покупка',
        sell: 'Продажа',
        submit: 'Выполнить',
        paymentMethod: 'Способ оплаты',
        cash: 'Наличные',
        bankTransfer: 'Банковский перевод',
        card: 'Карта',
        rate: 'Курс (USD)',
      },
      currenciesTitle: 'Доступные валюты',
      portfolioTitle: 'Ваш портфель',
      historyTitle: 'История сделок',
      noTrades: 'Нет сделок',
      successMessage: { buy: 'Покупка', sell: 'Продажа' },
      footer: '© 2025 Scam of Market. Все права защищены.',
      closeApp: 'Закрыть',
      notification: {
        tradeSuccess: 'Сделка выполнена!',
        fieldRequired: 'Заполните все обязательные поля',
      },
    },
    en: {
      title: 'Scam of Market',
      tabs: { trade: 'Trade', portfolio: 'Portfolio', history: 'History' },
      form: {
        title: 'Make a Trade',
        currency: 'Currency',
        amount: 'Amount',
        exchangeType: 'Exchange Type / Wallet',
        selectWallet: 'Select Wallet',
        selectExchange: 'Select Exchange',
        tradeType: 'Trade Type',
        buy: 'Buy',
        sell: 'Sell',
        submit: 'Execute',
        paymentMethod: 'Payment Method',
        cash: 'Cash',
        bankTransfer: 'Bank Transfer',
        card: 'Card',
        rate: 'Rate (USD)',
      },
      currenciesTitle: 'Available Currencies',
      portfolioTitle: 'Your Portfolio',
      historyTitle: 'Trade History',
      noTrades: 'No trades yet',
      successMessage: { buy: 'Bought', sell: 'Sold' },
      footer: '© 2025 Scam of Market. All rights reserved.',
      closeApp: 'Close',
      notification: {
        tradeSuccess: 'Trade executed!',
        fieldRequired: 'Please fill all required fields',
      },
    },
    zh: {
      title: '诈骗市场',
      tabs: { trade: '交易', portfolio: '投资组合', history: '历史记录' },
      form: {
        title: '进行交易',
        currency: '货币',
        amount: '数量',
        exchangeType: '交易所类型 / 钱包',
        selectWallet: '选择钱包',
        selectExchange: '选择交易所',
        tradeType: '交易类型',
        buy: '买入',
        sell: '卖出',
        submit: '执行',
        paymentMethod: '支付方式',
        cash: '现金',
        bankTransfer: '银行转账',
        card: '银行卡',
        rate: '汇率 (美元)',
      },
      currenciesTitle: '可用货币',
      portfolioTitle: '您的投资组合',
      historyTitle: '交易历史',
      noTrades: '暂无交易',
      successMessage: { buy: '已买入', sell: '已卖出' },
      footer: '© 2025 Scam of Market. 版权所有。',
      closeApp: '关闭',
      notification: {
        tradeSuccess: '交易成功！',
        fieldRequired: '请填写所有必填字段',
      },
    },
    es: {
      title: 'Scam of Market',
      tabs: { trade: 'Negociación', portfolio: 'Cartera', history: 'Historial' },
      form: {
        title: 'Realizar una transacción',
        currency: 'Moneda',
        amount: 'Cantidad',
        exchangeType: 'Tipo de bolsa / Cartera',
        selectWallet: 'Seleccionar cartera',
        selectExchange: 'Seleccionar bolsa',
        tradeType: 'Tipo de operación',
        buy: 'Comprar',
        sell: 'Vender',
        submit: 'Ejecutar',
        paymentMethod: 'Método de pago',
        cash: 'Efectivo',
        bankTransfer: 'Transferencia bancaria',
        card: 'Tarjeta',
        rate: 'Tasa (USD)',
      },
      currenciesTitle: 'Monedas disponibles',
      portfolioTitle: 'Tu cartera',
      historyTitle: 'Historial de transacciones',
      noTrades: 'No hay transacciones',
      successMessage: { buy: 'Compra', sell: 'Venta' },
      footer: '© 2025 Scam of Market. Todos los derechos reservados.',
      closeApp: 'Cerrar',
      notification: {
        tradeSuccess: '¡Transacción realizada!',
        fieldRequired: 'Por favor complete todos los campos requeridos',
      },
    },
    de: {
      title: 'Scam of Market',
      tabs: { trade: 'Handel', portfolio: 'Portfolio', history: 'Verlauf' },
      form: {
        title: 'Handel durchführen',
        currency: 'Währung',
        amount: 'Menge',
        exchangeType: 'Börse / Wallet',
        selectWallet: 'Wallet auswählen',
        selectExchange: 'Börse auswählen',
        tradeType: 'Transaktionstyp',
        buy: 'Kauf',
        sell: 'Verkauf',
        submit: 'Ausführen',
        paymentMethod: 'Zahlungsmethode',
        cash: 'Bar',
        bankTransfer: 'Banküberweisung',
        card: 'Karte',
        rate: 'Kurs (USD)',
      },
      currenciesTitle: 'Verfügbare Währungen',
      portfolioTitle: 'Ihr Portfolio',
      historyTitle: 'Transaktionsverlauf',
      noTrades: 'Keine Transaktionen',
      successMessage: { buy: 'Kauf', sell: 'Verkauf' },
      footer: '© 2025 Scam of Market. Alle Rechte vorbehalten.',
      closeApp: 'Schließen',
      notification: {
        tradeSuccess: 'Transaktion ausgeführt!',
        fieldRequired: 'Bitte füllen Sie alle erforderlichen Felder aus',
      },
    },
    ar: {
      title: 'Scam of Market',
      tabs: { trade: 'التداول', portfolio: 'المحفظة', history: 'التاريخ' },
      form: {
        title: 'إجراء صفقة',
        currency: 'العملة',
        amount: 'الكمية',
        exchangeType: 'نوع البورصة / المحفظة',
        selectWallet: 'اختر المحفظة',
        selectExchange: 'اختر البورصة',
        tradeType: 'نوع الصفقة',
        buy: 'شراء',
        sell: 'بيع',
        submit: 'تنفيذ',
        paymentMethod: 'طريقة الدفع',
        cash: 'نقدي',
        bankTransfer: 'تحويل بنكي',
        card: 'بطاقة',
        rate: 'السعر (دولار أمريكي)',
      },
      currenciesTitle: 'العملات المتاحة',
      portfolioTitle: 'محفظتك',
      historyTitle: 'سجل الصفقات',
      noTrades: 'لا توجد صفقات',
      successMessage: { buy: 'تم الشراء', sell: 'تم البيع' },
      footer: '© 2025 Scam of Market. جميع الحقوق محفوظة.',
      closeApp: 'إغلاق',
      notification: {
        tradeSuccess: 'تم تنفيذ الصفقة!',
        fieldRequired: 'يرجى ملء جميع الحقول المطلوبة',
      },
    },
    ja: {
      title: 'Scam of Market',
      tabs: { trade: '取引', portfolio: 'ポートフォリオ', history: '履歴' },
      form: {
        title: '取引を実行',
        currency: '通貨',
        amount: '数量',
        exchangeType: '取引所 / ウォレット',
        selectWallet: 'ウォレットを選択',
        selectExchange: '取引所を選択',
        tradeType: '取引タイプ',
        buy: '購入',
        sell: '売却',
        submit: '実行',
        paymentMethod: '支払い方法',
        cash: '現金',
        bankTransfer: '銀行振込',
        card: 'カード',
        rate: 'レート (USD)',
      },
      currenciesTitle: '利用可能な通貨',
      portfolioTitle: 'あなたのポートフォリオ',
      historyTitle: '取引履歴',
      noTrades: '取引がありません',
      successMessage: { buy: '購入', sell: '売却' },
      footer: '© 2025 Scam of Market. 全著作権所有。',
      closeApp: '閉じる',
      notification: {
        tradeSuccess: '取引を実行しました！',
        fieldRequired: 'すべての必須フィールドを入力してください',
      },
    },
  };
  const t = translations[language];

  // Telegram WebApp SDK
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      try {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        tg.BackButton.show();
        const onBackClick = () => tg.close();
        tg.BackButton.onClick(onBackClick);
        return () => {
          tg.BackButton.offClick(onBackClick);
        };
      } catch (err) {
        console.error("Telegram SDK error:", err);
      }
    }
  }, []);

  // Уведомления
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTradeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTrade = (e) => {
    e.preventDefault();
    if (!tradeForm.currency || !tradeForm.amount || !tradeForm.walletOrExchange || !tradeForm.paymentMethod) {
      addNotification(t.notification.fieldRequired, 'error');
      return;
    }
    const selectedCurrencyData = currencies.find(c => c.symbol === tradeForm.currency);
    const rate = tradeForm.rate ? parseFloat(tradeForm.rate) : selectedCurrencyData.price;
    const total = (tradeForm.amount * rate).toFixed(2);
    const newTrade = {
      id: Date.now(),
      type: tradeForm.type,
      currency: tradeForm.currency,
      amount: tradeForm.amount,
      total,
      exchangeType: tradeForm.exchangeType,
      walletOrExchange: tradeForm.walletOrExchange,
      paymentMethod: tradeForm.paymentMethod,
      rate,
      timestamp: new Date().toLocaleString(language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setTrades(prev => [newTrade, ...prev]);
    addNotification(t.notification.tradeSuccess, 'success');
    setTradeForm({
      currency: '',
      amount: '',
      type: 'buy',
      exchangeType: 'cex',
      walletOrExchange: '',
      paymentMethod: '',
      rate: '',
    });
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify(newTrade));
    }
  };

  const handleCurrencyClick = (currency) => {
    setTradeForm(prev => ({
      ...prev,
      currency: currency.symbol,
    }));
    setSelectedCurrency(currency.id);
  };

  // Язык
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    } else {
      const userLang = navigator.language.split('-')[0];
      if (translations[userLang]) {
        setLanguage(userLang);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Защита от рендера до загрузки
  if (!isLoaded) {
    return <div className="bg-white text-center p-4 font-medium">Loading...</div>;
  }

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-white"
    >
      {/* Уведомления */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm max-w-xs ${
              notif.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notif.message}
          </div>
        ))}
      </div>

      {/* Заголовок */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div 
            className="w-12 h-12 rounded-full bg-[#8B4513] text-white flex items-center justify-center font-bold"
            style={{ backgroundColor: '#8B4513' }}
          >
            SM
          </div>
          <h1 
            className="text-xl font-bold text-[#8B4513]"
            style={{ color: '#8B4513' }}
          >
            {t.title}
          </h1>
        </div>
        <div className="flex space-x-1 bg-gray-100 rounded-full p-1 text-xs sm:text-sm">
          {Object.keys(translations).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                backgroundColor: language === lang ? '#8B4513' : 'white',
                color: language === lang ? 'white' : '#8B4513',
                borderColor: language === lang ? '#8B4513' : '#d1d5db',
              }}
              className="px-3 py-1 rounded-full transition whitespace-nowrap hover:bg-gray-200"
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* Навигация */}
      <nav className="flex justify-around bg-white border-b border-gray-200 sticky top-0 z-10">
        {['trade', 'portfolio', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              color: activeTab === tab ? '#8B4513' : '#4B5563',
              borderBottom: activeTab === tab ? '2px solid #8B4513' : 'none',
            }}
            className="py-3 font-medium text-sm sm:text-base w-1/3 text-center"
          >
            {t.tabs[tab]}
          </button>
        ))}
      </nav>

      {/* Основной контент */}
      <main className="p-4 pb-20">
        {activeTab === 'trade' && (
          <div className="space-y-4">
            {/* Список валют */}
            <div className="space-y-3">
              {currencies.map((currency) => (
                <div
                  key={currency.id}
                  onClick={() => handleCurrencyClick(currency)}
                  style={{
                    backgroundColor: selectedCurrency === currency.id ? '#FEF3C7' : 'white',
                    borderColor: selectedCurrency === currency.id ? '#8B4513' : '#D1D5DB',
                    boxShadow: selectedCurrency === currency.id ? '0 0 0 2px #8B4513' : 'none',
                  }}
                  className="p-4 border rounded-lg cursor-pointer transition-all hover:bg-amber-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{currency.name}</h3>
                      <p className="text-sm text-gray-500">{currency.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${currency.price.toLocaleString()}</p>
                      <p className={`text-sm ${currency.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {currency.change}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Форма торговли */}
            <form onSubmit={handleTrade} className="bg-white p-4 rounded-lg shadow-md space-y-4">
              <h3 className="font-medium text-lg">{t.form.title}</h3>
              <select
                name="currency"
                value={tradeForm.currency}
                onChange={handleInputChange}
                style={{
                  borderColor: '#D1D5DB',
                  backgroundColor: 'white',
                }}
                className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                required
              >
                <option value="">{t.form.currency}</option>
                {currencies.map((c) => (
                  <option key={c.id} value={c.symbol}>
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="amount"
                value={tradeForm.amount}
                onChange={handleInputChange}
                placeholder={t.form.amount}
                step="0.000001"
                min="0"
                style={{
                  borderColor: '#D1D5DB',
                  backgroundColor: 'white',
                }}
                className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                required
              />

              {/* Кнопки CEX / DEX */}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setTradeForm(prev => ({ ...prev, exchangeType: 'cex' }))}
                  style={{
                    backgroundColor: tradeForm.exchangeType === 'cex' ? '#8B4513' : 'white',
                    color: tradeForm.exchangeType === 'cex' ? 'white' : '#8B4513',
                    borderColor: tradeForm.exchangeType === 'cex' ? '#8B4513' : '#D1D5DB',
                  }}
                  className="flex-1 p-2 rounded-md border transition-colors duration-200 hover:border-[#8B4513] hover:bg-amber-50"
                >
                  CEX
                </button>
                <button
                  type="button"
                  onClick={() => setTradeForm(prev => ({ ...prev, exchangeType: 'dex' }))}
                  style={{
                    backgroundColor: tradeForm.exchangeType === 'dex' ? '#8B4513' : 'white',
                    color: tradeForm.exchangeType === 'dex' ? 'white' : '#8B4513',
                    borderColor: tradeForm.exchangeType === 'dex' ? '#8B4513' : '#D1D5DB',
                  }}
                  className="flex-1 p-2 rounded-md border transition-colors duration-200 hover:border-[#8B4513] hover:bg-amber-50"
                >
                  DEX
                </button>
              </div>

              {/* Кошелек / Биржа */}
              {tradeForm.exchangeType === 'cex' ? (
                <select
                  name="walletOrExchange"
                  value={tradeForm.walletOrExchange}
                  onChange={handleInputChange}
                  style={{
                    borderColor: '#D1D5DB',
                    backgroundColor: 'white',
                  }}
                  className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                  required
                >
                  <option value="">{t.form.selectWallet}</option>
                  <option value="MetaMask">MetaMask</option>
                  <option value="Phantom">Phantom</option>
                  <option value="Trust Wallet">Trust Wallet</option>
                  <option value="Coinbase Wallet">Coinbase Wallet</option>
                  <option value="Exodus">Exodus</option>
                </select>
              ) : (
                <select
                  name="walletOrExchange"
                  value={tradeForm.walletOrExchange}
                  onChange={handleInputChange}
                  style={{
                    borderColor: '#D1D5DB',
                    backgroundColor: 'white',
                  }}
                  className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                  required
                >
                  <option value="">{t.form.selectExchange}</option>
                  <option value="Binance">Binance</option>
                  <option value="Bybit">Bybit</option>
                  <option value="BingX">BingX</option>
                  <option value="MEXC">MEXC</option>
                  <option value="KuCoin">KuCoin</option>
                  <option value="Gate.io">Gate.io</option>
                </select>
              )}

              {/* Способ оплаты */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { value: 'cash', label: t.form.cash },
                  { value: 'bankTransfer', label: t.form.bankTransfer },
                  { value: 'card', label: t.form.card },
                ].map(method => (
                  <label
                    key={method.value}
                    style={{
                      backgroundColor: tradeForm.paymentMethod === method.value ? '#8B4513' : 'white',
                      color: tradeForm.paymentMethod === method.value ? 'white' : '#8B4513',
                      borderColor: tradeForm.paymentMethod === method.value ? '#8B4513' : '#D1D5DB',
                    }}
                    className="p-2 border rounded-md text-center text-sm cursor-pointer transition hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={tradeForm.paymentMethod === method.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    {method.label}
                  </label>
                ))}
              </div>

              {/* Курс */}
              <input
                type="number"
                name="rate"
                value={tradeForm.rate}
                onChange={handleInputChange}
                placeholder={t.form.rate}
                step="0.01"
                min="0"
                style={{
                  borderColor: '#D1D5DB',
                  backgroundColor: 'white',
                }}
                className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
              />

              {/* Тип сделки */}
              <div className="flex justify-around space-x-2">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="buy"
                    checked={tradeForm.type === 'buy'}
                    onChange={handleInputChange}
                    style={{ accentColor: '#8B4513' }}
                    className="w-4 h-4"
                  />
                  <span>{t.form.buy}</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="sell"
                    checked={tradeForm.type === 'sell'}
                    onChange={handleInputChange}
                    style={{ accentColor: '#8B4513' }}
                    className="w-4 h-4"
                  />
                  <span>{t.form.sell}</span>
                </label>
              </div>

              {/* Кнопка отправки */}
              <button
                type="submit"
                style={{ backgroundColor: '#8B4513' }}
                className="w-full text-white py-3 px-4 rounded-md mt-2 text-sm font-medium hover:bg-[#703A0F] transition"
              >
                {t.form.submit}
              </button>
            </form>
          </div>
        )}

        {/* Портфель */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">{t.portfolioTitle}</h2>
            {currencies.slice(0, 5).map((currency) => (
              <div key={currency.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{currency.name} ({currency.symbol})</h3>
                    <p className="text-sm text-gray-500">У вас: {(Math.random() * 5).toFixed(4)} {currency.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(Math.random() * 10000).toFixed(2)}</p>
                    <p className={`text-sm ${currency.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {currency.change}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* История сделок */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">{t.historyTitle}</h2>
            {trades.length === 0 ? (
              <p className="text-center py-6 text-gray-400">{t.noTrades}</p>
            ) : (
              trades.map((trade) => (
                <div key={trade.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <div className="flex justify-between">
                    <p className="font-medium">
                      {t.successMessage[trade.type]} {trade.amount} {trade.currency}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      trade.type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {trade.type === 'buy' ? t.form.buy : t.form.sell}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    через {trade.walletOrExchange}, способ: {trade.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-500">{trade.timestamp}</p>
                  <p className="font-semibold mt-1">${trade.total}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Подвал */}
      <footer className="mt-auto bg-white border-t border-gray-200 p-4 fixed bottom-0 left-0 right-0">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">{t.footer}</p>
          {window.Telegram?.WebApp && (
            <button
              onClick={() => window.Telegram.WebApp.close()}
              style={{ backgroundColor: '#8B4513' }}
              className="text-sm text-white px-4 py-2 rounded-md hover:bg-[#703A0F] transition"
            >
              {t.closeApp}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;