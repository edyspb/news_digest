## Приложение для получения дайджеста новостей с сайта lenta.ru

## Сервер
Версия python: v3.5

Исходники сервера: src/news_digest_server

### Сборка сервера
Для установки зависимостей серверной части используйте следующие команды:

```bash
cd ~/src/news_digest_server
pip install -r requirements.txt
```

Для работы фоновых задач нужно поднять сервер redis (см. settings.py).

Также необходимо настроить параметры для отправки e-mail (см. settings.py)

### Запуск сервера
Запуск сервера:

```bash
cd ~/src/news_digest_server
python manage.py migrate
celery -A news_digest_server worker -l info
celery -A news_digest_server beat -l info
gunicorn news_digest_server.wsgi
```

## Клиент
Версия node: v8.5.0

Исходники клиента - src/news_digest_client

### Сборка клиента
Для установки зависимостей клиента и его сборки используйте следующие команды:

```bash
cd ~/src/news_digest_clinet
npm install
npm run build
```

Клиентская часть будет собрана в папку news_digest_client/build

## Настройка веб сервера
Пример простого конфига nginx:

```javascript
server {
    listen 80;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
    }

    location / {
        root /path/to/public/;
    }
}
```
