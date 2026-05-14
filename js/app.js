//  LISTA  DE EXERCÍCIOS
const API_URL = "http://localhost:3000";

let exercicios = [];
let todosExercicios = [];
let exercicioEditando = null;

function montarFuncao(exercicio) {
  try {
    const params = exercicio.inputs.map((input) => input.label).join(", ");
    return new Function(params, exercicio.codigo);
  } catch (e) {
    return () => "Erro na função do exercício";
  }
}

// REGISTRAR EXERCÍCIO

async function carregarExercicios() {
  try {
    const resposta = await fetch(`${API_URL}/exercicios`);
    const dados = await resposta.json();

    console.log("Dados do backend:", dados);

    exercicios = dados.map((ex) => ({
      ...ex,
      executar: montarFuncao(ex),
    }));

    console.log("lista tratada:", exercicios);

    todosExercicios = exercicios;

    renderizarExercicios(exercicios);
  } catch (erro) {
    console.error("Erro ao carregar exercícios:", erro);
  }
}

//  RENDERIZAÇÃO DOS CARDS

function renderizarExercicios(lista = exercicios) {
  const container = document.getElementById("lista-exercicios");
  container.innerHTML = "";

  lista.forEach((exercicio) => {
    const card = document.createElement("div");
    card.classList.add("card-exercicio");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    // FRENTE DO CARD
    cardFront.innerHTML = `
  <div class="titulo-card">
    <div class="titulo-info">
      <div class="titulo-topo">
        <h3>${exercicio.title}</h3>
        <span class="tag">${exercicio.category}</span>
      </div>
      <p>${exercicio.description}</p>
    </div>
  </div>
`;

    // VERSO DO CARD
    cardBack.innerHTML = `
      <h4>Código:</h4>
      <pre><code>${exercicio.codigo || "Sem código cadastrado."}</code></pre>
      <h4>Explicação:</h4>
      <p>${exercicio.explicacao || "Sem explicação cadastrada."}</p>
    `;

    // BOTÃO VOLTAR (VERSO)
    const btnVoltar = document.createElement("button");
    btnVoltar.textContent = "Voltar";
    btnVoltar.classList.add("btn-voltar");
    btnVoltar.addEventListener("click", () => card.classList.remove("virado"));
    cardBack.appendChild(btnVoltar);

    // BOTÃO VER CÓDIGO
    const btnVerCodigo = document.createElement("button");
    btnVerCodigo.textContent = "</> Ver código";
    btnVerCodigo.classList.add("btn-ver-codigo");
    btnVerCodigo.addEventListener("click", () =>
      card.classList.toggle("virado"),
    );

    // BOTÕES EDITAR / EXCLUIR
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn-editar");

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.classList.add("btn-excluir");

    // ÁREA DE INPUTS
    const areaInputs = document.createElement("div");
    areaInputs.classList.add("area-inputs");

    (exercicio.inputs || []).forEach((inp) => {
      const input = document.createElement("input");
      input.placeholder = inp.label;
      input.type = inp.type || "text";
      areaInputs.appendChild(input);
    });

    // BOTÃO EXECUTAR
    const btnExecutar = document.createElement("button");
    btnExecutar.textContent = "▶ Executar código";

    const resultadoBox = document.createElement("p");

    btnExecutar.addEventListener("click", () => {
      try {
        const valores = [];
        areaInputs.querySelectorAll("input").forEach((i) => {
          valores.push(i.type === "number" ? parseFloat(i.value) : i.value);
        });

        const resultado = exercicio.executar(...valores);

        if (resultado === undefined) {
          throw new Error("A função não retornou nenhum resultado.");
        }

        resultadoBox.innerHTML = "Resultado:<br> " + resultado;
      } catch (erro) {
        console.error("Erro ao executar exercício:", erro);
        resultadoBox.textContent = "Ocorreu um erro ao executar o exercício.";
      }
    });

    // ÁREA DE CONTEÚDO (esquerda)
    const areaConteudo = document.createElement("div");
    areaConteudo.classList.add("area-conteudo");
    areaConteudo.appendChild(areaInputs);
    areaConteudo.appendChild(btnExecutar);
    areaConteudo.appendChild(resultadoBox);

    //AÇÕES (direita)
    const botoesCard = document.createElement("div");
    botoesCard.classList.add("rodape-card");
    botoesCard.appendChild(btnEditar);
    botoesCard.appendChild(btnExcluir);
    botoesCard.appendChild(btnVerCodigo);

    cardFront.appendChild(areaConteudo);
    cardFront.appendChild(botoesCard);

    // EVENT LISTENERS EDITAR / EXCLUIR
    btnExcluir.addEventListener("click", async () => {
      const confirmar = confirm("Tem certeza que deseja excluir?");
      if (!confirmar) return;

      await fetch(`${API_URL}/exercicios/${exercicio.id}`, {
        method: "DELETE",
      });
      carregarExercicios();
    });

    btnEditar.addEventListener("click", () => {
      exercicioEditando = exercicio;

      document.getElementById("titulo").value = exercicio.title;
      document.getElementById("categoria").value = exercicio.category;
      document.getElementById("descricao").value = exercicio.description;
      document.getElementById("codigo").value = exercicio.codigo;
      document.getElementById("explicacao").value = exercicio.explicacao || "";

      inputsTemp = [];
      const containerInputs = document.getElementById("inputs-container");
      containerInputs.innerHTML = "";

      (exercicio.inputs || []).forEach((input) => {
        adicionarInput();
        const ultimo = inputsTemp[inputsTemp.length - 1];
        ultimo.input.value = input.label;
        const radio = ultimo.tipo.querySelector(`input[value="${input.type}"]`);
        if (radio) radio.checked = true;
      });

      abrirModal();
    });

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    container.appendChild(card);
  });
}

