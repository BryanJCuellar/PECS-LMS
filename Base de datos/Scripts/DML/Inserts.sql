-- CategoriaUsuario
INSERT INTO `CategoriaUsuario` (`idCategoriaUsuario`, `descripcion`) VALUES (1, "Administrador");
INSERT INTO `CategoriaUsuario` (`idCategoriaUsuario`, `descripcion`) VALUES (2, "Docente");
INSERT INTO `CategoriaUsuario` (`idCategoriaUsuario`, `descripcion`) VALUES (3, "Estudiante");

-- CategoriaPrograma
INSERT INTO `CategoriaPrograma` (`idCategoriaPrograma`, `codigoTipoPrograma`, `descripcion`, `estado`) VALUES (1, "CP-01", "Diplomados", 1);
INSERT INTO `CategoriaPrograma` (`idCategoriaPrograma`, `codigoTipoPrograma`, `descripcion`, `estado`) VALUES (2, "CP-02", "Cursos", 1);
INSERT INTO `CategoriaPrograma` (`idCategoriaPrograma`, `codigoTipoPrograma`, `descripcion`, `estado`) VALUES (3, "CP-03", "Talleres", 1);
INSERT INTO `CategoriaPrograma` (`idCategoriaPrograma`, `codigoTipoPrograma`, `descripcion`, `estado`) VALUES (4, "CP-04", "Simposios", 1);
INSERT INTO `CategoriaPrograma` (`idCategoriaPrograma`, `codigoTipoPrograma`, `descripcion`, `estado`) VALUES (5, "CP-05", "Congresos", 1);
INSERT INTO `CategoriaPrograma` (`idCategoriaPrograma`, `codigoTipoPrograma`, `descripcion`, `estado`) VALUES (6, "CP-06", "Webinars", 1);

-- CategoriaPregunta
INSERT INTO `CategoriaPregunta` (`idCategoriaPregunta`, `descripcion`) VALUES (1, "Elección múltiple");
INSERT INTO `CategoriaPregunta` (`idCategoriaPregunta`, `descripcion`) VALUES (2, "Verdadero/Falso");
INSERT INTO `CategoriaPregunta` (`idCategoriaPregunta`, `descripcion`) VALUES (3, "Rellenar el espacio en blanco");
INSERT INTO `CategoriaPregunta` (`idCategoriaPregunta`, `descripcion`) VALUES (4, "Respuestas múltiples");
INSERT INTO `CategoriaPregunta` (`idCategoriaPregunta`, `descripcion`) VALUES (5, "Coincidencia");
INSERT INTO `CategoriaPregunta` (`idCategoriaPregunta`, `descripcion`) VALUES (6, "Respuesta numérica");
INSERT INTO `CategoriaPregunta` (`idCategoriaPregunta`, `descripcion`) VALUES (7, "Pregunta de desarrollar");