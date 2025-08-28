// utils/pokemonApi.ts

//Setting the base URL for the Pokémon prediction API need to maybe get custom later.
const POKEMON_API_URL = process.env.NEXT_PUBLIC_POKEMON_API_URL || 'http://localhost:8000';

//Interface defining the structure of detailed Pokémon information.
export interface PokemonInfo {
  name: string;
  types: string;
  height: string;
  weight: string;
  sprite_url: string;
  habitat: string;
  flavor_text: string;
}

//Interface defining the expected response after prediction.
export interface PokemonPredictionResponse {
  predicted_pokemon: string;
  confidence: number;
  pokemon_info: PokemonInfo | null;
}


//Sends image file to the FastAPI backend for prediction.
//Returns the predicted Pokémon and additional info.
export const predictPokemon = async (file: File): Promise<PokemonPredictionResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${POKEMON_API_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Prediction failed');
    }

    return response.json();
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
};

//Checks the health status of FastAPI backend.
//Check if model is loaded and ready.
export const checkApiHealth = async (): Promise<{ status: string; model_loaded: boolean }> => {
  try {
    const response = await fetch(`${POKEMON_API_URL}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};