function analisar() {
    const inicioValor = document.getElementById("inicio").value;
    const fimValor = document.getElementById("fim").value;

    if (!inicioValor || !fimValor) {
        alert("Informe as datas corretamente.");
        return;
    }

    // cria datas SEM problema de fuso
    const inicio = criarDataLocal(inicioValor);
    const fim = criarDataLocal(fimValor);

    if (inicio > fim) {
        alert("A data inicial não pode ser maior que a final.");
        return;
    }

    const feriadosInformados = document
        .getElementById("feriados")
        .value
        .split(/,|\n/)
        .map(d => d.trim())
        .filter(d => d);

    const mapaFeriados = new Map();

    // cobre períodos que cruzam anos
    for (let ano = inicio.getFullYear(); ano <= fim.getFullYear(); ano++) {
        obterFeriadosNacionais(ano).forEach(f =>
            mapaFeriados.set(f.data, f.nome)
        );
    }

    feriadosInformados.forEach(f =>
        mapaFeriados.set(f, "Feriado informado")
    );

    let diasCorridos = 0;
    let diasUteis = 0;
    let sabados = 0;
    let domingos = 0;
    let feriados = 0;

    const feriadosNoPeriodo = [];

    for (
        let data = new Date(inicio);
        data <= fim;
        data.setDate(data.getDate() + 1)
    ) {
        diasCorridos++;

        const dataISO = formatarDataLocal(data);
        const diaSemana = data.getDay();

        if (mapaFeriados.has(dataISO)) {
            feriados++;
            feriadosNoPeriodo.push({
                data: dataISO,
                nome: mapaFeriados.get(dataISO)
            });
            continue;
        }

        if (diaSemana === 0) {
            domingos++;
        } else if (diaSemana === 6) {
            sabados++;
        } else {
            diasUteis++;
        }
    }

    document.getElementById("diasCorridos").innerHTML = `DIAS CORRIDOS<br>${diasCorridos}`;
    document.getElementById("diasUteis").innerHTML = `DIAS ÚTEIS<br>${diasUteis}`;
    document.getElementById("sabados").innerHTML = `SÁBADOS<br>${sabados}`;
    document.getElementById("domingos").innerHTML = `DOMINGOS<br>${domingos}`;
    document.getElementById("totalFeriados").innerHTML = `FERIADOS<br>${feriados}`;

    const lista = document.getElementById("listaFeriados");
    lista.innerHTML = "";

    if (feriadosNoPeriodo.length === 0) {
        lista.innerHTML = "<li>Nenhum feriado no período</li>";
    } else {
        feriadosNoPeriodo.forEach(f => {
            const li = document.createElement("li");
            li.textContent = `${formatarBR(f.data)} – ${f.nome}`;
            lista.appendChild(li);
        });
    }
}

/* =========================
   FUNÇÕES DE DATA SEGURAS
========================= */

function criarDataLocal(valor) {
    const [ano, mes, dia] = valor.split("-");
    return new Date(ano, mes - 1, dia);
}

function formatarDataLocal(data) {
    const y = data.getFullYear();
    const m = String(data.getMonth() + 1).padStart(2, "0");
    const d = String(data.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function formatarBR(dataISO) {
    const [y, m, d] = dataISO.split("-");
    return `${d}/${m}/${y}`;
}

/* =========================
   FERIADOS NACIONAIS
========================= */

function obterFeriadosNacionais(ano) {
    const feriados = [];

    feriados.push({ data: `${ano}-01-01`, nome: "Confraternização Universal" });
    feriados.push({ data: `${ano}-03-19`, nome: "Dia de São José (Feriado Estadual)" });
    feriados.push({ data: `${ano}-03-25`, nome: "Data Magna do Ceará (Feriado Estadual)" });
    feriados.push({ data: `${ano}-04-13`, nome: "Aniversário de Fortaleza (Feriado Municipal)" });
    feriados.push({ data: `${ano}-04-21`, nome: "Tiradentes" });
    feriados.push({ data: `${ano}-05-01`, nome: "Dia do Trabalho" });
    feriados.push({ data: `${ano}-08-15`, nome: "N.Sra. da Assunção (Feriado Municipal)" });
    feriados.push({ data: `${ano}-09-07`, nome: "Independência do Brasil" });
    feriados.push({ data: `${ano}-10-12`, nome: "Nossa Senhora Aparecida" });
    feriados.push({ data: `${ano}-10-28`, nome: "Dia do Servidor Público" });
    feriados.push({ data: `${ano}-11-02`, nome: "Finados" });
    feriados.push({ data: `${ano}-11-15`, nome: "Proclamação da República" });
    feriados.push({ data: `${ano}-11-20`, nome: "Consciência Negra" });
    feriados.push({ data: `${ano}-12-25`, nome: "Natal" });

    const pascoa = calcularPascoa(ano);

    feriados.push({
        data: formatarDataLocal(new Date(pascoa.getTime() - 47 * 86400000)),
        nome: "Carnaval"
    });

    feriados.push({
        data: formatarDataLocal(new Date(pascoa.getTime() - 2 * 86400000)),
        nome: "Sexta-feira Santa"
    });

    feriados.push({
        data: formatarDataLocal(new Date(pascoa.getTime() + 60 * 86400000)),
        nome: "Corpus Christi"
    });

    return feriados;
}

function calcularPascoa(ano) {
    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(ano, mes - 1, dia);
}

function limpar() {
    document.getElementById("inicio").value = "";
    document.getElementById("fim").value = "";
    document.getElementById("feriados").value = "";

    document.getElementById("diasCorridos").innerHTML = "DIAS CORRIDOS<br>0";
    document.getElementById("diasUteis").innerHTML = "DIAS ÚTEIS<br>0";
    document.getElementById("sabados").innerHTML = "SÁBADOS<br>0";
    document.getElementById("domingos").innerHTML = "DOMINGOS<br>0";
    document.getElementById("totalFeriados").innerHTML = "FERIADOS<br>0";

    const lista = document.getElementById("listaFeriados");
    lista.innerHTML = "<li>Nenhum feriado no período</li>";
}
