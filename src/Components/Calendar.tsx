import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export const MyCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <>
      <div>
        <Calendar onChange={onChange} showWeekNumbers value={value} />
      </div>
      <div>
        Selected Date {value!.toLocaleString("uk").split(', ')[0] || "No date selected"}
      </div>
    </>
  );
}
