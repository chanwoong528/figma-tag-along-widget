export interface TaskProps {
  id: string;
  type: string;
  description: string;
  done: boolean;
  children: SubTaskProps[];
}
export interface SubTaskProps {
  id: string;
  type: string;
  description: string;
  done: boolean;
}
