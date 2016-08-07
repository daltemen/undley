# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Licorera',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('razon_social', models.CharField(max_length=120)),
                ('nit', models.CharField(max_length=120)),
                ('direccion', models.CharField(max_length=120)),
                ('representante', models.CharField(max_length=120)),
                ('celular', models.CharField(max_length=120)),
                ('celular_alternativo', models.CharField(max_length=120)),
                ('montominimo', models.IntegerField(null=True, blank=True)),
                ('usuariolicorera', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Licoreras',
            },
        ),
        migrations.CreateModel(
            name='Zona',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('carreramenor', models.IntegerField(blank=True)),
                ('carreramayor', models.IntegerField(blank=True)),
                ('callemenor', models.IntegerField(blank=True)),
                ('callemayor', models.IntegerField(blank=True)),
                ('essur', models.BooleanField(default=False)),
                ('eseste', models.BooleanField(default=False)),
                ('disponible', models.BooleanField(default=False)),
                ('ciudad', models.CharField(max_length=120, blank=True)),
                ('licorera', models.ForeignKey(blank=True, to='licoreras.Licorera', null=True)),
            ],
            options={
                'verbose_name_plural': 'Zonas',
            },
        ),
    ]
