const { query } = require('express');
const pool = require('../../db/conectDB.js')
const view = module.exports;

// Información primordial

// mostar tablas -- Desarrollo 
view.tables = async(req,res)=>{
    try {
        pool.query("SHOW TABLES", async (err,result)=>{
            if(err) throw err;
            await res.send(result);
        })
    } catch (error) {
        console.error(error);
    };
};

view.categories = async(req,res)=>{
    try {
        pool.query("SELECT * FROM Categoria", async (err,result)=>{
            if(err) throw err;
            await res.send(result);
        })
    } catch (error) {
        console.error(error);
    };
}

view.intentos = async(req,res)=>{
    try {
        pool.query("SELECT * FROM Intento", async (err,result)=>{
            if(err) throw err;
            await res.send(result);
        })
    } catch (error) {
        console.error(error);
    };
};

    // INFO COMPLETA POSVENTA
    view.manyInfoPosventa = async(req,res)=>{
        try {
            let {user,curse}=req.params;
            pool.query(`SELECT idUsuario, Nombre, sexo, id_usuario_intentos, Status ,Intento_actual, Nombre_moto, Max_intentos, Logo, Pagina_Curso, Img_actividad,Nombre_actividad,Url_nivel, idActividades, Moto.id as motoID, Actividad.Material FROM Usuario 
            INNER JOIN Usuario_has_Intento on Usuario.idUsuario = Usuario_has_Intento.Usuario_idUsuario
            INNER JOIN Moto on Usuario_has_Intento.id_moto = Moto.id
            INNER JOIN Actividad on Moto.id = Actividad.Moto_id
            WHERE Usuario.idUsuario=? and Moto.id=? ORDER BY Usuario_has_Intento.id_usuario_intentos DESC LIMIT 1`,[user,curse], async (err,result)=>{
                if(err) throw err;
                if(result.length==0){
                    res.status(404).json({
                        message:`No se ha logrado concretar la consulta de la información de posventa`,
                    });
                }else{
                    res.send(result);
                    console.log(`Se consultó el resultado de la inforamción del usuario ID ${user} y curso ID ${curse} para Posventa`)
                };
                
            })
        } catch (error) {
            console.error(error);
        }
    };

    // INFO Usuario Y moto Posventa
    view.someInfoPosventa= async(req,res)=>{
        try {
            let {user,curse}=req.params;
            pool.query(`SELECT Usuario.idUsuario, sexo, Usuario.Nombre, Moto.Nombre_moto, Moto.id , Img_actividad FROM Usuario , Moto
                        Where Usuario.idUsuario=? and Moto.id =?`,[user,curse], async (err,result)=>{
                if(err) throw err;

                if(result.length==0){
                    res.status(404).json({
                        message:`No se ha logrado concretar la consulta de la información de posventa`,
                    });
                }else{
                    res.send(result);
                    console.log(`Se consultó solo la información del usuario ID ${user} y curso ID ${curse} para Posventa`)
                };
                
            })
        } catch (error) {
            console.error(error);
        }
    };

    // PREGUNTAS RANDOM POSVENTA
    view.questionsRandomPosventa = async(req,res)=>{
        try {
            let {activityId}=req.params
            pool.query(`SELECT * FROM Pregunta_actividad
                        WHERE Actividad_idActividades = ? ORDER BY RAND() LIMIT 8`,[activityId],async(err,result)=>{
                if(err) throw err;
                res.send(result)
            })
        } catch (error) {
            console.log(error)
        }
    };

    // RESPUESTAS RANDOM DE POSVENTA
    view.answersRandomPosventa = async (req,res)=>{
        try {
            let{questionID}=req.params
            pool.query(`SELECT * FROM Respuesta_actividad
                        WHERE Pregunta_actividad_idPregunta_actividad = ? ORDER BY RAND()`,[questionID],async(err,result)=>{
                if(err)throw err;
                res.send(result);
            });
        } catch (error) {
            console.log(error)
        };
    };

    // Ver info de intentos Limit 1!
    view.intentosEachUser =async (req,res)=>{
        try {
            let {id,curseId} = req.params;
            pool.query(`SELECT * FROM Usuario_has_Intento
                        INNER JOIN Moto ON Usuario_has_Intento.id_moto = Moto.id
                        WHERE Usuario_idUsuario = ? and id_moto = ?
                        ORDER BY id_usuario_intentos DESC LIMIT 1`,[id, curseId
            ], async (err,result)=>{
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay Intentos para el Curso ${curseId} cuando el Usuario tiene ID: ${id}`,
                        curseId:`${curseId}`,
                        id_user:`${id}`,
                        error_Status: 404
                    });
                } else{
                    await res.send(result);
                    console.log(`Ver User ID:${id} Exitoso`);
                };
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Ver información del usuario
    view.users = async(req,res)=>{
        try {
            pool.query("SELECT * FROM Usuario ", async (err,result)=>{
                if(err) throw err;
                    await res.send(result);
                    console.log(`Ver todos los usuarios`);
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Ver información del usuario -- solo un resultado
    view.user = async(req,res)=>{
        try {
            let {id} = req.params;
            pool.query("SELECT * FROM Usuario WHERE idUsuario =?",id, async (err,result)=>{
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido para el Usuario con ID: ${id}`,
                        error_Status: 404
                    });
                } else{
                    await res.send(result[0]);
                    console.log(`Ver User ID:${id} Exitoso`);
                };
            });
        } catch (error) {
            console.error(error);
        }
    };

    //Ver Cursos filtrado por ID Moto
    view.curso = async(req,res)=>{
        try {
            let {id} = req.params;
            pool.query("SELECT * FROM Moto WHERE id=?",id, async (err,result)=>{
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido para la moto con ID: ${id}`,
                        error_Status: 404
                    });
                    console.log(`Error Status 404 para la Moto ID ${id} No existe en Base de datos`)
                } else{
                    await res.send(result[0]);
                    console.log(`Ver moto ID:${id} Exitoso`);
                };
            });
        } catch (error) {
            console.error(error);
        }
    };

    //Ver todos los cursos
    view.cursos = async(req,res)=>{
        try {

            pool.query("SELECT * FROM Moto", async (err,result)=>{
                if(err) throw err;
                await res.send(result);
                console.log('Todos los cursos fueron consultados')
            });

        } catch (error) {
            console.error(error);
        }
    };

    //Ver el listado de todas las actividades dispponibles
    view.allActivities = async(req,res)=>{
        try {
            pool.query("SELECT * FROM Actividad", async (err,result)=>{
                if(err) throw err;
                await res.send(result);
            });
        } catch (error) {
            console.error(error);
        };
    };

    //Actividades por ID Moto
    view.activities = async(req,res)=>{
        try {
            let {id} = req.params;
            pool.query("SELECT * FROM Actividad WHERE Moto_id =?",id, async (err,result)=>{
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido para la actividad con ID_MOTO: ${id}`,
                        error_Status: 404
                    });
                } else{
                    await res.send(result);
                };
            });
        } catch (error) {
            console.error(error);
        };
    };


    //Todas las preguntas de las actividaades
    view.questionsActivities = async(req,res) =>{
        try {
            pool.query("SELECT * FROM Pregunta_actividad", async (err,result)=>{
                if(err) throw err;
                await res.send(result);
            });
        } catch (error) {
            console.error(error);
        };
    };

    //Ver Las preguntas y respuestas de las actividades por ID Actividad
    view.AnswersAndQuestions = async (req,res) =>{
        try {
            let {idCurso} =req.params
            pool.query(`SELECT * FROM Pregunta_actividad 
                        INNER JOIN Respuesta_actividad ON Pregunta_actividad.idPregunta_actividad = Respuesta_actividad.Pregunta_actividad_idPregunta_actividad
                        WHERE Actividad_idActividades = ?`,idCurso,async(err,result)=>{
                            if (err) throw err;
                            await res.send(result);
                            console.log(`Se consultaron las preguntas y las respuestas de la actividad con ID ${idCurso}`)
                        });
        } catch (error) {
            console.error(error);
        }
    };

    //Todas las preguntas por el Id de la activdad
    view.questionsEachActivity = async(req,res) =>{
        try {
            let {idActivity} = req.params;
            pool.query("SELECT * FROM Pregunta_actividad WHERE Actividad_idActividades =? ORDER BY RAND()",idActivity, async (err,result)=>{
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido para la actividad con ID_MOTO: ${idActivity}`,
                        error_Status: 404
                    });
                } else{
                    await res.send(result);
                };
            });
        } catch (error) {
            console.error(error);
        };
    };

    //Todas las respuestas de las actividades 
    view.answersActivity = async(req,res)=>{
        try {
            pool.query("SELECT * FROM Respuesta_actividad", async (err,result)=>{
                if(err) throw err;
                await res.send(result);
            });
        } catch (error) {
            console.error(error);
        };
    };

    //Todas las respuestas disponibles filtrado por el ID de lña pregunta
    view.answersActivityEachQuestion = async(req,res)=>{

        try {
            let {id_question} = req.params;
            pool.query("SELECT * FROM Respuesta_actividad WHERE Pregunta_actividad_idPregunta_actividad =? ORDER BY RAND();",id_question, async (err,result)=>{
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido para las respuestas de la pregunta ${id_question}`,
                        error_Status: 404
                    });
                    console.log(`No hay contenido para las respuestas de la pregunta ${id_question} Status: 404`);
                } else{
                    await res.send(result);
                    console.log(`Se consultó el contenido para las respuestas de la pregunta ${id_question}`);
                };
            });
        } catch (error) {
            console.error(error);
        };

    };

    //Respuestas mandadas por el usuario
    view.answersEachUsers = async (req,res)=>{
        try {
            pool.query("SELECT * FROM Usuario_has_Pregunta_actividad", async (err,result)=>{
                if(err) throw err;
                await res.send(result);
            });
        } catch (error) {
            console.error(error);
        };
    };

    //REspuestas de un usuario filtrado por la ID actividad y por el intento actual
    view.answerFilterActivityAttemp = async(req,res)=>{
        try {
            let{idUser,idActividad,idIntento}=req.params;
            pool.query(`SELECT AVG(Calificacion)*100 as Promedio FROM Usuario_has_Pregunta_actividad
                        INNER JOIN Pregunta_actividad ON Usuario_has_Pregunta_actividad.Pregunta_actividad_id=  Pregunta_actividad.idPregunta_actividad 
                        WHERE Usuario_idUsuario= ? and Intento_idIntento= ? and Actividad_idActividades = ?`,[idUser,idActividad,idIntento],async(err,result)=>{
                            if (err) throw err;
                            if(result.length == 0){
                                res,send({
                                    status:404,
                                    message:`consulta Respuestas del usuario ID ${idUser} para la actividad ID ${idActividad} en su intento ${idIntento}`,
                                    Usuario: idUser,
                                    Actividad: idActividad,
                                    Inteto: idIntento
                                })
                                console.log(`Status 404, consulta Respuestas del usuario ID ${idUser} para la actividad ID ${idActividad} en su intento ${idIntento}`)
                            }else{
                                res.send(result);
                                console.log(`Consultaron el promedio del usuario ID ${idUser} para la actividad ID ${idActividad} en su intento ${idIntento}`)
                            };
                        });

        } catch (error) {
            console.log(error)
        }
    }

    //Respuestas mandadas por usuario Filtrado por ID Usuario
    view.answersForUser = async (req,res)=>{
        try {
            let {id_user} = req.params
            pool.query("SELECT * FROM Usuario_has_Pregunta_actividad WHERE Usuario_idUsuario=?",id_user, async (err,result)=>{
                if(err) throw err;
                await res.send(result);
            });
        } catch (error) {
            console.error(error);
        };
    };

    //Ver todos los resultados
    view.activitiesResults = async(req,res)=>{
        try {
            pool.query("SELECT * FROM Usuario_has_Actividad", async (err,result)=>{
                if(err) throw err;
                await res.send(result);
            });
        } catch (error) {
            console.error(error);
        };
    };

    //Ver el resultado por actividad
    view.activitiesResultEachCurso = async(req,res)=>{
        try {
            let {activity_id} = req.params;
            pool.query("SELECT * FROM Usuario_has_Actividad WHERE Actividad_idActividades = ? ",activity_id, async (err,result)=>{
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido disponible para esta consulta id ${activity_id}`,
                        error_Status: 404
                    });
                    console.log(`Se intentó consultar el ID de la actividad ${activity_id} 404`)
                } else{
                    console.log(`Se consultó el ID de la actividad ${activity_id}`);
                    await res.send(result[0]);
                };
            });
        } catch (error) {
            console.error(error);
        };
    };

    view.activitiyWithResults = async(req,res)=>{
        try {
            let {idCurse, idUser, idIntento} = req.params;
            pool.query(`SELECT * FROM Actividad
                        INNER JOIN Usuario_has_Actividad ON Actividad.idActividades = Usuario_has_Actividad.Actividad_idActividades
                        WHERE idActividades = ? and Usuario_idUsuario = ? and Intento_idIntento = ? ORDER BY id_user_actividad DESC LIMIT 1`,[idCurse,idUser,idIntento], async (err,result)=>{
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido disponible para esta consulta`,
                        idcurse:`${idCurse}`,
                        udUser:`${idUser}`,
                        error_Status: 404
                    });
                    console.log(`Se intentó consultar la atividad con id ${idCurse} para el usuario ${idUser}  con el intento con id ${idIntento} y no fue posible`)
                } else{
                    console.log(`Se consultó la actividad con ID ${idCurse} para el usuario ${idUser} en el intento ${idIntento}`);
                    await res.send(result);
                };
            });
        } catch (error) {
            console.error(error);
        };
    }

    // Ver todos los resultados de las actividaddes filtrado por ID usuario 
    view.activitiesResultEachUserAndActivity =async(req,res)=>{
        try {  
            let {activity_id,id_user,idIntento} = req.params;
            pool.query(`SELECT * FROM Usuario_has_Actividad WHERE Usuario_idUsuario = ? and Actividad_idActividades = ? and Intento_idIntento = ?
                        ORDER BY id_user_actividad DESC Limit 1`,[id_user,activity_id,idIntento], async (err,result)=>{
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido disponible para la consulta de la actividad ID ${activity_id} cuando el usuario es ID ${id_user} en el intento ${idIntento}`,
                        intento:`${idIntento}`,
                        actividad:`${activity_id}`,
                        usuario:`${id_user}`,
                        error_Status: 404
                    });
                    console.log(`El usuario con ID ${id_user} intentó consultar la actividad con ID ${activity_id} 404`)
                } else{
                    console.log(`El usuario con ID ${id_user} consultó la actividad con ID ${activity_id}`);
                    await res.send(result[0]);
                };
            });
        } catch (error) {
            console.error(error);
        };
    };

    //Ver todos los resultados filtrados por usuario
    view.activitiesResultEachUser =async(req,res)=>{
        try {  
            let {id_user} = req.params;
            pool.query("SELECT * FROM Usuario_has_Actividad WHERE Usuario_idUsuario = ?",id_user, async (err,result)=>{
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido disponible para esta consulta cuando el usuario es ID ${id_user}`,
                        error_Status: 404
                    });
                    console.log(`El usuario con ID ${id_user} intentó consultar sus actividades STATUS 404 `)
                } else{
                    console.log(`El usuario con ID ${id_user} intentó consultar sus actividades`);
                    await res.send(result);
                };
            });
        } catch (error) {
            console.error(error);
        };
    };

    //Consultar el estado de una actividad en especifico por intento usuario y id curso
    view.specificConsult = async(req,res)=>{
        try {
            let {iduser,idActividad,attemp} =req.params;
            pool.query(`SELECT * FROM Usuario_has_Actividad
            INNER JOIN Actividad ON Usuario_has_Actividad.Actividad_idActividades = Actividad.idActividades
            WHERE Calificacion >0 and Usuario_idUsuario = ? and idActividades= ? and Intento_idIntento = ?`, [iduser,idActividad,attemp], async(err,result)=>{
                if(err) throw err;
                if(result.length==1){
                    res.send(result);
                    console.log(`consulta especifica de la actividad con ID ${idActividad} en el intento ${attemp} para el usuario con ID ${iduser} `);
                }else{
                    res.send({
                        message:`No hay contenido para esta consulta`,
                        status: 404
                    });
                    console.log(`No hay consulta especifica de la actividad con ID ${idActividad} en el intento ${attemp} para el usuario con ID ${iduser}`)
                };
            })
        } catch (error) {
            console.log(error);
        }
    };

    // Ver el promedio de las actividades AVG 
    view.avgActividades = async (req,res)=>{
        try {
            let {idUser,attemp,curse}=req.params;
            pool.query(`SELECT AVG(Calificacion)*.2 as Promedio FROM Usuario_has_Actividad
                        INNER JOIN Actividad ON Usuario_has_Actividad.Actividad_idActividades = Actividad.idActividades
                        WHERE Calificacion >0 and Usuario_idUsuario = ? and Intento_idIntento = ? and Moto_id=?`,[idUser,attemp,curse],async(err,result)=>{
                if(err) throw err;
                if(result.length==0){
                    res.send({
                        message:`No hay contenido para esta consulta`,
                        idUser:`${idUser}`,
                        attemp:`${attemp}`,
                        curse:`${curse}`
                    });
                    console.log(`No hay contenido para la consulta AVG del Curso con ID ${curse} el usuario con id ${idUser} en el intento ${attemp}`);
                }else{
                    res.send(result);
                    console.log(`Se consultó el contenido para la consulta AVG del Curso con ID ${curse} el usuario con id ${idUser} en el intento ${attemp}`);
                }
            });
        } catch (error) {
            console.log(error);
        };
    };

    //Ver todos los examenes de todas los cursos
    view.allQuizzes = async(req,res)=>{
        try {
            pool.query("SELECT * FROM Examen ", async function (err,result){
                if(err) throw err;
                await res.send(result);
                console.log(`Se ha consultado la lista de examenes disponibles`);
            });
    
        } catch (error) {
            console.error(error);
        };
    };

    //Ver todos los examenes Filtrados po ID MOTO 
    view.allQuizEachCurso = async(req,res)=>{
        try {
            let {id_curso} = req.params
            pool.query("SELECT * FROM Examen WHERE Moto_id =?",id_curso, async function (err,result){
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido disponible para el examen de la moto ID${id_curso}`,
                        error_Status: 404
                    });
                    console.log(`No hay contenido disponible para el examen de la moto ID${id_curso}`);
                }else{
                    await res.send(result[0]);
                    console.log(`Se ha consultado el examen que pertenece a la moto ID ${id_curso}`);
                };
            });
    
        } catch (error) {
            console.error(error);
        };
    };

    //Ver las preguntas de todos los examenes
    view.allQuestionQuizzes = async(req,res)=>{
        try {
            pool.query("SELECT * FROM Pregunta_examen ", async function (err,result){
                if(err) throw err;
                await res.send(result);
                console.log(`Se ha consultado la lista de las preguntas de todos los examenes disponibles`);
            });
    
        } catch (error) {
            console.error(error);
        }
    };

    //Ver las preguntas de todos los examenes filtrados por ID Examen 
    view.questionsQuizz = async(req,res)=>{
        try {
            let {id_examen} = req.params
            pool.query("SELECT * FROM Pregunta_examen WHERE Examen_idExamen =?",id_examen, async function (err,result){
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido disponible para las preguntas del examen ID ${id_examen}`,
                        error_Status: 404
                    });
                    console.log(`No hay contenido disponible para las preguntas del examen ID ${id_examen}`);
                }else{
                    await res.send(result);
                    console.log(`Se ha consultado Las preguntas del examen ID ${id_examen}`);
                };
            });
    
        } catch (error) {
            console.error(error);
        };
    };

    //Obtener las preguntas por la categoria 
    view.questionsEachCategory = async(req,res)=>{
        try {
            let {categoria1 ,categoria2,categoria3,categoria4,categoria5,limit}= req.params;
            pool.query(`SELECT * FROM (SELECT * FROM Pregunta_examen 
                        WHERE Categoria_idCategoria = ? ORDER BY RAND() LIMIT ?)t
                        
                        UNION SELECT * FROM (SELECT * FROM Pregunta_examen 
                        WHERE Categoria_idCategoria = ? ORDER BY RAND() Limit ?)t
                        
                        UNION SELECT * FROM (SELECT * FROM Pregunta_examen 
                        WHERE Categoria_idCategoria = ? ORDER BY RAND() Limit ?)t
                        
                        UNION SELECT * FROM (SELECT * FROM Pregunta_examen 
                        WHERE Categoria_idCategoria = ? ORDER BY RAND() Limit ?)t
                        
                        UNION SELECT * FROM (SELECT * FROM Pregunta_examen 
                        WHERE Categoria_idCategoria = ? ORDER BY RAND() Limit ?)t`,[categoria1 || 0,parseInt(limit),categoria2 || 0 ,parseInt(limit),categoria3 || 0,parseInt(limit),categoria4 || 0 ,parseInt(limit),categoria5 || 0 ,parseInt(limit)],async(err,result)=>{

                    if (err) throw err;
                    if(result.length ==0){
                        res.send({
                            status:404,
                            message:`No hay preguntas para la categoria con ID ${[categoria1,categoria2,categoria3,categoria4,categoria5]}`,
                            category:[categoria1,categoria2,categoria3,categoria4,categoria5]
                        });
                        console.log(`No hay preguntas para la categoria con ID ${[categoria1,categoria2,categoria3,categoria4,categoria5]}`);
                    } else{
                        res.send(result);
                        console.log(`Se consultaron las preguntas para la categoria con ID ${[categoria1,categoria2,categoria3,categoria4,categoria5]}`);
                    };
            });

        } catch (error) {
            console.log(error);
        };
    };

    //Obtener las respuestas de una pregunta filtrado por el ID de la pregunta 
    view.answerEachQuestionId = async(req,res)=>{
        try {
            let {idQuestion}=req.params;
            pool.query(`SELECT * FROM Respuesta_examen 
                        WHERE Pregunta_examen_idPregunta_examen = ? ORDER BY RAND()`,idQuestion,async(err,result)=>{
                    
                if(err) throw err;
                if(result.length ==0){
                    res.send({
                        status:404,
                        message:`No encontramos las respuestas para la pregunta con ID ${idQuestion}`,
                        idQuestion:`${idQuestion}`
                    });
                    console.log(`No encontramos las respuestas para la pregunta con ID ${idQuestion}`)
                } else{
                    res.send(result);
                    console.log(`Se consultaron las respuestas para la pregunta con ID ${idQuestion}`)
                };
            });
        } catch (error) {
            console.log(error);
        };
    };

    //Ver todas las respuestas de los examenes Disponibles
    view.answersQuizzes = async(req,res)=>{
        try {
            pool.query("SELECT * FROM Respuesta_examen ", async function (err,result){
                if(err) throw err;
                await res.send(result);
                console.log(`Se ha consultado la lista de Respuestas de los examenes disponibles`);
            });
    
        } catch (error) {
            console.error(error);
        };
    };

    //Ver todas las respuestas del examen filtrado por ID Examen
    view.answersQuizz = async(req,res)=>{
        try {
            let {id_examen} = req.params
            pool.query("SELECT * FROM Respuesta_examen WHERE Pregunta_examen_idPregunta_examen =?",id_examen, async function (err,result){
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido disponible para las Respuestas del examen ID ${id_examen}`,
                        error_Status: 404
                    });
                    console.log(`No hay contenido disponible para las Respuestas del examen ID ${id_examen}`);
                }else{
                    await res.send(result);
                    console.log(`Se ha consultado Las respuestas del examen ID ${id_examen}`);
                };
            });
    
        } catch (error) {
            console.error(error);
        };
    };

    //Ver todas las respuestas que mandaron los usuarios
    view.answersQuizzesUsers = async(req,res)=>{
        try {
            pool.query("SELECT * FROM Usuario_has_Pregunta_examen ", async function (err,result){
                if(err) throw err;
                await res.send(result);
                console.log(`Se ha consultado la lista completa de las Respuestas de los usuarios`);
            });
    
        } catch (error) {
            console.error(error);
        };
    };

    //Ver todas las respuestas de los examenes filtrado por usuario
    view.answersQuizzesEachUser = async (req,res)=>{
        try {
            let{id_user}=req.params;
            pool.query("SELECT * FROM Usuario_has_Pregunta_examen WHERE Usuario_idUsuario=?",id_user, async function (err,result){
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido disponible para el usuario ID ${id_user} al momento de consultar sus respuestas`,
                        error_Status: 404
                    });
                    console.log(`No hay contenido disponible para el usuario ID ${id_user} al momento de consultar sus respuestas. STATUS 404 `)
                } else{
                    console.log(`El usuario con ID ${id_user} consultó sus respuestas de todos los examenes`);
                    await res.send(result);
                };
            });
    
        } catch (error) {
            console.error(error);
        };
    }

    //Ver todas las respuestas que mandaron los usuarios filtrado por ID EXAMEN y ID usuario
    view.answersQuizzEachUsersAndQuizz = async(req,res)=>{
        try {
            let{id_examen,id_user}=req.params;
            pool.query("SELECT * FROM Usuario_has_Pregunta_examen WHERE Usuario_idUsuario=? && Pregunta_examen_idPregunta_examen = ?",[id_user,id_examen], async function (err,result){
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido disponible para el examen Id ${id_examen} cuando el usuario ID ${id_user} consulta sus respuestas`,
                        error_Status: 404
                    });
                    console.log(`El usuario con ID ${id_user} intentó consultar sus respuestas del examen ${id_examen}. STATUS 404 `)
                } else{
                    console.log(`El usuario con ID ${id_user} consultó sus respuestas del examen ${id_examen}`);
                    await res.send(result[0]);
                };
            });
    
        } catch (error) {
            console.error(error);
        };
    };

    //Ver resultado de todos los examenes
    view.allResultQuizzes = async( req,res)=>{
        try {
            pool.query("SELECT * FROM Usuario_has_Examen ", async function (err,result){
                if(err) throw err;
                await res.send(result);
                console.log(`Se ha consultado la lista de resultados de los examenes`);
            });
    
        } catch (error) {
            console.error(error);
        };
    };

    //Ver el resultados de los examenes para un Usario
    view.resultQuizzesForUser = async(req,res)=>{
        try {
            let {id_user}=req.params;
            pool.query("SELECT * FROM Usuario_has_Examen WHERE Usuario_idUsuario =?",id_user, async function (err,result){
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido disponible para el usuario ID ${id_user}`,
                        error_Status: 404
                    });
                    console.log(`No hay contenido disponible para el usuario ID ${id_user} cuando desea ver todos los resultados de los examenes`)
                }
                await res.send(result);
                console.log(`Se ha consultado la lista de los examenes cuando el ID usuario = ${id_user}`);
            });
    
        } catch (error) {
            console.error(error);
        };
    };

    // Ver resultados por usuario y por ID del curso
    view.resultEachUserIdcurse = async(req,res)=>{
        try {
            let {id_user,id_curse}=req.params;
            pool.query("SELECT * FROM Usuario_has_Examen WHERE Usuario_idUsuario =?",id_user, async function (err,result){
                if(err) throw err;
                if(result.length == 0){
                    res.status(404).json({
                        message:`No hay contenido disponible para el usuario ID ${id_user}`,
                        error_Status: 404
                    });
                    console.log(`No hay contenido disponible para el usuario ID ${id_user} cuando desea ver todos los resultados de los examenes`)
                }
                await res.send(result);
                console.log(`Se ha consultado la lista de los examenes cuando el ID usuario = ${id_user}`);
            });
    
        } catch (error) {
            console.error(error);
        };
    };

    //Ver el resultado de un examen filtrado por Id Examen filtrando un usuario
    view.resultQuizzesForUserForQuizz = async(req,res)=>{
        try {
            let {id_user,id_examen,idIntento}=req.params;
            pool.query(`SELECT * FROM Usuario_has_Examen 
                        INNER JOIN Examen ON Usuario_has_Examen.Examen_idExamen = Examen.idExamen
                        WHERE Usuario_idUsuario =? and Examen_idExamen=? and Intento_idIntento = ?`,[id_user,id_examen,idIntento], async function (err,result){
                if(err) throw err;
                if(result.length == []){
                    res.status(404).json({
                        message:`No hay contenido disponible para el usuario ID ${id_user} cuando se consulta Examen ID ${id_examen} y su intento es el ${idIntento} `,
                        error_Status: 404
                    });
                    console.log(`No hay contenido disponible para el usuario ID ${id_user} cuando se consulta Examen ID ${id_examen} y su intento es el ${idIntento} `);
                }else{
                    await res.send(result);
                    console.log(`Se ha consultado el contenido disponible para el usuario ID ${id_user} cuando se consulta Examen ID ${id_examen} y su intento es el ${idIntento}`);
                }
                
            });
    
        } catch (error) {
            console.error(error);
        };
    };
    
    //AVG Examen 
    view.avgExamen = async(req,res)=>{
        try {
            let {idUser,attemp,curse}= req.params
            pool.query(`SELECT AVG(Calificacion)*.8 as promedio FROM Usuario_has_Examen
                        INNER JOIN Examen ON Usuario_has_Examen.Examen_idExamen = Examen.idExamen 
                        WHERE Calificacion >0 and Usuario_idUsuario = ? and Intento_idIntento = ?  and Moto_id = ?`,[idUser,attemp,curse], async(err,result)=>{
                if (err) throw err;
                
                if(result.length ==0){
                    res.send({
                        message:`No hay contenido para esta consulta`,
                        idUser:`${idUser}`,
                        attemp:`${attemp}`,
                        curse:`${curse}`
                    });
                    console.log(`No hay contenido para la consulta AVG del Curso con ID ${curse} el usuario con id ${idUser} en el intento ${attemp}`);
                } else {
                    res.send(result);
                    console.log(`Se consultó el contenido para la consulta AVG del Curso con ID ${curse} el usuario con id ${idUser} en el intento ${attemp}`);
                }
            });
        } catch (error) {
            console.log(error);
        };
    };

    //Ver el estado completo de todos los cursos
    view.UserCompleteCurso = async(req,res)=>{
        try {
            pool.query("SELECT * FROM Usuario_has_Moto ", async function (err,result){
                if(err) throw err;
                await res.send(result);
                console.log(`Se ha consultado la lista de Usuarios aprobados en todos los cursos`);
            });
    
        } catch (error) {
            console.error(error);
        };
    };

    // Ver el estado completo del curso filtrado po intento por usuario y curso
    view.userCompleteCursoSpacificConsult = async (req,res)=>{

        try {
            let {user,attemp,curse}=req.params;
            pool.query(`SELECT Calificacion FROM Usuario_has_Moto
                        WHERE Usuario_idUsuario = ? and Intento_idIntento = ? and Moto_id= ? LIMIT 1`,[user,attemp,curse],async(err,result)=>{
                if(result.length==0){
                    res.send({
                        message:`No encontramos el resultado del curso con id${curse} en el intento ${attemp} cuando es usuario es Id ${user}`,
                        status:404,
                        iduser:user,
                        intento:attemp,
                        curso:curse,
                        Calificacion:0
                    });
                    console.log(`No encontramos el resultado del curso con id${curse} en el intento ${attemp} cuando es usuario es Id ${user}`);
                }else{
                    res.send(result[0]);
                    console.log(`Consultamos el resultado del curso con id${curse} en el intento ${attemp} cuando es usuario es Id ${user}`);
                }; 
            });

        } catch (error) {
            console.error('hay un error tipo: ' + error);
        };
    };

    //Ver información combinada Curso ID Usuario ID intento del usuario
    view.mixingInfo = async(req,res)=>{
        try {
            let {idUsuario,idCurso}=req.params;
            pool.query(`SELECT * FROM Usuario 
                        INNER JOIN  Usuario_has_Intento ON Usuario.idUsuario = Usuario_has_Intento.Usuario_idUsuario
                        INNER JOIN Moto ON Usuario_has_Intento.id_moto = Moto.id
                        WHERE Usuario.idUsuario = ? and Moto.id = ?;`,[idUsuario,idCurso], async function (err,result){
                if(err) throw err;
                await res.send(result);
                console.log(`Se consultó la info del Usuario con ID ${idUsuario} para el curso con ID ${idCurso}`);
            });
    
        } catch (error) {
            console.error(error);
        };
    };

    //Ver las categorias del examen filtrado por el curso que le corresponde
    view.categoriesExamen = async(req,res)=>{

        try {
            let {idCurse} = req.params;
            pool.query(`SELECT Categoria_idCategoria, Nombre_examen FROM Pregunta_examen
                        INNER JOIN Examen ON Pregunta_examen.Examen_idExamen = Examen.idExamen
                        WHERE Moto_id =? GROUP BY Categoria_idCategoria`,idCurse,async(err,result)=>{
                        if (err) throw err;
                        if(result.length ==0){
                            res.send({
                                status:404,
                                message:`No se encontró ninguna categoria asociada con el curso con ID ${idCurse}`,
                                idCurse:`${idCurse}`
                            });

                            console.log(`No se encontró ninguna categoria asociada con el curso con ID ${idCurse}`)
                        } else{
                            res.send(result);
                            console.log(`Se consultaron las categoriaa asociadaa con el curso con ID ${idCurse}`)
                        };
                });
            
        } catch (error) {
            console.log(error);
        };
    };

    view.resultsconsultclick = async(req,res)=>{

        try {
            let {user,curse,attempt}=req.params;

            pool.query(`SELECT Nombre_actividad,Calificacion FROM Usuario_has_Actividad 
            INNER JOIN Actividad ON Actividad_idActividades	= Actividad.idActividades
            WHERE Usuario_idUsuario = ? and Calificacion >0 and Moto_id= ? and Intento_idIntento=? ORDER BY Actividad_idActividades ASC`,[user,curse,attempt],async(err,result)=>{
                if(err) throw err;

                if(result.length ==0){
                    res.send({
                        status:404,
                        message:`No se encontraron resultados para la acitivdad`,
                    })
                }else{
                    res.send(result);
                    console.log(`Consultamos los resultados menú aside results`)
                };
            });
        } catch (error) {
            console.log(error);
        };

    };

