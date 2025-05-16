# Documentación del Servicio de Autenticación con Facebook
## 1. Descripción General
El servicio AuthFirebaseService proporciona funcionalidades de autenticación utilizando Firebase Authentication, permitiendo múltiples métodos de inicio de sesión y gestión de usuarios.

## 2. Dependencias
- @angular/fire/auth : Para la autenticación con Firebase
- @angular/router : Para la navegación
- ngx-toastr : Para notificaciones

## 3. Características Principales
- Gestión de sesiones
- Manejo de errores personalizado
- Notificaciones al usuario

## 4. Métodos Principales
### Login con Facebook
```
async loginWithFacebook(): Promise<void> {
    try {
      await this.checkAndHandleExistingSession();
      const provider = new FacebookAuthProvider();
      provider.addScope('email');
      const result = await signInWithPopup(this.auth, provider);
      await this.handleSuccessfulLogin(result, 'Facebook');
    } catch (error: any) {
      if (error.message === 'login_cancelled') {
        this.toastr.info('Inicio de sesión cancelado');
        return;
      }
      await this.handleAuthError(error, 'Facebook');
    }
  }
```

## 5. Validación en el Backend
El backend utiliza un controlador específico para validar los tokens:
```
@RestController
@RequestMapping("/auth")
public class AuthController {
    private final FirebaseAuthService firebaseAuthService;

    public AuthController(FirebaseAuthService firebaseAuthService) {
        this.firebaseAuthService = firebaseAuthService;
    }

    @PostMapping("/validateToken")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String token) {
        try {
            String uid = firebaseAuthService.validateToken(token.replace("Bearer ", ""));
            return ResponseEntity.ok("Usuario autenticado con UID: " + uid);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token inválido o expirado");
        }
    }
}
```

## 6. Manejo de Errores
- Gestión de credenciales duplicadas
- Manejo de cancelación de inicio de sesión
- Notificaciones de error al usuario
- Registro de errores en consola
## 7. Funcionalidades Adicionales
- Verificación de sesiones existentes
- Vinculación de cuentas entre proveedores
- Restablecimiento de contraseña
- Eliminación de cuenta
## 8. Seguridad
- Validación de sesiones activas
- Confirmación de acciones críticas
- Manejo seguro de credenciales
- Protección contra accesos no autorizados
## 9. Navegación
- Redirección automática después del inicio de sesión
- Manejo de rutas protegidas
- Navegación post-autenticación