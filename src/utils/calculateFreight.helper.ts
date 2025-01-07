import axios from 'axios';

interface FreightRequest {
  cepDestino: string;
  cepOrigem: string;
  comprimento: number;
  largura: number;
  altura: number;
}

interface FreightOption {
  prazo: string;
  codProdutoAgencia: string; 
  precoAgencia: string; 
  urlTitulo: string; 
}

export async function calcularFrete(freightRequest: FreightRequest): Promise<FreightOption[]> {
  const url = 'https://www.correios.com.br/@@precosEPrazosView';

  const data = {
    cepDestino: freightRequest.cepDestino,
    cepOrigem: freightRequest.cepOrigem,
    comprimento: freightRequest.comprimento.toString(),
    largura: freightRequest.largura.toString(),
    altura: freightRequest.altura.toString(),
  };

  console.log('Calculando frete com os Correios:', data);

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  };

  try {
    const response = await axios.request(config);
    console.log('Resposta da API dos Correios:', response.data);

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Resposta da API dos Correios inválida ou inesperada');
    }

    return response.data.map((option: any) => ({
      prazo: option.prazo,
      codProdutoAgencia: option.codProdutoAgencia,
      precoAgencia: option.precoAgencia,
      urlTitulo: option.urlTitulo,
    }));
  } catch (error: any) {
    console.error('Erro ao calcular frete:', error.message);
    throw new Error(`Erro ao calcular frete: ${error.message}`);
  }
}
