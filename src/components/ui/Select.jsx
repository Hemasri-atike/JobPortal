import React, { useState } from "react";

const Select = () => {
  const [value, setValue] = useState("");

  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select an option</option>
      <option value="group1-option1">Group 1 - Option 1</option>
      <option value="group1-option2">Group 1 - Option 2</option>
      <option value="group2-option1">Group 2 - Option 1</option>
    </select>
  );
};

export default Select;
