Agora que você já entendeu a importância e a utilidade da Context API, iremos aprender como aplicar seus conceitos na prática em aplicações React.

---

## Introdução

Antes de começarmos a aprender como utilizar a Context API, precisamos entender seus objetivos e possíveis casos de uso.

    A Context API tem como objetivo reduzir a complexidade no compartilhamento de dados entre componentes de uma aplicação, permitindo que exista um estado global, comumente denominado de contexto, que armazenará dados que necessitem de ser acessados por diversos componentes sem a necessidade de passá-los via props entre os diversos níveis.

    À primeira vista você pode pensar que essa maneira de compartilhar dados é muito mais conveniente do que a utilização de props. Em diversos casos sim. Porém, dependendo do nível de complexidade de sua aplicação, passar informações entre dois ou três níveis muitas das vezes ainda será mais interessante e simples de se implementar.

    Então... Quando implementar um contexto global? Para responder essa pergunta precisamos refletir sobre a estrutura e funcionalidades da aplicação:

    - Ela possui alguma informação relevante para diversos componentes ou páginas hierarquicamente distantes? (Idioma, Tema Escuro, Informações do usuário,...)

    - Ela contém uma grande quantidade de dados a serem passados? (Lembre-se que a cada prop recebida você deve fazer a verificação utilizado propTypes. Fazer a verificação de grandes quantidades de dados em cada componente é um trabalho muito repetitivo.)

    - A sua aplicação possui dados que se atualizam com frequência ou necessitam de manutenção constante? (Concentrar os dados em um único lugar pode facilitar consideravelmente o processo de desenvolvimento e testes)

    Se sua resposta para alguma das perguntas acima for sim, provavelmente o uso de um contexto global pode ser uma boa opção!

---

## Criando um Contexto

Como a Context API é uma ferramenta nativa do React, não há a necessidade de sua instalação, diferentemente do Redux.

Para criarmos o nosso contexto, que irá armazenar nossos dados, basta utilizamos a função `createContext`, que deve ser importada do React :

```js
import { createContext } from 'react';

const defaultValue = '';

const myContext = createContext(defaultValue);
```

A partir desse momento criamos um novo contexto denominado `myContext`.

A função `createContext` retorna dois componentes essenciais para a utilização do nosso contexto: O `Provider` e o `Consumer`.

O **Provider** tem a função de prover para nossa aplicação o acesso ao nosso contexto e permitir que ele seja alterado.

O **Consumer** tem a função de pegar **o valor fornecido pelo Provider mais próximo**. Caso ele não encontre nenhum valor passado, utilizará o `defaultValue` (valor padrão) caso ele tenha sido fornecido na declaração do nosso contexto.

Para compreendermos melhor como aplicar esses componentes, vamos criar uma aplicação.

Primeiro, iremos criar nossa aplicação React:

```
npx create-react-app my-context-app
```

Agora, vamos criar dois componentes. O `Parent` e, como filho dele, um outro componente, o `Child`, que consumirá os dados de nosso contexto:

```js
//my-context-app/src/Components/Child.js

import React, { Component } from 'react';

class Child extends Component {
  render() {
    return (
      <div className="child">
        <h3>Eu sou o componente filho!</h3>
      </div>
    );
  }
}

export default Child;

```

```js
//my-context-app/src/Components/Parent.js

import React, { Component } from 'react';
import Child from './Child';

class Parent extends Component {
  render() {
    return (
      <div className="parent">
        <h2>Eu sou o componente Pai!</h2>
        <Child />
      </div>
    );
  }
}

export default Parent;

```

A forma mais comum de se utilizar a Context API é criando um diretório para ela. Por isso, vamos criar a pasta `Context` dentro da pasta `src` da nossa aplicação.

Agora, vamos criar nosso contexto e provider:

```js
//my-context-app/src/Context/myContext.js

import { createContext } from 'react';

const MyContext = createContext();

export default MyContext;

```

Note que, como criamos um arquivo dedicado para nosso Contexto, temos que fazer um `export` para poder acessá-lo posteriormente.

```js
//my-context-app/src/Context/myProvider.js

import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '#VQV!',
    };
    this.editData = this.editData.bind(this);
  }

  editData(data) {
    this.setState({
      data,
    });
  }

  render() {
    const { children } = this.props;
    const { data } = this.state;
    return (
      <MyContext.Provider
        value={ {
          data,
          editData: this.editData,
        } }
      >
        { children }
      </MyContext.Provider>
    );
  }
}

export default MyProvider;

```

