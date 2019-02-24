module.exports = function(moo, data) {
    var modulo = {
        listarUsuariosQueComecamCom: function(campo, comecaCom, onSuccess, onError) {
            var filtro = {}
            filtro[campo] = { $regex: "^" + comecaCom};

            data.mongo.find("usuarios", filtro, onSuccess, onError);
        }
        , inserirNovoUsuario: function(email, senha, perfil, onSuccess, onError) {
            var novoUsuario = {
                "txEmail": email
                , "txSenha": senha
                , "perfil": perfil
                , "stUsuario": "ativo"
                , "dtCadastro": "24/02/2019 20:10"
            };
            
            moo.data.base.mongo.insertOne("usuarios", novoUsuario, onSuccess, onError);
        }
    };
    
    return modulo;
};