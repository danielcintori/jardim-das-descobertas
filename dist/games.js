const CATEGORIES=[['all','Todos os jogos'],['start','Primeiros toques'],['match','Encontrar iguais'],['memory','Memória'],['classify','Agrupar'],['sequence','Sequências'],['pattern','Padrões'],['route','Caminhos'],['repeat','Repetições'],['condition','Escolhas e regras'],['data','Dados'],['interface','Telas e botões'],['safety','Cuidado digital']];
const GROUPS={
start:{label:'Primeiros toques',color:'#e8eedc',concept:'Causa e efeito · entrada e saída',tip:'Demonstre um toque. Depois espere a iniciativa dela. O efeito deve acontecer logo após o toque.',transfer:'Use um interruptor real ou botão de luminária, com supervisão.'},
match:{label:'Encontrar iguais',color:'#f3e6cf',concept:'Comparação · correspondência',tip:'Aponte para o modelo. Diga apenas “ache o igual”. Se necessário, mostre um par e depois retire a pista.',transfer:'Pareie objetos reais da mesma categoria; depois use fotos desses objetos.'},
memory:{label:'Memória',color:'#e9e4f0',concept:'Memória · busca de informação',tip:'Comece com 4 cartas. Vire um par como demonstração. Deixe a aluna escolher o ritmo; não cobre rapidez.',transfer:'Esconda dois pares de objetos sob quatro copos. Mude as posições na próxima sessão.'},
classify:{label:'Agrupar',color:'#e0ece9',concept:'Classificação · filtro',tip:'Mostre o objeto e os dois destinos. Diga a regra curta. A aluna toca no grupo, sem precisar arrastar.',transfer:'Separe objetos reais em duas caixas usando a mesma regra; depois troque os objetos.'},
sequence:{label:'Sequências',color:'#f2e5da',concept:'Algoritmo · ordem de execução',tip:'Mostre a sequência completa uma vez. Depois, peça uma etapa por vez. A ordem faz parte do objetivo.',transfer:'Faça a mesma sequência com objetos reais. Depois veja se ela inicia sem copiar você.'},
pattern:{label:'Padrões',color:'#eeeacb',concept:'Reconhecimento de padrões · previsão',tip:'Percorra as figuras com o dedo e fale seus nomes. Peça somente a próxima figura.',transfer:'Monte a mesma repetição com tampinhas ou blocos e mude cores ou posições.'},
route:{label:'Caminhos',color:'#e2eada',concept:'Instruções · orientação · depuração',tip:'Mostre onde o robô está e onde quer chegar. Toque numa seta uma vez. Espere a escolha da próxima direção.',transfer:'Faça uma trilha de três passos no chão. A aluna pode apontar a direção em vez de caminhar.'},
repeat:{label:'Repetições',color:'#f4e7cc',concept:'Repetição · contador de ações',tip:'Mostre os pontos: cada ponto representa uma ação. Acompanhe sem conduzir a mão. Não exija leitura de números.',transfer:'Repita uma ação corporal a cada objeto colocado numa fila; varie a ação depois.'},
condition:{label:'Escolhas e regras',color:'#e5e9f1',concept:'Condição · decisão · estado',tip:'Leia a regra e aponte as figuras. Mostre um exemplo. Depois mude a situação e observe se aplica a regra.',transfer:'Repita a decisão com cartões físicos e outra pessoa. Dê tempo para observar a mudança.'},
data:{label:'Dados',color:'#ede5da',concept:'Busca · seleção · registros',tip:'Mostre o modelo da busca. Peça para selecionar o registro correspondente. Troque a ordem dos registros.',transfer:'Busque a mesma característica em três objetos reais e depois em fotografias.'},
interface:{label:'Telas e botões',color:'#e3eade',concept:'Interface · evento · controle',tip:'Mostre a transformação esperada. A aluna escolhe o controle pelo símbolo. O texto não é necessário para responder.',transfer:'Procure o mesmo símbolo em um aplicativo real, sempre com acompanhamento.'},
safety:{label:'Cuidado digital',color:'#f1e2dd',concept:'Privacidade · consentimento · pedir ajuda',tip:'Descreva a situação com uma frase. Modele pedir ajuda. Este jogo ensaia uma escolha; a proteção continua sendo responsabilidade dos adultos.',transfer:'Ensaie pedir ajuda com o dispositivo real, sem abrir links desconhecidos nem usar dados pessoais.'}}
const GAMES=[];
function add(cat,rows){rows.forEach((r,i)=>GAMES.push({id:GAMES.length+1,cat,title:r[0],instruction:r[1],goal:r[2],...r[3],level:'Com uma regra',duration:cat==='memory'?'2–4 min':'1–3 min'}))}
add('start',[
['Acenda a luz','Toque na lâmpada.','Perceber que um toque produz uma saída visual.',{scene:'lamp'}],
['Regue a planta','Toque no regador.','Perceber a mudança no mesmo vaso depois de regar.',{scene:'plant'}],
['Olá, Caco!','Toque no Caco para levantar os braços.','Iniciar uma ação por um botão.',{scene:'cactus'}],
['Fruta na cesta','Toque para guardar a melancia.','Identificar um evento que move um objeto.',{scene:'basket'}],
['Liga e desliga','Toque para ligar. Toque para desligar.','Alternar dois estados com o mesmo controle.',{scene:'lamp',toggle:true}]]);
add('match',[
['Frutas iguais','Ache a fruta igual.','Comparar dois símbolos pelo mesmo atributo.',{pool:['🍉','🍌','🍓']}],
['A mesma forma','Ache a forma igual.','Parear formas sem depender de sua posição.',{pool:['●','▲','■']}],
['Amigos do jardim','Ache o igual ao modelo.','Reconhecer correspondência visual.',{pool:['🌵','🌻','🌳']}],
['Peças do computador','Ache a peça igual.','Reconhecer representações de hardware.',{pool:['🖱️','⌨️','🖥️']}],
['Setas iguais','Ache a seta igual.','Discriminar direção de comandos.',{pool:['⬆️','➡️','⬇️']}]]);
add('memory',[
['Pares de frutas','Encontre duas frutas iguais.','Buscar e lembrar posições de dois pares.',{pool:['🍉','🍌','🍓']}],
['Pares do jardim','Encontre dois desenhos iguais.','Retomar uma informação visual escondida.',{pool:['🌵','🌻','🌳']}],
['Pares de formas','Encontre duas formas iguais.','Lembrar posições e comparar formas.',{pool:['●','▲','■']}],
['Pares de tecnologia','Encontre duas peças iguais.','Associar ícones iguais de equipamentos.',{pool:['🖱️','🖥️','⌨️']}],
['Pares de direções','Encontre duas setas iguais.','Comparar orientação e recuperar posições.',{pool:['⬆️','➡️','⬇️']}]]);
add('classify',[
['Fruta ou equipamento?','Toque no grupo deste objeto.','Classificar registros por categoria.',{bins:['🍉','🖥️'],names:['Frutas','Equipamentos'],items:[['🍌',0],['⌨️',1],['🍓',0]]}],
['Redondo ou pontudo?','Escolha o grupo da forma.','Usar uma característica para agrupar dados.',{bins:['●','▲'],names:['Redondas','Triângulos'],items:[['🔵',0],['🔺',1],['🟡',0]]}],
['Planta ou animal?','Escolha o grupo do desenho.','Separar elementos por uma regra estável.',{bins:['🌻','🐈'],names:['Plantas','Animais'],items:[['🌵',0],['🐕',1],['🌳',0]]}],
['Animal ou veículo?','Onde este desenho fica?','Separar elementos em categorias sem sobreposição.',{bins:['🐈','🚗'],names:['Animais','Veículos'],items:[['🐕',0],['🚌',1],['🐈',0]]}],
['Entrada ou saída?','Onde a informação entra? Onde aparece?','Distinguir periféricos de entrada e saída.',{bins:['⌨️','🖥️'],names:['Entra no computador','Sai do computador'],items:[['🖱️',0],['🔊',1],['⌨️',0]]}]]);
add('sequence',[
['Plantar e regar','Primeiro a semente. Depois a água.','Executar duas ações na ordem de um modelo visual.',{order:['seed','💧']}],
['Preparar o computador','Primeiro ligar. Depois usar.','Executar uma sequência funcional de duas etapas.',{order:['power','🖱️']}],
['Lavar a fruta','Primeiro lavar. Depois servir.','Relacionar ordem e resultado de um procedimento.',{order:['wash','serve']}],
['Entregar a mensagem','Primeiro preparar. Depois enviar.','Ordenar origem, envio e destino.',{order:['✉️','📤','📥']}],
['Construir uma tela','Primeiro imagem. Depois botão.','Seguir uma especificação visual de interface.',{order:['🖼️','🔘']}]]);
add('pattern',[
['Frutas em fila','Qual fruta vem agora?','Prever o próximo item em um padrão AB.',{seq:['🍉','🍌','🍉'],answer:'🍌',other:'🍉'}],
['Formas que repetem','Qual forma vem agora?','Reconhecer repetição de formas.',{seq:['●','▲','●'],answer:'▲',other:'●'}],
['O jardim continua','Qual desenho vem agora?','Completar um padrão com pictogramas.',{seq:['🌵','🌻','🌵'],answer:'🌻',other:'🌵'}],
['Setas em ritmo','Qual seta vem agora?','Identificar repetição de comandos.',{seq:['⬆️','➡️','⬆️'],answer:'➡️',other:'⬆️'}],
['Duas e uma','Qual fruta vem agora?','Explorar o padrão AAB com apoio.',{seq:['🍉','🍉','🍌','🍉','🍉'],answer:'🍌',other:'🍉'}]]);
add('route',[
['Um passo até a fruta','Leve o robô até a melancia.','Executar um comando de deslocamento.',{start:3,end:4,walls:[]}],
['Caminho para cima','Leve o robô até a flor.','Associar seta para cima ao deslocamento.',{start:7,end:1,walls:[],target:'🌻'}],
['Virar no jardim','Leve o robô até o cacto.','Combinar duas direções para atingir um destino.',{start:6,end:4,walls:[7],target:'🌵'}],
['Desvie da pedra','Chegue à fruta sem passar na pedra.','Planejar uma rota com restrição.',{start:6,end:2,walls:[4],target:'🍓'}],
['Encontre outra rota','Leve o robô até o computador.','Corrigir uma rota diante de um obstáculo.',{start:0,end:8,walls:[1,4],target:'🖥️'}]]);
add('repeat',[
['Duas sementes','Toque uma vez para cada ponto.','Repetir uma ação com limite de duas vezes.',{symbol:'🌱',times:2}],
['Três frutas na cesta','Toque uma vez para cada ponto.','Usar uma contagem visual para controlar repetição.',{symbol:'🍉',times:3}],
['Dois passos do Caco','Toque uma vez para cada ponto.','Associar cada entrada a uma etapa repetida.',{symbol:'🌵',times:2}],
['Três luzes','Toque até preencher os pontos.','Parar uma repetição após completar o limite.',{symbol:'💡',times:3}],
['Repetir um par','Toque nas figuras da fila.','Executar duas repetições de um bloco de ações.',{order:['seed','💧','seed','💧']}]]);
add('condition',[
['Chuva pede guarda-chuva','Se chover, escolha o guarda-chuva.','Aplicar condição a duas situações visuais.',{scenes:['🌧️','☀️'],answers:['☂️','🧢']}],
['Planta com sede','Se a terra está seca, escolha água.','Associar condição e ação correspondente.',{scenes:['🏜️','💦'],answers:['wateringcan','✋']}],
['Sinal do robô','Verde: andar. Vermelho: parar.','Escolher ação por uma condição sinalizada.',{scenes:['🟢','🔴'],answers:['🚶','✋']}],
['Bateria do aparelho','Bateria vazia: carregar. Cheia: usar.','Relacionar estado do sistema e decisão.',{scenes:['🪫','🔋'],answers:['🔌','🖥️']}],
['O teste da luz','Compare as luzes. Iguais ou diferentes?','Comparar resultado esperado e observado.',{scenes:['same','different'],answers:['pairs-same','pairs-different'],test:true}]]);
add('data',[
['Busque a melancia','Ache a melancia entre os registros.','Buscar um registro visual específico.',{pool:['🍉','🍌','🍓'],target:'🍉'}],
['Procure o computador','Ache o computador.','Localizar informação em um conjunto.',{pool:['🖥️','🖱️','⌨️'],target:'🖥️'}],
['Só as plantas','Toque em todas as plantas.','Filtrar registros por categoria.',{pool:['🌵','🐈','🌻'],targets:['🌵','🌻']}],
['Só as frutas','Toque em todas as frutas.','Selecionar múltiplos registros por uma regra.',{pool:['🍉','🖥️','🍌'],targets:['🍉','🍌']}],
['O registro que faltava','Qual figura está na primeira fila e falta na segunda?','Comparar conjuntos e localizar um dado ausente.',{pool:['🌵','🌻','🌳'],target:'🌻',missing:true}]]);
add('interface',[
['Faça o Caco andar','Toque no botão para começar.','Reconhecer uma ação de interface.',{pool:['▶','Ⅱ'],target:'▶',effect:'O Caco começou a andar.',result:'🎬'}],
['Andar e pausar','Primeiro, faça o Caco andar.','Reconhecer controle e mudança de estado.',{pool:['Ⅱ','▶'],target:'Ⅱ',effect:'O Caco parou no mesmo lugar.',result:'Ⅱ'}],
['Voltar uma tela','Escolha a seta para voltar.','Relacionar navegação e retorno.',{pool:['↩','＋'],target:'↩',effect:'Você voltou para o início.',result:'⌂'}],
['Fechar a janela','Escolha o botão para fechar.','Usar um controle de janela.',{pool:['×','＋'],target:'×',effect:'A janela foi fechada.',result:'🖥️'}],
['Guardar a criação','Escolha o botão para salvar.','Associar um ícone à persistência de informação.',{pool:['💾','🗑️'],target:'💾',effect:'A criação foi guardada.',result:'📁'}]]);
add('safety',[
['Uma mensagem estranha','Mensagem desconhecida. Peça ajuda.','Ensaiar pedido de ajuda antes de abrir conteúdo.',{scene:'📱 ❓',pool:['🙋','📂'],target:'🙋',effect:'Vamos chamar quem acompanha você.'}],
['A senha é privada','Alguém pediu sua senha. Proteja e peça ajuda.','Reconhecer informação que deve ser protegida.',{scene:'🔑 ❓',pool:['🔒','📤'],target:'🔒',effect:'A senha fica protegida. Peça ajuda ao adulto.'}],
['Foto só com permissão','Pediram uma foto. Peça ajuda antes de enviar.','Ensaiar consentimento e mediação para imagens.',{scene:'📷 ❓',pool:['🙋','📤'],target:'🙋',effect:'Antes de enviar, vamos conversar com quem acompanha.'}],
['Este link é seguro?','Você não conhece o link. Peça ajuda.','Interromper a ação para avaliar um link.',{scene:'🔗 ❓',pool:['🙋','👆'],target:'🙋',effect:'Vamos verificar juntos antes de abrir.'}],
['Minha escolha','Você quer continuar ou parar?','Comunicar preferência e ter sua decisão respeitada.',{scene:'😟 📱',pool:['✋','▶'],target:'✋',effect:'Tudo bem parar. Sua escolha será respeitada.'}]]);

