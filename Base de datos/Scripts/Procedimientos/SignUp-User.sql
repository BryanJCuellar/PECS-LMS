-- Tipo de Mensaje Casos en los que aplica
-- 0 Cuando el procedimiento se ejecuta correctamente
-- 1 Cuando existen errores de Validación de parámetros de entrada NULL
-- 2 Cuando existen errores en validación de parámetros de entrada con tablas respectiva
-- 3 Cuando existen errores de condiciones de procedimientos
CREATE PROCEDURE SP_REGISTRAR_USUARIO(
	IN pnIdCategoriaUsuario INT,
	IN pcNombre VARCHAR(45),
	IN pcApellido VARCHAR(45),
	IN pcNumeroTelefono VARCHAR(45),
	IN pcCorreo VARCHAR(200),
	IN pcNombreUsuario VARCHAR(30),
	IN pcClave VARCHAR(90),
	IN pcCodigoConfirmacion VARCHAR(90),
	OUT pnIdUsuario BIGINT,
	OUT pnCodigoMensaje INT,
	OUT pcMensaje VARCHAR(500)
)
SP: BEGIN
	DECLARE vnIdUsuario, vnIdCorreo, vnIdTelefono BIGINT;
	DECLARE vnConteoCorreo, vnConteoNombreUsuario INT;
	
	SET pnIdUsuario = 0;
	SET pnCodigoMensaje = 0;
	SET pcMensaje = '';
	
	-- Verificar si correo ya esta registrado
	SELECT COUNT(*) INTO vnConteoCorreo FROM Correo
	WHERE descripcion = pcCorreo;
	
	IF vnConteoCorreo > 0 THEN
		SET pcMensaje = 'Correo ya registrado';
		SET pnCodigoMensaje = 2;
		LEAVE SP;
	END IF;
	
	-- Verificar si usuario ya esta registrado
	SELECT COUNT(*) INTO vnConteoNombreUsuario FROM Usuario
	WHERE nombreUsuario = pcNombreUsuario;
	
	IF vnConteoNombreUsuario > 0 THEN
		SET pcMensaje = 'Nombre de usuario ya registrado';
		SET pnCodigoMensaje = 2;
		LEAVE SP;
	END IF;
	
	-- Seleccionar el id de usuario para el nuevo registro
	SELECT IFNULL(MAX(idUsuario), 0) + 1 INTO vnIdUsuario FROM Usuario;
	-- Ingresar datos Usuario
	INSERT INTO `Usuario`(`idUsuario`,`nombre`,`apellido`,`nombreUsuario`,`clave`,`pais`,`zonaHoraria`,`idioma`,`fechaRegistro`,`codigoConfirmacion`,`estado`,`idCategoriaUsuario`)
	VALUES (vnIdUsuario,pcNombre,pcApellido,pcNombreUsuario,pcClave,"Honduras","America/Tegucigalpa","Español",CURRENT_TIMESTAMP(),pcCodigoConfirmacion,0,pnIdCategoriaUsuario);
	
	-- Seleccionar el id de correo para el nuevo registro
	SELECT IFNULL(MAX(idCorreo), 0) + 1 INTO vnIdCorreo FROM Correo;
	-- Ingresar datos Correo
	INSERT INTO `Correo`(`idCorreo`,`descripcion`,`correoSesion`,`idUsuario`) VALUES (vnIdCorreo,pcCorreo,1,vnIdUsuario);
	
	-- Seleccionar el id de telefono para el nuevo registro
	SELECT IFNULL(MAX(idTelefono), 0) + 1 INTO vnIdTelefono FROM Telefono;
	-- Ingresar datos Telefono
	INSERT INTO `Telefono`(`idTelefono`,`numeroTelefono`,`idUsuario`) VALUES (vnIdTelefono,pcNumeroTelefono,vnIdUsuario);
	
	SET pnIdUsuario = vnIdUsuario;
	SET pcMensaje = 'Registro realizado con exito';
	SET pnCodigoMensaje = 0;
END$$
	
	