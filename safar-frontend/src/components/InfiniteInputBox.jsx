import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import CustomText from "./CustomText";
import JoditEditorComponent from "./JoditEditor";
import { isHtmlContentEmpty } from "../utils/htmlUtils";

const InfiniteInputBox = ({
  setState,
  initialValues = [],
  top_title = "",
  top_title_font_size = "12px",
  objectstate = false,
  onChange = [],
  minW = "400px",
  placeholder_text = "value",
  useJoditEditor = false,
  to_show_error = false,
  height = "150px",
}) => {
  const [inputs, setInputs] = useState(
    initialValues.length > 0 ? initialValues : [""]
  );

  useEffect(() => {
    if (objectstate == true) {
      onChange(inputs);
    } else {
      setState(inputs);
    }
  }, [inputs, setState]);

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const addInputBox = () => {
    setInputs([...inputs, ""]);
  };

  const removeInputBox = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs.length > 0 ? newInputs : [""]);
  };

  return (
    <div>
      <div className="flex items-start">
        <CustomText
          content={top_title}
          fontsize={top_title_font_size}
          className="my-4"
        />
      </div>
      {inputs.map((inputValue, index) => (
        <div key={index} className="flex items-start mb-4">
          {useJoditEditor ? (
            <div className="w-full mr-2">
              <JoditEditorComponent
                top_title={`${top_title} ${index + 1}`}
                placeholder={`Enter ${placeholder_text} ${index + 1}`}
                value={inputValue}
                onChange={(content) => handleInputChange(index, content)}
                error_text={
                  to_show_error &&
                  isHtmlContentEmpty(inputValue) &&
                  `Enter ${placeholder_text} to continue`
                }
                height={height}
              />
            </div>
          ) : (
            <input
              type="text"
              id={`input-${index}`}
              name={`input-${index}`}
              value={inputValue}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className={`border border-gray-300 p-2 w-full rounded-md flex-grow mr-2`}
              style={{ minWidth: minW }}
              placeholder={`Enter ${placeholder_text} ${index + 1}`}
            />
          )}

          {index === inputs.length - 1 && (
            <button
              type="button"
              onClick={addInputBox}
              className="bg-black text-white p-2 rounded-full w-8 h-8 flex justify-center items-center mr-2"
            >
              <FaPlus color="white" />
            </button>
          )}

          {inputs.length > 1 && (
            <button
              type="button"
              onClick={() => removeInputBox(index)}
              className="bg-black text-white p-2 rounded-full w-8 h-8 flex justify-center items-center"
            >
              <FaMinus color="white" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default InfiniteInputBox;