Perceba que passamos uma prop denominada `value` para nosso componente `myContext.Provider`. É nesse `value` que serão passados todos os dados que desejamos compartilhar, além das funções que alteram esses dados. Esses dados podem ser passados de diversas maneiras, porém a forma mais comum é passá-los dentro de um objeto. A forma ideal para armazenar nossos dados é no próprio estado do Provider. Com isso, podemos facilmente acessar e editar esses valores.

Essa é a estrutura básica de nosso `Provider`. Ele retorna o **Provider** que foi obtido no momento em que definimos nosso `Context`, juntamente com os **valores que desejamos compartilhar**. Tudo isso englobando um componente `Children`.

Agora você provavelmente deve estar se perguntando: "De onde veio esse Children?". Esse componente Children é algum componente que for passado para ele como filho, que é capturado pelo nosso Provider na forma de props. Logo a seguir iremos aplicar esse conceito.

Nota: Não é estritamente necessário que se crie um `myProvider`. Você poderia englobar todo o conteúdo de sua aplicação em componentes já existentes, como o `App.js`, por exemplo. Porém, além de ser mais prático e deixar seu código visualmente mais limpo, utilizar um `myProvider` torna a sua lógica mais concisa e organizada, uma vez que todos os dados relacionados a determinado contexto estariam localizados num único arquivo, criado especialmente para essa função.

Agora vamos prover nosso Contexto para a aplicação.

Edite o arquivo `App.js` com o seguinte conteúdo:

```js
import React from 'react';
import MyProvider from './context/MyProvider';
import Parent from './components/Parent';
import './App.css';

function App() {
  return (
    <MyProvider>
      <Parent />
    </MyProvider>
  );
}

export default App;

```

Perceba que o componente `Parent` foi passado para o `MyProvider` como filho dele. Com isso, o `MyProvider` pode acessar e renderizar o componente `Parent`. A partir desse momento, toda a família de componentes que estiver dentro do `MyProvider` (incluíndo o `Parent` e o `Child`) terá acesso ao seu contexto.

Agora que nossa aplicação já tem acesso ao nosso **Contexto**, é hora de utilizar o `Consumer` para consumir os valores passados por nosso `Provider`.

Para isso, edite o componente `Child`:

```js
import React, { Component } from 'react';
import MyContext from '../context/MyContext';

class Child extends Component {
  render() {
    return (
      <MyContext.Consumer>
        {
          ({ data, editData }) => (
            <div className="child">
              <h3>Eu sou o componente filho!</h3>
              <h4>{data}</h4>
              <input
                type="text"
                onChange={ ({ target }) => {
                  editData(target.value);
                } }
              />
            </div>
          )
        }
      </MyContext.Consumer>

    );
  }
}

export default Child;

```

Foram feitas muitas mudanças em nosso componente, vamos analisar uma por uma:

Primeiro, englobamos todo nosso componente por um `MyContext.Consumer`:

    Como vimos anteriormente, o Consumer tem a função de encontrar o Valor fornecido pelo Provider mais próximo. Nesse caso, nosso único Provider, denominado MyProvider.

    Dentro dele inserimos uma função anônima, e é assim que sempre devemos trabalhar ao usar Consumers para obter os dados de nosso Contexto: Declarar uma função que recebe como parâmetros o conteúdo do nosso Contexto, e retorna o conteúdo de nosso componente.

    Essa função anônima recebe como parâmetro o nosso value, que passamos anteriormente em Nosso Provider, e o desestrutura, obtendo assim os itens data, que tem como valor inicial uma string com valor "#VQV!", e editData, que corresponde a uma função que edita o valor de data.

***Atente-se que, como estamos passando um código javaScript, temos que colocar essa função dentro de chaves `{}`.**

Após isso, adicionamos um heading `<h4>`, passando `data` para ele.

```html
<h4>{data}</h4>
```
Ele será responsável por mostrar em nossa aplicação o valor de `data`.

Por último adicionamos um `input` de texto:

```html
<input
  type="text"
  onChange={ ({ target }) => {
    editData(target.value);
  } }
/>
```

Nesse `input` escreveremos algo e, que executará a função passada no `onChange`, que chamará a função `editData`, passando como parâmetro o valor escrito, ara alterar o valor de `data` do nosso Contexto.

Caso tenha interesse, edite o arquivo `App.css`:

