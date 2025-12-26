import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { List, ListItem, IconButton, Box } from "@mui/material";
import CustomInput from "./CustomInput";
import CustomText from "./CustomText";
import { MdDragIndicator } from "react-icons/md";
import {
  UPLOAD_PRESET_NAME,
  CLOUD_NAME,
} from "../constants/CloudinaryConstants";
import JoditEditorComponent from "./JoditEditor";
import { isHtmlContentEmpty } from "../utils/htmlUtils";

const DraggableInputList = ({
  inputState: initialData,
  setFinalData,
  to_show_error = false,
}) => {
  const [data, setLocalData] = useState(
    initialData && initialData.length > 0
      ? initialData
      : [
          {
            day: 1,
            title: "",
            description: "",
            places: [""],
            activiteis: [
              {
                description: "",
                images: [""],
              },
            ],
          },
        ]
  );

  useEffect(() => {
    if (typeof setFinalData === "function") {
      setFinalData(data);
    }
  }, [data, setFinalData]);

  const addItem = () => {
    setLocalData((prevData) => [
      ...prevData,
      {
        day: prevData.length + 1,
        title: "",
        description: "",
        places: [""],
        activiteis: [
          {
            description: "",
            images: [""],
          },
        ],
      },
    ]);
  };

  const removeItem = (index) => {
    setLocalData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setLocalData(updatedData);
  };

  const handleFileInputChange = (index, fileIndex, file) => {
    // const updatedData = [...data]
    // updatedData[index].places[fileIndex] = file
    // setLocalData(updatedData)
    handleFileUpload(itemIndex, placeIndex);
  };

  const addPlaceInput = (index) => {
    setLocalData((prevData) => {
      const newData = [...prevData];
      newData[index].places.push("");
      return newData;
    });
  };

  const removePlaceInput = (index, fileIndex) => {
    setLocalData((prevData) => {
      const newData = [...prevData];
      newData[index].places.splice(fileIndex, 1);
      return newData;
    });
  };

  const handleActivityInputChange = (itemIndex, activityIndex, value) => {
    const updatedData = [...data];
    updatedData[itemIndex].activiteis[activityIndex].description = value;
    setLocalData(updatedData);
  };

  const handleActivityFileInputChange = (
    itemIndex,
    activityIndex,
    imgIndex,
    file
  ) => {
    const updatedData = [...data];
    updatedData[itemIndex].activiteis[activityIndex].images[imgIndex] = file;
    setLocalData(updatedData);
    handleFileUpload(itemIndex, imgIndex, activityIndex);
  };

  const addActivityInput = (index) => {
    setLocalData((prevData) => {
      const newData = [...prevData];
      newData[index].activiteis.push({
        description: "",
        images: [""],
      });
      return newData;
    });
  };

  const removeActivityInput = (itemIndex, activityIndex) => {
    setLocalData((prevData) => {
      const newData = [...prevData];
      newData[itemIndex].activiteis.splice(activityIndex, 1);
      return newData;
    });
  };

  const addActivityImageInput = (itemIndex, activityIndex) => {
    setLocalData((prevData) => {
      const newData = [...prevData];
      newData[itemIndex].activiteis[activityIndex].images.push("");
      return newData;
    });
  };

  const removeActivityImageInput = (itemIndex, activityIndex, imgIndex) => {
    setLocalData((prevData) => {
      const newData = [...prevData];
      newData[itemIndex].activiteis[activityIndex].images.splice(imgIndex, 1);
      return newData;
    });
  };

  const compressImage = async (imageFile) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 800;
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.7
        );
      };

      img.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (
    itemIndex,
    imgIndex,
    activityIndex = null
  ) => {
    let selectedFile;

    if (activityIndex === null) {
      selectedFile = data[itemIndex].places[imgIndex];
    } else {
      selectedFile = data[itemIndex].activiteis[activityIndex].images[imgIndex];
    }

    if (!selectedFile) return;

    const compressedImageBlob = await compressImage(selectedFile);
    const compressedImageFile = new File(
      [compressedImageBlob],
      selectedFile.name,
      { type: "image/jpeg" }
    );

    const formData = new FormData();
    formData.append("file", compressedImageFile);
    formData.append("upload_preset", UPLOAD_PRESET_NAME);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((uploadData) => {
        const updatedData = [...data];

        if (activityIndex === null) {
          // Update place image
          updatedData[itemIndex].places[imgIndex] = uploadData.secure_url;
        } else {
          // Update activity image
          updatedData[itemIndex].activiteis[activityIndex].images[imgIndex] =
            uploadData.secure_url;
        }

        console.log("Uploaded data:", updatedData);
        setLocalData(updatedData); // Update local state
      })
      .catch((error) => {
        console.error("Upload failed", error);
      });
  };

  return (
    <Box>
      <DragDropContext>
        <Droppable droppableId="inputList">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {data.map((item, itemIndex) => (
                <Draggable
                  key={itemIndex}
                  draggableId={`${itemIndex}`}
                  index={itemIndex}
                  isDragDisabled={true}
                >
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        flexDirection: "column",
                        mb: 4,
                        border: "1px solid #ccc",
                        padding: "16px",
                        borderRadius: "8px",
                      }}
                    >
                      <Box className="flex items-center justify-between w-full mb-2">
                        <div className="flex justify-center items-center">
                          <MdDragIndicator size={20} />
                          <CustomText
                            content={`Day ${item.day}`}
                            fontsize="12px"
                          />
                        </div>
                        <IconButton onClick={addItem} color="primary">
                          <FaPlus />
                        </IconButton>
                      </Box>

                      {/* Title Input */}
                      <Box className="flex gap-4 justify-center items-center w-full mb-4">
                        <div className="w-full">
                          <CustomInput
                            value={item.title}
                            onchange={(e) =>
                              handleInputChange(
                                itemIndex,
                                "title",
                                e.target.value
                              )
                            }
                            content="Title"
                            backgroundColor="white"
                            top_title="Title"
                            error_text={
                              to_show_error &&
                              item.title.length == 0 &&
                              "Enter the title to continue"
                            }
                          />
                        </div>
                      </Box>

                      <div className="flex justify-center items-start gap-4">
                        {/* Description Input */}
                        <Box className="flex gap-4 justify-center items-center w-full mb-4">
                          <div className="w-full">
                            <JoditEditorComponent
                              top_title="Description"
                              placeholder="Enter day description"
                              value={item.description}
                              onChange={(content) =>
                                handleInputChange(
                                  itemIndex,
                                  "description",
                                  content
                                )
                              }
                              error_text={
                                to_show_error &&
                                isHtmlContentEmpty(item.description) &&
                                "Enter the description to continue"
                              }
                              height="200px"
                            />
                          </div>
                        </Box>

                        {/* Places Inputs */}
                        <Box className="flex flex-col w-full mb-4">
                          <CustomText
                            secondaryfontsize
                            secondaryfontweight
                            content={`Places (Upload Images):`}
                            className={`mb-3  `}
                          />
                          {item.places.map((place, placeIndex) => (
                            <Box
                              key={placeIndex}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <input
                                type="file"
                                id={`placefile-${itemIndex}-${placeIndex}`}
                                onChange={(e) => {
                                  const updatedData = [...data];
                                  updatedData[itemIndex].places[placeIndex] =
                                    e.target.files[0];
                                  setLocalData(updatedData);
                                  handleFileUpload(itemIndex, placeIndex);
                                }}
                                style={{ display: "none" }}
                              />
                              <div className="border-2 border-dashed border-black rounded-md p-3">
                                <button
                                  className="font-nunitoregular400 text-white bg-black py-3 px-8 rounded-md"
                                  onClick={() => {
                                    if (place?.name == null) {
                                      document
                                        .getElementById(
                                          `placefile-${itemIndex}-${placeIndex}`
                                        )
                                        .click();
                                    } else {
                                      handleFileUpload(itemIndex, placeIndex);
                                    }
                                  }}
                                  disabled={
                                    typeof place === "string" && place !== ""
                                  }
                                >
                                  {typeof place === "string" && place !== ""
                                    ? "Image Uploaded"
                                    : place && place.name
                                      ? "Upload"
                                      : "Browse..."}
                                </button>
                                {(!place ||
                                  (typeof place !== "string" &&
                                    place !== "")) && (
                                  <button
                                    className="font-nunitoregular400 text-black py-3 px-8 rounded-md"
                                    onClick={() =>
                                      document
                                        .getElementById(
                                          `placefile-${itemIndex}-${placeIndex}`
                                        )
                                        .click()
                                    }
                                  >
                                    {place && place.name
                                      ? place.name
                                      : "Or drop Brochure Activity Images here"}
                                  </button>
                                )}
                              </div>
                              {item.places.length > 1 && (
                                <IconButton
                                  onClick={() =>
                                    removePlaceInput(itemIndex, placeIndex)
                                  }
                                  color="error"
                                  sx={{ marginLeft: "8px" }}
                                >
                                  <FaMinus />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                          {/* {to_show_error && item.places?.[0]?.length == 0 && (
                            <div className="flex justify-start my-2">
                              <CustomText
                                content={'Please add a image to continue'}
                                className="text-red-500"
                                fontsize="12px"
                              />
                            </div>
                          )} */}
                          <IconButton
                            onClick={() => addPlaceInput(itemIndex)}
                            color="primary"
                          >
                            <FaPlus />
                          </IconButton>
                        </Box>
                      </div>

                      {/* Activities Inputs */}
                      <Box className="flex flex-col w-full mb-4">
                        <label>Meals and Stays:</label>
                        {item.activiteis.map((activity, activityIndex) => (
                          <Box
                            key={activityIndex}
                            sx={{
                              border: "1px solid #ccc",
                              padding: "16px",
                              borderRadius: "8px",
                              marginBottom: 2,
                            }}
                          >
                            <CustomInput
                              textarea_input
                              value={activity.description}
                              onchange={(e) =>
                                handleActivityInputChange(
                                  itemIndex,
                                  activityIndex,
                                  e.target.value
                                )
                              }
                              content="Enter meals and stays (separate with commas)"
                              backgroundColor="white"
                              top_title="Meals and Stays"
                              placeholder="e.g., Breakfast at Hotel, Lunch at Restaurant, Dinner at Resort"
                            />
                            {/* Activity Image Uploads */}
                            <Box className="flex flex-col mb-2">
                              <CustomText
                                secondaryfontsize
                                secondaryfontweight
                                content={"Upload Images:"}
                                className={`my-3 `}
                              />
                              {activity.images.map((img, imgIndex) => (
                                <Box
                                  key={imgIndex}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 2,
                                  }}
                                >
                                  <input
                                    type="file"
                                    id={`activityfile-${itemIndex}-${activityIndex}-${imgIndex}`}
                                    onChange={(e) =>
                                      handleActivityFileInputChange(
                                        itemIndex,
                                        activityIndex,
                                        imgIndex,
                                        e.target.files[0]
                                      )
                                    }
                                    style={{ display: "none" }}
                                  />

                                  <div className="border-2 border-dashed border-black p-3 rounded-md">
                                    <button
                                      className="font-nunitoregular400 text-white bg-black py-3 px-8 rounded-md"
                                      onClick={() => {
                                        if (img?.name == null) {
                                          document
                                            .getElementById(
                                              `activityfile-${itemIndex}-${activityIndex}-${imgIndex}`
                                            )
                                            .click();
                                        } else {
                                          handleFileUpload(
                                            itemIndex,
                                            imgIndex,
                                            activityIndex
                                          );
                                        }
                                      }}
                                      disabled={
                                        typeof img === "string" && img !== ""
                                      }
                                    >
                                      {typeof img === "string" && img !== ""
                                        ? "Image Uploaded"
                                        : img && img.name
                                          ? "Upload"
                                          : "Browse..."}
                                    </button>
                                    {(!img ||
                                      (typeof img !== "string" &&
                                        img !== "")) && (
                                      <button
                                        className="font-nunitoregular400 text-black py-3 px-8 rounded-md"
                                        onClick={() =>
                                          document
                                            .getElementById(
                                              `activityfile-${itemIndex}-${activityIndex}-${imgIndex}`
                                            )
                                            .click()
                                        }
                                      >
                                        {img && img.name
                                          ? img.name
                                          : "Or drop Brochure Activity Images here"}
                                      </button>
                                    )}
                                  </div>

                                  {activity.images.length > 1 && (
                                    <IconButton
                                      onClick={() =>
                                        removeActivityImageInput(
                                          itemIndex,
                                          activityIndex,
                                          imgIndex
                                        )
                                      }
                                      color="error"
                                      sx={{ marginLeft: "8px" }}
                                    >
                                      <FaMinus />
                                    </IconButton>
                                  )}
                                </Box>
                              ))}
                              {/* {to_show_error &&
                                activity.images?.[0]?.length == 0 && (
                                  <div className="flex justify-start my-2">
                                    <CustomText
                                      content={'Please add a image to continue'}
                                      className="text-red-500"
                                      fontsize="12px"
                                    />
                                  </div>
                                )} */}
                              <IconButton
                                onClick={() =>
                                  addActivityImageInput(
                                    itemIndex,
                                    activityIndex
                                  )
                                }
                                color="primary"
                              >
                                <CustomText
                                  content={
                                    "Meals and Stays (upload images add)"
                                  }
                                  className="text-black p-2"
                                />
                                <FaPlus />
                              </IconButton>
                            </Box>

                            <IconButton
                              onClick={() =>
                                removeActivityInput(itemIndex, activityIndex)
                              }
                              color="error"
                              sx={{ marginTop: 2 }}
                            >
                              <FaMinus />
                            </IconButton>
                          </Box>
                        ))}
                        <IconButton
                          onClick={() => addActivityInput(itemIndex)}
                          color="primary"
                        >
                          <CustomText
                            content={"Add Meals and Stays"}
                            className="text-black p-2"
                          />
                          <FaPlus />
                        </IconButton>
                      </Box>

                      <IconButton
                        onClick={() => removeItem(itemIndex)}
                        color="error"
                      >
                        <FaMinus />
                      </IconButton>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default DraggableInputList;
