import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { LocaleProvider } from 'antd';
import ruRU from 'antd/lib/locale-provider/ru_RU';


ReactDOM.render(
    <LocaleProvider locale={ruRU}><App /></LocaleProvider>,
    document.getElementById('root'));
