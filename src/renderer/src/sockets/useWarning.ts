import {
    fromEventPattern
  } from 'rxjs';
  import { io } from './socketConnect';

const warningId$ = fromEventPattern(
    (next) => {
        io.on("car-error-info", next);
        return next;
    },
    (next) => { 
        io.off("car-error-info", next);
    }
);

// export const useWarningId = () => {
//     const [warningList, setWarningList] = useState<>
// }

