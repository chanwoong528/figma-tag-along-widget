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
    onChangeTask: (e: TextEditEvent, id: string) => void,
    onClickAddSubTask: (id: string) => void,
    onClickDeleteTask: (id: string) => void,

  }) => {

  const [isMenuOpen, setIsMenuOpen] = useSyncedState('isMenuOpen', false)

  // const handleClickThreeDot = () => {
  //   setIsMenuOpen(!isMenuOpen)
  // }

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
        <TaskId id={task.id} />
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
            <Plus onClick={() => onClickAddSubTask(task.id)} type="small" />
            <Minus onClick={() => { onClickDeleteTask(task.id) }
              //
            } type="small" />
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>

      <Input
        width="fill-parent"
        placeholder="Description"
        value={task.description}
        onTextEditEnd={(e) => onChangeTask(e, task.id)}
      />
    </AutoLayout>
  )
}

export default Task