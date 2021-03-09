import React, {
  useState,
  createContext,
  useCallback,
  ReactNode,
  useRef,
  useEffect,
} from 'react';
import {RNCamera} from 'react-native-camera';

const initialCamera = {
  ref: null,
  visible: false,
};

interface Props {
  children: ReactNode;
}

export const CameraContext = createContext({
  showCamera: ({}) => {},
  camera: initialCamera,
  pictures: {},
  hide: () => {},
  setRef: ({}) => {},
  takePic: ({}) => {},
  clearPics: ({}) => {},
});

const CameraProvider: React.FC<Props> = ({children}) => {
  const [camera, setCamera] = useState(initialCamera);
  const [pictures, setPictures] = useState({});
  const [cacheKey, setCacheKey] = useState("")
  let ref = useRef<any>().current;
  const timeout = useRef<any>(null);

  const showCamera = useCallback(
    (args) => {
      setCacheKey(args.key);
      setCamera({...initialCamera, visible: true});
    },
    [camera],
  );

  const hide = useCallback(() => {
    setCamera({...camera, visible: false});
    setCacheKey("");
  }, [camera]);

  const setRef = useCallback(
    (args) => {
      setCamera({...camera, ...args});
    },
    [camera],
  );

  const takePic = useCallback((pic) => {
    let picObject = {[cacheKey]: pic};
    setPictures({...pictures, ...{[cacheKey]: pic}});
  }, [camera])

  const clearPics = useCallback(() => {
    setPictures({});
  }, [camera]);

  return (
    <CameraContext.Provider
      value={{
        hide,
        showCamera,
        setRef,
        takePic,
        clearPics,
        camera,
        pictures
      }}>
      {children}
    </CameraContext.Provider>
  );
};

export default CameraProvider;
