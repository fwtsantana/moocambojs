module.exports = function(moo, data) {
    var modulo = {
        listarUsuariosQueComecamCom: function(campo, comecaCom, onSuccess, onError) {
            
            var filtro = {}
            filtro[campo] = { $regex: "^" + comecaCom};
            
            console.log(filtro);
            
            data.mongo.find("usuarios", filtro, onSuccess, onError);
        }
    };
    
    return modulo;
};