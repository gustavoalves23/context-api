## Gabarito dos exercícios

**Atenção:** Esse gabarito possui estilização. Caso tenha interesse, utilize o arquivo `.ccs` no final da página.

1 - Crie o contexto de sua aplicação, ele deve conter dados como:
- Quais as quatro tarefas que a família deve realizar.
- Qual dia da semana é hoje.
- Qual a função de cada pessoa.

```js
//.../src/context/MyContext.js

import { createContext } from 'react';

const MyContext = createContext();

export default MyContext;

```

```js
//.../src/context/MyProvider.js

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homerObligation: '',
      margeObligation: '',
      lisaObligation: '',
      bartObligation: '',
      maggieResponsable: '',
      dogResponsable: '',
    };
    this.randomizeObligations = this.randomizeObligations.bind(this);
    this.maggieAndDog = this.maggieAndDog.bind(this);
    this.changeDay = this.changeDay.bind(this);
  }

  componentDidMount() {
    this.randomizeObligations();
    this.maggieAndDog();
  }

  maggieAndDog(day = 'segunda') {
    const isEvenDay = ['segunda', 'quarta', 'sexta', 'domingo']
      .some((weekDay) => weekDay === day);
    this.setState({
      maggieResponsable: isEvenDay ? 'Homer' : 'Marge',
      dogResponsable: isEvenDay ? 'Lisa' : 'Bart',
    });
  }

  changeDay(day) {
    this.setState({
      day,
    });
  }

  randomizeObligations() {
    const tasks = ['lavar a louça', 'jogar o lixo', 'regar as plantas', 'varrer o chão'];
    const randomizedTasks = tasks
      .map((taskName) => ({ taskName, order: Math.random() }))
      .sort((task1, task2) => task1.order - task2.order)
      .map((task) => task.taskName);
    this.setState({
      homerObligation: randomizedTasks[0],
      margeObligation: randomizedTasks[1],
      lisaObligation: randomizedTasks[2],
      bartObligation: randomizedTasks[3],
    });
  }

  render() {
    const { children } = this.props;
    return (
      <MyContext.Provider
        value={ {
          ...this.state,
          addToDone: this.addToDone,
          changeDay: this.changeDay,
          randomizeObligations: this.randomizeObligations,
          maggieAndDog: this.maggieAndDog,
        } }
      >
        { children }
      </MyContext.Provider>
    );
  }
}

MyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MyProvider;



```

2 - Crie a estrutura de componentes:
- O componente da família deve possuir um `<select>` com os dias da semana. Esse select deve alterar o valor salvo no contexto.
- O Componente da família deve apresentar a lista de tarefas que ainda não foram cumpridas.
- Os componentes dos adultos e das crianças devem ser capazes de apresentar quem é responsável por cuidar da Maggie e do cachorro.
- Os componentes de Homer, Marge, Bart e Lisa devem ser capazes de apresentar suas tarefas, assim como renderizar o componente da Maggie ou do cachorro, caso sejam responsáveis por eles.
- Os componentes de Homer, Marge, Bart e Lisa dever possuir um botão que, caso clicado, finaliza a sua tarefa. Após clicado, esse botão não deve mais aparecer no componente.

