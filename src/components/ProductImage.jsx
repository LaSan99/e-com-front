import { useState } from "react";

const BACKEND_URL = "https://e-com-back-seven.vercel.app/";

const ProductImage = ({
  src,
  alt,
  className = "",
  aspectRatio = "aspect-square",
  objectFit = "object-cover",
  enableZoom = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const imageUrl = src?.startsWith("http") ? src : `${BACKEND_URL}${src}`;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleZoomToggle = () => {
    if (enableZoom) {
      setIsZoomed(!isZoomed);
    }
  };

  return (
    <div className={`relative ${aspectRatio} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
      )}
      {hasError ? (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={alt}
          className={`w-full h-full ${objectFit} rounded-lg transition-transform duration-300 ${
            isZoomed
              ? "scale-150 cursor-zoom-out"
              : enableZoom
              ? "cursor-zoom-in"
              : ""
          }`}
          onLoad={handleLoad}
          onError={handleError}
          onClick={handleZoomToggle}
        />
      )}
    </div>
  );
};

export default ProductImage;
