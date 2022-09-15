import { ReactComponent as Clock } from '../assets/clock.svg';
import { ReactComponent as TimeNo } from '../assets/timeno.svg';
import { ReactComponent as TimeYes } from '../assets/timeyes.svg';

interface TimeCheckboxProps {
  switchTime: () => void;
  time: boolean;
}

const TimeCheckbox = ({ switchTime, time }: TimeCheckboxProps) => {
  return (
    <div className="py-2 px-2">
      <span onClick={switchTime}>
        <Clock className="h-6 w-6 inline-block" />
        {time ? (
          <TimeYes className="h-4 w-4 inline-block" />
        ) : (
          <TimeNo className="h-4 w-4 inline-block" />
        )}
      </span>
    </div>
  );
};

export default TimeCheckbox;
