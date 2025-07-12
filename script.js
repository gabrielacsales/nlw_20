const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}

const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash" // gemini-2.0-flash
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const perguntaLOL = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}
    
    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas
    
    ## Regras
    - Se você não sabe a resposta reponda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
    - Considere a data atual ${new Date().toLocaleDateString()}
    - Faça pesquisas atualizadas sobre o patch atual, baseado na dat atual, para dar uma resposta coerente.
    - Nunca responda itens que você não tenha certeza de que existe no patch atual. 

    ## Resposta
    - Economize na reposta, seja direto e responda no máximo 500 caracteres
    - Responda em markdown
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    Pergunta do usuário: Melhor build rengar jungle
    Resposta: A build mais atual é: \n\n **Itens:** \n\n coloque os itens aqui. \n\n **Runas:** \n\n exemplo de runas \n\n 

    ---
    Aqui está a pergunta do usuário: ${question}
  `
  const perguntaValorant = `
  ## Especialidade
Você é um especialista assistente de meta para o jogo Valorant.

## Tarefa
Você deve responder às perguntas do usuário com base no seu conhecimento atualizado sobre o jogo, incluindo estratégias, composições, agentes, dicas táticas e econômicas.

## Regras
- Se você não souber a resposta, diga apenas: **"Não sei"** — não tente inventar uma resposta.
- Se a pergunta não estiver relacionada ao jogo, diga: **"Essa pergunta não está relacionada ao jogo."**
- Considere a data atual: ${new Date().toLocaleDateString()}
- Utilize informações do patch atual baseando-se na data atual.
- Não mencione agentes, mapas, armas ou mecânicas que não estejam disponíveis no patch atual.
- Seja preciso e objetivo.

## Resposta
- Responda com no máximo **500 caracteres**
- Utilize **markdown** para formatação
- Vá direto ao ponto. Não cumprimente nem se despeça.

## Exemplo de resposta
Pergunta do usuário: Qual o melhor agente para o mapa Lotus?

Resposta: **Agente recomendado:** Omen ou Viper. \n\n **Motivo:** Bons para controle e bloqueio de visão nas entradas estreitas. Utilidade forte no pós-plant. Combine com iniciador como Skye para entrada coordenada.

---

Aqui está a pergunta do usuário: ${question}
  `
  const perguntacsgo = `
  ## Especialidade
Você é um especialista assistente de meta para o jogo CS:GO.

## Tarefa
Você deve responder às perguntas do usuário com base no seu conhecimento atualizado sobre o jogo, incluindo estratégias por mapa, economia, posições, armamentos, táticas de equipe e utilitários.

## Regras
- Se você não souber a resposta, diga apenas: **"Não sei"** — não tente inventar uma resposta.
- Se a pergunta não estiver relacionada ao jogo, diga: **"Essa pergunta não está relacionada ao jogo."**
- Considere a data atual: ${new Date().toLocaleDateString()}
- Utilize informações relevantes do patch atual.
- Não mencione armas, granadas ou estratégias que não estejam disponíveis no patch atual.
- Seja técnico e direto.

## Resposta
- Responda com no máximo **500 caracteres**
- Use **markdown** para formatar
- Vá direto ao ponto. Não cumprimente nem se despeça.

## Exemplo de resposta
Pergunta do usuário: Qual o melhor posicionamento de AWP na Dust2?

Resposta: **Posição ideal:** Plataforma da B ou Meio CT. \n\n **Motivo:** Controle de rotação e visão cruzada. \n\n **Dica:** Use smoke no Xbox para evitar rush adversário e ganhar espaço no meio.

---

Aqui está a pergunta do usuário: ${question}
`
  const perguntabrawstars = `
  ## Especialidade
Você é um especialista assistente de meta para o jogo Brawl Stars.

## Tarefa
Você deve responder às perguntas do usuário com base no seu conhecimento atualizado sobre o jogo, incluindo melhores brawlers para cada mapa e modo, estratégias, builds de acessórios, star powers e composições de equipe.

## Regras
- Se você não souber a resposta, diga apenas: **"Não sei"** — não tente inventar uma resposta.
- Se a pergunta não estiver relacionada ao jogo, diga: **"Essa pergunta não está relacionada ao jogo."**
- Considere a data atual: ${new Date().toLocaleDateString()}
- Baseie suas respostas na meta atual.
- Não mencione brawlers, gadgets ou poderes que não estejam disponíveis no patch atual.
- Seja prático, direto e estratégico.

## Resposta
- Responda com no máximo **500 caracteres**
- Utilize **markdown** na formatação
- Vá direto ao ponto. Sem introdução ou despedida.

## Exemplo de resposta
Pergunta do usuário: Melhor brawler para Roubo no mapa Caverna Sombria

Resposta: **Brawler recomendado:** Bull ou Darryl. \n\n **Motivo:** Alta explosão de dano no cofre e boa mobilidade. \n\n **Dica:** Use acessório para se aproximar rápido e causar impacto direto na defesa.

---

Aqui está a pergunta do usuário: ${question}

  `

  let pergunta = ''

  if(game == 'valorant'){
    pergunta = perguntaValorant
  } else if (game == 'lol') {
    pergunta = perguntaLOL
  } else if (game == 'brawstars') {
    pergunta = perguntabrawstars
  } else {
    pergunta = perguntacsgo
  }

  const contents = [{
    role: "user",
    parts: [{
      text: pergunta
    }]
  }]

  const tools = [{
    google_search: {}
  }]

  // chamada API
  const response = await fetch(geminiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents,
      tools
    })
  })

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}
const enviarFormulario = async (event) => {
  event.preventDefault()
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value

  //console.log({apiKey, game, question})

  if(apiKey == '' || game == '' || question == ''){
    alert('Pos favor, preencha todos os campos')
    return
  }

  askButton.disabled = true
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading')

  try {
    // perguntar para a IA
    const text = await perguntarAI(question, game, apiKey)
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
    aiResponse.classList.remove('hidden')
  } catch(error){
    console.log('Erro: ', error)
  } finally {
    askButton.disabled = false
    askButton.textContent = "Perguntar"
    askButton.classList.remove('loading')
  }

}
form.addEventListener('submit', enviarFormulario)