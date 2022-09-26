# Web-scraper

Web-scraper es un proyecto que permite leer y analizar la información de los celulares smartphone proveidos por la pagina [Mercado Libre Argentina]('https://listado.mercadolibre.com.ar/celular-smarphones#D[A:celular%20smarphones]') y que cuentan con el servicio de Fullfilment, para de esta forma tener un mejor conocimiento de los mejores celulares smartphone y sus caracteristicas principales, ademas de precios y ofertas que nos ofrece la pagina para poder compararlos con otras opciones del mercado.

## Antes de empezar

1. Debes tener instalado el motor de Base de Datos SQL y una base de datos en la cual almacenar la información.
2. Tener instalado Node.js.

## Instalación y Uso

1. Clonar o descargar el proyecto a la maquina local.
2. Instalar las librerias con ayuda de npm

```bash
npm install
```

3. Puedes crear las tablas a usar con el query que se encuentra en la ruta `src/utils/database/creation-query.sql`.
4. Crear un archivo `.env` en la raiz del proyecto, copia el contenido del archivo `.env.example` y reemplaza las variables de la base de datos con tu conexión.
5. Ejecutar el proyecto

```bash
npm start
```

El proyecto se ejecuta en el puerto `3000` por defecto, puedes cambiarlo en la variable `PORT` en tu `.env`.

## Documentación

La documentación esta disponible en [Postman Docs](https://documenter.getpostman.com/view/9055833/2s83YSKTDH).

## Tecnologias usadas

* [Puppeteer](https://www.npmjs.com/package/puppeteer)
* [Scrape-it](https://www.npmjs.com/package/scrape-it)

## Autor

* [Cristhian Alonso Garcia Cruz](https://github.com/UnityFable)

## Contribuyentes
