import { useSelector, useStore, useDispatch } from "react-redux";

export const useAppDispatch = () => useDispatch.withTypes();
export const useAppSelector = useSelector.withTypes();
export const useAppStore = () => useStore.withTypes();
