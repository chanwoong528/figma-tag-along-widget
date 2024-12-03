// This is a counter widget with buttons to increment and decrement the number.

import SubTask from "./components/SubTask";
import Task from "./components/Task";

import Plus from "./ui/svg/Plus";
import { TagId } from "./ui/TagId";

import { TASK_TYPES } from "../common/constant";

const { widget } = figma;
const {
  useSyncedState,
  usePropertyMenu,
  AutoLayout,
  Text,
  SVG,
  Input,
  useEffect,
  useWidgetNodeId,
} = widget;
import { TaskProps } from "./type";

function Widget() {
  const [widgetMode] = useSyncedState("widgetMode", "list");
  const [pointerInfo] = useSyncedState("pointerInfo", {
    x: 0,
    y: 0,
    id: "",
    type: "",
  });

  const [pageInfo, setPageInfo] = useSyncedState("pageInfo", {
    title: "",
    description: "",
  });

  const [taskType, setTaskType] = useSyncedState("taskType", TASK_TYPES);
  const [curTaskType, setCurTaskType] = useSyncedState(
    "curTaskType",
    TASK_TYPES[0].option,
  );

  const [tasks, setTasks] = useSyncedState<TaskProps[]>("tasks", [
    {
      id: "1",
      type: TASK_TYPES[0].option,
      description: "",
      done: false,
      children: [],
    },
  ]);
  const [responsiveWidth, setResponsiveWidth] = useSyncedState(
    "responsiveWidth",
    450,
  );
  const widgetId = useWidgetNodeId();
  const [pointerList, setPointerList] = useSyncedState<
    { id: string; type: string }[]
  >("pointerList", []);

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      console.log("message>>", message);
      if (message.type === "add-task") {
        console.log(message.parentTask);
        const { parentTask } = message;
      }
      figma.closePlugin();
    };
  });

  const onTextChange = (e: TextEditEvent, property: string) => {
    setPageInfo({ ...pageInfo, [property]: e.characters });
  };

  const calculateResponsiveWidth = (targetTasks: TaskProps[]) => {
    const defaultWidth = 450;

    if (!targetTasks || targetTasks.length === 0) {
      return defaultWidth;
    }

    const uniqueTaskTypes = new Set(targetTasks.map((task) => task.type));
    const taskTypeCount = uniqueTaskTypes.size;

    const width = defaultWidth * taskTypeCount;
    return width;
  };

  const onChangeTask = (e: TextEditEvent, id: string, type: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id && task.type === type) {
        return { ...task, description: e.characters };
      }
      return task;
    });

    setTasks(newTasks);
  };
  const onChangeSubTask = (
    e: TextEditEvent,
    parentId: string,
    subTaskId: string,
  ) => {
    const newTasks = tasks.map((task) => {
      if (task.id === parentId) {
        return {
          ...task,
          children: task.children.map((subTask) => {
            if (subTask.id === subTaskId) {
              return { ...subTask, description: e.characters };
            }
            return subTask;
          }),
        };
      }
      return task;
    });

    setTasks(newTasks);
  };
  const onClickAddTask = (taskType: string) => {
    const filteredTasks = tasks.filter((task) => task.type === taskType);

    const newId =
      filteredTasks.length > 0
        ? parseInt(filteredTasks[filteredTasks.length - 1].id) + 1
        : "1";

    const newTasks = [
      ...tasks,
      {
        id: newId.toString(),
        type: curTaskType,
        description: "",
        done: false,
        children: [],
      },
    ];

    setTasks(newTasks);
    setResponsiveWidth(calculateResponsiveWidth(newTasks));
  };

  const onClickAddSubTask = (id: string, type: string) => {
    console.log("onClickAddSubTask>> ", id, type);
    const newTasks = tasks.map((task) => {
      if (task.id === id && task.type === type) {
        const lastId =
          task.children.length > 0
            ? task.children[task.children.length - 1].id.split("-")[1]
            : "";

        return {
          ...task,
          children: [
            ...task.children,
            {
              id: `${id}-${lastId ? parseInt(lastId) + 1 : 1}`,
              type: task.type,
              description: "",
              done: false,
            },
          ],
        };
      }
      return task;
    });

    setTasks(newTasks);
  };

  const onClickDeleteTask = (id: string, type: string) => {
    if (tasks.filter((task) => task.type === type).length === 0) {
      console.log("no task");
      return;
    }

    const newTasks = tasks.filter(
      (task) => !(task.id === id && task.type === type),
    );

    setResponsiveWidth(calculateResponsiveWidth(newTasks));
    setTasks(newTasks);
  };
  const onClickDeleteSubTask = (
    parentId: string,
    subTaskId: string,
    type: string,
  ) => {
    const newTasks = tasks.map((task) => {
      if (task.id === parentId && task.type === type) {
        return {
          ...task,
          children: task.children.filter((subTask) => subTask.id !== subTaskId),
        };
      }
      return task;
    });
    setResponsiveWidth(calculateResponsiveWidth(newTasks));

    setTasks(newTasks);
  };

  if (widgetMode === "pointer") {
    usePropertyMenu(
      [
        {
          itemType: "action",
          propertyName: "show-task",
          tooltip: "Task Type",
        },
      ],
      async (property) => {
        if (property.propertyName === "show-task") {
          const widgetNode = (await figma.getNodeByIdAsync(
            widgetId,
          )) as WidgetNode;
          console.log(">>>>>>>>>>>>>>> ", widgetNode);
        }
        console.log(property);
      },
    );

    return <TagId pointerInfo={pointerInfo} />;
  } else {
    usePropertyMenu(
      [
        {
          itemType: "action",
          tooltip: "Action",
          propertyName: "action",
        },
        {
          itemType: "separator",
        },
        {
          itemType: "dropdown",
          propertyName: "taskType",
          tooltip: "Task Type",
          selectedOption: curTaskType,
          options: TASK_TYPES,
        },
      ],

      ({ propertyName, propertyValue }) => {
        if (propertyName === "taskType") {
          console.log("propertyValue>> ", propertyValue);
          setCurTaskType(propertyValue || "");
        }
      },
    );

    return (
      <AutoLayout
        verticalAlignItems={"center"}
        spacing={16}
        padding={24}
        cornerRadius={8}
        direction='vertical'
        fill={"#FFFFFF"}
        stroke={"#E6E6E6"}
        width={responsiveWidth}>
        <Input
          fontSize={40}
          fontWeight={700}
          value={pageInfo.title}
          onTextEditEnd={(e) => onTextChange(e, "title")}
          placeholder='Page Title'
          width='fill-parent'
        />
        <Input
          width='fill-parent'
          value={pageInfo.description}
          onTextEditEnd={(e) => onTextChange(e, "description")}
          placeholder='Page Description'
        />
        {!!tasks && tasks.length > 0 ? (
          <AutoLayout direction='horizontal' spacing={8} width='fill-parent'>
            {taskType?.map((loopType) => {
              if (
                tasks.filter((taskItem) => taskItem.type === loopType.option)
                  .length === 0
              ) {
                return null;
              }
              return (
                <AutoLayout
                  direction='vertical'
                  spacing={8}
                  key={loopType.option}
                  width='fill-parent'>
                  {tasks.filter((taskItem) => taskItem.type === loopType.option)
                    .length > 0 &&
                    !!tasks &&
                    tasks
                      .filter((taskItem) => taskItem.type === loopType.option)
                      .map((task) => (
                        <AutoLayout
                          key={task.id + task.type}
                          direction='vertical'
                          spacing={8}
                          width='fill-parent'>
                          <Task
                            key={task.id + task.type}
                            task={task}
                            onChangeTask={onChangeTask}
                            onClickAddSubTask={onClickAddSubTask}
                            onClickDeleteTask={onClickDeleteTask}
                          />
                          {task.children.length > 0 &&
                            task.children.map((subTask, subIndex) => (
                              <SubTask
                                key={subTask.id + subTask.type || subIndex}
                                parentId={task.id}
                                subTask={subTask}
                                onChangeSubTask={onChangeSubTask}
                                onClickDeleteSubTask={onClickDeleteSubTask}
                              />
                            ))}
                        </AutoLayout>
                      ))}
                </AutoLayout>
              );
            })}
          </AutoLayout>
        ) : (
          <Text>No Task</Text>
        )}

        <Plus onClick={() => onClickAddTask(curTaskType)} />
      </AutoLayout>
    );
  }
}

widget.register(Widget);
