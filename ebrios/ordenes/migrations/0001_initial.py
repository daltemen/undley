# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('productos', '0001_initial'),
        ('licoreras', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('telefono', models.CharField(max_length=100, blank=True)),
                ('fechanacimiento', models.DateField(null=True, blank=True)),
                ('sexo', models.CharField(max_length=2, blank=True)),
                ('direccioncompleta', models.CharField(max_length=125, blank=True)),
                ('calle', models.CharField(max_length=125, blank=True)),
                ('carrera', models.CharField(max_length=125, blank=True)),
                ('essur', models.BooleanField(default=False)),
                ('eseste', models.BooleanField(default=False)),
                ('empiezapor', models.CharField(max_length=125, blank=True)),
                ('usuariocliente', models.OneToOneField(null=True, blank=True, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Clientes',
            },
        ),
        migrations.CreateModel(
            name='Cupon',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('serie', models.CharField(max_length=120, blank=True)),
                ('descuento', models.IntegerField(null=True, blank=True)),
            ],
            options={
                'verbose_name_plural': 'Cupones',
            },
        ),
        migrations.CreateModel(
            name='Cuponrelacion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('activo', models.BooleanField(default=True)),
                ('cliente', models.ForeignKey(blank=True, to='ordenes.Cliente', null=True)),
                ('cupon', models.ForeignKey(blank=True, to='ordenes.Cupon', null=True)),
            ],
            options={
                'verbose_name_plural': 'Cuponrelacion',
            },
        ),
        migrations.CreateModel(
            name='Orden',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('direccion_cliente', models.CharField(max_length=125, blank=True)),
                ('telefono_cliente', models.CharField(max_length=125, blank=True)),
                ('fechallegada', models.DateField(auto_now_add=True, null=True)),
                ('horallegada', models.TimeField(null=True, blank=True)),
                ('fechaenvio', models.DateField(null=True, blank=True)),
                ('horaenvio', models.TimeField(null=True, blank=True)),
                ('subtotal', models.DecimalField(null=True, max_digits=15, decimal_places=3, blank=True)),
                ('descuento', models.DecimalField(null=True, max_digits=15, decimal_places=3, blank=True)),
                ('total_compra', models.DecimalField(null=True, max_digits=15, decimal_places=3, blank=True)),
                ('estado', models.BooleanField(default=False)),
                ('observacion', models.CharField(max_length=255, blank=True)),
                ('cliente', models.ForeignKey(to_field=b'usuariocliente', blank=True, to='ordenes.Cliente', null=True)),
                ('licorera', models.ForeignKey(to_field=b'usuariolicorera', blank=True, to='licoreras.Licorera', null=True)),
            ],
            options={
                'verbose_name_plural': 'Ordenes',
            },
        ),
        migrations.CreateModel(
            name='Ordenrelacion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('cantidad', models.CharField(max_length=80, blank=True)),
                ('ordenes', models.ForeignKey(to='ordenes.Orden')),
                ('productos', models.ForeignKey(to='productos.Producto')),
            ],
        ),
        migrations.CreateModel(
            name='Rechazo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('motivo', models.CharField(max_length=255, blank=True)),
                ('fechareporte', models.DateField(null=True, blank=True)),
                ('horareporte', models.TimeField(null=True, blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='orden',
            name='pedido',
            field=models.ManyToManyField(to='productos.Producto', through='ordenes.Ordenrelacion', blank=True),
        ),
        migrations.AddField(
            model_name='orden',
            name='rechazado',
            field=models.OneToOneField(null=True, blank=True, to='ordenes.Rechazo'),
        ),
    ]
