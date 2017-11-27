import json
from datetime import datetime

from django.views import View
from django.http import HttpResponse, HttpResponseBadRequest
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from . models import Category

from . import tasks


@method_decorator(csrf_exempt, name='dispatch')
class DigestView(View):
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        try:
            params = json.loads(request.body.decode("utf-8"))
            email = params['email']
            date_from = datetime.fromtimestamp(params['date_from'])
            date_to = datetime.fromtimestamp(params['date_to'])
            categories = params['categories']
        except (KeyError, TypeError, json.decoder.JSONDecodeError):
            return HttpResponseBadRequest(
                json.dumps({'result': 'error'}),
                content_type='application/json')

        tasks.render_to_pdf_and_send.delay(
            email, date_from, date_to, categories)

        return HttpResponse(
            json.dumps({'result': 'ok'}),
            content_type='application/json')


class CategoryView(View):
    def get(self, request, *args, **kwargs):
        categories = [{'name': category.name, 'id': category.id}
                      for category in Category.objects.all().order_by('name')]
        return HttpResponse(
            json.dumps(categories), content_type='application/json')
