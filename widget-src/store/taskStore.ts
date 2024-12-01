import { TaskProps } from "../type"

let taskStore: TaskProps[] = []

export const getTaskStore = () => {

  console.log("taskStore>> ", taskStore)

  return taskStore
}
export const setTaskStore = (newTasks: TaskProps[]) => {
  console.log("newTasks>> ", newTasks)
  taskStore = newTasks
}
