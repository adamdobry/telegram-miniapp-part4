import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const App = () => {

      try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/balance`);
      return await response.json();
    } catch (error) {
      console.error('API getBalance error:', error);
      throw error;
    }
  },
  buyCrypto: async (userId, symbol, amount) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, amount }),
      });
      return await response.json();
    } catch (error) {
      console.error('API buyCrypto error:', error);
      throw error;
    }
  },
  sellCrypto: async (userId, symbol, amount) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/sell`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, amount }),
      });
      return await response.json();
    } catch (error) {
      console.error('API sellCrypto error:', error);
      throw error;
    };
  const [activeTab, setActiveTab] = useState('trade');
  const [currencies, setCurrencies] = useState([
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
    { id: 11, name: 'Binance Coin', symbol: 'BNB', price: 580, change: '+2.1%' },
    { id: 12, name: 'Ripple', symbol: 'XRP', price: 0.55, change: '-1.3%' },
    { id: 13, name: 'Polygon', symbol: 'MATIC', price: 0.85, change: '+4.2%' },
    { id: 14, name: 'Shiba Inu', symbol: 'SHIB', price: 0.00002, change: '+8.7%' },
    { id: 15, name: 'Uniswap', symbol: 'UNI', price: 7.8, change: '+3.9%' },
  ]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [tradeForm, setTradeForm] = useState({
    currency: '',
    amount: '',
    type: 'buy',
    exchangeType: 'cex',
    walletOrExchange: '',
    paymentMethod: '',
    rate: '',
    orderType: 'market',
    takeProfit: '',
    stopLoss: '',
    tpEnabled: false,
    slEnabled: false,
  });
  const [trades, setTrades] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [language, setLanguage] = useState('ru');
  const [notifications, setNotifications] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('list');
  const [isFetching, setIsFetching] = useState(false);
  const fetchInterval = useRef(null);
  
  // Константа комиссии платформы (0.5%)
  const PLATFORM_FEE_PERCENTAGE = 0.005;
  
  // Функция для расчета комиссии платформы
  const calculatePlatformFee = (amount) => {
    return amount * PLATFORM_FEE_PERCENTAGE;
  };
  
  // Новые состояния для раздела "Кошелёк"
  const [walletForm, setWalletForm] = useState({
    receive: { currency: '' },
    send: {
      currency: '',
      recipientAddress: '',
      network: '',
      amount: '',
    }
  });
  const [userBalances, setUserBalances] = useState({});
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const receiveAddressRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Сети для каждой криптовалюты (исправлено: UNI теперь массив)
  const currencyNetworks = {
    BTC: ['Bitcoin'],
    ETH: ['Ethereum'],
    USDT: ['Ethereum', 'Tron', 'Solana', 'Binance Smart Chain'],
    SOL: ['Solana'],
    ADA: ['Cardano'],
    DOGE: ['Dogecoin'],
    DOT: ['Polkadot'],
    LINK: ['Ethereum'],
    LTC: ['Litecoin'],
    AVAX: ['Avalanche'],
    BNB: ['Binance Smart Chain', 'Binance Chain'],
    XRP: ['XRP Ledger'],
    MATIC: ['Polygon'],
    SHIB: ['Ethereum'],
    UNI: ['Ethereum'], // Исправлено
  };
  
  // Фиктивные адреса для каждой криптовалюты
  const fakeAddresses = {
    BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ETH: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
    USDT: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
    SOL: '5k7oLqK9JQjZ2W9VZ1dD7H5Q2X3Y4Z5A6B7C8D9E0F',
    ADA: 'DdzFFzCqrhsuZ7Qqg2d5q6r7s8t9u0v1w2x3y4z5A6B7C8D9E0F1G2H3J4K5L6M7N8P9Q',
    DOGE: 'DM6c7n49qXq9y9L6n5m4k3j2h1g0f9e8d7c6b5a4',
    DOT: '12oF65b9Xq9y9L6n5m4k3j2h1g0f9e8d7c6b5a4F',
    LINK: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
    LTC: 'LQ1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wL',
    AVAX: 'X-avax1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    BNB: 'bnb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wl',
    XRP: 'rP5qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    MATIC: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
    SHIB: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
    UNI: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
  };
  
  // Локализация (исправлены дубликаты wallet)
  const translations = {
    ru: {
      title: 'Scam of Market',
      tabs: { trade: 'Торговля', portfolio: 'Портфель', history: 'История', wallet: 'Кошелёк' },
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
        rate: 'Курс (USDT)',
        orderType: 'Тип ордера',
        market: 'Рыночный',
        limit: 'Лимитный',
        takeProfit: 'Take Profit',
        stopLoss: 'Stop Loss',
        search: 'Поиск валюты...',
        view: 'Вид',
        chart: 'График',
        list: 'Список',
        openTradingView: 'Открыть TradingView',
      },
      wallet: {
        title: 'Управление кошельком',
        receive: {
          title: 'Получить криптовалюту',
          subtitle: 'Выберите валюту и скопируйте адрес для получения средств',
          currency: 'Валюта',
          address: 'Адрес',
          copy: 'Скопировать адрес',
          copied: 'Скопировано!',
          qrTitle: 'QR-код для получения',
          qrInstructions: 'Отсканируйте этот QR-код для отправки средств',
        },
        send: {
          title: 'Отправить криптовалюту',
          currency: 'Валюта',
          recipient: 'Адрес получателя',
          network: 'Сеть',
          amount: 'Количество',
          fee: 'Комиссия',
          total: 'Итого',
          send: 'Отправить',
          placeholder: 'Введите адрес получателя',
          selectNetwork: 'Выберите сеть',
          insufficientBalance: 'Недостаточно средств',
          success: 'Криптовалюта успешно отправлена!',
          fieldRequired: 'Заполните все обязательные поля',
          invalidAddress: 'Некорректный адрес получателя',
          validAddress: 'Адрес выглядит корректно',
          max: 'Макс.',
          confirmTitle: 'Подтвердите транзакцию',
          confirmText: 'Вы уверены, что хотите отправить',
          confirmTo: 'на адрес',
          confirmNetwork: 'в сети',
          confirmFee: 'Комиссия:',
          confirmTotal: 'Итого:',
          confirmButton: 'Подтвердить',
          cancelButton: 'Отмена',
          platformFee: 'Комиссия платформы:',
          networkFee: 'Сетевая комиссия:',
        }
      },
      currenciesTitle: 'Доступные валюты',
      portfolioTitle: 'Ваш порфель',
      historyTitle: 'История сделок',
      noTrades: 'Нет сделок',
      successMessage: { buy: 'Покупка', sell: 'Продажа' },
      footer: '© 2025 Scam of Market. Все права защищены.',
      closeApp: 'Закрыть',
      notification: {
        tradeSuccess: 'Сделка выполнена!',
        fieldRequired: 'Заполните все обязательные поля',
        fetchingError: 'Ошибка при обновлении цен',
        searchError: 'Ошибка при поиске криптовалют',
        addingCurrency: 'Добавление криптовалюты...',
      },
      noResults: 'Нет совпадений',
      platformFee: 'Комиссия платформы',
      // Новые переводы для истории
      history: {
        sortBy: 'Сортировать по',
        filterBy: 'Фильтровать по',
        type: 'Тип',
        currency: 'Валюта',
        amount: 'Количество',
        total: 'Сумма',
        date: 'Дата',
        all: 'Все',
        buy: 'Покупка',
        sell: 'Продажа',
        ascending: 'по возрастанию',
        descending: 'по убыванию',
        fromDate: 'От даты',
        toDate: 'До даты',
        applyFilters: 'Применить фильтры',
        resetFilters: 'Сбросить',
        statistics: 'Статистика',
        totalTrades: 'Всего сделок',
        totalBuys: 'Покупок',
        totalSells: 'Продаж',
        totalBuyAmount: 'Сумма покупок',
        totalSellAmount: 'Сумма продаж',
        netProfit: 'Чистая прибыль',
        tradeDistribution: 'Распределение сделок',
      }
    },
    en: {
      title: 'Scam of Market',
      tabs: { trade: 'Trade', portfolio: 'Portfolio', history: 'History', wallet: 'Wallet' },
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
        rate: 'Rate (USDT)',
        orderType: 'Order Type',
        market: 'Market',
        limit: 'Limit',
        takeProfit: 'Take Profit',
        stopLoss: 'Stop Loss',
        search: 'Search currency...',
        view: 'View',
        chart: 'Chart',
        list: 'List',
        openTradingView: 'Open TradingView',
      },
      wallet: {
        title: 'Wallet Management',
        receive: {
          title: 'Receive Cryptocurrency',
          subtitle: 'Select currency and copy address to receive funds',
          currency: 'Currency',
          address: 'Address',
          copy: 'Copy Address',
          copied: 'Copied!',
          qrTitle: 'QR Code for Receiving',
          qrInstructions: 'Scan this QR code to send funds',
        },
        send: {
          title: 'Send Cryptocurrency',
          currency: 'Currency',
          recipient: 'Recipient Address',
          network: 'Network',
          amount: 'Amount',
          fee: 'Fee',
          total: 'Total',
          send: 'Send',
          placeholder: 'Enter recipient address',
          selectNetwork: 'Select network',
          insufficientBalance: 'Insufficient balance',
          success: 'Cryptocurrency sent successfully!',
          fieldRequired: 'Please fill all required fields',
          invalidAddress: 'Invalid recipient address',
          validAddress: 'Address appears to be valid',
          max: 'Max',
          confirmTitle: 'Confirm Transaction',
          confirmText: 'Are you sure you want to send',
          confirmTo: 'to address',
          confirmNetwork: 'on network',
          confirmFee: 'Fee:',
          confirmTotal: 'Total:',
          confirmButton: 'Confirm',
          cancelButton: 'Cancel',
          platformFee: 'Platform fee:',
          networkFee: 'Network fee:',
        }
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
        fetchingError: 'Error fetching prices',
        searchError: 'Error searching cryptocurrencies',
        addingCurrency: 'Adding cryptocurrency...',
      },
      noResults: 'No results found',
      platformFee: 'Platform fee',
      // New translations for history
      history: {
        sortBy: 'Sort by',
        filterBy: 'Filter by',
        type: 'Type',
        currency: 'Currency',
        amount: 'Amount',
        total: 'Total',
        date: 'Date',
        all: 'All',
        buy: 'Buy',
        sell: 'Sell',
        ascending: 'ascending',
        descending: 'descending',
        fromDate: 'From date',
        toDate: 'To date',
        applyFilters: 'Apply filters',
        resetFilters: 'Reset',
        statistics: 'Statistics',
        totalTrades: 'Total trades',
        totalBuys: 'Buys',
        totalSells: 'Sells',
        totalBuyAmount: 'Buy amount',
        totalSellAmount: 'Sell amount',
        netProfit: 'Net profit',
        tradeDistribution: 'Trade distribution',
      }
    },
    zh: {
      title: '诈骗市场',
      tabs: { trade: '交易', portfolio: '投资组合', history: '历史记录', wallet: '钱包' },
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
        rate: '汇率 (USDT)',
        orderType: '订单类型',
        market: '市价',
        limit: '限价',
        takeProfit: '止盈',
        stopLoss: '止损',
        search: '搜索货币...',
        view: '视图',
        chart: '图表',
        list: '列表',
        openTradingView: '打开TradingView',
      },
      wallet: {
        title: '钱包管理',
        receive: {
          title: '接收加密货币',
          subtitle: '选择货币并复制地址以接收资金',
          currency: '货币',
          address: '地址',
          copy: '复制地址',
          copied: '已复制！',
          qrTitle: '收款二维码',
          qrInstructions: '扫描此二维码以发送资金',
        },
        send: {
          title: '发送加密货币',
          currency: '货币',
          recipient: '收款地址',
          network: '网络',
          amount: '数量',
          fee: '手续费',
          total: '总计',
          send: '发送',
          placeholder: '输入收款地址',
          selectNetwork: '选择网络',
          insufficientBalance: '余额不足',
          success: '加密货币发送成功！',
          fieldRequired: '请填写所有必填字段',
          invalidAddress: '收款地址无效',
          validAddress: '地址看起来有效',
          max: '最大',
          confirmTitle: '确认交易',
          confirmText: '您确定要发送',
          confirmTo: '到地址',
          confirmNetwork: '在',
          confirmFee: '手续费：',
          confirmTotal: '总计：',
          confirmButton: '确认',
          cancelButton: '取消',
          platformFee: '平台费用：',
          networkFee: '网络费用：',
        }
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
        fetchingError: '获取价格时出错',
        searchError: '搜索加密货币时出错',
        addingCurrency: '添加加密货币...',
      },
      noResults: '没有找到结果',
      platformFee: '平台费用',
      // New translations for history
      history: {
        sortBy: '排序方式',
        filterBy: '筛选条件',
        type: '类型',
        currency: '货币',
        amount: '数量',
        total: '总额',
        date: '日期',
        all: '全部',
        buy: '买入',
        sell: '卖出',
        ascending: '升序',
        descending: '降序',
        fromDate: '起始日期',
        toDate: '截止日期',
        applyFilters: '应用筛选',
        resetFilters: '重置',
        statistics: '统计信息',
        totalTrades: '总交易数',
        totalBuys: '买入次数',
        totalSells: '卖出次数',
        totalBuyAmount: '买入总额',
        totalSellAmount: '卖出总额',
        netProfit: '净收益',
        tradeDistribution: '交易分布',
      }
    },
    es: {
      title: 'Scam of Market',
      tabs: { trade: 'Negociación', portfolio: 'Cartera', history: 'Historial', wallet: 'Billetera' },
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
        rate: 'Tasa (USDT)',
        orderType: 'Tipo de orden',
        market: 'Mercado',
        limit: 'Límite',
        takeProfit: 'Take Profit',
        stopLoss: 'Stop Loss',
        search: 'Buscar moneda...',
        view: 'Vista',
        chart: 'Gráfico',
        list: 'Lista',
        openTradingView: 'Abrir TradingView',
      },
      wallet: {
        title: 'Gestión de Cartera',
        receive: {
          title: 'Recibir criptomoneda',
          subtitle: 'Seleccione moneda y copie la dirección para recibir fondos',
          currency: 'Moneda',
          address: 'Dirección',
          copy: 'Copiar dirección',
          copied: '¡Copiado!',
          qrTitle: 'Código QR para recibir',
          qrInstructions: 'Escanee este código QR para enviar fondos',
        },
        send: {
          title: 'Enviar criptomoneda',
          currency: 'Moneda',
          recipient: 'Dirección del destinatario',
          network: 'Red',
          amount: 'Cantidad',
          fee: 'Tarifa',
          total: 'Total',
          send: 'Enviar',
          placeholder: 'Ingrese la dirección del destinatario',
          selectNetwork: 'Seleccione red',
          insufficientBalance: 'Saldo insuficiente',
          success: '¡Criptomoneda enviada con éxito！',
          fieldRequired: 'Por favor complete todos los campos requeridos',
          invalidAddress: 'Dirección del destinatario inválida',
          validAddress: 'La dirección parece ser válida',
          max: 'Máx',
          confirmTitle: 'Confirmar transacción',
          confirmText: '¿Está seguro de que desea enviar',
          confirmTo: 'a la dirección',
          confirmNetwork: 'en la red',
          confirmFee: 'Tarifa:',
          confirmTotal: 'Total:',
          confirmButton: 'Confirmar',
          cancelButton: 'Cancelar',
          platformFee: 'Tarifa de plataforma:',
          networkFee: 'Tarifa de red:',
        }
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
        fetchingError: 'Error al obtener precios',
        searchError: 'Error al buscar criptomonedas',
        addingCurrency: 'Agregando criptomoneda...',
      },
      noResults: 'No se encontraron resultados',
      platformFee: 'Tarifa de plataforma',
      // New translations for history
      history: {
        sortBy: 'Ordenar por',
        filterBy: 'Filtrar por',
        type: 'Tipo',
        currency: 'Moneda',
        amount: 'Cantidad',
        total: 'Total',
        date: 'Fecha',
        all: 'Todo',
        buy: 'Compra',
        sell: 'Venta',
        ascending: 'ascendente',
        descending: 'descendente',
        fromDate: 'Desde fecha',
        toDate: 'Hasta fecha',
        applyFilters: 'Aplicar filtros',
        resetFilters: 'Restablecer',
        statistics: 'Estadísticas',
        totalTrades: 'Total de transacciones',
        totalBuys: 'Compras',
        totalSells: 'Ventas',
        totalBuyAmount: 'Monto de compras',
        totalSellAmount: 'Monto de ventas',
        netProfit: 'Beneficio neto',
        tradeDistribution: 'Distribución de transacciones',
      }
    },
    de: {
      title: 'Scam of Market',
      tabs: { trade: 'Handel', portfolio: 'Portfolio', history: 'Verlauf', wallet: 'Geldbörse' },
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
        rate: 'Kurs (USDT)',
        orderType: 'Ordertyp',
        market: 'Markt',
        limit: 'Limit',
        takeProfit: 'Take Profit',
        stopLoss: 'Stop Loss',
        search: 'Währung suchen...',
        view: 'Ansicht',
        chart: 'Diagramm',
        list: 'Liste',
        openTradingView: 'TradingView öffnen',
      },
      wallet: {
        title: 'Wallet-Verwaltung',
        receive: {
          title: 'Kryptowährung empfangen',
          subtitle: 'Wählen Sie eine Währung aus und kopieren Sie die Adresse, um Gelder zu erhalten',
          currency: 'Währung',
          address: 'Adresse',
          copy: 'Adresse kopieren',
          copied: 'Kopiert!',
          qrTitle: 'QR-Code zum Empfangen',
          qrInstructions: 'Scannen Sie diesen QR-Code, um Gelder zu senden',
        },
        send: {
          title: 'Kryptowährung senden',
          currency: 'Währung',
          recipient: 'Empfängeradresse',
          network: 'Netzwerk',
          amount: 'Menge',
          fee: 'Gebühr',
          total: 'Gesamt',
          send: 'Senden',
          placeholder: 'Empfängeradresse eingeben',
          selectNetwork: 'Netzwerk auswählen',
          insufficientBalance: 'Unzureichendes Guthaben',
          success: 'Kryptowährung erfolgreich gesendet!',
          fieldRequired: 'Bitte füllen Sie alle erforderlichen Felder aus',
          invalidAddress: 'Ungültige Empfängeradresse',
          validAddress: 'Die Adresse scheint gültig zu sein',
          max: 'Max',
          confirmTitle: 'Transaktion bestätigen',
          confirmText: 'Sind Sie sicher, dass Sie senden möchten',
          confirmTo: 'an die Adresse',
          confirmNetwork: 'im Netzwerk',
          confirmFee: 'Gebühr:',
          confirmTotal: 'Gesamt:',
          confirmButton: 'Bestätigen',
          cancelButton: 'Abbrechen',
          platformFee: 'Plattformgebühr:',
          networkFee: 'Netzwerkgebühr:',
        }
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
        fetchingError: 'Fehler beim Abrufen der Preise',
        searchError: 'Fehler beim Suchen von Kryptowährungen',
        addingCurrency: 'Kryptowährung hinzufügen...',
      },
      noResults: 'Keine Ergebnisse gefunden',
      platformFee: 'Plattformgebühr',
      // New translations for history
      history: {
        sortBy: 'Sortieren nach',
        filterBy: 'Filtern nach',
        type: 'Typ',
        currency: 'Währung',
        amount: 'Menge',
        total: 'Gesamt',
        date: 'Datum',
        all: 'Alle',
        buy: 'Kauf',
        sell: 'Verkauf',
        ascending: 'aufsteigend',
        descending: 'absteigend',
        fromDate: 'Von Datum',
        toDate: 'Bis Datum',
        applyFilters: 'Filter anwenden',
        resetFilters: 'Zurücksetzen',
        statistics: 'Statistik',
        totalTrades: 'Gesamttransaktionen',
        totalBuys: 'Käufe',
        totalSells: 'Verkäufe',
        totalBuyAmount: 'Kaufbetrag',
        totalSellAmount: 'Verkaufsbetrag',
        netProfit: 'Nettogewinn',
        tradeDistribution: 'Transaktionsverteilung',
      }
    },
    ar: {
      title: 'Scam of Market',
      tabs: { trade: 'التداول', portfolio: 'المحفظة', history: 'التاريخ', wallet: 'محفظة' },
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
        rate: 'السعر (USDT)',
        orderType: 'نوع الطلب',
        market: 'سوق',
        limit: 'حد',
        takeProfit: 'جني الأرباح',
        stopLoss: 'وقف الخسارة',
        search: 'البحث عن العملة...',
        view: 'عرض',
        chart: 'مخطط',
        list: 'قائمة',
        openTradingView: 'فتح TradingView',
      },
      wallet: {
        title: 'إدارة المحفظة',
        receive: {
          title: 'استلام العملة المشفرة',
          subtitle: 'اختر العملة وانسخ العنوان لاستلام الأموال',
          currency: 'العملة',
          address: 'العنوان',
          copy: 'نسخ العنوان',
          copied: 'تم النسخ!',
          qrTitle: 'رمز الاستلام',
          qrInstructions: 'امسح رمز QR هذا لارسال الأموال',
        },
        send: {
          title: 'إرسال العملة المشفرة',
          currency: 'العملة',
          recipient: 'عنوان المستلم',
          network: 'الشبكة',
          amount: 'الكمية',
          fee: 'الرسوم',
          total: 'المجموع',
          send: 'إرسال',
          placeholder: 'أدخل عنوان المستلم',
          selectNetwork: 'اختر الشبكة',
          insufficientBalance: 'الرصيد غير كافٍ',
          success: 'تم إرسال العملة المشفرة بنجاح!',
          fieldRequired: 'يرجى ملء جميع الحقول المطلوبة',
          invalidAddress: 'عنوان المستلم غير صالح',
          validAddress: 'يبدو أن العنوان صحيح',
          max: 'الحد الأقصى',
          confirmTitle: 'تأكيد المعاملة',
          confirmText: 'هل أنت متأكد أنك تريد إرسال',
          confirmTo: 'إلى العنوان',
          confirmNetwork: 'على الشبكة',
          confirmFee: 'الرسوم:',
          confirmTotal: 'المجموع:',
          confirmButton: 'تأكيد',
          cancelButton: 'إلغاء',
          platformFee: 'رسوم المنصة:',
          networkFee: 'رسوم الشبكة:',
        }
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
        fetchingError: 'خطأ في جلب الأسعار',
        searchError: 'خطأ في البحث عن العملات المشفرة',
        addingCurrency: 'إضافة عملة مشفرة...',
      },
      noResults: 'لا توجد نتائج',
      platformFee: 'رسوم المنصة',
      // New translations for history
      history: {
        sortBy: 'ترتيب حسب',
        filterBy: 'تصفية حسب',
        type: 'النوع',
        currency: 'العملة',
        amount: 'الكمية',
        total: 'الإجمالي',
        date: 'التاريخ',
        all: 'الكل',
        buy: 'شراء',
        sell: 'بيع',
        ascending: 'تصاعدي',
        descending: 'تنازلي',
        fromDate: 'من تاريخ',
        toDate: 'إلى تاريخ',
        applyFilters: 'تطبيق التصفية',
        resetFilters: 'إعادة تعيين',
        statistics: 'الإحصائيات',
        totalTrades: 'إجمالي الصفقات',
        totalBuys: 'المشتريات',
        totalSells: 'المبيعات',
        totalBuyAmount: 'مبلغ الشراء',
        totalSellAmount: 'مبلغ البيع',
        netProfit: 'الربح الصافي',
        tradeDistribution: 'توزيع الصفقات',
      }
    },
    ja: {
      title: 'Scam of Market',
      tabs: { trade: '取引', portfolio: 'ポートフォリオ', history: '履歴', wallet: '財布' },
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
        rate: 'レート (USDT)',
        orderType: '注文タイプ',
        market: '成行',
        limit: '指値',
        takeProfit: '利確',
        stopLoss: '損切り',
        search: '通貨を検索...',
        view: '表示',
        chart: 'チャート',
        list: 'リスト',
        openTradingView: 'TradingViewを開く',
      },
      wallet: {
        title: 'ウォレット管理',
        receive: {
          title: '暗号通貨の受取',
          subtitle: '通貨を選択し、資金を受け取るためのアドレスをコピーしてください',
          currency: '通貨',
          address: 'アドレス',
          copy: 'アドレスをコピー',
          copied: 'コピーしました！',
          qrTitle: '受取用QRコード',
          qrInstructions: 'このQRコードをスキャンして資金を送信してください',
        },
        send: {
          title: '暗号通貨の送信',
          currency: '通貨',
          recipient: '受取人アドレス',
          network: 'ネットワーク',
          amount: '数量',
          fee: '手数料',
          total: '合計',
          send: '送信',
          placeholder: '受取人アドレスを入力',
          selectNetwork: 'ネットワークを選択',
          insufficientBalance: '残高が不足しています',
          success: '暗号通貨を送信しました！',
          fieldRequired: 'すべての必須フィールドを入力してください',
          invalidAddress: '受取人アドレスが無効です',
          validAddress: 'アドレスは有効のようです',
          max: '最大',
          confirmTitle: '取引の確認',
          confirmText: '送信してもよろしいですか',
          confirmTo: 'アドレスに',
          confirmNetwork: 'ネットワークで',
          confirmFee: '手数料：',
          confirmTotal: '合計：',
          confirmButton: '確認',
          cancelButton: 'キャンセル',
          platformFee: 'プラットフォーム手数料：',
          networkFee: 'ネットワーク手数料：',
        }
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
        fetchingError: '価格の取得中にエラーが発生しました',
        searchError: '暗号通貨の検索中にエラーが発生しました',
        addingCurrency: '暗号通貨を追加しています...',
      },
      noResults: '結果が見つかりません',
      platformFee: 'プラットフォーム手数料',
      // New translations for history
      history: {
        sortBy: '並べ替え',
        filterBy: 'フィルター',
        type: 'タイプ',
        currency: '通貨',
        amount: '数量',
        total: '合計',
        date: '日付',
        all: 'すべて',
        buy: '購入',
        sell: '売却',
        ascending: '昇順',
        descending: '降順',
        fromDate: '開始日',
        toDate: '終了日',
        applyFilters: '適用',
        resetFilters: 'リセット',
        statistics: '統計',
        totalTrades: '取引総数',
        totalBuys: '購入数',
        totalSells: '売却数',
        totalBuyAmount: '購入金額',
        totalSellAmount: '売却金額',
        netProfit: '純利益',
        tradeDistribution: '取引分布',
      }
    },
  };
  
  const t = translations[language];
  
  // Маппинг для API
  const apiSymbolMap = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    USDT: 'tether',
    SOL: 'solana',
    ADA: 'cardano',
    DOGE: 'dogecoin',
    DOT: 'polkadot',
    LINK: 'chainlink',
    LTC: 'litecoin',
    AVAX: 'avalanche-2',
    BNB: 'binancecoin',
    XRP: 'ripple',
    MATIC: 'matic-network',
    SHIB: 'shiba-inu',
    UNI: 'uniswap'
  };
  
  // Функция для получения цен с CoinGecko API
  const fetchPrices = async () => {
    try {
      setIsFetching(true);
      const symbols = Object.values(apiSymbolMap).join(',');
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbols}&vs_currencies=usd&include_24hr_change=true`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Обновляем цены и проценты изменения
      setCurrencies(prev => prev.map(currency => {
        const apiId = apiSymbolMap[currency.symbol];
        if (data[apiId]) {
          const newPrice = data[apiId].usd;
          const change = data[apiId].usd_24h_change;
          const changeStr = change ? `${change >= 0 ? '+' : ''}${change.toFixed(2)}%` : '0.0%';
          return {
            ...currency,
            price: newPrice,
            change: changeStr
          };
        }
        return currency;
      }));
    } catch (error) {
      console.error('Error fetching prices:', error);
      addNotification(t.notification.fetchingError, 'error');
    } finally {
      setIsFetching(false);
    }
  };
  const getCurrencyBalance = (symbol) => {
  if (!userBalance) return 0;
  return userBalance[symbol] || 0;
};
  
  // Функция для поиска криптовалют
  const searchCryptocurrencies = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Увеличено количество результатов до 30 и ослаблен фильтр по market_cap_rank
      const results = data.coins
        .filter(coin => coin.market_cap_rank !== null && coin.market_cap_rank !== undefined)
        .slice(0, 30)
        .map(coin => ({
          id: `api-${coin.id}`,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          price: coin.current_price || 0,
          change: coin.price_change_percentage_24h ? 
            `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%` : 
            '0.0%',
          apiId: coin.id,
          isApiResult: true
        }));
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching cryptocurrencies:', error);
      addNotification(t.notification.searchError, 'error');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Функция для получения данных о конкретной криптовалюте
  const getCurrencyData = async (apiId, symbol) => {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${apiId}&vs_currencies=usd&include_24hr_change=true`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data[apiId]) {
        const newPrice = data[apiId].usd;
        const change = data[apiId].usd_24h_change;
        const changeStr = change ? `${change >= 0 ? '+' : ''}${change.toFixed(2)}%` : '0.0%';
        return {
          id: `api-${apiId}`,
          name: symbol.charAt(0).toUpperCase() + symbol.slice(1),
          symbol: symbol.toUpperCase(),
          price: newPrice,
          change: changeStr,
          apiId: apiId,
          isApiResult: true
        };
      }
    } catch (error) {
      console.error('Error getting currency ', error);
    }
    return null;
  };
  
  // Telegram WebApp SDK (исправлено: useCallback для onBackClick)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      try {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        tg.BackButton.show();
        const onBackClick = useCallback(() => tg.close(), [tg]); // useCallback
        tg.BackButton.onClick(onBackClick);
        return () => {
          tg.BackButton.offClick(onBackClick);
        };
      } catch (err) {
        console.error("Telegram SDK error:", err);
      }
    }
  }, []);
  
  // Уведомления (исправлено: уникальный ID)
  let notificationIdCounter = useRef(0);
  const addNotification = (message, type = 'info') => {
    const id = notificationIdCounter.current++; // Уникальный ID
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };
  
  // Обновление цен при загрузке и каждые 30 секунд
  useEffect(() => {
    fetchPrices();
    // Обновляем каждые 30 секунд
    fetchInterval.current = setInterval(fetchPrices, 30000);
    return () => {
      if (fetchInterval.current) {
        clearInterval(fetchInterval.current);
      }
    };
  }, []);
  // Инициализация пользователя из Telegram