```js
//...src/components/Family.jsx
import React, { Component } from 'react';
import Adults from './Adults';
import Kids from './Kids';
import MyContext from '../context/MyContext';

class Family extends Component {
  render() {
    const { changeDay, randomizeObligations, maggieAndDog } = this.context;
    return (
      <div className="family">
        <select
          name="weekDay"
          onChange={ ({ target: { value } }) => {
            changeDay(value);
            randomizeObligations();
            maggieAndDog(value);
          } }
        >
          <option value="segunda">Segunda-feira</option>
          <option value="terça">Terça-feira</option>
          <option value="quarta">Quarta-feira</option>
          <option value="quinta">Quinta-feira</option>
          <option value="sexta">Sexta-feira</option>
          <option value="sabado">Sábado</option>
          <option value="domingo">Domingo</option>
        </select>
        <Adults />
        <Kids />
      </div>
    );
  }
}

Family.contextType = MyContext;

export default Family;


```
```js
//...src/components/Parent.jsx

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MyContext from '../context/MyContext';
import MaggieAndDog from './MaggieAndDog';

class Parent extends Component {
  render() {
    const { name } = this.props;
    const { homerObligation, margeObligation, maggieResponsable } = this.context;
    const personObligation = name === 'Homer' ? homerObligation : margeObligation;
    return (
      <div className="person">
        <div>
          <h3>{name}</h3>
          <h3>{`Minha tarefa é: ${personObligation}`}</h3>
        </div>
        {maggieResponsable === name && <MaggieAndDog name="Maggie" />}
      </div>
    );
  }
}

Parent.contextType = MyContext;

Parent.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Parent;


```
```js
//...src/components/Child.jsx

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MyContext from '../context/MyContext';
import MaggieAndDog from './MaggieAndDog';

class Child extends Component {
  render() {
    const { name } = this.props;
    const { lisaObligation, bartObligation, dogResponsable } = this.context;
    const personObligation = name === 'Lisa' ? lisaObligation : bartObligation;
    return (
      <div className="person">
        <div>
          <h3>{name}</h3>
          <h3>{`Minha tarefa é: ${personObligation}`}</h3>
        </div>
        {dogResponsable === name && <MaggieAndDog name="Cachorro" />}
      </div>
    );
  }
}

Child.contextType = MyContext;

Child.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Child;

```
```js
//...src/components/Adults.jsx

import React, { Component } from 'react';
import Parent from './Parent';
import MyContext from '../context/MyContext';

class Adults extends Component {
  render() {
    const { maggieResponsable } = this.context;
    return (
      <div className="container">
        <h1>Adultos</h1>
        <h2>{`${maggieResponsable} está cuidando da Maggie`}</h2>
        <Parent name="Homer" />
        <Parent name="Margie" />
      </div>
    );
  }
}

Adults.contextType = MyContext;

export default Adults;

```
```js
//...src/components/Kids.jsx

import React, { Component } from 'react';
import Child from './Child';
import MyContext from '../context/MyContext';

class Kids extends Component {
  render() {
    const { dogResponsable } = this.context;
    return (
      <div className="container">
        <h1>Crianças</h1>
        <h2>{`${dogResponsable} está cuidando do cachorro`}</h2>
        <Child name="Bart" />
        <Child name="Lisa" />
      </div>
    );
  }
}

Kids.contextType = MyContext;

export default Kids;

```
```js
//...src/components/MaggieAndDog.jsx

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MyContext from '../context/MyContext';

class MaggieAndDog extends Component {
  render() {
    const { name } = this.props;
    const { dogResponsable, maggieResponsable } = this.context;
    const responsable = name === 'Maggie' ? maggieResponsable : dogResponsable;
    return (
      <div className="maggie-and-dog">
        <h3>{name}</h3>
        <h4>{`${responsable} está cuidando de mim!`}</h4>
      </div>
    );
  }
}

MaggieAndDog.contextType = MyContext;

MaggieAndDog.propTypes = {
  name: PropTypes.string.isRequired,
};

export default MaggieAndDog;


```
```js
//...src/App.js
import React from 'react';
import MyProvider from './context/MyProvider';
import Family from './components/Family';
import './App.css';

function App() {
  return (
    <MyProvider>
      <Family />
    </MyProvider>
  );
}

export default App;

```

CSS:

```css
.family {
background-color: rgb(243, 243, 157);
display: flex;
align-items: center;
border: 2px solid black;
padding: 5px;
}

.family select {
  padding: 10px 20px;
  border-radius: 10px;
  background-color: tomato;
  color: white;
}

.container {
  border: 5px solid black;
  width: 50%;
  height: 80%;
  margin: 10px;
  text-align: center;
}

.person {
  border: 5px solid black;
  margin: 10px;
  padding: 10px;
  display: flex;
  justify-content: space-around;
}

.maggie-and-dog {
  border: 5px solid black;
  width: 120px;
}
```