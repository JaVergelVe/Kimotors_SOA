# Documentación del Sistema de Autenticación y Registros de Login

## Servicio de Autenticación - Funciones de Registro de Actividad

El servicio de autenticación proporciona funcionalidades para registrar y consultar actividades de inicio de sesión.

### Funciones Principales

#### `formatDateTime(date: Date): string`
Formatea una fecha al formato ISO requerido por el backend.

**Parámetros:**
- `date`: Objeto Date a formatear

**Retorna:**
- String en formato `YYYY-MM-DDThh:mm:ss`

#### `registerLoginActivity(loginRecord: LoginRecord): Observable<any>`
Registra una nueva actividad de inicio de sesión en el sistema.

**Parámetros:**
- `loginRecord`: Objeto con la información del registro de login
  ```typescript
  interface LoginRecord {
    username: string;
    email: string;
    provider: string;
    loginTimestamp: Date;
    activityType: 'login' | 'logout';
  }
  ```

#### `getAllLoginRecords(): Observable<LoginRecord[]>`
Obtiene todos los registros de actividad de inicio de sesión.

## Componente de Registros de Login

El componente de registros de login muestra y filtra el historial de inicios de sesión.

### Funcionalidades Principales

#### Propiedades
- `loginRecords`: Array que almacena los registros de login
- `loginRecordAux`: Copia de respaldo para filtrado
- `email`: String para filtrar por correo
- `date`: String para filtrar por fecha

#### Métodos

##### `getLoginRecords()`
Obtiene todos los registros de login del servicio y los almacena en el componente.

##### `filtrarUsuario(event: Event)`
Filtra los registros por correo electrónico.

**Parámetros:**
- `event`: Evento del input de búsqueda

##### `filtrarUsuarioFecha(event: Event)`
Filtra los registros por fecha.

**Parámetros:**
- `event`: Evento del input de fecha

### Vista del Componente

El componente incluye:
- Campo de búsqueda por correo electrónico
- Selector de fecha para filtrar
- Lista de registros que muestra:
  - Nombre de usuario
  - Correo electrónico
  - Tipo de actividad
  - Proveedor de autenticación
  - Fecha y hora del evento