useEffect(() => {
  const initializeTelegramUser = async () => {
    try {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        
        if (user) {
          const userData = {
            userId: user.id.toString(),
            firstName: user.first_name,
            lastName: user.last_name || '',
            username: user.username || ''
          };

          // Инициализируем пользователя на сервере
          const result = await apiClient.initUser(userData);
          
          if (result.success) {
            setCurrentUser(result.user);
            setUserBalance(result.balances);
            addNotification(t('welcome') + ', ' + user.first_name + '!', 'success');
          }
        }
      }
    } catch (error) {
      console.error('Ошибка инициализации пользователя:', error);
      addNotification('Ошибка подключения к серверу', 'error');
    } finally {
      setIsInitialized(true);
    }
  };

  initializeTelegramUser();
}, []);
  
  // Поиск при изменении поискового запроса
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchCryptocurrencies(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTradeForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleTrade = (e) => {
    e.preventDefault();
    if (!tradeForm.currency || !tradeForm.amount || !tradeForm.walletOrExchange) {
      addNotification(t.notification.fieldRequired, 'error');
      return;
    }
    const selectedCurrencyData = [...currencies, ...searchResults].find(c => c.symbol === tradeForm.currency);
    const rate = tradeForm.rate ? parseFloat(tradeForm.rate) : selectedCurrencyData?.price || 0;
    const total = (tradeForm.amount * rate);
    // Рассчитываем комиссию платформы
    const platformFee = calculatePlatformFee(total);
    const newTrade = {
      id: Date.now(),
      type: tradeForm.type,
      currency: tradeForm.currency,
      amount: tradeForm.amount,
      total: total.toFixed(2),
      exchangeType: tradeForm.exchangeType,
      walletOrExchange: tradeForm.walletOrExchange,
      paymentMethod: tradeForm.paymentMethod,
      rate,
      orderType: tradeForm.orderType,
      takeProfit: tradeForm.tpEnabled ? tradeForm.takeProfit : null,
      stopLoss: tradeForm.slEnabled ? tradeForm.stopLoss : null,
      timestamp: new Date().toLocaleString(language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      // Добавляем комиссию платформы
      platformFee: platformFee.toFixed(2),
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
      orderType: 'market',
      takeProfit: '',
      stopLoss: '',
      tpEnabled: false,
      slEnabled: false,
    });
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify(newTrade));
    }
  };
  
  const handleCurrencyClick = async (currency) => {
    // Если валюта из API, добавляем ее в основной список
    if (currency.isApiResult) {
      addNotification(t.notification.addingCurrency, 'info');
      // Проверяем, не добавлена ли уже эта валюта
      const exists = currencies.some(c => c.symbol === currency.symbol);
      if (!exists) {
        // Получаем актуальные данные
        const currencyData = await getCurrencyData(currency.apiId, currency.symbol);
        if (currencyData) {
          setCurrencies(prev => [...prev, currencyData]);
        }
      }
      setTradeForm(prev => ({
        ...prev,
        currency: currency.symbol,
        rate: currency.price.toString(),
      }));
    } else {
      setTradeForm(prev => ({
        ...prev,
        currency: currency.symbol,
        rate: currency.price.toString(),
      }));
    }
    setSelectedCurrency(currency.id);
    setSearchTerm('');
  };
  // Обновленная версия handleBuy (строка ~780)
