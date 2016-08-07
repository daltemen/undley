# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('licoreras', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=120, null=True, blank=True)),
            ],
            options={
                'verbose_name_plural': 'Categorias',
            },
        ),
        migrations.CreateModel(
            name='Marca',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=120, null=True, blank=True)),
                ('imagen', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name_plural': 'Marcas',
            },
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('precio', models.DecimalField(max_digits=15, decimal_places=0, blank=True)),
                ('referencia', models.CharField(max_length=125, null=True, blank=True)),
                ('disponible', models.BooleanField(default=True)),
                ('borrado', models.BooleanField(default=False)),
                ('imagen', models.CharField(max_length=500, null=True, blank=True)),
                ('categoria', models.ForeignKey(blank=True, to='productos.Categoria', null=True)),
                ('licorera', models.ForeignKey(blank=True, to='licoreras.Licorera', null=True)),
                ('marca', models.ForeignKey(blank=True, to='productos.Marca', null=True)),
            ],
            options={
                'verbose_name_plural': 'Productos',
            },
        ),
        migrations.CreateModel(
            name='Subcategoria',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=120)),
                ('categoria', models.ForeignKey(blank=True, to='productos.Categoria', null=True)),
            ],
            options={
                'verbose_name_plural': 'Subcategorias',
            },
        ),
        migrations.CreateModel(
            name='Tamano',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=120, null=True, blank=True)),
            ],
            options={
                'verbose_name_plural': 'Tamanos',
            },
        ),
        migrations.AddField(
            model_name='producto',
            name='subcategoria',
            field=models.ForeignKey(blank=True, to='productos.Subcategoria', null=True),
        ),
        migrations.AddField(
            model_name='producto',
            name='tamano',
            field=models.ForeignKey(blank=True, to='productos.Tamano', null=True),
        ),
        migrations.AddField(
            model_name='marca',
            name='subcategoria',
            field=models.ForeignKey(blank=True, to='productos.Subcategoria', null=True),
        ),
        migrations.AddField(
            model_name='marca',
            name='tamano',
            field=models.ManyToManyField(to='productos.Tamano', blank=True),
        ),
    ]
