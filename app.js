class Despesas {
    constructor(ano, mes, dia, tipo, descricao, valor ) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for(let i in this) {
            if(this[i] == undefined || this[i] || "" || this[i] == null) {
                return true
            } else {
                return false
            }
        }
    }
}


class Bd {    

    constructor() {
        let id = localStorage.getItem("id")

        if(id === null) {
            localStorage.setItem("id", 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem("id")
        return parseInt(proximoId) + 1;
    }

    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem("id", id)
    }

    recuperarTodosRegistros() {

        // array de despesas
        let despesas = []

        let id = localStorage.getItem("id")

        // RECUPERAR TODAS AS DESPESAS CADASTRADA NO LOCALSTORAGE
        for(let i = 1; i <= id; i++) {
            // recuperando as despesa / convertendo para objeto
            let despesa = JSON.parse(localStorage.getItem(i))

            // VERIFICAR DE EXISTE ARRAY QUE JA FOI REMOVIDO
            if(despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa);
            
        }

        return despesas
    }

    pesquisar(despesa) {
        let despesasFlitradas = []
        despesasFlitradas = this.recuperarTodosRegistros()
        
        if(despesa.ano != "") {
            despesasFlitradas = despesasFlitradas.filter(d => d.ano == despesa.ano)
        }

        if(despesa.mes != "") {
            despesasFlitradas = despesasFlitradas.filter(d => d.mes == despesa.mes)
        }

        if(despesa.dia != "") {
            despesasFlitradas = despesasFlitradas.filter(d => d.dia == despesa.dia)
        }

        if(despesa.tipo != "") {
            despesasFlitradas = despesasFlitradas.filter(d => d.tipo == despesa.tipo)
        }

        if(despesa.descricao != "") {
            despesasFlitradas = despesasFlitradas.filter(d => d.descricao == despesa.descricao)
        }

        if(despesa.valor != "") {
            despesasFlitradas = despesasFlitradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFlitradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()


function cadastrarDispesa() {
    let ano = document.querySelector("#ano").value
    let mes = document.querySelector("#mes").value
    let dia = document.querySelector("#dia").value
    let tipo = document.querySelector("#tipo").value
    let descricao = document.querySelector("#descricao").value
    let valor = document.querySelector("#valor").value

    let despesas = new Despesas(ano, mes, dia, tipo, descricao, valor)

    if(despesas.validarDados()) {
        bd.gravar(despesas);
        $("#sucessoGravacao").modal("show")

        // LIMPA OS CAMPOS DO INPUT
        
        ano = document.querySelector("#ano").value = "";
        mes = document.querySelector("#mes").value = "";
        dia = document.querySelector("#dia").value = "";
        tipo = document.querySelector("#tipo").value = "";
        descricao = document.querySelector("#descricao").value = "";
        valor = document.querySelector("#valor").value = "";
        
    } else {
        // ERRO AO VALIDAR O DADOS
        $("#erroGravacao").modal("show")
        //alert("Preencha todos os campos :(")        
    }
}

function carregaListaDespesas() {
    let despesas = []
    despesas = bd.recuperarTodosRegistros()
    
    // SELECIONANDO O ELEMENTO TBODY DA TABELA
    let listaDespesa = document.querySelector("#listaDespesas")

    if(despesas.length == 0 ) {
        let NaoTemDespesa = document.querySelector("#NenhumaDespesa")
        NaoTemDespesa.innerHTML = `Ainda não foi cadastrada nenhuma despesa`
        NaoTemDespesa.style.color = "red";
        NaoTemDespesa.style.display = "flex"
        NaoTemDespesa.style.justifyContent = "center";
    } else {

        // PERCORRER O ARRAY DESPESA
        despesas.forEach(function(d) {
            // criando a linha (tr)
            let linha = listaDespesa.insertRow()
    
            // SETAR UM ZERO SE MES/dia FOR MENOR QUE 10
            d.mes = d.mes < 10 ? 0 + d.mes : d.mes
            d.dia = d.dia < 10 ? 0 + d.dia : d.dia
    
            // CONVERTER O TIPO QUE FOI SELECIONANDO
            switch (d.tipo) {
                case "1":
                    d.tipo = "Alimentação";
                    break;
                case "2":
                    d.tipo = "Educação";
                    break;
                case "3":
                    d.tipo = "Lazer";
                    break;
                case "4":
                    d.tipo = "Saúde";
                    break;
                case "5":
                    d.tipo = "Transporte";
                    break;
                default:
                    d.tipo = "Não definido";
            }
    
            // criar as colunas (td)
            linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}`
            linha.insertCell(1).innerHTML = `${d.tipo}`
            linha.insertCell(2).innerHTML = `${d.descricao}`;        
            linha.insertCell(3).innerHTML = `R$: ${d.valor}`;

            // EXCLUIR A DESPESA
            let btn = document.createElement("button");
            btn.className = "btn btn-danger"
            btn.innerHTML = "<i class='fas fa-times'></i>"
            btn.id = `id_despesa_${d.id}`
            btn.onclick = function() {
                let id = this.id.replace("id_despesa_", "")
                bd.remover(id)

                // recarregar a pagina quando deleta a despesa
                window.location.reload()
            }
            linha.insertCell(4).append(btn)
        })
    }

}

function pesquisarDespesa() {
    let ano = document.querySelector("#ano").value
    let mes = document.querySelector("#mes").value
    let dia = document.querySelector("#dia").value
    let tipo = document.querySelector("#tipo").value
    let descricao = document.querySelector("#descricao").value
    let valor = document.querySelector("#valor").value
    
    let filtro = new Despesas(ano, mes, dia, tipo, descricao, valor)
    let resultados = bd.pesquisar(filtro)
    

     // SELECIONANDO O ELEMENTO TBODY DA TABELA
    let listaDespesa = document.querySelector("#listaDespesas")    
    listaDespesa.innerHTML = ""

    if(resultados.length == 0 ) {
        let linha = listaDespesa.insertRow()
        let coluna = linha.insertCell(0)
        coluna.colSpan = 4
        coluna.innerHTML = "Ainda não existe essa despesa"
        coluna.style.color = "red"
        coluna.style.textAlign = "center"

    } else {        

        // PERCORRER O ARRAY DESPESA
        resultados.forEach(function(d) {
            // criando a linha (tr)
            let linha = listaDespesa.insertRow()
    
            // SETAR UM ZERO SE MES/dia FOR MENOR QUE 10
            d.mes = d.mes < 10 ? 0 + d.mes : d.mes
            d.dia = d.dia < 10 ? 0 + d.dia : d.dia
    
            // CONVERTER O TIPO QUE FOI SELECIONANDO
            switch (d.tipo) {
                case "1":
                    d.tipo = "Alimentação";
                    break;
                case "2":
                    d.tipo = "Educação";
                    break;
                case "3":
                    d.tipo = "Lazer";
                    break;
                case "4":
                    d.tipo = "Saúde";
                    break;
                case "5":
                    d.tipo = "Transporte";
                    break;
                default:
                    d.tipo = "Não definido";
            }
    
            // criar as colunas (td)
            linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}`
            linha.insertCell(1).innerHTML = `${d.tipo}`
            linha.insertCell(2).innerHTML = `${d.descricao}`;        
            linha.insertCell(3).innerHTML = `R$: ${d.valor}`;

            // EXCLUIR A DESPESA
            let btn = document.createElement("button");
            btn.className = "btn btn-danger"
            btn.innerHTML = "<i class='fas fa-times'></i>"
            btn.id = `id_despesa_${d.id}`
            btn.onclick = function() {
                let id = this.id.replace("id_despesa_", "")
                bd.remover(id)

                // recarregar a pagina quando deleta a despesa
                window.location.reload()
            }
            linha.insertCell(4).append(btn)           
        })
    }

}