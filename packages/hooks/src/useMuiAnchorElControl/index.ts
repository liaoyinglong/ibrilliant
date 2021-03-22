import type React from "react";
import { useMemo, useState } from "react";

export function useMuiAnchorElControl() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const action = useMemo(() => {
    const handleOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };
    return {
      handleOpen,
      handleClose,
    };
  }, []);

  return useMemo(() => {
    return {
      open: Boolean(anchorEl),
      anchorEl,
      action,
    };
  }, [action, anchorEl]);
}
