import { Theme, ToastPosition, toast } from "react-toastify";
import { ToastStatus } from "./resources";
import {debounce} from "lodash"
const showToast = debounce((status: ToastStatus, message: string) => {
  const toastConfig = {
    position: 'top-right' as ToastPosition,
    autoClose: 1200,
    theme: 'dark' as Theme,
  };

  switch (status) {
    case ToastStatus.SUCCESS:
      toast.success(message, toastConfig);
      break;
    case ToastStatus.WARNING:
      toast.warning(message, toastConfig);
          break;
    case ToastStatus.ERROR:
      toast.error(message, toastConfig);
      break;
    default:
      break;
  }
},1000)
export default showToast;