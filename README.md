# Kimotors_SOA

Kimotors es una aplicación web que permite a los usuarios explorar una amplia variedad de motocicletas, consultar información detallada sobre cada modelo, realizar comparaciones entre motos y dejar comentarios sobre su experiencia.

## Objetivo

Desarrollar una plataforma web integral que combine un repositorio de motos con un sistema de autenticación de usuarios, con el propósito de brindar información detallada, comparativas y retroalimentación de la comunidad, facilitando así la toma de decisiones de compra y fomentando la interacción entre entusiastas del mundo de las motos.

## Alcance del Proyecto

El proyecto consiste en el desarrollo de una plataforma web que combina un repositorio de motos con un sistema de autenticación de usuarios. La plataforma permitirá a los usuarios explorar un catálogo completo de motos, comparar modelos y compartir sus opiniones a través de comentarios y valoraciones. El alcance incluye el diseño y desarrollo del frontend en Angular, el backend en Spring Boot y la base de datos en MongoDB, así como la documentación técnica y de usuario.

## Problemática

En la actualidad, las personas interesadas en comprar una motocicleta enfrentan varios desafíos al buscar información confiable y detallada sobre los diferentes modelos disponibles en el mercado. La información suele estar dispersa en múltiples fuentes, como sitios web de concesionarios, foros y redes sociales, lo que dificulta la comparación objetiva de características técnicas, precios y opiniones de otros usuarios. Además, la falta de una plataforma centralizada que permita a los usuarios compartir sus experiencias y retroalimentación limita la capacidad de los compradores para tomar decisiones informadas.

Por otro lado, los concesionarios y fabricantes de motos carecen de un espacio dedicado donde puedan promocionar sus modelos y recibir comentarios directos de los clientes. Esto dificulta la conexión entre oferta y demanda, así como la mejora continua de los productos y servicios basados en las necesidades reales de los usuarios. La falta de una herramienta que facilite la interacción entre compradores, aficionados y vendedores representa una oportunidad perdida para fomentar una comunidad activa y comprometida en el mundo de las motos.

En este contexto, surge la necesidad de una plataforma integral que centralice la información sobre motos, permita comparaciones detalladas y fomente la participación de la comunidad a través de comentarios y valoraciones. Esta solución no solo beneficiaría a los compradores, sino también a los vendedores y aficionados, creando un ecosistema donde todos puedan interactuar y enriquecerse mutuamente.

## Impacto Esperado

El desarrollo de esta plataforma tendrá un impacto significativo en la experiencia de los usuarios interesados en el mundo de las motos. Al centralizar la información y ofrecer herramientas de comparación, los compradores podrán tomar decisiones más informadas y seguras, reduciendo la incertidumbre y el tiempo invertido en la búsqueda de datos. Además, la posibilidad de leer comentarios y valoraciones de otros usuarios generará confianza y transparencia en el proceso de compra.

Para los aficionados y entusiastas, la plataforma se convertirá en un espacio de interacción y aprendizaje, donde podrán compartir sus experiencias, opiniones y consejos. Esto fomentará una comunidad activa y comprometida, enriqueciendo el conocimiento colectivo sobre motos y creando un sentido de pertenencia entre los usuarios.

Por otro lado, los concesionarios y fabricantes se beneficiarán al tener un canal directo para promocionar sus modelos y recibir retroalimentación valiosa de los clientes. Esto les permitirá ajustar sus productos y servicios según las necesidades del mercado, mejorando su competitividad y relación con los consumidores.

## Tecnologías utilizadas

- **Spring Boot** (Backend)
- **Angular** (Frontend)
- **MongoDB** (Base de datos NoSQL)

## Características principales

- Exploración de diferentes tipos de motocicletas.
- Consulta de especificaciones detalladas de cada modelo.
- Comparación de motos para facilitar la elección de los usuarios.
- Sistema de comentarios donde los usuarios pueden compartir sus opiniones y experiencias.

## Clonar el repositorio

```bash
git clone https://github.com/JaVergelVe/Kimotors_SOA.git
```

## Ramas del proyecto

- **Main:** Rama principal y estable para producción.
- **Develop:** Rama para pruebas e integración de nuevas funcionalidades.
- **Feature_Emilio:** Rama de desarrollo asignada a Emilio para implementar nuevas características.
- **Feature_Julian:** Rama de desarrollo asignada a Julian para implementar nuevas características.

Main<br>
└── Develop<br>
&emsp;&emsp;├── Feature_Emilio<br>
&emsp;&emsp;└── Feature_Julian

## Enlace con Jira

Este proyecto está vinculado al tablero de Jira: [Kimotors_SOA](https://javergelve.atlassian.net/jira/software/projects/SOA/boards/4?atlOrigin=eyJpIjoiMTljMmE2YjhiMjVjNDdmNWI5NGQzMWNmOGRiODM0MGEiLCJwIjoiaiJ9) para la gestión ágil del desarrollo.

## Colaboradores

- Jesus Emilio Osorio: Encargado de crear interfaz de la pagina principal y la pagina para comparar motos en angular.
- Julian Andres Vergel: Encargado de crear la coleccion de los usuarios en la base de datos, realizar el backend realicionado con los usuarios en spring boot y crear la interfaz de inicio de sesion y registro en angular.