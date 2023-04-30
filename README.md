[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/CxFZefIP)
# Decisões de Design
  Pensando na simplicidade de interpretação e na maior complexidade que a visualização interativa pode ter, optamos por um dataset de casos e mortes de Covid pelo mundo. Apesar de ser um tema já bastante discutido e utilizado na criação de visualizações, tem um potencial muito grande para retratar informações ao longo do tempo em uma escala mundial, motivo pelo qual fizemos nossa escolha de visualização. Nesse sentido, inicialmente pensamos em criar um mapa global que mostra a quantidade de casos confirmados diariamente da doença ao longo do tempo em cada país. Após sugestões levantadas, optamos por expandir mais o conjunto de dados representados, e agora podemos alterar entre casos diários, casos totais confirmados, mortes diárias, mortes totais confirmadas e uma média móvel de casos de uma semana para cada país.
  
  O mapa retrata todas essas informações em cada data do ano: há uma slider abaixo que pode ser movido para a esquerda (datas mais antigas) e para a direita (datas mais atuais). Quanto mais casos o país ter, mais forte é o tom da sua coloração, visto que naturalmente assimilamos a intensidade da cor com a quantidade de casos. Em relação a codificações visuais, deixamos a cor base como vermelha, em razão da cor ser comumente associada a "coisas ruins" em visualização, o que também induz o leitor a compreender o que está sendo transmitido. Outra funcionalidade necessária é o nosso tooltip: quando passamos o mouse por cima de algum país, podemos ver o número exato da informação na data colocada, o que se torna extremamente útil, dado que conseguimos extrair somente em que grupo o país se situa pelas cores. Além disso, há um ranking abaixo do botão de alternar dados que mostra os países com mais casos/mortes/media móvel naquele dia específico, dependendo do que queremos analisar. Por exemplo, com essa função conseguimos ver exatamente quais eram os 10 países com mais mortes totais em cada data, desde o início da pandemia. Por fim, há um botão abaixo do Slider que permite ao leitor ver a evolução das datas sem rolagem desse slider, pois agora isso é feito automaticamente. Como houve um impasse em relação aos steps (de quanto em quanto tempo o botão "pula" entre datas), concluimos que seria mais interessante deixar uma opção de ajuste, onde é possível escolher a quantidade de dias para isso.
 
 A escolha de representar esses dados em um mapa não foi uma questão muito difícil para o grupo. Como teríamos informações de todos os países por data, qual ideia melhor do que uma visualização como essa? Tem-se uma grande facilidade para interpretação de resultados, assim como a interatividade é bastante simples de lidar. É uma escolha efetiva e imediata para o que queremos. Acreditamos que um leitor, sem muito conhecimento de conteúdos de visualização de dados, conseguiria tranquilamente lidar com essa visualização, o que nos incentivou ainda mais a escolha. Foi considerado fazer um scatterplot em que cada círculo representaria um país, assim o eixo x traria informações da data e o eixo y, as informações de casos.  Entretanto, pelas questões demonstradas acima, optamos pelo mapa de dados.
 
 
# Processo de desenvolvimento
Inicialmente, nos juntamos e fizemos as partes iniciais - escolhemos o dataset, visualização, codificações e ideias que iremos implementar ao longo do trabalho. De modo geral, até o MVP o Gabriel foi responsável por criar o código inicial - importando dados e o mapa utilizado -, enquanto o Cleomar e o Gustavo fizeram adições para deixar a visualização mais interessante. Para a parte da melhoria da visualização, os 3 membros se dividiram para criar o que foi solicitado, se ajudando quando necessário. A parte mais demorada foi a criação inicial do mapa e fazer com que aconteça a interatividade entre as datas e o mapa. Demoramos cerca de 2 dias para terminar o MVP - trabalhando as tardes e noites. Para o projeto final, foram necessários mais 2 dias, visto que já estávamos mais habituados as ferramentas usadas.


# Fonte dos dados
[OWID - covid 19 data](https://github.com/owid/covid-19-data/tree/master/public/data)
