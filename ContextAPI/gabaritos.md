## Gabarito dos exercícios

**Atenção:** Esse gabarito possui estilização. Caso tenha interesse, utilize o arquivo `.css` fornecido no final da página.

1 - Crie o contexto de sua aplicação. Ele deve conter dados como:
- Quais as quatro tarefas que a família deve realizar.
- Qual a função de cada pessoa.
- Quem deve ser responsável pela Maggie e pelo Cachorro.

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

  changeDay(day) {
    this.randomizeObligations();
    this.maggieAndDog(day);
  }

  render() {
    const { children } = this.props;
    return (
      <MyContext.Provider
        value={ {
          ...this.state,
          changeDay: this.changeDay,
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
- O componente da família deve possuir um `<select>` com os dias da semana. Alterar o dia escolhido deve alterar as tarefas e as responsabilidades no contexto.
- Ao alterar o dia da semana, os responsáveis por cada tarefa devem ser alterados.
- Os componentes dos adultos e das crianças devem ser capazes de apresentar quem é responsável por cuidar da Maggie e do cachorro.
- Os componentes de Homer, Marge, Bart e Lisa devem ser capazes de apresentar suas tarefas, assim como renderizar o componente da Maggie ou do cachorro, caso sejam responsáveis por eles.
- A Maggie e o cachorro devem apresentar quem está responsável por eles.

```js
//...src/components/Family.jsx
import React, { Component } from 'react';
import Adults from './Adults';
import Kids from './Kids';
import MyContext from '../context/MyContext';

class Family extends Component {
  render() {
    const { changeDay } = this.context;
    return (
      <div className="family">
        <select
          name="weekDay"
          onChange={ ({ target: { value } }) => {
            changeDay(value);
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
        <Parent name="Marge" />
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

3 - Crie a lógica para permitir que as tarefas sejam marcadas como completas:
- O Componente da família deve apresentar a lista de tarefas que ainda não foram cumpridas.
- Os componentes de Homer, Marge, Bart e Lisa devem possuir um botão que, caso clicado, finaliza a sua tarefa. Após clicado, esse botão não deve mais aparecer no componente.
- Ao alterar o dia da semana, o status de todas as tarefas devem ser redefinidos.

```js
//.../src/context/MyProvider.js

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doneTasks: [],
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
    this.endTask = this.endTask.bind(this);
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

  endTask(task) {
    this.setState((prevState) => ({
      doneTasks: [...prevState.doneTasks, task],
    }));
  }

  randomizeObligations() {
    const tasks = ['lavar a louça', 'jogar o lixo', 'regar as plantas', 'varrer o chão'];
    const randomizedTasks = tasks
      .map((taskName) => ({ taskName, order: Math.random() }))
      .sort((task1, task2) => task1.order - task2.order)
      .map((task) => task.taskName);
    this.setState({
      doneTasks: [],
      homerObligation: randomizedTasks[0],
      margeObligation: randomizedTasks[1],
      lisaObligation: randomizedTasks[2],
      bartObligation: randomizedTasks[3],
    });
  }

  changeDay(day) {
    this.randomizeObligations();
    this.maggieAndDog(day);
  }

  render() {
    const { children } = this.props;
    return (
      <MyContext.Provider
        value={ {
          ...this.state,
          changeDay: this.changeDay,
          endTask: this.endTask,
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

```js
//...src/components/Family.jsx

import React, { Component } from 'react';
import Adults from './Adults';
import Kids from './Kids';
import MyContext from '../context/MyContext';

class Family extends Component {
  render() {
    const { changeDay, doneTasks } = this.context;
    return (
      <div className="family">
        <div>
          <select
            name="weekDay"
            onChange={ ({ target: { value } }) => {
              changeDay(value);
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
          <h3>Tarefas realizadas:</h3>
          <ul>
            {doneTasks.map((doneTask) => (
              <li key={ doneTask }>{doneTask}</li>
            ))}
          </ul>
        </div>
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
//...src/components/Child.jsx

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MyContext from '../context/MyContext';
import MaggieAndDog from './MaggieAndDog';

class Child extends Component {
  render() {
    const { name } = this.props;
    const { lisaObligation, bartObligation, dogResponsable,
      endTask, doneTasks } = this.context;
    const toDo = name === 'Lisa' ? lisaObligation : bartObligation;
    return (
      <div className="person">
        <div>
          <h3>{name}</h3>
          <h3>{`Minha tarefa é: ${toDo}`}</h3>
          {!doneTasks.some((task) => task === toDo)
          && <button type="button" onClick={ () => endTask(toDo) }>Finalizar</button>}
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

//...src/components/Parent.jsx

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MyContext from '../context/MyContext';
import MaggieAndmaggie from './MaggieAndDog';

class Parent extends Component {
  render() {
    const { name } = this.props;
    const { homerObligation, margeObligation, maggieResponsable,
      endTask, doneTasks } = this.context;
    const toDo = name === 'Homer' ? homerObligation : margeObligation;
    return (
      <div className="person">
        <div>
          <h3>{name}</h3>
          <h3>{`Minha tarefa é: ${toDo}`}</h3>
          {!doneTasks.some((task) => task === toDo)
          && <button type="button" onClick={ () => endTask(toDo) }>Finalizar</button>}
        </div>
        {maggieResponsable === name && <MaggieAndmaggie name="Maggie" />}
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

---

## Bônus

4- Continuaremos na ideia de definir tarefas; porém, agora serão novas tarefas, onde  todos os personagens (Menos a Maggie e o cachorro) podem acessar e decidir quais irão realizar.
 - Quando o dia Sábado for escolhido, além das tarefas normais, deve ser gerada uma lista de botões idêntica nos componentes  dos personagens Homer, Marge, Bart e Lisa.
 - Essa lista deve conter tarefas relacionadas à limpeza e organização da casa. Fique à vontade para escolher quais serão.
 - Quando algum dos personagens marcar alguma tarefa como feita, ela deve sair dessa lista e ir para uma lista geral que mostra quais tarefas já foram concluídas, assim como quem as concluiu.
 - Ao alterar o dia, os status das tarefas de sábado devem ser reiniciados.
 - Atente-se que nenhum desses itens deve estar presente caso o dia escolhido não tenha sido **Sábado**.

```js
//.../src/context/MyProvider.js

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doneTasks: [],
      weekDay: 'segunda',
      saturdayTasks: ['Fazer compras', 'Lavar roupas', 'Cortar grama',
        'Lavar calçada', 'Cuidar das plantas'],
      doneSaturdayTasks: [],
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
    this.endTask = this.endTask.bind(this);
    this.endSaturdayTask = this.endSaturdayTask.bind(this);
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

  endSaturdayTask(doneTask, person) {
    this.setState((prevState) => ({
      saturdayTasks: prevState.saturdayTasks.filter((task) => task !== doneTask),
      doneSaturdayTasks: [...prevState.doneSaturdayTasks, { task: doneTask, person }],
    }));
  }

  endTask(task) {
    this.setState((prevState) => ({
      doneTasks: [...prevState.doneTasks, task],
    }));
  }

  randomizeObligations() {
    const tasks = ['lavar a louça', 'jogar o lixo', 'regar as plantas', 'varrer o chão'];
    const randomizedTasks = tasks
      .map((taskName) => ({ taskName, order: Math.random() }))
      .sort((task1, task2) => task1.order - task2.order)
      .map((task) => task.taskName);
    this.setState({
      doneTasks: [],
      homerObligation: randomizedTasks[0],
      margeObligation: randomizedTasks[1],
      lisaObligation: randomizedTasks[2],
      bartObligation: randomizedTasks[3],
    });
  }

  changeDay(day) {
    this.randomizeObligations();
    this.maggieAndDog(day);
    this.setState({
      weekDay: day,
      saturdayTasks: ['Fazer compras', 'Lavar roupas', 'Cortar grama',
        'Lavar calçada', 'Cuidar das plantas'],
      doneSaturdayTasks: [],
    });
  }

  render() {
    const { children } = this.props;
    return (
      <MyContext.Provider
        value={ {
          ...this.state,
          changeDay: this.changeDay,
          endTask: this.endTask,
          endSaturdayTask: this.endSaturdayTask,
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

```js
//...src/components/DoneSaturdayTasksList.jsx

import React, { Component } from 'react';
import MyContext from '../context/MyContext';

class DoneSaturdayTasksList extends Component {
  render() {
    const { doneSaturdayTasks } = this.context;
    return (
      <div>
        <h3>Tarefas de Sábado:</h3>
        <ul>
          {doneSaturdayTasks.map((doneTask) => (
            <li
              key={ `${doneTask.task} done` }
            >
              {`${doneTask.task} - ${doneTask.person}`}

            </li>
          ))}
        </ul>
      </div>
    );
  }
}

DoneSaturdayTasksList.contextType = MyContext;

export default DoneSaturdayTasksList;

```

```js
//...src/components/SaturdayTasksChecklist.jsx


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MyContext from '../context/MyContext';

class SaturdayTasksChecklist extends Component {
  render() {
    const { saturdayTasks, endSaturdayTask } = this.context;
    const { name } = this.props;
    return (
      <div className="saturday-check-list">
        {saturdayTasks.map((task) => (
          <button
            key={ `${task} toDo` }
            onClick={ () => {
              endSaturdayTask(task, name);
            } }
            type="button"
          >
            {task}

          </button>
        ))}
      </div>
    );
  }
}

SaturdayTasksChecklist.propTypes = {
  name: PropTypes.string.isRequired,
};

SaturdayTasksChecklist.contextType = MyContext;

export default SaturdayTasksChecklist;

```

```js
//...src/components/Parent.jsx

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MyContext from '../context/MyContext';
import MaggieAndmaggie from './MaggieAndDog';
import SaturdayTasksChecklist from './SaturdayTasksChecklist';

class Parent extends Component {
  render() {
    const { name } = this.props;
    const { homerObligation, margeObligation, maggieResponsable,
      endTask, doneTasks, weekDay } = this.context;
    const toDo = name === 'Homer' ? homerObligation : margeObligation;
    return (
      <div className="person">
        <div>
          <h3>{name}</h3>
          <h3>{`Minha tarefa é: ${toDo}`}</h3>
          {!doneTasks.some((task) => task === toDo)
          && <button type="button" onClick={ () => endTask(toDo) }>Finalizar</button>}
        </div>
        {maggieResponsable === name && <MaggieAndmaggie name="Maggie" />}
        {weekDay === 'sabado' && <SaturdayTasksChecklist name={ name } />}
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
import SaturdayTasksChecklist from './SaturdayTasksChecklist';

class Child extends Component {
  render() {
    const { name } = this.props;
    const { lisaObligation, bartObligation, dogResponsable,
      endTask, doneTasks, weekDay } = this.context;
    const toDo = name === 'Lisa' ? lisaObligation : bartObligation;
    return (
      <div className="person">
        <div>
          <h3>{name}</h3>
          <h3>{`Minha tarefa é: ${toDo}`}</h3>
          {!doneTasks.some((task) => task === toDo)
          && <button type="button" onClick={ () => endTask(toDo) }>Finalizar</button>}
        </div>
        {dogResponsable === name && <MaggieAndDog name="Cachorro" />}
        {weekDay === 'sabado' && <SaturdayTasksChecklist name={ name } />}
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


CSS:

```css
.family {
  align-items: center;
  background-color: rgb(243, 243, 157);
  border: 2px solid black;
  display: flex;
  padding: 5px;
}

.family select {
  background-color: tomato;
  border-radius: 10px;
  color: white;
  padding: 10px 20px;
}

.container {
  border: 5px solid black;
  height: 80%;
  margin: 10px;
  text-align: center;
  width: 50%;
}

.person {
  border: 5px solid black;
  display: flex;
  justify-content: space-around;
  margin: 10px;
  padding: 10px;
}

.maggie-and-dog {
  border: 5px solid black;
  width: 120px;
}

.saturday-check-list {
  display: flex;
  flex-direction: column;
}

```