import Minus from "../ui/svg/Minus";
import Plus from "../ui/svg/Plus";
import ThreeDot from "../ui/svg/ThreeDot";
import TaskId from "../ui/TaskId";
import MenuList from "./MenuList";

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, Input } = widget

interface Task {
  id: string;
  type: string;
  description: string;
  children: SubTask[];
}
interface SubTask {
  id: string;
  type: string;
  description: string;
}





const Task = ({
  task,
  onChangeTask,
  onClickAddSubTask,
  onClickDeleteTask,
}:
  {
    task: Task
    onChangeTask: (e: TextEditEvent, id: string, type: string) => void,
    onClickAddSubTask: (id: string, type: string) => void,
    onClickDeleteTask: (id: string, type: string) => void,

  }) => {



  return (
    <AutoLayout
      direction="vertical"
      spacing={8}
      padding={16}
      width="fill-parent"
      stroke={"#000000"}
      strokeWidth={1}
      cornerRadius={8}
    >

      <AutoLayout
        direction="horizontal"
        spacing={"auto"}
        width="fill-parent"
      >
        <TaskId id={task.id} type={task.type} />
        <AutoLayout
          direction="vertical"
          spacing={4}
          verticalAlignItems="center"
          horizontalAlignItems="center"
        >

          <Text fontSize={12} fill={"#808080"}>{task.type}</Text>
          <AutoLayout
            direction="horizontal"
            spacing={2}
            verticalAlignItems="center"
            horizontalAlignItems="center"
          >
            <Plus onClick={() => onClickAddSubTask(task.id, task.type)} type="small" />
            <Minus onClick={() => { onClickDeleteTask(task.id, task.type) }
              //
            } type="small" />
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>

      <Input
        width="fill-parent"
        placeholder="Description"
        value={task.description}
        onTextEditEnd={(e) => onChangeTask(e, task.id, task.type)}
      />
    </AutoLayout>
  )
}

export default Task