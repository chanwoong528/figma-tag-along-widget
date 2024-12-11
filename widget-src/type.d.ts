export interface TaskProps {
  id: string;
  type: string;
  description: string;
  done: boolean;
  children: SubTaskProps[];
  pointerId: string;
}
export interface SubTaskProps {
  id: string;
  type: string;
  description: string;
  done: boolean;
  pointerId: string;
}
