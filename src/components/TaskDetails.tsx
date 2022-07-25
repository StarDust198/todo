import { FC } from 'react';

interface TaskDetailsProps {}

const TaskDetails: FC<TaskDetailsProps> = () => {
  return (
    <div className="task-details">
      <div className="task-details--main">
        <input className="task-details--completed" type="checkbox" />
        <input className="task-details--date" type="date" />
      </div>
      <div className="task-details--description">
        <div className="task-details--title">Main task of the week</div>
        <div className="task-details--text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
          laborum eaque dolor nisi omnis earum assumenda odio! Nisi iusto error
          fugit, aperiam ad laboriosam facilis cum aliquam iste iure quis.
        </div>
        <div className="task-details--tags">tag1 tag2 tag3</div>
      </div>
    </div>
  );
};

export default TaskDetails;