```css
.parent {
  align-items: center;
  background-color: aquamarine;
  border: 5px solid black;
  display: flex;
  flex-direction: column;
  height: 500px;
  justify-content: center;
  text-align: center;
  width: 500px;
}

.parent h2 {
  position: fixed;
  top: 10px;
}

.child {
  background-color: tomato;
  border: 5px solid black;
  height: 250px;
  width: 250px;
}

```

E, finalmente, chegou a hora de iniciar nossa aplicação para visualizarmos tudo que fizemos até agora.

Execute o seguinte comando:

```
npm start
```

Se tudo ocorrer como planejado, você verá uma tela semelhante à essa: :tada:



<figure align="center">
    <img src="https://i.imgur.com/wSPvgAs.png" alt="Context API APP Figure" style="height:400px">
    <figcaption align = "center"><b>Context API APP</b></figcaption>
</figure>
<br>
<br>
<br>

Perceba que nosso componente já está recebendo os dados de nosso Contexto. Agora escreva no `input` e veja o valor apresentado ser alterado!

Como você pôde perceber, mesmo sem receber nenhuma informação do componente `Parent`, o componente `Child` consegue consumir e editar dados.

---

## Consumindo o Contexto

Durante toda a sua jornada de aprendizagem você com certeza já se deparou com casos onde uma mesma tarefa pode ser realizada de diversas maneiras distintas.

Hoje não vai ser diferente. Você viu no conteúdo anterior que para consumirmos um contexto que nos foi provido devemos utilizar o `Consumer`, correto? Sim, essa é uma das formas, mas não é a única. E agora iremos ver mais uma forma para componentes de classe e comentar sobre o uso em componentes funcionais.

*Componentes de Classe*

Nos componentes de classe do React, existe uma propriedade no qual podemos atribuir o valor de nosso **contexto**. O nome dessa propriedade é `contextType`.

Após da atribuição dessa propriedade, o valor do contexto pode ser acessado através de `this.context` podendo ser usado em todos os métodos do ciclo de vida do componentes:

```js
import React, { Component } from 'react';
import MyContext from '../context/MyContext';

class MeuComponente extends Component {
  componentDidMount() {
    const contexto = this.context;
    //Acessamos o valor do contexto com this.context.
    //...
  }

  componentDidUpdate() {
    const contexto = this.context;
    //...
  }

  componentWillUnmount() {
    const contexto = this.context;
    //...
  }

  render() {
    const contexto = this.context;
    //Podemos utilizar o this.context em todos os métodos de ciclo de vida, incluindo a função render.
    //...
  }

}

MeuComponente.contextType = MyContext;
//Atribuimos na propriedade contextType de nosso componente o valor de nosso Contexto.

```

**Atenção:** A Context API nos permite criar mais de um contexto por aplicação. Caso precise consumir mais de um contexto no mesmo componente será necessário o uso do `Consumer`, como visto no conteúdo passado. Caso tenha interesse em ver mais sobre o uso de multiplos contextos, acesse a <a href="https://pt-br.reactjs.org/docs/context.html#consuming-multiple-contexts" target="_blank">documentação</a>.

*Componentes funcionais*

Assim como nos componentes de classe, o uso do `Consumer` é uma forma de acessar o contexto de nossa aplicação, no caso de componentes funcionais ainda temos mais uma opção: O hook useContext().

Mas não se preocupe com isso por enquanto. Na próxima aula você entenderá melhor os componentes funcionais e como os hooks do React funcionam.

---

## Debugando seu contexto

Nesse ponto de seu progresso em React você provavelmente já deve estar bem familiarizado com a ferramenta <a href="https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi" target="_blank">React Developer Tools</a>. Ela também é uma ótima opção para debugar o seu contexto do `Context API`.

Para utilizar a ferramenta, basta acessar os componentes na aba da extensão e selecionar o **componente que consome** o contexto.

No caso da figura abaixo estamos utilizando a aplicação feita anteriormente.
<br>


<figure align="center">
    <img src="https://i.imgur.com/Df4Z9sK.png" alt="Component selection Figure" style="height:150px">
    <figcaption align = "center"><b>Seleção do componente</b></figcaption>
</figure>
<br>
Com isso, teremos acesso a todo o contexto que o componente tem acesso:

<figure align="center">
    <img src="https://i.imgur.com/ECHjCc4.png" alt="Context dev-tools Figure" style="height:100px">
    <figcaption align = "center"><b>Contexto acessado pelo componente Child</b></figcaption>
</figure>