// Levels refer to task demands, never to an inferred age or diagnosis.
const FIRST_STEPS=[1,2,3,4,5,6,7,8,11,12,13,60];
const MORE_SUPPORT=[15,20,24,25,30,34,35,40,44,45,50,55,56,57,58,59];
const SPECIFIC_SUPPORT=[
['Mostre a única luminária apagada.','Observe se ela olha para a luz que acendeu após o toque.','Repita com uma luminária real e um interruptor seguro.'],
['Mostre a planta e o regador.','A planta permanece no mesmo vaso; a terra fica molhada. Isso não representa crescimento instantâneo.','Regue uma planta real e compare a terra seca e molhada.'],
['Aponte os braços abaixados do Caco.','O mesmo personagem levanta os braços após o toque.','Combine um gesto seu com um toque dado pela aluna.'],
['Aponte a melancia na mesa e a cesta vazia.','A mesma fruta muda de lugar e fica dentro da cesta.','Passe uma fruta real da mesa para uma cesta.'],
['Demonstre um toque no interruptor.','A mesma luminária liga e depois desliga. Observe as duas mudanças.','Alterne uma luminária segura, sem manipular tomadas.'],
['Mostre a fruta do cartão-modelo.','Verifique se ela escolhe pela figura, mesmo quando a posição muda.','Pareie frutas reais ou fotografias.'],
['Mostre a forma-modelo.','Observe contorno e formato, sem depender do nome da forma.','Pareie duas tampas redondas e dois blocos quadrados.'],
['Apresente cacto, flor e árvore antes de comparar.','A escolha precisa combinar com o modelo, não com o favorito.','Use fotos das plantas da escola.'],
['Mostre os equipamentos reais antes dos desenhos.','A aluna associa a mesma peça em duas posições.','Pareie o mouse real com sua fotografia.'],
['Apresente duas setas apontando para direções diferentes.','Observe se a direção é comparada, e não apenas o formato geral.','Coloque setas de papel apontando para portas diferentes.'],
['Comece com quatro cartas e dois pares.','Observe a busca após uma carta conhecida reaparecer; não cobre velocidade.','Use quatro cartões físicos com as mesmas frutas.'],
['Confirme que as duas plantas são distinguíveis.','Revele um par como exemplo e registre que houve demonstração.','Esconda dois pares de objetos sob quatro copos.'],
['Use dois contornos bem distintos.','Compare a escolha com e sem pista; o jogo não é um teste clínico de memória.','Brinque com pares de peças geométricas reais.'],
['Apresente os nomes das peças sem exigir que a aluna fale.','O objetivo é buscar o par igual, não nomear o equipamento.','Use fotografias das peças usadas no laboratório.'],
['Faça pareamento de setas visíveis antes da memória.','Setas podem parecer muito semelhantes; volte às frutas se necessário.','Use dois pares de setas grandes de papel.'],
['Mostre uma fruta e um computador como exemplos dos grupos.','O objeto escolhido aparece no grupo correspondente.','Separe frutas e objetos de trabalho em duas bandejas.'],
['Mostre o contorno redondo e o triângulo.','Cores diferentes podem continuar no mesmo grupo de formas.','Separe peças pelo formato, variando a cor.'],
['Dê um exemplo de planta e um de animal.','Observe a categoria, sem exigir leitura de seus nomes.','Separe fotografias de plantas e animais conhecidos.'],
['Apresente animal e veículo como grupos diferentes.','A regra evita “voa ou anda”, pois um mesmo animal pode fazer as duas coisas.','Separe miniaturas de animais e carros.'],
['Demonstre mouse, tela e som num computador real.','Esta atividade exige entender entrada e saída; não comece por ela.','Faça uma ação no mouse e observe o resultado na tela.'],
['Mostre o modelo: semente, depois água.','Seguir o modelo é execução de sequência com apoio, não planejamento independente.','Coloque uma semente na terra e depois regue.'],
['Mostre o botão de ligar e o mouse.','A sequência começa no botão do computador, não numa tomada.','Ligue o computador pelo botão próprio, com supervisão.'],
['Mostre a mesma fruta sendo lavada e depois servida.','As figuras representam ações completas, não objetos soltos.','Lave e sirva uma fruta real.'],
['Demonstre uma mensagem preparada, enviada e recebida.','Verifique se a aluna compreende a troca antes de usar estes símbolos.','Entregue um envelope de uma pessoa para outra.'],
['Mostre o modelo da tela: imagem e botão.','Cada escolha acrescenta um elemento visível à tela.','Monte a mesma tela com dois cartões de papel.'],
['Percorra a fila: melancia, banana, melancia.','A figura escolhida ocupa o espaço que faltava.','Faça o mesmo padrão com objetos e depois troque os objetos.'],
['Aponte círculo, triângulo, círculo.','Observe a repetição do formato.','Alterne peças geométricas numa fila.'],
['Aponte os desenhos da esquerda para a direita.','O mesmo padrão pode aparecer começando pela outra figura.','Alterne dois objetos do jardim.'],
['Confirme que as direções das setas são distinguíveis.','Identificar a repetição é diferente de executar o caminho.','Alterne dois cartões de direção.'],
['Mostre a unidade: duas melancias e uma banana.','É mais exigente que alternar duas figuras; ofereça apenas se fizer sentido.','Repita dois blocos iguais e um diferente.'],
['Aponte robô e fruta antes de mostrar as setas.','Um toque desloca o mesmo robô uma casa.','Use uma peça numa trilha física de duas casas.'],
['Mostre que a flor está acima do robô.','Observe cada deslocamento, sem exigir que conte as casas.','Mova uma peça para cima num tabuleiro de papel.'],
['Mostre o destino e a pedra.','A seta executa uma ação; a pedra bloqueia uma casa.','Faça uma curva numa trilha no chão.'],
['Mostre a pedra e deixe a aluna explorar.','Errar uma direção não tira pontos nem reinicia o jogo.','Contorne um objeto real com um carrinho.'],
['Apresente um caminho bloqueado.','A meta é encontrar outra direção, não a rota mais rápida.','Mude a posição de um obstáculo numa trilha conhecida.'],
['Mostre os dois espaços vazios.','Cada toque coloca uma semente em um espaço; o limite fica visível.','Coloque uma semente em cada um de dois potes.'],
['Mostre três espaços na cesta.','Cada toque acrescenta uma fruta, sem trocar o objeto por outro símbolo.','Coloque três objetos em uma bandeja, um de cada vez.'],
['Mostre duas casas à frente do Caco.','Cada toque avança uma casa; o personagem não se multiplica.','Avance uma peça duas casas, um toque por passo.'],
['Mostre as três luminárias apagadas.','Cada toque acende uma luminária; nenhuma vira um sol.','Acenda três luzes ou vire três cartões, um por ação.'],
['Mostre o bloco semente e água duas vezes.','A aluna segue dois blocos repetidos com apoio visual.','Repita plantar e regar em dois vasos.'],
['Descreva o clima mostrado nesta rodada.','A instrução muda junto com o clima; ambas as situações são apresentadas.','Escolha proteção para o clima real antes de sair.'],
['Compare a terra do mesmo vaso seca e molhada.','Regar é uma escolha para terra seca; na molhada, esperar.','Observe a umidade da terra junto com a aluna.'],
['Mostre os sinais e a regra andar ou parar.','Não dependa só da cor: os sinais têm formato e símbolo diferentes.','Brinque de andar e parar com dois cartões diferentes.'],
['Mostre a carga da bateria antes das opções.','Após carregar, a bateria muda visivelmente; aparelhos reais levam tempo.','Observe uma bateria real carregando com um adulto.'],
['Mostre a luz esperada e a luz que apareceu.','Nenhum sinal de igualdade revela a resposta. Compare os estados das luminárias.','Combine uma luz esperada e confira o resultado real.'],
['Mostre a fruta que deve ser encontrada.','A seleção recebe uma marca e permanece visível.','Procure a fruta entre dois objetos reais.'],
['Mostre o computador procurado.','Busque uma peça específica entre outras diferentes.','Encontre um equipamento numa mesa organizada.'],
['Mostre os exemplos de plantas no topo.','Todas as plantas devem ser selecionadas; o animal permanece fora.','Escolha todas as plantas num conjunto de fotografias.'],
['Mostre os exemplos de frutas no topo.','Selecionar um item não basta quando a regra pede todos.','Separe todas as frutas de uma bandeja mista.'],
['Compare as duas coleções, uma acima da outra.','Os modelos permanecem visíveis: é comparação de conjuntos, não memória.','Retire um objeto de uma coleção e compare com uma foto.'],
['Mostre o personagem parado e o botão de iniciar.','O botão inicia um movimento lento, sem som. Se houver desconforto, pare.','Inicie uma animação ou vídeo conhecido com acompanhamento.'],
['Convide a aluna a iniciar e então pausar o movimento.','O personagem para no lugar em que estava; a pausa tem efeito real.','Pause um vídeo conhecido num aparelho real.'],
['Mostre a imagem aberta dentro do aplicativo de exemplo.','Voltar revela a tela anterior do mesmo aplicativo.','Volte uma tela num aplicativo conhecido.'],
['Mostre uma janela sobre a área de trabalho.','Fechar remove a janela e deixa a área de trabalho visível.','Feche uma janela real com acompanhamento.'],
['Mostre o desenho e a pasta ainda vazia.','Salvar cria uma cópia visível na pasta, preservando o desenho.','Guarde um desenho num aplicativo real.'],
['Conte que chegou uma mensagem de alguém desconhecido.','Pedir ajuda chama a mediação; não precisa abrir a mensagem para aprender.','Ensaie chamar a cuidadora diante de uma mensagem desconhecida.'],
['Diga que alguém pediu uma senha.','Proteja a senha e chame uma pessoa responsável; não use uma senha real no jogo.','Ensaie dizer ou indicar “preciso de ajuda”.'],
['Explique que uma foto só deve ser enviada após avaliar permissão e contexto.','A escolha de ajuda interrompe o envio e mostra a pessoa que acompanha.','Converse sobre uma foto de objeto, sem dados pessoais.'],
['Apresente um link desconhecido sem endereço real.','A escolha segura é pedir ajuda antes de abrir.','Ensaie pedir ajuda sem clicar em links desconhecidos.'],
['Pergunte se ela quer continuar ou parar e aguarde.','As duas escolhas são válidas. Parar encerra a atividade imediatamente.','Respeite a mesma comunicação durante outras atividades.']
];
GAMES.forEach((g,i)=>{
  g.level=FIRST_STEPS.includes(g.id)?'Primeiros passos':MORE_SUPPORT.includes(g.id)?'Mais apoio':'Com uma regra';
  g.prepare=SPECIFIC_SUPPORT[i][0];g.observe=SPECIFIC_SUPPORT[i][1];g.transfer=SPECIFIC_SUPPORT[i][2];
  g.duration=g.cat==='memory'?'Sem tempo limite':'Uma rodada curta';
});
GAMES[59].freeChoice=true;
if(typeof module!=='undefined')module.exports={GAMES,GROUPS,CATEGORIES};
