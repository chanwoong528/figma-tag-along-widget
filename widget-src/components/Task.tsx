import { TaskProps } from "../type";
import Minus from "../ui/svg/Minus";
import Plus from "../ui/svg/Plus";

import TaskId from "../ui/TaskId";

const { widget } = figma;
const { AutoLayout, Text, Input } = widget;

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
  index,
  task,
  onChangeTask,
  onClickAddSubTask,
  onClickDeleteTask,
  onEditTask,
}: {
  index: string;
  task: Task;
  onChangeTask: (e: TextEditEvent, id: string, type: string) => void;
  onClickAddSubTask: (id: string, type: string) => void;
  onClickDeleteTask: (id: string, type: string) => void;
  onEditTask: (
    id: string,
    type: string,
    key: keyof TaskProps,
    value: string,
    parentId?: string,
  ) => void;
}) => {
  return (
    <AutoLayout
      name={`Task-${task.id}-${task.type}`}
      direction='vertical'
      spacing={8}
      padding={16}
      width='fill-parent'
      stroke={"#000000"}
      strokeWidth={1}
      cornerRadius={8}>
      <AutoLayout direction='horizontal' spacing={"auto"} width='fill-parent'>
        <TaskId
          index={index}
          task={task}
          onEditTask={onEditTask}
          // id={task.id} type={task.type}
        />
        <AutoLayout
          direction='vertical'
          spacing={4}
          verticalAlignItems='center'
          horizontalAlignItems='center'>
          <Text fontSize={12} fill={"#808080"}>
            {task.type}
          </Text>
          <AutoLayout
            direction='horizontal'
            spacing={2}
            verticalAlignItems='center'
            horizontalAlignItems='center'>
            <Plus
              onClick={() => onClickAddSubTask(task.id, task.type)}
              type='small'
            />
            <Minus
              onClick={() => onClickDeleteTask(task.id, task.type)}
              type='small'
            />
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>

      <Input
        width='fill-parent'
        placeholder='Description'
        value={task.description}
        onTextEditEnd={(e) => onChangeTask(e, task.id, task.type)}
      />
    </AutoLayout>
  );
};

export default Task;
