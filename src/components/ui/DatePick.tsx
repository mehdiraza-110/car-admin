import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

export default function DateFilter({ onDateChange }) {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const handleFromDateChange = (date: Date | null) => {
    setFromDate(date);
    onDateChange(date, toDate);
  };

  const handleToDateChange = (date: Date | null) => {
    setToDate(date);
    onDateChange(fromDate, date);
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <DatePicker
          selected={fromDate}
          onChange={handleFromDateChange}
          placeholderText="From date"
          className="border rounded px-3 py-1 text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <DatePicker
          selected={toDate}
          onChange={handleToDateChange}
          placeholderText="To date"
          className="border rounded px-3 py-1 text-sm"
        />
      </div>
    </div>
  );
}
