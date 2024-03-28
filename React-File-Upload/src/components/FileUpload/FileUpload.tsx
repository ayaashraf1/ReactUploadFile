import { useState } from "react";
import "./FileUpload.css";
import { FileUploadProps } from "./FileUploadProps";
import axios, { AxiosRequestConfig } from "axios";
import { borderColorVariants, borderRaduisVariants, colorVariants } from "../../helpers/enum";
import React from "react";

const FileUpload = ({
  label,
  borderColor=borderColorVariants.DEFAULT,
  textColor= colorVariants.DEFAULT,
  borderRaduis=borderRaduisVariants.SM
}: FileUploadProps) => {

  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList>();
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [videoPreview, setVideoPreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState(0);

  const Reset = () =>{
    clearFiles();
    setUploadProgress(0);
    setErrorMsg(null);
  }
  const handleChange = async () => {
    Reset();
    let files = (document.querySelector("input[type=file]") as HTMLInputElement)
      ?.files;
    if (files) {
      setSelectedFiles(files);
    }
  };
  const handlePreview = (file:any) => {
    var reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }

    reader.onloadend = function () {
      if (file.type.includes("image")) {
        setImagePreview(reader?.result);
      } else if (file.type.includes("video")) {
        setVideoPreview(reader?.result);
      }
    };
  };
  const clearFiles = () => {
    setImagePreview(null);
    setVideoPreview(null);
  };
  const handleSubmit = (event:any) => {
    event.preventDefault();
    if (!selectedFiles) return;
    const url = "http://localhost:3000/uploadFiles";
    const formData = new FormData();

    selectedFiles &&
      Object.keys(selectedFiles).map((keyName:any, index) => {
        formData.append(`file`, selectedFiles[keyName]);
      });

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      onUploadProgress: function (progressEvent: { loaded: number; total: number; }) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    } as AxiosRequestConfig<FormData>;
    axios
      .post(url, formData, config)
      .then((response) => {
        setErrorMsg(null);
        console.log(response.data);
      })
      .catch((error) => {
        setErrorMsg(error.message);
        console.error("Error uploading files: ", error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="m-5 flex w-screen justify-around flex-wrap max-[625px]:justify-start max-[625px]:flex-col">
      <div className="flex flex-col flex-wrap">
        <label
          htmlFor="file"
          className={`mb-2 ${
           errorMsg
              ? colorVariants.RED
              : textColor
          }`}
        >
          {label}
        </label>
        <input
          id="file"
          name="file"
          type="file"
          className={`${
              errorMsg
              ? borderColorVariants.RED
              : borderColor
          } ${borderRaduis} w-[92%] box-border`}
          onChange={handleChange}
          multiple
        />
        {errorMsg && (
          <small className={colorVariants.RED}>
            Error uploading file:{errorMsg}
          </small>
        )}

        {selectedFiles && selectedFiles?.length > 0 ? (
          <h3 className="mt-[24px] font-bold">Selected Files</h3>
        ) : (
          ""
        )}
        {selectedFiles &&
          Object.keys(selectedFiles).map((keyName:any, i) => (
            <li key={i}>
              <span
                className="cursor-pointer"
                onClick={handlePreview.bind(null, selectedFiles[keyName])}
              >
                {selectedFiles[keyName].name}
              </span>
            </li>
          ))}

        <button
          type="submit"
          className="bg-black text-white p-[5px] px-[10px] mt-[20px] rounded-sm w-20"
        >
          Upload
        </button>
        {uploadProgress ? <div className="flex items-center mt-5"><progress value={uploadProgress} max="100"></progress><span>{uploadProgress+'%'}</span></div>:""}
      </div>
      <div className="flex flex-col flex-wrap max-[625px]:mt-[36px] ">
        <h3 className="font-bold">Preview</h3>
        {imagePreview == null && videoPreview == null && (
          <div className="bg-gray-200 w-[200px] h-[200px] flex items-center justify-center">
            No Selcted File
          </div>
        )}
        {imagePreview != null && (
          <img
            src={imagePreview as string}
            alt=""
            className="w-[200px] h-[200px]"
          />
        )}
        {videoPreview != null && (
          <video
            controls
            src={videoPreview as string}
            className="w-[200px] h-[200px]"
          ></video>
        )}
      </div>
    </form>
  );
};

export default FileUpload;
