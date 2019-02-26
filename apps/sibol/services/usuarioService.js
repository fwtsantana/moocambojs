module.exports = function(moo, data) {
    var modulo = {
        listarUsuariosQueComecamCom: function(campo, comecaCom, onSuccess, onError) {
            var filtro = {}
            filtro[campo] = { $regex: "^" + comecaCom};

            data.mongo.find("usuarios", filtro, onSuccess, onError);
        }
        , listarTodos: function(onSuccess, onError) {
            data.mongo.find("usuarios", {}, onSuccess, onError);
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
        , obterUsuarioPorID: function(id, onSuccess, onError) {
            data.mongo.findOne("usuarios", { _id: moo.server.dataConnections.mongoDB.fromStringToHex(id)}, onSuccess, onError);
        }
    };
    
    return modulo;
};