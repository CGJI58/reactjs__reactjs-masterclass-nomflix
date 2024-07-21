import { useLocation } from "react-router-dom";
import { getSearch } from "../api";

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  if (keyword !== null) {
    const result = getSearch(keyword);
    console.log(result);
  }
  return null;
}

export default Search;
