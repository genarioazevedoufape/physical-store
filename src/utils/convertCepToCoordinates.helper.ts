import axios from 'axios';
import { Coordinates } from '../types/coordinates.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GeocodeResponse {
  status: string;
  result: { geometry: { location: { lat: number; lng: number } } }[]; 
}

@Injectable()
export class AddressService {
  constructor(private configService: ConfigService) {}

  async convertCepToCoordinates(cep: string): Promise<Coordinates> {
    const apiKey = this.configService.get<string>('DISTANCEMATRIX_API_KEY');
    
    if (!apiKey) {
      throw new Error('Chave de API do DistanceMatrix.ai não configurada');
    }

    try {
      const sanitizedCep = cep.replace(/[^0-9]/g, ''); 
      const response = await axios.get<GeocodeResponse>(this.configService.get<string>('DISTANCEMATRIX_BASE_URL'), {
        params: {
          address: sanitizedCep,
          key: apiKey,
        },
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Erro ao buscar coordenadas: ${response.data.status}`);
      }

      if (!response.data.result || response.data.result.length === 0) {
        throw new Error('Nenhum resultado encontrado para o CEP fornecido');
      }

      const location = response.data.result[0]?.geometry?.location;
      if (!location) {
        throw new Error('Nenhuma coordenada encontrada na estrutura da resposta');
      }

      return {
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao converter CEP em coordenadas: ${error.message}`);
      } else {
        throw new Error('Erro desconhecido ao converter o CEP');
      }
    }
  }
}
