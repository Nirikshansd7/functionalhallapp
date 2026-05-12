import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { Check, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const ImageCropper = ({ imageSrc, onCropComplete, onCancel, aspect = 1, cropShape = 'round' }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropComplete(croppedImageBase64);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="cropper-modal" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="cropper-container" style={{ position: 'relative', width: '90%', maxWidth: '500px', height: '60vh', backgroundColor: '#333', borderRadius: '1rem', overflow: 'hidden' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          cropShape={cropShape}
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
        />
      </div>
      
      <div className="cropper-controls" style={{ display: 'flex', gap: '15px', marginTop: '20px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '1rem', backdropFilter: 'blur(10px)', alignItems: 'center' }}>
        <button onClick={() => setZoom(z => Math.max(1, z - 0.2))} className="icon-btn" title="Zoom Out" style={{ color: 'white' }}><ZoomOut /></button>
        <input 
          type="range" 
          value={zoom} 
          min={1} 
          max={3} 
          step={0.1} 
          aria-labelledby="Zoom" 
          onChange={(e) => setZoom(Number(e.target.value))} 
        />
        <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="icon-btn" title="Zoom In" style={{ color: 'white' }}><ZoomIn /></button>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 10px' }}></div>
        <button onClick={() => setRotation(r => r + 90)} className="icon-btn" title="Rotate" style={{ color: 'white' }}><RotateCw /></button>
      </div>

      <div className="cropper-actions" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <button className="glass-button secondary" onClick={onCancel} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <X size={18} /> Cancel
        </button>
        <button className="glass-button primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> Apply Crop
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
