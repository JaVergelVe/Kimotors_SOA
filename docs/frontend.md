# Frontend Kimotors

Documentación del frontend desarrollado en Angular, incluyendo la estructura de carpetas, la configuración del entorno y como ejecutar el proyecto

## Configuracion del entorno

**Node.js y npm:**
- Descarga e instala Node.js. Esto incluye npm (Node Package Manager).
- Verifica la instalación con:

```bash
node -v
npm -v
```

**Angular CLI:**
Instala dependencias de Angular:

```bash
npm install
```

## Rutas de carpetas

src/<br>
&emsp;├── app/<br>
&emsp;&emsp;├── components/                             // Carpeta para los componentes<br>
&emsp;&emsp;&emsp;├── login/                              // Componente de inicio de sesión<br>
&emsp;&emsp;&emsp;&emsp;├── login.component.ts              // Lógica del componente<br>
&emsp;&emsp;&emsp;&emsp;├── login.component.html            // Plantilla del componente<br>
&emsp;&emsp;&emsp;&emsp;├── login.component.css             // Estilos del componente<br>
&emsp;&emsp;&emsp;&emsp;└── login.component.spec.ts         // Pruebas del componente<br>
&emsp;&emsp;&emsp;├── register/                           // Componente de registro<br>
&emsp;&emsp;&emsp;&emsp;├── register.component.ts           // Lógica del componente<br>
&emsp;&emsp;&emsp;&emsp;├── register.component.html         // Plantilla del componente<br>
&emsp;&emsp;&emsp;&emsp;├── register.component.css          // Estilos del componente<br>
&emsp;&emsp;&emsp;&emsp;└── register.component.spec.ts      // Pruebas del componente<br>
&emsp;&emsp;&emsp;└── main-page/                          // Componente de la página principal<br>
&emsp;&emsp;&emsp;&emsp;├── main-page.component.ts          // Lógica del componente<br>
&emsp;&emsp;&emsp;&emsp;├── main-page.component.html        // Plantilla del componente<br>
&emsp;&emsp;&emsp;&emsp;├── main-page.component.css         // Estilos del componente<br>
&emsp;&emsp;&emsp;&emsp;└── main-page.component.spec.ts     // Pruebas del componente<br>
&emsp;├── app.routes.ts                           // Configuración de rutas<br>
&emsp;├── app.config.ts                           // Módulo principal de la aplicación<br>
&emsp;├── app.component.ts                        // Lógica del componente<br>
&emsp;├── app.component.css                       // Estilos del componente<br>
&emsp;├── app.component.specs.ts                  // Pruebas del componente<br>
&emsp;└── app.component.html                      // Plantilla del componente<br>
├── index.html                                  // Plantilla del proyecto<br>
├── style.css                                   // Estilos del proyecto<br>
└── main.ts                                     // Lógica del proyecto