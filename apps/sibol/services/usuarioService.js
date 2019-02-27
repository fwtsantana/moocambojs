module.exports = function(moo, data) {
    var module = {
        listarUsuariosQueComecamCom: function(campo, comecaCom, onSuccess, onError) {
            var filtro = {}
            filtro[campo] = { $regex: "^" + comecaCom};

            data.mongo.find("usuarios", filtro, onSuccess, onError);
        }
        , listarTodos: function(onSuccess, onError) {
            data.mongo.find("usuarios", {}, onSuccess, onError);
        }
        , obterUsuarioPorID: function(id, onSuccess, onError) {
            data.mongo.findOne("usuarios", { _id: moo.server.dataConnections.mongoDB.fromStringToHex(id)}, onSuccess, onError);
        }
        , inserirNovoUsuario: function(email, senha, perfil, onSuccess, onError) {
            
            if (!moo.util().base.email.validate(email)) {
                return onError("E-mail incorreto!");
            }
            
            if (!senha || senha.trim().length === 0) {
                return onError("Informe a senha!");
            }
            
            var novoUsuario = {
                "txEmail": email
                , "txSenha": senha
                , "txPerfil": perfil
                , "stUsuario": "ativo"
                , "dtCadastro": moo.util().obterDataHoraLocal()
            };
            
            data.mongo.exists("usuarios", {"txEmail": email}, function(){
                onError("Usuário já cadastrado!");
            }, function() {
                data.mongo.insertOne("usuarios", novoUsuario, onSuccess, onError);
            });
        }
        , alterarUsuario: function(id, senha, perfil, situacao, onSuccess, onError) {
            
            if (!senha || senha.trim().length === 0) {
                return onError("Informe a senha!");
            }
            
            module.obterUsuarioPorID(id, function(objUsuario) {
                
                var novoUsuario = objUsuario;
                
                var novoUsuario = {
                    _id: objUsuario._id
                    , txEmail: objUsuario.txEmail
                    , txSenha: senha
                    , txPerfil: perfil
                    , stUsuario: situacao
                    , dtCadastro: objUsuario.dtCadastro
                    , dtAlteracao: moo.util().obterDataHoraLocal()
                };
                
                if (JSON.stringify(novoUsuario) !== JSON.stringify(objUsuario)) {
                    
                    data.mongo.updateObject("usuarios", {_id: objUsuario._id}, novoUsuario, onSuccess, onError);
                    
                } else {
                    onError("Não há alterações!");
                }
                    
            }, function() {
                onError("Falha ao alterar. Usuário não encontrado!");
            });
        }
    };
    
    return module;
};