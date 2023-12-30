import { Button } from "@mui/material";
import React from "react";
import useAll from "../hooks/utilities/useAll";

function Unauthorized() {
  const { logout, user } = useAll();
  return (
    <div>
      <Button onClick={logout}>logout</Button>
    </div>
  );
}

export default Unauthorized;
