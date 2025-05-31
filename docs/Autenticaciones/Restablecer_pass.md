# Documentación del Proceso de Restablecimiento de Contraseña

## 1. Descripción General
El sistema implementa un proceso seguro de restablecimiento de contraseña utilizando Firebase Authentication, que incluye validación de usuarios existentes y manejo de múltiples proveedores de autenticación.

## 2. Flujo del Proceso
### 2.1 Inicio del Proceso
1. El usuario solicita restablecer su contraseña proporcionando su email
2. El sistema verifica si la cuenta existe
3. Se envía un correo electrónico con el enlace de restablecimiento
4. El usuario recibe y accede al enlace
5. El usuario establece una nueva contraseña

### 2.2 Advertencias y Confirmaciones
- Se muestra una advertencia sobre la pérdida de vinculaciones con proveedores sociales
- Se requiere confirmación explícita del usuario antes de proceder
- Se notifica al usuario sobre el estado del proceso

## 3. Implementación
### 3.1 Envío de Email de Recuperación
```
async sendPasswordResetEmail(email: string): Promise<void> {
    const confirmar = window.confirm(
      `ADVERTENCIA: Si esta cuenta está vinculada con proveedores sociales 
      (Google, Facebook, GitHub):\n\n` +
      `Al restablecer la contraseña, las vinculaciones con estos proveedores 
      se perderán por razones de seguridad.\n` +
      `Después de restablecer la contraseña, necesitarás volver a vincular 
      estos proveedores desde tu perfil.\n\n` +
      `¿Deseas continuar con el restablecimiento de contraseña?`
    );
    
    if (!confirmar) {
      this.toastr.info('Restablecimiento de contraseña cancelado');
      return;
    }
    
    try {
      await sendPasswordResetEmail(this.auth, email);
      this.toastr.success('Se ha enviado un correo para restablecer la 
      contraseña');
    } catch (error) {
      console.error('Error al enviar el email de recuperación:', error);
      this.toastr.error('Error al enviar el email de recuperación');
      throw error;
    }
}
```

### 3.2 Confirmación de Nueva Contraseña
```
resetPasswordWithFirebase(oobCode: string, newPassword: string): 
Promise<void> {
    return confirmPasswordReset(this.auth, oobCode, newPassword);
}
```

## 4. Consideraciones de Seguridad
### 4.1 Validaciones
- Verificación de la existencia del usuario
- Confirmación de acciones críticas
- Manejo seguro de tokens de restablecimiento
- Validación de contraseñas nuevas

### 4.2 Proveedores Sociales
- Advertencia sobre la pérdida de vinculaciones
- Proceso de re-vinculación posterior
- Gestión de múltiples proveedores

## 5. Manejo de Errores
### 5.1 Tipos de Errores Manejados
- Usuario no encontrado
- Email inválido
- Errores de red
- Tokens expirados
- Errores en el proceso de restablecimiento

### 5.2 Respuesta a Errores
- Mensajes de error claros al usuario
- Registro de errores en consola
- Notificaciones mediante toastr
- Opciones de recuperación alternativas

## 6. Recomendaciones de Uso
1. Mantener actualizada la dirección de correo electrónico
2. Verificar la bandeja de spam para el correo de restablecimiento
3. Seguir las instrucciones del correo de manera precisa
4. Considerar la re-vinculación de proveedores sociales después del restablecimiento