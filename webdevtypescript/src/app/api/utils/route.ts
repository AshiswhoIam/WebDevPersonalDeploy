//Base URL for your Hugging Face Space 
const POKEMON_API_URL = process.env.NEXT_PUBLIC_HF_SPACE_URL

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

//Health check response interface
export interface HealthCheckResponse {
  status: string;
  model_loaded: boolean;
  classes_loaded: boolean;
  total_classes: number;
}

//Helper function to get headers for Hugging Face API calls
const getHeaders = () => {
  const headers: Record<string, string> = {};
  
  //Add Hugging Face token if available for private spaces
  const hfToken = process.env.NEXT_PUBLIC_HF_TOKEN;
  if (hfToken) {
    headers['Authorization'] = `Bearer ${hfToken}`;
  }
  
  return headers;
};

//Sends image file to the FastAPI backend for prediction.
//Returns the predicted Pokémon and additional info.
export const predictPokemon = async (file: File): Promise<PokemonPredictionResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${POKEMON_API_URL}/predict`, {
      method: 'POST',
      body: formData,
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Prediction failed';
      
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.detail || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(`API Error (${response.status}): ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error('Prediction error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to Pokemon API. Please check if the service is running.');
    }
    
    throw error;
  }
};

//Checks the health status of FastAPI backend.
//Check if model is loaded and ready.
export const checkApiHealth = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await fetch(`${POKEMON_API_URL}/health`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Health check error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to Pokemon API service');
    }
    
    throw error;
  }
};

//Get available Pokemon classes
export const getPokemonClasses = async (): Promise<{ classes_by_row: string[], total_classes: number }> => {
  try {
    const response = await fetch(`${POKEMON_API_URL}/classes`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get classes: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Get classes error:', error);
    throw error;
  }
};

//Debug function to check API status (useful for development)
export const debugApi = async () => {
  try {
    const response = await fetch(`${POKEMON_API_URL}/debug`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Debug failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Debug error:', error);
    throw error;
  }
};