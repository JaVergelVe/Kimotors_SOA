# Backend Kimotors

Documentacion relacionada con la estructura de carpetas de un proyecto Spring Boot y la configuración del entorno utilizando Maven, Java Corretto 17, Spring Boot 3.4.3 y IntelliJ IDEA.

## Configuracion del entorno

**Java Corretto 17:**
- Descarga e instala Amazon Corretto 17.
- Configura la variable de entorno JAVA_HOME para que apunte a la instalación de Corretto 17.

**IntelliJ IDEA:**
- Descarga e instala IntelliJ IDEA Community o Ultimate.

**Maven:**
- IntelliJ IDEA incluye Maven.
- Configura la variable de entorno MAVEN_HOME si lo instalas manualmente.

**MongoDB:**
- Instala MongoDB Community Edition.
- Asegúrarse de que el servicio de MongoDB esté en ejecución.

### Configura el proyecto:

- **Project SDK:** Selecciona Java Corretto 17.
- **Name:** Backend_Kimotors.
- **Type:** Maven.
- **Language:** Java.
- **Packaging:** Jar.
- **Java Version:** 17.

### Dependencias:
- **Spring Web:** Para crear APIs RESTful.
- **Spring Data MongoDB:** Para interactuar con MongoDB.
- **Spring Boot DevTools:** Para desarrollo rápido.
- **Lombok:** Para reducir código boilerplate.

## Rutas de carpetas

src/  
&emsp;├── main/  
&emsp;&emsp;├── java/  
&emsp;&emsp;&emsp;└── Kimotors/  
&emsp;&emsp;&emsp;&emsp;└── Backend_kimotors/  
&emsp;&emsp;&emsp;&emsp;&emsp;├── config/               // Configuraciones globales (ej: seguridad, beans)  
&emsp;&emsp;&emsp;&emsp;&emsp;├── controller/           // Controladores (API REST)  
&emsp;&emsp;&emsp;&emsp;&emsp;├── model/                // Entidades (clases que representan datos)  
&emsp;&emsp;&emsp;&emsp;&emsp;├── repository/           // Repositorios (acceso a datos)  
&emsp;&emsp;&emsp;&emsp;&emsp;├── service/              // Lógica de negocio  
&emsp;&emsp;&emsp;&emsp;&emsp;└── Application.java      // Clase principal de Spring Boot  
&emsp;&emsp;└── resources/  
&emsp;&emsp;&emsp;├── static/                           // Archivos estáticos (CSS, JS, imágenes)  
&emsp;&emsp;&emsp;├── templates/                        // Plantillas  
&emsp;&emsp;&emsp;└── application.properties            // Configuración de la aplicación  
└── test/  
&emsp;&emsp;└── java/  
&emsp;&emsp;&emsp;└── Kimotors/  
&emsp;&emsp;&emsp;&emsp;└── Backend_kimotors/  
&emsp;&emsp;&emsp;&emsp;&emsp;├── controller/           // Pruebas de controladores  
&emsp;&emsp;&emsp;&emsp;&emsp;├── service/              // Pruebas de servicios  
&emsp;&emsp;&emsp;&emsp;&emsp;└── ApplicationTests.java // Pruebas de la aplicación  