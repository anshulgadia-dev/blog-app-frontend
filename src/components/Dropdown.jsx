import { useState } from "react";
import { Link } from "react-router-dom";

const Dropdown = ({ title, options }) => {
  const [showOptions, setOptions] = useState(false);
  return (
    <div className="flex flex-col">
      <button
        className="cursor-pointer"
        onClick={() => setOptions((prev) => !prev)}
      >
        {title || "Drop Down"}
      </button>
      {showOptions && (
        <div className="bg-white w-fit  duration-150 flex flex-col absolute right-14 top-20 p-3 border rounded-md">
          {options?.map((option) => {
            return (
              <>
                <Link className="border-b" to={option.path}>
                  {option.title}
                </Link>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
