import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangePickrr = ({onDateChange,selectedRange}) => {

    const [date, setDate] = useState(selectedRange || {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    const handleDateChange = (newDate) => {
        setDate(newDate.selection);
        onDateChange(newDate.selection);
    };

    return (
        <div className="absolute top-16 z-50 border border-gray-200 shadow-test -left-0">
            <DateRangePicker
                onChange={handleDateChange}
                months={2}
                moveRangeOnFirstSelection={false}
                direction="horizontal"
                ranges={[date]}
                maxDate={new Date()}
            />
        </div>
    );
};

export default DateRangePickrr;