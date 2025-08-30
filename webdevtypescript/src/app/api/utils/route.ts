//all API calls go through Next.js API routes instead of direct calls

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

//Sends image file to the Next.js API route for prediction.
//Returns the predicted Pokémon and additional info.
export const predictPokemon = async (file: File): Promise<PokemonPredictionResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/predict', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Prediction failed';
      
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error || errorMessage;
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

//Checks the health status of FastAPI backend through Next.js API route.
export const checkApiHealth = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await fetch('/api/health', {
      method: 'GET',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Health check failed';
      
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(`Health check failed (${response.status}): ${errorMessage}`);
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

//Get available Pokemon classes through Next.js API route
export const getPokemonClasses = async (): Promise<{ classes_by_row: string[], total_classes: number }> => {
  try {
    const response = await fetch('/api/classes', {
      method: 'GET',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to get classes';
      
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(`Failed to get classes (${response.status}): ${errorMessage}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Get classes error:', error);
    throw error;
  }
};

//Debug function to check API status through Next.js API route
export const debugApi = async () => {
  try {
    const response = await fetch('/api/debug', {
      method: 'GET',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Debug failed';
      
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(`Debug failed (${response.status}): ${errorMessage}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Debug error:', error);
    throw error;
  }
};