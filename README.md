# Jardim das Descobertas

Atividades simples: 60 experiências visuais para explorar habilidades iniciais de computação com mediação.

## Recursos

- Jogos de causa e efeito, associação, memória, classificação, sequências, padrões, caminhos e segurança digital.
- Instruções curtas com leitura em voz alta, conforme as vozes disponíveis no navegador.
- Memória com 4 ou 6 peças, escolha entre 2 ou 3 alternativas e sessões de 1 ou 3 rodadas.
- Orientações específicas para a cuidadora e opções de pausa, ajuda e encerramento.
- Caderno de acompanhamento com exportação CSV.
- Interface responsiva, mascotes originais e animações opcionais.

## Executar

O projeto usa HTML, CSS e JavaScript, sem instalação de dependências nem etapa de compilação.

Abra `dist/index.html` no navegador ou, com Python instalado, execute na pasta do projeto:

```sh
python -m http.server 8000 --directory dist
```

Acesse http://localhost:8000. No VS Code também é possível abrir `dist/index.html` com Live Server.

## Testar

Com Node.js instalado:

```sh
node check-games.cjs
```

Os testes verificam 14 grupos de comportamento e a conclusão de 360 combinações dos jogos.

## Organização

- `dist/index.html`: página principal.
- `dist/style.css`: estilos e adaptação para celular.
- `dist/art.js`: ilustrações e cenas.
- `dist/games.js`: catálogo e orientações dos 60 jogos.
- `dist/engine.js`: regras das atividades.
- `dist/app.js`: interface, voz, preferências e registros.
- `dist/guide.js`: guia de mediação.
- `tests/engine.test.cjs`: testes de lógica.

Para hospedar em um serviço de sites estáticos, use `dist` como pasta de publicação, sem comando de build. Este envio ao GitHub não configura hospedagem automaticamente.

## Acompanhamento e privacidade

Preferências e registros ficam no armazenamento local do navegador. Não são enviados a um servidor e não acompanham a pessoa ao trocar de dispositivo ou domínio. Exporte o CSV antes de limpar os dados do navegador.

O repositório contém apenas o aplicativo e testes; não inclui documentos individuais da estudante nem registros de acompanhamento.

## Uso pedagógico

Apresente uma atividade por vez e ajuste o apoio conforme as respostas observadas. A associação de figuras e a memória são habilidades preparatórias; completar uma atividade não comprova domínio de computação. Respeite a escolha de parar e use objetos concretos quando os símbolos não forem compreendidos.
