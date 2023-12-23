import { useState, useEffect } from "react";
import chroma from "chroma-js";

export const useColorScheme = () => {
  const [colorScale, setColorScale] = useState([]);

  useEffect(() => {
    const scale = chroma.scale(["#000066", "#0000FF"]).mode("lch").colors(10);
    setColorScale(scale);
  }, []);

  return colorScale;
};
