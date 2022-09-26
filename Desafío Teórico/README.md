# Desafío Teórico

## Proceso, hilos y corrutinas

1. Un caso en el que usarías procesos para resolver un problema y por qué.

* Problema: Calcular el área de un cubo.
* En este caso se crea un programa que ejecute una función que reciba como parámetro el lado del cubo a calcular y se obtiene como respuesta el área calculada. En este caso la función es el proceso que me permite calcular el área del cubo dado.

2. Un caso en el que usarías threads para resolver un problema y por qué.

* Problema: Obtener la información de 10 usuarios.
* En este caso haria uso de threads para obtener de forma simultanea la información de cada usuario por separado y permitir al programa en ejecución procesar dicha información en el momento que llegue y no esperando que se termine de consultar la información de cada uno.

3. Un caso en el que usarías corrutinas para resolver un problema y por qué.

* Problema: Obtener la información de un usuario para saber si puede aplicar a un subsidio de vivienda.
* En este caso necesito hacer uso de una corrutina al momento de obtener la información del usuario antes de empezar a validar si es apto o no para aplicar a un subsidio de vivienda, la corrutina me permite asegurar la información del usuario antes de empezar a procesar sus estados financieros.

## Optimización de recursos del sistema operativo

* Si tuvieras 1.000.000 de elementos y tuvieras que consultar para cada uno de ellos información de una API HTTP. ¿Cómo lo harías? Explicar.
* Para optimizar la utilización de recursos del sistema operativo al momento de realizar la consulta de los elementos separaria los elementos a consultar en lotes, de esta forma permito al sistema operativo liberar los recursos usados en cada consulta antes de ejecutar la siguiente, esto tambien permite que la información pueda ser presentada en el momento que es consultado cada lote y no esperando una respuesta de toda la información, que puede causar que el sistema se quede sin recursos y detenga el proceso.