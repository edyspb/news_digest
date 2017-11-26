import os

from django.core.mail import EmailMessage
from django.template.loader import render_to_string

from celery import shared_task
from celery.task.schedules import crontab
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger

from weasyprint import HTML

from api.utils import lenta_ru_rss
from . models import Category, News


logger = get_task_logger(__name__)


@periodic_task(run_every=(crontab(hour="*", minute="*", day_of_week="*")))
def lenta_ru_rss_task():
    '''Periodic task that gets news from lenta.ru
    and stores them to db
    '''
    news_list = lenta_ru_rss.get_news()
    for news in news_list:
        try:
            title = news['title']
            category_name = news['category']
            pub_date = news['pub_date']
            description = news['description']
        except KeyError:
            logger.error('Bad news: {news}. Skipping.'.format(news=news))
            continue

        category = Category.objects.filter(name=category_name).first()
        if category is None:
            category = Category(name=category_name)
            category.save()

        new_news = News.objects.filter(title=title, pub_date=pub_date).first()
        if new_news is None:
            new_news = News(
                title=title,
                pub_date=pub_date,
                description=description,
                category=category)
            new_news.save()


@shared_task
def render_to_pdf_and_send(email, date_from, date_to, categories):
    '''Task that renders news digest to pdf and sends it to the email
    '''
    news_list = News.objects.filter(
        category__in=categories,
        pub_date__gte=date_from,
        pub_date__lte=date_to)

    news_for_context = []
    for news in news_list:
        new_news = {
            'title': news.title,
            'description': news.description,
            'pub_date': '{0:%Y-%m-%d %H:%M:%S}'.format(news.pub_date),
            'category': news.category.name,
        }
        news_for_context.append(new_news)

    context = {
        'news_list': news_for_context,
    }

    html_string = render_to_string('news_digest.html', context=context)
    html = HTML(string=html_string)
    pdf = html.write_pdf()

    email = EmailMessage(
        'News digest', 'See pdf file in the attachment.', to=[email])
    email.attach('news_digest.pdf', pdf, 'application/pdf')
    email.send()
