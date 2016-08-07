# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('licoreras', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='zona',
            name='costoenvio',
            field=models.IntegerField(default=5000, blank=True),
        ),
        migrations.AddField(
            model_name='zona',
            name='efectivo',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='zona',
            name='tarjeta',
            field=models.BooleanField(default=True),
        ),
    ]
