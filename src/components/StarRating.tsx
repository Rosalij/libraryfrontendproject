import React, { useState } from "react";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  editable?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onChange,
  editable = false,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayRating = hovered !== null ? hovered : rating;

  return (
    <div
      style={{
        fontSize: "1.6rem",
        display: "inline-flex",
        gap: "4px",
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => editable && onChange?.(star)}
          onMouseEnter={() => editable && setHovered(star)}
          onMouseLeave={() => editable && setHovered(null)}
          style={{
            cursor: editable ? "pointer" : "default",
            color: star <= displayRating ? "#f5a623" : "#c7c7c7",
    
            transition: "color 0.2s ease, transform 0.1s ease",
            transform:
              editable && hovered === star ? "scale(1.15)" : "scale(1)",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
