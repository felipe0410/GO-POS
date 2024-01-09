'use client'
import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import Calendar from 'react-calendar';
import { Value } from 'firebase/remote-config';

export default function Home() {
  // const [value, onChange] = React.useState<Value>(new Date());

  return (
    <div>
      hola
      {/* <Calendar onChange={onChange} value={value} /> */}
    </div>
  );
}