//FILTROS

function aplicarFiltros() {
  const categoriaAtiva =
    document.querySelector(".btn-filtro.active").dataset.categoria;
  const textoBusca = document
    .getElementById("input-filtro")
    .value.toLowerCase();

  const filtrados = todosExercicios.filter((ex) => {
    const passaCategoria =
      categoriaAtiva === "all" || ex.category === categoriaAtiva;
    const passaBusca = ex.title.toLowerCase().includes(textoBusca);
    return passaCategoria && passaBusca;
  });
  renderizarExercicios(filtrados);
}

window.addEventListener("DOMContentLoaded", () => {
  carregarExercicios();

  //FILTRO CATEGORIA

  document.querySelectorAll(".btn-filtro").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".btn-filtro")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      aplicarFiltros();
    });
  });

  //FILTRO POR BUSCA

  document
    .getElementById("input-filtro")
    .addEventListener("input", aplicarFiltros);

  document
    .getElementById("btn-add-input")
    .addEventListener("click", adicionarInput);

  document
    .getElementById("btn-salvar")
    .addEventListener("click", salvarExercicio);

  document.getElementById("btn-cancelar").addEventListener("click", () => {
    exercicioEditando = null;
    inputsTemp = [];
    document.getElementById("inputs-container").innerHTML = "";
    fecharModal();
  });
});

// CONTROLE MODAL

function abrirModal() {
  const modal = document.getElementById("modal-exercicio");
  modal.style.display = "block";
}

function fecharModal() {
  const modal = document.getElementById("modal-exercicio");
  modal.style.display = "none";
}

// ADD INPUTS DINÂMICOS

let inputsTemp = [];
let inputCounter = 0;

function adicionarInput() {
  const container = document.getElementById("inputs-container");

  // cria um input novo
  const inputLabel = document.createElement("input");
  inputLabel.placeholder = "Nome do input";

  // cria o select de tipo

  const id = inputCounter++; // ← linha nova, antes do tipo

  const tipo = document.createElement("div");
  tipo.classList.add("input-tipo");
  tipo.innerHTML = `
  <label><input type="radio" name="tipo-${id}" value="text" checked> Texto</label>
  <label><input type="radio" name="tipo-${id}" value="number"> Número</label>
`;

  // botão deletar input
  const btnDeletar = document.createElement("button");
  btnDeletar.textContent = "Remover";

  // adiciona na tela (com wrapper)
  const wrapper = document.createElement("div");
  wrapper.classList.add("input-row");
  wrapper.appendChild(inputLabel);
  wrapper.appendChild(tipo);
  wrapper.appendChild(btnDeletar);

  // remove o wrapper do DOM e do inputsTemp
  btnDeletar.addEventListener("click", () => {
    const index = inputsTemp.findIndex((i) => i.wrapper === wrapper);
    inputsTemp.splice(index, 1);
    wrapper.remove();
  });

  container.appendChild(wrapper);

  // salva no array temporário
  inputsTemp.push({ input: inputLabel, tipo, wrapper });
}

//SALVAR EXERCÍCIO (INTEGRA COM A API)

async function salvarExercicio() {
  const exercicio = {
    id: exercicioEditando ? exercicioEditando.id : Date.now().toString(),
    title: document.getElementById("titulo").value,
    category: document.getElementById("categoria").value,
    description: document.getElementById("descricao").value,
    codigo: document.getElementById("codigo").value,
    explicacao: document.getElementById("explicacao").value,
    inputs: inputsTemp.map((i) => ({
      label: i.input.value,
      type: i.tipo.querySelector("input:checked").value,
    })),
  };

  let url = `${API_URL}/exercicios`;
  let metodo = "POST";

  // se estiver editando
  if (exercicioEditando) {
    url = `${API_URL}/exercicios/${exercicio.id}`;
    metodo = "PUT";
  }

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(exercicio),
    });

    if (!resposta.ok) {
      throw new Error(`Erro do servidor: ${resposta.status}`);
    }

    exercicioEditando = null;
    inputsTemp = [];
    document.getElementById("inputs-container").innerHTML = "";

    fecharModal();
    carregarExercicios();
  } catch (erro) {
    console.erro("Falha ao salvar exercício", erro.message);
    alert("Não foi possível salvar. Verifique sua conexão e tente novamente.");
  }
}
