import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { WebAssemblyWrapper, WebAssemblyBinary } from './wasm';
import LoadImage from "./LoadImage";

function App() {
  const applyFilter = (array: Array<number>, kernelArray: Array<number>) => {
    WebAssemblyWrapper({
      locateFile: () => {
        return WebAssemblyBinary;
      }
    })
    .then((core) => {
      // console.log(core);
      const kernelSize = Math.sqrt(kernelArray.length);
      const kernel = core.matFromArray(kernelSize, kernelSize, core.CV_32F, [...kernelArray]);

      const res = new core.Mat();
      const anchor = new core.Point(-1, -1);

      const size = Math.sqrt(array.length);
      let mat = core.matFromArray(size, size, core.CV_8U, [...array]);

      core.filter2D(mat, res, core.CV_8U, kernel, anchor, 0, core.BORDER_DEFAULT);

      console.log(res.data);

      // Delete objects
      kernel.delete();
      res.delete();
      mat.delete();
    })
  }

  // useEffect(() => {
  //   const array = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
  //   const kernelArray = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  //   applyFilter(array, kernelArray);
  // })

  return (
    <div className="App">
      <LoadImage />
    </div>
  );
}

export default App;
