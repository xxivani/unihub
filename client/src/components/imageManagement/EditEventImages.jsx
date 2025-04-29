import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './EditEventImages.css';

const ImageEEvents = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const image_id = queryParams.get("id");
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const [settings, setSettings] = useState({
    brightness: 100,
    saturation: 100,
    blur: 0,
    inversion: 0,
  });

  const updateSetting = (key, value) => {
    if (!image) return;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const saveUpdate = async () => {
    try {
      const { brightness, saturation, blur, inversion } = settings;
      const response = await fetch(`${API_URL}/image-management/${image_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          brightness: brightness,
          saturation: saturation,
          blur: blur,
          inversion: inversion,
        })
      });
      if (!response.ok) {
        throw new Error('Failed to save update');
        }
    } catch (error) {
      console.error('Error saving updates:', error);
    }
  }

  const generateFilter = () => {
    const { brightness, saturation, blur, inversion } = settings;
    return `brightness(${brightness}%) saturate(${saturation}%) blur(${blur}px) invert(${inversion}%)`;
  };

  const renderImage = () => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");
    if (!image || !canvasCtx) return;

    canvas.width = image.width;
    canvas.height = image.height;
    canvasCtx.filter = generateFilter();
    canvasCtx.drawImage(image, 0, 0);
  };

  const hasRun = useRef(false);

  const fetchImage = async () => {
    try {
      const response = await fetch(`${API_URL}/image-management/${image_id}`);
      if (!response.ok) {
      throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      const newImage = new Image();
      newImage.onload = () => {
        setImage(newImage);
      };
      newImage.src = `${API_URL}${data.URL}`;
      setSettings({
        brightness: data.brightness,
        saturation: data.saturation,
        blur: data.blur,
        inversion: data.inversion,
      })
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    renderImage();
    if (hasRun.current) return;
    hasRun.current = true;
    fetchImage();
  }, [settings, image]);

  return (
    <div className="imageE-main-container">
      <div className="imageE-header">
        <h1></h1>
        <button
          className="imageE-go-back-button"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>

      <div className="imageE-container">
        <div className="imageE-card">
          <div className="imageE-editor">
            <div className="imageE-toolbar">
              <div className="imageE-toolbar-item">
              </div>
              <div className="imageE-toolbar-item">
                <label className="imageE-tool-label" htmlFor="brightness">
                  Brightness
                </label>
                <input
                  className="imageE-tool-input"
                  type="range"
                  id="brightness"
                  min="0"
                  max="200"
                  value={settings.brightness}
                  onChange={(e) => updateSetting("brightness", e.target.value)}
                />
              </div>
              <div className="imageE-toolbar-item">
                <label className="imageE-tool-label" htmlFor="saturation">
                  Saturation
                </label>
                <input
                  className="imageE-tool-input"
                  type="range"
                  id="saturation"
                  min="0"
                  max="200"
                  value={settings.saturation}
                  onChange={(e) => updateSetting("saturation", e.target.value)}
                />
              </div>
              <div className="imageE-toolbar-item">
                <label className="imageE-tool-label" htmlFor="blur">
                  Blur
                </label>
                <input
                  className="imageE-tool-input"
                  type="range"
                  id="blur"
                  min="0"
                  max="25"
                  value={settings.blur}
                  onChange={(e) => updateSetting("blur", e.target.value)}
                />
              </div>
              <div className="imageE-toolbar-item">
                <label className="imageE-tool-label" htmlFor="inversion">
                  Inversion
                </label>
                <input
                  className="imageE-tool-input"
                  type="range"
                  id="inversion"
                  min="0"
                  max="100"
                  value={settings.inversion}
                  onChange={(e) => updateSetting("inversion", e.target.value)}
                />
              </div>
            </div>
            <div className="imageE-image-area">
              <canvas id="canvas" ref={canvasRef}></canvas>
            </div>
          </div>
        </div>

        <button onClick={(e) => saveUpdate()} className="imageE-update-button">
          Update
        </button>
      </div>
    </div>
  );
};

export default ImageEEvents;