const handleBuy = async (symbol, amount) => {
  // Проверяем, инициализирован ли пользователь
  if (!currentUser) {
    // Локальный режим для тестирования
    setUserBalances(prev => ({
      ...prev,
      [symbol]: (prev[symbol] || 0) + amount,
      'USDT': (prev['USDT'] || 10000) - (amount * selectedCurrency.price)
    }));
    addNotification(`${t('bought')} ${amount} ${symbol}`, 'success');
    return;
  }

  // Серверный режим для Telegram пользователей
  try {
    setIsTrading(true);
    const result = await apiClient.buyCrypto(currentUser.id, symbol, amount);
    if (result.success) {
      const balanceData = await apiClient.getBalance(currentUser.id);
      setUserBalance(balanceData.balances);
      addNotification(t('tradeSuccess'), 'success');
      setTradeAmount('');
    } else {
      addNotification(result.error || t('tradeError'), 'error');
    }
  } catch (error) {
    console.error('Ошибка покупки:', error);
    addNotification(t('tradeError'), 'error');
  } finally {
    setIsTrading(false);
  }
};

// Обновленная версия handleSell (строка ~820)
const handleSell = async (symbol, amount) => {
  // Проверяем, инициализирован ли пользователь
  if (!currentUser) {
    // Локальный режим для тестирования
    setUserBalances(prev => ({
      ...prev,
      [symbol]: Math.max(0, (prev[symbol] || 0) - amount),
      'USDT': (prev['USDT'] || 10000) + (amount * selectedCurrency.price)
    }));
    addNotification(`${t('sold')} ${amount} ${symbol}`, 'success');
    return;
  }

  // Серверный режим для Telegram пользователей
  try {
    setIsTrading(true);
    const result = await apiClient.sellCrypto(currentUser.id, symbol, amount);
    if (result.success) {
      const balanceData = await apiClient.getBalance(currentUser.id);
      setUserBalance(balanceData.balances);
      addNotification(t('tradeSuccess'), 'success');
      setTradeAmount('');
    } else {
      addNotification(result.error || t('tradeError'), 'error');
    }
  } catch (error) {
    console.error('Ошибка продажи:', error);
    addNotification(t('tradeError'), 'error');
  } finally {
    setIsTrading(false);
  }
};
  
  // Фильтрация валют по поисковому запросу
  const filteredCurrencies = searchTerm ? searchResults : currencies;
  
  // Исправленный компонент TradingViewWidget (исправлено: widgetId через useMemo)
  const TradingViewWidget = ({ symbol = "BINANCE:BTCUSDT" }) => {
    const containerRef = useRef(null);
    // Используем useMemo для стабильного widgetId
    const widgetId = useMemo(() => `tradingview_${symbol.replace(/[:/]/g, '_')}_${Math.random().toString(36).substr(2, 9)}`, [symbol]);
    useEffect(() => {
      if (!containerRef.current) return;
      // Очистка существующего содержимого контейнера
      containerRef.current.innerHTML = '';
      // Создание нового div для виджета
      const widgetDiv = document.createElement('div');
      widgetDiv.id = widgetId;
      widgetDiv.style.height = '100%';
      widgetDiv.style.width = '100%';
      containerRef.current.appendChild(widgetDiv);
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = () => {
        if (window.TradingView) {
          new window.TradingView.widget({
            container_id: widgetId,
            autosize: true,
            symbol: symbol,
            interval: 'D',
            timezone: 'Etc/UTC',
            theme: 'light',
            style: '1',
            locale: language,
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            hide_top_toolbar: false,
            allow_symbol_change: true,
            save_image: false,
            hideideas: true,
            hideideas_button: true,
            studies: [],
            show_popup_button: true,
            popup_width: '1000',
            popup_height: '650',
          });
        }
      };
      document.head.appendChild(script);
      // Cleanup function
      return () => {
        // Удаление скрипта при размонтировании
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        // Очистка контейнера
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    }, [symbol, language, widgetId]); // widgetId теперь стабильный
    return (
      <div
        ref={containerRef}
        style={{ height: '400px', width: '100%' }}
        className="w-full h-full"
      />
    );
  };
  
  // Открытие TradingView
  const openTradingView = (currency) => {
    const symbol = `${currency.symbol}USDT`;
    const tradingViewUrl = `https://www.tradingview.com/symbols/BINANCE:${symbol}/`;
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(tradingViewUrl);
    } else {
      window.open(tradingViewUrl, '_blank');
    }
  };
  
  // Инициализация балансов пользователей
  useEffect(() => {
    const initialBalances = {};
    currencies.forEach(currency => {
      initialBalances[currency.symbol] = (Math.random() * 10).toFixed(6);
    });
    setUserBalances(initialBalances);
  }, [currencies]);
  
  // Обработчики для раздела "Получить"
  const handleReceiveChange = (e) => {
    const { name, value } = e.target;
    setWalletForm(prev => ({
      ...prev,
      receive: { ...prev.receive, [name]: value }
    }));
  };
  
  const handleCopyAddress = () => {
    if (walletForm.receive.currency && fakeAddresses[walletForm.receive.currency]) {
      navigator.clipboard.writeText(fakeAddresses[walletForm.receive.currency])
        .then(() => {
          addNotification(t.wallet.receive.copied, 'success');
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
          addNotification('Failed to copy address', 'error');
        });
    }
  };
  
  // Обработчики для раздела "Отправить"
  const handleSendChange = (e) => {
    const { name, value } = e.target;
    setWalletForm(prev => ({
      ...prev,
      send: { ...prev.send, [name]: value }
    }));
  };
  
  const calculateNetworkFee = (currency, network) => {
    const fees = {
      BTC: 0.0005,
      ETH: 0.005,
      USDT: 0.001,
      SOL: 0.000005,
      ADA: 0.17,
      DOGE: 1,
      DOT: 0.01,
      LINK: 0.01,
      LTC: 0.001,
      AVAX: 0.01,
      BNB: 0.00015,
      XRP: 0.00002,
      MATIC: 0.01,
      SHIB: 0.01,
      UNI: 0.01,
    };
    return fees[currency] || 0.01;
  };
  
  // Проверка валидности адреса
  const isValidAddress = (address, currency) => {
    if (!address || address.length < 10) return false;
    // Простая проверка по длине и префиксу
    if (currency === 'BTC') return address.length >= 26 && (address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1'));
    if (currency === 'ETH') return address.length === 42 && address.startsWith('0x');
    if (currency === 'SOL') return address.length >= 32 && address.length <= 44;
    if (currency === 'XRP') return address.length >= 25 && address.startsWith('r');
    if (currency === 'ADA') return address.length >= 100;
    return address.length >= 10;
  };
  
  // Состояние для модального окна подтверждения
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmTransaction, setConfirmTransaction] = useState(null);
  
  // Обработчик отправки
  const handleSend = (e) => {
    e.preventDefault();
    if (!walletForm.send.currency || !walletForm.send.recipientAddress || !walletForm.send.network || !walletForm.send.amount) {
      addNotification(t.wallet.send.fieldRequired, 'error');
      return;
    }
    if (walletForm.send.amount <= 0) {
      addNotification(t.wallet.send.fieldRequired, 'error');
      return;
    }
    if (!isValidAddress(walletForm.send.recipientAddress, walletForm.send.currency)) {
      addNotification(t.wallet.send.invalidAddress, 'error');
      return;
    }
    const userBalance = parseFloat(userBalances[walletForm.send.currency] || 0);
    const networkFee = calculateNetworkFee(walletForm.send.currency, walletForm.send.network);
    const amountToSend = parseFloat(walletForm.send.amount);
    // Рассчитываем комиссию платформы для криптовалюты
    const platformFeeCrypto = calculatePlatformFee(amountToSend);
    // Проверяем, достаточно ли средств (включая сетевую комиссию и комиссию платформы)
    if (amountToSend + networkFee + platformFeeCrypto > userBalance) {
      addNotification(t.wallet.send.insufficientBalance, 'error');
      return;
    }
    // Подготовка данных для подтверждения
    const transaction = {
      currency: walletForm.send.currency,
      amount: amountToSend,
      recipient: walletForm.send.recipientAddress,
      network: walletForm.send.network,
      fee: networkFee,
      platformFee: platformFeeCrypto,
      total: amountToSend + networkFee + platformFeeCrypto
    };
    setConfirmTransaction(transaction);
    setShowConfirmModal(true);
  };
  
  // Подтверждение отправки
  const confirmSend = () => {
    if (!confirmTransaction) return;
    const { currency, amount, fee, platformFee } = confirmTransaction;
    // Обновляем баланс - вычитаем сумму, сетевую комиссию и комиссию платформы
    const userBalance = parseFloat(userBalances[currency] || 0);
    const newBalance = (userBalance - amount - fee - platformFee).toFixed(6);
    setUserBalances(prev => ({
      ...prev,
      [currency]: newBalance
    }));
    // Сбрасываем форму отправки
    setWalletForm(prev => ({
      ...prev,
      send: {
        currency: '',
        recipientAddress: '',
        network: '',
        amount: '',
      }
    }));
    addNotification(t.wallet.send.success, 'success');
    setShowConfirmModal(false);
    setConfirmTransaction(null);
  };
  
  // Отмена отправки
  const cancelSend = () => {
    setShowConfirmModal(false);
    setConfirmTransaction(null);
  };
  
  // Установка максимальной суммы
  const setMaxAmount = () => {
    if (!walletForm.send.currency) return;
    const userBalance = parseFloat(userBalances[walletForm.send.currency] || 0);
    const networkFee = calculateNetworkFee(walletForm.send.currency, walletForm.send.network);
    // Максимальная сумма для отправки = баланс - сетевая комиссия - комиссия платформы
    const platformFee = calculatePlatformFee(userBalance - networkFee);
    const maxAmount = Math.max(0, userBalance - networkFee - platformFee);
    setWalletForm(prev => ({
      ...prev,
      send: {
        ...prev.send,
        amount: maxAmount.toFixed(6)
      }
    }));
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
  
  // Состояния для вкладки "История"
  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp',
    direction: 'descending'
  });
  
  const [filters, setFilters] = useState({
    type: 'all',
    currency: 'all',
    fromDate: '',
    toDate: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Функция сортировки
  const sortedAndFilteredTrades = useMemo(() => {
    let result = [...trades];
    
    // Фильтрация
    if (filters.type !== 'all') {
      result = result.filter(trade => trade.type === filters.type);
    }
    
    if (filters.currency !== 'all') {
      result = result.filter(trade => trade.currency === filters.currency);
    }
    
    if (filters.fromDate) {
      const from = new Date(filters.fromDate).getTime();
      result = result.filter(trade => {
        const tradeDate = new Date(trade.timestamp).getTime();
        return tradeDate >= from;
      });
    }
    
    if (filters.toDate) {
      const to = new Date(filters.toDate).getTime() + 24*60*60*1000 - 1; // Include full day
      result = result.filter(trade => {
        const tradeDate = new Date(trade.timestamp).getTime();
        return tradeDate <= to;
      });
    }
    
    // Сортировка
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Special handling for timestamp
        if (sortConfig.key === 'timestamp') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }
        
        // Special handling for numeric values
        if (sortConfig.key === 'amount' || sortConfig.key === 'total' || sortConfig.key === 'rate') {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [trades, sortConfig, filters]);
  
  // Функция для изменения сортировки
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Функция для изменения фильтров
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Функция сброса фильтров
  const resetFilters = () => {
    setFilters({
      type: 'all',
      currency: 'all',
      fromDate: '',
      toDate: ''
    });
  };
  
  // Статистика
  const statistics = useMemo(() => {
    const totalTrades = sortedAndFilteredTrades.length;
    const buys = sortedAndFilteredTrades.filter(t => t.type === 'buy');
    const sells = sortedAndFilteredTrades.filter(t => t.type === 'sell');
    
    const totalBuyAmount = buys.reduce((sum, trade) => sum + parseFloat(trade.total), 0);
    const totalSellAmount = sells.reduce((sum, trade) => sum + parseFloat(trade.total), 0);
    const netProfit = totalSellAmount - totalBuyAmount;
    
    const buyPercentage = totalTrades > 0 ? (buys.length / totalTrades) * 100 : 0;
    const sellPercentage = totalTrades > 0 ? (sells.length / totalTrades) * 100 : 0;
    
    return {
      totalTrades,
      totalBuys: buys.length,
      totalSells: sells.length,
      totalBuyAmount: totalBuyAmount.toFixed(2),
      totalSellAmount: totalSellAmount.toFixed(2),
      netProfit: netProfit.toFixed(2),
      buyPercentage,
      sellPercentage
    };
  }, [sortedAndFilteredTrades]);
  
  // Получение уникальных валют для фильтра
  const uniqueCurrencies = useMemo(() => {
    const currencySet = new Set();
    trades.forEach(trade => {
      currencySet.add(trade.currency);
    });
    return Array.from(currencySet).sort();
  }, [trades]);
  
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
        {['trade', 'portfolio', 'history', 'wallet'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              color: activeTab === tab ? '#8B4513' : '#4B5563',
              borderBottom: activeTab === tab ? '2px solid #8B4513' : 'none',
            }}
            className="py-3 font-medium text-sm sm:text-base w-1/5 text-center"
          >
            {t.tabs[tab]}
          </button>
        ))}
      </nav>
      
      {/* Основной контент */}
      <main className="p-4 pb-20">
        {activeTab === 'trade' && (
          <div className="space-y-4">
            {/* Поисковое поле и переключатель вида */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t.form.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    borderColor: '#D1D5DB',
                    backgroundColor: 'white',
                  }}
                  className="w-full p-3 pl-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                />
                <svg
                  className="absolute left-3 top-3.5 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {(isSearching || searchTerm) && (
                  <div className="absolute right-3 top-3.5">
                    {isSearching ? (
                      <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => setActiveView('list')}
                  style={{
                    backgroundColor: activeView === 'list' ? '#8B4513' : 'white',
                    color: activeView === 'list' ? 'white' : '#8B4513',
                  }}
                  className="px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  {t.form.list}
                </button>
                <button
                  onClick={() => setActiveView('chart')}
                  style={{
                    backgroundColor: activeView === 'chart' ? '#8B4513' : 'white',
                    color: activeView === 'chart' ? 'white' : '#8B4513',
                  }}
                  className="px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  {t.form.chart}
                </button>
              </div>
            </div>
            
            {/* Список валют или графики */}
            {activeView === 'list' ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredCurrencies.length > 0 ? (
                  filteredCurrencies.map((currency) => (
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
                          <p className="font-semibold">{currency.price.toLocaleString(undefined, {
                            minimumFractionDigits: currency.price < 1 ? 6 : 2,
                            maximumFractionDigits: currency.price < 1 ? 6 : 2
                          })} USDT</p>
                          <p className={`text-sm ${currency.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {currency.change}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <svg
                      className="mx-auto h-12 w-12 mb-4 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p>{t.noResults}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Проверяем, выбран ли график */}
                {selectedCurrency ? (
                  // Отображаем один выбранный график
                  (() => {
                    const currency = [...currencies, ...searchResults].find(c => c.id === selectedCurrency);
                    if (!currency) return null;
                    const symbol = `${currency.symbol}USDT`;
                    return (
                      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{currency.name} ({currency.symbol})</h3>
                            <p className="text-sm text-gray-500">
                              {currency.price.toLocaleString(undefined, {
                                minimumFractionDigits: currency.price < 1 ? 6 : 2,
                                maximumFractionDigits: currency.price < 1 ? 6 : 2
                              })} USDT
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedCurrency(null)}
                            style={{ backgroundColor: '#8B4513' }}
                            className="px-3 py-1 rounded-md text-white text-sm hover:bg-[#703A0F] transition"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="p-3">
                          <div className="w-full" style={{ height: '400px' }}>
                            <TradingViewWidget symbol={`BINANCE:${symbol}`} />
                          </div>
                          <button
                            onClick={() => openTradingView(currency)}
                            style={{ backgroundColor: '#8B4513' }}
                            className="w-full text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-[#703A0F] transition mt-2"
                          >
                            {t.form.openTradingView}
                          </button>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  // Отображаем список валют для выбора графика
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredCurrencies.length > 0 ? (
                      filteredCurrencies.map((currency) => (
                        <div
                          key={currency.id}
                          onClick={() => setSelectedCurrency(currency.id)}
                          className="p-4 border border-gray-200 rounded-lg cursor-pointer transition-all hover:bg-amber-100 bg-white"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{currency.name}</h3>
                              <p className="text-sm text-gray-500">{currency.symbol}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{currency.price.toLocaleString(undefined, {
                                minimumFractionDigits: currency.price < 1 ? 6 : 2,
                                maximumFractionDigits: currency.price < 1 ? 6 : 2
                              })} USDT</p>
                              <p className={`text-sm ${currency.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {currency.change}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <svg
                          className="mx-auto h-12 w-12 mb-4 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p>{t.noResults}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
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
                {[...currencies, ...searchResults].map((c) => (
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
              {/* Кнопки Рыночный / Лимитный */}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setTradeForm(prev => ({ ...prev, orderType: 'market' }))}
                  style={{
                    backgroundColor: tradeForm.orderType === 'market' ? '#8B4513' : 'white',
                    color: tradeForm.orderType === 'market' ? 'white' : '#8B4513',
                    borderColor: tradeForm.orderType === 'market' ? '#8B4513' : '#D1D5DB',
                  }}
                  className="flex-1 p-2 rounded-md border transition-colors duration-200 hover:border-[#8B4513] hover:bg-amber-50"
                >
                  {t.form.market}
                </button>
                <button
                  type="button"
                  onClick={() => setTradeForm(prev => ({ ...prev, orderType: 'limit' }))}
                  style={{
                    backgroundColor: tradeForm.orderType === 'limit' ? '#8B4513' : 'white',
                    color: tradeForm.orderType === 'limit' ? 'white' : '#8B4513',
                    borderColor: tradeForm.orderType === 'limit' ? '#8B4513' : '#D1D5DB',
                  }}
                  className="flex-1 p-2 rounded-md border transition-colors duration-200 hover:border-[#8B4513] hover:bg-amber-50"
                >
                  {t.form.limit}
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
                required={tradeForm.orderType === 'limit'}
              />
              {/* Take Profit и Stop Loss (отображаются только для лимитного ордера) */}
              {tradeForm.orderType === 'limit' && (
                <div className="space-y-3 border-t pt-3 mt-3 border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{t.form.takeProfit}</span>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="tpEnabled"
                        checked={tradeForm.tpEnabled}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {tradeForm.tpEnabled && (
                    <input
                      type="number"
                      name="takeProfit"
                      value={tradeForm.takeProfit}
                      onChange={handleInputChange}
                      placeholder={t.form.takeProfit}
                      step="0.01"
                      min="0"
                      style={{
                        borderColor: '#D1D5DB',
                        backgroundColor: 'white',
                      }}
                      className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{t.form.stopLoss}</span>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="slEnabled"
                        checked={tradeForm.slEnabled}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {tradeForm.slEnabled && (
                    <input
                      type="number"
                      name="stopLoss"
                      value={tradeForm.stopLoss}
                      onChange={handleInputChange}
                      placeholder={t.form.stopLoss}
                      step="0.01"
                      min="0"
                      style={{
                        borderColor: '#D1D5DB',
                        backgroundColor: 'white',
                      }}
                      className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                    />
                  )}
                </div>
              )}
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
                    <p className="font-semibold">{(Math.random() * 10000).toFixed(2)} USDT</p>
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{t.historyTitle}</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{ backgroundColor: '#8B4513' }}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:bg-[#703A0F] transition flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span>{t.history.filterBy}</span>
              </button>
            </div>
            
            {/* Панель фильтров */}
            {showFilters && (
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Тип сделки */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.history.type}</label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                    >
                      <option value="all">{t.history.all}</option>
                      <option value="buy">{t.history.buy}</option>
                      <option value="sell">{t.history.sell}</option>
                    </select>
                  </div>
                  
                  {/* Валюта */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.history.currency}</label>
                    <select
                      value={filters.currency}
                      onChange={(e) => handleFilterChange('currency', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                    >
                      <option value="all">{t.history.all}</option>
                      {uniqueCurrencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* От даты */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.history.fromDate}</label>
                    <input
                      type="date"
                      value={filters.fromDate}
                      onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                    />
                  </div>
                  
                  {/* До даты */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.history.toDate}</label>
                    <input
                      type="date"
                      value={filters.toDate}
                      onChange={(e) => handleFilterChange('toDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition"
                  >
                    {t.history.applyFilters}
                  </button>
                  <button
                    onClick={resetFilters}
                    style={{ backgroundColor: '#8B4513' }}
                    className="px-4 py-2 text-white rounded-md text-sm font-medium hover:bg-[#703A0F] transition"
                  >
                    {t.history.resetFilters}
                  </button>
                </div>
              </div>
            )}
            
            {/* Статистика */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">{t.history.statistics}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{statistics.totalTrades}</div>
                  <div className="text-sm text-gray-600">{t.history.totalTrades}</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{statistics.totalBuys}</div>
                  <div className="text-sm text-green-600">{t.history.totalBuys}</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{statistics.totalSells}</div>
                  <div className="text-sm text-red-600">{t.history.totalSells}</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{statistics.totalBuyAmount}</div>
                  <div className="text-sm text-blue-600">{t.history.totalBuyAmount} USDT</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{statistics.totalSellAmount}</div>
                  <div className="text-sm text-purple-600">{t.history.totalSellAmount} USDT</div>
                </div>
              </div>
              
              {/* Диаграмма распределения сделок */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">{t.history.tradeDistribution}</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-green-500 h-4"
                      style={{ width: `${statistics.buyPercentage}%` }}
                    ></div>
                    <div 
                      className="bg-red-500 h-4"
                      style={{ width: `${statistics.sellPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>{Math.round(statistics.buyPercentage)}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>{Math.round(statistics.sellPercentage)}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{t.history.buy}</span>
                  <span>{t.history.sell}</span>
                </div>
              </div>
            </div>
            
            {/* Список сделок */}
            <div className="space-y-4">
              {sortedAndFilteredTrades.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">{t.noTrades}</h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    {t.tabs.trade} {t.tabs.trade.toLowerCase()} to see them here
                  </p>
                </div>
              ) : (
                <>
                  {/* Заголовок таблицы с сортировкой */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div 
                        className="col-span-2 flex items-center cursor-pointer hover:text-[#8B4513] transition"
                        onClick={() => requestSort('timestamp')}
                      >
                        {t.history.date}
                        {sortConfig.key === 'timestamp' && (
                          <svg 
                            className={`w-4 h-4 ml-1 ${sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                      <div 
                        className="col-span-2 flex items-center cursor-pointer hover:text-[#8B4513] transition"
                        onClick={() => requestSort('type')}
                      >
                        {t.history.type}
                        {sortConfig.key === 'type' && (
                          <svg 
                            className={`w-4 h-4 ml-1 ${sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                      <div 
                        className="col-span-2 flex items-center cursor-pointer hover:text-[#8B4513] transition"
                        onClick={() => requestSort('currency')}
                      >
                        {t.history.currency}
                        {sortConfig.key === 'currency' && (
                          <svg 
                            className={`w-4 h-4 ml-1 ${sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                      <div 
                        className="col-span-3 flex items-center cursor-pointer hover:text-[#8B4513] transition"
                        onClick={() => requestSort('amount')}
                      >
                        {t.history.amount}
                        {sortConfig.key === 'amount' && (
                          <svg 
                            className={`w-4 h-4 ml-1 ${sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                      <div 
                        className="col-span-3 flex items-center cursor-pointer hover:text-[#8B4513] transition"
                        onClick={() => requestSort('total')}
                      >
                        {t.history.total}
                        {sortConfig.key === 'total' && (
                          <svg 
                            className={`w-4 h-4 ml-1 ${sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Сделки */}
                  <div className="space-y-3">
                    {sortedAndFilteredTrades.map((trade) => (
                      <div 
                        key={trade.id} 
                        className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] hover:border-[#8B4513]/20"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                trade.type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}
                            >
                              {trade.type === 'buy' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {t.successMessage[trade.type]} {trade.amount} {trade.currency}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {trade.timestamp}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  trade.type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {trade.type === 'buy' ? t.form.buy : t.form.sell}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-gray-900">
                              {trade.total} USDT
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {trade.rate} {trade.currency}/USDT
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-gray-100 pt-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">{t.form.exchangeType}:</span>
                                <span className="font-medium">{trade.walletOrExchange}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">{t.form.paymentMethod}:</span>
                                <span className="font-medium">{t.form[trade.paymentMethod]}</span>
                              </div>
                              {trade.orderType && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{t.form.orderType}:</span>
                                  <span className="font-medium">{t.form[trade.orderType]}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              {trade.platformFee && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{t.platformFee}:</span>
                                  <span className="font-medium text-red-500">-{trade.platformFee} USDT</span>
                                </div>
                              )}
                              {trade.takeProfit && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">TP:</span>
                                  <span className="font-medium text-green-500">{trade.takeProfit} USDT</span>
                                </div>
                              )}
                              {trade.stopLoss && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">SL:</span>
                                  <span className="font-medium text-red-500">{trade.stopLoss} USDT</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Объединённый раздел "Кошелёк" */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold mb-2">{t.wallet.title}</h2>
            {/* Блок получения криптовалюты */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg text-gray-800 border-b pb-2 border-gray-200">
                  {t.wallet.receive.title}
                </h3>
                <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  ↓
                </div>
              </div>
              <p className="text-gray-600 text-sm">{t.wallet.receive.subtitle}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.wallet.receive.currency}
                  </label>
                  <select
                    name="currency"
                    value={walletForm.receive.currency}
                    onChange={handleReceiveChange}
                    style={{
                      borderColor: '#D1D5DB',
                      backgroundColor: 'white',
                    }}
                    className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                  >
                    <option value="">{t.wallet.receive.currency}</option>
                    {[...currencies, ...searchResults].map((c) => (
                      <option key={c.id} value={c.symbol}>
                        {c.name} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                {walletForm.receive.currency && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          {t.wallet.receive.address}
                        </label>
                        <button
                          onClick={handleCopyAddress}
                          style={{ backgroundColor: '#8B4513' }}
                          className="px-3 py-1 rounded-md text-white text-xs font-medium hover:bg-[#703A0F] transition flex items-center space-x-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 002 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>{t.wallet.receive.copy}</span>
                        </button>
                      </div>
                      <div className="flex">
                        <input
                          ref={receiveAddressRef}
                          type="text"
                          value={fakeAddresses[walletForm.receive.currency] || ''}
                          readOnly
                          style={{
                            borderColor: '#D1D5DB',
                            backgroundColor: 'white',
                          }}
                          className="flex-1 p-3 border rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        {t.wallet.receive.qrTitle}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {t.wallet.receive.qrInstructions}
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-center">
                        <div className="w-40 h-40 bg-white p-2 border border-gray-300 rounded">
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                              </svg>
                            </div>
                            <div className="absolute inset-2 bg-white">
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-3/4 h-3/4 bg-black rounded-sm"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Блок отправки криптовалюты */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg text-gray-800 border-b pb-2 border-gray-200">
                  {t.wallet.send.title}
                </h3>
                <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  →
                </div>
              </div>
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.wallet.send.currency}
                  </label>
                  <select
                    name="currency"
                    value={walletForm.send.currency}
                    onChange={handleSendChange}
                    style={{
                      borderColor: '#D1D5DB',
                      backgroundColor: 'white',
                    }}
                    className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                  >
                    <option value="">{t.wallet.send.currency}</option>
                    {[...currencies, ...searchResults].map((c) => (
                      <option key={c.id} value={c.symbol}>
                        {c.name} ({c.symbol}) - Баланс: {userBalances[c.symbol] || '0.000000'} {c.symbol}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.wallet.send.recipient}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="recipientAddress"
                      value={walletForm.send.recipientAddress}
                      onChange={handleSendChange}
                      placeholder={t.wallet.send.placeholder}
                      style={{
                        borderColor: isValidAddress(walletForm.send.recipientAddress, walletForm.send.currency) ? '#10B981' :
                                     walletForm.send.recipientAddress ? '#EF4444' : '#D1D5DB',
                        backgroundColor: 'white',
                      }}
                      className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 pr-20"
                    />
                    {walletForm.send.recipientAddress && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isValidAddress(walletForm.send.recipientAddress, walletForm.send.currency) ? (
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  {walletForm.send.recipientAddress && (
                    <p className={`text-xs mt-1 ${
                      isValidAddress(walletForm.send.recipientAddress, walletForm.send.currency) ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {isValidAddress(walletForm.send.recipientAddress, walletForm.send.currency) ?
                        t.wallet.send.validAddress : t.wallet.send.invalidAddress}
                    </p>
                  )}
                </div>
                {walletForm.send.currency && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.wallet.send.network}
                    </label>
                    <select
                      name="network"
                      value={walletForm.send.network}
                      onChange={handleSendChange}
                      style={{
                        borderColor: '#D1D5DB',
                        backgroundColor: 'white',
                      }}
                      className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                    >
                      <option value="">{t.wallet.send.selectNetwork}</option>
                      {(Array.isArray(currencyNetworks[walletForm.send.currency]) ?
                        currencyNetworks[walletForm.send.currency] : [currencyNetworks[walletForm.send.currency]]).map(network => (
                        <option key={network} value={network}>
                          {network}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.wallet.send.amount}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="amount"
                      value={walletForm.send.amount}
                      onChange={handleSendChange}
                      placeholder="0.00"
                      step="0.000001"
                      min="0"
                      style={{
                        borderColor: '#D1D5DB',
                        backgroundColor: 'white',
                      }}
                      className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 pr-20"
                    />
                    <button
                      type="button"
                      onClick={setMaxAmount}
                      style={{ backgroundColor: '#8B4513' }}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-md text-white text-xs font-medium hover:bg-[#703A0F] transition"
                    >
                      {t.wallet.send.max}
                    </button>
                  </div>
                </div>
                {walletForm.send.currency && walletForm.send.amount && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t.wallet.send.networkFee}</span>
                      <span className="font-medium">
                        {calculateNetworkFee(walletForm.send.currency, walletForm.send.network).toFixed(6)} {walletForm.send.currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t.wallet.send.platformFee}</span>
                      <span className="font-medium">
                        {calculatePlatformFee(parseFloat(walletForm.send.amount)).toFixed(6)} {walletForm.send.currency}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>{t.wallet.send.total}</span>
                      <span>
                        {(
                          parseFloat(walletForm.send.amount) +
                          calculateNetworkFee(walletForm.send.currency, walletForm.send.network) +
                          calculatePlatformFee(parseFloat(walletForm.send.amount))
                        ).toFixed(6)} {walletForm.send.currency}
                      </span>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  style={{ backgroundColor: '#8B4513' }}
                  disabled={isFetching}
                  className="w-full text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-[#703A0F] transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{t.form.submit}...</span>
                    </>
                  ) : (
                    t.wallet.send.send
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      
      {/* Модальное окно подтверждения */}
      {showConfirmModal && confirmTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t.wallet.send.confirmTitle}
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-medium">{t.wallet.send.confirmText}</span>{' '}
                <span className="font-bold text-[#8B4513]">
                  {confirmTransaction.amount} {confirmTransaction.currency}
                </span>
              </p>
              <p>
                <span className="font-medium">{t.wallet.send.confirmTo}</span>{' '}
                <span className="font-mono text-xs break-all">{confirmTransaction.recipient}</span>
              </p>
              <p>
                <span className="font-medium">{t.wallet.send.confirmNetwork}</span>{' '}
                {confirmTransaction.network}
              </p>
              <div className="bg-gray-50 p-3 rounded-lg mt-2">
                <div className="flex justify-between">
                  <span>{t.wallet.send.networkFee}</span>
                  <span className="font-medium">{confirmTransaction.fee} {confirmTransaction.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.wallet.send.platformFee}</span>
                  <span className="font-medium">{confirmTransaction.platformFee} {confirmTransaction.currency}</span>
                </div>
                <div className="flex justify-between font-semibold pt-1 border-t">
                  <span>{t.wallet.send.confirmTotal}</span>
                  <span>{confirmTransaction.total} {confirmTransaction.currency}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={cancelSend}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                {t.wallet.send.cancelButton}
              </button>
              <button
                onClick={confirmSend}
                style={{ backgroundColor: '#8B4513' }}
                className="flex-1 px-4 py-2 text-white rounded-lg hover:bg-[#703A0F] transition font-medium"
              >
                {t.wallet.send.confirmButton}
              </button>
            </div>
          </div>
        </div>
      )}
      
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
