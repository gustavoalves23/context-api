## Agora, a prática:

Agora que você aprendeu a usar a `Context API` em suas aplicações React, vamos praticar! Caso tenha algum problema ou dificuldade não hesite em pesquisar ou pedir ajuda no Slack. E não se esqueça, a <a href="https://pt-br.reactjs.org/docs/context.html" target="_blank">Documentação</a> é a sua melhor aliada!

Em algum momento da sua vida você provavelmente já ouviu falar  da comédia animada "Os Simpsons". Pois bem, hoje iremos praticar o que aprendermos ajudando essa familia a organizar as suas tarefas!

Iremos trabalhar com os cinco personagens principais da série e o cachorro da família, onde os personagens Homer, Marge, Bart e Liza serão responsáveis por tarefas que são direcionadas a cada um de forma aleatória. Além disso, nas segundas, quartas, sextas e domingos o Homer é responsável de cuidar da bebê Maggie, já nos outros dias a responsável é a Marge. O mesmo vale para o cachorro: nas segundas, quartas, sextas e domingos quem dá ração para ele é a Liza, já nos outros dias o Bart.


Pontos importantes:

- Cada personagem deve corresponder a um componente de sua aplicação.
- Cada personagem só deve saber somente aquilo que for necessário. (O Homer não precisa saber que vai cuidar do cachorro, por exemplo)
- Todas as informações devem ser obtidas do contexto da aplicação.

**Dica:** Os componentes que você deve desenvolver contém várias similaridades. Tente desenvolver componentes reútilizaveis.

A estrutura das responsabilidades deve ser semelhante à essa:

<figure align="center">
    <img src="https://i.imgur.com/tIacr9k.png" alt="Simpson component three Figure" style="height:400px">
    <figcaption align = "center"><b>Estrutura de responsabilidades</b></figcaption>
</figure>

- Deve existir um componente para os adultos e outro para as crianças. Esses componentes devem saber e apresentar quem vai ficar responsável pela Maggie ou o Cachorro.
- A Maggie e o Cachorro devem ser componentes filhos de seus respectivos responsáveis, sendo que o componente só deve ser renderizado dentro do que for responsável por ele no dia.
- Maggie e o Cachorro devem saber e apresentar quem é responsável por eles.
- Homer, Marge, Bart e Liza devem saber e apresentar qual a sua tarefa do dia.

Agora que você já entendeu a estrutura da aplicação, vamos aos exercícios:

1 - Crie o contexto de sua aplicação, ele deve conter dados como:
- Quais as quatro tarefas que a família deve realizar.
- Qual dia da semana é hoje.
- Qual a função de cada pessoa.

2 - Crie a estrutura de componentes:
- O componente da família deve possuir um `<select>` com os dias da semana. Esse select deve alterar o valor salvo no contexto.
- O Componente da família deve apresentar a lista de tarefas que ainda não foram cumpridas.
- Os componentes dos adultos e das crianças devem ser capazes de apresentar quem é responsável por cuidar da Maggie e do cachorro.
- Os componentes de Homer, Marge, Bart e Liza devem ser capazes de apresentar suas tarefas, assim como renderizar o componente da Maggie ou do cachorro, caso sejam responsáveis por eles.
- Os componentes de Homer, Marge, Bart e Liza dever possuir um botão que, caso clicado, finaliza a sua tarefa. Após clicado, esse botão não deve mais aparecer no componente.

3 - Crie a lógica para definir de forma aleatória as tarefas:
- Ao alterar o dia da semana, os responsáveis por cada tarefa devem ser alterados.
- Ao alterar o dia da semana, o status de todas as tarefas devem ser redefinidos.

---

Bônus

Utilizando a mesma aplicação dos exercícios anteriores, resolva mais esse exercício:

4- Continuaremos na ideia de definir tarefas , porém, agora serão novas tarefas onde  todos os personagens (Menos a Maggie e o cachorro) podem acessar e decidir quais desejam realizar.
 - Quando o dia Sábado for escolhido, além das tarefas normais, deve ser gerado uma `checklist` idêntica nos componentes  dos personágens Homer, Marge, Bart e Liza.
 - Essa `checklist` deve conter tarefas relacionadas à limpeza e organização da casa. Fique a vontade para escolher quais serão.
 - Quando algum dos personagens marcar alguma tarefa como feita, ela deve sair da `checklist` e ir para uma lista geral que mostra quais tarefas já foram concluidas, assim como quem à concluiu.
 - Atente-se que nenhum desses ítens deve estar presente caso o dia escolhido não seja **Sábado**.