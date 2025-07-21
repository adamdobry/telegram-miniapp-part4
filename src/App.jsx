import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('trade');
  const [currencies] = useState([
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 62000, change: '+2.5%' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3100, change: '-1.2%' },
    { id: 3, name: 'Tether', symbol: 'USDT', price: 1, change: '0.0%' },
    { id: 4, name: 'Solana', symbol: 'SOL', price: 135, change: '+3.8%' },
    { id: 5, name: 'Cardano', symbol: 'ADA', price: 0.45, change: '-0.5%' },
  ]);
  const [tradeForm, setTradeForm] = useState({
    currency: '',
    amount: '',
    type: 'buy',
    exchangeType: 'cex',
    walletOrExchange: '',
  });
  const [trades, setTrades] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [language, setLanguage] = useState('ru');

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
      },
      currenciesTitle: 'Доступные валюты',
      portfolioTitle: 'Ваш портфель',
      historyTitle: 'История сделок',
      noTrades: 'Нет сделок',
      successMessage: { buy: 'Покупка', sell: 'Продажа' },
      footer: '© 2025 Scam of Market. Все права защищены.',
      closeApp: 'Закрыть',
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
      },
      currenciesTitle: 'Available Currencies',
      portfolioTitle: 'Your Portfolio',
      historyTitle: 'Trade History',
      noTrades: 'No trades yet',
      successMessage: { buy: 'Bought', sell: 'Sold' },
      footer: '© 2025 Scam of Market. All rights reserved.',
      closeApp: 'Close',
    },
    // Другие языки...
  };
  const t = translations[language];

  // Telegram WebApp
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;

      tg.ready(); // Готовность WebApp

      // Кнопка "Закрыть" в Telegram
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        tg.close();
      });

      // Если нужно отправлять данные обратно в Telegram
      window.closeWebApp = () => {
        tg.close();
      };
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTradeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTrade = (e) => {
    e.preventDefault();
    if (!tradeForm.currency || !tradeForm.amount || !tradeForm.walletOrExchange) return;

    const newTrade = {
      id: Date.now(),
      type: tradeForm.type,
      currency: tradeForm.currency,
      amount: tradeForm.amount,
      total: (
        tradeForm.amount *
        currencies.find((c) => c.symbol === tradeForm.currency)?.price
      ).toFixed(2),
      exchangeType: tradeForm.exchangeType,
      walletOrExchange: tradeForm.walletOrExchange,
      timestamp: new Date().toLocaleString(),
    };

    setTrades((prev) => [newTrade, ...prev]);

    alert(`${t.successMessage[tradeForm.type]} ${tradeForm.amount} ${tradeForm.currency} через ${tradeForm.walletOrExchange} выполнена!`);

    setTradeForm({
      currency: '',
      amount: '',
      type: 'buy',
      exchangeType: 'cex',
      walletOrExchange: '',
    });

    // Пример отправки данных в Telegram
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.sendData(JSON.stringify(newTrade)); // Отправка данных в Telegram
    }
  };

  const handleCurrencyClick = (currency) => {
    setTradeForm((prev) => ({
      ...prev,
      currency: currency.symbol,
    }));
    setSelectedCurrency(currency.id);
  };

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
    const savedLang = localStorage.getItem('language');
    if (savedLang && Object.keys(translations).includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-white transition-opacity duration-1000 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Заголовок */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Логотип */}
          <div className="flex items-center space-x-2">
            <div className="w-16 h-16 rounded-full bg-[#D2691E] text-white flex items-center justify-center font-bold">SM</div>
            <h1 className="text-2xl font-bold text-[#D2691E] tracking-tight">{t.title}</h1>
          </div>
          <div className="flex space-x-2 rounded-full overflow-hidden">
            <button onClick={() => setActiveTab('trade')} className={`px-5 py-2 font-medium transition-all ${activeTab === 'trade' ? 'bg-[#D2691E] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{t.tabs.trade}</button>
            <button onClick={() => setActiveTab('portfolio')} className={`px-5 py-2 font-medium transition-all ${activeTab === 'portfolio' ? 'bg-[#D2691E] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{t.tabs.portfolio}</button>
            <button onClick={() => setActiveTab('history')} className={`px-5 py-2 font-medium transition-all ${activeTab === 'history' ? 'bg-[#D2691E] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{t.tabs.history}</button>
            {/* Кнопка смены языка */}
            <div className="flex space-x-1 bg-gray-100 rounded-full p-1 text-sm">
              {Object.keys(translations).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-full transition ${language === lang ? 'bg-[#D2691E] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Основное содержимое */}
      <main className="container mx-auto px-4 py-8">
        {/* Основной контент (ваша логика) */}
        {activeTab === 'trade' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Список валют */}
            <div className="lg:col-span-2 bg-gray-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">{t.currenciesTitle}</h2>
              <div className="space-y-3">
                {currencies.map((currency) => (
                  <div
                    key={currency.id}
                    className={`flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 cursor-pointer transition-all transform hover:scale-105 hover:shadow-md ${
                      selectedCurrency === currency.id ? 'ring-2 ring-[#D2691E]' : ''
                    }`}
                    onClick={() => handleCurrencyClick(currency)}
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">{currency.name}</h3>
                      <p className="text-sm text-gray-500">{currency.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${currency.price.toLocaleString()}</p>
                      <p className={`text-sm ${currency.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {currency.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Форма торговли */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">{t.form.title}</h2>
              <form onSubmit={handleTrade} className="space-y-5">
                {/* Форма как в оригинале */}
                <button type="submit" className="w-full bg-[#D2691E] text-white py-3 px-4 rounded-md hover:bg-[#b85a1a] transition transform hover:scale-105">
                  {t.form.submit}
                </button>
              </form>
            </div>
          </div>
        )}
        {/* Другие вкладки */}
      </main>

      {/* Подвал с кнопкой закрытия (только для Telegram WebApp) */}
      <footer className="bg-white shadow-inner mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>{t.footer}</p>
          {window.Telegram && window.Telegram.WebApp && (
            <button
              onClick={() => window.Telegram.WebApp.close()}
              className="mt-2 px-4 py-2 bg-[#D2691E] text-white rounded hover:bg-[#b85a1a] transition"
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