// Seleciona os elementos do formulario
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")
//Captura o evento de input formatando o valor para somente numeros
amount.oninput = () => {
  //obtem o valor atual e remove os caracteres de letras
  let value = amount.value.replace(/\D/g, "")
  //Transforma em centavos
  value = Number(value) / 100

  //atualiza o valor
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  //formata o valor para real brasileiro
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return value
}
//Captura de evento de submit para obtenção de valores
form.onsubmit = (event) => {
  //previnir o reload de pagina
  event.preventDefault()

  //Criação de objeto nova dispesa com seus detalhes
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  expenseAdd(newExpense)
}

//Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // Criando a li para adicionar o item na lista (ul)
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    //Criando icone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    //Criando as informações da dispesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    //Cria o nome da dispesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    //Cria a categoria da dispesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    //Cria o amount da dispesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = ` <small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`

    //Cria o botão de remoção de dispesa
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")

    //Adiciona nome e categoria na div das informações da despesa
    expenseInfo.append(expenseName, expenseCategory)

    //Adiciona o item na lista
    expenseList.append(expenseItem)

    //adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Limpa o formulario
    formClear()

    //Atualiza os totais
    updateTotals()
  } catch (err) {
    alert("Não foi possivel atualizar a sua lista de despesas")
    console.log(err)
  }
}

//atualiza os totais
function updateTotals() {
  try {
    //Recupera todos os itens (li) da lista (ul)
    const items = expenseList.children

    //atualiza a quantidade de itens da lista
    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`
    //Variavel para incrementar o total
    let total = 0

    //percorre cada item (li) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      //Remove caracteres não numericos e substitui a virgula pelo ponto
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".")

      //converter o valor para float
      value = parseFloat(value)
      console.log(value)
      if (isNaN(value)) {
        return alert(
          "O caractere inserido não é um numero! Por favor insira novamente!"
        )
      }

      total += Number(value)
    }

    //Cria a span para adicionar o R$ formatado
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // Formata o valor e remove o R$ que sera exibido pela small com um estilo customizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Limpa o conteudo do elemento
    expensesTotal.innerHTML = ""

    // Adiciona o simbolo da moeda e o valor totalformatado
    expensesTotal.append(symbolBRL, total)
  } catch (err) {
    console.log(err)
    alert("não foi possivel atualizar seus totais")
  }
}

// Captura um clique nos itens da lista

expenseList.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-icon")) {
    // Obter a li do pai do elemento clicado.
    const item = event.target.closest(".expense")
    // remove o item da lista
    item.remove()
  }
  // atualiza os totais
  updateTotals()
})

function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""

  // Coloca o foco no input do amount
  expense.focus()
}
