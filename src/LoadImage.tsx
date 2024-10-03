import React from "react";
import {
    useEffect,
    useRef,
    useState
} from "react";
import "./loadimagestyle.css";
import { WebAssemblyWrapper, WebAssemblyBinary } from './wasm';

function LoadImage() {
    const [imgUrl, setImgUrl] = useState<any>()
    const imgRef = useRef<any>();
    const imgRef2 = useRef<any>();
    const imgRef3 = useRef<any>();
    const imgRef4 = useRef<any>();

    useEffect(() => {
        if (imgUrl) {
            console.log(imgUrl);
        }
        // Cleanup function
        return () => {
            imgUrl && URL.revokeObjectURL(imgUrl.preview);
        }
    }, [imgUrl]);

    const handleChange = (e: any) => {
        if (e.target.files[0]) {
            setImgUrl(URL.createObjectURL(e.target.files[0]));
        }
    }

    const loadImage = (imgSrc: any) => {
        WebAssemblyWrapper({
            locateFile: () => {
              return WebAssemblyBinary;
            }
          })
        .then((core) => {
            const img = core.imread(imgSrc);

            // to gray scale
            const imgGray = new core.Mat();
            core.cvtColor(img, imgGray, core.COLOR_BGR2GRAY);
            // core.imshow(grayImgRef.current, imgGray);

            // Sharpen filter
            let kernel = core.matFromArray(3, 3, core.CV_32F, [0, -1, 0, -1, 5, -1, 0, -1, 0]);
            const res = new core.Mat();
            const anchor = new core.Point(-1, -1);
            core.filter2D(imgGray, res, core.CV_8U, kernel, anchor, 0, core.BORDER_DEFAULT);
            core.imshow(imgRef.current, res);

            // Blur filter
            let kernel2 = core.matFromArray(3, 3, core.CV_32F, [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9]);
            const res2 = new core.Mat();
            const anchor2 = new core.Point(-1, -1);
            core.filter2D(imgGray, res2, core.CV_8U, kernel2, anchor2, 0, core.BORDER_DEFAULT);
            core.imshow(imgRef2.current, res2);

            // Emboss filter
            let kernel3 = core.matFromArray(3, 3, core.CV_32F, [-2, -1, 0, -1, 1, 1, 0, 1, 2]);
            const res3 = new core.Mat();
            const anchor3 = new core.Point(-1, -1);
            core.filter2D(imgGray, res3, core.CV_8U, kernel3, anchor3, 0, core.BORDER_DEFAULT);
            core.imshow(imgRef3.current, res3);

            // Edges filter
            let kernel4 = core.matFromArray(3, 3, core.CV_32F, [0, 1, 0, 1, -4, 1, 0, 1, 0]);
            const res4 = new core.Mat();
            const anchor4 = new core.Point(-1, -1);
            core.filter2D(imgGray, res4, core.CV_8U, kernel4, anchor4, 0, core.BORDER_DEFAULT);
            core.imshow(imgRef4.current, res4);

            // need to release them manually
            img.delete();
            imgGray.delete();
            res.delete();
            res2.delete();
            res3.delete();
            res4.delete();
        })
    }

    return (
        <div>
            <div style={{ marginTop: "30px" }}>
                <span style={{ marginRight: "10px" }}>Select an image file:</span>
                <input
                    name="file"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                />
            </div>

            {imgUrl && (
                <div className="images-container">
                    <div className="image-card">
                        <div style={{ margin: "10px" }}>↓↓↓ Original Image ↓↓↓</div>
                        <img
                            alt="Original input"
                            src={imgUrl}
                            onLoad={(e) => {
                                loadImage(e.target);
                            }}
                        />
                    </div>

                    <div className="image-card">
                        <div style={{ margin: "10px" }}>↓↓↓ Sharpen ↓↓↓</div>
                        <canvas ref={imgRef} />
                    </div>

                    <div className="image-card">
                        <div style={{ margin: "10px" }}>↓↓↓ Blur ↓↓↓</div>
                        <canvas ref={imgRef2} />
                    </div>

                    <div className="image-card">
                        <div style={{ margin: "10px" }}>↓↓↓ Emboss ↓↓↓</div>
                        <canvas ref={imgRef3} />
                    </div>

                    <div className="image-card">
                        <div style={{ margin: "10px" }}>↓↓↓ Edges ↓↓↓</div>
                        <canvas ref={imgRef4} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoadImage;
