import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const main = document.querySelector(".fash-main");

    if (main) {
      main.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }
  }, [pathname]);

  return null;
}