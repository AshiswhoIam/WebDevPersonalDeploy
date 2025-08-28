import { useState, useCallback } from 'react';
import { predictPokemon, PokemonPredictionResponse } from '../utils/route';

//Define the shape of the internal state for the prediction hook
interface UsePokemonPredictionState {
  prediction: PokemonPredictionResponse | null;
  loading: boolean;
  error: string | null;
}

//Custom hook to handle Pokémon prediction logic
export const usePokemonPrediction = () => {
  //Local state managed via React's useState hook
  const [state, setState] = useState<UsePokemonPredictionState>({
    prediction: null,
    loading: false,
    error: null,
  });

  //Predict function that sends the file to the backend and handles response
  const predict = useCallback(async (file: File) => {
    //Set loading to true before making the API call
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await predictPokemon(file);
      setState(prev => ({ ...prev, prediction: result, loading: false }));
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Prediction failed';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw err;
    }
  }, []);

  //Reset function for clearing prediction and error states
  const reset = useCallback(() => {
    setState({
      prediction: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    predict,
    reset,
  };
};