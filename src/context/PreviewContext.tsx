import { createContext, useContext, useState, type ReactNode } from 'react';

const PreviewContext = createContext<{
  previewMode: boolean;
  setPreviewMode: (val: boolean) => void;
}>({
  previewMode: false,
  setPreviewMode: () => {},
});

export const PreviewProvider = ({ children }: { children: ReactNode }) => {
  const [previewMode, setPreviewMode] = useState(false);
  return (
    <PreviewContext.Provider value={{ previewMode, setPreviewMode }}>
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => useContext(PreviewContext);
