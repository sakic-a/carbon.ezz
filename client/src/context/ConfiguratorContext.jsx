import { createContext, useContext, useReducer } from 'react';

const initialState = {
  wheelShape: 'factory',
  topMaterial: 'smooth',
  sideMaterial: 'smooth',
  bottomMaterial: 'smooth',
  ringEnabled: false,
  ringColour: 'red',  
  threadColour: 'factory',
};

function configuratorReducer(state, action) {
  switch (action.type) {
    case 'SET_WHEEL_SHAPE':
      return { ...state, wheelShape: action.value };
    case 'SET_TOP':
      return { ...state, topMaterial: action.value };
    case 'SET_SIDE':
      return { ...state, sideMaterial: action.value };
    case 'SET_BOTTOM':
      return { ...state, bottomMaterial: action.value };
    case 'SET_RING':
      return { ...state, ringEnabled: action.value };
    case 'SET_RING_COLOUR':                              
      return { ...state, ringColour: action.value };
    case 'SET_THREAD':
      return { ...state, threadColour: action.value };
    default:
      return state;
  }
}

const ConfiguratorContext = createContext(null);

export function ConfiguratorProvider({ children }) {
  const [state, dispatch] = useReducer(configuratorReducer, initialState);
  return (
    <ConfiguratorContext.Provider value={{ state, dispatch }}>
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator() {
  return useContext(ConfiguratorContext);
}