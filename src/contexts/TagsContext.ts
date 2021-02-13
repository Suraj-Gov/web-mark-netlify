import { createContext, Dispatch, SetStateAction } from "react";
type tagContextState = {
  tagsContext: string[];
  setTagsContext: Dispatch<SetStateAction<string[]>>;
};

// @ts-ignore
const TagsContext = createContext<tagContextState>(null);

export default TagsContext;
