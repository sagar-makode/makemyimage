import React, { useState, createRef } from "react";
import Cropper from "react-cropper";
import { Modal } from 'react-bootstrap';


import "cropperjs/dist/cropper.css";





function Imagecomp() {
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("");
  const [zoomValue, setZoomValue] = useState(0);
  const [rotateValue, setRotateValue] = useState("50%");
  const [showModal, setShowModal] = useState(false);


  const handleClose = () => setShowModal(false);



  const cropperRef = createRef();
  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {

      setImage(reader.result);
    };
    if (files && files[0]) {
      reader.readAsDataURL(files[0]);
      setShowModal(true);
    }

  };




  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
    }
    setShowModal(false)
  };
  const handleZoom = (event) => {
    const value = event.target.value;
    setZoomValue(value);
    if (typeof cropperRef.current?.cropper !== "undefined") {
      cropperRef.current.cropper.zoomTo(value / 100);
    }
  };
  const handleRotate = (event) => {
    const value = event.target.value;
    setRotateValue(value);
    if (typeof cropperRef.current?.cropper !== "undefined") {
      cropperRef.current.cropper.rotateTo(value);
    }
  };


  const modifyImage = async (imageData) => {

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    const newWidth = 500;
    const newHeight = 300;
    image.src = imageData;
    canvas.width = newWidth;
    canvas.height = newHeight;
    await new Promise((resolve) => { // wait htmlFor image to load before drawing to canvas
      image.onload = () => resolve();
    });

    context.drawImage(image, 0, 0, newWidth, newHeight);

    const modifiedImageData = canvas.toDataURL('image/jpeg');
    return modifiedImageData;



  };


  const handleDownload = async () => {
    
    const modifiedImageData = await modifyImage(cropData);
    const link = document.createElement("a");
    link.download = "modified-image.jpg";
    link.href = modifiedImageData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.location.reload();
  };


  return (
    <>
      
      <div className="container-xxl py-5 bg-primary hero-header">
                <div className="container my-5 py-5 px-lg-5">
                    <div className="row g-5 py-5">
                        <div className="col-12 text-center">
                            <h1 className="text-white animated slideInDown">Edit Your Image Here</h1>
                            <hr className="bg-white mx-auto mt-0" style={{width: "90px"}}/>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-4  col-lg-6 col-md-6 col-sm-6 col-xs-6" >
        <div >
          <h2>Upload File</h2>
          <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-6 ">
            <label htmlFor="formFile" className="form-label">Photo</label>
            <input className="form-control" type="file" onChange={onChange} id="formFile" />
          </div>
        </div>


        <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false} >
          <Modal.Header closeButton>
            <Modal.Title>First Crop Your Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className=" container ">
              <Cropper
                ref={cropperRef}
                style={{ height: "100%", width: "100%" }}
                className="my-3"
                zoomTo={0.1}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                guides={true}
                zoomable={true}
                zoomOnWheel={false}
                zoomOnTouch={false}
                wheelZoomRatio={1}
                center={true}
              />

            </div>
            <div className="d-flex">
              <div style={{ flex: 1 }}>
                <label>Zoom:</label>
                <div>
                  <input
                    type="range"
                    // className="form-range"
                    min="0"
                    max="200"
                    value={zoomValue}
                    onChange={handleZoom}
                  />
                </div>
              </div>
              <div >
                <label>Rotate:</label>
                <div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotateValue}
                    onChange={handleRotate}

                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center mt-3">
              <button className="btn btn-primary" onClick={getCropData}>
                Crop Image
              </button>
            </div>
          </Modal.Body>
        </Modal>
        <div className="text-center">

          {cropData && (
            <div className="my-3">
              <h4>Your Croped Image</h4>

              <img className="container col-lg-12 col-md-12 col-sm-12 col-xs-6" style={{ maxWidth: '500px', maxHeight: '400px' }} src={cropData} alt="Croped Data" />

              <div className="d-flex justify-content-center mt-3">
              <button className="btn btn-primary" onClick={handleDownload}>
                Download Image
              </button>
            </div>
            </div>
            
            
          )}
          

        </div>
        


      </div>




    </>


  )
}

export default Imagecomp