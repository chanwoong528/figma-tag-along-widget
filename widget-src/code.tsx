import { setTaskStore } from "./store/taskStore";

// This is a counter widget with buttons to increment and decrement the number.

import MenuList from "./components/MenuList"
import SubTask from "./components/SubTask"
import Task from "./components/Task"
import Minus from "./ui/svg/Minus"
import Plus from "./ui/svg/Plus"
import { TagId } from "./ui/TagId"
import TaskId from "./ui/TaskId"

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, Input, useEffect } = widget
import { TaskProps } from "./type"


const TASK_TYPE = [{
  option: 'Visible',
  label: 'Visible',

}, {
  option: 'Hidden',
  label: 'Hidden',

}]

function Widget() {
  const [widgetMode] = useSyncedState('widgetMode', 'list')
  const [pointerInfo] = useSyncedState('pointerInfo', {
    x: 0,
    y: 0,
    id: '',
    type: '',
  })


  const [pageInfo, setPageInfo] = useSyncedState('pageInfo', {
    title: '',
    description: '',
  })

  const [taskType, setTaskType] = useSyncedState('taskType', TASK_TYPE)
  const [curTaskType, setCurTaskType] = useSyncedState('curTaskType', taskType[0].option)

  const [tasks, setTasks] = useSyncedState<TaskProps[]>('tasks', [
    {
      id: '1',
      type: taskType[0].option,
      description: '',
      children: [],
    },
  ])



  useEffect(() => {
    figma.ui.onmessage = (message) => {
      console.log("message>>", message)
      if (message.type === 'add-task') {
        console.log(message.parentTask)
        const { parentTask } = message


      }
      figma.closePlugin()
    }
  })


  const onTextChange = (e: TextEditEvent, property: string) => {
    setPageInfo({ ...pageInfo, [property]: e.characters })
  }

  const onChangeTask = (e: TextEditEvent, id: string, type: string) => {
    console.log("onChangeTask>> ", id, type, e.characters)

    const newTasks = tasks.map((task) => {
      if (task.id === id && task.type === type) {
        return { ...task, description: e.characters }
      }
      return task
    })
    setTaskStore(newTasks)
    setTasks(newTasks)
  }
  const onChangeSubTask = (e: TextEditEvent, parentId: string, subTaskId: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === parentId) {
        return {
          ...task,
          children: task.children.map((subTask) => {
            if (subTask.id === subTaskId) {
              return { ...subTask, description: e.characters }
            }
            return subTask
          })
        }
      }
      return task
    })

    setTasks(newTasks)

  }
  const onClickAddTask = (taskType: string) => {

    const newId = tasks.filter((task) => task.type === taskType).length + 1

    setTasks(
      [
        ...tasks,
        {
          id: newId.toString(),
          type: curTaskType,
          description: '',
          children: []
        }
      ]
    )
  }

  const onClickAddSubTask = (id: string, type: string) => {

    const newTasks = tasks.map((task) => {
      if (task.id === id && task.type === type) {
        return {
          ...task,
          children: [
            ...task.children,
            {
              id: `${id}-${task.children.length + 1}`,
              type: task.type,
              description: '',
            }
          ]
        }
      }
      return task
    })

    setTasks(newTasks)
  }
  const onClickDeleteTask = (id: string, type: string) => {
    if (tasks.filter((task) => task.type === type).length === 1) {
      return
    }

    const newTasks = tasks.filter(task => !(task.id === id && task.type === type))
    setTasks(newTasks)
  }
  const onClickDeleteSubTask = (parentId: string, subTaskId: string) => {

    const newTasks = tasks.map((task) => {
      if (task.id === parentId) {
        return { ...task, children: task.children.filter((subTask) => subTask.id !== subTaskId) }
      }
      return task
    })
    setTasks(newTasks)
  }


  if (widgetMode === 'pointer') {
    return <TagId pointerInfo={pointerInfo} tasks={tasks} />
  } else {

    usePropertyMenu(
      [
        {
          itemType: 'dropdown',
          propertyName: 'taskType',
          tooltip: 'Task Type',
          options: TASK_TYPE,
          selectedOption: curTaskType,
        },
        {
          itemType: 'separator',
        },

      ],
      ({ propertyName, propertyValue }) => {
        if (propertyName === "taskType") {
          setCurTaskType(propertyValue || '')
        }
      },
    )


    return (
      <AutoLayout
        verticalAlignItems={'center'}
        spacing={16}
        padding={24}
        cornerRadius={8}
        direction="vertical"
        fill={'#FFFFFF'}
        stroke={'#E6E6E6'}
        width={600}
      >


        <Input
          fontSize={40}
          fontWeight={700}
          value={pageInfo.title}
          onTextEditEnd={(e) => onTextChange(e, "title")}
          placeholder="Page Title"
        />
        <Input
          value={pageInfo.description}
          onTextEditEnd={(e) => onTextChange(e, "description")}
          placeholder="Page Description"
        />
        <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
          {taskType.map((loopType) => {

            if (tasks.filter(task => task.type === loopType.option).length === 0) {
              return null
            }

            return (
              <AutoLayout
                direction="vertical"
                spacing={8}
                key={loopType.option}
                width="fill-parent"
              >
                {tasks
                  .filter(taskItem => taskItem.type === loopType.option).length > 0 &&
                  tasks
                    .filter(taskItem => taskItem.type === loopType.option)
                    .map((task) => (
                      <AutoLayout
                        key={task.id + task.type}
                        direction="vertical"
                        spacing={8}
                        width="fill-parent"
                      >
                        <Task
                          key={task.id + task.type}
                          task={task}
                          onChangeTask={onChangeTask}
                          onClickAddSubTask={onClickAddSubTask}
                          onClickDeleteTask={onClickDeleteTask}
                        />
                        {task.children.length > 0 &&
                          task.children?.map((subTask, subIndex) => (
                            <SubTask
                              key={subTask.id + subTask.type || subIndex}
                              parentId={task.id}
                              subTask={subTask}
                              onChangeSubTask={onChangeSubTask}
                              onClickDeleteSubTask={onClickDeleteSubTask}
                            />
                          ))}
                      </AutoLayout>
                    ))
                }
              </AutoLayout>
            )
          })}
        </AutoLayout>


        <Plus onClick={() => onClickAddTask(curTaskType)} />


      </AutoLayout>
    )
  }



}

widget.register(Widget)
