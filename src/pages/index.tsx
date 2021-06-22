import type { ChangeEvent, FormEvent, VFC } from 'react'
import { useState } from 'react'
import { Layout } from 'src/components/layout'
import type { Task } from 'src/hooks/useTasks'
import { useTasks } from 'src/hooks/useTasks'
import { useWeb3 } from 'src/hooks/useWeb3'
import styled from 'styled-components'

const Home: VFC = () => {
  const { contract, account } = useWeb3()
  const { myTasks, writeTask } = useTasks()

  const [input, setInput] = useState('')

  const handleChangeCheckbox = writeTask(async (index: number) => {
    const targetTask = myTasks[index]

    await contract?.methods.toggleCompleted(targetTask.id).send({ from: account })
  })

  const handleClickDelete = writeTask(async (index: number) => {
    const targetTaskId = myTasks[index].id
    myTasks.filter((task: Task) => task.id !== targetTaskId)

    await contract?.methods.deleteTask(targetTaskId).send({ from: account })
  })

  const handleSubmit = writeTask(async (e: FormEvent) => {
    e.preventDefault()

    if (!input.trim()) {
      alert('空文字のタスクは登録できません')
      return
    }

    await contract?.methods.createTask(input).send({ from: account })

    setInput('')
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  return (
    <Layout>
      <div className="flex flex-col items-center">
        <TodoList>
          {myTasks &&
            myTasks.map((task: Task, index: number) => (
              // <li key={task[0]} className="grid grid-flow-row">
              <li key={task.id}>
                <input type="checkbox" checked={task.isCompleted} onChange={() => handleChangeCheckbox(index)} />
                <p>{task.content}</p>
                <button onClick={() => handleClickDelete(index)}>削除</button>
              </li>
            ))}
        </TodoList>
        <form onSubmit={handleSubmit} className="m-6">
          <input value={input} onChange={handleChange} />
          <button type="submit" className="ml-2">
            登録
          </button>
        </form>
      </div>
    </Layout>
  )
}

const TodoList = styled.ol`
  display: flex;
  flex-direction: column;
  margin: 20px;

  > li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 500px;

    > input {
      width: 20px;
      height: 20px;
    }

    > p {
      font-size: 20px;
      font-weight: 700;
    }
  }
`

export default Home
