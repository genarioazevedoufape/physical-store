import axios from 'axios';
import { ViaCepResponse } from '../types';

export async function fetchAddressFromCep(cep: string): Promise<ViaCepResponse> {
  try {
    const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (response.data.erro) {
      throw new Error('CEP inválido ou não encontrado');
    }

    return response.data;
  } catch (error) {
    throw new Error(`Erro ao buscar endereço: ${error.message}`);
  }
}
