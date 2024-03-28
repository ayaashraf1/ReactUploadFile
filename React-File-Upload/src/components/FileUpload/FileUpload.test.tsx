import '@testing-library/jest-dom'
import { render, fireEvent,screen, waitFor } from "@testing-library/react";
import FileUpload from "./FileUpload";
import React from 'react';
import axios from 'axios'; 


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
Object.defineProperty(global, 'FileReader', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    readAsDataURL: jest.fn(),
    onLoad: jest.fn()
  })),
})

describe("FileUpload", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders without errors", () => {
    render(<FileUpload label="Upload Files" />);
    expect(screen.getByText("Upload Files")).toBeInTheDocument();
    expect(screen.getByLabelText(/upload files/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: /upload/i
    })).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name: /preview/i
    })).toBeInTheDocument();
    expect(screen.getByText(/no selcted file/i)).toBeInTheDocument();
  });

  test("handles file selection and upload", async () => {
    const uploadUrl = "http://localhost:3000/uploadFiles";
    const uploadResponse = { data: "Upload successful" };
    mockedAxios.post.mockResolvedValueOnce(uploadResponse);

    const { getByLabelText, getByText } = render(
      <FileUpload label="Upload Files" />
    );

    // Mock file selection
    const file = new File(["dummy content"], "test.jpg", { type: "image/jpeg" });
    const fileInput = getByLabelText("Upload Files");
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit the form
    fireEvent.submit(getByText("Upload"));

    // Verify the upload request is made with the correct data
    expect(axios.post).toHaveBeenCalledWith(uploadUrl, expect.any(FormData), {
      headers: {
        "content-type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      onUploadProgress: expect.any(Function),
    });

    // Simulate upload progress
    const uploadProgress = 50;
    const progressEvent = {
      loaded: uploadProgress,
      total: 100,
    };
    mockedAxios.post.mock.calls[0][2].onUploadProgress(progressEvent);

    // Wait for the upload response
    await expect(mockedAxios.post).toHaveBeenLastCalledWith(uploadUrl, expect.any(FormData), expect.any(Object));
  });
  test("handles file selection and upload failure", async () => {
    const uploadUrl = "http://localhost:3000/uploadFiles";
    const uploadResponse = { message: "Network Error" };
    mockedAxios.post.mockRejectedValue(uploadResponse);

    const { getByLabelText, getByText } = render(
      <FileUpload label="Upload Files" />
    );

    // Mock file selection
    const file = new File(["dummy content"], "test.jpg", { type: "image/jpeg" });
    const fileInput = getByLabelText("Upload Files");
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit the form
    fireEvent.submit(getByText("Upload"));

    // Verify the upload request is made with the correct data
    expect(axios.post).toHaveBeenCalledWith(uploadUrl, expect.any(FormData), {
      headers: {
        "content-type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      onUploadProgress: expect.any(Function),
    });

    // Simulate upload progress
    const uploadProgress = 50;
    const progressEvent = {
      loaded: uploadProgress,
      total: 100,
    };
    mockedAxios.post.mock.calls[0][2].onUploadProgress(progressEvent);

    // Wait for the upload response
    await expect(mockedAxios.post).toHaveBeenLastCalledWith(uploadUrl, expect.any(FormData), expect.any(Object));

    await waitFor(()=>{
      expect(screen.getByText("Error uploading file:Network Error")).toBeInTheDocument();
    });
  });
  test("handles file selection and preview img", async ()=>{
    const { getByLabelText } = render(
      <FileUpload label="Upload Files" />
    );

    // Mock file selection
    const file = new File(["dummy content"], "test.jpg", { type: "image/jpeg" });
    const fileInput = getByLabelText("Upload Files");
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText("test.jpg")).toBeInTheDocument();

    await fireEvent.click(screen.getByText("test.jpg"));

    await waitFor(()=>{
      expect(FileReader).toHaveBeenCalled();
    });
  });
  test("handles file selection and preview video", async ()=>{
    const { getByLabelText } = render(
      <FileUpload label="Upload Files" />
    );

    // Mock file selection
    const file = new File(["dummy content"], "test.mp4", { type: "video/mp4" });
    const fileInput = getByLabelText("Upload Files");
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText("test.mp4")).toBeInTheDocument();

    await fireEvent.click(screen.getByText("test.mp4"));

    await waitFor(()=>{
      expect(FileReader).toHaveBeenCalled();
    });
  });
});