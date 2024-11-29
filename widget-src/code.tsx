// This is a counter widget with buttons to increment and decrement the number.

import MenuList from "./components/MenuList"
import SubTask from "./components/SubTask"
import Task from "./components/Task"
import Minus from "./ui/svg/Minus"
import Plus from "./ui/svg/Plus"

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, Input, useEffect } = widget
interface TaskProps {
  id: string;
  type: string;
  description: string;
  children: SubTaskProps[];
}
interface SubTaskProps {
  id: string;
  type: string;
  description: string;
}
function Widget() {
  const [count, setCount] = useSyncedState('count', 0)

  // const [curMenus, setCurMenus] = useSyncedState('curMenus', {
  //   x: 0,
  //   y: 0,
  //   isOpen: false,
  // })

  const [pageInfo, setPageInfo] = useSyncedState('pageInfo', {
    title: '',
    description: '',
  })

  const [taskType, setTaskType] = useSyncedState('taskType', ['Visible'])

  const [tasks, setTasks] = useSyncedState<TaskProps[]>('tasks', [
    {
      id: '1',
      type: taskType[0],
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
        onClickAddSubTask(parentTask.id)

      }
      figma.closePlugin()
    }
  })


  usePropertyMenu(
    [
      {
        itemType: 'action',
        propertyName: 'reset',
        tooltip: 'Reset',
      },
      {
        itemType: 'separator',
      },
      {
        itemType: 'action',
        propertyName: 'toFive',
        tooltip: 'Set to 5',
      },
      {
        itemType: 'action',
        propertyName: 'toTen',
        tooltip: 'Set to 10',
      },
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === "reset") {
        setCount(0)
      } else if (propertyName === "toFive") {
        setCount(5)
      } else if (propertyName === "toTen") {
        setCount(10)
      }
    },
  )
  const onTextChange = (e: TextEditEvent, property: string) => {
    setPageInfo({ ...pageInfo, [property]: e.characters })
  }

  const onChangeTask = (e: TextEditEvent, id: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, description: e.characters }
      }
      return task
    })
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
    setTasks(
      [
        ...tasks,
        {
          id: (tasks.length + 1).toString(),
          type: taskType,
          description: '',
          children: []
        }
      ]
    )
  }
  const onClickAddSubTask = (id: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
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
  const onClickDeleteTask = (id: string) => {
    if (tasks.length === 1) {
      return
    }
    const newTasks = tasks.filter((task) => task.id !== id)
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


      <AutoLayout direction="vertical" spacing={8} width="fill-parent">

        {tasks?.map((task, index) => (
          <>

            <Task
              key={task.id || index}
              task={task}
              onChangeTask={onChangeTask}
              onClickAddSubTask={onClickAddSubTask}
              onClickDeleteTask={onClickDeleteTask}
            // onClickThreeDot={onClickThreeDot}
            />
            {task.children.length > 0 &&
              task.children?.map((subTask, subIndex) => (
                <SubTask
                  key={subTask.id || subIndex}
                  parentId={task.id}
                  subTask={subTask}
                  onChangeSubTask={onChangeSubTask}
                  onClickDeleteSubTask={onClickDeleteSubTask}
                />
              ))}
          </>
        ))}
      </AutoLayout>
      <Plus onClick={() => onClickAddTask(taskType[0])} />


    </AutoLayout>
  )
}

widget.register(Widget)
