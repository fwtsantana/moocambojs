module.exports = function(moo) {
    
    //Constante para definir qual botão de data deve obter o foco
    var TIPO_BOTAO_DATA = {
        DIA: {value: "dia"},
        MES: {value: "mes"},
        ANO: {value: "ano"},
        MAIS: {value: "mais"}
    };
    
    var module = {
        base: require("../../../fapi/view")(moo)
        , formField:  function(fieldName, labelName) {
            var label = module.base.label("lbl_" + fieldName, ["for='txt_" + fieldName + "'", "class='" + moo.config.getLocal("theme") + " label'"], labelName);
            var input = module.base.input("txt_" + fieldName, ["type='text'", "class='" + moo.config.getLocal("theme") + "'"], "");
            
            var div = module.base.div("div_" + fieldName, [], label + input);
            
            return div;
        }
        , listaSuspensa: {}
        , grade: {}
        , cabecalhoH1: {}
        , inputInteger: {}
        , inputDecimal: {}
        , usuario: {
            emailRecuperacaoSenha: {}
        }
        , load: {
            painelData: {}
            , painelDia: {}
            , painelMes: {}
            , painelAno: {}
            , painelMais: {}
            , cabecalhoCalendarioMensal: {}
            , calendarioMensal: {}
            , calendarioAnual: {}
            , calendarioMais: {}
            , botaoData: {}
            , botaoDia: {}
            , botaoMes: {}
            , botaoAno: {}
            , botaoMais: {}
            , linkNovoDebito: {}
        }
        , goTo: {
            login: {}
            , novaContaPasso1: {}
        }
    };
    
    module.listaSuspensa = function(elemId, dataArray) {
        'use strict';
        
        return module.base.json.select(elemId, dataArray);
    };
    
    module.grade = function (id, qtLinhas, qtColunas, larguraMin, borda, idDadoSequencial) {
        'use strict'
        
        //Numeração dos vértices
        var v1 = 0,
            v2 = qtColunas - 1,
            v3 = (qtLinhas * qtColunas) - 1,
            v4 = (qtLinhas - 1) * qtColunas;

        //Início grade
        var str = "";

        //Construção de linhas e colunas
        var seq = 0;
        for(var lin = 0; lin < qtLinhas; lin++) {
            for(var col = 0; col < qtColunas; col++) {                    

                //Início linha
                if (seq % qtColunas == v1) {
                    str += "<div style='text-Align:center' id='l:" + lin + "'>";
                }
                //Fim da linha
                else if (seq % (qtColunas - 1) == v2) {
                    str += "</div>";
                }

                var estiloDado = "min-width:" + larguraMin + "%;background-color:black";

                if (borda) {

                    var estiloBorda = ";border-radius:",
                        b = " " + borda + "px";

                    if (seq == v1) estiloBorda += b; else estiloBorda += " 0";
                    if (seq == v2) estiloBorda += b; else estiloBorda += " 0";
                    if (seq == v3) estiloBorda += b; else estiloBorda += " 0";
                    if (seq == v4) estiloBorda += b; else estiloBorda += " 0";

                    estiloDado += estiloBorda;
                }

                //Dado
                //Definir ID padrão para o dado (célula da grade)
                var idDado = "d:" + lin + ":" + col;
                
                //Se existir solicitação para dados com ID sequencial
                if (idDadoSequencial) idDado = "d:" + seq;
                
                var dado = module.base.div(idDado,[estiloDado], "");

                str += dado;

                seq++;
            }
        }
        
        return module.base.div(id,[],str);    
    };
    
    module.cabecalhoH1 = function() {
        'use strict';
        
        return "<h1 style='font-family: ninabold, Segoe UI;font-size:36px;background-color:#48576E;color:white'>" + texto + "</h1>";
    };
    
    module.inputInteger = function(elemId, elemAttr) {
        'use strict';
        
        elemAttr.push("onkeydown='inputInteger.handleInput(event)'");
        elemAttr.push("onfocus='$util.emptyDiv(\"msg_" + elemId + "\")'");
                      
        return module.base.input(elemId, elemAttr, "");
    }
    
    module.inputDecimal = function(elemId) {
        'use strict';
        
        return module.base.input(elemId, ["type='text'"
                   , "onkeydown='inputDecimal.handleInput(event)'"
                   , "onfocus='$util.emptyDiv(\"msg_" + elemId + "\")'"
                   , "onblur='inputDecimal.formatInput(event)'"], "");
    }
    
    module.usuario.emailRecuperacaoSenha = function(codRecuperacaoSenha) {
        return "<p>Olá, você solicitou recuperar a senha através desse email.\n\nEsse é o código que você deve utilizar para recuperá-la: <b>" + codRecuperacaoSenha + "</b></p>";
    }
    
    module.load.painelData = function(dia, mes, ano, tipoBotao) {
        'use strict';
        
        dia = moo.util().calendario.obterDiaDoMesAjustado(dia, mes, ano);
        mes = moo.util().calendario.obterMesAjustado(mes);
        ano = moo.util().calendario.obterAnoAjustado(ano);
        
        var botaoDia = this.botaoDia(dia, (tipoBotao == TIPO_BOTAO_DATA.DIA));
        var botaoMes = this.botaoMes(mes, (tipoBotao == TIPO_BOTAO_DATA.MES));
        var botaoAno = this.botaoAno(ano, (tipoBotao == TIPO_BOTAO_DATA.ANO));
        var botaoMais = this.botaoMais(tipoBotao == TIPO_BOTAO_DATA.MAIS);
        
        var idPainel = "painelData";
        var atributos = ["class='col span_8_of_8'"];
        var conteudo = botaoDia + botaoMes + botaoAno + botaoMais;
        
        var painelData = module.base.div(idPainel, atributos, conteudo);
        
        moo.server.fragment.loadFromText(painelData, "painelData");
        
        switch (tipoBotao) {
            case TIPO_BOTAO_DATA.DIA:
                this.linkNovoDebito();
                
                break;
            case TIPO_BOTAO_DATA.MES:
                
                this.calendarioMensal(dia, mes, ano);
                
                break;
            case TIPO_BOTAO_DATA.ANO:
                
                this.calendarioAnual(mes);
                
                break;
            case TIPO_BOTAO_DATA.MAIS:
                
                this.calendarioMais(ano);
                
                break;
        }
    }
    
    module.load.painelDia = function(dia, mes, ano) {
        'use strict';
        
        this.painelData(dia, mes, ano, TIPO_BOTAO_DATA.DIA);
    };
    
    module.load.painelMes = function(dia, mes, ano) {
        'use strict';
        
        this.painelData(dia, mes, ano, TIPO_BOTAO_DATA.MES);
    };
    
    module.load.painelAno = function(dia, mes, ano) {
        'use strict';
        
        this.painelData(dia, mes, ano, TIPO_BOTAO_DATA.ANO);
    };
    
    module.load.painelMais = function(dia, mes, ano) {
        'use strict';
        
        this.painelData(dia, mes, ano, TIPO_BOTAO_DATA.MAIS);
    };
    
    module.load.cabecalhoCalendarioMensal = function() {
        'use strict';
        
        var conteudo = "";
        var diasSemana = ["D","S","T","Q","Q","S","S"];
        for(var pos in diasSemana) {
            var dia = module.base.div(diasSemana[pos], ["class='dado_grade dado_dia_semana'"], diasSemana[pos]);
            conteudo += dia;
        }
        
        return module.base.div("cabecalho", ["style='display:table-row;align-content: center'"] ,conteudo);
    };
    
    module.load.calendarioMensal = function(dia, mes, ano) {
        'use strict';
        
        var ultimoDiaDoMes = moo.util().base.date.getLastDayOfMonth(mes,ano),
            posicaoPrimeiroDiaDoMes = moo.util().base.date.getWeekdayPosition(1, mes, ano),
            posicaoUltimoDiaDoMes = moo.util().base.date.getWeekdayPosition(ultimoDiaDoMes, mes, ano),
            qtdLinhasDaGrade = Math.ceil((ultimoDiaDoMes + posicaoPrimeiroDiaDoMes)/7),
            qtdColunasDaGrade = 7;
        
        var conteudo = this.cabecalhoCalendarioMensal();
        
        for(var i=0 ; i < qtdLinhasDaGrade ; i++) {
            
            var conteudoLinha = "";
            
            for(var j=0 ; j < qtdColunasDaGrade ; j++) {
                
                var diaDoMes = (i * qtdColunasDaGrade) + j - posicaoPrimeiroDiaDoMes + 1;
                
                var classe = "dado_grade";
                
                // Se for o dia atual, muda o cor de fundo
                if (diaDoMes == dia) {
                    classe += " cor_foco_botao";
                }
                
                var onClick = "onclick=\"run('exibirPainelDia(" + diaDoMes + ", txtMes.getAttribute(\\'data-value\\'), $util.getValue(txtAno))')\"";
                
                var celula = module.base.div(diaDoMes,["class='" + classe + "'", onClick], diaDoMes);
                
                if (i==0) { // Primeira linha

                    if (j < posicaoPrimeiroDiaDoMes) {
                        celula = module.base.div("l:" + i + ":c:" + j,["class='dado_grade'"], "");
                    }

                } else if (i == (qtdLinhasDaGrade - 1)) { // Última linha
                    
                    if (j > posicaoUltimoDiaDoMes) {
                        celula = module.base.div("l:" + i + ":c:" + j,["class='dado_grade'"], "");
                    }
                }                
                conteudoLinha += celula;
            }
            conteudo += module.base.div("l:" + i, ["class='linha_grade'"], conteudoLinha);
        }
        
        var idPainel = "form";
        
        var fragmento = module.base.div("calendario",[],conteudo);
        
        var form = module.base.div(idPainel, [], fragmento);
        
        moo.server.fragment.loadFromText(form, idPainel);
    };
    
    module.load.calendarioAnual = function(mes) {
        'use strict';
        
        moo.server.fragment.load("calendarioAnual", "form");
        
        var mesPorExtenso = moo.util().calendario.mesPorExtenso(mes, true);
        
        var fragmento = module.base.div(mes, ["class='dado_grade cor_foco_botao'"], mesPorExtenso);
        
        moo.server.fragment.loadFromText(fragmento, mes);
    };
    
    module.load.calendarioMais = function(ano) {
        var anoAtual = ano - 4,
            qtdLinhasDaGrade = 3,
            qtdColunasDaGrade = 3;
        
        var conteudo = "";
        
        for(var i=0 ; i < qtdLinhasDaGrade ; i++) {
            
            var conteudoLinha = "";
            
            for(var j=0 ; j < qtdColunasDaGrade ; j++) {
                
                var classe = "dado_grade";
                
                if (ano == anoAtual) {
                    classe += " cor_foco_botao";
                }
                
                var onClick = "onclick=\"run('exibirPainelAno($util.getValue(txtDia), txtMes.getAttribute(\\'data-value\\'), " + anoAtual + ")')\"";
                
                var celula = module.base.div(anoAtual, ["class='" + classe + "'", onClick], anoAtual);    
                
                anoAtual++;
                
                conteudoLinha += celula;
            }
            conteudo += module.base.div("l:" + i, ["class='linha_grade'"], conteudoLinha);
        }
        
        var calendario = module.base.div("calendario",[],conteudo);
        
        var fragmento = module.base.div("form", [], calendario);
        
        moo.server.fragment.loadFromText(fragmento, "form");
    };
    
    module.load.botaoData = function(id, onclick, valor, conteudo, foco) {
        'use strict';
        
        var classe = "botao";
        if (foco) {
            classe += " cor_foco_botao";
        }
        
        var atributos = ["data-value='" + valor + "'"];
        atributos.push("onclick=\"" + onclick + "\"");
        atributos.push("class='" + classe + "'");
        
        return module.base.div(id, atributos, conteudo);
    };
    
    module.load.botaoDia = function(dia, foco) {
        'use strict';
        
        var id = "txtDia";
        var onClick = "run('exibirPainelDia($util.getValue(txtDia), $util.getValue(txtMes), $util.getValue(txtAno))', 'main')";
        
        return this.botaoData(id, onClick, dia, dia, foco);
    };
    
    module.load.botaoMes = function(mes, foco) {
        'use strict';
        
        var id = "txtMes";
        var mesPorExtenso = moo.util().calendario.mesPorExtenso(mes, false);
        
        var onClick = "run('exibirPainelMes($util.getValue(txtDia), $util.getValue(txtMes), $util.getValue(txtAno))', 'main')";
        
        return this.botaoData(id, onClick, mes, mesPorExtenso, foco);
    };
    
    module.load.botaoAno = function(ano, foco) {
        'use strict';
        
        var id = "txtAno";
        var onClick = "run('exibirPainelAno($util.getValue(txtDia), txtMes.getAttribute(\\'data-value\\'), $util.getValue(txtAno))', 'main')";
        
        return this.botaoData(id, onClick, ano, ano,foco);
    };
    
    module.load.botaoMais = function(foco) {
        'use strict';
        
        var id = "txtMais";
        var onClick = "run('exibirPainelMais($util.getValue(txtDia), txtMes.getAttribute(\\'data-value\\'), $util.getValue(txtAno))', 'main')";
        
        return this.botaoData(id, onClick, "<>", "<>", foco);1
    };
    
    module.load.linkNovoDebito = function() {
        'use strict';
        
        var conteudo = module.base.a("linkNovoDebito", ["onclick=\"run('exibirTelaNovoDebito($util.getValue(usr))')\""], "+Débito");
        var fragmento = module.base.div("form", ["style='text-align:right'"], conteudo);
        
        moo.server.fragment.loadFromText(fragmento, "form");    
    }
    
    module.goTo.login = function() {
        moo.server.page.load("acesso/login", "main");
    }
    
    module.goTo.novoDebito = function(usuario) {
        moo.server.page.load("debito/cadDebito", "form", [usuario]);
    }
    
    return module;
};