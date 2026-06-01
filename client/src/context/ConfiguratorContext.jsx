import { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  selectedModel: null,
  wheelShape: 'factory',
  topMaterial: 'smooth',
  sideMaterial: 'smooth',
  bottomMaterial: 'smooth',
  ringEnabled: false,
  ringColour: 'red',  
  threadColour: 'black',
};

function configuratorReducer(state, action) {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, selectedModel: action.value };
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
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const ConfiguratorContext = createContext(null);

const init = (initial) => {
  try {
    const saved = localStorage.getItem('configurator_state');
    return saved ? JSON.parse(saved) : initial;
  } catch (err) {
    console.error("Failed to parse configurator state", err);
    return initial;
  }
};

export function ConfiguratorProvider({ children }) {
  const [state, dispatch] = useReducer(configuratorReducer, initialState, init);

  useEffect(() => {
    localStorage.setItem('configurator_state', JSON.stringify(state));
  }, [state]);

  return (
    <ConfiguratorContext.Provider value={{ state, dispatch }}>
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator() {
  return useContext(ConfiguratorContext);
}