// ==============================================================================
// ============================= DANIEL DASH BOARD ===============================
// ==============================================================================

    // Conteo de las personas completas a un cursi
    view.userCompleteDashboard = async(req,res)=>{
        try {
            let {idcurse} = req.params
            pool.query(`SELECT COUNT(idUsuario) AS completados FROM (
                        SELECT COUNT(idUsuario) AS idUsuario, Usuario_has_Intento.Usuario_idUsuario FROM Usuario
                        INNER JOIN Usuario_has_Intento ON Usuario_has_Intento.Usuario_idUsuario = Usuario.idUsuario
                        where Usuario_has_Intento.Status = 1 AND id_moto = ?
                        GROUP BY Usuario_has_Intento.Usuario_idUsuario) t`,idcurse, async function(err,result){
                            if (err) throw err;
                            await res.send(result);
                            console.log(`Se consultó el conteo de Usuario Has intento`)
                        })
        } catch (error) {
            console.error(error);
        }
    };

    view.userInscriptDashboard = async(req,res)=>{
        try {
            let {idcurse} = req.params
            pool.query(`SELECT COUNT(idUsuario) AS Inscritos FROM (
                        SELECT COUNT(idUsuario) AS idUsuario, Usuario_has_Intento.Usuario_idUsuario FROM Usuario
                        INNER JOIN Usuario_has_Intento ON Usuario_has_Intento.Usuario_idUsuario = Usuario.idUsuario
                        where Usuario_has_Intento.Intento_actual > 0 AND id_moto = ?
                        GROUP BY Usuario_has_Intento.Usuario_idUsuario) t`,idcurse,async function(err,result){
                            if (err) throw err;
                            await res.send(result);
                            console.log(`Se consultó el conteo de Usuario Has intento`)
                        })
        } catch (error) {
            console.error(error);
        }
    };

    // Ver el estado de los cursos realizados por un usuario 
    view.UserCompleteCursoEachUser = async (req,res)=>{
        
        try {
            let {userId} = req.params
            pool.query("SELECT * FROM Usuario_has_Moto WHERE Usuario_idUsuario = ?",userId, async function (err,result){
                if(err) throw err;
                await res.send(result);
                console.log(`Se ha consultado la lista de los cursos para el usuario con id ${userId}`);
            });

        } catch (error) {
            console.error(error);
        };
    };

    //Ver Historico de todas los Cursos 
    view.HitoricResults = async (req,res)=>{
        try {
            pool.query(`SELECT * FROM Usuario_has_Moto  
                        INNER JOIN Usuario ON Usuario_has_Moto.Usuario_idUsuario = Usuario.idUsuario 
                        INNER JOIN Moto ON Usuario_has_Moto.Moto_id = Moto.id
                        ORDER BY Calificacion DESC;`, async function (err,result){
                if(err) throw err;
                await res.send(result);
                console.log(`Se ha consultado los resultados históricos`);
            });

        } catch (error) {
            console.error(error);
        };
    };

    //Ver el estado de un curso filtrado por ID  y por usuario ID 
    view.resultEachCurse = async (req,res)=>{
        try {
            let {idCurso} = req.params
            pool.query(`SELECT *, MAX(Calificacion) AS Calificacion_Max
                        FROM Usuario_has_Moto  
                        INNER JOIN Usuario ON Usuario_has_Moto.Usuario_idUsuario = Usuario.idUsuario 
                        INNER JOIN Moto ON Usuario_has_Moto.Moto_id = Moto.id
                        WHERE Moto_id = ? GROUP BY Usuario_idUsuario ORDER BY Calificacion DESC;`,idCurso, async function (err,result){
                if(err) throw err;
                await res.send(result);
                console.log(`Se ha consultado la lista del los resultado para el curso con ID ${idCurso}`);
            });

        } catch (error) {
            console.error(error);
        };
    };