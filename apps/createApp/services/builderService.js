module.exports = function(moo, data) {
    
    var modulo = {
        existe: function(usuario, email, onExists, onNotExists) {
            data.mongo.exists(
                "colUsuario", {"$or":[{strUsuario: usuario}, {strEmail: email}]}
                , onExists, onNotExists);
        }
        , adicionar: function(usuario, email, senha, onSuccess, onError) {
            var novoUsuario = {
                strUsuario: usuario
                , strEmail: email
                , strSenha: senha
                , listaCategoriaDebito: []
            };
            
            if (!onError) {
                onError = function(err) {
                    moo.util().base.messages.notify(err,"error");
                }
            }

            data.mongo.insertOne("colUsuario", novoUsuario, onSuccess, onError);
        }
        , emailExistente: function(email, onExists, onNotExists) {
            data.mongo.exists("colUsuario"
                , {strEmail: email}
                , onExists
                , onNotExists);
        }
        , atualizarCodigoRecuperacao: function(email, codigo, onSuccess, onError) {
            data.mongo.updateField("colUsuario"
                , {strEmail: email}
                , "numRecuperacaoSenha"
                , codigo
                , onSuccess
                , onError);
        }
        , obterSenha: function(codigo, onSuccess, onError) {
            data.mongo.find("colUsuario", {numRecuperacaoSenha: codigo}, onSuccess, onError);
        }
        , obterParceiroa: function(usuario, onSuccess, onError) {
            data.mongo.findAttributes("colUsuario", {strUsuario: usuario}, {strUsuarioParceiroa: 1, _id:0}, onSuccess, onError);
        }
        , atualizarNovoParceiroa: function(usuarioOrigem, usuarioParceiroa, onSuccess, onError) {
            data.mongo.updateField("colUsuario"
                , {strUsuario: usuarioOrigem}
                , "strUsuarioParceiroa"
                , usuarioParceiroa
                , onSuccess
                , onError);

        }
    };
    
    return modulo;
};